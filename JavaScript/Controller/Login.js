var History = require('History');
var Form = require('Form');
var LocalStorage = require('Utility/LocalStorage');
var Spinner = require('Spinner');

var API = require('API');
var Controller = require('./');
var UI = require('UI');

var APIKeys = require('APIKeys');

var spinnerOptions = {
  lines: 12,
  length: 10,
  width: 7,
  radius: 13,
  trail: 30,
  color: '#fff'
};
var spinner;

Controller.define('/login', function() {
  if (LocalStorage.get('User')) {
    History.push('/');
    return;
  }

  UI.Chrome.hide();

  var login = document.id('login');
  login.set('html', UI.render('login', {
    client_id: APIKeys.ID,
    client_secret: APIKeys.secret
  }));

  login.getElement('a.button').addEvent('click', function(event) {
    event.preventDefault();

    if (!spinner) spinner = new Spinner(spinnerOptions);

    var data = login.serialize();
    var children = login.getChildren().dispose();
    spinner.spin(login);

    var error = function() {
      spinner.stop();

      login.empty().adopt(children);
    };

    var name = data.username;

    API.authenticate(data).on({

      success: function(response) {
        spinner.stop();

        if (!/^access_token=/.test(response)) {
          error();
          return;
        }

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
  });

  login.show();

});
