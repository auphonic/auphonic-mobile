var History = require('History');
var Form = require('Form');
var LocalStorage = require('Utility/LocalStorage');
var Spinner = require('Spinner');

var API = require('API');
var Controller = require('./');
var UI = require('UI');
var Notice = require('UI/Notice');

var APIKeys = require('APIKeys');
var Auphonic = require('Auphonic');

var notice;
var spinner;

Controller.define('/login', function() {
  if (LocalStorage.get('User')) {
    History.push('/');
    return;
  }

  UI.hideChrome();

  var login = document.id('login');
  login.set('html', UI.render('login', {
    client_id: APIKeys.ID,
    client_secret: APIKeys.secret,
    registerURL: Auphonic.RegisterURL
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
      else notice = new Notice('Invalid username or password. Please try again.', {
        type: 'error'
      });

      spinner.stop();
      login.empty().adopt(children);
    };

    var name = data.name;
    API.authenticate(data).on({
      success: function(response) {
        spinner.stop();

        if (!/^access_token=/.test(response)) {
          error();
          return;
        }

        if (notice) notice.close();
        login.empty();
        API.invalidate();
        LocalStorage.set('User', {
          name: name,
          access_token: response.substr(13) // minus access_token
        });
        History.push('/');
      },

      error: error
    });
  };

  login.getElement('input[type=submit]').addEvent('click', function(event) {
    submit(event);
  });

  login.getElements('input[type=text], input[type=password]').addEvent('keyup', function(event) {
    if (event.key != 'enter') return;
    submit(event);
  });

  login.show();

});
