Element.implement({

  show: function() {
    return this.removeClass('hidden');
  },

  hide: function() {
    return this.addClass('hidden');
  }

});
