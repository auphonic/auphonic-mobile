(function() {

var urls = {};

var API = this.API = {

  on: function(url, fn) {
    if (!urls[url]) urls[url] = new Events;
    if (fn) urls[url].fn = fn;

    return urls[url];
  }

};

API.call = function(url, args) {
  var fn = urls[url] && urls[url].fn;
  API.dispatch(url, fn ? fn.apply(this, args) : args);
};

API.dispatch = function(url) {
  // TODO dispatch real API calls to auphonic
  setTimeout(function() {
    API.on(url).fireEvent('success', [{
      success: true
    }]);
  }, Number.random(100, 600));
};

})();
