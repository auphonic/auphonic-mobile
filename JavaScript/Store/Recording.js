var LocalStorage = require('Utility/LocalStorage');
var formatTimestamp = require('Utility/formatTimestamp');

var User = require('Store/User');

var Auphonic = require('Auphonic');

// u == un-authenticated
var key = function(key) {
  return User.getId() + '-recordings' + (key ? '-' + key : '');
};

var ukey = function(key) {
  return '-recordings' + (key ? '-' + key : '');
};

var get = function() {
  var recordings = LocalStorage.get(key()) || {};
  // Append all un-authenticated recordings to the recordings of the current user.
  Object.append(recordings, uget());
  set(recordings);
  return recordings;
};

var set = function(recordings) {
  LocalStorage.set(key(), recordings);
};

var uget = function() {
  return LocalStorage.get(ukey()) || {};
};

var uset = function(recordings) {
  LocalStorage.set(ukey(), recordings);
};

var removeRecording = function(recording) {
  var recordings = get();
  var uRecordings = uget();
  delete recordings[recording.id];
  delete uRecordings[recording.id];
  set(recordings);
  uset(uRecordings);
};

var error = function() {};
var removeFile = function(file) {
  file.remove(function() {}, error);
};

var read = function(id, success, error) {
  var recording = findById(id);
  if (recording) window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    fileSystem.root.getFile(recording.fullPath, null, success, error);
  }, error);
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

var getRecordingName = function(recording) {
  var match = recording.name.match(Auphonic.DefaultFileNameFilter);
  return (match && match[1] ? 'Recording ' + match[1] : recording.name);
};

var update = function(recording) {
  var recordings = get();
  recordings[recording.id] = recording;
  set(recordings);
};

exports.update = update;

exports.add = function(recording) {
  if (recording.uploaded) return recording;

  var id = String.uniqueID();
  recording = Object.append({}, recording);
  recording.id = id;
  recording.timestamp = Date.now();
  recording.display_name = getRecordingName(recording);
  recording.uploaded = true;
  update(recording);
  return recording;
};

exports.addProduction = function(id, productionUUID) {
  var recording = findById(id);
  if (!recording) return;

  if (!recording.productions) recording.productions = [];
  recording.productions.include(productionUUID);
  update(recording);
  return recording;
};

exports.removeProduction = function(id, productionUUID) {
  var recording = findById(id);
  if (!recording) return;

  if (recording.productions) recording.productions.erase(productionUUID);
  update(recording);
  return recording;
};

exports.remove = function(id) {
  var recording = findById(id);
  if (!recording) return;

  removeRecording(recording);
  read(id, removeFile, error);
};

exports.hasRecordings = function() {
  return !!Object.keys(get()).length;
};

exports.getListSortedByTime = function() {
  var recordings = Object.values(get()).sortByKey('timestamp').reverse();
  recordings.forEach(function(recording) {
    recording.display_date = formatTimestamp(recording.timestamp);
  });
  return recordings;
};

