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

  var eraseFromStore;
  var removeListeners;

  removeListeners = function() {
    object.getView().getAction().toElement().removeEvent('click:once', eraseFromStore);
    object.getView().getBack().toElement().removeEvent('click:once', removeListeners);
  };

  eraseFromStore = function() {
    removeListeners();
    store.set('thumbnail', null);
    store.set('reset_cover_image', true);
  };

  var removeCoverPhoto = function(event) {
    event.preventDefault();

    var container = object.toElement();
    container.getElement('img.thumbnail').addClass('hidden');
    container.getElement('.remove_thumbnail').addClass('hidden');

    // This is nasty but prevents ghost clicks on iOS properly
    UI.disable(container);
    UI.enable.delay(300, null, container);

    object.getView().getAction().toElement().addEvent('click:once', eraseFromStore);
    object.getView().getBack().toElement().addEvent('click:once', removeListeners);
  };

  var attachListeners = function() {
    var container = object.toElement();
    container.getElement('.upload_take_photo').addEvent('click', uploadTakePhoto);
    container.getElement('.upload_from_library').addEvent('click', uploadFromLibrary);
    container.getElement('.remove_thumbnail a').addEvent('click', removeCoverPhoto);
  };

  object.addEvent('show:once', attachListeners);
};
