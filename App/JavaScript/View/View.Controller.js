(function() {

View.Controller = new Class({

  Implements: [Options, Class.Binds, Events],

  _current: null,

  options: {
    templateId: null,
    contentSelector: null,
    scrollableSelector: null,

    back: null,
    title: null,
    action: null,

    onTransitionEnd: null
  },


  initialize: function(element, options) {
    if (!options) options = {};
    this.back = options.back;
    this.title = options.title;
    this.action = options.action;
    delete options.back;
    delete options.title;
    delete options.action;

    this.setOptions(options);

    this.element = document.id(element);
    this.back.setView(this);
    this.title.setView(this);
    this.action.setView(this);
  },

  push: function(stack, object) {
    if (!object) return this;

    var rotated = false;
    if (!this.isCurrent(stack)) {
      if (this._current) this._current.getCurrent().fireEvent('hide', ['left']);
      rotated = true;
      this.rotate(stack);
    }

    object.setURL(History.getPath());

    var current = this._current;
    var isImmediate = rotated;
    var direction = current.hasObject(object) ? 'left' : 'right';
    var previous;
    if (!isImmediate) previous = current.getCurrent().rememberScroll();

    if (previous) previous.fireEvent('hide', [direction]);
    current.push(object);

    var options = {
      immediate: isImmediate,
      direction: direction
    };

    this.back = this.back.update(options, object.getBackTemplate());
    this.title = this.title.update(options, object.getTitleTemplate());
    this.action = this.action.update(options, object.getAction());

    UI.lock();

    object.fireEvent('show', [direction]);

    UI.transition(this.element, previous && previous.toElement(), object.render(), {
      immediate: isImmediate,
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

  getCurrentView: function() {
    return this._current.getCurrent();
  },

  onTransitionEnd: function() {
    UI.unlock();
    this.fireEvent('transitionEnd');
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
