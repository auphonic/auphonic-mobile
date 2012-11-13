var lerp = function(start, end, percentage) {
  if (start < end) return start + (end - start) * percentage;
  else return end + (start - end) * (1.0 - percentage);
};

var AudioSequence = module.exports = function(sampleRate, data) {
  this.sampleRate = sampleRate;
  this.data = (data ? Array.prototype.slice.call(data) : []);
  this.gain = 0.0;
};

AudioSequence.prototype.merge = function(otherAudioSequence, mergePosition) {
  if (mergePosition == null) mergePosition = this.data.length;
  if (otherAudioSequence.sampleRate !== this.sampleRate) throw 'Samplerate does not match.';
  if (mergePosition < 0 || mergePosition > this.data.length) throw 'Merge position is invalid!';

  var newData = [];
  for (var i = 0; i <= this.data.length; ++i) {
    if (i == mergePosition) for (var j = 0; j < otherAudioSequence.data.length; ++j) {
        newData.push(otherAudioSequence.data[j]);
    }

    if (i < this.data.length) newData.push(this.data[i]);
  }

  this.data = newData;
  this.gain = this.getGain();
};

AudioSequence.prototype.trim = function(start, len) {
  if (len == null) len = this.data.length - start;

  if (start >= this.data.length || start < 0) throw 'The start is invalid';
  if (start + len > this.data.length || len < 0) throw 'The length is invalid.';

  this.data.splice(start, len);
  this.gain = this.getGain();
};

AudioSequence.prototype.clone = function(start, len) {
  if (start == null) start = 0;
  if (len == null) len = this.data.length - start;

  if (start < 0 || start > this.data.length) throw 'Invalid start parameter.';
  if (len < 0 || len + start > this.data.length) throw 'Invalid len parameter.';

  var clonedSequence = new AudioSequence(this.sampleRate);
  for (var i = start; i < start + len; ++i)
    clonedSequence.data.push(this.data[i]);

  clonedSequence.gain = clonedSequence.getGain();
  return clonedSequence;
};

AudioSequence.prototype.createZeroData = function(len, start) {
  var emptyData = [];
  var i = len + 1;
  while (--i) emptyData.push(0);

  var tmpSequence = new AudioSequence(this.sampleRate, emptyData);
  this.merge(tmpSequence, start);

  this.gain = this.getGain();
};

AudioSequence.prototype.getGain = function(start, len) {
  if (start == null) start = 0;
  if (len == null) len = this.data.length - start;

  if (start < 0 || start > this.data.length) throw 'start parameter is invalid.';
  if (len < 0 || len + start > this.data.length) throw 'end parameter is invalid.';

  var result = 0.0;
  for (var i = start; i < start + len; ++i)
    result = Math.max(result, Math.abs(this.data[i]));

  return result;
};

AudioSequence.prototype.getLengthInSeconds = function() {
  return this.data.length / this.sampleRate;
};

AudioSequence.prototype.filterNormalize = function(start, len) {
  if (!start) start = 0;
  if (len == null) len = this.data.length - start;

  if (start < 0 || start > this.data.length) throw 'start parameter is invalid.';
  if (len < 0 || len + start > this.data.length) throw 'end parameter is invalid.';

  var gainLevel = this.getGain(start, len);
  var amplitudeCorrection = 1.0 / gainLevel;
  for (var i = start; i < start + len; ++i)
    this.data[i] = this.data[i] * amplitudeCorrection;

  // update gain value
  this.gain = this.getGain();
};

AudioSequence.prototype.filterGain = function(gainFactor, start, len) {
  if (!start) start = 0;
  if (len == null) len = this.data.length - start;

  if (start < 0 || start > this.data.length) throw 'start parameter is invalid.';
  if (len < 0 || len + start > this.data.length) throw 'end parameter is invalid.';

  for (var i = start; i < start + len; ++i)
    this.data[i] = this.data[i] * gainFactor;

  this.gain = this.getGain();
};

AudioSequence.prototype.filterSilence = function(start, len) {
  this.filterGain(0.0, start, len);
};

AudioSequence.prototype.filterLinearFade = function(fadeStartGainFactor, fadeEndGainFactor, start, len) {
  if (!start) start = 0;
  if (len == null) len = this.data.length - start;

  if (start < 0 || start > this.data.length) throw 'start parameter is invalid.';
  if (len < 0 || len + start > this.data.length) throw 'end parameter is invalid.';

  var fadeGainMultiplier = 0.0;
  var fadePos = 0.0;
  for (var i = start; i < start + len; ++i) {
    fadePos = (i - start) / len;
    fadeGainMultiplier = lerp(fadeStartGainFactor, fadeEndGainFactor, fadePos);
    this.data[i] = this.data[i] * fadeGainMultiplier;
  }

  this.gain = this.getGain();
};
