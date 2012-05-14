(function() {

View.Controller = new Class({

  Implements: [Options, Class.Binds, Events],

  _current: null,

  options: {
    templateId: null,
    contentSelector: null,
    headerSelector: null,
    titleSelector: null,
    scrollableSelector: null,
    backButton: null,
    onTransitionEnd: null
  },


  initialize: function(element, options) {
    if (!options) options = {};
    this.backButton = options.backButton;
    delete options.backButton;

    this.setOptions(options);

    this.element = document.id(element);
    this.header = document.getElement(this.options.headerSelector);
    this.backButton.setView(this);
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

    this.backButton.update(isImmediate);

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

  onTransitionEnd: function() {
    this.fireEvent('transitionEnd');
  },

  getTitleElement: function() {
    return this.titleElement;
  },

  createTitleElement: function(title) {
    return new Element(this.options.titleSelector).set('text', title).set('title', title);
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
