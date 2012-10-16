var LocalStorage = require('Utility/LocalStorage');

var User = require('App/User');

var Auphonic = require('Auphonic');

var key = function(key) {
  return User.getSafeUsername() + '-recordings' + (key ? '-' + key : '');
};

var get = function() {
  return LocalStorage.get(key()) || {};
};

var set = function(recordings) {
  LocalStorage.set(key(), recordings);
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

var findById = exports.findById = function(id) {
  return get()[id];
};

exports.findAll = get;

exports.generateRecordingId = function() {
  var id = (LocalStorage.get(key('id')) || 0) + 1;
  LocalStorage.set(key('id'), id);
  return id;
};

exports.getRecordingName = function(recording) {
  var match = recording.name.match(Auphonic.DefaultFileNameFilter);
  return (match && match[1] ? 'Recording ' + match[1] : recording.name);
};

exports.setCurrentUpload = function(data) {
  LocalStorage.set(key('currentUpload'), data);
};

exports.getCurrentUpload = function() {
  return LocalStorage.get(key('currentUpload'));
};

exports.add = function(recording) {
  var recordings = get();
  var id = String.uniqueID();

  recording = Object.append({}, recording);
  recording.id = id;
  recording.timestamp = Date.now();
  recording.display_name = exports.getRecordingName(recording);

  recordings[id] = recording;
  set(recordings);
};

exports.remove = function(id) {
  var recording = findById(id);
  if (!recording) return;

  removeRecording(recording);
  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, onFileSystemReady, error);
};
