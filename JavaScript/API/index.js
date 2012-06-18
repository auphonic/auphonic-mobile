var Core = require('Core');
var Events = Core.Events;
var Request = Core.Request;

var Request = require('Request');

var LocalStorage = require('Utility/LocalStorage');
var Base64 = require('Utility/Base64');

var urls = {};
var info = {};
var request;

var API = module.exports = {

  on: function(url, fn) {
    if (!urls[url]) urls[url] = new Events;
    if (fn) urls[url].fn = fn;

    return urls[url];
  }

};

API.call = function(url, method, args) {
  var api = API.on(url);
  var fn = api.fn;
  API.dispatch(url, method, fn ? fn.apply(this, args) : args);
  return {on: function(events) {
    if (events.success) api.addEvent('success:once', events.success);
    if (events.error) api.addEvent('error:once', events.error);
  }};
};

API.dispatch = function(url, method, data) {
  if (request && request.isRunning() && request.getOption('method').toLowerCase() == 'get') {
    request.cancel();
    API.on(url).removeEvents('success:once').removeEvents('error:once');
  }

  var user = LocalStorage.get('User');
  request = new Request.JSON({

    url: window.__API_DOMAIN + url + '.json',
    method: method || 'get',
    headers: {
      'Authorization': 'Basic ' + Base64.encode(user.name + ':' + user.password),
      'Content-Type': 'application/json'
    },

    onFailure: function(data) {
      console.log(data);
    },

    onSuccess: function(data) {
      API.on(url).fireEvent('success', [data]);
    }

  }).send(data);
};

API.invalidate = function(url) {
  // TODO
};

API.cacheInfo = function(url) {
  var type = url.split('/').getLast();
  if (type == 'algorithms') {
    // TODO API call when API is available
    info[type] = {
      "denoise": {
          "display_name": "Noise Reduction ",
          "description": "Classifies regions with different background noises and automatically removes noise and hum.",
          "default_value": false
      },
      "filtering": {
          "display_name": "Filtering",
          "description": "Filters unnecessary and disturbing low frequencies depending on the context (speech, music, noise).",
          "default_value": true
      },
      "leveler": {
          "display_name": "Adaptive Leveler ",
          "description": "Corrects level differences between speakers, music and speech, etc. to achieve a balanced overall loudness.",
          "default_value": true
      },
      "normloudness": {
          "display_name": "Global Loudness Normalization",
          "description": "Adjusts the global, overall loudness to a value of -18 LUFS (see EBU R128), so that all processed files have a similar average loudness.",
          "default_value": true
      }
    };
    return;
  }

  API.call(url).on({
    success: function(response) {
      info[type] = response.data;
    }
  });
};

API.getInfo = function(type) {
  return info[type];
};
