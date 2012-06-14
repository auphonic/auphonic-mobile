var Controller = require('./');

Controller.define('/record', function() {
  var media;

  var error = function() {
    console.log('error');
  };

  var success = function(files) {
    media = new Media(files[0].fullPath, function() {}, error);
    media.play();
  };

  navigator.device.capture.captureAudio(success, error, {limit: 1});
});
