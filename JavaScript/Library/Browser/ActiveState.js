var Core = require('Core');
var Class = Core.Class;

var events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

module.exports = new Class({

  Implements: Class.Binds,

  activeClass: 'active',
  hitClass: 'hit',
  hitProperty: 'data-hit-target',
  current: null,
  start: 0,
  enabled: true,

  initialize: function(options) {
    if (!options) options = {};

    if (options.active) this.activeClass = options.active;
    if (options.hit) this.hitClass = options.hit;
    if (options.hitProperty) this.hitProperty = options.hitProperty;
  },

  attach: function() {
    events.forEach(function(event) {
      window.addEventListener(event, this.bound(event), true);
    }, this);
  },

  detach: function() {
    events.forEach(function(event) {
      window.removeEventListener(event, this.bound(event), true);
    }, this);
  },

  enable: function() {
    this.enabled = true;
  },

  disable: function() {
    this.enabled = false;
  },

  touchstart: function(event) {
    if (event.touches.length > 1) return;

    this.cancel();

    if (!this.enabled) return;

    var node = event.target;
    var current;

    while (node && node.getAttribute) {
      if (node.match('a, input')) {
        current = node;
        break;
      }

      node = node.parentNode;
    }

    if (!current) return;

    // on iOS, scrolling prevents redraws. We delay the addClass so the highlight does not
    // take effect before a scroll is likely to happen and the active state is not stuck
    // during scroll.
    this.timer = this.highlight.delay(50, this);
    this.current = current;
    this.start = event.touches[0].pageY;
  },

  touchmove: function(event) {
    var current = this.current;
    if (!current) return;

    // If it is a hit target element, check if the touch is over the element
    if (current.get(this.hitProperty)) {
      var touch = event.changedTouches[0];
      var node = document.elementFromPoint(touch.clientX, touch.clientY);
      if (this.matches(node)) current.addClass(this.activeClass);
      else current.removeClass(this.activeClass);

      return;
    }

    // Otherwise we only allow a small delta of movement
    var end = event.touches[0].pageY;
    // Allows a small delta to detect movement
    if (end && Math.abs(this.start - end) > 3) this.cancel();
  },

  touchend: function() {
    this.cancel(true);
  },

  touchcancel: function() {
    this.cancel(true);
  },

  cancel: function(timeout) {
    clearTimeout(this.timer);
    if (timeout) this.unhighlight.delay(50, this);
    else this.unhighlight();
  },

  matches: function(node) {
    do {
      if (node == this.current) return true;
    } while (node && (node = node.parentNode));

    return false;
  },

  highlight: function() {
    var current = this.current;
    if (!current) return;

    current.addClass(this.activeClass);
    if (current.get(this.hitProperty))
      current.addClass(this.hitClass);
  },

  unhighlight: function() {
    var current = this.current;
    if (!current) return;

    this.current = null;
    current.removeClass(this.activeClass);
    // Required to be able to dispatch a click event on the expanded element.
    (function() {
      current.removeClass(this.hitClass);
    }).delay(10, this);
  }

});
