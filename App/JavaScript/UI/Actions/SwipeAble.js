(function(){

this.SwipeAble = new Class({

  Implements: [Class.Singleton, Class.Binds, Options, Events],

  options: {
    selector: '.removable > span',
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

    this.element = container.getElement(this.options.selector);
    this.element.store('swipe:cancelVertical', true);

    this.attach();
  },

  attach: function() {
    this.container.addEvent('swipe', this.bound('swipe'));
    this.element.addEvent('click', this.bound('click'));
    this.element.getElement('a').addEvent('click', this.bound('preventDefault'));
  },

  detach: function() {
    this.container.removeEvent('swipe', this.bound('swipe'));
    this.element.removeEvent('click', this.bound('click'));
  },

  swipe: function() {
    this.element.addClass('visible');

    this.elements = this.getScrollable().getElements('*').setStyle('pointer-events', 'none');
    this.element.setStyle('pointer-events', 'auto');
    this.getScrollable().addEvents({
      'touchstart:once': this.bound('touchstart'),
      touchmove: this.bound('preventDefault')
    });

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
    this.elements.setStyle('pointer-events', '');
    this.elements = null;
    this.getScrollable().removeEvent('touchmove', this.bound('preventDefault'));

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

})();
