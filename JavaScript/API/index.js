var Core = require('Core');
var Events = Core.Events;
var Request = Core.Request;

var Request = require('Request');

var Base64 = require('Utility/Base64');

var IdleTimer = require('Cordova/IdleTimer');

var User = require('Store/User');

var Queue = require('Queue').Queue;


var urls = {};
var cache = {};
var errorFn;
var timeoutFn;

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
      object = urls[url] = {};
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
  var listeners = new Events;
  listeners.on = listeners.addEvents;
  return listeners;
};

var getURL = function(url) {
  return window.__API_DOMAIN + 'api/' + url + '.json';
};

var formatGetURL = function(url, data) {
  if (!data) return url;
  return url + (url.contains('?') ? '&' : '?') + data;
};

var getAuthorization = function() {
  return User.getToken('Bearer ');
};

API.call = function(url, method, requestData) {
  var listeners = listenersFor(url);
  if (typeof requestData != 'string') requestData = Object.toQueryString(requestData);

  method = (method || 'get').toLowerCase();
  if (method == 'get') {
    var data = getCache(formatGetURL(url, requestData));
    if (data) {
      // Must be async
      (function() {
        listeners.fireEvent('success', [data]);
      }).delay(1);
      return listeners;
    }
  }

  new Request.JSON({

    url: getURL(url),
    method: method,
    timeout: (method == 'get' ? 10000 : 0),
    headers: {
      'Authorization': getAuthorization(),
      'Content-Type': 'application/json'
    },

    onTimeout: function() {
      if (timeoutFn) timeoutFn();
    },

    onFailure: function(data) {
      // Delete requests don't return anything
      if (method == 'delete') {
        listeners.fireEvent('success', null);
        return;
      }

      if (__DEV__) console.log(data);

      var options = API.on(url).options;
      if (options && options.silent) return;
      var preventDefault = false;
      var event = {
        preventDefault: function() {
          preventDefault = true;
        },
        isPrevented: function() {
          return preventDefault;
        }
      };

      listeners.fireEvent('error', [event, data]);
      if (errorFn) errorFn(event, data);
    },

    onSuccess: function(data) {
      if (data && data.status_code != 200) {
        this.failure();
        return;
      }

      var options = API.on(url).options;
      if (options && options.formatter) data = options.formatter(data);

      if (method == 'get') setCache(formatGetURL(url, requestData), data, options && options.lifetime);
      listeners.fireEvent('success', data);
    }

  }).send(requestData);

  return listeners;
};

var queue = new Queue;

API.upload = function(url, file, field) {
  IdleTimer.disable();

  var transfer;
  var canceled = false;
  var listeners = listenersFor(url);
  var success = function(response) {
    IdleTimer.enable();

    listeners.fireEvent('success', JSON.parse(response.response));
    if (__DEV__) console.log('Code: ' + response.responseCode + ', Bytes: ' + response.bytesSent);
  };

  var error = function(error) {
    IdleTimer.enable();

    if (canceled) return;

    listeners.fireEvent('error', error);
    if (__DEV__) console.log(error.code);
  };

  var options = new window.FileUploadOptions();
  options.fileKey = field;
  options.fileName = file.name;
  options.mimeType = file.type;
  options.headers = {
    Authorization: getAuthorization()
  };

  queue.chain(function() {
    transfer = new window.FileTransfer();
    transfer.onprogress = function(event) {
      listeners.fireEvent('progress', event);
    };
    transfer.upload(file.fullPath, getURL(url) + (url.contains('?') ? '&' : '?') + Date.now(), success, error, options);

    this.next();
  }).call();

  listeners.cancel = function() {
    canceled = true;
    if (transfer) transfer.abort();
  };

  return listeners;
};

API.authenticate = function(requestData) {
  var url = 'oauth2/token/';
  var authentication = 'Basic ' + Base64.encode(requestData.client_id + ':' + requestData.client_secret);
  var listeners = listenersFor(url);

  new Request.JSON({

    url: window.__API_DOMAIN + url,
    method: 'post',
    headers: {
      'Authorization': authentication,
    },

    onFailure: function(data) {
      if (__DEV__) console.log(data);
      listeners.fireEvent('error', data);
    },

    onSuccess: function(data) {
      listeners.fireEvent('success', data);
    }

  }).send(requestData);

  return listeners;
};

API.invalidate = function(url) {
  Object.each(cache, function(value, key) {
    if (url && key.indexOf(url) !== 0) return;
    if (!url && API.on(key).getLifetime() == -1) return;

    delete cache[key];
  });
};

API.cacheInfo = function(options) {
  return API.on('info', Object.append({
    lifetime: -1
  }, options)).call();
};

API.getInfo = function(type) {
  var response = getCache('info');
  return response && response.data && response.data[type];
};

API.setErrorHandler = function(fn) {
  errorFn = fn;
};

API.setTimeoutHandler = function(fn) {
  timeoutFn = fn;
};
