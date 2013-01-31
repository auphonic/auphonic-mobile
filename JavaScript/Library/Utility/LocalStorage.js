var storage = window.localStorage;

module.exports = {

  set: function(key, value) {
    storage.setItem(key, JSON.stringify(value));
    return this;
  },

  get: function(key) {
    return Function.attempt(function() {
      return JSON.parse(storage.getItem(key));
    });
  },

  erase: function(key) {
    storage.removeItem(key);
    return this;
  }

};
