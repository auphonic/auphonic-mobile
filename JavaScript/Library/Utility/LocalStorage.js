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
    return Function.attempt(function() {
      return JSON.parse(storage.getItem(key));
    });
  }.overloadGetter(),

  erase: function(){
    erase.apply(this, arguments);
    return this;
  }

};
