var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

if (document.createElement('div').classList) Element.implement({

  addClass: function(className) {
    this.classList.add(className);
    return this;
  },

  removeClass: function(className) {
    this.classList.remove(className);
    return this;
  },

  hasClass: function(className) {
    return this.classList.contains(className);
  }

});

Element.implement({

  setStyle: function(property, value) {
    if (typeof value == 'number') value += 'px';
    this.style[property] = value;
    return this;
  },

  getStyle: function(property){
    var defaultView = Element.getDocument(this).defaultView,
      computed = defaultView ? defaultView.getComputedStyle(this, null) : null;
    return (computed) ? computed.getPropertyValue(property.hyphenate()) : null;
  },

  setStyles: function(styles){
    for (var style in styles) this.setStyle(style, styles[style]);
    return this;
  },

  getStyles: function(){
    var result = {};
    Array.map(arguments, function(key){
      result[key] = this.getStyle(key);
    }, this);
    return result;
  },

  getWidth: function() {
    return this.offsetWidth;
  },

  getHeight: function() {
    return this.offsetHeight;
  },

  scrollTo: function(x, y) {
    this.scrollLeft = x;
    this.scrollTop = y;
    return this;
  },

  show: function() {
    return this.removeClass('hidden');
  },

  hide: function() {
    return this.addClass('hidden');
  }

});

Element.from = function(string) {
  return new Element('div', {html: string}).getFirst().dispose();
};

Elements.from = function(string) {
  return new Element('div', {html: string}).getChildren().dispose();
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
      }) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? (type == 'checkbox' ? false : null) : el.get('value');

      if (typeof value != 'undefined') object[el.name] = value;
    });

    return object;
  },

  unserialize: function(object) {
    if (!object) return;

    this.getElements(':input').each(function(el) {
      var name = el.name;
      if (!(name in object)) return;

      var value = object[name];
      var type = el.type;
      if (type == 'select') {
        var values = Array.from(value);
        el.getElements('option', function(element) {
          if (~values.indexOf(element.get('value')))
            element.set('selected', true);
        });
      } else if (type == 'radio' || type == 'checkbox') {
        el.set('checked', !!value);
      } else {
        el.set('value', value || '');
      }
    });
  }

});
