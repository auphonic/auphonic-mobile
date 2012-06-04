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

    History.push('/');
  },

  error: function() {
    var login = document.id('login');
    login.empty().adopt(children);
  }

});

Controller.define('/login', function() {
  if (LocalStorage.get('User')) {
    History.push('/');
    return;
  }

  UI.Chrome.hide();

  var login = document.id('login');

  login.set('html', UI.render('login'));
  new Form.Element(login.getElement('form'), 'login/submit');
  login.show();

});

})();
