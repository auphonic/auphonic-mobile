var Core = require('Core');
var Class = Core.Class;
var Element = Core.Element;

var Spinner = require('Spinner');
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

    var scroll = this.bound('onScroll');
    options.uses.push(Class.Instantiate(ScrollLoader, {onScroll: function() {
      scroll(this);
    }}));

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

  onScroll: function(loader) {
    if (this.finished) return;

    this.loadOptions.offset += this.loadOptions.limit;
    this.getSpinner().spin(this.getItemContainerElement().getParent());
    this.getLoadMoreFunction()(this.loadOptions, this.bound('onLoadMore'));

    this.loader = loader;
    loader.detach();
  },

  onLoadMore: function(response) {
    this.loader.attach();
    this.getSpinner().stop();

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
  },

  getSpinner: function() {
    return this.spinner || (this.spinner = new Spinner({
      lines: 9,
      length: 4,
      width: 3,
      radius: 4,
      trail: 30,
      color: '#000',
      className: 'spinner-inline-bottom'
    }));
  }

});
