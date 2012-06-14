var History = require('History');
var Router = require('Router');

var View = require('../View');

var router = new Router({
  normalizeFn: function(req, vals) {
    return [vals];
  }
});

module.exports = {

  define: function(key, fn) {
    router.add(key, function() {
      var main = View.get('Main');
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
