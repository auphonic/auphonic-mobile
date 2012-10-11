// TODO transform all access into objects!

var LocalStorage = require('Utility/LocalStorage');

exports.setCurrentUpload = function(data) {
  LocalStorage.set('currentUpload', data);
};

exports.getCurrentUpload = function() {
  return LocalStorage.get('currentUpload');
};

exports.push = function(recording) {
  var recordings = LocalStorage.get('recordings');
  recordings.push(recording);
};

exports.findById = function(id) {
  var recordings = LocalStorage.get('recordings');

  for (var i = 0; i < recordings.length; i++) {
    if (id == recordings[i].name)
      return recordings[i];
  }

  return null;
};

exports.findAll = function() {
  var recordings = LocalStorage.get('recordings');
  var object = {};
  if (recordings) recordings.each(function(recording) {
    recording.id = recording.name;
    object[recording.name] = recording;
  });

  return object;
};

exports.count = function() {
  var recordings = LocalStorage.get('recordings');
  return (recordings && recordings.length) || 0;
};

var removeRecording = function(recording) {
  var recordings = LocalStorage.get('recordings');
  for (var i = 0; i < recordings.length; i++) {
    if (recording.name == recordings[i].name)
      delete recordings[i];
  }

  LocalStorage.set('recordings', recordings.clean());
};

var error = function() {};
var removeFile = function(file) {
  file.remove(function() {}, error);
};

var onFileSystemReady = function(fileSystem) {
  fileSystem.root.getFile(this.getFileName(), null, removeFile, error);
};

exports.remove = function(id) {
  var recording = exports.findById(id);
  if (!recording) return;

  removeRecording(recording);
  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, onFileSystemReady, error);
};
