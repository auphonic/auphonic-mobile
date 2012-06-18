var History = require('History');
var Router = require('Router');

var View = require('../View');

var router = new Router({
  normalizeFn: function(req, vals) {
    return [vals];
  }
});

module.exports = {

  define: function(key, options, fn) {
    if (!fn) {
      fn = options;
      options = null;
    }
    router.add(key, function() {
      var main = View.get('Main');
      var stack = main.getStack();
      var object = stack && stack.getByURL(History.getPath());

      if (object && !object.isInvalid()) main.push(stack.getName(), object);
      else fn.apply(null, arguments);
    }, options && options.priority).setGreedy(options && options.isGreedy);
  }

};

History.addEvent('change', function(url) {
  // Phonegap likes to add file:///
  router.parse('/' + url.replace(/^\/|^file\:\/\/\//, ''));
});
