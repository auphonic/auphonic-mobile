(function() {

var preventDefault = function(event) {
  event.preventDefault();
};

var click = function(event) {
  event.preventDefault();

  if (this.hasClass('selected')) return;

  this.addClass('selected');
  var lists = this.getParent('li').getSiblings().getElements('a.selected');
  Elements.removeClass(lists.flatten(), 'selected');

  History.push(this.get('href'));
};

UI.register('.prevent, footer, header', function(elements) {
  elements.addEvent('touchmove', preventDefault);
});

UI.register('#main a:internal', function(elements) {
  elements.addEvent('click', click);
});

UI.register('footer a:internal', function(elements) {
  elements.addEvent('touchstart', click);
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
    scrollableSelector: 'div.scrollable',
    onTransitionEnd: function() {
      var stack = this.getCurrent();
      var previous = stack && stack.getPrevious();
      if (!stack || !previous) return;

      previous.toElement().getElements('ul li a.selected').removeClass('selected');
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
