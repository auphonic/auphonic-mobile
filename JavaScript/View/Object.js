var Core = require('Core');
var typeOf = Core.typeOf;
var Class = Core.Class;
var Events = Core.Events;
var Element = Core.Element;

var UI = require('UI');

var getTypePlugin = function(type) {
  return function(element) {
    element.addClass(type);
    return {detach: function() {
      element.removeClass(type);
    }};
  };
};

module.exports = new Class({

  Implements: [Events],

  Properties: {
    URL: null,
    title: null,
    content: null,
    stack: null,

    action: null,
    back: null,
    backTitle: null,
    backOptions: null,

    scrollTop: 0,
    plugins: null

    /* Virtual Properties
    type: null,
    */

    /*
    onShow: function() {},
    onHide: function() {}
    */
  },

  activePlugins: [],

  initialize: function(options) {
    if (options) for (var option in options){
      if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
      this.addEvent(option, options[option]);
    }

    if (options && options.type)
      (options.plugins || (options.plugins = [])).push(getTypePlugin(options.type));

    this
      .setURL(options.url)
      .setTitle(options.title)
      .setBackTitle(options.backTitle)
      .setContent(options.content)
      .setAction(options.action)
      .setBack(options.back)
      .setBackOptions(options.backOptions)
      .setPlugins(options.plugins);
  },

  toElement: function() {
    return this.element;
  },

  setElement: function(element) {
    this.element = document.id(element);
    return this;
  },

  setTitle: function(title) {
    this.title = title;
    var view = this.getView();
    if (view && view.getCurrentObject() == this)
      view.getTitle().setTitle(title);

    return this;
  },

  render: function() {
    if (this._isRendered) return this.element;

    this._isRendered = true;
    var view = this.getView();
    if (!view) return;

    var element = this.element || Element.from(UI.render(view.getOption('template')));
    var selector = view.getOption('contentSelector');

    this.setElement(element);
    element.getElement(selector).set('html', this.getContent());
    return element;
  },

  attachPlugins: function() {
    if (!this.element) return;
    this.detachPlugins();

    var element = this.element;
    var activePlugins = this.activePlugins = [];
    Array.each(this.getPlugins(), function(fn) {
      activePlugins.push(fn(element));
    });

    return this;
  },

  detachPlugins: function() {
    this.activePlugins.invoke('detach');
    this.activePlugins = [];

    return this;
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
    var selector = this.getView().getOption('scrollableSelector');
    var element = this.toElement();
    return element && (element.match(selector) ? element : element.getElement(selector));
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
    return Object.append({}, previous && previous.getBackOptions(), {
      title: (previous && (previous.getBackTitle() || previous.getTitle())) || 'Back'
    });
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
  },

  invalidate: function() {
    this.isInvalidated = true;
    this.fireEvent('invalidate');
    return this;
  },

  isInvalid: function() {
    return !!this.isInvalidated;
  },

  isRendered: function() {
    return !!this._isRendered;
  }

});
