var Controller = require('./');
var UI = require('UI');
var View = require('View');

var Recording = require('App/Recording');

var Auphonic = require('Auphonic');

Controller.define('/recording', function() {
  var recordings = Object.values(Recording.findAll());
  var object = new View.Object({
    title: 'Recordings',
    content: UI.render('recordings', {
      recordings: recordings.length && recordings
    }),
    action: {
      title: 'New',
      url: '/production/source'
    }
  });

  View.getMain().push('recording', object);
  object.toElement().getElements('li').addEvent('removeRecording', Recording.remove);
});

Controller.define('/recording/{id}', function(req) {

  var recording = Recording.findById(req.id);
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
