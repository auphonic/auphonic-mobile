var Core = require('Core');
var Events = Core.Events;

var Request = require('Request');
var Queue = require('Queue').Queue;
var Base64 = require('Utility/Base64');
var LocalStorage = require('Utility/LocalStorage');

var IdleTimer = require('Cordova/IdleTimer');
var User = require('Store/User');
var Platform = require('Platform');

var API = module.exports = {};

var APIURL = '';
var urls = {};
var cache = {};
var errorFn;
var timeoutFn;
var loggerFn;

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

var createListeners = function() {
  var listeners = new Events;
  listeners.on = listeners.addEvents;
  listeners.failure = function() {};
  return listeners;
};

var getURL = function(url) {
  return APIURL + 'api/' + url + '.json';
};

var formatGetURL = function(url, data) {
  if (!data) return url;
  return url + (url.contains('?') ? '&' : '?') + data;
};

var getAuthorization = function() {
  return User.getToken('Bearer ');
};

var createEvent = function() {
  var preventDefault = false;
  return {
    preventDefault: function() {
      preventDefault = true;
    },
    isPrevented: function() {
      return preventDefault;
    }
  };
};

API.on = function(url, options) {
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
};

API.call = function(url, method, requestData, requestOptions) {
  var timeout = requestOptions && requestOptions.timeout;

  var listeners = createListeners();
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

  listeners.failure = function(data) {
    var options = API.on(url).options;
    if (options && options.silent) return;

    var event = createEvent();
    listeners.fireEvent('error', [event, data]);
    if (errorFn) errorFn(event, data);

    // app/log is a silent call so it doesn't get stuck here and loops the error logging.
    API.log({
      type: 'xhr-error',
      url: url + '.json',
      method: method,
      message: data
    });
  };

  new Request.JSON({

    url: getURL(url),
    method: method,
    timeout: timeout != null ? timeout : (method == 'get' ? 10000 : 0),
    headers: {
      'Authorization': getAuthorization(),
      'Content-Type': 'application/json'
    },

    onTimeout: function() {
      if (timeoutFn) timeoutFn(createEvent());
    },

    onFailure: listeners.failure.bind(listeners),

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
var logUpload = function(type, file, progress, message) {
  API.log({
    type: type,
    message: message,
    name: file.name,
    size: file.size,
    duration: file.duration,
    media_type: file.media_type,
    progress: progress,
    percentage: Math.round((file.size ? progress / file.size : 0) * 100)
  });
};

API.upload = function(url, file, field) {
  IdleTimer.disable();

  var transfer;
  var canceled = false;
  var progress = 0;
  var listeners = createListeners();
  var success = function(response) {
    IdleTimer.enable();

    listeners.fireEvent('success', JSON.parse(response.response));
    logUpload('upload-success', file, progress);
  };

  var error = function(error) {
    IdleTimer.enable();

    if (canceled) return;

    listeners.fireEvent('error', error);
    logUpload('upload-error', file, progress, error.code + '; ' + error.status);
  };

  var options = new window.FileUploadOptions();
  options.fileKey = field;
  options.fileName = file.name;
  options.mimeType = file.type;
  // nginx and Android are no so good friends.
  if (Platform.isAndroid()) options.chunkedMode = false;
  options.headers = {
    Authorization: getAuthorization()
  };

  queue.chain(function() {
    if (canceled) {
      this.next();
      return;
    }

    transfer = new window.FileTransfer();
    transfer.onprogress = function(event) {
      progress = event.loaded;
      listeners.fireEvent('progress', event);
    };
    transfer.upload(file.fullPath, getURL(url) + (url.contains('?') ? '&' : '?') + Date.now(), success, error, options);

    this.next();
  }).call();

  listeners.cancel = function() {
    canceled = true;
    if (transfer) transfer.abort();
    logUpload('upload-cancel', file, progress);
  };

  return listeners;
};

API.authenticate = function(requestData) {
  var url = 'oauth2/token/';
  var authentication = 'Basic ' + Base64.encode(requestData.client_id + ':' + requestData.client_secret);
  var listeners = createListeners();

  new Request.JSON({

    url: APIURL + url,
    method: 'post',
    headers: {
      'Authorization': authentication,
    },

    onFailure: function(data) {
      listeners.fireEvent('error', data);
    },

    onSuccess: function(data) {
      listeners.fireEvent('success', data);
    }

  }).send(requestData);

  return listeners;
};

API.on('app/log', {silent: true});

API.log = function(data) {
  data = loggerFn(data);
  if (data) API.call('app/log', 'post', JSON.stringify(data));
};

API.invalidate = function(url) {
  Object.each(cache, function(value, key) {
    if (url && key.indexOf(url) !== 0) return;
    if (!url && API.on(key).getLifetime() == -1) return;

    delete cache[key];
  });
};

API.cacheInfo = function(options) {
  var data = LocalStorage.get('info.json');
  if (!navigator.onLine && data) {
    setCache(formatGetURL('info'), data, -1);
    var listeners = createListeners();
    (function() {
      listeners.fireEvent('success', [data]);
    }).delay(1);
    return listeners;
  }

  return API.on('info', Object.append({
    lifetime: -1
  }, options)).call().on({
    success: function(data) {
      LocalStorage.set('info.json', data);
    }
  });
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

API.setLogHandler = function(fn) {
  loggerFn = fn;
};

API.setAPIURL = function(url) {
  APIURL = url;
};
