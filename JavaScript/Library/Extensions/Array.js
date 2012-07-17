require('Core');

Array.implement('sortByKey', function(key) {
  this.sort(function(a, b) {
    if (a[key] == b[key]) return 0;
    return a[key] > b[key] ? 1 : -1;
  });
  return this;
});
