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
  if (UI.isLocked() || UI.isHighlighted(this)) return;

  UI.highlight(this);

  History.push(this.get('href'));
};

var onLabelClick = function() {
  var input = this.getElement('input');
  if (input) input.focus();
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
    History.push(isLoggedIn ? '/preset/new' : '/login');
  }, 200);

  if (Browser.Platform.ios) {
    // Prevent all clicks from working normally
    window.addEventListener('click', preventDefault, false);

    // Prevent Scrolling when the UI is locked
    window.addEventListener('touchmove', preventScroll, false);
  }

  UI.register({

    '.prevent, footer, header': function(elements) {
      elements.addEvent('touchmove', preventDefault);
    },

    '#main a:internal': function(elements) {
      elements.addEvent('click', click);
    },

    'footer a:internal': function(elements) {
      elements.addEvents({
        touchstart: click,
        click: preventDefault
      });
    },

    'textarea.autogrow': Class.Instantiate(Form.AutoGrow),
    'div.checkbox': Class.Instantiate(Form.Checkbox),
    'select.empty': Class.Instantiate(Form.EmptySelect, {
      placeholder: '! > .placeholder'
    }),
    '.swipeable': Class.Instantiate(SwipeAble, {

      selector: '.removable > span',
      scrollableSelector: 'div.scrollable',

      onClick: function() {
        this.container.addClass('fade');
        (function() {
          this.container.addEvent('transitionComplete:once', function() {
            this.destroy();
          }).addClass('out');
        }).delay(10, this);
      },

      onSwipe: function() {
        this.container.addClass('wide');
        this.container.getElement('label').addClass('left');
      },

      onComplete: function() {
        this.container.removeClass('wide');
        this.container.getElement('label').removeClass('left');
      }

    }),

    'label': function(elements) {
      elements.each(function(element) {
        element.onclick = onLabelClick;
      });
    }

  }).update();

  Controller.define('/', function() {

    UI.Chrome.show();

    Views.get('Main').push('default', new View.Object({
      title: 'Home',
      content: UI.render('default')
    }));

  });

  var header = document.getElement('header');
  var back = new UI.BackButton(header, new Element('a'));
  var action = new UI.ActionButton(header, new Element('a'), {
    onClick: click
  });
  var title = new UI.Title(header, new Element('h1'));

  Views.set('Main', new View.Controller('main', {
    templateId: (Browser.Platform.ios ? 'ios-' : '') + 'container-template',
    contentSelector: 'div.panel-content',
    scrollableSelector: 'div.scrollable',

    back: back,
    title: title,
    action: action,

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
