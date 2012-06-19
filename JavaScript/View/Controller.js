var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

var History = require('History');

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
    indicator: null,

    indicatorDelay: 500,

    onTransitionEnd: null
  },


  initialize: function(element, options) {
    if (!options) options = {};
    this.back = options.back;
    this.title = options.title;
    this.action = options.action;
    this.indicator = options.indicator;
    delete options.back;
    delete options.title;
    delete options.action;
    delete options.indicator;

    this.setOptions(options);

    this.element = document.id(element);
    this.back.setView(this);
    this.title.setView(this);
    this.action.setView(this);
  },

  push: function(stack, object) {
    if (!object) return this;

    this.hideLoadingIndicator();

    var rotated = false;
    if (!this.isCurrentStack(stack)) {
      if (this._current) this.getCurrentView().fireEvent('hide', ['left']);
      rotated = true;
      this.rotate(stack);
    }

    object.setURL(History.getPath());

    var current = this._current;
    var isImmediate = rotated;
    var direction = current.hasObject(object) ? 'left' : 'right';
    var previous;
    if (!isImmediate) previous = this.getCurrentView().rememberScroll();

    if (previous) previous.fireEvent('hide', [direction]);
    current.push(object);

    var options = {
      immediate: isImmediate,
      direction: direction
    };

    this.updateElement('back', options, object.getBackTemplate())
      .updateElement('title', options, object.getTitleTemplate())
      .updateElement('action', options, object.getActionTemplate());

    UI.disable();

    object.fireEvent('show', [direction]);

    UI.transition(this.element, previous && previous.toElement(), object.render(), {
      immediate: isImmediate,
      direction: direction,
      onTransitionEnd: this.bound('onTransitionEnd')
    });

    object.revertScrollTop();

    return this;
  },

  pop: function() {
    var current = this._current;
    if (current) History.push(current.getPrevious().getURL());

    return this;
  },

  rotate: function(stack) {
    this.element.empty();
    this._current = new Stack(this, stack);

    return this;
  },

  isCurrentStack: function(stack) {
    return (this._current && stack == this._current.getName());
  },

  getStack: function() {
    return this._current;
  },

  getCurrentView: function() {
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

  showLoadingIndicator: function(options) {
    UI.disable();

    this.timer = (function() {
      this._showLoadingIndicator(options);
    }).delay(this.options.indicatorDelay, this);
  },

  _showLoadingIndicator: function(options) {
    if (!this.getStack()) return;
    if (this.indicatorIsVisible) return;

    this.indicatorIsVisible = true;
    var current = this.getCurrentView();
    var element = current.toElement();

    if (options && options.fade) {
      document.id(this.title).addClass('fade');
      document.id(this.action).addClass('fade');
      document.id(this.back).addClass('fade');
      element.addClass('fade').addEvent('transitionComplete:once', (function() {
        document.id(this.title).dispose();
        document.id(this.action).dispose();
        document.id(this.back).dispose();
      }).bind(this));
    }
    this.indicator.spin(element.getParent());
  },

  hideLoadingIndicator: function() {
    clearTimeout(this.timer);
    this.indicatorIsVisible = false;
    UI.enable();
    this.indicator.stop();
  }

});
