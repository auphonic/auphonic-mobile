Element.implement({

  show: function() {
    return this.removeClass('hidden');
  },

  hide: function() {
    return this.addClass('hidden');
  }

});

Element.from = function(string) {
  return new Element('div', {html: string}).getFirst();
};

Elements.from = function(string) {
  return new Element('div', {html: string}).getChildren();
};
