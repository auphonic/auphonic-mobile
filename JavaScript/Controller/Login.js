var History = require('History');
var Form = require('Form');
var LocalStorage = require('Utility/LocalStorage');
var Spinner = require('ThirdParty/Spinner');

var API = require('../API');
var Controller = require('./');
var UI = require('../UI');

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
  login.set('html', UI.render('login'));
  login.getElement('a.button').addEvent('click', function(event) {
    event.preventDefault();

    if (!spinner) spinner = new Spinner(spinnerOptions);

    var data = login.serialize();
    var children = login.getChildren().dispose();
    spinner.spin(login);

    API.call('login/submit', 'post', Object.toQueryString(data)).on({

      success: function() {
        spinner.stop();

        login.empty();
        API.invalidate();
        LocalStorage.set('User', data);
        History.push('/');
      },

      error: function() {
        spinner.stop();

        login.empty().adopt(children);
      }

    });
  });

  login.show();

});
