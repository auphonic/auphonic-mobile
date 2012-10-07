var Controller = require('./');
var UI = require('UI');
var View = require('View');

var Recording = require('App/Recording');

var Auphonic = require('Auphonic');

Controller.define('/recording', function() {
  var recordings = Object.values(Recording.findAll());
  View.getMain().push('recording', new View.Object({
    title: 'Recordings',
    content: UI.render('recordings', {
      recordings: recordings.length && recordings
    }),
    action: {
      title: 'New',
      url: '/production/source'
    },
  }));

});

Controller.define('/recording/{name}', function(req) {

  var recording = Recording.findByName(req.name);
  recording.media_files = JSON.stringify([recording.fullPath]);

  var match = recording.name.match(Auphonic.DefaultFileNameFilter);
  var name = recording.name;
  if (match && match[1])
    name = 'Recording ' + match[1];

  View.getMain().push('recording', new View.Object({
    title: name,
    content: UI.render('recording', recording)
  }));

});
