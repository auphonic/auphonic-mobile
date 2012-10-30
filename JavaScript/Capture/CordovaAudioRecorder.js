var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var IdleTimer = require('Cordova/IdleTimer');

module.exports = new Class({

  Implements: [Class.Binds, Options, Events],

  extension: 'wav',
  canceled: false,

  initialize: function(filename, options) {
    this.setOptions(options);

    this.filename = filename;
  },

  start: function() {
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, this.bound('onFileSystemReady'), this.bound('onError'));
  },

  _capture: function() {
    IdleTimer.disable();
    this.fireEvent('start');
    this.media = new window.Media(this.file.fullPath, this.bound('onCaptureSuccess'), this.bound('onCaptureError'));
    this.media.startRecord();

    this.timer = this.update.periodical(1000, this);
  },

  stop: function() {
    clearInterval(this.timer);
    IdleTimer.enable();
    this.media.stopRecord();

    this.fireEvent('cancel');
  },

  cancel: function() {
    this.canceled = true;
    this.stop();
  },

  update: function() {
    this.fireEvent('update');
  },

  onCaptureSuccess: function() {
    var canceled = this.canceled;
    this.canceled = false;
    if (canceled) return;

    this.file.media_type = 'audio';
    this.media.play();
    this.media.pause();
    // Duration can only be accessed asynchronously
    (function() {
      this.file.duration = this.media.getDuration();
      // Access the "File" Object
      this.file.file((function(file) {
        this.file.size = file.size;
        this.fireEvent('success', [this.file]);
      }).bind(this));
    }).delay(0, this);
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
    clearInterval(this.timer);
    this.fireEvent('cancel');
    this.fireEvent('error');
    if (this.file) this.file.remove(function() {}, function() {});
  },

  onCaptureError: function() {
    var canceled = this.canceled;
    this.canceled = false;
    if (canceled) return;

    clearInterval(this.timer);
    this.fireEvent('cancel');
    this.fireEvent('error');
    this.file.remove(function() {}, function() {});
  },

  getFileName: function() {
    return this.filename + '.' + this.extension;
  }

});
