require('Core');

Array.implement('sortByKey', function(key) {
  this.sort(function(a, b) {
    if (a[key] == b[key]) return 0;
    return a[key] > b[key] ? 1 : -1;
  });
  return this;
});

var toString = Object.prototype.toString;
Array.isArray = function(object) {
  return toString.call(object) == '[object Array]';
};
