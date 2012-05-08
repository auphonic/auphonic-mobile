(function() {

var preventDefault = function(event) {
  event.preventDefault();
};

var click = function(event) {
  event.preventDefault();

  if (this.hasClass('selected')) return;
  if (event.touches && event.touches.length > 1) return;

  this.addClass('selected');
  var lists = this.getParent('li').getSiblings().getElements('a.selected');
  Elements.removeClass(lists.flatten(), 'selected');

  History.push(this.get('href'));
};

var boot = function() {
  (new ActiveState()).attach();
  (new PreventClickOnScroll('div.scrolling')).attach();

  LocalStorage.set('User', {
    name: 'cpojer',
    email: 'christoph.pojer@gmail.com'
  });

  var isLoggedIn = !!LocalStorage.get('User');
  if (isLoggedIn) UI.Chrome.show({immediate: true});

  // Browser bug: prevent this from firing twice in Chrome
  setTimeout(function() {
    History.push(isLoggedIn ? '/' : '/login');
  }, 100);

  // Prevent all clicks from working normally
  window.addEventListener('click', preventDefault, false);

  UI.register({

    '.prevent, footer, header': function(elements) {
      elements.addEvent('touchmove', preventDefault);
    },

    '#main a:internal': function(elements) {
      elements.addEvent('click', click);
    },

    'footer a:internal': function(elements) {
      elements.addEvent('touchstart', click);
    }

  }).update();

  Views.set('Main', new View.Controller('main', {
    templateId: 'container-template',
    contentSelector: 'div.panel-content',
    headerSelector: 'header',
    titleSelector: 'h1',
    backSelector: 'header a.back',
    scrollableSelector: 'div.scrollable',
    onTransitionEnd: function() {
      var stack = this.getCurrent();
      var previous = stack && stack.getPrevious();
      if (!stack || !previous) return;

      previous.toElement().getElements('ul li a.selected').removeClass('selected');
    }
  }));
};

Controller.define('/', function() {

  UI.Chrome.show();

  Views.get('Main').push('default', new View.Object({
    url: '/',
    title: 'Home',
    content: UI.render('default')
  }));

});

var fired;
var ready = function(){
  if (fired) return;
  fired = true;

  boot();
};


document.addEventListener('deviceready', ready, false);
window.addEventListener('DOMContentLoaded', ready, false);

})();
