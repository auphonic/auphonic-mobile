(function(){

Form.EmptySelect = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    placeholder: '! > .placeholder'
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
    this.attach();
  },

  attach: function() {
    this.element.addEvents({
      'focus:once': this.bound('focusOnce'),
      focus: this.bound('focus'),
      blur: this.bound('blur')
    });
  },

  detach: function() {
    this.element.removeEvents({
      'focus:once': this.bound('focusOnce'),
      focus: this.bound('focus'),
      blur: this.bound('blur')
    });
  },

  focusOnce: function() {
    this.element.getElement(this.options.placeholder).dispose();
    this.element.removeClass('empty').fireEvent('change');
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

})();
