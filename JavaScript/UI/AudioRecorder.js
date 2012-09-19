var Core = require('Core');
var Class = Core.Class;

var View = require('View');

var LocalStorage = require('Utility/LocalStorage');

module.exports = new Class({

  Implements: [Class.Binds],

  initialize: function(recorderClass, options) {
    var recordings = LocalStorage.get('recordings') || [];

    this.status = document.getElement('.record_status');
    this.recorder = new recorderClass('mobile-recording-' + (recordings.length + 1), options);

    this.recorder.addEvents({
      start: this.bound('onStart'),
      update: this.bound('onUpdate'),
      cancel: this.bound('onCancel')
    });
  },

  start: function() {
    View.getMain().getCurrentObject().addEvent('hide:once', this.bound('onHide'));
    this.recorder.start();
    return this;
  },

  stop: function() {
    this.recorder.stop();
    return this;
  },

  onStart: function() {
    this.time = 0;
    document.getElement('.record_button').hide();
    document.getElement('.stop_record_button').show();
  },

  onUpdate: function() {
    this.status.set('text', (++this.time) + ' second' + (this.time == 1 ? '' : 's'));
  },

  onCancel: function() {
    View.getMain().getCurrentObject().removeEvent('hide:once', this.bound('onHide'));
    document.getElement('.record_button').show();
    document.getElement('.stop_record_button').hide();
  },

  onHide: function() {
    this.recorder.cancel();
  }

});
