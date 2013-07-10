var Core = require('Core');
var Class = Core.Class;

var History = require('History');

var URLDelegate = require('./URLDelegate');
var View = require('../View');

var MainController = new Class({

  Extends: URLDelegate,

  decorate: function(fn) {
    return function() {
      var main = View.getMain();
      var stack = main.getStack();
      var object = stack && stack.getByURL(History.getPath());
      if (object && !object.isInvalid()) {
        // We don't want to push the same element again if it is the one that is currently shown
        // This is mostly a fix for a browser issue where pushState is being called twice on domready
        if (stack.getLength() == 1) return;
        main.pushOn(stack.getName(), object);
      } else {
        fn.apply(null, arguments);
      }
    };
  }

});

var Controller = module.exports = new MainController;
History.addEvent('change', Controller.bound('route'));
