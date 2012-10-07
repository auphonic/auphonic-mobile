var Controller = require('./');
var UI = require('UI');
var View = require('View');

var LocalStorage = require('Utility/LocalStorage');

Controller.define('/recording', function() {

  View.getMain().push('recording', new View.Object({
    title: 'Recordings',
    content: UI.render('recordings', {
      recordings: LocalStorage.get('recordings').reverse()
    }),
    action: {
      title: 'New',
      url: '/production/source'
    },
  }));

});

Controller.define('/recording/{name}', function(req) {

  var recordings = LocalStorage.get('recordings');
  var recording;

  for (var i = 0; i < recordings.length; i++) {
    if (req.name == recordings[i].name) {
      recording = recordings[i];
      break;
    }
  }

  recording.media_files = [recording.fullPath];

  View.getMain().push('recording', new View.Object({
    title: recording.name,
    content: UI.render('recording', recording)
  }));

});
