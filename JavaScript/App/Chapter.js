var Core = require('Core');
var Element = Core.Element;

var API = require('API');
var UI = require('UI');
var View = require('View');

var SwipeAble = require('UI/Actions/SwipeAble');

var createUIElement = function(baseURL, store, content, id) {
  if (!id) id = String.uniqueID();

  var element = Element.from(UI.render('ui-removable-chapter-list-item',
    Object.append({
      label: 'Remove',
      href: baseURL.substitute({id: id})
    }, content)
  )).set('data-chapter-id', id).store('value', content);

  UI.update(element);

  // Store for editing
  var chapters = store.get('chapters', {});
  chapters[id] = content;

  var instance = element.getInstanceOf(SwipeAble);
  if (instance) instance.addEvent('click', function() {
    delete chapters[id];
  });

  return element;
};

var createUIElements = function(baseURL, store, list) {
  if (!list) return null;

  return list.sortByKey('start').map(function(chapter) {
    return createUIElement(baseURL + 'new/chapter/{id}', store, chapter);
  });
};

var add = function(baseURL, store, container, chapter, id) {
  var previous = id ? container.getElement('[data-chapter-id=' + id + ']') : null;
  var element = createUIElement(baseURL + 'new/chapter/{id}', store, chapter, id);

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
};

var parseFromContainer = function(container) {
  return container.getChildren().retrieve('value').clean();
};

var showAction = function(object, id) {
  object.fireEvent('chapters-createAction', [id]);
};

var hideAction = function() {
  View.getMain().updateElement('action', {}, null);
};

var getContainer = function(element) {
  return document.id(element).getElement('ul.chapter_marks');
};

exports.getType = function() {
  return 'chapters';
};

exports.getData = function(dataSource, element) {
  return {
    chapters: parseFromContainer(getContainer(element))
  };
};

exports.setData = function(store, list, baseURL, object, immediate) {
  store.set('chapters', {});

  var elements = createUIElements(baseURL, store, list);
  var fn = function() {
    var container = getContainer(object);
    container.getElements('[data-chapter-id]').dispose();
    container.adopt(elements);
  };

  if (immediate) fn();
  else object.addEvent('show:once', fn);
};

exports.setup = function(store, baseURL, object) {
  object.addEvent('chapters-createAction', function(id) {
    View.getMain().updateElement('action', {}, {
      title: id ? 'Done' : 'Add',
      back: true,
      onClick: function() {
        add(baseURL, store, getContainer(object), View.getMain().getCurrentView().serialize(), id);
      }
    });
  });
};

exports.createView = function(store, editId) {
  var chapterData = store.get('chapters', {});
  var id = (editId && chapterData[editId]) ? editId : null;

  var mainObject = View.getMain().getCurrentView();
  var object = new View.Object({
    title: id ? 'Edit Chapter' : 'Add Chapter',
    content: UI.render('form-new-chapter'),
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      this.unserialize(store.get('chapters'));
    }
  });
  View.getMain().push(object);

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
      showAction(mainObject, id);
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
    showAction(store, id);
  }
};
