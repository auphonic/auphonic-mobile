var cordova = window.cordova;

var fn = function() {};

exports.enable = function() {
  cordova.exec(fn, fn, 'IdleTimer', 'enable', []);
};

exports.disable = function() {
  cordova.exec(fn, fn, 'IdleTimer', 'disable', []);
};
