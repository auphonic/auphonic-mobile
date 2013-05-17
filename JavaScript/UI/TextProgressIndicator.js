var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

module.exports = new Class({

  Implements: [Options],

  options: {
    text: 'Processing',
    indicator: '.'
  },

  initialize: function(element, options) {
    this.setOptions(options);

    this.text = this.options.text;
    this.element = document.id(element);
    this.initialText = this.element.get('text');
  },

  start: function() {
    this.stop();
    this.timer = this.updateIndicator.periodical(500, this);

    return this;
  },

  stop: function() {
    this.dots = 0;
    clearInterval(this.timer);

    return this;
  },

  updateText: function(text) {
    this.text = text;

    return this;
  },

  updateIndicator: function() {
    if (this.dots++ == 3) this.dots = 0;
    var string = '';
    for (var i = 0; i < this.dots; i++)
      string += this.options.indicator;

    this.element.set('text', this.text + string);
  },

  reset: function() {
    this.stop();
    this.element.set('text', this.initialText);
    return this;
  }

});
