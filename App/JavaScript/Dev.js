(function(push, onChange) {

// Monkey Patching for dev.
if (this.__DEV__) {
  var baseURL = this.__baseURL;
  var base = this.__base;
  History.push = function(url, title, state) {
    push.call(this, baseURL + url.replace(/^\//, ''), title, state);
  };

  History.onChange = function(url, state) {
    onChange.call(this, base.test(url) ? url.substr(baseURL.length) : url, state);
  };
}

})(History.push, History.onChange);
