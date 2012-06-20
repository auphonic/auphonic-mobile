var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

var API = require('API');
var UI = require('UI');
var View = require('View');

var SwipeAble = require('UI/Actions/SwipeAble');

var format = null;
var formatID = null;

exports.createUIElement = function(href, dataStore, content, id) {
  if (!id) id = String.uniqueID();

  var element = Element.from(UI.render('ui-removable-list-item',
    Object.append(createUIData(content), {
      label: 'Remove',
      href: href.substitute({id: id})
    })
  )).set('data-format-id', id).store('value', content);

  UI.update(element);

  // Store for editing
  var formats = dataStore.get('formats', {});
  formats[id] = content;

  var instance = element.getInstanceOf(SwipeAble);
  if (instance) instance.addEvent('click', function() {
    delete formats[id];
  });

  return element;
};

exports.add = function(dataStore, container, baseURL) {
  if (!format) return;

  // Select-Values are Arrays but we only need the first and only value
  format.format = format.format[0];
  format.bitrate = format.bitrate[0];

  var id = formatID;
  var previous = id ? container.getElement('[data-format-id=' + id + ']') : null;
  var element = exports.createUIElement(baseURL + 'new/format/{id}', dataStore, format, id);

  if (previous) element.replaces(previous);
  else element.inject(container);

  format = null;
  formatID = null;
};

var createUIData = exports.createUIData = function(content) {
  var formats = API.getInfo('formats');
  var item = formats[content.format];
  var index = (item.bitrates ? item.bitrates.indexOf('' + content.bitrate) : 0); // Needs to be String
  return {
    title: item.display_name.replace(/\((.+?)\)/, '').trim(), // Remove parenthesis
    detail: item.bitrate_strings[index].replace(/\((.+?)\)/, '').trim(), // Remove parenthesis,
  };
};

var parseFromContainer = function(container) {
  var formats = API.getInfo('formats');
  return container.getChildren().retrieve('value').clean().map(function(format) {
    // Add filename if necessary
    var file = format.filename;
    var endings = formats[format.format].endings;
    var check = function(ending) {
      return file.indexOf('.' + ending) == file.length - 1 - ending.length;
    };
    if (file && !endings.some(check))
      format.filename += '.' + endings[0];

    return format;
  });
};

exports.getType = function() {
  return 'format';
};

exports.getData = function(dataSource, container) {
  return {
    formats: parseFromContainer(container.getElement('ul.output_formats'))
  };
};

exports.createView = function(dataStore, editId) {
  var formatsData = dataStore.get('formats', {});
  var id = (editId && formatsData[editId]) ? editId : null;

  var list = [];
  var formats = API.getInfo('formats');
  Object.each(formats, function(value, key) {
    value = Object.append({}, value);
    value.value = key;
    value.bitrate_format = [];
    value.bitrate_strings.each(function(string, index) {
      var bitrate = (value.bitrates ? value.bitrates[index] : 0);
      value.bitrate_format.push({
        value: bitrate,
        title: string,
        selected: (!bitrate || bitrate == value.default_bitrate)
      });
    });
    list.push(value);
  });

  var object;
  View.getMain().push(object = new View.Object({
    title: id ? 'Edit Format' : 'Add Format',
    content: UI.render('form-new-format', {
      format: list
    }),
    back: {
      title: 'Cancel'
    }
  }));

  var bitrateContainer = object.toElement().getElement('.bitrates').dispose();
  var selects = object.toElement().getElements('select.empty');
  selects.addEvents({

    'change:once': function() {
      View.getMain().updateElement('action', {}, {
        title: id ? 'Done' : 'Add',
        back: true,
        onClick: function() {
          format = View.getMain().getCurrentView().serialize();
          if (id) formatID = id;
        }
      });
    },

    change: function() {
      var data = object.serialize();
      delete data.bitrate;
      delete data.format;

      var option = this.getSelected()[0];
      var value = option.get('value');
      var parent = this.getParent('ul');
      var item = bitrateContainer.getElement('[data-format=' + value + ']').clone();

      parent.getElements('> :not(li:first-child)').dispose();
      parent.adopt(item);

      Elements.from(UI.render('form-new-format-detail')).inject(parent);

      // Restore previous values
      object.unserialize(data);
      UI.update(parent);
    }

  });

  // editing
  if (id) {
    object.unserialize({format: formatsData[id].format});
    selects.fireEvent('focus:once').fireEvent('change');
    object.unserialize(formatsData[id]);
  }
};
