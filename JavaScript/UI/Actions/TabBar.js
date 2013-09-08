var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var UI = require('UI');

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Events, Options],

  options: {},

  initialize: function(element, options) {
    this.setOptions(options);
    element = this.element = document.id(element);
    return this.check(element) || this.setup();
  },

  setup: function() {
    var click = this.bound('click');
    this.onClick = function(event) {
      click.call(null, this, event);
    };
    this.attach();
  },

  attach: function() {
    this.element.getChildren().addEvent('click', this.onClick);
  },

  detach: function() {
    this.element.getChildren().removeEvent('click', this.onClick);
  },

  click: function(element, event) {
    this.element.getChildren().forEach(UI.unhighlight.bind(UI));
    UI.highlight(element);
    this.fireEvent('change', element.get('data-value'));
  },

  setValue: function(value) {
    this.element.getChildren().forEach(function(element) {
      if (element.get('data-value') == value) UI.highlight(element);
      else UI.unhighlight(element);
    });
    this.fireEvent('change', value);
  }

});
