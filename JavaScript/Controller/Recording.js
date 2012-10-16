var Controller = require('./');
var UI = require('UI');
var View = require('View');

var Recording = require('App/Recording');

var Auphonic = require('Auphonic');

Controller.define('/recording', {isGreedy: true}, function() {
  var recordings = Object.values(Recording.findAll()).sortByKey('timestamp').reverse();
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

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

Controller.define('/recording/{id}', function(req) {

  var recording = Recording.findById(req.id);
  var date = new Date(recording.timestamp);

  recording.media_files = JSON.stringify([recording.fullPath]);
  recording.display_date = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getHours() + ':' + date.getMinutes();

  View.getMain().push('recording', new View.Object({
    title: Recording.getRecordingName(recording),
    content: UI.render('recording', recording)
  }));

});
