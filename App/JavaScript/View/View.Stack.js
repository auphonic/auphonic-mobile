(function(){

View.Stack = new Class({

  Properties: {
    name: null,
    view: null
  },

  initialize: function(view, name){
    this.setView(view).setName(name);

    this.wipe();
  },

  push: function(object){
    // This is also the case when you go back to a tab
    if (this.current && this.current.getURL() == object.getURL())
      return this; // Don't do anything

    object.setStack(this);
    this.current = object;
    this.stack.push(this.current);

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

})();
