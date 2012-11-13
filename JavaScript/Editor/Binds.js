exports.mixin = function(object) {
  object.$bound = {};
  object.bound = function(name) {
    return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
  };
};
