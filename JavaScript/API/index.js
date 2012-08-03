var Core = require('Core');
var Events = Core.Events;
var Request = Core.Request;

var Request = require('Request');

var Base64 = require('Utility/Base64');
var LocalStorage = require('Utility/LocalStorage');

var Queue = require('Queue').Queue;

var urls = {};
var cache = {};
var errorFn;

var setCache = function(type, data, lifetime) {
  cache[type] = {
    data: data,
    expires: (lifetime == -1 ? null : Date.now() + (lifetime || 600) * 1000)
  };
};

var getCache = function(type) {
  var c = cache[type];
  if (!c) return null;
  if (c.expires && Date.now() > c.expires) {
    delete cache[type];
    return null;
  }

  return c.data;
};

var API = module.exports = {

  on: function(url, options) {
    var object = urls[url];
    if (!object) {
      object = urls[url] = new Events;
      object.call = API.call.bind(API, url);
      object.getLifetime = function() {
        return object.options && object.options.lifetime;
      };
    }
    if (options) object.options = options;
    return object;
  }

};

var listenersFor = function(url) {
  return {on: function(events) {
    var api = API.on(url);
    if (events.success) api.addEvent('success:once', events.success);
    if (events.error) api.addEvent('error:once', events.error);
  }};
};

var fire = function(url, event, data) {
  API.on(url).fireEvent(event, [data])
    .removeEvents('success:once')
    .removeEvents('error:once');
};

var getURL = function(url) {
  return window.__API_DOMAIN + 'api/' + url + '.json';
};

var formatGetURL = function(url, data) {
  if (!data) return url;
  return url + (url.contains('?') ? '&' : '?') + data;
};

var getAuthorization = function() {
  var user = LocalStorage.get('User');
  return (user ? 'OAuth ' + user.access_token : '');
};

API.call = function(url, method, requestData) {
  if (typeof requestData != 'string') requestData = Object.toQueryString(requestData);

  method = (method || 'get').toLowerCase();
  if (method == 'get') {
    var data = getCache(formatGetURL(url, requestData));
    if (data) {
      // Must be async
      (function() {
        API.on(url).fireEvent('success', [data]);
      }).delay(1);
      return listenersFor(url);
    }
  }

  new Request.JSON({

    url: getURL(url),
    method: method,
    headers: {
      'Authorization': getAuthorization(),
      'Content-Type': 'application/json'
    },

    onFailure: function(data) {
      // Delete requests don't return anything
      if (method == 'delete') {
        fire(url, 'success', null);
        return;
      }

      if (__DEV__) console.log(data);
      if (errorFn) errorFn(data);
      fire(url, 'error', data);
    },

    onSuccess: function(data) {
      if (data && data.status_code != 200) {
        this.failure();
        return;
      }

      var options = API.on(url).options;
      if (options && options.formatter) data = options.formatter(data);

      if (method == 'get') setCache(formatGetURL(url, requestData), data, options && options.lifetime);
      fire(url, 'success', data);
    }

  }).send(requestData);

  return listenersFor(url);
};

var queue = new Queue;

API.upload = function(url, file, field) {
  var success = function(response) {
    fire(url, 'success', response);
    if (__DEV__) console.log('Code = ' + response.responseCode);
    if (__DEV__) console.log('Response = ' + response.response);
    if (__DEV__) console.log('Sent = ' + response.bytesSent);
  };

  var error = function(error) {
    fire(url, 'error', error);
    if (__DEV__) console.log(error.code);
  };

  var options = new window.FileUploadOptions();
  options.fileKey = field;
  options.fileName = file.name;
  options.mimeType = file.type;
  options.params = {
    headers: {
      Authorization: getAuthorization()
    }
  };

  queue.chain(function() {
    var transfer = new window.FileTransfer();
    transfer.upload(file.fullPath, getURL(url), success, error, options);

    this.next();
  }).call();

  return listenersFor(url);
};

API.authenticate = function(requestData) {
  var url = 'oauth/grant/';
  var authentication = 'Basic ' + Base64.encode(requestData.name + ':' + requestData.password);

  delete requestData.name;
  delete requestData.password;

  new Request({

    url: window.__API_DOMAIN + url,
    method: 'post',
    headers: {
      'Authorization': authentication,
    },

    onFailure: function(data) {
      if (__DEV__) console.log(data);
      fire(url, 'error', data);
    },

    onSuccess: function(data) {
      fire(url, 'success', data);
    }

  }).send(requestData);

  return listenersFor(url);
};

API.invalidate = function(url) {
  Object.each(cache, function(value, key) {
    if (url && key.indexOf(url) !== 0) return;
    if (!url && API.on(key).getLifetime() == -1) return;

    delete cache[key];
  });
};

API.cacheInfo = function(url) {
  API.on('info/' + url, {
    lifetime: -1
  }).call();
};

API.getInfo = function(type) {
  var response = getCache('info/' + type);
  return response && response.data;
};

API.setErrorHandler = function(fn) {
  errorFn = fn;
};

