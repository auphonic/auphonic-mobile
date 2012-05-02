(function() {

Controller.define('/record', function() {
  var media;

  var success = function(files) {
    media = new Media(files[0].fullPath, function() {}, error);
    media.play();
  };

  var error = function() {
    console.log('error');
  };

  navigator.device.capture.captureAudio(success, error, {limit: 1});
});

})();
