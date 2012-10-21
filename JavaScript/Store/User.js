var Base64 = require('Utility/Base64');
var LocalStorage = require('Utility/LocalStorage');

var set = exports.set = function(user) {
  LocalStorage.set('user', user);
};

var get = exports.get = function() {
  return LocalStorage.get('user');
};

var getAttribute = function(attribute) {
  var user = get();
  return user && user[attribute];
};

exports.isLoggedIn = function() {
  return !!get();
};

exports.reset = function() {
  set(null);
};

exports.getSafeUsername = function() {
  return Base64.encode(getAttribute('name') || '');
};

exports.getToken = function(prefix) {
  var token = getAttribute('token');
  return (token ? prefix + token : '');
};
