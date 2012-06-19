var Core = require('Core');
var Class = Core.Class;
var Element = Core.Element;
var Browser = Core.Browser;

// Load PowerTools! Extensions
require('Class-Extras');
require('Custom-Event');
require('Mobile');

// Load Extensions
require('Extensions/Element');
require('Extensions/HandlebarsHelper');
require('Extensions/Transition');
require('Extensions/Slick');
require('Extensions/Object');

// Dev Environment setup
require('Dev');

// Monkey Patch for Cordova which sometimes adds file:///
var History = require('History');
var getPath = History.getPath;
History.getPath = function() {
  return '/' + getPath.call(this).replace(/^\/|^file\:\/\/\//, '');
};

// Load Controllers
require('Controller/Login');
require('Controller/Preset');
require('Controller/Production');
require('Controller/Record');
require('Controller/Settings');

var Form = require('Form');
var LocalStorage = require('Utility/LocalStorage');
var ActiveState = require('Browser/ActiveState');
var PreventClickOnScroll = require('Browser/PreventClickOnScroll');

var API = require('API');
var UI = require('UI');
var View = require('View');
var Controller = require('Controller');
var SwipeAble = require('UI/Actions/SwipeAble');
var Popover = require('UI/Actions/Popover');
var Spinner = require('ThirdParty/Spinner');

var preventDefault = function(event) {
  event.preventDefault();
};

var click = function(event) {
  event.preventDefault();
  var href = this.get('href');

  if (!href) return;
  if (event.touches && event.touches.length > 1) return;
  if (UI.isHighlighted(this)) {
    if (!this.getParent('footer')) return;

    // Tap on footer icon
    if (History.getPath() == href) return;
  }

  UI.highlight(this);

  History.push(href);
};

var clickExternal = function(event) {
  event.preventDefault();

  var href = this.get('href');
  window.location.href = href + (~href.indexOf('#') ? '' : '#') + '!external';
};

var onLabelClick = function() {
  var input = this.getElement('input, select');
  if (input) input.focus();
};

var boot = function() {
  LocalStorage.set('User', {
    name: 'cpojer',
    password: 'cpojer-pw',
    email: 'christoph.pojer@gmail.com'
  });

  var isLoggedIn = !!LocalStorage.get('User');
  if (isLoggedIn) UI.Chrome.show({immediate: true});

  // Browser bug in both Chrome and iOS. This delay is necessary
  // at the startup of the app.
  setTimeout(function() {
    History.push(isLoggedIn ? '/' : '/login');
  }, 350);

  var activeState = (new ActiveState({
    active: 'active',
    hit: 'hit',
    hitProperty: 'data-hit-target'
  }));
  activeState.attach();

  if (Browser.Platform.ios) {
    (new PreventClickOnScroll({
      selector: 'div.scrollable',
      contentSelector: 'div.scroll-content',
      activeState: activeState
    })).attach();

    // Fix for scrolling content smaller than the viewport.
    var selector = '.panel-content';
    var update = function(node) {
      if (node) node.style.minHeight = (node.getParent().offsetHeight + 2) + 'px';
    };
    window.addEventListener('touchstart', function(event) {
      var node = event.target;
      if (!node.match(selector)) node = node.getParent(selector);
      if (!node) return;

      update(node);
    });

    UI.addEvent('update', function(element) {
      update(element.match && element.match(selector) ? element : element.getElement(selector));
    });

    // Prevent all clicks from working normally
    window.addEventListener('click', preventDefault, false);
  }

  UI.register({

    '#main a:external': function(elements) {
      elements.addEvent('click', clickExternal);
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

    'label.info': Class.Instantiate(Popover, {
      selector: 'div.popover',
      scrollSelector: 'div.panel-content',
      positionProperty: 'data-position',
      animationClass: 'fade',
      arrowHeight: 14
    }),
    'textarea.autogrow': Class.Instantiate(Form.AutoGrow, {
      margin: 12
    }),
    'div.checkbox': Class.Instantiate(Form.Checkbox),
    'select.empty': Class.Instantiate(Form.EmptySelect, {
      placeholder: '! > .placeholder'
    }),
    '.swipeable': Class.Instantiate(SwipeAble, {

      selector: '.removable > span',
      scrollableSelector: 'div.scrollable',

      onClick: function() {
        var container = this.container;
        container.addClass('fade');
        (function() {
          container.addEvent('transitionComplete:once', function() {
            this.destroy();
          }).addClass('out');
        }).delay(10);

        var url = container.get('data-api-url');
        var method = container.get('data-method');
        if (url && method) API.call(url, method);
      },

      onSwipe: function() {
        this.container.addClass('wide');
        this.container.getElement('> a').addClass('left');
      },

      onComplete: function() {
        this.container.removeClass('wide');
        this.container.getElement('> a').removeClass('left');
      }

    }),

    'label': function(elements) {
      elements.each(function(element) {
        element.onclick = onLabelClick;
      });
    }

  }).update();

  var header = document.getElement('header');
  var back = new UI.BackButton(header, new Element('a'));
  var action = new UI.ActionButton(header, new Element('a'), {
    onClick: click
  });
  var title = new UI.Title(header, new Element('h1'));

  View.set('Main', new View.Controller('main', {
    templateId: (Browser.Platform.ios ? 'ios-' : '') + 'container-template',
    contentSelector: 'div.panel-content',
    scrollableSelector: 'div.scrollable',

    back: back,
    title: title,
    action: action,
    indicator: new Spinner({
      lines: 12,
      length: 10,
      width: 7,
      radius: 13,
      trail: 30,
      color: '#000'
    }),
    indicatorDelay: 500,

    onTransitionEnd: function() {
      var stack = this.getStack();
      var previous = stack && stack.getPrevious();
      if (!stack || !previous) return;

      previous.toElement().getElements('ul li a.selected').removeClass('selected');
    }
  }));

  Controller.define('/', function() {

    UI.Chrome.show();

    View.get('Main').push('default', new View.Object({
      title: 'Home',
      content: UI.render('default')
    }));

  });

  // These are cached during the lifetime of the app so the data
  // can be accessed synchronously.
  API.cacheInfo('info/algorithms');
  API.cacheInfo('info/formats');
};

var fired;
var ready = function(){
  if (fired) return;
  fired = true;

  boot();
};

document.addEventListener('deviceready', ready, false);
window.addEventListener('DOMContentLoaded', ready, false);
