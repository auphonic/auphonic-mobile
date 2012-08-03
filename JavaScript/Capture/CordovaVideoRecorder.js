var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Class.Binds, Events],

  start: function() {
    this.fireEvent('start');

    navigator.device.capture.captureVideo(this.bound('onCaptureSuccess'), this.bound('onCaptureError'), {limit: 1});
  },

  onCaptureSuccess: function(files) {
    this.file = files[0];
    this.fireEvent('cancel').fireEvent('success', [this.file]);
  },

  onCaptureError: function() {
    console.log('error');
    this.fireEvent('cancel');
  }

});
