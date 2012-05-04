(function() {

var views = {};

this.View = {};

this.Views = {

  set: function(name, view) {
    views[name] = view;
  },

  get: function(name) {
    return views[name];
  }

};

})();
