var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

var History = require('History');

var Spinner = require('Spinner');

var Stack = require('./Stack');
var UI = require('../UI');

module.exports = new Class({

  Implements: [Options, Class.Binds, Events],

  _current: null,

  options: {
    template: null,
    contentSelector: null,
    scrollableSelector: null,

    back: null,
    title: null,
    action: null,
    indicatorOptions: null,
    smallIndicatorOptions: null,

    indicatorDelay: 500,

    onTransitionEnd: null
  },

  Properties: {
    action: null,
    back: null,
    title: null
  },

  initialize: function(element, options) {
    if (!options) options = {};
    this.back = options.back;
    this.title = options.title;
    this.action = options.action;
    delete options.back;
    delete options.title;
    delete options.action;

    this.setOptions(options);

    this.element = document.id(element);
    this.back.setView(this);
    this.title.setView(this);
    this.action.setView(this);
    this.indicator = new Spinner(this.options.indicatorOptions);
  },

  push: function(stack, object, _options) {
    if (arguments.length == 1) {
      object = stack;
      stack = this.getStack().getName();
    }
    if (!object) return this;

    this.hideIndicator();

    var rotated = false;
    var container;
    if (!this.isCurrentStack(stack)) {
      if (this._current) {
        container = this.getCurrentObject().toElement();
        this.getCurrentObject().fireEvent('hide', ['left']);
      }
      rotated = true;
      this.rotate(stack);
    }

    if (!object.getURL()) object.setURL(History.getPath());

    var current = this._current;
    var isImmediate = (_options && _options.immediate) || rotated;
    var direction = current.hasObject(object) ? 'left' : 'right';
    var previous;
    if (!isImmediate) previous = this.getCurrentObject().rememberScroll();

    // If the only item on the stack is invalid don't do a transition
    if (previous && previous.isInvalid() && this._current.getLength() == 1)
      isImmediate = true;

    current.push(object);
    this.fireEvent('change');
    if (previous) previous.fireEvent('hide', [direction]);

    // Pushing an invalid item on the stack, don't start a transition
    if (object.isInvalid()) return;

    var options = {
      immediate: isImmediate,
      direction: direction
    };

    this.updateElement('back', options, object.getBackTemplate())
      .updateElement('title', options, object.getTitleTemplate())
      .updateElement('action', options, object.getActionTemplate());

    UI.disable();

    // This is an unpleasant and unhappy block of code.
    // It fixes an issue introduced in iOS 6 where replacing a ScrollView with another
    // ScrollView flashes the first one for a short time. While technically not a
    // problem, it has huge implications on user experience who might find this behavior
    // buggy, slow and non-native.
    // This block of code attempts to reuse an existing ScrollView and replaces its contents
    // with the content from the new container. Without doubt, this code will cause unexpected
    // issues in the future. Trust me, it is the right trade off.
    if (this.options.iOSScrollFlashFix && container && isImmediate && !previous) {
      object.setElement(container).render();
      object.fireEvent('show', [direction]);
      UI.update(this.element);
      this.onTransitionEnd.delay(0, this);
    } else {
    // Everything after this is happy code again.
      object.render();
      object.fireEvent('show', [direction]);
      if (isImmediate) this.element.empty();
      UI.transition(this.element, previous && previous.toElement(), object.toElement(), {
        immediate: isImmediate,
        direction: direction,
        onTransitionEnd: this.bound('onTransitionEnd')
      });
    }

    object.attachPlugins();
    object.fireEvent('insert', [direction]);
    object.revertScrollTop();

    return this;
  },

  pop: function() {
    var current = this._current;
    if (current) History.push(current.getPrevious().getURL());

    return this;
  },

  replace: function(object) {
    this.getCurrentObject().toElement().dispose();
    this._current.pop();
    return this.push(this._current.getName(), object, {
      immediate: true
    });
  },

  rotate: function(stack) {
    var object = this.getCurrentObject();
    if (object) object.detachPlugins();
    this._current = new Stack(this, stack);

    return this;
  },

  isCurrentStack: function(stack) {
    return (this._current && stack == this._current.getName());
  },

  getStack: function() {
    return this._current;
  },

  getCurrentObject: function() {
    return this._current && this._current.getCurrent();
  },

  onTransitionEnd: function() {
    UI.enable();
    this.fireEvent('transitionEnd');
  },

  getOption: function(name) {
    return this.options[name] || null;
  },

  updateElement: function(type, options, template) {
    this[type] = this[type].update(options, template);
    return this;
  },

  showIndicator: function(options) {
    if (this.indicatorIsVisible) return;
    if (this.indicatorIsPending) return;
    if (options && options.immediate) {
      UI.disable();
      this._showIndicator(options);
      return;
    }

    // Ignore subsequent showIndicator calls
    this.indicatorIsPending = true;

    // Don't disable the UI if we have cached API resources
    this.disableUITimer = UI.disable.delay(1, UI);
    this.timer = (function() {
      this._showIndicator(options);
    }).delay(this.options.indicatorDelay, this);
  },

  _showIndicator: function(options) {
    if (!this.getStack()) return;
    if (this.indicatorIsVisible) return;

    this.indicatorIsVisible = true;
    this.indicator.spin(this.getCurrentObject().toElement());
  },

  hideIndicator: function() {
    clearTimeout(this.disableUITimer);
    clearTimeout(this.timer);
    this.indicatorIsVisible = false;
    this.indicatorIsPending = false;
    UI.enable();
    this.indicator.stop();
  }

});
