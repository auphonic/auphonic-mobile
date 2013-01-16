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
    scrollableSelector: 'div.scrollable',
    removedClass: 'item-removed'

    /*
    onSwipe: function() {},
    onComplete: function() {},
    onClick: fucntion() {}
    */
  },

  hasClick: false,

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
    this.element.getParent().show();
    this._swipe.delay(0, this);
  },

  _swipe: function() {
    this.element.addClass('visible');

    UI.disable(this.getScrollable(), this.element);
    window.addEvent('touchstart:once', this.bound('touchstart'));

    this.fireEvent('swipe');
  },

  click: function(event) {
    this.hasClick = true;
    event.preventDefault();

    this.end();
    this.container.addClass(this.options.removedClass);
    this.fireEvent('click');
  },

  touchstart: function(event) {
    // This is only for cases where the touch is started on the element but no click is registered
    window.addEvent('touchend:once', this.bound('touchend'));

    var node = this.getNode(event.target);
    if (node) return;

    event.preventDefault();
    this.element.removeClass('visible').transition(this.bound('hideElement'));
  },

  touchend: function() {
    // Delay to see if a click got registered
    (function() {
      var hasClick = this.hasClick;
      this.hasClick = false;
      if (hasClick) return;

      this.element.removeClass('visible').transition(this.bound('hideElement'));
      this.end();
    }).delay(10, this);
  },

  end: function() {
    UI.enable(this.getScrollable(), this.element);
    this.fireEvent('complete');
  },

  hideElement: function() {
    this.element.getParent().hide();
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
