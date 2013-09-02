var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Element = Core.Element;

var Platform = require('Platform');

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    selector: 'input[type=checkbox]',
    eventSelector: '!',
    thumbSelector: '.thumb',
    leftSelector: '.left',
    className: 'checked',
    max: 32
  },

  initialize: function(container, options) {
    this.setOptions(options);

    this.container = container = document.id(container);
    return this.check(container) || this.setup();
  },

  setup: function() {
    var container = this.container;

    this.thumb = container.getElement(this.options.thumbSelector);
    this.left = container.getElement(this.options.leftSelector);
    this.element = container.getElement(this.options.selector);
    this.element.store(':checkbox', this);

    // Prevent animation
    this.thumb.addClass('immediate');
    this.left.addClass('immediate');
    this.update.delay(1, this);
    (function() {
      this.thumb.removeClass('immediate');
      this.left.removeClass('immediate');
    }).delay(50, this); // Needs a higher delay, assume there won't be a user interaction within 50ms of display

    this.attach();
  },

  attach: function() {
    this.container.getElement(this.options.eventSelector).addEvents({
      touchstart: this.bound('touchstart'),
      touchmove: this.bound('touchmove'),
      touchend: this.bound('touchend'),
      touchcancel: this.bound('touchcancel')
    });

    this.element.addEvent('change', this.bound('preventDefault'));
  },

  detach: function() {
    this.container.getElement(this.options.eventSelector).removeEvents({
      touchstart: this.bound('touchstart'),
      touchmove: this.bound('touchmove'),
      touchend: this.bound('touchend'),
      touchcancel: this.bound('touchcancel')
    });

    this.element.removeEvent('change', this.bound('preventDefault'));
  },

  isChecked: function() {
    return this.element.get('checked');
  },

  update: function() {
    var checked = this.isChecked();
    var className = this.options.className;

    if (checked) this.container.addClass(className);
    else this.container.removeClass(className);
    this.updateStyle(checked ? this.options.max : 0);
  },

  updateStyle: function(delta) {
    delta = Math.max(0, Math.min(delta || 0, this.options.max));
    var style = this.thumb.style;
    var transform = 'translate3d({delta}px, 0, 0)';
    if (Platform.isAndroid()) transform = 'translate({delta}px, 0)';

    style.webkitTransform = style.transform = transform.substitute({delta: delta});

    delta = -(this.options.max - delta);
    var half = this.thumb.offsetWidth / 2;
    style = this.left.style;
    style.webkitTransform = style.transform = transform.substitute({delta: delta - half});
  },

  preventDefault: function(event) {
    if (event) event.preventDefault();
  },

  touchstart: function(event) {
    this.start = event.page.x;
    if (this.isChecked()) this.start -= this.options.max;

    this.delta = 0;
  },

  touchmove: function(event) {
    event.preventDefault();

    this.thumb.addClass('immediate');
    this.left.addClass('immediate');
    this.moved = true;

    this.delta = event.page.x - this.start;
    this.updateStyle(this.delta);
  },

  touchend: function() {
    var checked = this.delta > (this.options.max / 2);
    if (!this.moved) checked = !this.isChecked();
    this.end(checked);
  },

  touchcancel: function() {
    this.end(this.isChecked());
  },

  end: function(checked) {
    this.thumb.removeClass('immediate');
    this.left.removeClass('immediate');
    this.moved = false;

    (function() {
      this.element.set('checked', checked).fireEvent('change');
    }).delay(10, this);
  }

});

Element.Properties.checked = {

  set: function(value) {
    this.setProperty('checked', value);
    var instance = this.retrieve(':checkbox');
    if (instance) instance.update();
    this.fireEvent('change');
  }

};
