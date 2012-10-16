var Base64 = require('Utility/Base64');
var LocalStorage = require('Utility/LocalStorage');

var set = exports.set = function(user) {
  LocalStorage.set('user', user);
};

var get = exports.get = function() {
  return LocalStorage.get('user');
};

exports.isLoggedIn = function() {
  return !!get();
};

exports.reset = function() {
  set(null);
};

exports.getSafeUsername = function() {
  var user = get();
  if (user) return Base64.encode(user.name);
};
