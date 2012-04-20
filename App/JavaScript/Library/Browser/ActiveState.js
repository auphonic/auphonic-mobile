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
    
    var node = event.target;
    var current;
    if (node.nodeType == 3) node = node.parentNode;
    
    while (node && node.getAttribute) {
      if (node.webkitMatchesSelector('a')) {
        current = node;
        break;
      }
      
      node = node.parentNode;
    }
    
    if (!current) return;
    
    current.addClass(this.className);
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
  }

};

})();
