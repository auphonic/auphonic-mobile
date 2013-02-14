var cordova = window.cordova;

exports.ACTION_SEND = 'android.intent.action.SEND';
exports.ACTION_VIEW= 'android.intent.action.VIEW';
exports.EXTRA_TEXT = 'android.intent.extra.TEXT';
exports.EXTRA_SUBJECT = 'android.intent.extra.SUBJECT';
exports.EXTRA_STREAM = 'android.intent.extra.STREAM';
exports.EXTRA_EMAIL = 'android.intent.extra.EMAIL';

exports.startActivity = function(args, success, fail) {
  return cordova.exec(success, fail, 'WebIntent', 'startActivity', [args]);
};

exports.hasExtra = function(args, success, fail) {
  return cordova.exec(success, fail, 'WebIntent', 'hasExtra', [args]);
};

exports.getURI = function(success, fail) {
  return cordova.exec(success, fail, 'WebIntent', 'getURI', []);
};

exports.getExtra = function(args, success, fail) {
  return cordova.exec(success, fail, 'WebIntent', 'getExtra', [args]);
};

exports.onNewIntent = function(callback) {
  return cordova.exec(callback, function() {}, 'WebIntent', 'onNewIntent', []);
};

exports.sendBroadcast = function(args, success, fail) {
  return cordova.exec(success, fail, 'WebIntent', 'sendBroadcast', [args]);
};
