/* BinaryWriter by Rainer Heynke */
var BinaryWriter = module.exports = function(size, bigEndian) {
  this.size = size;
  this.data = new Uint8Array(size);
  this.bigEndian = bigEndian;
};

BinaryWriter.prototype.size = 0;
BinaryWriter.prototype.pos = 0;

BinaryWriter.prototype.getData = function() {
  return this.data;
};

BinaryWriter.prototype.writeUInt8 = function(value) {
  return this.writeInteger(value, 1);
};

BinaryWriter.prototype.writeInt8 = function(value) {
  return this.writeInteger(value, 1);
};

BinaryWriter.prototype.writeUInt16 = function(value) {
  return this.writeInteger(value, 2);
};

BinaryWriter.prototype.writeInt16 = function(value) {
  return this.writeInteger(value, 2);
};

BinaryWriter.prototype.writeUInt32 = function(value) {
  return this.writeInteger(value, 4);
};

BinaryWriter.prototype.writeInt32 = function(value) {
  return this.writeInteger(value, 4);
};

BinaryWriter.prototype.writeString = function(value) {
  for (var i = 0; i < value.length; ++i) this.data[this.pos++] = value.charCodeAt(i);
};

var masks = [0x0, 0xFF + 1, 0xFFFF + 1, 0xFFFFFF + 1, 0xFFFFFFFF + 1];
BinaryWriter.prototype.writeInteger = function(value, size) {
  if (value < 0) value += masks[size];
  for (var i = 0; i < size; ++i) {
    if (this.bigEndian) this.data[this.pos++] = (value >> ((size - i - 1) * 8)) & 0xFF;
    else this.data[this.pos++] = (value >> (i * 8)) & 0xFF;
  }
};
