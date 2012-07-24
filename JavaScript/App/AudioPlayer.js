var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

module.exports = new Class({

  Implements: [Class.Singleton, Class.Binds, Options],

  options: {
    selector: '[data-media]'
  },

  isPlaying: false,
  fileIndex: 0,

  initialize: function(element, options) {
    return this.check(element) || this.setup(element);
  },

  setup: function(element, options) {
    this.setOptions(options);

    element = this.element = document.id(element);
    this.mediaFiles = JSON.parse(element.getElement(this.options.selector).get('html'));
    this.mediaFile = this.pickMediaFile();

    element.addEvent('click', this.bound('play'));
  },

  play: function(event) {
    event.preventDefault();

    var media = this.getMedia();
    if (this.isPlaying) {
      media.pause();
      this.element.removeClass('pause');
    } else {
      media.play();
      this.element.addClass('pause');
    }

    this.isPlaying = !this.isPlaying;
  },

  getMedia: function() {
    return (this.media) ? this.media : this.media = new Media(this.mediaFile, this.bound('onSuccess'), this.bound('onLoadError'));
  },

  pickMediaFile: function() {
    return this.mediaFiles[this.fileIndex++];
  },

  onSuccess: function() {
    console.log('success');
  },

  onLoadError: function(error) {
    console.log(error.code);
    console.log(error.message);

    this.media = null;
    this.mediaFile = this.pickMediaFile();
    if (this.mediaFile) this.getMedia().play();
    else this.onError();
  },

  onError: function() {

  }

});
