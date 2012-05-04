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

  var login = document.id('login');
  children = login.getChildren().dispose();
  spinner.spin(login);
}).addEvents({

  success: function() {
    document.id('login').empty();
    UI.Chrome.show();
  },

  error: function() {
    var login = document.id('login');
    login.empty().adopt(children);
  }

});

Controller.define('/login', function() {

  var login = document.id('login');

  new Form(document.id('loginAction'), 'login/submit');

  login.show();

});

})();
