var API = require('API');
var Controller = require('./');
var UI = require('UI');
var View = require('View');

var Data = require('App/Data');

var Recording = require('Store/Recording');

var Auphonic = require('Auphonic');

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var sizes = ['b', 'KB', 'MB', 'GB', 'TB'];

var formatFileSize = function(bytes) {
  if (!bytes) bytes = 0;
  var base = Math.log(bytes) / Math.log(1024);
  return Math.round(Math.pow(1024, base - Math.floor(base)), 0) + ' ' + sizes[Math.floor(base)];
};

var formatTimestamp = function(timestamp) {
  var date = new Date(timestamp);
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getHours() + ':' + String('00' + date.getMinutes()).slice(-2);
};

var showAll = function() {
  var recordings = Object.values(Recording.findAll()).sortByKey('timestamp').reverse();

  recordings.forEach(function(recording) {
    recording.display_date = formatTimestamp(recording.timestamp);
  });

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
  var getElements = function() {
    return object.toElement().getElements('ul.main-list >');
  };

  getElements().addEvent('remove', function(id) {
    Recording.remove(id);
    if (getElements().length == 1) {
      // If the last item is being deleted, refresh now
      object.invalidate();
      showAll();
    } else {
      // otherwise invalidate onHide
      object.addEvent('hide', function() {
        object.invalidate();
      });
    }
  });
};

var show = function(recording) {
  var updateRecordingName = function() {
    var value = this.get('value');
    if (!value) value = 'Untitled';

    recording.display_name = value;
    Recording.update(recording.id, recording);
    View.getMain().getTitle().toElement().set('text', value);
  };

  var invalidateView = function() {
    var object = View.getMain().getStack().getByURL('/recording');
    if (object) object.invalidate();
  };

  View.getMain().push(new View.Object({
    title: Recording.getRecordingName(recording),
    content: UI.render('recording', recording),
    action: {
      title: 'Upload',
      url: '/production/recording/upload/{id}'.substitute(recording),
      className: 'big'
    },
    onShow: function() {
      this.toElement().getElement('input[name="display_name"]').addEvents({
        'input': updateRecordingName,
        'input:once': invalidateView
      });
    }
  }));
};

var showOne = function(req) {
  var recording = Recording.findById(req.id);
  recording.hasChapters = recording.chapters && recording.chapters.length;
  recording.media_files = JSON.stringify([recording.fullPath]);
  recording.player_chapters = recording.hasChapters ? JSON.stringify(recording.chapters) : null;
  recording.display_date = formatTimestamp(recording.timestamp);
  recording.display_size = formatFileSize(recording.size);
  recording.duration_string = Data.formatDuration(recording.duration, ' ');
  recording.isLocal = true;

  if (recording.media_type == 'audio') recording.isAudio = true;
  else recording.isVideo = true;

  if (recording.productions) {
    var loaded = 0;
    var complete = function() {
      if (++loaded == recording.productions.length) show(recording);
    };

    View.getMain().showIndicator();
    recording.display_productions = [];
    // This is wasteful but realistically this will only make one or two requests.
    recording.productions.each(function(uuid) {
      API.call('production/{uuid}'.substitute({uuid: uuid})).on({
        success: function(response) {
          recording.hasProductions = true;
          recording.display_productions.push({
            uuid: uuid,
            title: response.data.metadata.title
          });
          complete();
        },
        error: complete
      });
    });
    return;
  }

  show(recording);
};

Controller.define('/recording', {isGreedy: true}, showAll);
Controller.define('/recording/{id}', showOne);
