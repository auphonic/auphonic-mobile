var Core = require('Core');
var Class = Core.Class;

var UIElement = require('./Element');

var maxBackWidth = 80;
var maxTitleWidth = 120;
var superTitleWidth = 160;

module.exports = new Class({

  Extends: UIElement,

  template: 'ui-title',

  transition: function(previous, options) {
    // Immediate replace if the titles are the same
    if (previous.toElement().get('text') == this.toElement().get('text'))
      options = Object.append({}, options, {
        immediate: true
      });

    this.previousBack = this.getView().getBack();
    this.getView().addEvent('change:once', this.bound('adjustPosition'));

    return this.parent(previous, options);
  },

  setTitle: function(title) {
    this.toElement().getElement('span').set('text', title);
    this.previousBack = null;
    this.adjustPosition();
  },

  adjustPosition: function() {
    var element = this.toElement();
    var back = this.getView().getBack();
    var backWidth = (back != this.previousBack) ? back.getTextSize().width : 0;
    var width = (element.getElement('span').getClientRects()[0] || ({width: 0})).width;
    var hasBigBackButton = false;

    // Reset
    element.removeClass('wide-left')
      .removeClass('wide-right')
      .setStyle('left', '')
      .setStyle('right', '');

    if (backWidth > maxBackWidth) {
      element.addClass('wide-left');
      hasBigBackButton = true;
      width += backWidth - maxBackWidth;
    }

    if (width > maxTitleWidth) element.addClass('wide-right');

    if (!hasBigBackButton) {
      element.setStyle('left', backWidth + 30);
      if (width < superTitleWidth) element.setStyle('right', backWidth + 30);
    }
  }

});
