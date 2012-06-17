var Core = require('Core');
var typeOf = Core.typeOf;

Object.extend({

  flatten: function(object) {
    if (typeOf(object) != 'object') return object;

    for (var key in object) {
      if (typeOf(object[key]) != 'object') continue;

      var subset = Object.flatten(object[key]);
      delete object[key];
      for (var k in subset)
        object[key + '.' + k] = Object.flatten(subset[k]);
    }

    return object;
  },

  expand: function(object) {
    if (typeOf(object) != 'object') return object;

    for (var key in object) {
      var parts = key.split('.');
      if (parts.length == 1) continue;

      var subset = object;
      for (var i = 0; i < parts.length; i++) {
        if (i == parts.length - 1) {
          subset[parts[i]] = object[key];
          continue;
        }

        subset =  (!subset[parts[i]]) ? (subset[parts[i]] = {}) : subset[parts[i]];
      }
      delete object[key];
    }

    return object;
  }

});
