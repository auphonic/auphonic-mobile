(function() {

this.UI.Element = new Class({

  Implements: [Options, Events],

  Properties: {
    view: null
  },

  template: null,

  initialize: function(container, element, options) {
    if (!options) options = {};
    this.setOptions(options);

    this.container = container;
    this.element = document.id(element);

    if (options.template) this.template = options.template;
    else this.options.template = this.template;
    if (options.onClick) {
      this.element.addEvent('click', options.onClick);
      // Preserve options (this gets removed by the setOptions call)
      this.options.onClick = options.onClick;
    }
  },

  toElement: function() {
    return this.element;
  },

  transition: function(previous, options) {
    UI.transition(this.container, previous.toElement(), this.element, options);
    return this;
  },

  update: function(options, data) {
    return this.create(data).transition(this, options);
  },

  create: function(data) {
    var element = Element.from(UI.render(this.options.template, data));
    if (data && data.onClick) element.addEvent('click', data.onClick);
    return new this.$constructor(
      this.container,
      element,
      this.options
    ).setView(this.getView());
  }

});

})();
