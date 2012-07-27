var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Browser = Core.Browser;

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    placeholderPosition: '!',
    placeholder: '.placeholder',
    type: 'default'
  },

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = element = document.id(element);

    return this.check(element) || this.setup();
  },

  toElement: function() {
    return this.element;
  },

  setup: function() {
    var type = this.element.get('data-select-type');
    if (type) this.options.type = type;

    this.attach();
  },

  attach: function() {
    if (this.options.type == 'preserve-null-state')
      this.element.addEvent('change', this.bound('change'));
    else
      this.element.addEvent('focus:once', this.bound('focusOnce'));

    this.element.addEvents({
      focus: this.bound('focus'),
      blur: this.bound('blur')
    });
  },

  detach: function() {
    if (this.options.type == 'preserve-null-state')
      this.element.removeEvent('change', this.bound('change'));
    else
      this.element.removeEvent('focus:once', this.bound('focusOnce'));

    this.element.removeEvents({
      focus: this.bound('focus'),
      blur: this.bound('blur')
    });
  },

  removeElement: function() {
    var element = this.element.getElement(this.options.placeholderPosition).getElement(this.options.placeholder);
    if (element) {
      element.dispose();
      this.placeholder = element;
    }

    this.element.removeClass('empty');
  },

  // Only needed in preserve-null-state mode
  recoverElement: function() {
    if (!this.placeholder) return;

    this.placeholder.inject(this.element.getElement(this.options.placeholderPosition));
    this.element.addClass('empty');
  },

  // Only needed in preserve-null-state mode
  change: function() {
    if (this.element.get('value')) this.removeElement();
    else this.recoverElement();
  },

  focusOnce: function() {
    this.removeElement();
    this.element.fireEvent('change');
  },

  focus: function() {
    if (!Browser.Platform.ios) return;

    // Update the forms when the selection changes
    // On iOS the change event is not fired until after
    // the user clicks the done button
    this.timer = this.interval.periodical(250, this);
  },

  blur: function() {
    clearInterval(this.timer);
  },

  interval: function() {
    var value = this.element.getSelected()[0];
    if (value == this.previousValue) return;

    this.previousValue = value;
    this.element.fireEvent('change');
  }

});
