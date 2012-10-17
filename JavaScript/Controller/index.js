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
      var main = View.getMain();
      var stack = main.getStack();
      var object = stack && stack.getByURL(History.getPath());
      if (object && !object.isInvalid()) {
        // We don't want to push the same element again if it is the one that is currently shown
        // This is mostly a fix for a browser issue where pushState is being called twice on domready
        if (stack.getLength() == 1) return;
        main.push(stack.getName(), object);
      } else {
        fn.apply(null, arguments);
      }
    }, options && options.priority).setGreedy(options && options.isGreedy);
  }

};

History.addEvent('change', function(url) {
  // Phonegap likes to add file:///
  router.parse('/' + url.replace(/^\/|^file\:\/\/\//, ''));
});
