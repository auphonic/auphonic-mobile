var History = require('History');

var Controller = require('./');
var View = require('../View');
var UI = require('../UI');

var User = require('App/User');

var Auphonic = require('Auphonic');

Controller.define('/settings', function() {

  View.getMain().push('settings', new View.Object({
    title: 'Settings',
    content: UI.render('settings', {
      user: User.get(),
      feedback: Auphonic.FeedbackURL
    })
  }));

});

Controller.define('/settings/about', function() {

  View.getMain().push('settings', new View.Object({
    title: 'About',
    content: UI.render('about', {
      version: Auphonic.Version,
      repository: Auphonic.RepositoryURL
    })
  }));

});

Controller.define('/logout', function() {
  User.reset();

  History.push('/login');
});
