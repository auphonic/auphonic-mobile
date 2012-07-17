var History = require('History');

var API = require('API');
var Controller = require('./');
var UI = require('UI');
var View = require('View');

var LocalStorage = require('Utility/LocalStorage');

var CordovaAudioRecorder = require('Recording/CordovaAudioRecorder');
var CordovaVideoRecorder = require('Recording/CordovaVideoRecorder');

var recorder;
var upload = function(file) {
  LocalStorage.push('recordings', file);

  var data = {metadata: {title: 'Mobile App: New Production'}};
  var onCreateSuccess = function(response) {
    LocalStorage.set('currentUpload', {
      uuid: response.data.uuid,
      input_file: file.name
    });

    API.upload('production/{uuid}/upload'.substitute(response.data), file).on({
      success: function() {
        LocalStorage.erase('currentUpload');
      }
    });

    History.push('/production/edit/{uuid}'.substitute(response.data));
  };

  // TODO(cpojer): use a new production instead of the same one
  var object = {uuid: 'MCjr3YYo3d7rypS5trzKJ9'};
  onCreateSuccess.call(null, {data: object});
  return;

  API.call('productions', 'post', JSON.stringify(data)).on({
    success: onCreateSuccess
  });
};

Controller.define('/record', function() {

  View.getMain().push('record', new View.Object({
    title: 'Recordings',
    content: UI.render('record', {
      recordings: LocalStorage.get('recordings')
    })
  }));

});

Controller.define('/record/new-video', {priority: 1, isGreedy: true}, function() {
  var videoRecorder = new CordovaVideoRecorder();

  videoRecorder.addEvents({
    success: upload
  });

  videoRecorder.start();
});

Controller.define('/record/new-audio', {priority: 1, isGreedy: true}, function() {
  View.getMain().push('record', new View.Object({
    title: 'Audio Recording',
    content: UI.render('record-audio')
  }));
});

Controller.define('/record/new-audio-start', {priority: 1, isGreedy: true}, function() {
  var recordings = LocalStorage.get('recordings') || [];

  recorder = new CordovaAudioRecorder('mobile-recording-' + (recordings.length + 1));

  var status = document.getElement('.record_status');
  var time;

  recorder.addEvents({
    start: function() {
      time = 0;
      document.getElement('.record_button').hide();
      document.getElement('.stop_record_button').show();
    },

    success: upload,

    update: function() {
      status.set('text', (++time) + ' second' + (time == 1 ? '' : 's'));
    },

    cancel: function() {
      document.getElement('.record_button').show();
      document.getElement('.stop_record_button').hide();
    }

  });

  recorder.start();
});

Controller.define('/record/stop', {priority: 1, isGreedy: true}, function() {
  recorder.stop();
});
