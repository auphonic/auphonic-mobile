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
    var isImmediate = options && options.isImmediate;
    var direction = (options && options.direction) || 'right';
    var oppositeDirection = (direction == 'right' ? 'left' : 'right');
    var onTransitionEnd = options && options.onTransitionEnd;

    if (!isImmediate) current.addClass(direction);
    container.adopt(current);

    if (previous) {
      if (isImmediate) previous.dispose();
      else previous.transition(function() {
        this.dispose();
      });
    }

    UI.lock();

    current.transition({immediate: isImmediate}, function() {
      UI.unlock();
      if (onTransitionEnd) onTransitionEnd();
    });

    (function() {
      if (previous) previous.addClass(oppositeDirection);
      current.removeClass(direction);
    }).delay(50, this); // Use a higher delay to account for dom insertion delays

    this.update(container);
  },

  lock: function() {
    Element.disableCustomEvents();
    locked = true;
  },

  unlock: function() {
    Element.enableCustomEvents();
    locked = false;
  },

  isLocked: function() {
    return locked;
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
        main.hide();
      }).removeClass('fade');
    }).delay(50);
  }

};

})();
