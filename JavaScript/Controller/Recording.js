var formatTimestamp = require('Utility/formatTimestamp');

var API = require('API');
var Controller = require('./');
var renderTemplate = require('UI/renderTemplate');
var View = require('View');

var Chapter = require('App/Chapter');
var Data = require('App/Data');
var Form = require('App/Form');

var Recording = require('Store/Recording');
var User = require('Store/User');

var sizes = ['b', 'KB', 'MB', 'GB', 'TB'];
var form = null;

var formatFileSize = function(bytes) {
  if (!bytes) return '0 ' + sizes[0];
  var base = Math.log(bytes) / Math.log(1024);
  return Math.round(Math.pow(1024, base - Math.floor(base)), 0) + ' ' + sizes[Math.floor(base)];
};

var showAll = function() {
  var recordings = Recording.getListSortedByTime();

  var object = new View.Object({
    title: 'Recordings',
    content: renderTemplate('recordings', {
      recordings: recordings.length && recordings
    }),
    action: {
      title: 'New',
      className: 'new',
      url: '/production/recording/new-audio'
    }
  });

  View.getMain().pushOn('record', object);
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
  var object;
  var updateRecordingName = function() {
    var value = this.get('value');
    if (!value) value = 'Untitled';

    // We don't want to copy *all* temporary properties to storage
    var updated = Recording.findById(recording.id);
    updated.display_name = value;
    Recording.update(updated);
    object.setTitle(value);
  };

  var invalidateView = function() {
    var object = View.getMain().getStack().getByURL('/recording');
    if (object) object.invalidate();
  };

  recording.uploadURL = '/production/recording/upload/{id}'.substitute(recording);
  object = new View.Object({
    title: recording.display_name,
    content: renderTemplate('recording', recording),
    action: {
      title: 'Upload',
      url: recording.uploadURL
    },
    onShow: function() {
      this.toElement().getElement('input[name="display_name"]').addEvents({
        'input': updateRecordingName,
        'input:once': invalidateView
      });
    }
  });

  form = new Form({
    viewController: View.getMain(),
    use: [Chapter]
  });

  var baseURL = '/recording/';
  form.set('chapter-is-playable', true);
  Chapter.setup(form, baseURL, object);
  Chapter.setData(form, recording.chapters, baseURL, object, false);

  form.addEvent('update:chapters', function() {
    var updated = Recording.findById(recording.id);
    updated.chapters = Chapter.getData(form, object).chapters;
    View.getMain().getStack().notifyAll('updateChapters', [updated.chapters]);
    Recording.update(updated);
  });

  View.getMain().push(object);
};

var showOne = function(req) {
  var recording = Recording.findById(req.id);
  recording.media_files = JSON.stringify([recording.fullPath]);
  recording.player_chapters = recording.chapters && recording.chapters.length ? JSON.stringify(recording.chapters) : null;
  recording.display_date = formatTimestamp(recording.timestamp);
  recording.display_size = formatFileSize(recording.size);
  recording.duration_string = Data.formatDuration(recording.duration, ' ');
  recording.isLocal = true;

  if (recording.media_type == 'audio') recording.isAudio = true;
  else recording.isVideo = true;

  if (User.isAuthenticated() && navigator.onLine && recording.productions && recording.productions.length) {
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
          // Just in case.
          if (response.data && response.data.metadata) {
            recording.hasProductions = true;
            recording.display_productions.push({
              uuid: uuid,
              title: response.data.metadata.title
            });
          }

          complete();
        },
        error: function(event, response) {
          event.preventDefault();

          // Remove deleted productions from this recording
          if (response && response.status_code == 404)
            Recording.removeProduction(recording.id, uuid);

          complete();
        }
      });
    });
    return;
  }

  show(recording);
};

Controller.define('/recording', {isGreedy: true}, showAll);
Controller.define('/recording/{id}', showOne);

Controller.define('/recording/new/chapter/:id:', function(req) {
  form.show('chapters', req.id);
});
