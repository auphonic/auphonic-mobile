var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Browser = Core.Browser;
var Element = Core.Element;

var OuterClickStack = require('OuterClickStack');

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    selector: 'div.popover',
    scrollSelector: 'div.scroll-content',
    positionProperty: 'data-position',
    animationClass: 'fade',
    arrowHeight: 14
  },

  enabled: true,

  initialize: function(element, options){
    this.setOptions(options);

    element = this.element = document.id(element);

    return this.check(element) || this.setup();
  },

  setup: function(){
    var popover = this.popover = this.element.getElement(this.options.selector);
    popover.dispose().removeClass('hidden').addClass(this.options.animationClass);
    this.pos = popover.get(this.options.positionProperty);

    this.attach();
  },

  attach: function(){
    this.element.addEvent('click', this.bound('onClick'));
    this.popover.addEvent('click', this.bound('onPopoverClick'));
  },

  detach: function(){
    this.element.removeEvent('click', this.bound('onClick'));
    this.popover.removeEvent('click', this.bound('onPopoverClick'));
  },

  onClick: function(event){
    if (!this.enabled) return;

    event.preventDefault();

    if (this.isOpen){
      this.close();
      return;
    }

    this.open();
  },

  onPopoverClick: function(event) {
    event.preventDefault();

    this.close();
  },

  onComplete: function(){
    this.isOpen = false;
    this.popover.dispose();
  },

  open: function(content){
    if (this.isOpen) return this;
    this.isOpen = true;

    var popover = this.popover;
    popover.inject(this.getScrollElement());
    this.position();

    window.addEventListener('orientationchange', this.bound('position'), false);

    (function(){
      // Delay because the event probably still bubbles and would cause 'close' to be called via OuterClickStack
      OuterClickStack.push(this.bound('close'), popover);

      popover.removeClass(this.options.animationClass);
    }).delay(1, this);

    return this;
  },

  close: function(){
    if (!this.isOpen) return this;

    window.removeEventListener('orientationchange', this.bound('position'), false);
    OuterClickStack.erase(this.bound('close'));

    this.popover.addClass(this.options.animationClass).addEvent('transitionComplete:once', this.bound('onComplete'));

    if (Browser.Features.Touch) {
      this.enabled = false;
      window.addEvent('touchend:once', (function() {
        this.enabled = true;
      }).bind(this));
    }

    return this;
  },

  getPosition: function() {
    var element = this.element;
    var popover = this.popover;
    var parent = element.getParent();

    if (this.pos == 'top')
      return parent.offsetTop - popover.offsetHeight - this.options.arrowHeight;

    return parent.offsetTop + element.offsetHeight + this.options.arrowHeight;
  },

  position: function(){
    var popover = this.popover;
    var top = this.getPosition();

    if (top < 0) {
      popover.removeClass('top').addClass('bottom');
      this.pos = 'bottom';
      top = this.getPosition();
    } else if (top + popover.offsetHeight + this.options.arrowHeight > this.getScrollElement().scrollHeight) {
      popover.removeClass('bottom').addClass('top');
      this.pos = 'top';
      top = this.getPosition();
    }

    this.popover.setStyle('top', top);
  },

  getScrollElement: function() {
    return this.element.getParent(this.options.scrollSelector);
  }

});
