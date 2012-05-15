(function() {

var UI = this.UI = new DynamicMatcher;

var cache = {};
var locked = false;

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

  lock: function() {
    (function() {
      Element.disableCustomEvents();
    }).delay(0);
    locked = true;
  },

  unlock: function() {
    (function() {
      Element.enableCustomEvents();
    }).delay(0);
    locked = false;
  },

  isLocked: function() {
    return locked;
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

})();
