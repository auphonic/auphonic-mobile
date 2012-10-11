var LocalStorage = require('Utility/LocalStorage');

var get = function() {
  return LocalStorage.get('recordings') || {};
};

var set = function(recordings) {
  LocalStorage.set('recordings', recordings);
};

exports.setCurrentUpload = function(data) {
  LocalStorage.set('currentUpload', data);
};

exports.getCurrentUpload = function() {
  return LocalStorage.get('currentUpload');
};

exports.push = function(recording) {
  var recordings = get();
  recording = Object.append({}, recording);
  var id = String.uniqueID();
  recording.id = id;
  recordings[id] = recording;
  set(recordings);
};

var findById = exports.findById = function(id) {
  return get()[id];
};

exports.findAll = get;

exports.count = function() {
  return Object.values(get()).length || 0;
};

var removeRecording = function(recording) {
  var recordings = get();
  delete recordings[recording.id];
  set(recordings);
};

var error = function() {};
var removeFile = function(file) {
  file.remove(function() {}, error);
};

var onFileSystemReady = function(fileSystem) {
  fileSystem.root.getFile(this.getFileName(), null, removeFile, error);
};

exports.remove = function(id) {
  var recording = findById(id);
  if (!recording) return;

  removeRecording(recording);
  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, onFileSystemReady, error);
};
