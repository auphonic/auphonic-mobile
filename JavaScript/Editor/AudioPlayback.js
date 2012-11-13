var AudioContext = window.AudioContext || window.webkitAudioContext;

var AudioPlayback = module.exports = function() {
  // Creation of a new audio context
  this.audioBufferSize = 1024;
  this.sampleRate = 0;
  this.audioContext = new AudioContext();

  this.audioNode = this.audioContext.createJavaScriptNode(this.audioBufferSize, 1, 2);
  this.audioNode.onaudioprocess = this.onAudioUpdate.bind(this);

  this.analyserNode = this.audioContext.createAnalyser();
  this.analyserNode.minDecibels = -100;
  this.analyserNode.maxDecibels = 0;
  this.analyserNode.smoothingTimeConstant = 0.0;
  this.analyserNode.connect(this.audioContext.destination);

  this.audioData = undefined;

  // Playback information
  this.playStart = 0;
  this.playEnd = 0;
  this.isLooped = false;
  this.currentPlayPosition = 0;
  this.isPlaying = false;

  // Callback information
  this.updateListener = [];
  this.playbackUpdateInterval = 0.0; // in Seconds
  this.lastPlaybackUpdate = 0;
};

AudioPlayback.prototype.onAudioUpdate = function(evt) {
  var bufferSize = this.audioBufferSize;
  var elapsedTime = bufferSize / this.sampleRate;

  if (!this.isPlaying) return;

  var audioData = this.audioData;
  var leftBuffer = evt.outputBuffer.getChannelData(0);
  var rightBuffer = evt.outputBuffer.getChannelData(1);

  this.copyChannelDataToBuffer(leftBuffer, audioData[0], this.currentPlayPosition, bufferSize, this.playStart, this.playEnd, this.isLooped);
  if (audioData.length == 1) // mono
    this.currentPlayPosition = this.copyChannelDataToBuffer(rightBuffer, audioData[0], this.currentPlayPosition, bufferSize, this.playStart, this.playEnd, this.isLooped);
  else if (audioData.length == 2) // stereo
    this.currentPlayPosition = this.copyChannelDataToBuffer(rightBuffer, audioData[1], this.currentPlayPosition, bufferSize, this.playStart, this.playEnd, this.isLooped);

  // the playback is done
  if (this.currentPlayPosition === undefined) {
    this.stop();
  } else {
    this.lastPlaybackUpdate -= elapsedTime;
    if (this.lastPlaybackUpdate < 0.0) {
      this.lastPlaybackUpdate = this.playbackUpdateInterval;
      this.notifyListener();
    }
  }
};

/**
 * Copies the audio data to a channel buffer and sets the new play position. If looping is enabled,
 * the position is set automaticly.
 * @param bufferReference Reference to the channel buffer
 * @param dataReference Reference to the audio data
 * @param position Current position of the playback
 * @param len Length of the chunk
 * @param startPosition Start position for looping
 * @param endPosition End position for looping
 * @param isLooped Enable looping.
 */
AudioPlayback.prototype.copyChannelDataToBuffer = function(bufferReference, dataReference, position, len, startPosition, endPosition, isLooped) {
  /* In order to enable looping, we should need to split up when the end of the audio data is reached
   * to begin with the first position. Therefore is a split into two ranges if neccessary
   */
  var firstSplitStart = position;
  var firstSplitEnd = (position + len > dataReference.length) ? dataReference.length : (position + len > endPosition) ? endPosition : (position + len);
  var firstSplitLen = firstSplitEnd - firstSplitStart;

  var secondSplitStart = (firstSplitLen < bufferReference.length) ? (isLooped) ? startPosition : 0 : undefined;
  var secondSplitEnd = (secondSplitStart !== undefined) ? bufferReference.length - firstSplitLen + secondSplitStart : undefined;

  if (secondSplitStart === undefined) {
    this.copyIntoBuffer(bufferReference, 0, dataReference, firstSplitStart, firstSplitEnd);
    return firstSplitEnd;
  }

  this.copyIntoBuffer(bufferReference, 0, dataReference, firstSplitStart, firstSplitEnd);
  if (isLooped) {
    this.copyIntoBuffer(bufferReference, firstSplitLen, dataReference, secondSplitStart, secondSplitEnd);
    return secondSplitEnd;
  }

  return null;
};

AudioPlayback.prototype.copyIntoBuffer = function(bufferReference, bufferOffset, dataReference, dataOffset, end) {
  bufferReference.set(dataReference.slice(dataOffset, end), bufferOffset);
};

AudioPlayback.prototype.play = function(audioData, sampleRate, isLooped, start, end) {
  if (this.isPlaying || audioData === undefined || audioData.length < 1 ||
    sampleRate === undefined || sampleRate <= 0) return;

  if (this.currentPlayPosition) {
    this.resume();
    return;
  }

  this.audioData = audioData;
  this.sampleRate = sampleRate;
  this.isLooped = (isLooped === undefined) ? false : isLooped;
  this.playStart = (start === undefined || start < 0 || start >= audioData[0].length) ? 0 : start;
  this.playEnd = (end === undefined || end - this.audioBufferSize < start || end >= audioData[0].length) ? audioData[0].length : end;
  this.currentPlayPosition = this.playStart;
  this.isPlaying = true;

  this.audioNode.connect(this.analyserNode);

  this.notifyListener();
};

AudioPlayback.prototype.stop = function() {
  if (!this.isPlaying) return;

  this.audioNode.disconnect(this.analyserNode);

  this.playStart = 0;
  this.playEnd = 0;
  this.isLooped = false;
  this.currentPlayPosition = 0;
  this.isPlaying = false;
  this.lastPlaybackUpdate = 0;
  this.audioData = undefined;
  this.sampleRate = 0;

  this.notifyListener();
};

AudioPlayback.prototype.pause = function() {
  if (!this.isPlaying) return;

  this.audioNode.disconnect(this.analyserNode);

  this.isPlaying = false;
  this.lastPlaybackUpdate = 0;
  this.notifyListener();
};

AudioPlayback.prototype.resume = function() {
  if (this.isPlaying || this.audioData === undefined || this.audioData.length < 1) return;
  this.isPlaying = true;

  this.audioNode.connect(this.analyserNode);

  this.notifyListener();
};

AudioPlayback.prototype.addListener = function(updateCallback) {
  this.updateListener.push(updateCallback);
};

AudioPlayback.prototype.notifyListener = function() {
  for (var i = 0; i < this.updateListener.length; ++i)
    this.updateListener[i]();
};
