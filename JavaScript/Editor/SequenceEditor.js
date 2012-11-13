var Binds = require('./Binds');

var SequenceEditor = module.exports = function(sequence, container) {
  Binds.mixin(this);

  this.element = document.createElement('div');
  container.appendChild(this.element);

  this.audioSequence = sequence;
  this.clipboardAudioSequence = undefined;
  this.canvasHeight = 100;
  this.canvasWidth = container.offsetWidth;

  this.mouseX = 0;
  this.mouseY = 0;
  this.previousMouseX = 0;
  this.previousMouseY = 0;

  this.selectionStart = 0;
  this.selectionEnd = 0;
  this.backgroundColor = '#fff';
  this.waveformColor = '#555';

  this.colorSelectionStroke = 'rgba(0, 0, 255, 0.5)';
  this.colorSelectionFill = 'rgba(0, 0, 255, 0.2)';

  this.visualizationData = [];
  this.linkedEditors = [];
  this.movePos = 0;

  this.viewResolution = 10; // default 10 seconds
  this.viewPos = 0; // at 0 seconds
  this.playbackPos = 0;

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;
  this.element.appendChild(this.canvas);

  this.attach();
  this.update();
};

SequenceEditor.prototype.remove = function() {
  this.detach();
  this.element.parentNode.removeChild(this.element);
};

SequenceEditor.prototype.link = function(editor) {
  for (var i = 0; i < this.linkedEditors.length; ++i) {
    if (this.linkedEditors[i] === editor) return;
  }

  this.linkedEditors.push(editor);
  editor.link(this);
};

SequenceEditor.prototype.updateSelectionForLinkedEditors = function() {
  for (var i = 0; i < this.linkedEditors.length; ++i) {
    this.linkedEditors[i].selectionStart = this.selectionStart;
    this.linkedEditors[i].selectionEnd = this.selectionEnd;

    if (this.linkedEditors[i].viewPos != this.viewPos || this.linkedEditors[i].viewResolution != this.linkedEditors[i].viewResolution) {
      this.linkedEditors[i].viewPos = this.viewPos;
      this.linkedEditors[i].viewResolution = this.viewResolution;
      this.linkedEditors[i].update();
    }
    this.linkedEditors[i].repaint();
  }
};

SequenceEditor.prototype.setPosition = function(position) {
  this.playbackPos = position;
  this.repaint();
};

SequenceEditor.prototype.update = function() {
  this.getDataInResolution(this.viewResolution, this.viewPos);
  this.repaint();
};

SequenceEditor.prototype.getDataInResolution = function(resolution, offset) {
  this.visualizationData = [];
  var i = 0;
  var data = this.audioSequence.data;
  var offsetR = this.audioSequence.sampleRate * offset;

  // get the offset and length in samples
  var from = Math.round(offset * this.audioSequence.sampleRate);
  var len = Math.round(resolution * this.audioSequence.sampleRate);
  // when the spot is to large
  if (len > this.canvas.width) {
    var dataPerPixel = len / this.canvas.width;
    for (i = 0; i < this.canvas.width; ++i) {
      var dataFrom = i * dataPerPixel + offsetR;
      var dataTo = (i + 1) * dataPerPixel + offsetR + 1;

      if (dataFrom >= 0 && dataFrom < data.length &&
        dataTo >= 0 && dataTo < data.length) {
        var peakAtFrame = this.getPeakInFrame(dataFrom, dataTo, data);
        this.visualizationData.push(peakAtFrame);
      } else {
        this.visualizationData.push({
          min: 0.0,
          max: 0.0
        });
      }
    }
    this.visualizationData.plotTechnique = 1;
  } else {
    var pixelPerData = this.canvas.width / len;
    var x = 0;
    for (i = from; i <= from + len; ++i) {
      // if outside of the data range
      if (i < 0 || i >= data.length) {
        this.visualizationData.push({
          y : 0.0,
          x : x
        });
      } else {
        this.visualizationData.push({
          y : data[i],
          x : x
        });
      }
      x += pixelPerData;
    }
    this.visualizationData.plotTechnique = 2;
  }
};

SequenceEditor.prototype.repaint = function() {
  var context = this.canvas.getContext('2d');
  context.fillStyle = this.backgroundColor;
  context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.paintWaveform(context);
  this.paintSelector(context);
};

