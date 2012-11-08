var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

var API = require('API');
var UI = require('UI');
var View = require('View');

var OutputFiles = require('./OutputFiles');

var SwipeAble = require('UI/Actions/SwipeAble');

var createUIElement = function(href, store, content, id) {
  if (!id) id = String.uniqueID();

  var element = Element.from(UI.render('ui-removable-list-item',
    Object.append(createUIData(content), {
      label: 'Remove',
      href: href.substitute({id: id})
    })
  )).set('data-output-file-id', id).store('value', content);

  UI.update(element);

  // Store for editing
  var outputFiles = store.get('output_files', {});
  outputFiles[id] = content;

  var instance = element.getInstanceOf(SwipeAble);
  if (instance) instance.addEvent('click', function() {
    delete outputFiles[id];
    store.fireEvent('update:' + exports.getType());
  });

  return element;
};

var createUIElements = function(baseURL, store, list) {
  if (!list) return null;

  return list.map(function(chapter) {
    return createUIElement(baseURL + 'new/output_file/{id}', store, chapter);
  });
};

var add = function(baseURL, store, container, outputFile, id) {
  var previous = id ? container.getElement('[data-output-file-id=' + id + ']') : null;
  var element = createUIElement(baseURL + 'new/output_file/{id}', store, outputFile, id);

  if (previous) element.replaces(previous);
  else element.inject(container);

  store.fireEvent('update:' + exports.getType());
};

var createUIData = exports.createUIData = function(content) {
  var outputFiles = API.getInfo('output_files');
  var item = outputFiles[content.format];
  var index = (item.bitrates ? item.bitrates.indexOf('' + content.bitrate) : 0); // Needs to be String
  return Object.append({}, content, {
    title: item.display_name.replace(/\((.+?)\)/, '').trim(), // Remove parenthesis
    detail: item.bitrate_strings ? item.bitrate_strings[index].replace(/\((.+?)\)/, '').trim() : '', // Remove parenthesis,
  });
};

var parseFromContainer = function(container) {
  var outputFiles = API.getInfo('output_files');
  return container.getChildren(':not(.item-removed)').retrieve('value').clean().map(function(outputFile) {
    // Add filename if necessary
    var file = outputFile.filename;
    var endings = outputFiles[outputFile.format].endings;
    var check = function(ending) {
      return file.lastIndexOf('.' + ending) == file.length - 1 - ending.length;
    };
    if (file && endings && !endings.some(check))
      outputFile.filename += '.' + endings[0];

    return outputFile;
  });
};

var showAction = function(object, id) {
  object.fireEvent('output_files-createAction', [id]);
};

var updateIndicator = function(store, element) {
  var outputFiles = store.get('output_files', {});

  if (Object.keys(outputFiles).length) element.addClass('hidden');
  else element.removeClass('hidden');
};

var setupIndicator = function(store, object) {
  var indicator = object.toElement().getElement('.output_files_required');
  if (indicator) {
    var click = store.get('output_files:click', function() {
      updateIndicator(store, indicator);
    });

    updateIndicator(store, indicator);
    getContainer(object).getChildren().getInstanceOf(SwipeAble).clean().each(function(instance) {
      instance.addEvent('click', click);
    });
  }
};

var getContainer = function(element) {
  return document.id(element).getElement('ul.output_files');
};

exports.getType = function() {
  return 'output_files';
};

exports.getData = function(dataSource, element) {
  return {
    output_files: parseFromContainer(getContainer(element))
  };
};

exports.setData = function(store, list, baseURL, object, immediate) {
  store.set('output_files', {});

  var elements = createUIElements(baseURL, store, list);
  var fn = function() {
    var container = getContainer(object);
    container.getElements('[data-output-file-id]').dispose();
    container.adopt(elements);

    setupIndicator(store, object);
  };

  if (immediate) fn();
  else object.addEvent('show:once', fn);
};

exports.setup = function(store, baseURL, object) {
  object.addEvent('show', function() {
    setupIndicator(store, object);
  });

  object.addEvent('output_files-createAction', function(id) {
    View.getMain().updateElement('action', {}, {
      title: id ? 'Done' : 'Add',
      back: true,
      onClick: function() {
        add(baseURL, store, getContainer(object), View.getMain().getCurrentObject().serialize(), id);
      }
    });
  });
};

exports.createView = function(store, editId) {
  var outputFiles = store.get('output_files', {});
  var id = (editId && outputFiles[editId]) ? editId : null;

  var files = {};
  var formats = {
    lossy: {
      display_name: 'Lossy Audio',
      items: []
    },
    lossless: {
      display_name: 'Lossless Audio',
      items: []
    },
    video: {
      display_name: 'Video',
      items: []
    },
    dflt: {
      display_name: 'Other',
      items: []
    }
  };

  Object.each(API.getInfo('output_files'), function(value, key) {
    var type = value.type;
    value = Object.append({}, value);
    value.value = key;
    if (type != 'description' && value.bitrate_strings) {
      value.has_options = true;
      value.bitrate_format = [];
        value.bitrate_strings.each(function(string, index) {
        var bitrate = (value.bitrates ? value.bitrates[index] : 0);
        value.bitrate_format.push({
          value: bitrate,
          title: string,
          selected: (!bitrate || bitrate == value.default_bitrate)
        });
      });
    }
    files[key] = value;
    (formats[type] || formats.dflt).items.push(value);
  });

  Object.each(formats, function(format) {
    format.items.sortByKey('display_name');
  });

  var mainObject = View.getMain().getCurrentObject();
  var object = new View.Object({
    title: id ? 'Edit Format' : 'Add Format',
    content: UI.render('form-new-output-file', {
      formats: Object.values(formats)
    }),
    back: {
      title: 'Cancel'
    }
  });
  View.getMain().push(object);

  var bitrateContainer = object.toElement().getElement('.bitrates').dispose();
  var selects = object.toElement().getElements('select.empty');
  selects.addEvents({

    'change:once': function() {
      showAction(mainObject, id);
    },

    change: function() {
      var data = object.serialize();
      delete data.bitrate;
      delete data.format;

      var option = this.getSelected()[0];
      var value = option.get('value');
      var parent = this.getParent('ul');
      var item = bitrateContainer.getElement('[data-output-file=' + value + ']');

      parent.getElements('> :not(li:first-child)').dispose();
      if (item) parent.adopt(item.clone());

      Elements.from(UI.render('form-new-output-file-detail', {
        has_options: files[value].has_options,
        mono_mixdown: data.mono_mixdown,
        split_on_chapters: data.split_on_chapters
      })).inject(parent);

      // Restore previous values
      object.unserialize(data);
      UI.update(parent);
    }

  });

  // editing
  if (id) {
    object.unserialize({format: outputFiles[id].format});
    selects.fireEvent('focus:once').fireEvent('change');
    object.unserialize(outputFiles[id]);
  }
};
