(function() {

this.UI.BackButton = new Class({

  Implements: [Options, Class.Binds],

  Properties: {
    view: null
  },

  options: {
    className: 'show'
  },

  isVisible: false,

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);

    this.attach();
  },

  attach: function() {
    this.element.addEvent('click', this.bound('click'));
  },

  detach: function() {
    this.element.removeEvent('click', this.bound('click'));
  },

  click: function(event) {
    event.preventDefault();

    if (UI.isLocked()) return;

    this.getView().pop();
  },

  update: function(isImmediate) {
    var element = this.element;
    var className = this.options.className;
    if (this.getView().getCurrent().getLength() > 1) {
      element.removeClass('hidden');
      (function() {
        this.isVisible = true;
        element.transition({immediate: isImmediate}).addClass(className);
      }).delay(50, this);
    } else if (this.isVisible) {
      element.transition({immediate: isImmediate}, (function() {
        this.isVisible = false;
        element.addClass('hidden');
      }).bind(this)).removeClass(className);
    }

    return this;
  }

});

})();
