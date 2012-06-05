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

Element.implement({

  serialize: function() {
    var object = {};

    this.getElements(':input').each(function(el) {
      var type = el.type;
      if (!el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;

      var value = (el.get('tag') == 'select') ? el.getSelected().map(function(opt){
        // IE
        return document.id(opt).get('value');
      }) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? null : el.get('value');

      if (typeof value != 'undefined') object[el.name] = value;
    });

    return object;
  },

  unserialize: function(object) {
    if (!object) return;

    this.getElements(':input').each(function(el) {
      var name = el.name;
      var type = el.type;
      if (!object[name]) return;

      if (type == 'select') {
        var values = Array.from(object[name]);
        el.getElements('option', function(element) {
          if (~values.indexOf(element.get('value')))
            element.set('selected', true);
        });
      } else if (type == 'radio' || type == 'checkbox') {
        el.set('checked', true);
      } else {
        el.set('value', object[name]);
      }
    });
  }

});
