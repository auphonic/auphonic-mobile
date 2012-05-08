(function() {

View.Object = new Class({

  Properties: {
    URL: null,
    title: null,
    content: null,
    stack: null,
    scrollTop: 0
  },

  initialize: function(options) {
    this.setURL(options.url).setTitle(options.title).setContent(options.content);
  },

  toElement: function() {
    return this.render();
  },

  render: function() {
    if (this.element) return this.element;

    var view = this.getView();
    if (!view) return;

    var template = view.getOption('templateId');
    var selector = view.getOption('contentSelector');

    var element = document.id(template).getFirst().clone();
    element.getElement(selector).set('html', this.getContent());

    return this.element = element;
  },

  rememberScroll: function() {
    var view = this.getView();
    var selector = view.getOption('scrollableSelector');
    var scrollable = this.toElement().getElement(selector);
    if (scrollable) this.setScrollTop(scrollable.scrollTop);

    return this;
  },

  revertScrollTop: function() {
    var view = this.getView();
    var selector = view.getOption('scrollableSelector');
    var scrollable = this.toElement().getElement(selector);
    if (scrollable) scrollable.scrollTop = this.getScrollTop();

    return this;
  },

  getView: function() {
    var stack = this.getStack();
    return stack && stack.getView();
  }

});

})();
