var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

module.exports = new Class({

  Implements: [Options, Events, Class.Binds],

  options: {
    area: 100,
    container: null

    /*onScroll: fn*/
  },

  initialize: function(element, options){
    this.setOptions(options);

    this.element = document.id(element) || window;
    this.attach();
  },

  attach: function(){
    this.element.addEvent('scroll:pause(250)', this.bound('scroll'));
  },

  detach: function(){
    this.element.removeEvent('scroll:pause(250)', this.bound('scroll'));
  },

  scroll: function(){
    var element = this.element;
    var size = element.offsetHeight;
    var scroll = element.scrollTop;
    var scrollSize = element.scrollHeight;

    if (scroll + size >= scrollSize - this.options.area)
      this.fireEvent('scroll');
  }

});
