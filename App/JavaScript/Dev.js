(function(push, onChange) {

// Monkey Patching for dev.
var baseURL = '/Thesis/App';
var base = /^\/Thesis\/App\//;
if (base.test(location.pathname)) {
  History.push = function(url, title, state) {
    push.call(this, baseURL + (!(/^\//).test(url) ? '/' : '') + url, title, state);
  };
  
  History.onChange = function(url, state) {
    onChange.call(this, base.test(url) ? url.substr(baseURL.length) : url, state);
  };
}

})(History.push, History.onChange);
