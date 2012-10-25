var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Class.Binds, Events],

  fileIndex: 0,
  _isPlaying: false,
  isAvailable: false,

  initialize: function(mediaFiles) {
    this.mediaFiles = mediaFiles;
    this.mediaFile = this.pickMediaFile();
  },

  setup: function() {
    if (this.player || !this.mediaFile) return;

    this.player = new Audio(this.mediaFile);
    this.player.addEventListener('error', this.bound('onLoadError'), false);
    this.player.addEventListener('playing', this.bound('onStart'), false);
    this.player.addEventListener('ended', this.bound('onStop'), false);
    this.player.load();
  },

  reset: function() {
    this.fileIndex = 0;
    this.mediaFile = this.pickMediaFile();
    this.isAvailable = false;
    this._isPlaying = false;
    if (this.player) {
      this.player.removeEventListener('error', this.bound('onLoadError'), false);
      this.player.removeEventListener('playing', this.bound('onStart'), false);
      this.player.removeEventListener('ended', this.bound('onStop'), false);
      this.player.removeEventListener('timeupdate', this.bound('onTimeUpdate'), false);
      this.player.removeEventListener('progress', this.bound('onMediaLoad'), false);
      this.player.pause();
      this.player = null;
    }
  },

  play: function() {
    this.setup();

    if (this.player) this.player.play();
    else this.onLoadError();
  },

  pause: function() {
    if (!this.player) return;
    this.player.removeEventListener('progress', this.bound('onMediaLoad'), false);
    this.player.pause();
    this.onPause();
  },

  stop: function() {
    if (!this._isPlaying) return;
    this.player.pause();
    this.player.currentTime = 0;
  },

  seek: function(position) {
    this.seekPosition = position;
    if (!this.player) {
      this.setup();
      if (this.player) {
        // Mobile safari only lets you set currentTime after the progress event fires.
        this.player.addEventListener('progress', this.bound('onMediaLoad'), false);
        this.play();
        return;
      }
    }

    if (!this.isAvailable) return;
    if (!this.player) return;

    // Mobile Safari is a douchebag.
    this.player.pause();
    try {
      this.player.currentTime = position / 1000;
      this.play();
    } catch (e) {
      // Well, let's try this again until it actually works :)
      this.player.addEventListener('progress', this.bound('onMediaLoad'), false);
    }
  },

  pickMediaFile: function() {
    return this.mediaFiles[this.fileIndex++];
  },

  onMediaLoad: function() {
    this.player.removeEventListener('progress', this.bound('onMediaLoad'), false);
    this.isAvailable = true;
    if (this.seekPosition) this.seek(this.seekPosition);
  },

  onStart: function() {
    this._isPlaying = true;
    this.isAvailable = true;
    this.fireEvent('start');
    this.player.addEventListener('timeupdate', this.bound('onTimeUpdate'), false);
  },

  onPause: function() {
    this._isPlaying = false;
    this.fireEvent('pause');
    this.player.removeEventListener('timeupdate', this.bound('onTimeUpdate'), false);
  },

  onStop: function() {
    this.onPause();
    this._isPlaying = false;
    this.fireEvent('stop');
  },

  onLoadError: function() {
    this.stop();
    this.player = null;
    this.mediaFile = this.pickMediaFile();
    if (this.mediaFile) this.play();
    else this.fireEvent('error');
  },

  onTimeUpdate: function() {
    this.fireEvent('timeupdate', this.player.currentTime * 1000);
  },

  getDuration: function() {
    if (!this.isAvailable) return null;
    var player = this.player;
    return player.seekable && Function.attempt(function() {
      return player.seekable.end(0);
    });
  },

  isPlaying: function() {
    return this._isPlaying;
  }

});
