var Core = require('Core');
var Class = Core.Class;

var UI = require('../');
var UIElement = require('./Element');

module.exports = new Class({

  Extends: UIElement,

  template: 'ui-back',

  initialize: function(container, element, options) {
    if (!options) options = {};
    options.back = true;
    this.parent(container, element, options);
  },

  update: function(options, data) {
    var next;

    if (this.getView().getStack().getLength() > 1)
      next = this.create(data);

    UI.transition(this.container, this.toElement(), next && next.toElement(), options);

    return next || this;
  }

});
