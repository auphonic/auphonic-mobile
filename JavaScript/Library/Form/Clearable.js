var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Element = Core.Element;

var wrap = function(klass, set) {
  return function(key) {
    var result = set.apply(this, arguments);
    if (key == 'value') klass.update();
    return result;
  };
};

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    element: 'div.clearable',
    className: 'clearable-visible'
  },

  initialize: function(element) {
    this.element = element = document.id(element);

    return this.check(element) || this.setup();
  },

  setup: function() {
    var element = this.element;
    var autocorrect = element.get('autocorrect');
    element.set = wrap(this, element.set);

    this.hasAutoCorrect = (autocorrect == 'on' || !autocorrect);
    this.clearable = new Element(this.options.element).inject(element, 'after');

    this.update().attach();
  },

  attach: function() {
    this.element.addEvent('keyup', this.bound('update'));
    this.clearable.addEvent('click', this.bound('onClick'));
    this.clearable.onclick = this.bound('onClick'); // iOS
    return this;
  },

  detach: function() {
    this.element.removeEvent('keyup', this.bound('update'));
    this.clearable.removeEvent('click', this.bound('onClick'));
    this.clearable.onclick = null;
    return this;
  },

  onClick: function(event) {
    event.preventDefault();
    this.erase();
  },

  erase: function() {
    // Update is handled by Element.set
    this.element.set('autocorrect', 'off').set('value', '').fireEvent('input').focus();
    if (this.hasAutoCorrect) this.element.set('autocorrect', 'on');
  },

  update: function() {
    if (this.element.get('value')) {
      this.element.addClass(this.options.className);
      this.clearable.show();
    } else {
      this.element.removeClass(this.options.className);
      this.clearable.hide();
    }
    return this;
  }

});
