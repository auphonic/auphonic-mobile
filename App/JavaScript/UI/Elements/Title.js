(function() {

this.UI.Title = new Class({

  selector: 'h1',

  initialize: function(header, element, options) {
    this.header = header;
    this.element = document.id(element);

    this.selector = (options && options.selector) || 'h1';
  },

  toElement: function() {
    return this.element;
  },

  transition: function(previous, options) {
    UI.transition(this.header, previous.toElement(), this.element, options);
    return this;
  },

  create: function(title) {
    return new UI.Title(
      this.header,
      new Element(this.selector).set('text', title).set('title', title),
      this.selector
    );
  }

});

})();
