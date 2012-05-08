(function() {

var preventDefault = function(event) {
  event.preventDefault();
};

var click = function(event) {
  event.preventDefault();

  History.push(this.get('href'));
};

UI.register('.prevent, footer', function(elements) {
  elements.addEvent('touchmove', preventDefault);
});

UI.register('a:internal', function(elements) {
  elements.addEvent('click', click);
});

var boot = function() {

  window.scrollTo(0, 1);
  (new ActiveState()).attach();

  var isLoggedIn = true;
  // Browser bug: prevent this from firing twice in Chrome
  if (isLoggedIn) UI.Chrome.show({immediate: true});
  else setTimeout(function() {
    History.push('/login');
  }, 100);

  UI.update();

  Views.set('Main', new View.Controller('main', {
    templateId: 'container-template',
    contentSelector: 'div.panel-content',
    headerSelector: 'header h1',
    backSelector: 'header a.back'
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
