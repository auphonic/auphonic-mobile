var Core = require('Core');
var Class = Core.Class;

var Form = module.exports = new Class({

  initialize: function(options) {
    this.data = {};
    this.views = {};

    options.use.each(function(view) {
      this.views[view.getType()] = view;
    }, this);
  },

  show: function(type) {
    var object = this.views[type];
    if (!object) return;

    object.createView.apply(this, [this].concat(Array.slice(arguments, 1)));
  },

  set: function(key, value) {
    this.data[key] = value;

    return this;
  },

  get: function(get, dflt) {
    return this.data[get] || (this.data[get] = dflt);
  },

  erase: function() {
    this.data = {};

    return this;
  },

  eachView: function(fn, thisValue) {
    Object.each(this.views, fn, thisValue);
  }

});
