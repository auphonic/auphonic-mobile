var History = require('History');
var LocalStorage = require('Utility/LocalStorage');

var Controller = require('./');
var View = require('../View');
var UI = require('../UI');

var Auphonic = require('Auphonic');

Controller.define('/settings', function() {

  View.getMain().push('settings', new View.Object({
    title: 'Settings',
    content: UI.render('settings', {
      user: LocalStorage.get('User'),
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
  LocalStorage.clear();

  History.push('/login');
});
