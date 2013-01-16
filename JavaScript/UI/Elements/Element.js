var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Element = Core.Element;

var renderTemplate = require('../renderTemplate');
var UI = require('../');

module.exports = new Class({

  Implements: [Options, Class.Binds],

  Properties: {
    view: null
  },

  options: {
    back: false
  },

  template: null,

  initialize: function(container, element, options) {
    if (!options) options = {};
    this.setOptions(options);

    this.container = container;
    this.element = document.id(element);

    if (options.template) this.template = options.template;
    else this.options.template = this.template;

    // Act like the back button
    if (options.back) this.element.addEvent('click', this.bound('back'));
    // Default click event, passed on in every transition
    else if (options.onClick) this.element.addEvent('click', options.onClick);
  },

  toElement: function() {
    return this.element;
  },

  transition: function(previous, options) {
    UI.transition(this.container, previous.toElement(), this.element, options);
    return this;
  },

  update: function(options, data) {
    return this.create(data).transition(this, options);
  },

  create: function(data) {
    var element = Element.from(renderTemplate(this.options.template, data));
    // Click event from the View.Object
    if (data.onClick) element.addEvent('click', data.onClick);
    // This can be modified because the current element gets removed anyway
    this.options.back = !!data.back;
    return new this.$constructor(
      this.container,
      element,
      this.options
    ).setView(this.getView());
  },

  click: function(event) {
    event.preventDefault();

    if (event.touches && event.touches.length > 1) return false;
    if (UI.isHighlighted(this)) return false;

    UI.highlight(this);
    return true;
  },

  back: function(event) {
    if (this.click(event)) this.getView().pop();
  }

});
