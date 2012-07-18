var Controller = require('./');
var UI = require('UI');
var View = require('View');

var LocalStorage = require('Utility/LocalStorage');

Controller.define('/recording', function() {

  View.getMain().push('recording', new View.Object({
    title: 'Recordings',
    content: UI.render('recording', {
      recordings: LocalStorage.get('recordings')
    }),
    action: {
      title: 'New',
      url: '/production/source'
    },
  }));

});
