var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var Data = require('App/Data');

var Notice = require('UI/Notice');

module.exports = new Class({

  Implements: [Class.Binds, Options, Events],

  initialize: function(recorderClass, object, fileName, options) {
    this.setOptions(options);

    this.object = object;
    var element = object.toElement();

    this.recorder = new recorderClass(fileName);

    this.button = element.getElement('.recorder');
    this.status = element.getElement('.status');
    this.recordingLengthElement = this.status.getElement('.recording-length');
    this.chapterMarkElement = this.status.getElement('.add-chapter-mark');

    this.button.addEvent('click', this.bound('onClick'));
    this.chapterMarkElement.addEvent('click', this.bound('onChapterMarkClick'));
    this.markerHighlight = this.chapterMarkElement.getElement('span');

    this.recorder.addEvents({
      start: this.bound('onStart'),
      update: this.bound('onUpdate'),
      cancel: this.bound('onCancel'),
      error: this.bound('onError'),
      success: this.bound('onSuccess')
    });
  },

  onClick: function(event) {
    event.preventDefault();

    this.toggle();
  },

  onChapterMarkClick: function() {
    if (!this.isRecording) return;

    var time = Data.formatDuration(this.time, ':', true, [60, 60, 0], ['', '', '']);

    // The API expects hh:mm[:ss]
    if (time.length == 2) time = '00:00:' + time;
    else if (time.length == 5) time = '00:' + time;

    this.chapters.push({
      start: time,
      title: 'Chapter {id}'.substitute({id: ++this.chapterID})
    });

    clearTimeout(this.timer);
    this.markerHighlight.set('text', time).removeClass('out');
    this.timer = (function() {
      this.markerHighlight.addClass('out');
    }).delay(2500, this);
  },

  toggle: function() {
    if (this.isRecording) this.stop();
    else this.start();
  },

  start: function() {
    this.isRecording = true;
    this.object.addEvent('hide:once', this.bound('onHide'));
    this.recorder.start();
    this.button.addClass('pulse').set('text', 'Stop');
    return this;
  },

  stop: function() {
    this.isRecording = false;
    this.recorder.stop();
    this.button.removeClass('pulse').set('text', 'Start');
    return this;
  },

  onStart: function() {
    this.time = 0;
    this.chapterID = 0;
    this.chapters = [];
    this.status.show();
    this.recordingLengthElement.set('text', '');

    this.status.removeClass('hidden');
    (function() {
      this.status.removeClass('out');
    }).delay(50, this);
  },

  onUpdate: function() {
    this.recordingLengthElement.set('text', Data.formatDuration(++this.time, ' '));
  },

  onCancel: function() {
    this.isRecording = false;
    this.object.removeEvent('hide:once', this.bound('onHide'));
    this.status.addClass('out').addEvent('transitionComplete:once', function() {
      this.addClass('hidden');
    });
  },

  onError: function() {
    new Notice('There was an error with your recording. Please try again.');
  },

  onHide: function() {
    this.recorder.cancel();
  },

  onSuccess: function(file) {
    file.chapters = this.chapters;
    this.fireEvent('success', [file]);
  }

});
