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

  hasStarted: false,
  isRecording: false,
  isInterrupted: false,

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

    this.levelElement = element.getElement('.audio-level .peak-meter');
    this.averageLevelElement = element.getElement('.audio-level .average-meter');

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
      pause: this.bound('onPause'),
      cancel: this.bound('onCancel'),
      error: this.bound('onError'),
      interrupt: this.bound('onInterrupt'),
      success: this.bound('onSuccess'),
      levelUpdate: this.bound('onLevelUpdate')
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
    if (this.isRecording) this.pause();
    else this.start();
  },

  start: function() {
    if (this.isInterrupted) {
      this.object.addEvent('hide:once', function() {
        (function() {
          new Notice('It seems like your audio session was interrupted because of a phone call. Please put your phone into Airplane Mode when recording. Because of a bug in iOS your recording cannot be resumed at this time :(', {type: 'error'});
        }).delay(400);
      });
      this.stop();
      return;
    }

    this.isRecording = true;
    this.recorder.start();
    this.button.addClass('pulse').set('text', 'Pause');
    return this;
  },

  pause: function() {
    if (this.hasStarted) this.recorder.pause();
  },

  stop: function() {
    if (this.hasStarted) this.recorder.stop();
    return this;
  },

  onStart: function() {
    if (!this.hasStarted) {
      this.time = 0;
      this.chapterID = 0;
      this.chapters = [];
      this.recordingLengthElement.set('text', '');
    }

    this.fireEvent('start');
    this.hasStarted = true;
    this.status.show();
    this.statusTimer = (function() {
      this.status.removeClass('out');
    }).delay(UI.getTransitionDelay(), this);
    document.addEventListener('pause', this.bound('pause'), false);
  },

  onUpdate: function() {
    this.recordingLengthElement.set('text', Data.formatDuration(++this.time, ' '));
  },

  onPause: function() {
    this.isRecording = false;
    this.button.removeClass('pulse').set('text', 'Resume');
    this.hideStatus();
    this.fireEvent('pause');
    document.removeEventListener('pause', this.bound('pause'), false);
  },

  onCancel: function() {
    this.hasStarted = false;
    this.isRecording = false;
    this.button.removeClass('pulse').set('text', 'Start');
    this.hideStatus();
    document.removeEventListener('pause', this.bound('pause'), false);
  },

  onInterrupt: function() {
    // An interrupt through a phone call in iOS means that the recording cannot
    // be continued. We'll tell the user to stop
    this.isInterrupted = true;
  },

  onError: function() {
    new Notice('There was an error with your recording. Please try again.');
  },

  onHide: function() {
    if (this.isRecording) this.recorder.cancel();

    this.recorder = null;
  },

  onSuccess: function(file) {
    this.isInterrupted = false;
    this.button.addClass('fade');
    file.chapters = this.chapters;

    this.fireEvent('success', [file]);
  },

  onLevelUpdate: function(average, peak) {
    var peakWidth = (-Math.max(-50, peak)) / 0.5;
    this.levelElement.setStyle('width', peakWidth + '%');

    var averageWidth = 100 - (-Math.max(-50, average)) / 0.5;
    this.averageLevelElement.setStyle('width', averageWidth + '%');
  },

  hideStatus: function() {
    if (this.status.hasClass('out')) {
      this.status.addClass('out').addEvent('transitionComplete:once', function() {
        this.hide();
      });
    } else {
      clearTimeout(this.statusTimer);
      this.status.hide();
    }
  }

});
