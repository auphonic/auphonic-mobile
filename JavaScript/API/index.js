var Core = require('Core');
var Events = Core.Events;
var Request = Core.Request;

var Request = require('Request');

var Base64 = require('Utility/Base64');
var LocalStorage = require('Utility/LocalStorage');

var urls = {};
var cache = {};
var request;

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

API.call = function(url, method, requestData) {
  if (request && request.isRunning() && request.getOption('method').toLowerCase() == 'get') {
    request.cancel();
    API.on(url).removeEvents('success:once').removeEvents('error:once');
  }

  method = (method || 'get').toLowerCase();
  if (method == 'get') {
    var data = getCache(url);
    if (data) {
      // Must be async
      (function() {
        API.on(url).fireEvent('success', [data]);
      }).delay(1);
      return;
    }
  }

  var user = LocalStorage.get('User');

  request = new Request.JSON({

    url: window.__API_DOMAIN + 'api/' + url + '.json',
    method: method,
    headers: {
      'Authorization': (user ? 'OAuth ' + user.access_token : ''),
      'Content-Type': 'application/json'
    },

    onFailure: function(data) {
      // TODO delete requests currently don't return anything
      if (method != 'delete') console.log(data);
      API.on(url).fireEvent('failure', [data]);
    },

    onSuccess: function(data) {
      var options = API.on(url).options;
      if (options && options.formatter) data = options.formatter(data);

      if (method == 'get') setCache(url, data, options && options.lifetime);
      API.on(url).fireEvent('success', [data]);
    }

  }).send(requestData);

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
      console.log(data);
      API.on(url).fireEvent('failure', [data]);
    },

    onSuccess: function(data) {
      API.on(url).fireEvent('success', [data]);
    }

  }).send(requestData);

  return listenersFor(url);
};

API.invalidate = function(url) {
  if (!url) cache = {};
  delete cache[url];
};

API.cacheInfo = function(url) {
  API.call(url).on({
    success: function(response) {
      var type = url.split('/').getLast();
      setCache('info-' + type, response.data, -1);
    }
  });
};

API.getInfo = function(type) {
  return getCache('info-' + type);
};
