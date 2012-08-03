var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Element = Core.Element;
var Browser = Core.Browser;

var Queue = require('Queue').Queue;

var templateElement = new Element('div');
var queue = new Queue;
var stack = [];
var container;

module.exports = new Class({

  Implements: [Class.Binds, Options],

  options: {
    type: '',
    duration: 5000
  },

  x: 0,
  y: 0,
  opened: false,

  initialize: function(message, instanceOptions) {
    this.setOptions(instanceOptions);

    var type = this.options.type;
    var duration = this.options.duration;
    var element = this.element = templateElement.clone();

    if (type == 'error') duration = 0;

    element.getElement('.text').set('html', message);
    this.duration = duration;
    this.push();
  },

  attach: function() {
    this.element.addEvent('click', this.bound('closeHandler'));
    return this;
  },

  detach: function() {
    this.element.removeEvent('click', this.bound('closeHandler'));
    return this;
  },

  reset: function() {
    this.x = 0;
    this.y = 0;

    var style = this.element.style;
    style.webkitTransform = style.transform = null;
    style.opacity = null;
    this.opened = false;
  },

  push: function() {
    if (this.opened) {
      this.element.addClass('highlight').addEvent('transitionComplete:once', function() {
        this.removeClass('highlight');
      });
      return this;
    }

    this.element.addEvent('transformComplete:once', queue.bound('next'));
    queue.chain(this.bound('open')).call();
  },

  open: function() {
    if (this.opened) return this;

    this.opened = true;
    stack.unshift(this);
    this.element.inject(container);

    (function() {
      this.reposition();
      this.element.addEvent('transformComplete:once', this.bound('observe'));
    }).delay(50, this);

    return this;
  },

  close: function(direction) {
    if (!this.opened) return this;

    this.element.addEvent('transformComplete:once', this.bound('repositionOnClose'));
    this.detach().setPosition((direction == 'right') ? '100%' : '-100%');

    return this;
  },

  observe: function() {
    this.attach();

    clearTimeout(this.timer);
    var duration = this.duration;
    if (duration) this.timer = this.close.delay(duration, this);
  },

  closeHandler: function(event) {
    event.preventDefault();

    this.close();
  },

  position: function() {
    var height = 0,
      index = stack.indexOf(this);
    for (var i = 0; i < index; i++)
      height += stack[i].getHeight();

    this.setPosition(null, height + 'px');
  },

  reposition: function() {
    stack.invoke('position');

    return this;
  },

  repositionOnClose: function() {
    this.element.dispose();
    this.reset();
    stack.erase(this).invoke('position');
  },

  setPosition: function(x, y) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (typeof this.x != 'string') this.x += 'px';
    if (typeof this.y != 'string') this.y += 'px';

    var style = this.element.style;
    style.webkitTransform = style.transform = "translate3d(" + this.x + ", " + this.y + ", 0)";
    style.opacity = 1;

    return this;
  },

  getHeight: function() {
    return this.element.offsetHeight;
  },

  isOpen: function() {
    return this.opened;
  }

});

module.exports.setContainer = function(newContainer) {
  container = newContainer;
  return this;
};

module.exports.setTemplate = function(element) {
  templateElement = element;
  return this;
};

module.exports.closeAll = function() {
  stack.invoke('close');
  return this;
};
