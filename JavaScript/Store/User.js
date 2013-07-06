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

exports.isAuthenticated = function() {
  return !!get();
};

exports.reset = function() {
  var name = getAttribute('name');
  if (name) LocalStorage.set('previousUsername', name);
  set(null);
};

exports.getId = function() {
  return getAttribute('user_id') || '';
};

exports.getPreviousUsername = function() {
  return LocalStorage.get('previousUsername');
};

exports.getToken = function(prefix) {
  var token = getAttribute('token');
  return (token ? prefix + token : '');
};
