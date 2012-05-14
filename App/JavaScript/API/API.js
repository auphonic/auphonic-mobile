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
  var api = API.on(url);
  var fn = api.fn;
  API.dispatch(url, fn ? fn.apply(this, args) : args);
  return {on: function(events) {
    if (events.success) api.addEvent('success:once', events.success);
    if (events.error) api.addEvent('error:once', events.error);
  }};
};

API.dispatch = function(url) {
  // TODO dispatch real API calls to auphonic
  setTimeout(function() {
    API.on(url).fireEvent('success', [{
      success: true
    }]);
  }, 0);
};

})();
