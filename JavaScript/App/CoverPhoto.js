var UI = require('UI');

var Notice = require('UI/Notice');

var CordovaImageRecorder = require('Capture/CordovaImageRecorder');

exports.createUI = function(store, object) {
  var record = function(event, source) {
    var element = this;
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

  var attachListeners = function() {
    var container = object.toElement();
    container.getElement('.upload_take_photo').addEvent('click', uploadTakePhoto);
    container.getElement('.upload_from_library').addEvent('click', uploadFromLibrary);
    container.getElement('.remove_thumbnail a').addEvent('click', removeCoverPhoto);
  };

  object.addEvent('show:once', attachListeners);
};
