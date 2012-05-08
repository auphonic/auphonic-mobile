(function() {

View.Controller = new Class({

  Implements: [Options, Class.Binds],

  _current: null,

  options: {
    templateId: null,
    contentSelector: null,
    headerSelector: null,
    backSelector: null
  },

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);
    this.backElement = document.getElement(this.options.backSelector) || new Element('div');

    this.attach();
  },

  attach: function() {
    this.getBackElement().addEvent('click', this.bound('clickBack'));
  },

  detach: function() {
    this.getBackElement().removeEvent('click', this.bound('clickBack'));
  },

  push: function(stack, object) {
    if (!object) return this;

    var rotated = false;
    if (!this.isCurrent(stack)) {
      rotated = true;
      this.rotate(stack);
    }

    var current = this._current;
    var isImmediate = rotated;
    var hasURL = current.hasURL(object.getURL());
    var previous = !isImmediate && current.getCurrent().toElement();
    current.push(object);

    var back = this.getBackElement();
    if (current.getLength() > 1) {
      back.removeClass('hidden');
      (function() {
        back.addClass('show');
      }).delay(10);
    } else {
      back.transition(function() {
        back.addClass('hidden');
      }).removeClass('show');
    }
    UI.transition(this.element, previous, object.render(), {
      isImmediate: isImmediate,
      direction: hasURL ? 'left' : 'right'
    });

    return this;
  },

  pop: function() {
    var current = this._current;
    if (current) this.push(current.getName(), current.getPrevious());

    return this;
  },

  rotate: function(stack) {
    this.element.empty();
    this._current = new View.Stack(this, stack);

    return this;
  },

  isCurrent: function(stack) {
    return (this._current && stack == this._current.getName());
  },

  clickBack: function(event) {
    event.preventDefault();

    this.pop();
  },

  getBackElement: function() {
    return this.backElement;
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
