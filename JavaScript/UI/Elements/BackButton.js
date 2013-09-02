var Core = require('Core');
var Class = Core.Class;

var UI = require('../');
var UIElement = require('./Element');

module.exports = new Class({

  Extends: UIElement,

  template: 'ui-back',

  options: {
    className: 'fade'
  },

  initialize: function(container, element, options) {
    if (!options) options = {};
    options.back = true;
    this.parent(container, element, options);
  },

  update: function(options, data) {
    var next;

    if (data && this.getView().getStack().getLength() > 1)
      next = this.create(data);

    if (options && options.fade) {
      if (next) {
        next.toElement().addClass('fade').inject(this.container);
        (function() {
          next.toElement().removeClass('fade');
        }).delay(UI.getTransitionDelay());
      }
      this.toElement().transition(function() {
        this.dispose();
      }).addClass('fade');
      return next || this;
    }

    UI.transition(this.container, this.toElement(), next && next.toElement(), options);

    return next || this;
  },

  getTextSize: function() {
    var element = this.element.getElement('span > span');
    return element ? element.getClientRects()[0] : {width: 0, height: 0};
  }

});
