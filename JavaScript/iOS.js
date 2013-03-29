var Recording = require('Store/Recording');

// This is called on iOS devices when the application starts.
// It analyzes the recording paths and updates them accordingly in
// case the app was updated.
exports.fixRecordingPaths = function() {
  // Check if we are in a Cordova Context
  if (!window.LocalFileSystem) return;

  var error = function() {};
  var findAppId = /applications\/.*?\/documents/i;

  window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    var path = fileSystem.root.fullPath;
    var appId = path.match(findAppId)[0];
    var recordings = Recording.findAll();
    for (var id in recordings) {
      var recording = recordings[id];
      if (!new RegExp('^' + path.escapeRegExp()).test(recording.fullPath)) {
        recording.fullPath = recording.fullPath.replace(findAppId, appId);
        Recording.update(recording);
      }
    }
  }, error);
};
