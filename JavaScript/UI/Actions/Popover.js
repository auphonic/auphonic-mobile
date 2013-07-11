var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;
var Browser = Core.Browser;

var OuterClickStack = require('OuterClickStack');

var UI = require('UI');

var baseKey = 'popover:baseElement';
var enabled = true;

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Events, Options],

  options: {
    selector: 'div.popover',
    scrollSelector: 'div.scrollable',
    positionProperty: 'data-position',
    openEventProperty: 'data-popover-open-event',
    closeEventProperty: 'data-popover-close-event',
    closeOnTapProperty: 'data-close-on-tap',
    highlightTextProperty: 'data-highlight-text',
    openDelay: 'data-popover-open-delay',
    animationClass: 'fade',
    arrowHeight: 14
  },

  enabled: true,

  initialize: function(element, options) {
    this.setOptions(options);
    element = this.element = document.id(element);
    return this.check(element) || this.setup();
  },

  setup: function() {
    var element = this.element;
    var options = this.options;
    var popover = this.popover = element.getElement(options.selector);
    popover.dispose().removeClass('hidden').addClass(options.animationClass);
    popover.store(baseKey, element);
    this.pos = popover.get(options.positionProperty);
    this.openEvent = element.get(options.openEventProperty) || 'click';
    this.closeEvent = element.get(options.closeEventProperty);
    var closeOnTap = parseInt(popover.get(options.closeOnTapProperty), 10);
    this.closeOnTap = isNaN(closeOnTap) ? true : !!closeOnTap;
    this.openDelay = parseInt(element.get(options.openDelay), 10) || '0';
    this.shouldHighlightText = popover.get(options.highlightTextProperty);

    this.attach();
  },

  attach: function() {
    this.element.addEvent(this.openEvent, this.bound('onClick'));
    if (this.closeEvent) this.element.addEvent(this.closeEvent, this.bound('onClose'));
    if (this.closeOnTap) this.popover.addEvent('click', this.bound('onClose'));
  },

  detach: function() {
    this.element.removeEvent(this.openEvent, this.bound('onClick'));
    if (this.closeEvent) this.element.removeEvent(this.closeEvent, this.bound('onClose'));
    if (this.closeOnTap) this.popover.removeEvent('click', this.bound('onClose'));
  },

  onClick: function(event) {
    if (!this.enabled || !enabled) return;

    event.preventDefault();

    if (this.isOpen()) {
      this.close();
      return;
    }

    if (this.openDelay) {
      this.timer = this.open.delay(this.openDelay, this);
      return;
    }

    this.open();
  },

  onClose: function(event) {
    event.preventDefault();

    this.close();
  },

  onComplete: function() {
    this._isOpen = false;
    this.popover.dispose();
    this.fireEvent('complete');

    // Restore previous settings
    if (this.toggledTo) {
      this.toggle(this.toggledTo == 'bottom' ? 'top' : 'bottom');
      this.toggledTo = null;
    }
  },

  open: function() {
    if (this.isOpen()) return this;
    this._isOpen = true;

    var popover = this.popover;
    var headline = popover.getElement('h1');
    if (headline && this.shouldHighlightText)
      headline.set('text', this.element.get('text'));

    popover.inject(this.getScrollElement());
    this.position();

    window.addEventListener('orientationchange', this.bound('position'), false);

    if (this.shouldDisableElement()) {
      UI.disable(this.element);
      window.addEvent('touchend', this.bound('enableElement'));
    }

    (function() {
      // Delay because the event probably still bubbles and would cause 'close' to be called via OuterClickStack
      OuterClickStack.push(this.bound('close'), popover);

      popover.removeClass(this.options.animationClass);
    }).delay(1, this);

    return this;
  },

  close: function() {
    clearTimeout(this.timer);
    if (!this._isOpen) return this;

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

  position: function() {
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
    return this.element.getParent(this.options.scrollSelector) || document.body;
  },

  enableElement: function() {
    (function() {
      UI.enable(this.element);
    }).delay(10, this);
  },

  shouldDisableElement: function() {
    return (this.openEvent != 'click');
  },

  getPopover: function() {
    return this.popover;
  },

  isOpen: function() {
    return this._isOpen;
  },

  getOpenDelay: function() {
    return this.openDelay;
  }

});

module.exports.getBaseElement = function(element) {
  return element.retrieve(baseKey);
};

module.exports.enable = function() {
  enabled = true;
  return this;
};

module.exports.disable = function() {
  enabled = false;
  return this;
};
