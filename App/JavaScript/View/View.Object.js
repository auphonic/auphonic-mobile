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
    var content = view.getOption('contentSelector');
    var header = view.getOption('headerSelector');

    var element = document.id(template).getFirst().clone();
    element.getElement(content).set('html', this.getContent());

    document.getElement(header).set('text', this.getTitle());

    return this.element = element;
  }

});

})();
