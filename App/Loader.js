(function() {

// We are reusing this instance in App.js once all code has loaded
var spinner = this.__NATIVE_SPINNER = new Spinner({
  lines: 25,
  length: 0,
  width: 4,
  radius: 30,
  trail: 30,
  color: '#000'
});

var resources = 0;
var loaded = 0;
var retries = 0;
var hasError = false;
var retryElement = document.querySelector('#retry');
var noticeElement = document.querySelector('#native-notice');
var timeout = 15000;
var timer;

document.body.className += ' ' + this.__PLATFORM;

var loadResource = function(url, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('readystatechange', function() {
    if (xhr.readyState !== 4) return;
    var response = xhr.responseText;
    setTimeout(function() {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) success(response);
      else error(response);
    }, 1);
  }, false);
  xhr.open('GET', url, true);
  xhr.send();
  return xhr;
};

var insertJS = (function() {
  var indirectEval = function(expression) {
    return (1, eval)(expression);
  };
  var isIndirectEvalGlobal = (function(original, Object) {
    try {
      return indirectEval('Object') === original;
    } catch(err) {
      return false;
    }
  })(Object, 123);

  if (isIndirectEvalGlobal) {
    return indirectEval;
  } else if (typeof window.execScript !== 'undefined') {
    // if `window.execScript exists`, use it
    return function(expression) {
      return window.execScript(expression);
    };
  }

  return function(expression) {
    return eval(expression);
  };
})();

var insertCSS = function(css) {
  var style = document.createElement('style');
  style.innerHTML = css;
  document.querySelector('head').appendChild(style);
};

var cleanup = function() {
  hasError = false;
  noticeElement.style.display = '';
  retry.className = 'retry hidden';
  retryElement.querySelector('a.button').removeEventListener('click', retryClick, false);
};

var retryClick = function(event) {
  if (event) event.preventDefault();

  cleanup();
  retries++;
  __SERVER_URL = __FALLBACK_SERVER_URL;
  if (retries >= 2) loadFromCache();
  else loadFromServer();
};

var success = function() {
  cleanup();
  clearTimeout(timer);
  // We are not stopping the spinner because it is being reused
  if (++loaded >= resources && window.__BOOTAPP && !window.__APP_AVAILABLE)
    window.__BOOTAPP();
};

var error = function() {
  if (window.__APP_AVAILABLE) {
    cleanup();
    return;
  }

  hasError = true;
  clearTimeout(timer);
  spinner.stop();

  noticeElement.style.display = 'block';
  retryElement.className = 'retry';
  retryElement.querySelector('a.button').addEventListener('click', retryClick, false);
};

var cacheKey = '$auphonic-app-cache-';
var store = function(name, data) {
  if (!data) localStorage.removeItem(cacheKey + name);
  else localStorage.setItem(cacheKey + name, data);
};
var retrieve = function(name) {
  return localStorage.getItem(cacheyKey + name);
};

var loadFromServer = function() {
  timer = setTimeout(error, timeout);
  spinner.spin(document.querySelector('#splash'));
  loadResource(__SERVER_URL + 'Version.js?' + Date.now(), function(versionJS) {
    insertJS(versionJS);

    // On Android, if the user is offline, __APP_VERSION will be undefined
    if (!window.__APP_VERSION) {
      console.log('app_version is undefined');
      loadFromCache({fallback: false});
      return this;
    }

    store('version', versionJS);
    var getURL = function(url) {
      return __SERVER_URL + url + (window.__LOCALHOST__ ? '?' + Date.now() : '');
    };

    loaded = 0;
    resources = 2;
    // __APP_VERSION is available
    loadResource(getURL('App-' + window.__APP_VERSION + '.css'), function(css) {
      store('css', css);
      insertCSS(css);
      success();
    }, error);
    loadResource(getURL('App-' + window.__APP_VERSION + '.js'), function(js) {
      store('js', js);
      insertJS(js);
      success();
    }, error);
  }, error);
};

var loadFromCache = function(options) {
  var versionJS = localStorage.getItem(cacheKey + 'version');
  var js = localStorage.getItem(cacheKey + 'js');
  var css = localStorage.getItem(cacheKey + 'css');
  if (!versionJS || !js || !css) {
    if (options && options.fallback === false) error();
    else loadFromServer();
    return;
  }

  resources = 0;
  loaded = 0;
  try {
    insertJS(versionJS);
    insertCSS(css);
    insertJS(js);
    success();
  } catch(e) {
    store('version', null);
    store('css', null);
    store('js', null);
    error();
  }
};

var load = function() {
  if (navigator.onLine) loadFromServer();
  else loadFromCache();
};

var onLoad = function() {
  document.removeEventListener('deviceready', onLoad, false);
  document.removeEventListener('DOMContentLoaded', onLoad, false);
  load();
};

document.addEventListener('deviceready', onLoad, false);
document.addEventListener('DOMContentLoaded', onLoad, false);
document.addEventListener('resume', function() {
  if (hasError) loadFromServer();
}, false);

})();
