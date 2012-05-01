(function() {

var events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

var ActiveState = this.ActiveState = function(className) {
  if (className) this.className = className;
};

ActiveState.prototype = {
  
  className: 'active',
  current: null,
  start: 0,
  
  $bound: {},
  bound: function(name) {
    return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
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

    this.cancel();
    
    var node = event.target;
    var current;
    if (node.nodeType == 3) node = node.parentNode;
    
    while (node && node.getAttribute) {
      if (node.webkitMatchesSelector('a, input')) {
        current = node;
        break;
      }
      
      node = node.parentNode;
    }
    
    if (!current) return;
    
    // on iOS, scrolling prevents redraws. We delay the addClass so the highlight does not
    // take effect before a scroll is likely to happen and the active state is not stuck
    // during scroll.
    this.timer = this.highlight.delay(75, this);
    this.current = current;
    this.start = event.touches[0].pageY;
  },

  touchmove: function(event) {
    if (!this.current) return;

    var end = event.touches[0].pageY;
    // Allows a small delta to detect movement
    if (end && Math.abs(this.start - end) > 3) this.cancel();
  },

  touchend: function() {
    this.cancel();
  },

  touchcancel: function() {
    this.cancel();
  },

  cancel: function() {
    if (this.current) this.current.removeClass(this.className);
    this.current = null;
    clearTimeout(this.timer);
  },

  highlight: function() {
    if (this.current) this.current.addClass(this.className);
  }

};

})();
