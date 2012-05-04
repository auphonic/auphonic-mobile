(function() {

var router = new Router({
  normalizeFn: function(req, vals) {
    return [vals];
  }
});

this.Controller = {

  define: function(key, value) {
    router.add(key, value);
  }

};

History.addEvent('change', function(url) {
  router.parse('/' + url.replace(/^\//, ''));
});

})();
