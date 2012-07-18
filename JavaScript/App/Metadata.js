var API = require('API');
var UI = require('UI');
var View = require('View');

var CordovaImageRecorder = require('Capture/CordovaImageRecorder');

exports.getType = function() {
  return 'metadata';
};

exports.getData = function(store) {
  return store.get('metadata', {});
};

exports.setData = function(store, metadata) {
  store.set('metadata', Object.flatten({metadata: metadata}));
};

exports.createView = function(store) {
  var record = function(event, source) {
    var element = this;
    event.preventDefault();

    var recorder = new CordovaImageRecorder({
      source: source
    });

    recorder.addEvents({
      success: function(file) {
        store.fireEvent('upload', [file]);
      },
      cancel: function() {
        UI.unhighlight(element);
      }
    });

    recorder.start();
  };

  var uploadTakePhoto = function(event) {
    record.call(this, event, 'CAMERA');
  };

  var uploadFromLibrary = function(event) {
    record.call(this, event, 'PHOTOLIBRARY');
  };

  var object = new View.Object({
    title: 'Metadata',
    content: UI.render('form-new-metadata'),
    action: {
      title: 'Done',
      back: true,
      onClick: function() {
        store.set('metadata', View.getMain().getCurrentView().serialize());
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      var metadata = store.get('metadata');
      this.unserialize(Object.append({
        'metadata.year': (new Date).getFullYear(),
        'metadata.genre': 'Podcast'
      }, metadata));

      var container = object.toElement();
      container.getElement('.upload_take_photo').addEvent('click', uploadTakePhoto);
      container.getElement('.upload_from_library').addEvent('click', uploadFromLibrary);
    }
  });

  View.getMain().push(object);
};
