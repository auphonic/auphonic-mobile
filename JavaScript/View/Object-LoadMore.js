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
    if (!options) options = {};

    var scroll = this.bound('onScroll');
    (options.plugins || (options.plugins = [])).push(function(element) {
      return new ScrollLoader(element, {onScroll: function() {
        scroll(this);
      }});
    });

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
    if (this.getView().getCurrentObject() != this) return;

    var container = this.getItemContainerElement();

    // No container likely means a null state where we don't need to load new content anyway
    if (!container) {
      this.finished = true;
      return;
    }

    var options = Object.clone(this.loadOptions);
    options.offset += options.limit;
    this.getSpinner().spin(container.getParent());
    this.getLoadMoreFunction()(options, this.bound('onLoadMore'));

    this.loader = loader;
    loader.detach();
  },

  onLoadMore: function(response) {
    this.loader.attach();
    this.getSpinner().stop();

    if (this.getView().getCurrentObject() != this) return;

    this.loadOptions.offset += this.loadOptions.limit;

    var element = this.getItemContainerElement();
    if (!response.data || !response.data.length) {
      this.finished = true;
      this.fireEvent('loadFinished');
      return;
    }

    this.getAddItemsFunction()(response.data);

    element.adopt(
      response.data.map(function(item) {
        return Element.from(UI.render(this.getTemplateId(), item));
      }, this)
    );

    UI.update();
  },

  getItemContainerElement: function() {
    return this.toElement().getElement(this.getItemContainer());
  },

  getSpinner: function() {
    return this.spinner || (this.spinner = new Spinner(this.getView().getOption('smallIndicatorOptions')));
  }

});
