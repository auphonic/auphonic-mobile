var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var Data = require('App/Data');

var UI = require('UI');
var Notice = require('UI/Notice');

module.exports = new Class({

  Implements: [Class.Binds, Options, Events],

  options: {
    generateFileName: function() {
      return 'recording';
    }
  },

  initialize: function(recorderClass, object, options) {
    this.setOptions(options);

    this.recorderClass = recorderClass;
    this.object = object;
    var element = object.toElement();
    var button = this.button = element.getElement('.recorder');

    this.status = element.getElement('.status');
    this.recordingLengthElement = this.status.getElement('.recording-length');
    this.chapterMarkElement = this.status.getElement('.add-chapter-mark');

    this.button.addEvent('click', this.bound('onClick'));
    this.chapterMarkElement.addEvent('click', this.bound('onChapterMarkClick'));
    this.markerHighlight = this.chapterMarkElement.getElement('span');

    this.object.addEvent('hide:once', this.bound('onHide'));
    this.object.addEvent('show', function() {
      button.removeClass('fade');
    });
  },

  setupRecorder: function() {
    if (this.recorder) return;

    this.recorder = new this.recorderClass(this.options.generateFileName.call(this));
    this.recorder.addEvents({
      start: this.bound('onStart'),
      update: this.bound('onUpdate'),
      cancel: this.bound('onCancel'),
      error: this.bound('onError'),
      success: this.bound('onSuccess')
    });
  },

  onClick: function(event) {
    this.setupRecorder();
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
    this.recorder.start();
    this.button.addClass('pulse').set('text', 'Stop');
    return this;
  },

  stop: function() {
    if (this.hasStarted) this.recorder.stop();
    return this;
  },

  onStart: function() {
    this.hasStarted = true;
    this.time = 0;
    this.chapterID = 0;
    this.chapters = [];
    this.status.show();
    this.recordingLengthElement.set('text', '');

    this.status.show();
    this.statusTimer = (function() {
      this.status.removeClass('out');
    }).delay(UI.getTransitionDelay(), this);
  },

  onUpdate: function() {
    this.recordingLengthElement.set('text', Data.formatDuration(++this.time, ' '));
  },

  onCancel: function() {
    this.hasStarted = false;
    this.isRecording = false;
    this.button.removeClass('pulse').set('text', 'Start');
    if (this.status.hasClass('out')) {
      this.status.addClass('out').addEvent('transitionComplete:once', function() {
        this.hide();
      });
    } else {
      clearTimeout(this.statusTimer);
      this.status.hide();
    }
  },

  onError: function() {
    new Notice('There was an error with your recording. Please try again.');
  },

  onHide: function() {
    if (this.isRecording) this.recorder.cancel();

    this.recorder = null;
  },

  onSuccess: function(file) {
    this.button.addClass('fade');
    file.chapters = this.chapters;

    this.fireEvent('success', [file]);
  }

});
