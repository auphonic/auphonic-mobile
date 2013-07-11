var Core = require('Core');
var Class = Core.Class;

var UI = require('../');
var UIElement = require('./Element');

module.exports = new Class({

  Extends: UIElement,

  template: 'ui-action',

  options: {
    className: 'show'
  },

  update: function(options, data) {
    var element = this.element;
    element.transition(options, element.dispose.bind(element));
    (function() {
      element.removeClass(this.options.className);
    }).delay(UI.getTransitionDelay(), this);

    if (!data) return this;

    var next = this.create(data);
    this.container.adopt(next);
    next.show(options);

    return next;
  },

  show: function(options) {
    var isImmediate = options && options.immediate;
    var className = this.options.className;
    var element = this.toElement();

    element.transition(options).removeClass('hidden');
    if (isImmediate) element.addClass(className);
    else (function() {
      element.addClass(className);
    }).delay(UI.getTransitionDelay());
    UI.update(this.container.parentNode); // Make sure the container is properly updated

    return this;
  }

});
