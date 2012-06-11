(function() {

var urls = {};

var API = this.API = {

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
  var user = LocalStorage.get('User');
  new Request.JSON({

    url: API_DOMAIN + url,
    headers: {
      'Authorization': 'Basic ' + Base64Encode(user.name + ':' + user.password)
    },

    onFailure: function() {
      // ToDo
    },

    onSuccess: function(data) {
      API.on(url).fireEvent('success', [data]);
    }

  })[(method || 'get').toLowerCase()](data);
};

})();
