// TODO transform all access into objects!

var LocalStorage = require('Utility/LocalStorage');

exports.push = function(recording) {
  var recordings = LocalStorage.get('recordings');
  recordings.push(recording);
};

exports.findByName = function(name) {
  var recordings = LocalStorage.get('recordings');

  for (var i = 0; i < recordings.length; i++) {
    if (name == recordings[i].name)
      return recordings[i];
  }

  return null;
};

exports.findAll = function() {
  var recordings = LocalStorage.get('recordings');
  var object = {};
  if (recordings) recordings.each(function(recording) {
    object[recording.name] = recording;
  });

  return object;
};

exports.count = function() {
  var recordings = LocalStorage.get('recordings');
  return (recordings && recordings.length) || 0;
};
