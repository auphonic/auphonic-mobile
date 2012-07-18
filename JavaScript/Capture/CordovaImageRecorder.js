var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Class.Binds, Options, Events],

  options: {
    quality: 80,
    source: 'CAMERA',
    encoding: 'JPEG',
    correctOrientation: true
  },

  initialize: function(options) {
    this.setOptions(options);

    // Only save the photo if using the camera
    if (this.options.source == 'CAMERA')
      this.options.saveToPhotoAlbum = true;
  },

  start: function() {
    this.fireEvent('start');

    var camera = navigator.camera;

    camera.getPicture(this.bound('onCaptureSuccess'), this.bound('onCaptureError'), {
      quality: this.options.quality,
      saveToPhotoAlbum: this.options.saveToPhotoAlbum,
      destinationType: camera.DestinationType.FILE_URI,
      encodingType: camera.EncodingType[this.options.encoding],
      sourceType: camera.PictureSourceType[this.options.source],
      correctOrientation: this.options.correctOrientation
    });
  },

  onCaptureSuccess: function(file) {
    this.file = file;
    this.metadata = {
      name: file.substr(file.lastIndexOf('/') + 1),
      fullPath: file,
      type: 'image/' + this.options.encoding.toLowerCase()
    };

    this.fireEvent('cancel').fireEvent('success', [this.metadata]);
  },

  onCaptureError: function() {
    console.log('error');
    this.fireEvent('cancel');
  }

});
