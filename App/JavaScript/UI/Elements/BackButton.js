(function() {

this.UI.BackButton = new Class({

  Extends: UI.Element,

  Implements: [Class.Binds],

  Properties: {
    view: null
  },

  template: 'ui-back',

  initialize: function(container, element, options) {
    this.parent(container, element, options);

    this.attach();
  },

  attach: function() {
    this.element.addEvent('click', this.bound('click'));
  },

  detach: function() {
    this.element.removeEvent('click', this.bound('click'));
  },

  click: function(event) {
    event.preventDefault();

    if (UI.isLocked() || UI.isHighlighted(this)) return;

    UI.highlight(this);

    this.getView().pop();
  },

  update: function(options, data) {
    var next;

    if (this.getView().getCurrent().getLength() > 1)
      next = this.create(data);

    UI.transition(this.container, this.toElement(), next && next.toElement(), options);

    return next || this;
  }

});

})();
