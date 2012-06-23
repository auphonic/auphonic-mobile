var Core = require('Core');
var Events = Core.Events;
var Request = Core.Request;

var Request = require('Request');

var LocalStorage = require('Utility/LocalStorage');
var Base64 = require('Utility/Base64');

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

API.call = function(url, method, args) {
  var api = API.on(url);
  API.dispatch(url, method, args);
  return {on: function(events) {
    if (events.success) api.addEvent('success:once', events.success);
    if (events.error) api.addEvent('error:once', events.error);
  }};
};

API.dispatch = function(url, method, requestData) {
  // TODO(cpojer): API oAuth Login
  if (url == 'login/submit') {
    (function() {
      API.on(url).fireEvent('success', []);
    }).delay(1);
    return;
  }

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
  var authorization = (user ? 'Basic ' + Base64.encode(user.name + ':' + user.password) : '');
  request = new Request.JSON({

    url: window.__API_DOMAIN + url + '.json',
    method: method,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },

    onFailure: function(data) {
      // TODO delete requests currently don't return anything
      if (method != 'delete') console.log(data);
    },

    onSuccess: function(data) {
      var options = API.on(url).options;
      if (options && options.formatter) data = options.formatter(data);

      if (method == 'get') setCache(url, data, options && options.lifetime);
      API.on(url).fireEvent('success', [data]);
    }

  }).send(requestData);
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
