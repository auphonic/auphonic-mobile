var History = require('History');
var Spinner = require('Spinner');

var API = require('API');
var Controller = require('./');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');
var Notice = require('UI/Notice');

var User = require('Store/User');

var APIKeys = require('APIKeys');
var Auphonic = require('Auphonic');
var Platform = require('Platform');

var notice;
var spinner;

Controller.define('/login', function() {
  if (User.isLoggedIn()) {
    History.push('/');
    return;
  }

  UI.hideChrome();

  var login = document.id('login');
  login.set('html', renderTemplate('login', {
    client_id: APIKeys.ID,
    client_secret: APIKeys.secret,
    registerURL: Auphonic.RegisterURL,
    username: User.getPreviousUsername()
  }));

  UI.update(login);

  var form = login.getElement('form');
  form.addEvent('submit', function(event) {
    event.preventDefault();
  });

  var submit = function(event) {
    event.preventDefault();

    if (!spinner) spinner = new Spinner(Auphonic.SpinnerOptions);

    var data = login.serialize();
    var children = login.getChildren().dispose();
    spinner.spin(login);

    var error = function() {
      if (notice) notice.push();
      else notice = new Notice('You entered an invalid username or password. Please try again.', {
        type: 'error'
      });

      spinner.stop();
      login.empty().adopt(children);
    };

    API.authenticate(data).on({
      success: function(response) {
        var access_token = response && response.access_token;
        if (!access_token) {
          error();
          return;
        }

        if (notice) notice.close();
        API.invalidate();

        var user = {token: access_token};
        User.set(user);

        // We need to fetch the real user name in case the user logged in using his email
        API.call('user').on({
          success: function(response) {
            spinner.stop();
            login.empty();
            User.set(Object.append(user, {name: response.data.username}, response.data));
            History.push('/');
          },

          error: error
        });
      },

      error: error
    });
  };

  login.getElement('input[type=submit]').addEvent('click', function(event) {
    submit(event);
  });

  var splash = document.id('splash');
  var height = window.innerHeight;
  var timer;
  var blurTimer;
  login.getElements('input[type=text], input[type=password]').addEvents({

    focus: function() {
      if (!Platform.isAndroid()) return;
      clearTimeout(timer);
      clearTimeout(blurTimer);
      timer = (function() {
        if (window.innerHeight < height) splash.addClass('hide');
        else splash.removeClass('hide');
      }).periodical(200);
    },

    blur: function() {
      if (!Platform.isAndroid()) return;
      blurTimer = (function() {
        clearTimeout(timer);
        splash.removeClass('hide');
      }).delay(200);
    },

    keyup: function(event) {
      if (event.key != 'enter') return;
      submit(event);
    }

  });

  login.show();

});
