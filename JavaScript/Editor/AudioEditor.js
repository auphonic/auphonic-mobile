var AudioPlayback = require('./AudioPlayback');
var AudioSequence = require('./AudioSequence');
var Binds = require('./Binds');
var SequenceEditor = require('./SequenceEditor');
var WAVEncoder = require('./WAVEncoder');

var invoke = function(array, methodName){
  var args = Array.prototype.slice.call(arguments, 2);
  return array.map(function(item){
    return item[methodName].apply(item, args);
  });
};

var AudioEditor = module.exports = function(element) {
  Binds.mixin(this);
  this.element = element;
  this.editors = [];
  this.linkMode = false;
  this.playLoop = false;

  this.audioPlayback = new AudioPlayback();
  this.audioPlayback.addListener(this.bound('onPlaybackUpdate'));
};

AudioEditor.prototype.onPlaybackUpdate = function() {
  this.editors.each(function(editor) {
    editor.setPosition(this.audioPlayback.currentPlayPosition);
  }, this);

  var node = this.audioPlayback.analyserNode;
  node.getFloatFrequencyData(new Float32Array(node.frequencyBinCount));
};

AudioEditor.prototype.addSequence = function(sequence) {
  var editor = new SequenceEditor(sequence, this.element);
  this.editors.push(editor);
  this.setLinkMode(this.linkMode);
  return editor;
};

AudioEditor.prototype.removeSequences = function() {
  invoke(this.editors, 'remove');
  this.editors = [];
};

AudioEditor.prototype.setLinkMode = function(linkMode) {
  this.linkmode = linkMode;
  if (!this.linkMode) return;

  var editors = this.editors;
  for (var i = 0; i < editors.length - 1; ++i) {
    for (var j = i + 1; j < editors.length; ++j) {
      editors[i].link(editors[j]);
    }
  }
};

AudioEditor.prototype.selectAll = function() { invoke(this.editors, 'selectAll'); };
AudioEditor.prototype.filterNormalize = function() { invoke(this.editors, 'filterNormalize'); };
AudioEditor.prototype.filterFadeIn = function() { invoke(this.editors, 'filterFade', true); };
AudioEditor.prototype.filterFadeOut = function() { invoke(this.editors, 'filterFade', false); };
AudioEditor.prototype.filterGain = function(decibel) { invoke(this.editors, 'filterGain', false); };
AudioEditor.prototype.filterSilence = function() { invoke(this.editors, 'filterSilence'); };
AudioEditor.prototype.copy = function() { invoke(this.editors, 'copy', false); };
AudioEditor.prototype.paste = function() { invoke(this.editors, 'paste', false); };
AudioEditor.prototype.cut = function() { invoke(this.editors, 'cut', false); };
AudioEditor.prototype.remove = function() { invoke(this.editors, 'remove', false); };
AudioEditor.prototype.zoom = function() { invoke(this.editors, 'zoom'); };
AudioEditor.prototype.showAll = function() { invoke(this.editors, 'showAll'); };
AudioEditor.prototype.pause = function() { this.audioPlayback.pause(); };
AudioEditor.prototype.stop = function() { this.audioPlayback.stop(); };
AudioEditor.prototype.toggleLoop = function() { this.playLoop = !this.playLoop; };

AudioEditor.prototype.play = function() {
  // fast version
  var audioData = this.editors.map(function(editor) {
    return editor.audioSequence.data;
  });
  var selectionStart = this.editors[0].selectionStart;
  var selectionEnd = this.editors[0].selectionEnd;
  if (selectionStart != selectionEnd) this.audioPlayback.play(audioData, this.editors[0].audioSequence.sampleRate, this.playLoop, selectionStart, selectionEnd);
  else this.audioPlayback.play(audioData, this.editors[0].audioSequence.sampleRate, this.playLoop);

  /* slow version
  this.render('audio/wav', (function(url) {
    this.audioPlayback.src = url;
    this.audioPlayback.play();
  }).bind(this));
  */
};

AudioEditor.prototype.render = function(encoding, fn) {
  new WAVEncoder(this.editors.map(function(editor) {
    return editor.audioSequence;
  })).toBlobURL(encoding, fn);
};

var decode = function(buffer) {
  for (var i = 0; i < buffer.numberOfChannels; i++)
    this.addSequence(new AudioSequence(buffer.sampleRate, buffer.getChannelData(i)));
};

AudioEditor.prototype.loadFromArrayBuffer = function(arrayBuffer) {
  this.removeSequences();
  this.audioPlayback.audioContext.decodeAudioData(arrayBuffer, decode.bind(this), function() {
    console.log('error');
  });
};
