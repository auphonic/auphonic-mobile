// Monkey Patching for dev.
if (__DEV__ && window.__LOCALHOST__) (function() {

var History = require('History');
var push = History.push;
var onChange = History.onChange;
var getPath = History.getPath;

var baseURL = window.__baseURL;
var base = window.__base;
var clean = function(url) {
  return base.test(url) ? url.substr(baseURL.length) : url;
};

History.push = function(url, title, state) {
  push.call(this, baseURL + url.replace(/^\//, ''), title, state);
};

History.onChange = function(url, state) {
  onChange.call(this, clean(url), state);
};

History.getPath = function() {
  return clean(getPath.call(this));
};

})();
