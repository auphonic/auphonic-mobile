(function() {

API.on('login/submit').addEvents({

  success: function() {
    document.id('main').show();

    var login = document.id('login');
    var splash = document.id('splash');

    login.addClass('fade').addEvent('transformComplete', function() {
      login.hide();
      splash.hide();
    });
    splash.addClass('fade');

    UI.unlock();
  },

  error: function() {

  }

});

Controller.define('login', function() {

  var login = document.id('login');

  new Form(document.id('loginAction'), 'login/submit');

  UI.lock();
  login.show();

});

})();
