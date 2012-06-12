var views = {};
var View = module.exports = {

  set: function(name, view) {
    views[name] = view;
  },

  get: function(name) {
    return views[name];
  }

};

View.Controller = require('./Controller');
View.Object = require('./Object');
View.Stack = require('./Stack');
