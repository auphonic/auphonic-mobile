var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Browser = Core.Browser;
var Element = Core.Element;

var OuterClickStack = require('OuterClickStack');

var UI = require('UI');

var baseKey = 'popover:baseElement';

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    selector: 'div.popover',
    scrollSelector: 'div.scrollable',
    positionProperty: 'data-position',
    eventProperty: 'data-popover-event',
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
    popover.store(baseKey, this.element);
    this.pos = popover.get(this.options.positionProperty);
    this.event = this.element.get(this.options.eventProperty) || 'click';

    this.attach();
  },

  attach: function(){
    this.element.addEvent(this.event, this.bound('onClick'));
    this.popover.addEvent('click', this.bound('onPopoverClick'));
  },

  detach: function(){
    this.element.removeEvent(this.event, this.bound('onClick'));
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

    // Restore previous settings
    if (this.toggledTo) {
      this.toggle(this.toggledTo == 'bottom' ? 'top' : 'bottom');
      this.toggledTo = null;
    }
  },

  open: function(content){
    if (this.isOpen) return this;
    this.isOpen = true;

    var popover = this.popover;
    popover.inject(this.getScrollElement());
    this.position();

    window.addEventListener('orientationchange', this.bound('position'), false);

    if (this.shouldDisableElement()) {
      UI.disable(this.element);
      window.addEvent('touchend', this.bound('enableElement'));
    }

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
    var container = element;

    if (!container.offsetTop) container = element.getParent();

    if (this.pos == 'top')
      return container.offsetTop - popover.offsetHeight - this.options.arrowHeight;

    return container.offsetTop + element.offsetHeight + this.options.arrowHeight;
  },

  position: function(){
    var element = this.getScrollElement();
    var popover = this.popover;
    var top = this.getPosition();

    if (top < 0 || top < element.scrollTop) {
      this.toggle('bottom');
      top = this.getPosition();
    } else if (top + popover.offsetHeight + this.options.arrowHeight > element.scrollHeight) {
      this.toggle('top');
      top = this.getPosition();
    }

    this.popover.setStyle('top', top);
  },

  toggle: function(position) {
    this.toggledTo = position;
    if (position == 'bottom') {
      this.popover.removeClass('top').addClass('bottom');
      this.pos = 'bottom';
    } else {
      this.popover.removeClass('bottom').addClass('top');
      this.pos = 'top';
    }
  },

  getScrollElement: function() {
    return this.element.getParent(this.options.scrollSelector);
  },

  enableElement: function() {
    (function() {
      UI.enable(this.element);
    }).delay(10, this);
  },

  shouldDisableElement: function() {
    return (this.event != 'click');
  }

});

module.exports.getBaseElement = function(element) {
  return element.retrieve(baseKey);
};