SequenceEditor.prototype.paintWaveform = function(context) {
  var seq = this.audioSequence;
  var center = this.canvas.height / 2;
  var i = 0;

  // if the signal is above the 0db border, then a vertical zoomout must be applied
  var verticalMultiplier = (seq.gain < 1.0) ? 1.0 : 1.0 / seq.gain;

  context.strokeStyle = this.waveformColor;
  context.beginPath();
  context.moveTo(0, center);

  // choose the drawing style of the waveform
  if (this.visualizationData.plotTechnique == 1) {
    // data per pixel
    for (i = 0; i < this.canvas.width; ++i) {
      var peakAtFrame = this.visualizationData[i];
      context.moveTo(i + 0.5, center + peakAtFrame.min * verticalMultiplier * -center);
      context.lineTo(i + 0.5, (center + peakAtFrame.max * verticalMultiplier * -center) + 1.0);
    }
  } else if (this.visualizationData.plotTechnique == 2) {
    var s = 1;

    for (i = 0; i < this.visualizationData.length; ++i) {
      var x = this.visualizationData[i].x;
      var y = center + this.visualizationData[i].y * verticalMultiplier * -center;

      context.lineTo(x, y);

      // draw edges around each data point
      context.moveTo(x + s, y - s);
      context.lineTo(x + s, y + s);
      context.moveTo(x - s, y - s);
      context.lineTo(x - s, y + s);
      context.moveTo(x - s, y + s);
      context.lineTo(x + s, y + s);
      context.moveTo(x - s, y - s);
      context.lineTo(x + s, y - s);

      context.moveTo(x, y);
    }
  }

  context.stroke();

  // draw the horizontal center line
  context.strokeStyle = this.waveformColor;
  context.beginPath();
  context.moveTo(0, center);
  context.lineTo(this.canvas.width, center);
  context.stroke();
};

SequenceEditor.prototype.paintSelector = function(context) {
  var selectionStartPixel = this.getAbsoluteToPixel(this.selectionStart);
  var selectionEndPixel = this.getAbsoluteToPixel(this.selectionEnd);

  if (this.selectionStart !== this.selectionEnd) {
    var start = (selectionStartPixel < selectionEndPixel) ? selectionStartPixel : selectionEndPixel;
    var width = (selectionStartPixel < selectionEndPixel) ? selectionEndPixel - selectionStartPixel : selectionStartPixel - selectionEndPixel;

    context.fillStyle = this.colorSelectionFill;
    context.fillRect(start, 0, width, this.canvas.height);

    context.strokeStyle = this.colorSelectionStroke;
    context.strokeRect(start, 0, width, this.canvas.height);
  } else {
    context.strokeStyle = this.colorSelectionStroke;
    context.beginPath();
    context.moveTo(selectionStartPixel, 0);
    context.lineTo(selectionStartPixel, this.canvas.height);
    context.stroke();
  }

  var playbackPixelPos = this.getAbsoluteToPixel(this.playbackPos);
  if (playbackPixelPos > 0 && playbackPixelPos < this.canvas.width) {
    context.strokeStyle = this.colorSelectionStroke;
    context.beginPath();
    context.moveTo(playbackPixelPos, 0);
    context.lineTo(playbackPixelPos, this.canvas.height);
    context.stroke();
  }
};

SequenceEditor.prototype.getPeakInFrame = function(from, to, data) {
  from = Math.max(0, Math.round(from));
  to = Math.min(Math.round(to), data.length);
  var min = 1.0;
  var max = -1.0;

  for (var i = from; i < to; ++i) {
    var sample = data[i];
    if (sample > max) max = sample;
    if (sample < min) min = sample;
  }

  return {
    min: min,
    max: max
  };
};

SequenceEditor.prototype.getSelectionInDataRange = function() {
  var start = Math.round(this.audioSequence.data.length / this.canvas.width * this.selectionStart);
  var end = Math.round(this.audioSequence.data.length / this.canvas.width * this.selectionEnd);

  return {
    start : start,
    end : end
  };
};

SequenceEditor.prototype.selectDataInRange = function(start, end) {
  this.selectionStart = Math.round(this.canvas.width / this.audioSequence.data.length * start);
  this.selectionEnd = Math.round(this.canvas.width / this.audioSequence.data.length * end);
};

SequenceEditor.prototype.getPixelToAbsolute = function(pixelValue) {
  var totalSamplesInResolution = this.viewResolution * this.audioSequence.sampleRate;
  var totalSamplesOffset = this.viewPos * this.audioSequence.sampleRate;
  return Math.round(totalSamplesInResolution / this.canvas.width * pixelValue + totalSamplesOffset);
};

