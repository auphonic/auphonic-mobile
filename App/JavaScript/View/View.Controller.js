(function() {

View.Controller = new Class({

  Implements: [Options, Class.Binds, Events],

  _current: null,

  options: {
    templateId: null,
    contentSelector: null,
    headerSelector: null,
    titleSelector: null,
    backSelector: null,
    scrollableSelector: null,
    onTransitionEnd: null
  },


  backButtonIsVisible: false,

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);
    this.backElement = document.getElement(this.options.backSelector) || new Element('div');
    this.header = document.getElement(this.options.headerSelector);

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

    object.setURL(History.getPath());

    var current = this._current;
    var isImmediate = rotated;
    var direction = current.hasObject(object) ? 'left' : 'right';
    var previous;
    if (!isImmediate) previous = current.getCurrent().rememberScroll();

    current.push(object);

    this.updateBackButton(isImmediate);

    var previousTitle = this.header.getElement(this.options.titleSelector);
    var title = this.createTitleElement(object.getTitle());
    UI.transition(this.header, previousTitle, title, {
      isImmediate: isImmediate,
      direction: direction
    });

    UI.transition(this.element, previous && previous.toElement(), object.render(), {
      isImmediate: isImmediate,
      direction: direction,
      onTransitionEnd: this.bound('onTransitionEnd')
    });

    object.revertScrollTop();

    return this;
  },

  pop: function() {
    var current = this._current;
    if (current) History.push(current.getPrevious().getURL());

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

    if (UI.isLocked()) return;

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

  updateBackButton: function(isImmediate) {
    var back = this.getBackButton();
    if (this._current.getLength() > 1) {
      back.removeClass('hidden');
      (function() {
        this.backButtonIsVisible = true;
        back.transition({immediate: isImmediate}).addClass('show');
      }).delay(50, this);
    } else if (this.backButtonIsVisible) {
      back.transition({immediate: isImmediate}, (function() {
        this.backButtonIsVisible = false;
        back.addClass('hidden');
      }).bind(this)).removeClass('show');
    }

    return this;
  },

  createTitleElement: function(title) {
    return new Element(this.options.titleSelector).set('text', title).set('title', title);
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
