(function() {

View.Object = new Class({

  Properties: {
    URL: null,
    title: null,
    content: null,
    stack: null
  },

  initialize: function(options) {
    this.setURL(options.url).setTitle(options.title).setContent(options.content);
  },

  toElement: function() {
    return this.render();
  },

  render: function() {
    if (this.element) return this.element;

    var stack = this.getStack();
    if (!stack) return;

    var view = this.getStack().getView();
    var template = view.getOption('templateId');
    var selector = view.getOption('contentSelector');

    var element = document.id(template).getFirst().clone();
    element.getElement(selector).set('html', this.getContent());

    return this.element = element;
  }

});

})();
