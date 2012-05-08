(function() {

var preventDefault = function(event) {
  event.preventDefault();
};

var click = function(event) {
  event.preventDefault();

  this.getParent('ul').getElements('li a.active').removeClass('active');
  this.addClass('active');

  History.push(this.get('href'));
};

UI.register('.prevent, footer, header', function(elements) {
  elements.addEvent('touchmove', preventDefault);
});

UI.register('a:internal:not(.back)', function(elements) {
  elements.addEvent('click', click);
});

var boot = function() {

  window.scrollTo(0, 1);
  (new ActiveState()).attach();
  (new PreventClickOnScroll('div.scrolling')).attach();

  var isLoggedIn = true;
  // Browser bug: prevent this from firing twice in Chrome
  if (isLoggedIn) UI.Chrome.show({immediate: true});
  else setTimeout(function() {
    History.push('/login');
  }, 100);

  UI.update();

  // Prevent all clicks from working
  window.addEventListener('click', preventDefault, false);

  Views.set('Main', new View.Controller('main', {
    templateId: 'container-template',
    contentSelector: 'div.panel-content',
    headerSelector: 'header',
    titleSelector: 'h1',
    backSelector: 'header a.back',
    onTransitionEnd: function() {
      var stack = this.getCurrent();
      var previous = stack && stack.getPrevious();
      if (!stack || !previous) return;

      previous.toElement().getElements('ul li a.active').removeClass('active');
    }
  }));

  Views.get('Main').push('default', new View.Object({
    url: '/',
    title: 'Home',
    content: UI.render('default')
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
