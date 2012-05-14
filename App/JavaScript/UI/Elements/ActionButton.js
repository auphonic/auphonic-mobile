(function() {

this.UI.ActionButton = new Class({

  Extends: UI.Element,

  template: 'ui-action',

  options: {
    className: 'show',
  },

  update: function(previous, options, data) {
    var isImmediate = options && options.immediate;
    var className = this.options.className;

    var element = this.element;
    element.transition(options, element.dispose.bind(element));
    (function() {
      element.removeClass(className);
    }).delay(50);

    if (!data) return this;

    var next = this.create(data);
    var nextElement = next.toElement();
    this.container.adopt(nextElement);
    if (isImmediate) nextElement.addClass(className);

    nextElement.transition(options).removeClass('hidden');
    (function() {
      nextElement.addClass(className);
    }).delay(50);

    return next;
  }

});

})();
