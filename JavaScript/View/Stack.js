var Core = require('Core');
var Class = Core.Class;

module.exports = new Class({

  Properties: {
    name: null,
    view: null
  },

  initialize: function(view, name){
    this.setView(view).setName(name);

    this.wipe();
  },

  push: function(object){
    var stack = this.stack;
    // Check if the URL is already part of the stack and rewind if necessary
    for (var index = 0; index < stack.length; index++) {
      if (stack[index].getURL() == object.getURL()) {
        this.rewind(index, object);
        break;
      }
    }

    // This is also the case when you go back to a tab
    if (this.current && this.current.getURL() == object.getURL())
      return this; // Don't do anything

    object.setStack(this);
    this.current = object;
    stack.push(this.current);

    return this;
  },

  pop: function(){
    var stack = this.stack;
    stack.pop();
    this.current = stack[stack.length - 1];

    return this;
  },

  wipe: function(){
    this.current = null;
    this.stack = [];

    return this;
  },

  // This method erases all but the first and last element in the stack
  prune: function() {
    var stack = this.stack;
    this.stack = [stack[0], stack[stack.length - 1]];
  },

  rewind: function(index, object) {
    this.stack[index] = object;
    this.stack = this.stack.slice(0, index + 1);

    return this;
  },

  getByURL: function(url) {
    url = url.replace(/^\/|\/$/g, '');
    var stack = this.stack;
    for (var index = 0; index < stack.length; index++) {
      if (stack[index].getURL().replace(/^\/|\/$/g, '') == url)
        return stack[index];
    }

    return null;
  },

  hasObject: function(needle) {
    return !!this.getByURL(needle.getURL());
  },

  getLength: function(){
    return this.stack.length;
  },

  getPrevious: function(){
    return this.stack[this.stack.length - 2] || null;
  },

  getCurrent: function(){
    return this.current;
  }

});
