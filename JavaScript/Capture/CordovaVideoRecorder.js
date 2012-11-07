var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

module.exports = new Class({

  Implements: [Class.Binds, Options, Events],

  options: {
    generateFileName: function() {
      return 'recording';
    }
  },

  initialize: function(options) {
    this.setOptions(options);
  },

  start: function() {
    this.fireEvent('start');

    navigator.device.capture.captureVideo(this.bound('onCaptureSuccess'), this.bound('onCaptureError'), {limit: 1});
  },

  onCaptureSuccess: function(files) {
    this.file = files[0];

    this.fireEvent('cancel');
    // We need to move this file to permanent storage, request a file system first.
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, this.bound('onFileSystemReady'), this.bound('onCaptureError'));
  },

  onCaptureError: function() {
    this.fireEvent('cancel');
  },

  onFileSystemReady: function(fileSystem) {
    this.root = fileSystem.root;
    // resolveLocalFileSystemURI requires paths to be prefixed with file:///
    var path = 'file:///' + this.file.fullPath.replace(/^\/|^file:\/\/\//i, '');
    window.resolveLocalFileSystemURI(path, this.bound('onFileLoadSuccess'), this.bound('onCaptureError'));
  },

  onFileLoadSuccess: function(fileEntry) {
    var fileName = this.options.generateFileName.call(this);
    var name = this.file.name;
    var extension = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    fileEntry.moveTo(this.root, fileName + '.' + extension, this.bound('onMove'), this.bound('onCaptureError'));
  },

  onMove: function(file) {
    file.media_type = 'video';
    file.size = this.file.size;
    this.fireEvent('success', [file]);
  }

});
