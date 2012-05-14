(function() {

var preventDefault = function(event) {
  event.preventDefault();
};

var preventScroll = function(event) {
  if (UI.isLocked()) event.preventDefault();
};

var click = function(event) {
  event.preventDefault();

  if (event.touches && event.touches.length > 1) return;
  if (UI.isLocked()) return;
  if (UI.isHighlighted(this)) return;

  UI.highlight(this);

  History.push(this.get('href'));
};

var boot = function() {
  (new ActiveState({
    active: 'active',
    hit: 'hit',
    hitProperty: 'data-hit-target'
  })).attach();
  if (Browser.Platform.ios) {
    (new PreventClickOnScroll('div.scrollable')).attach();
  }

  LocalStorage.set('User', {
    name: 'cpojer',
    email: 'christoph.pojer@gmail.com'
  });

  var isLoggedIn = !!LocalStorage.get('User');
  if (isLoggedIn) UI.Chrome.show({immediate: true});

  // Browser bug: prevent this from firing twice in Chrome
  setTimeout(function() {
    History.push(isLoggedIn ? '' : '/login');
  }, 200);

  // Prevent all clicks from working normally
  window.addEventListener('click', preventDefault, false);

  // Prevent Scroling when the UI is locked
  window.addEventListener('touchmove', preventScroll, false);

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

  Controller.define('/', function() {

    UI.Chrome.show();

    Views.get('Main').push('default', new View.Object({
      title: 'Home',
      content: UI.render('default')
    }));

  });

  var backButton = new BackButton(document.getElement('header a.back'));

  Views.set('Main', new View.Controller('main', {
    templateId: (Browser.Platform.ios ? 'ios-' : '') + 'container-template',
    contentSelector: 'div.panel-content',
    headerSelector: 'header',
    titleSelector: 'h1',
    scrollableSelector: 'div.scrollable',
    backButton: backButton,
    onTransitionEnd: function() {
      var stack = this.getCurrent();
      var previous = stack && stack.getPrevious();
      if (!stack || !previous) return;

      previous.toElement().getElements('ul li a.selected').removeClass('selected');
    }
  }));
};

var fired;
var ready = function(){
  if (fired) return;
  fired = true;

  boot();
};


document.addEventListener('deviceready', ready, false);
window.addEventListener('DOMContentLoaded', ready, false);

})();
