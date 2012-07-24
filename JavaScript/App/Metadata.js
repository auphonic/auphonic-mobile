var LocalStorage = require('Utility/LocalStorage');

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

exports.createView = function(store, data) {
  var object;
  var record = function(event, source) {
    var element = this;
    event.preventDefault();

    var recorder = new CordovaImageRecorder({
      source: source
    });

    recorder.addEvents({
      success: function(file) {
        var container = object.toElement();
        container.getElement('img.thumbnail').set('src', file.fullPath).removeClass('hidden');
        container.getElement('.remove_thumbnail').removeClass('hidden');

        store.fireEvent('upload', [file]);
        store.set('thumbnail', file.fullPath);
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

  var removeCoverPhoto = function(event) {
     // Stop because sometimes on iOS a "ghost click" focuses elements below after the hidden classes are applied
    event.stop();

    var container = object.toElement();
    container.getElement('img.thumbnail').addClass('hidden');
    container.getElement('.remove_thumbnail').addClass('hidden');

    store.set('thumbnail', null);

    // TODO(cpojer): Actually delete the image when the API for it becomes available
  };

  var user = LocalStorage.get('User');

  object = new View.Object({
    title: 'Metadata',
    content: UI.render('form-new-metadata', {
      thumbnail: store.get('thumbnail'),
      access_token: user && '?access_token=' + user.access_token
    }),
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
      container.getElement('.remove_thumbnail a').addEvent('click', removeCoverPhoto);
    }
  });

  View.getMain().push(object);
};
