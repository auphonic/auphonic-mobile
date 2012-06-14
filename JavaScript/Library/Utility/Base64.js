exports.encode = function(string) {
  return btoa(window.unescape(encodeURIComponent(string)));
};

exports.decode = function(string) {
  return decodeURIComponent(window.escape(atob(string)));
};
