var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

var UI = require('UI');
var Notice = require('UI/Notice');

module.exports = new Class({

  Implements: [Class.Binds],

  // options and fileName get passed to the class
  initialize: function(recorderClass, object, fileName, options) {
    this.object = object;
    var element = object.toElement();

    this.status = element.getElement('.record_status');
    this.recorder = new recorderClass(fileName, options);

    this.startButton = element.getElement('.record_button');
    this.stopButton = element.getElement('.stop_record_button');

    this.recorder.addEvents({
      start: this.bound('onStart'),
      update: this.bound('onUpdate'),
      cancel: this.bound('onCancel'),
      error: this.bound('onError')
    });
  },

  start: function() {
    this.object.addEvent('hide:once', this.bound('onHide'));
    this.recorder.start();
    UI.unhighlight(this.startButton.getElement('a'));
    this.startButton.hide();
    this.stopButton.show();
    return this;
  },

  stop: function() {
    this.recorder.stop();
    return this;
  },

  onStart: function() {
    this.time = 0;
  },

  onUpdate: function() {
    this.status.set('text', (++this.time) + ' second' + (this.time == 1 ? '' : 's'));
  },

  onCancel: function() {
    this.object.removeEvent('hide:once', this.bound('onHide'));
    UI.unhighlight(this.stopButton.getElement('a'));
    this.startButton.show();
    this.stopButton.hide();
    this.status.set('text', '');
  },

  onError: function() {
    new Notice('There was an error with your recording. Please try again.');
  },

  onHide: function() {
    this.recorder.cancel();
  }

});
