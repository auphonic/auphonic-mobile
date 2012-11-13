var BinaryWriter = require('./BinaryWriter');

var URL = window.URL || window.webkitURL;

var WAVEncoder = module.exports = function(sequences) {
  this.audioSequences = [];
  this.fromSequences(sequences);
};

WAVEncoder.prototype.sampleRate = 0;
WAVEncoder.prototype.fromSequences = function(sequences) {
  var sampleRate = sequences[0].sampleRate;
  var length = sequences[0].data.length;

  for (var i = 1; i < sequences.length; i++) {
    if (sequences[i].sampleRate != sampleRate || sequences[i].data.length != length)
      throw 'The input sequences must have the same length and samplerate';
  }

  this.sampleRate = sampleRate;
  this.audioSequences = sequences;
};

WAVEncoder.prototype.toBlobURL = function(encoding, fn) {
  var reader = new FileReader();
  reader.onloadend = function(event) {
    fn(reader.result);
  };
  reader.readAsDataURL(new window.Blob([this.encode()], {type: encoding}));
};

var signedBorders = [0, 0xFF - 0x80, 0xFFFF - 0x8000, 0xFFFFFFFFF - 0x80000000];
WAVEncoder.prototype.encode = function() {
  var channels = this.audioSequences.length;
  var bitsPerSample = 16;
  var byteRate = this.sampleRate * this.audioSequences.length * bitsPerSample / 8;
  var blockAlign = this.audioSequences.length * bitsPerSample / 8;
  var samples = this.audioSequences[0].data.length;
  var subchunk2ID = 'data';
  var subchunk2Size = samples * blockAlign;
  var chunkSize = subchunk2Size + 36; // 36 are the bytes from format to subchunk2Size
  var totalSize = chunkSize + 8;

  var writer = new BinaryWriter(totalSize);
  writer.writeString('RIFF'); // format
  writer.writeUInt32(chunkSize); // chunkSize
  writer.writeString('WAVE'); // chunkID
  writer.writeString('fmt '); // subchunk1ID
  writer.writeUInt32(16); // subchunk1Size
  writer.writeUInt16(1); // audioFormat
  writer.writeUInt16(channels); // channels
  writer.writeUInt32(this.sampleRate); // sampleRate
  writer.writeUInt32(byteRate);
  writer.writeUInt16(blockAlign);
  writer.writeUInt16(bitsPerSample);
  writer.writeString(subchunk2ID);
  writer.writeUInt32(subchunk2Size);

  var signedBorder = signedBorders[bitsPerSample / 8];
  for (var i = 0; i < samples; ++i)
    for (var channelId = 0; channelId < channels; ++channelId)
      writer.writeInt16((this.audioSequences[channelId].data[i] + ((bitsPerSample == 8) ? 1 : 0)) * signedBorder);

  return writer.getData();
};
