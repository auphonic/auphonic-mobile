var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var Spinner = require('Spinner');

var Data = require('App/Data');

var UI = require('UI');
var Notice = require('UI/Notice');

var WebAudioService = require('./WebAudioService');

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Events, Options],

  options: {
    getAudioService: function() {
      return WebAudioService;
    },
    selector: '[data-media]',
    durationSelector: '[data-duration]',
    localSelector: '[data-local]',
    chapterSelector: '[data-chapters]',
    currentTimeSelector: 'div.player-details div.current-time',
    chapterMarkSelector: 'div.player-details div.chapter-mark',
    playSelector: 'a.play',
    waveformSelector: 'div.waveform',
    positionSelector: 'div.waveform div.position',
    spinnerOptions: null
  },

  isAvailable: false,
  isLoading: false,
  position: 0,
  previousPosition: 0,
  previousChapterPosition: -1,
  currentChapter: -1,
  chapters: [],

  initialize: function(element, options) {
    return this.check(element) || this.setup(element, options);
  },

  setup: function(element, options) {
    this.setOptions(options);

    element = this.element = document.id(element);
    this.button = element.getElement(this.options.playSelector);
    this.waveform = element.getElement(this.options.waveformSelector);
    this.positionIndicator = element.getElement(this.options.positionSelector);
    this.currentTimeElement = element.getElement(this.options.currentTimeSelector);
    this.chapterMarkElement = element.getElement(this.options.chapterMarkSelector);

    this.button.addEvent('click', this.bound('toggle'));
    this.waveform.addEvent('touchstart', this.bound('onSeek'));
    this.waveform.addEvent('touchmove', this.bound('onSeek'));

    this.duration = Math.round(parseFloat(element.getElement(this.options.durationSelector).get('text'))) || -1;
    this.isLocal = !!element.getElement(this.options.localSelector);
    var mediaFiles = JSON.parse(element.getElement(this.options.selector).get('html') || 'null');
    var audioService = this.options.getAudioService.call(this);
    this.service = new audioService(mediaFiles);

    this.service.addEvents({
      start: this.bound('onStart'),
      pause: this.bound('onPause'),
      stop: this.bound('onStop'),
      timeupdate: this.bound('onTimeupdate'),
      error: this.bound('onError')
    });

    this.fireEvent('setup');

    this.prepareChapters(JSON.parse(element.getElement(this.options.chapterSelector).get('html') || 'null'));
    this.onTimeupdate(0);
  },

  toggle: function(event) {
    if (event) event.preventDefault();

    if (this.isLoading) {
      this.pause();
      return;
    }

    if (this.service.isPlaying()) this.pause();
    else this.play();
  },

  play: function() {
    if (!this.isAvailable) {
      this.isLoading = true;
      this.spinnerTimer = this.showSpinner.delay(300, this);
    }
    this.service.play();
  },

  pause: function() {
    this.stopLoading();
    this.service.pause();
  },

  stop: function() {
    this.service.stop();
  },

  reset: function() {
    this.stop();
    this.onPause();
    this.onStop();
    this.service.reset();
    this.stopLoading();
    this.isLoading = false;
    this.isAvailable = false;
    this.currentChapter = -1;
    this.previousChapterPosition = -1;
  },

  _seek: function(event) {
    if (!this.isAvailable && !this.isLoading) {
      this.isLoading = true;
      this.spinnerTimer = this.showSpinner.delay(300, this);
    } else if (!this.isLoading) {
      // We pause but we don't want the UI to change.
      this.pause();
      this.button.addClass('pause');
    }

    this.previousPosition = event.page.x;
    this.position = this.convertPixelToDuration(this.previousPosition);
    var pixel = this.convertDurationToPixel(this.position);
    this.updateIndicator(pixel);
    this.fireEvent('seek', [this.position, pixel]);
    document.body.addEvent('touchend:once', this.bound('seek'));
  },

  seek: function() {
    this.service.seek(this.position);
    this.onTimeupdate(this.position);
  },

  onStart: function() {
    this.stopLoading();
    this.isAvailable = true;
    this.button.addClass('pause');
  },

  onStop: function() {
    this.position = 0;
    this.onTimeupdate(this.position);
  },

  onPause: function() {
    this.button.removeClass('pause');
  },

  onSeek: function(event) {
    event.preventDefault();

    this._seek(event);
  },

  onTimeupdate: function(position) {
    this.updateCurrentTime(position);
    this.updateChapter(position);
    this.updateIndicator(this.convertDurationToPixel(position));
  },

  onError: function() {
    this.stop();

    if (!this.notice) this.notice = new Notice('Sorry, your device does not support playback of this audio file. :(', {
      type: 'error'
    });
    else this.notice.push();
  },

  showSpinner: function() {
    if (!this.spinner) this.spinner = new Spinner(this.options.spinnerOptions);
    this.button.removeClass('play');
    this.spinner.spin(this.button);
  },

  hideSpinner: function() {
    if (this.spinner) this.spinner.stop();
    this.spinner = null;
  },

  stopLoading: function() {
    this.isLoading = false;
    this.button.addClass('play');
    clearTimeout(this.spinnerTimer);
    this.hideSpinner();
  },

  updateIndicator: function(position) {
    this.positionIndicator.setStyle('width', position);
  },

  convertPixelToDuration: function(position) {
    var duration = this.getDuration();
    var waveform = this.waveform;
    var left = waveform.offsetLeft;
    var width = waveform.offsetWidth;
    var touchPosition = Math.min(Math.max(0, position - left), width);
    return touchPosition / width * duration * 1000;
  },

  convertDurationToPixel: function(position) {
    var duration = this.getDuration();
    var width = this.waveform.offsetWidth;
    return Math.max(0, Math.min(this.waveform.offsetWidth, position / duration * width / 1000));
  },

  prepareChapters: function(chapters) {
    if (chapters) this.chapters = Array.map(chapters, function(chapter) {
      var time = chapter.start.split(':');
      var hours = parseInt(time[0] || 0, 10);
      var minutes = parseInt(time[1] || 0, 10);
      var seconds = parseInt(time[2] || 0, 10);
      chapter.time = seconds + minutes * 60 + hours * 3600;
      return chapter;
    });
  },

  getCurrentChapter: function(position) {
    var chapters = this.chapters;
    if (!chapters.length) return;

    position /= 1000;
    // When seeking backwards, let's start from the first poosition on the left
    if (position < this.previousChapterPosition) this.currentChapter = -1;

    this.previousChapterPosition = position;
    var next;
    var chapter;
    do {
      next = this.currentChapter + 1;
      chapter = chapters[next];
      if (chapter && position > chapter.time)
        this.currentChapter = next;
    } while (chapter && this.currentChapter == next);

    return chapters[this.currentChapter];
  },

  updateChapter: function(position) {
    if (!this.chapters.length) return;

    var previousChapter = this.currentChapter;
    var chapter = this.getCurrentChapter(position);
    var currentChapter = this.currentChapter;

    if (position == 0 || !chapter) {
      this.chapterMarkElement.addClass('fade');
      return;
    }

    if (previousChapter == currentChapter) {
      this.chapterMarkElement.removeClass('fade');
      return;
    }

    if (this.chapterMarkElement.hasClass('fade'))
      this.chapterMarkElement.set('text', '').removeClass('fade');

    var previous = this.chapterMarkElement;
    var current = this.chapterMarkElement = previous.cloneNode(true).set('text', chapter.title);

    UI.transition(previous.getParent(), previous, current, {
      direction: (previousChapter < currentChapter) ? 'right' : 'left',
    });
  },

  updateCurrentTime: function(position) {
    this.currentTimeElement.set('text', Data.formatDuration(Math.min(position / 1000, this.getDuration()), ' '));
  },

  getDuration: function() {
    var mediaDuration = this.service.getDuration();
    return ((mediaDuration != -1) ? mediaDuration : 0) || this.duration;
  },

  getWaveform: function() {
    return this.waveform;
  }

});
