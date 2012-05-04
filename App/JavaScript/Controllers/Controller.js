(function() {

var router = new Router();

this.Controller = {

  define: function(key, value) {
    router.add(key, value);
  }

};

History.addEvent('change', function(url) {
  router.parse('/' + url.replace(/^\//, ''));
});

})();
