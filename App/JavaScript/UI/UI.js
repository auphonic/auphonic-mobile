(function() {

var UI = this.UI = new DynamicMatcher;

var cache = {};

UI.render = function(name, data) {
  if (!cache[name]) cache[name] = Handlebars.compile(document.id(name + '-template').get('html'));
  if (!data) data = '';
  return cache[name](typeof data == 'string' ? {content: data} : data);
};

UI.transition = function(container, previous, current, options) {
  var isImmediate = options && options.isImmediate;
  var direction = (options && options.direction) || 'right';
  var oppositeDirection = (direction == 'right' ? 'left' : 'right');

  if (!isImmediate) current.addClass(direction);
  container.adopt(current);
  if (!isImmediate) (function() {
    previous.transition(function() {
      this.dispose();
    }).addClass(oppositeDirection);
    current.removeClass(direction);
  }).delay(10);

  this.update(container);
};

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
    }).delay(10);
  }

};

})();
