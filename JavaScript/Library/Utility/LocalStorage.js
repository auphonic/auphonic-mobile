var storage = window.localStorage;

var erase = function(key){
  storage.removeItem(key);
  return this;
}.overloadGetter();

module.exports = {

  set: function(key, value){
    storage.setItem(key, JSON.stringify(value));
    return this;
  }.overloadSetter(),

  get: function(key){
    return JSON.parse(storage.getItem(key));
  }.overloadGetter(),

  push: function(key, value) {
    var list = this.get(key) || [];
    list.push(value);
    return this.set(key, list);
  },

  erase: function(){
    erase.apply(this, arguments);
    return this;
  },

  clear: function() {
    localStorage.clear();
  }

};
