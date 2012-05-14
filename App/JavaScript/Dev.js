(function(push, onChange, getPath) {

// Monkey Patching for dev.
if (this.__DEV__) {
  var baseURL = this.__baseURL;
  var base = this.__base;
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
}

})(History.push, History.onChange, History.getPath);
