(function() {

View.Controller = new Class({

  Implements: [Options],

  _current: null,

  options: {
    templateId: null,
    contentSelector: null,
    headerSelector: null
  },

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);
  },

  push: function(stack, object) {
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

    UI.transition(this.element, previous, object.render(), {
      isImmediate: isImmediate,
      direction: hasURL ? 'left' : 'right'
    });
  },

  rotate: function(stack) {
    this.element.empty();
    this._current = new View.Stack(this, stack);
  },

  isCurrent: function(stack) {
    return (this._current && stack == this._current.getName());
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
