var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

var UI = require('UI');

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options, Events],

  options: {
    selector: '.removable > span',
    anchorSelector: 'a',
    scrollableSelector: 'div.scrollable'

    /*
    onSwipe: function() {},
    onComplete: function() {},
    onClick: fucntion() {}
    */
  },

  initialize: function(container, options) {
    this.setOptions(options);

    this.container = container = document.id(container);

    return this.check(container) || this.setup();
  },

  setup: function() {
    var container = this.container;
    var element = this.element = container.getElement(this.options.selector);
    container.store('swipe:cancelVertical', true);
    this.anchor = element.getElement(this.options.anchorSelector);

    this.attach();
  },

  attach: function() {
    this.container.addEvent('swipe', this.bound('swipe'));
    this.element.addEvent('click', this.bound('click'));
    this.anchor.addEvent('click', this.bound('preventDefault'));
  },

  detach: function() {
    this.container.removeEvent('swipe', this.bound('swipe'));
    this.element.removeEvent('click', this.bound('click'));
    this.anchor.removeEvent('click', this.bound('preventDefault'));
  },

  swipe: function() {
    this.element.addClass('visible');

    this.enableUI = UI.disable(this.getScrollable(), this.element);
    this.getScrollable().addEvent('touchstart:once', this.bound('touchstart'));

    this.fireEvent('swipe');
  },

  click: function(event) {
    event.preventDefault();

    this.end();
    this.fireEvent('click');
  },

  touchstart: function(event) {
    var node = this.getNode(event.target);
    if (node) return;

    event.preventDefault();

    this.element.removeClass('visible');
    this.getScrollable().addEvent('touchend:once', this.bound('end'));
  },

  end: function(event) {
    if (this.enableUI) this.enableUI();
    this.enableUI = null;

    this.fireEvent('complete');
  },

  preventDefault: function(event) {
    event.preventDefault();
  },

  getNode: function(node) {
    var selector = this.options.selector;
    if (node.nodeType == 3) node = node.parentNode;
    return node.match(selector) ? node : node.getParent(selector);
  },

  getScrollable: function() {
    return this.container.getParent(this.options.scrollableSelector);
  }

});
