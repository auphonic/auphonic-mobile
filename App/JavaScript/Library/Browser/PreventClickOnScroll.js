(function() {

var events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

this.PreventClickOnScroll = new Class({

  Implements: Class.Binds,

  start: 0,
  enabled: false,

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

    var node = event.target;
    if (node.nodeType == 3) node = node.parentNode;
    this.enabled = !!(node.webkitMatchesSelector(this.selector) || node.getParent(this.selector));

    this.start = event.touches[0].pageY;
  },

  touchmove: function(event) {
    var end = event.touches[0].pageY;
    // Allows a small delta to detect movement
    if (this.enabled && end && Math.abs(this.start - end) > 3)
      Element.disableCustomEvents();
  },

  touchend: function() {
    this.cancel();
  },

  touchcancel: function() {
    this.cancel();
  },

  cancel: function() {
    this.enabled = true;
    (function() {
      Element.enableCustomEvents();
    }).delay(1);
  }

});

})();
