var Core = require('Core');
var Class = Core.Class;

module.exports = new Class({

  Implements: Class.Binds,

  down: false,
  enabled: true,

  initialize: function(options) {
    this.selector = options.selector;
    this.contentSelector = options.contentSelector;
    this.activeState = options.activeState;
  },

  attach: function() {
    window.addEventListener('touchstart', this.bound('touchstart'), true);
  },

  detach: function() {
    window.removeEventListener('touchstart', this.bound('touchstart'), true);
  },

  touchstart: function(event) {
    if (event.touches.length > 1) return;

    var node = this.node = this.getNode(event.target);
    if (!node) return;

    this.down = true;
    node.addEventListener('scroll', this.bound('scroll'), false);
    node.addEventListener('touchend', this.bound('touchend'), false);
  },

  touchend: function() {
    this.down = false;
    this.touchendTime = Date.now();
    if (this.touchendTime - this.scrollTime > 100) this.enable();
    if (this.node) this.node.removeEventListener('touchend', this.bound('touchend'), false);
  },

  enable: function() {
    if (this.enabled) return;

    this.activeState.enable();
    if (this.node) this.node.getElement(this.contentSelector).removeClass('disable-events');
    this.enabled = true;
    this.node = null;
  },

  disable: function() {
    if (!this.enabled) return;

    this.activeState.disable();
    if (this.node) this.node.getElement(this.contentSelector).addClass('disable-events');
    this.enabled = false;
  },

  scroll: function() {
    if (this.enabled) this.disable();

    this.scrollTime = Date.now();
    if (this.down) return;

    clearTimeout(this.timer);
    this.timer = this.enable.delay(100, this);
  },

  getNode: function(node) {
    if (node.nodeType == 3) node = node.parentNode;
    return node.match(this.selector) ? node : node.getParent(this.selector);
  }

});
