var UI = require('UI');

var Notice = require('UI/Notice');

var CordovaImageRecorder = require('Capture/CordovaImageRecorder');

exports.getType = function() {
  return 'cover-photo';
};

exports.getData = function(store) {
  return {
    reset_cover_image: store.get('reset_cover_image')
  };
};

exports.createView = function(store, object) {
  var record = function(event, source) {
    event.preventDefault();

    var recorder = new CordovaImageRecorder({
      source: source
    });

    recorder.addEvents({
      success: function(file) {
        new Notice('The Cover Photo was successfully uploaded.');

        var container = object.toElement();
        container.getElement('img.thumbnail').set('src', file.fullPath).removeClass('hidden');
        container.getElement('.remove_thumbnail').removeClass('hidden');

        store.fireEvent('upload', [file]);
        store.set('thumbnail', file.fullPath);
        store.set('reset_cover_image', false);
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
    store.set('reset_cover_image', true);
  };

  var attachListeners = function() {
    var container = object.toElement();
    container.getElement('.upload_take_photo').addEvent('click', uploadTakePhoto);
    container.getElement('.upload_from_library').addEvent('click', uploadFromLibrary);
    container.getElement('.remove_thumbnail a').addEvent('click', removeCoverPhoto);
  };

  object.addEvent('show:once', attachListeners);
};
