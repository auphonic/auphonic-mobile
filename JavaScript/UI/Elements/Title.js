var Core = require('Core');
var Class = Core.Class;

var UIElement = require('./Element');

module.exports = new Class({

  Extends: UIElement,

  template: 'ui-title',

  transition: function(previous, options) {
    // Immediate replace if the titles are the same
    if (previous.toElement().get('text') == this.toElement().get('text'))
      options = Object.append({}, options, {
        immediate: true
      });

    return this.parent(previous, options);
  },

  setTitle: function(title) {
    this.toElement().set('text', title);
  }

});
