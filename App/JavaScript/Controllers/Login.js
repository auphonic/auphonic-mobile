(function() {

var spinner, children;

API.on('login/submit', function() {
  if (!spinner) spinner = new Spinner({
    lines: 12,
    length: 10,
    width: 7,
    radius: 13,
    trail: 30,
    color: '#fff'
  });

  children = document.id('login').getChildren().dispose();
  spinner.spin(login);
}).addEvents({

  success: function() {
    document.id('main').show();

    var login = document.id('login');
    var splash = document.id('splash');

    login.empty().addClass('fade').addEvent('transformComplete', function() {
      login.hide();
      splash.hide();
    });
    splash.addClass('fade');

    UI.unlock();
  },

  error: function() {
    var login = document.id('login');
    login.empty().adopt(children);
  }

});

Controller.define('login', function() {

  var login = document.id('login');

  new Form(document.id('loginAction'), 'login/submit');

  UI.lock();
  login.show();

});

})();
