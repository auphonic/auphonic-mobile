(function() {

var version = this.__VERSION;

Controller.define('/settings', function() {

  Views.get('Main').push('settings', new View.Object({
    title: 'Settings',
    content: UI.render('settings')
  }));

});

Controller.define('/settings/about', function() {

  Views.get('Main').push('settings', new View.Object({
    title: 'About',
    content: UI.render('about', {
      version: version
    })
  }));

});

Controller.define('/logout', function() {
  LocalStorage.clear();

  History.push('/login');
});

})();
