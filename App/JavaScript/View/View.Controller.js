(function() {

View.Controller = new Class({

  Implements: [Options],

  _stacks: {},
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
    if (!this.isCurrent(stack)) this.rotate(stack);

    var current = this._current;
    var isImmediate = (current.getLength() === 0);
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
    this._current = this.getStack(stack);
  },

  getStack: function(stack) {
    var stacks = this._stacks;
    if (!stacks[stack]) stacks[stack] = new View.Stack(this, stack);

    return stacks[stack];
  },

  isCurrent: function(stack) {
    return (this._current && stack == this._current.getName());
  },

  getOption: function(name) {
    return this.options[name] || null;
  }

});

})();
