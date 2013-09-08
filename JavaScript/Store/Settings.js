var LocalStorage = require('Utility/LocalStorage');
var User = require('Store/User');

var key = function(key) {
  return User.getId() + '-setting' + (key ? '-' + key : '');
};

exports.get = function(setting) {
  return LocalStorage.get(key(setting));
};

exports.set = function(setting, value) {
  LocalStorage.set(key(setting), value);
};
