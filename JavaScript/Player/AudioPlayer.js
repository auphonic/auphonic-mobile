var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var Spinner = require('Thirdparty/Spinner');

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
    playSelector: 'a.play',
    waveformSelector: 'div.waveform',
    positionSelector: 'div.waveform div.position',
    spinnerOptions: null
  },

  isAvailable: false,
  isLoading: false,
  position: 0,

  initialize: function(element, options) {
    return this.check(element) || this.setup(element, options);
  },

  setup: function(element, options) {
    this.setOptions(options);

    element = this.element = document.id(element);
    this.button = element.getElement(this.options.playSelector);
    this.waveform = element.getElement(this.options.waveformSelector);
    this.positionIndicator = element.getElement(this.options.positionSelector);
    this.duration = Math.round(parseFloat(element.getElement(this.options.durationSelector).get('text'))) || -1;
    this.button.addEvent('click', this.bound('toggle'));
    this.waveform.addEvent('touchstart', this.bound('onSeek'));
    this.waveform.addEvent('touchmove', this.bound('onSeek'));

    var mediaFiles = JSON.parse(element.getElement(this.options.selector).get('html'));
    var audioService = this.options.getAudioService();
    this.service = new audioService(mediaFiles);

    this.service.addEvents({
      start: this.bound('onStart'),
      pause: this.bound('onPause'),
      stop: this.bound('onStop'),
      timeupdate: this.bound('onTimeupdate'),
      error: this.bound('onError')
    });

    this.fireEvent('setup');
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
  },

  onStart: function() {
    this.stopLoading();
    this.isAvailable = true;
    this.button.addClass('pause');
  },

  onStop: function() {
    this.position = 0;
    this.updateIndicator(0);
  },

  onPause: function() {
    this.button.removeClass('pause');
  },

  onSeek: function(event) {
    event.preventDefault();

    this._seek(event);
  },

  onTimeupdate: function(position) {
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
    return position / duration * width / 1000;
  },

  getDuration: function() {
    var mediaDuration = this.service.getDuration();
    return ((mediaDuration != -1) ? mediaDuration : 0) || this.duration;
  },

  getWaveform: function() {
    return this.waveform;
  }

});
