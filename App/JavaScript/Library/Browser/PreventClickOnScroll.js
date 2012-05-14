(function() {

var events = ['touchstart', 'touchmove', 'touchcancel', 'touchend'];

this.PreventClickOnScroll = new Class({

  Implements: Class.Binds,

  start: 0,
  scrolling: false,
  enabled: false,
  cancelOnTouchEnd: false,
  attachOnTouchEnd: false,

  initialize: function(selector) {
    this.selector = selector;
  },

  attach: function() {
    events.forEach(function(event) {
      document.addEventListener(event, this.bound(event), true);
    }, this);
  },

  detach: function() {
    events.forEach(function(event) {
      document.removeEventListener(event, this.bound(event), true);
    }, this);
  },

  touchstart: function(event) {
    if (event.touches.length > 1) return;

    if (this.scrolling) {
      clearTimeout(this.timer);
      this.cancelOnTouchEnd = true;
      if (this.node) this.node.removeEventListener('scroll', this.bound('listener'), false);
    }

    this.enabled = !!this.getNode(event.target);
    this.start = event.touches[0].pageY;
  },

  touchmove: function(event) {
    var end = event.touches[0].pageY;
    if (!this.enabled || !end || Math.abs(this.start - end) <= 3) return;

    Element.disableCustomEvents.delay(0);
    this.attachOnTouchEnd = true;
  },

  touchend: function(event) {
    if (this.attachOnTouchEnd) {
      var node = this.getNode(event.target);
      node.addEventListener('scroll', this.bound('listener'), false);
      this.node = node;
    }

    if (this.cancelOnTouchEnd)
      this.cancel();
  },

  touchcancel: function() {
    this.cancel();
  },

  cancel: function() {
    this.scrolling = false;
    this.cancelOnTouchEnd = false;
    Element.enableCustomEvents.delay(0);
    if (this.node) this.node.removeEventListener('scroll', this.bound('listener'), false);
    this.node = null;
  },

  listener: function() {
    this.scrolling = true;
    clearTimeout(this.timer);
    this.timer = this.cancel.delay(400, this);
  },

  getNode: function(node) {
    if (node.nodeType == 3) node = node.parentNode;
    return node.match(this.selector) ? node : node.getParent(this.selector);
  }

});

})();
