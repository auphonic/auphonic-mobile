var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Class.Binds, Events],

  fileIndex: 0,
  position: 0,
  _isPlaying: false,
  isAvailable: false,

  initialize: function(mediaFiles) {
    this.mediaFiles = mediaFiles;
    this.mediaFile = this.pickMediaFile();
  },

  setup: function() {
    if (this.player || !this.mediaFile) return;

    this.player = new window.Media(this.mediaFile, this.bound('onSuccess'), this.bound('onLoadError'));
  },

  reset: function() {
    this.fileIndex = 0;
    this.mediaFile = this.pickMediaFile();
    this.isAvailable = false;
    this._isPlaying = false;
    if (this.player) this.player.release();
    this.player = null;
  },

  play: function() {
    if (this._isPlaying) return;
    this.setup();
    if (!this.player) {
      this.onLoadError();
      return;
    }

    if (!this.isAvailable && !this.isLocalMedia()) {
      // Cordova: Allow the UI to Update because play() freezes the browser.
      this._play.delay(300, this);
      return;
    }

    this._play();
  },

  _play: function() {
    this.player.play();
    this._isPlaying = true;
    this.isAvailable = true;
    this.startTimer();
    this.fireEvent('start');
  },

  pause: function() {
    if (!this.player) return;
    if (!this._isPlaying) return;
    this.player.pause();
    this.onPause();
  },

  stop: function() {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    this.player.stop();
    this.position = 0;
    this.onPause();
    this.fireEvent('stop');
  },

  seek: function(position) {
    this.position = position;
    // Recalculate after the media file has been loaded.
    if (!this.isAvailable) {
      this.play();
      // Cordova: Even though play() is synchronous, the duration will only be available using a delay.
      (function() {
        // In case all media files are unsupported, ignore
        if (!this.mediaFile) return;
        this.player.seekTo(this.position);
      }).delay(0, this);
      return;
    }

    if (!this._isPlaying) this.play();
    else this.startTimer();

    this.player.seekTo(position);
  },

  pickMediaFile: function() {
    return this.mediaFiles[this.fileIndex++];
  },

  startTimer: function() {
    var period = 300;
    this.stopTimer();
    this.timer = (function() {
      this.position += period;
      this.fireEvent('timeupdate', this.position);
    }).periodical(period, this);
  },

  stopTimer: function() {
    clearInterval(this.timer);
  },

  onPause: function() {
    this._isPlaying = false;
    this.stopTimer();
    this.fireEvent('pause');
  },

  onSuccess: function() {
    // In Cordova, onSuccess means the file has finished playing
    this.stop();
  },

  onLoadError: function(error) {
    this.stop();
    this.player = null;
    this.mediaFile = this.pickMediaFile();
    if (this.mediaFile) this.play();
    else this.fireEvent('error');
  },

  isLocalMedia: function() {
    return (/^\/|^file:\/\/\//i).test(this.mediaFile);
  },

  getDuration: function() {
    return this.player && this.player.getDuration();
  },

  isPlaying: function() {
    return this._isPlaying;
  }

});
