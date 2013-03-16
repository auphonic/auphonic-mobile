if (!window.__APP_AVAILABLE) {

var Core = require('Core');
var Class = Core.Class;
var Element = Core.Element;
var Browser = Core.Browser;

var Handlebars = require('Handlebars');
require('Templates');

// Load PowerTools! Extensions
require('Class-Extras');
require('Custom-Event');
require('Mobile');

// Load Extensions
require('Extensions/Array');
require('Extensions/Element');
require('Extensions/HandlebarsHelper');
require('Extensions/Transition');
require('Extensions/Slick');
require('Extensions/Object');

// Dev Environment setup
require('Dev');

// Set up Formatters
require('App/Data');
require('App/OutgoingService');
var Data = require('App/Data');
var User = require('Store/User');

// Load Controllers
var Controller = require('Controller');
require('Controller/Login');
require('Controller/Preset');
require('Controller/Production');
require('Controller/Recording');

var History = require('History');
var Form = require('Form');
var ActiveState = require('Browser/ActiveState');
var PreventClickOnScroll = require('Browser/PreventClickOnScroll');

var API = require('API');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');
var View = require('View');
var Controller = require('Controller');
var SwipeAble = require('UI/Actions/SwipeAble');
var Popover = require('UI/Actions/Popover');
var Notice = require('UI/Notice');
var Spinner = require('Spinner');

var AudioPlayer = require('Player/AudioPlayer');
var WebAudioService = require('Player/WebAudioService');
var CordovaAudioService = require('Player/CordovaAudioService');
var WebIntent = require('Cordova/WebIntent');

var Auphonic = require('Auphonic');
var Platform = require('Platform');

// Register Partials for Handlebars
Handlebars.registerPartial('preset', Handlebars.templates.preset);
Handlebars.registerPartial('production', Handlebars.templates.production);
Handlebars.registerPartial('player', Handlebars.templates.player);
Handlebars.registerPartial('algorithm-popover', Handlebars.templates['algorithm-popover']);

// Monkey Patch for Cordova which sometimes adds file:///
var getPath = History.getPath;
History.getPath = function() {
  return '/' + getPath.call(this).replace(/^\/|^file\:\/\/\//, '');
};

var preventDefault = function(event) {
  event.preventDefault();
};

var cancelText = 'Navigating away will discard all your changes. Press "Stay" to stay.';
// This should catch all important editing URLs
var formURLs = /^\/?(production|preset)\/(edit|new)/i;
var navigate = function(fn) {
  if (formURLs.test(History.getPath()) && navigator.notification) {
    navigator.notification.confirm(cancelText, function(button) {
      if (button == 1) fn();
    }, 'Hey, wait a second!', 'Navigate,Stay');
  } else {
    fn();
  }
};

var popoverSelector = 'div.popover';
var click = function(event) {
  event.preventDefault();
  var href = this.get('href');
  var activeElement = document.activeElement;

  if (!href) return;
  if (event.touches && event.touches.length > 1) return;
  if (activeElement && activeElement.match('input, select, textarea')) activeElement.blur();

  var currentPath = History.getPath();
  var isFooter = !!this.getParent('footer');

  var fn = function() {
    if (UI.isHighlighted(this)) {
      if (!isFooter) return;

      // Tap on footer icon
      if (currentPath == href) {
        // Invalidate and rename stack to force re-evaluation
        View.getMain().getCurrentObject().invalidate();
        View.getMain().getStack().setName('invalid');
      }
    }

    if (!this.getParent(popoverSelector))
      UI.highlight(this);

    History.push(href);
  };

  if (isFooter) navigate(fn.bind(this));
  else fn.call(this);
};

var clickExternal = function(event) {
  event.preventDefault();
  window.open(this.get('href'), '_blank', 'location=yes');
};

var clickEmail = function(event) {
  event.preventDefault();
  var extras = {};
  // This is not a URL parser :)
  var email = this.href.substr(7).split('?subject=');
  extras[WebIntent.EXTRA_EMAIL] = email[0];
  extras[WebIntent.EXTRA_SUBJECT] = decodeURIComponent(email[1]);
  WebIntent.startActivity({
    action: WebIntent.ACTION_SEND,
    type: 'message/rfc822',
    extras: extras
  });
};

var onLabelClick = function(event) {
  event.preventDefault();

  var input = this.getElement('input, select, textarea');
  if (input) input.focus();
};

var onDeleteClick = function(event) {
  if (event) event.preventDefault();

  removeItem(Popover.getBaseElement(this.getParent(popoverSelector)));
};

var removeItem = function(element) {
  element.addClass('fade');
  (function() {
    element.addEvent('transitionComplete:once', function() {
      var event = this.get('data-fire-event');
      var id = this.get('data-id');
      if (event) this.fireEvent(event, [id]);

      this.destroy();
    }).addClass('out');
  }).delay(10);

  var url = element.get('data-api-url');
  var method = element.get('data-method');
  if (url && method) API.call(url, method);
};

// Make the info API call and show the UI on success, or else provide a reload button
var spinner;
var isLoggedIn = User.isLoggedIn();
var load = function(event) {
  if (event) event.preventDefault();

  isLoggedIn = User.isLoggedIn();

  var retry = document.id('retry');
  retry.hide();

  if (!spinner) {
    var nativeSpinner = window.__NATIVE_SPINNER;
    if (nativeSpinner && nativeSpinner.isSpinning()) spinner = nativeSpinner;
    else spinner = new Spinner(Auphonic.SpinnerOptions);
  }

  if (isLoggedIn) spinner.spin(document.id('splash'));
  else spinner.stop();

  API.cacheInfo({
    silent: !isLoggedIn,
    formatter: Data.formatInfos
  }).on({
    success: function() {
      Notice.closeAll();
      if (!isLoggedIn) return;

      spinner.stop();
      UI.showChrome();
      History.push('/');
    },
    error: function() {
      spinner.stop();
      var retry = document.id('retry').show();
      retry.getElement('a').addEvent('click', load);
    }
  });
};

// This is a lot of glue code !
window.__BOOTAPP = function() {
  document.body.addClass(Platform.get());

  load();

  var activeState = (new ActiveState({
    active: 'active',
    hit: 'hit',
    hitProperty: 'data-hit-target'
  }));
  activeState.attach();

  if (Browser.Features.Touch) {
    (new PreventClickOnScroll({
      selector: 'div.scrollable',
      contentSelector: 'div.scroll-content',
      activeState: activeState
    })).attach();

    // Prevent all clicks from working normally
    window.addEventListener('click', preventDefault, false);
  }

  if (Platform.isIOS()) {
    var iPhone5 = (window.screen.height == 568);
    if (!iPhone5) UI.setTransitionDelay(50);
  }

  if (Platform.isAndroid()) {
    document.addEventListener('backbutton', function() {
      if (UI.isDisabled()) return;
      var main = View.getMain();
      var stack = main.getStack();
      var stackLength = stack && stack.getLength();
      navigate(function() {
        if (stackLength <= 1) navigator.app.exitApp();
        else main.pop();
      });
    }, false);
  }

  document.body.adopt(Element.from(renderTemplate('ui')));

  UI.register({

    '#main a:external, a.register, div.notice-inner a:external': function(elements) {
      elements.addEvent('click', clickExternal);
    },

    '#main a:internal, div.popover a:internal': function(elements) {
      elements.addEvent('click', click);
    },

    'a:email': function(elements) {
      elements.addEvent('click', Platform.isAndroid() ? clickEmail : clickExternal);
    },

    'footer a:internal': function(elements) {
      elements.addEvents({
        touchstart: click,
        click: preventDefault
      });
    },

    'a.deleteable': function(elements) {
      elements.addEvent('click', onDeleteClick);
    },

    'label.info, .show-popover': Class.Instantiate(Popover, {
      selector: popoverSelector,
      scrollSelector: 'div.scrollable',
      positionProperty: 'data-position',
      eventProperty: 'data-popover-open-event',
      closeEventProperty: 'data-popover-close-event',
      openDelay: 'data-popover-open-delay',
      animationClass: 'fade',
      arrowHeight: 14
    }),

    'input[data-clearable]': Class.Instantiate(Form.Clearable, {
      className: 'clearable-visible'
    }),
    'div.checkbox': Class.Instantiate(Form.Checkbox),
    'textarea.autogrow': Class.Instantiate(Form.AutoGrow),

    'select.empty': Class.Instantiate(Form.EmptySelect, {
      placeholderPosition: '!',
      placeholder: '.placeholder',
    }),

    'label': function(elements) {
      // Show the keyboard immediately without a 300ms delay (iOS 6 feature)
      elements.addEvent('click', onLabelClick);
      // However, without this, the keyboard will go away again immediately
      elements.each(function(element) {
        element.onclick = onLabelClick;
      });
    },

    '.player': Class.Instantiate(AudioPlayer, {
      selector: '[data-media]',
      durationSelector: '[data-duration]',
      localSelector: '[data-local]',
      chapterSelector: '[data-chapters]',
      currentTimeSelector: 'div.player-details div.current-time',
      chapterMarkSelector: 'div.player-details div.chapter-mark',
      playSelector: 'a.play',
      waveformSelector: 'div.waveform',
      positionSelector: 'div.waveform div.position',
      spinnerOptions: Auphonic.PlayerSpinnerOptions,

      getAudioService: function() {
        // Use CordovaAudioService for local files because it is faster/better/prettier
        return (this.isLocal && window.Media || Platform.isAndroid()) ? CordovaAudioService : WebAudioService;
      },

      onSetup: function() {
        View.getMain().getCurrentObject().addEvent('hide', this.bound('reset'));
      },

      onSeek: function(position, pixel) {
        var waveform = this.getWaveform();
        var popover = waveform.getInstanceOf(Popover);
        var popoverElement = popover.getPopover();
        popoverElement.set('text', Data.formatDuration(position / 1000, ' ', true));

        var reposition = function() {
          // Checking if we overflow the screen on the right
          var waveformLeft = waveform.offsetLeft;
          var bodyWidth = document.body.offsetWidth;
          var width = popoverElement.offsetWidth;
          var left = pixel + waveformLeft - width / 2;
          var overflow = (left + width + 10) - bodyWidth;
          if (overflow > 0) left -= overflow;
          popoverElement.setStyle('left', left);
        };

        reposition();
        if (!popover.isOpen() && popover.getOpenDelay())
          reposition.delay(popover.getOpenDelay());
      }
    }),

    '[data-belongs-to]': function(elements) {
      elements.each(function(element) {
        if (element.retrieve(':belongs-to-attached')) return;
        element.store(':belongs-to-attached', true);
        var owner = document.getElement('input[name=' + element.get('data-belongs-to') + ']');
        if (!owner) return;

        owner.addEvent('change', function() {
          // Prevent ghost clicks on select elements by disabling them for a short time
          var selects = element.getParent('ul').getElements('select').set('disabled', true);
          (function() {
            selects.set('disabled', false);
            View.getMain().getCurrentObject().resetScroll();
          }).delay(500);

          if (this.get('checked')) element.removeClass('fade');
          else element.addClass('fade');
        });
      });
    }

  });

  if (Platform.isIOS()) UI.register('.swipeable', Class.Instantiate(SwipeAble, {
    selector: '.removable > span',
    scrollableSelector: 'div.scrollable',
    removedClass: 'item-removed',
    onClick: function() {
      removeItem(this.container);
    },
    onSwipe: function() {
      this.container.getElement('> a').addClass('swiped');
    },
    onComplete: function() {
      this.container.getElement('> a').removeClass('swiped');
    }
  }));

  if (Platform.isAndroid()) {
    // Videos break the scroll container. Continuously resetting the scroll container works.
    // Don't update when the user touches the screen.
    var hasTouch = false;
    window.addEventListener('touchstart', function() { hasTouch = true; }, false);
    window.addEventListener('touchend', function() { hasTouch = false; }, false);

    (function() {
      if (hasTouch) return;
      var object = View.getMain().getCurrentObject();
      var element = object && object.toElement();
      if (element && element.getElement('video')) object.resetScroll();
    }).periodical(1500);
  }

  UI.update();

  Notice.setContainer(document.body);
  Notice.setTemplate(new Element('div.notice').adopt(new Element('div.close'), new Element('div.notice-inner.text')));

  var notice;
  var previousMessage;
  var errorHandler = function(event, data) {
    View.getMain().hideIndicator();
    UI.unhighlight(UI.getHighlightedElement());
    if (event.isPrevented()) return;

    var message = new Element('div');
    if (data && data.status_code) message.adopt([
      new Element('h1', {text: 'An error occurred'}),
      new Element('span', {text: 'Please try again or '}),
      new Element('a', {href: Auphonic.IssuesURL, text: 'report a bug'}),
      new Element('span', {text: ' so we can fix this as soon as possible.'})
    ]); else message.adopt([
      new Element('h1', {text: 'A network error occurred'}),
      new Element('span', {text: 'Please put your device in an elevated position to regain Internet access.'})
    ]);

    // If the last notice with the same text is still visible we'll not show another one.
    if (notice && notice.isOpen() && previousMessage == message.get('text')) {
      notice.push();
      return;
    }

    previousMessage = message.get('text');
    notice = new Notice(message, {type: 'error'});
  };

  API.setTimeoutHandler(errorHandler);
  API.setErrorHandler(errorHandler);

  UI.addEvents({
    enable: Popover.enable,
    disable: Popover.disable
  });

  var header = document.getElement('header');
  var back = new UI.BackButton(header, new Element('a'));
  var action = new UI.ActionButton(header, new Element('a'), {
    onClick: click
  });
  var title = new UI.Title(header, new Element('h1'));

  View.setMain(new View.Controller('main', {
    template: 'container',
    contentSelector: 'div.scroll-content',
    scrollableSelector: 'div.scrollable',

    back: back,
    title: title,
    action: action,
    indicatorOptions: Auphonic.ViewSpinnerOptions,
    smallIndicatorOptions: Auphonic.ViewSpinnerOptionsSmall,
    indicatorDelay: 500,

    iOSScrollFlashFix: Platform.isIOS() && Auphonic.EnableIOSScrollFlashFix,

    onChange: function(options) {
      var stack = this.getStack();
      var stackName = stack.getName();
      var footer = document.getElement('footer');
      var title = this.getTitle();
      var element = title.toElement();

      UI.highlight(footer.getElement('.' + stackName));
      element.addClass(stackName);

      if (Platform.isAndroid()) {
        footer.transition(options);
        (function() {
          var currentElement = this.getCurrentObject().getScrollableElement();
          var back = element.getElement('span.back');
          if (stack.getLength() == 1) {
            currentElement.removeClass('big');
            footer.removeClass('left');

            back.setStyle('visibility', 'hidden');
          } else {
            currentElement.addClass('big');
            footer.addClass('left');
            back.setStyle('visibility', 'visible');
            back.getParent('a').addClass('selectable').addEvent('click', function(event) {
              navigate(function() {
                title.back(event);
              });
            });
          }
        }).delay(1, this);
      }
    },

    onTransitionEnd: function() {
      if (Platform.isAndroid())
        this.getBack().toElement().getSiblings('.button-left').dispose();

      var stack = this.getStack();
      var previous = stack && stack.getPrevious();
      if (previous && previous.isRendered()) previous.toElement().getElements('ul li a.selected').removeClass('selected');
    }
  }));

  Controller.define('/', {isGreedy: true}, function() {
     // Call this so in case of a login with a failed attempt to load the infos we try to load them again.
     // It'll also take care of showing the UI.
    load();

    var main = View.getMain();
    var object = new View.Object({
      title: Platform.isIOS() ? '' : 'Home',
      backTitle: 'Home',
      action: Platform.isAndroid() ? {
        className: 'overflow'
      } : null,
      content: renderTemplate('home', {
        feedback: Auphonic.FeedbackURL
      }),
      onShow: function() {
        // On Android, Add a Popover for Logging-Out
        if (Platform.isAndroid()) {
          var element = main.getAction().toElement();
          var popover = element.getInstanceOf(Popover);
          if (!popover) {
            element.addClass('show-popover').adopt(Element.from(renderTemplate('logout-popover')));
            UI.update(element);
          }
        }
      }
    });

    object.addEvent('show:once', function() {
      window.fireEvent('appStart', null, 1);
    });
    main.pushOn('home', object);
  });

  Controller.define('/about', function() {
    View.getMain().push(new View.Object({
      title: 'App Info',
      content: renderTemplate('about', {
        user: User.get(),
        version: Auphonic.Version,
        repository: Auphonic.RepositoryURL,
        flattr: Auphonic.FlattrURL,
        donate: Auphonic.DonateURL
      })
    }));
  });

  Controller.define('/team', function() {
    View.getMain().push(new View.Object({
      title: 'About Auphonic',
      content: renderTemplate('team', {
        image: Auphonic.TeamImage,
        twitter: Auphonic.TwitterURL,
        facebook: Auphonic.FacebookURL,
        flattr: Auphonic.FlattrURL,
        video: Auphonic.AuphonicVideoURL,
        examples: Auphonic.AudioExamplesURL
      })
    }));
  });

  Controller.define('/external-services', function() {
    View.getMain().showIndicator();

    API.call('services').on({
      success: function(response) {
        View.getMain().push(new View.Object({
          title: 'External Services',
          content: renderTemplate('external-services', {
            url: Auphonic.ExternalServicesURL,
            services: response.data
          })
        }));
      }
    });
  });

  Controller.define('/logout', function() {
    User.reset();
    View.getMain().resetStack();

    History.push('/login');
  });

  if (!isLoggedIn) History.push('/login');

  delete window.__BOOTAPP; // bye!
  window.__APP_AVAILABLE = true;
};

API.setAPIURL(Auphonic.APIURL);
API.setLogHandler(function(data) {
  if (window.__DEV__) return null;

  // We don't want an error in this block to cause cancel the logging
  // or in the worst case end in an infinite loop because of window.onerror
  try {
    var device = window.device;
    data.platform = Platform.get();
    data.os_version = (device && device.version) || Browser.version;
    data.device = ((device && device.name) || '').toLowerCase();
    data.hardware = (device && device.model);
    data.version = Auphonic.Version;

    var stack = View.getMain().getStack();
    data.stackName = stack.getName();
    data.stackItems = stack.map(function(object) {
      return {
        title: object.getTitle(),
        url: object.getURL(),
        i: object.isInvalid(),
        s: object.toElement() ? object.serialize() : null
      };
    });
  } catch(e) {}

  return data;
});

window.onerror = function(msg, url, line) {
  // Just in case…
  UI.enable();
  View.getMain().hideIndicator();

  var stack;
  try {
    throw new Error;
  } catch(e) {
    stack = e.stack;
  }

  API.log({
    type: 'js-error',
    message: msg,
    url: url,
    line: line,
    stack: stack // Praying that this is set.
  });

  return false;
};

}
