(function() {

View.Controller = new Class({

  Implements: [Options],

  _stacks: {},
  _current: null,

  options: {
    templateId: null,
    contentSelector: null
  },

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);
  },

  push: function(stack, object) {
    if (!this.isCurrent(stack)) this.rotate(stack);

    var current = this._current;
    var transition = (current.getLength() > 0);
    current.push(object);

    var element = object.render();
    if (transition) element.addClass('right');
    this.element.adopt(element);
    if (transition) (function() {
      current.getPrevious().toElement().addClass('left');
      element.removeClass('right');
    }).delay(10, this);

    UI.update(this.element);
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
