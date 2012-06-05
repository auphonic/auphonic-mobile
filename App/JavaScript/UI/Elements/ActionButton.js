(function() {

this.UI.ActionButton = new Class({

  Extends: UI.Element,

  template: 'ui-action',

  options: {
    className: 'show',
  },

  update: function(options, data) {
    var element = this.element;
    element.transition(options, element.dispose.bind(element));
    (function() {
      element.removeClass(this.options.className);
    }).delay(50, this);

    if (!data) return this;

    var next = this.create(data);
    this.container.adopt(next);
    next.show(options);

    return next;
  },

  show: function(options) {
    var isImmediate = options && options.immediate;
    var className = this.options.className;
    var element = this.toElement();

    element.transition(options).removeClass('hidden');
    if (isImmediate) element.addClass(className);
    else (function() {
      element.addClass(className);
    }).delay(50);

    return this;
  }

});

})();
