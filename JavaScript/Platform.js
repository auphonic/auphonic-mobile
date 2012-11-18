var get = exports.get = function() {
  return window.__PLATFORM;
};

exports.isIOS = function() {
  return get() == 'ios';
};

exports.isAndroid = function() {
  return get() == 'android';
};