SequenceEditor.prototype.getAbsoluteToPixel = function(absoluteValue) {
  var totalSamplesInResolution = this.viewResolution * this.audioSequence.sampleRate;
  var totalSamplesOffset = this.viewPos * this.audioSequence.sampleRate;
  return (absoluteValue - totalSamplesOffset) / totalSamplesInResolution * this.canvas.width;
};

SequenceEditor.prototype.getAbsoluteToSeconds = function(absoluteValue) {
  return absoluteValue / this.audioSequence.sampleRate;
};

SequenceEditor.prototype.getSecondsToAbsolute = function(seconds) {
  return seconds * this.audioSequence.sampleRate;
};

SequenceEditor.prototype.zoom = function() {
  this.viewResolution = this.getAbsoluteToSeconds(this.selectionEnd - this.selectionStart);
  this.viewPos = this.getAbsoluteToSeconds(this.selectionStart);

  this.update();
  this.updateSelectionForLinkedEditors();
  this.repaint();
};

SequenceEditor.prototype.showAll = function() {
  this.viewPos = 0;
  this.viewResolution = this.getAbsoluteToSeconds(this.audioSequence.data.length);

  this.update();
  this.updateSelectionForLinkedEditors();
  this.repaint();
};

SequenceEditor.prototype.filterNormalize = function() {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  if (start == end)  this.audioSequence.filterNormalize();
  else this.audioSequence.filterNormalize(start, end - start);

  this.update();
  this.repaint();
};

SequenceEditor.prototype.filterFade = function(fadeIn) {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  if (start == end)
    this.audioSequence.filterLinearFade((fadeIn === true) ? 0.0 : 1.0, (fadeIn === true) ? 1.0 : 0.0);
  else
    this.audioSequence.filterLinearFade((fadeIn === true) ? 0.0 : 1.0, (fadeIn === true) ? 1.0 : 0.0, start, end - start);

  this.update();
  this.repaint();
};

SequenceEditor.prototype.filterGain = function(decibel) {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  if (start == end)
    this.audioSequence.filterGain(this.getQuantity(decibel));
  else
    this.audioSequence.filterGain(this.getQuantity(decibel), start, end - start);

  this.update();
  this.repaint();
};

SequenceEditor.prototype.filterSilence = function() {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  if (start == end) this.audioSequence.filterSilence();
  else this.audioSequence.filterSilence(start, end - start);

  this.update();
  this.repaint();
};

SequenceEditor.prototype.getDecibel = function(signalValue, signalMaxium) {
  return 20.0 * Math.log(signalValue / signalMaxium) / Math.LN10;
};

SequenceEditor.prototype.getQuantity = function(decibel) {
  return Math.exp(decibel * Math.LN10 / 20.0);
};

SequenceEditor.prototype.selectAll = function(processLinks) {
  this.selectionStart = 0;
  this.selectionEnd = this.audioSequence.data.length;
  this.repaint();
};

SequenceEditor.prototype.copy = function(processLinks) {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  this.clipboardAudioSequence = this.audioSequence.clone(start, end - start);
  if (processLinks) {
    for (var i = 0; i < this.linkedEditors.length; ++i)
      this.linkedEditors[i].copy(false);
  }
};

SequenceEditor.prototype.paste = function(processLinks) {
  if (this.clipboardAudioSequence === undefined) return;

  if (this.selectionStart != this.selectionEnd)
    this.remove(false);

  // paste before the data block begins
  if (this.selectionEnd < 0) {
    // fill the space with zeros
    this.viewPos -= this.getAbsoluteToSeconds(this.selectionStart);
    this.audioSequence.createZeroData(-this.selectionEnd, 0);
    this.audioSequence.merge(this.clipboardAudioSequence, 0);
    this.selectionStart = 0;
    this.selectionEnd = this.clipboardAudioSequence.data.length;
  // paste beyond the data block
  } else if (this.selectionStart > this.audioSequence.data.length) {
    this.audioSequence.createZeroData(this.selectionStart - this.audioSequence.data.length);
    this.audioSequence.merge(this.clipboardAudioSequence);
    this.selectionEnd = this.selectionStart + this.clipboardAudioSequence.data.length;
  // paste inside of the datablock
  } else {
    this.audioSequence.merge(this.clipboardAudioSequence, this.selectionStart);
    this.selectionStart = this.selectionStart;
    this.selectionEnd = this.selectionStart + this.clipboardAudioSequence.data.length;
  }

  this.update();
  this.repaint();

  if (processLinks) {
    for (var i = 0; i < this.linkedEditors.length; ++i)
      this.linkedEditors[i].paste(false);
  }
};


