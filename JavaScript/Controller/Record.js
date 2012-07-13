var API = require('API');

var Controller = require('./');

Controller.define('/record', function() {
  var error = function() {
    console.log('error');
  };

  var success = function(files) {
    var file = files[0];

    var data = {metadata: {title: 'New Production'}};

    var object = {uuid: 'pxCA2te9Xbf6Emk95sLpN4'};
    var onSuccess = function(response) {
      API.upload('production/{uuid}/upload'.substitute(response.data), file);
    };

    onSuccess.call(null, {data: object});
    return;

    API.call('productions', 'post', JSON.stringify(data)).on({
      success: onSuccess
    });
  };

  navigator.device.capture.captureAudio(success, error, {limit: 1});
});
