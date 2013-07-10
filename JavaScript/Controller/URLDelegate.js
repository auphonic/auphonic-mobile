var Core = require('Core');
var Class = Core.Class;

var Router = require('Router');

var delegates = {};
var URLDelegate = module.exports = new Class({

  Implements: Class.Binds,

  initialize: function() {
    this.id = String.uniqueID();
    this.router = new Router({
      normalizeFn: function(req, vals) {
        return [vals];
      }
    });
  },

  define: function(key, options, fn) {
    if (!fn) {
      fn = options;
      options = null;
    }
    this.router.add(key, this.decorate(fn), options && options.priority).setGreedy(options && options.isGreedy);
    return this;
  },

  route: function(url) {
    // Phonegap likes to add file:///
    this.router.parse('/' + url.replace(/^\/|^file\:\/\/\//, ''));
    return this;
  },

  decorate: function(fn) {
    return function() {
      fn.apply(null, arguments);
    };
  },

  getId: function() {
    return this.id;
  }

});

URLDelegate.get = function(id) {
  return delegates[id];
};

URLDelegate.register = function(delegate) {
  delegates[delegate.getId()] = delegate;
  return this;
};

URLDelegate.unregister = function(delegate) {
  delete delegates[delegate.getId()];
  return this;
};
