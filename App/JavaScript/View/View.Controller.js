(function() {

View.Controller = new Class({

  Implements: [Options, Class.Binds, Events],

  _current: null,

  options: {
    templateId: null,
    contentSelector: null,
    titleSelector: null,
    backSelector: null,
    onTransitionEnd: null
  },


  backButtonIsVisible: false,

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);
    this.backElement = document.getElement(this.options.backSelector) || new Element('div');
    this.titleElement = document.getElement(this.options.titleSelector) || new Element('div');

    this.attach();
  },

  attach: function() {
    this.getBackButton().addEvent('click', this.bound('clickBack'));
  },

  detach: function() {
    this.getBackButton().removeEvent('click', this.bound('clickBack'));
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

    this.updateBackButton().updateTitle();
    UI.transition(this.element, previous, object.render(), {
      isImmediate: isImmediate,
      direction: hasURL ? 'left' : 'right',
      onTransitionEnd: this.bound('onTransitionEnd')
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

  getCurrent: function() {
    return this._current;
  },

  clickBack: function(event) {
    event.preventDefault();

    this.pop();
  },

  onTransitionEnd: function() {
    this.fireEvent('transitionEnd');
  },

  getBackButton: function() {
    return this.backElement;
  },

  getTitleElement: function() {
    return this.titleElement;
  },

  updateBackButton: function() {
    var back = this.getBackButton();
    if (this._current.getLength() > 1) {
      back.removeClass('hidden');
      (function() {
        this.backButtonIsVisible = true;
        back.addClass('show');
      }).delay(10, this);
    } else if (this.backButtonIsVisible) {
      back.transition((function() {
        this.backButtonIsVisible = false;
        back.addClass('hidden');
      }).bind(this)).removeClass('show');
    }

    return this;
  },

  updateTitle: function() {
    var title = this._current.getCurrent().getTitle();
    this.getTitleElement().set('text', title).set('title', title);

    return this;
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
