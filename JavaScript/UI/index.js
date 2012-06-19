var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

var DynamicMatcher = require('DynamicMatcher');

var UI = module.exports = new DynamicMatcher;

UI.BackButton = require('./Elements/BackButton');
UI.ActionButton = require('./Elements/ActionButton');
UI.Title = require('./Elements/Title');

var Handlebars = require('Library/ThirdParty/Handlebars');

var cache = {};
var locked = false;

var preventDefault = function(event) {
  event.preventDefault();
};

Object.append(UI, {

  render: function(name, data) {
    if (!cache[name]) cache[name] = Handlebars.compile(document.id(name + '-template').get('html'));
    if (!data) data = '';
    return cache[name](typeof data == 'string' ? {content: data} : data);
  },

  transition: function(container, previous, current, options) {
    var isImmediate = options && options.immediate;
    var direction = (options && options.direction) || 'right';
    var oppositeDirection = (direction == 'right' ? 'left' : 'right');
    var onTransitionEnd = options && options.onTransitionEnd;

    if (current) {
      if (!isImmediate) current.addClass(direction);
      container.adopt(current);

      current.transition({immediate: isImmediate}, function() {
        if (onTransitionEnd) onTransitionEnd();
      });
    }

    if (previous) {
      if (isImmediate) previous.dispose();
      else previous.transition(function() {
        this.dispose();
      });
    }

    (function() {
      if (previous) previous.addClass(oppositeDirection);
      if (current) current.removeClass(direction);
    }).delay(50, this); // Use a higher delay to account for DOM insertion delays

    this.update(container);
  },

  highlight: function(element) {
    element = document.id(element);

    element.addClass('selected');
    var parent = element.getParent('li');
    if (!parent) return;

    var lists = parent.getSiblings().getElements('a.selected');
    Elements.removeClass(lists.flatten(), 'selected');
  },

  isHighlighted: function(element) {
    return document.id(element).hasClass('selected'); // oh no, state management!
  },

  disable: function(container, exception) {
    if (!container) container = document.body;

    container.addEvent('touchmove', preventDefault)
      .addClass('disable-events');

    if (exception) exception.addClass('enable-events');
  },

  enable: function(container, exception) {
    if (!container) container = document.body;

    container.removeEvent('touchmove', preventDefault)
      .removeClass('disable-events');

    if (exception) exception.removeClass('enable-events');
  }

});

var isVisible = false;

UI.Chrome = {

  show: function(options) {
    if (isVisible) return;

    var main = document.id('ui');
    var login = document.id('login');
    var splash = document.id('splash');

    main.show();
    login.transition(options).addClass('fade');
    splash.transition(options, function() {
      isVisible = true;
      login.hide();
      splash.hide();
    }).addClass('fade');
  },

  hide: function(options) {
    if (!isVisible) return;

    var main = document.id('ui');
    var login = document.id('login');
    var splash = document.id('splash');

    login.show();
    splash.show();
    (function() {
      login.transition(options).removeClass('fade');
      splash.transition(options, function() {
        isVisible = false;

        document.getElements('footer a.selected').removeClass('selected');

        main.hide();
      }).removeClass('fade');
    }).delay(50);
  }

};
