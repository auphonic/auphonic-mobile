(function() {

var router = new Router();

this.Controller = {

  define: function(key, value) {
    router.add(key, value);
  }

};

var baseURL = '/Thesis/App/';
var baseRegex = /^\/Thesis\/App\//;
History.addEvent('change', function(url) {
  if (baseRegex.test(url)) url = url.substr(baseURL.length);
  if (!(/^\//).test(url)) url = '/' + url;

  router.parse(url);
});

})();