SequenceEditor.prototype.cut = function(processLinks) {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  this.clipboardAudioSequence = this.audioSequence.clone(start, end - start);
  this.remove(false);
  this.selectionEnd = this.selectionStart;
  this.update();
  if (processLinks) {
    for (var i = 0; i < this.linkedEditors.length; ++i)
      this.linkedEditors[i].cut(false);
  }
};

SequenceEditor.prototype.remove = function(processLinks) {
  var length = this.audioSequence.data.length;
  var start = (this.selectionStart < 0) ? 0 : (this.selectionStart >= length) ? length - 1 : this.selectionStart;
  var end = (this.selectionEnd < 0) ? 0 : (this.selectionEnd >= length) ? length - 1 : this.selectionEnd;

  this.audioSequence.trim(start, end - start);
  this.update();

  if (processLinks) {
    for (var i = 0; i < this.linkedEditors.length; ++i)
      this.linkedEditors[i].remove(false);
  }
};

SequenceEditor.prototype.deselect = function() {
  this.selectionStart = 0;
  this.selectionEnd = 0;
  this.repaint();
  this.updateSelectionForLinkedEditors();
};

SequenceEditor.prototype.attach = function() {
  this.canvas.addEventListener('touchstart', this.bound('onTouchstart'), false);
  this.canvas.addEventListener('touchmove', this.bound('onTouchmove'), false);
  document.addEventListener('touchend', this.bound('onTouchend'), false);
};

SequenceEditor.prototype.detach = function() {
  this.canvas.removeEventListener('touchstart', this.bound('onTouchstart'), false);
  this.canvas.removeEventListener('touchmove', this.bound('onTouchmove'), false);
  document.removeEventListener('touchend', this.bound('onTouchend'), false);
};

SequenceEditor.prototype.onTouchstart = function() {
  var selectionStartPixel = this.getAbsoluteToPixel(this.selectionStart);
  var selectionEndPixel = this.getAbsoluteToPixel(this.selectionEnd);
  this.mouseX = event.touches[0].clientX - this.canvas.offsetLeft;

  if (this.mouseX - 5 > selectionStartPixel && this.mouseX + 5 < selectionEndPixel) {
    this.isInSelection = true;
  } else {
    this.selectionStart = this.getPixelToAbsolute(this.mouseX);
    this.selectionEnd = this.getPixelToAbsolute(this.mouseX);
  }

  // TODO if touching inside the selection, highlight it a little

  this.repaint();
  this.updateSelectionForLinkedEditors();
};

SequenceEditor.prototype.onTouchmove = function(event) {
  event.preventDefault();

  this.previousMouseX = this.mouseX;
  this.previousMouseY = this.mouseY;
  this.mouseX = event.touches[0].clientX - this.canvas.offsetLeft;
  this.mouseY = event.touches[0].clientY - this.canvas.offsetTop;
  var mouseXDelta = this.mouseX - this.previousMouseX;

  if (this.isInSelection) {
    var absDelta = this.getPixelToAbsolute(this.mouseX) -
    this.getPixelToAbsolute(this.previousMouseX);

    // move the selection with the delta
    this.selectionStart += absDelta;
    this.selectionEnd += absDelta;
  } else {
    this.selectionEnd = this.getPixelToAbsolute(this.mouseX);
  }

  var movementResolution = this.viewResolution / this.canvas.width;
  this.viewPos -= mouseXDelta * movementResolution;
  this.viewPos = 0;
  //this.selectionStart -= mouseXDelta * movementResolution;
  //this.selectionEnd -= mouseXDelta * movementResolution;
  this.update();
  this.updateSelectionForLinkedEditors();
};

SequenceEditor.prototype.onTouchend = function() {
  //if (!event.target || event.target != this.canvas) this.deselect();

  if (this.selectionStart > this.selectionEnd) {
    var temp = this.selectionStart;
    this.selectionStart = this.selectionEnd;
    this.selectionEnd = temp;
  }

  this.isInSelection = false;
  this.repaint();
  this.updateSelectionForLinkedEditors();
};
