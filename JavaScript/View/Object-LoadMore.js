var Core = require('Core');
var Class = Core.Class;
var Element = Core.Element;

var ScrollLoader = require('Utility/ScrollLoader');

var UI = require('UI');
var ViewObject = require('./Object');

module.exports = new Class({

  Extends: ViewObject,

  Implements: [Class.Binds],

  Properties: {
    itemContainer: null,
    templateId: null,
    loadMoreFunction: null,
    addItemsFunction: null
  },

  initialize: function(options) {
    if (!options.uses) options.uses = [];
    options.uses.push(Class.Instantiate(ScrollLoader, {onScroll: this.bound('onScroll')}));

    this.parent(options);

    this
      .setItemContainer(options.itemContainer)
      .setTemplateId(options.templateId)
      .setLoadMoreFunction(options.loadMoreFunction)
      .setAddItemsFunction(options.addItemsFunction);

    this.loadOptions = options.loadMoreOptions;

    // If we already loaded some items and it is less than the limit, expect that there are no more items
    if (options.loadedItems && options.loadedItems < this.loadOptions.limit)
      this.finished = true;
  },

  onScroll: function() {
    if (this.finished) return;

    this.loadOptions.offset += this.loadOptions.limit;
    this.getLoadMoreFunction()(this.loadOptions, this.bound('onLoadMore'));
  },

  onLoadMore: function(response) {
    if (!response.data || !response.data.length) {
      this.finished = true;
      return;
    }

    this.getAddItemsFunction()(response.data);

    var element = this.getItemContainerElement();
    element.adopt(
      response.data.map(function(item) {
        return Element.from(UI.render(this.getTemplateId(), item));
      }, this)
    );

    UI.update();
  },

  getItemContainerElement: function() {
    return document.getElement(this.getItemContainer());
  }

});
