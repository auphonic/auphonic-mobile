(function() {

this.UI.Title = new Class({

  Extends: UI.Element,

  template: 'ui-title',

  transition: function(previous, options) {
    // Immediate replace if the titles are the same
    if (previous.toElement().get('text') == this.toElement().get('text'))
      options = Object.append({}, options, {
        immediate: true
      });

    return this.parent(previous, options);
  }

});

})();
