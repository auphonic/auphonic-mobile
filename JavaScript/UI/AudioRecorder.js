var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var Data = require('App/Data');

var UI = require('UI');
var Notice = require('UI/Notice');

var Platform = require('Platform');

module.exports = new Class({

  Implements: [Class.Binds, Options, Events],

  options: {
    chapterTitle: 'Chapter {id}',
    generateFileName: function() {
      return 'recording';
    }
  },

  hasStarted: false,
  isRecording: false,
  isInterrupted: false,
  isSilent: false,
  freezeLevel: false,

  initialize: function(recorderClass, object, options) {
    this.setOptions(options);

    this.recorderClass = recorderClass;
    this.object = object;
    var element = object.toElement().getElement('.audio-recorder');

    this.button = element.getElement('.recorder');
    this.clipwarning = element.getElement('.clipwarning');
    this.saveButton = element.getElement('.save-recording');
    this.status = element.getElement('.status');
    this.recordingLengthElement = this.status.getElement('.recording-length');
    this.chapterMarkElement = this.status.getElement('.add-chapter-mark');

    this.chapterMarkElement.addEvent('click', this.bound('onChapterMarkClick'));
    this.chapterElement = element.getElement('.chapter-text');
    this.chapterInput = this.chapterElement.getElement('input');
    this.markerHighlight = this.chapterMarkElement.getElement('span');
    this.levelElement = element.getElement('.audio-level .peak-meter');
    this.averageLevelElement = element.getElement('.audio-level .average-meter');
    this.footer = document.getElements('footer, div.footerBackground');

    this.button.addEvent('click', this.bound('onClick'));
    this.saveButton.addEvent('click', this.bound('onSaveButtonClick'));
    this.chapterInput.addEvent('swipe', this.bound('removeLastChapter'));
    this.chapterInput.addEvent('input', this.bound('onChapterChange'));
    this.object.addEvent('show', this.bound('onShow'));
    this.object.addEvent('hide', this.bound('onHide'));
    element.addEvent('touchmove', this.preventDefault);
    this.status.addEvent('touchmove', this.preventDefault);

    this.status.inject(document.id('main'));
  },

  setupRecorder: function() {
    if (this.recorder) return;

    this.object.addEvent('hide:once', this.bound('onHideOnce'));
    this.recorder = new this.recorderClass(this.options.generateFileName.call(this));
    this.recorder.addEvents({
      start: this.bound('onStart'),
      stop: this.bound('onStop'),
      pause: this.bound('onPause'),
      update: this.bound('onUpdate'),
      error: this.bound('onError'),
      interrupt: this.bound('onInterrupt'),
      success: this.bound('onSuccess'),
      levelUpdate: this.bound('onLevelUpdate')
    });
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
    if (this.hasStarted) {
      // After a recording is paused and the app is put into background,
      // when returning to the app and stopping the recording immediately, it will have broken headers
      // By calling start right before stop, everything stays shiny.
      this.recorder.start();
      this.recorder.stop();
    }
    return this;
  },

  onClick: function(event) {
    this.setupRecorder();
    event.preventDefault();

    this.toggle();
  },

  onSaveButtonClick: function(event) {
    event.preventDefault();
    this.stop();
  },

  onChapterMarkClick: function(event) {
    event.stopPropagation(); // Prevent iOS Ghost Clicks

    if (!this.hasStarted) return;

    var time = Data.formatDuration(this.time, ':', true, [60, 60, 0], ['', '', '']);

    // The API expects hh:mm[:ss]
    if (time.length == 2) time = '00:00:' + time;
    else if (time.length == 5) time = '00:' + time;

    var chapters = this.chapters;
    if (chapters.length && chapters[chapters.length - 1].start == time) return;

    var title = this.options.chapterTitle.substitute({id: ++this.chapterID});
    chapters.push({
      start: time,
      title: title
    });

    clearTimeout(this.timer);
    this.markerHighlight.set('text', time).removeClass('out');
    this.timer = (function() {
      this.markerHighlight.addClass('out');
    }).delay(2500, this);

    this.status.addClass('hasChapters');
    this.chapterElement.removeClass('fade');
    this.chapterInput.set('value', title).set('placeholder', title);
  },

  removeLastChapter: function(event) {
    event.stop(); // Don't focus the input element
    this.chapterInput.blur();

    var chapters = this.chapters;
    chapters.pop();
    if (!chapters.length) {
      this.status.removeClass('hasChapters');
      this.chapterElement.addClass('fade');
      return;
    }

    var title = chapters[chapters.length - 1].title;
    this.chapterInput.set('value', title).set('placeholder', title);
  },

  onStart: function() {
    if (!this.hasStarted) {
      this.time = 0;
      this.chapterID = 0;
      this.chapters = [];
      this.recordingLengthElement.set('text', '');
    }

    this.fireEvent('start');
    this.status.show();
    if (this.hasStarted) this.saveButton.addClass('fade').transition(function() {
      this.removeClass('paused');
    });
    (function() {
      this.status.removeClass('out');
    }).delay(UI.getTransitionDelay(), this);
    if (Platform.isIOS()) this.footer.addClass('out');
    document.addEventListener('pause', this.bound('pause'), false);
    this.hasStarted = true;
  },

  onStop: function() {
    this.hasStarted = false;
    this.isRecording = false;
    this.button.removeClass('pulse').set('text', 'Start');
    this.status.removeClass('paused').removeClass('hasChapters');
    this.saveButton.removeClass('paused').addClass('fade');
    this.status.addClass('out').addEvent('transitionComplete:once', this.bound('hideStatus'));
    if (Platform.isIOS()) this.footer.removeClass('out');
    document.removeEventListener('pause', this.bound('pause'), false);
  },

  onPause: function() {
    this.freezeLevel = false;
    this.clipwarning.removeClass('clipping');
    this.onLevelUpdate(-50, -50);

    this.isRecording = false;
    this.button.removeClass('pulse').set('text', 'Resume');
    this.status.addClass('paused');
    // The "Save Recording"-Button is not necessary on the iPhone 4(S)
    // This is a really cheap check.
    if (!Platform.isIOS() || window.screen.height != 480) {
      this.saveButton.addClass('paused');
      (function() {
        this.saveButton.removeClass('fade');
      }).delay(UI.getTransitionDelay(), this);
    }
    this.fireEvent('pause');
    document.removeEventListener('pause', this.bound('pause'), false);
  },

  onUpdate: function() {
    this.recordingLengthElement.set('text', Data.formatDuration(++this.time, ' '));
  },

  onInterrupt: function() {
    // An interrupt through a phone call in iOS means that the recording cannot
    // be continued. We'll tell the user to stop
    this.isInterrupted = true;
  },

  onError: function(event) {
    new Notice('There was an error with your recording. Please try again.');
    this.fireEvent('error', event);
  },

  onShow: function() {
    this.status.inject(document.id('main'));
    this.button.removeClass('fade');
  },

  onHide: function() {
    this.status.dispose();
    this.status.removeEvent('transitionComplete:once', this.bound('hideStatus'));
    if (Platform.isIOS()) this.footer.transition({immediate: true}).removeClass('out');
    this.chapterElement.addClass('fade');
  },

  onHideOnce: function() {
    if (this.hasStarted) {
      this.isSilent = true;
      this.recorder.stop();
    }

    this.recorder = null;
  },

  onSuccess: function(file) {
    this.isInterrupted = false;
    this.button.addClass('fade');
    file.chapters = this.chapters;

    this.fireEvent('success', [file, this.isSilent]);
  },

  onLevelUpdate: function(average, peak) {
    if (!this.isRecording) return;

    var peakWidth = 0;
    var averageWidth = 100;
    // Show warning and freeze levels if we are too hot to prevent clipping
    if (peak > -0.5) {
      clearTimeout(this.clipwarnTimer);
      clearTimeout(this.clipwarnTimerLevel);

      this.freezeLevel = true;
      this.clipwarning.addClass('clipping');
      this.clipwarnTimer = (function() {
        this.clipwarning.removeClass('clipping');
      }).delay(1100, this);
      this.clipwarnTimerLevel = (function() {
        this.freezeLevel = false;
      }).delay(100, this);
    }

    if (!this.freezeLevel) {
      peakWidth = (-Math.max(-50, peak)) / 0.5;
      averageWidth = 100 - (-Math.max(-50, average)) / 0.5;
    }

    this.levelElement.setStyle('width', peakWidth + '%');
    this.averageLevelElement.setStyle('width', averageWidth + '%');
  },

  onChapterChange: function() {
    var value = this.chapterInput.get('value');
    if (!value) value = this.options.chapterTitle.substitute({id: this.chapterID});
    this.chapters[this.chapters.length - 1].title = value;
  },

  hideStatus: function() {
    this.status.hide();
  },

  preventDefault: function(event) {
    event.preventDefault();
  }

});
