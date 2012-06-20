var views = {};
var View = module.exports = {

  set: function(name, view) {
    views[name] = view;
    return this;
  },

  get: function(name) {
    return views[name];
  },

  setMain: function(view) {
    return this.set('Main', view);
  },

  getMain: function() {
    return this.get('Main');
  }

};

View.Controller = require('./Controller');
View.Object = require('./Object');
View.Stack = require('./Stack');
