var Core = require('Core');
var Element = Core.Element;

var API = require('API');
var UI = require('UI');
var View = require('View');

var SwipeAble = require('UI/Actions/SwipeAble');

var chapter = null;
var chapterID = null;

var createUIElement = exports.createUIElement = function(href, dataStore, content, id) {
  if (!id) id = String.uniqueID();

  var element = Element.from(UI.render('ui-removable-chapter-list-item',
    Object.append({
      label: 'Remove',
      href: href.substitute({id: id})
    }, content)
  )).set('data-chapter-id', id).store('value', content);

  UI.update(element);

  // Store for editing
  var chapters = dataStore.get('chapters', {});
  chapters[id] = content;

  var instance = element.getInstanceOf(SwipeAble);
  if (instance) instance.addEvent('click', function() {
    delete chapters[id];
  });

  return element;
};

exports.add = function(dataStore, container, baseURL) {
  if (!chapter) return;

  var id = chapterID;
  var previous = id ? container.getElement('[data-chapter-id=' + id + ']') : null;
  var element = createUIElement(baseURL + 'new/chapter/{id}', dataStore, chapter, id);

  if (previous) previous.dispose();

  var elements = container.getElements('[data-chapter-id]');
  for (var i = 0; i < elements.length; i++) {
    if (chapter.start < elements[i].retrieve('value').start) {
      element.inject(elements[i], 'before');
      break;
    }
  }

  // No elements found or add as last
  if (!element.getParent())
    element.inject(container);

  chapter = null;
  chapterID = null;
};

var parseFromContainer = function(container) {
  return container.getChildren().retrieve('value').clean();
};

exports.getType = function() {
  return 'chapter';
};

exports.getData = function(dataSource, container) {
  return {
    chapters: parseFromContainer(container.getElement('ul.chapter_marks'))
  };
};

var showAction = function(id) {
  View.getMain().updateElement('action', {}, {
    title: id ? 'Done' : 'Add',
    back: true,
    onClick: function() {
      chapter = View.getMain().getCurrentView().serialize();
      if (id) chapterID = id;
    }
  });
};

var hideAction = function() {
  View.getMain().updateElement('action', {}, null);
};

exports.createView = function(dataStore, editId) {
  var chapterData = dataStore.get('chapters', {});
  var id = (editId && chapterData[editId]) ? editId : null;

  var object;
  View.getMain().push(object = new View.Object({
    title: id ? 'Edit Chapter' : 'Add Chapter',
    content: UI.render('form-new-chapter'),
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      this.unserialize(dataStore.get('chapter'));
    }
  }));

  var active = false;
  var inputs = object.toElement().getElements('input[data-required]');
  var matches = function(element) {
    var regex = element.get('data-matches');
    return !regex || (new RegExp(regex)).test(element.get('value'));
  };

  inputs.addEvent('input', function() {
    // Cheap validation
    var hasValues = Array.every(inputs, function(element) {
      var value = element.get('value');
      if (!value || value === '') return false;
      if (!matches(element)) return false;

      return true;
    });

    if (hasValues && !active) {
      active = true;
      showAction(id);
    } else if (!hasValues && active) {
      active = false;
      hideAction();
    }
  });

  object.toElement().getElements('input[data-format-time]').addEvent('blur', function() {
    var value = this.get('value');

    if (!value) return;
    if (!matches(this)) return;

    var parts = value.split(':');
    if (!parts[2]) parts[2] = '0';
    this.set('value', parts.map(function(part, index) {
      if (index == parts.length - 1) {
        var last = part.split('.');
        if (last[1]) return String('00' + last[0]).slice(-2) + '.' + last[1];
      }
      return String('00' + part).slice(-2);
    }).join(':'));
  });

  // editing
  if (id) {
    object.unserialize(chapterData[id]);
    showAction(id);
  }
};
