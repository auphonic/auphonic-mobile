(function(){

Form.Checkbox = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    selector: 'input[type=checkbox]',
    thumbSelector: '.thumb',
    leftSelector: '.left',
    className: 'checked',
    max: 49
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

    this.update();

    this.attach();
  },

  attach: function() {
    this.container.addEvents({
      touchstart: this.bound('touchstart'),
      touchmove: this.bound('touchmove'),
      touchend: this.bound('touchend'),
      touchcancel: this.bound('touchcancel')
    });

    this.element.addEvent('change', this.bound('preventDefault'));
  },

  detach: function() {
    this.container.removeEvents({
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

    this.container[(checked ? 'add' : 'remove') + 'Class'](this.options.className);
    this.updateStyle(checked ? this.options.max : 0);
  },

  updateStyle: function(delta) {
    delta = Math.max(0, Math.min(delta || 0, this.options.max));
    var style = this.thumb.style;
    style.webkitTransform = style.transform = 'translate3d(' + delta + 'px, 0, 0)';

    delta = (this.options.max - delta);
    style = this.left.style;
    style.webkitTransform = style.transform = 'translate3d(' + -delta + 'px, 0, 0)';
    style.left = delta + 'px';
  },

  preventDefault: function(event) {
    event.preventDefault();
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
      this.element.set('checked', checked);
      this.update();
    }).delay(10, this);
  }

});

})();
