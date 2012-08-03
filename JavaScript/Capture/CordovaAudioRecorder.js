var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Class.Binds, Events],

  extension: 'wav',

  initialize: function(filename) {
    this.filename = filename;
  },

  start: function() {
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, this.bound('onFileSystemReady'), this.bound('onError'));
  },

  _capture: function() {
    this.fireEvent('start');

    this.media = new window.Media(this.file.fullPath, this.bound('onCaptureSuccess'), this.bound('onCaptureError'));
    this.media.startRecord();

    this.timer = this.update.periodical(1000, this);
  },

  stop: function() {
    clearInterval(this.timer);
    this.media.stopRecord();

    this.fireEvent('cancel');
  },

  update: function() {
    this.fireEvent('update');
  },

  onCaptureSuccess: function() {
    this.fireEvent('success', [this.file]);
  },

  onFileSystemReady: function(fileSystem) {
    var options = {
      create: true,
      exclusive: false
    };

    fileSystem.root.getFile(this.getFileName(), options, this.bound('onFileLoadSuccess'), this.bound('onError'));
  },

  onFileLoadSuccess: function(file) {
    this.file = file;
    this._capture();
  },

  onError: function() {
    console.log('error');
    this.fireEvent('cancel');
  },

  onCaptureError: function() {
    console.log('error');
    this.fireEvent('cancel');
  },

  getFileName: function() {
    return this.filename + '.' + this.extension;
  }

});
