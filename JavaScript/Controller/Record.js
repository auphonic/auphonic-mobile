var History = require('History');

var API = require('API');
var Controller = require('./');
var UI = require('UI');
var View = require('View');

var CordovaAudioRecorder = require('Recording/CordovaAudioRecorder');
var CordovaVideoRecorder = require('Recording/CordovaVideoRecorder');

var recorder;
var upload = function(file) {
  var data = {metadata: {title: 'Mobile App: New Production'}};

  var onCreateSuccess = function(response) {
    API.upload('production/{uuid}/upload'.substitute(response.data), file);
    History.push('/production/edit/{uuid}'.substitute(response.data));
  };

  // TODO(cpojer): use a new production instead of the same one
  var object = {uuid: 'hA68J6ZxFoYwjYZrAdEZpE'};
  onCreateSuccess.call(null, {data: object});
  return;

  API.call('productions', 'post', JSON.stringify(data)).on({
    success: onCreateSuccess
  });
};

Controller.define('/record', function() {

  View.getMain().push('record', new View.Object({
    title: 'Recordings',
    content: UI.render('record')
  }));

});

Controller.define('/record/new-audio', {priority: 1, isGreedy: true}, function() {
  recorder = new CordovaAudioRecorder();

  var status = document.getElement('.record_status');
  var time;

  recorder.addEvents({
    onStart: function() {
      time = 0;
      document.getElement('.record_button').hide();
      document.getElement('.stop_record_button').show();
    },

    onSuccess: upload,

    onUpdate: function() {
      status.set('text', (++time) + ' second' + (time == 1 ? '' : 's'));
    },

    onCancel: function() {
      document.getElement('.record_button').show();
      document.getElement('.stop_record_button').hide();
    }

  });

  recorder.start();
});

Controller.define('/record/stop', {priority: 1, isGreedy: true}, function() {
  recorder.stop();
});

Controller.define('/record/new-video', {priority: 1, isGreedy: true}, function() {
  var videoRecorder = new CordovaVideoRecorder();

  videoRecorder.addEvents({
    onSuccess: upload
  });

  videoRecorder.start();
});
