(function() {

var router = new Router({
  normalizeFn: function(req, vals) {
    return [vals];
  }
});

this.Controller = {

  define: function(key, fn) {
    router.add(key, function() {
      var main = Views.get('Main');
      var current = main.getCurrent();
      var object = current && current.getByURL(History.getPath());

      if (object) main.push(current.getName(), object);
      else fn.apply(null, arguments);
    });
  }

};

History.addEvent('change', function(url) {
  // Phonegap likes to add file:///
  router.parse('/' + url.replace(/^\/|^file\:\/\/\//, ''));
});

})();
