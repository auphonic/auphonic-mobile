var Core = require('Core');
var typeOf = Core.typeOf;
var Class = Core.Class;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Events],

  Properties: {
    URL: null,
    title: null,
    content: null,
    stack: null,

    action: null,
    back: null,

    scrollTop: 0,

    /*
    onShow: function() {},
    onHide: function() {}
    */
  },

  initialize: function(options) {
    if (options) for (var option in options){
      if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
      this.addEvent(option, options[option]);
    }

    this
      .setURL(options.url)
      .setTitle(options.title)
      .setContent(options.content)
      .setAction(options.action)
      .setBack(options.back);
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
    var scrollable = this.getScrollableElement();
    if (scrollable) this.setScrollTop(scrollable.scrollTop);

    return this;
  },

  revertScrollTop: function() {
    var scrollable = this.getScrollableElement();
    if (scrollable) scrollable.scrollTop = this.getScrollTop();

    return this;
  },

  getView: function() {
    var stack = this.getStack();
    return stack && stack.getView();
  },

  getScrollableElement: function() {
    var view = this.getView();
    var selector = view.getOption('scrollableSelector');
    var element = this.toElement();

    return element.match(selector) ? element : element.getElement(selector);
  },

  getTitleTemplate: function() {
    return {
      title: this.getTitle()
    };
  },

  getBackTemplate: function() {
    var back = this.getBack();
    if (back) return back;

    var previous = this.getStack().getPrevious();
    return {
      title: (previous && previous.getTitle()) || 'Back'
    };
  },

  // API consistency
  getActionTemplate: function() {
    return this.getAction();
  },

  serialize: function() {
    return this.toElement().serialize();
  },

  unserialize: function(object) {
    return this.toElement().unserialize(object);
  }

});
