var API = require('API');
var Controller = require('./');
var UI = require('UI');
var View = require('View');

var Chapter = require('App/Chapter');
var Data = require('App/Data');
var Form = require('App/Form');

var Recording = require('Store/Recording');

var Auphonic = require('Auphonic');

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var sizes = ['b', 'KB', 'MB', 'GB', 'TB'];
var form = null;

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

    // We don't want to copy *all* temporary properties to storage
    var updated = Recording.findById(recording.id);
    updated.display_name = value;
    Recording.update(updated);
    View.getMain().getTitle().toElement().set('text', value);
  };

  var invalidateView = function() {
    var object = View.getMain().getStack().getByURL('/recording');
    if (object) object.invalidate();
  };

  var object = new View.Object({
    title: recording.display_name,
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
  });

  form = new Form({
    use: [Chapter]
  });

  var baseURL = '/recording/';
  Chapter.setup(form, baseURL, object);
  Chapter.setData(form, recording.chapters, baseURL, object, false);

  form.addEvent('update:chapters', function() {
    var updated = Recording.findById(recording.id);
    updated.chapters = Chapter.getData(form, object).chapters;
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

  if (recording.productions && recording.productions.length) {
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

var loadEditor = function(object, data) {
  var element = object.toElement().getElement('.editor');
  var editor = new AudioEditor(element.getElement('.audio-editor'));
  editor.loadFromArrayBuffer(Base64.decodeAsArrayBuffer(data.substr(24)));

  element.getElement('.editor-copy').addEvent('click', editor.bound('copy'));
  element.getElement('.editor-cut').addEvent('click', editor.bound('cut'));
  element.getElement('.editor-paste').addEvent('click', editor.bound('paste'));
  element.getElement('.editor-remove').addEvent('click', editor.bound('remove'));
  element.getElement('.editor-select-all').addEvent('click', editor.bound('selectAll'));
  element.getElement('.editor-zoom').addEvent('click', editor.bound('zoom'));
  element.getElement('.editor-show-all').addEvent('click', editor.bound('showAll'));

  element.getElement('.editor-play').addEvent('click', editor.bound('play'));
  element.getElement('.editor-pause').addEvent('click', editor.bound('pause'));
  element.getElement('.editor-stop').addEvent('click', editor.bound('stop'));
  element.getElement('.editor-toggle-loop').addEvent('click', editor.bound('toggleLoop'));
  element.getElement('.editor-save').addEvent('click', function() {
    editor.render('application/octet-stream', function(url) {
      window.location.href = url;
    });
  });

  element.getElement('.editor-filter-normalize').addEvent('click', editor.bound('filterNormalize'));
  element.getElement('.editor-filter-silence').addEvent('click', editor.bound('filterSilence'));
  element.getElement('.editor-filter-fade-in').addEvent('click', editor.bound('filterFadeIn'));
  element.getElement('.editor-filter-fade-out').addEvent('click', editor.bound('filterFadeOut'));
};

var AudioEditor = require('Editor/AudioEditor');
var Base64 = require('Utility/Base64');
var Request = require('Request');
Controller.define('/edit', function() {
  new Request({
    url: '../../file.base64',
    onSuccess: function(data) {
      var object = new View.Object({
        title: 'Editor',
        content: UI.render('audio-editor'),
        onShow: function() {
          loadEditor(object, data);
        }
      });

      View.getMain().push(object);
    }
  }).send();
});

Controller.define('/editor/{id}', function(req) {
  var recording = Recording.findById(req.id);
  var object = new View.Object({
    title: recording.display_name,
    content: UI.render('audio-editor', recording),
    onShow: function() {
      Recording.read(req.id, function(entry) {
        entry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(event) {
              loadEditor(object, reader.result);
            };
            reader.readAsDataURL(file);
        });
      });
    }
  });
  View.getMain().push(object);
});
