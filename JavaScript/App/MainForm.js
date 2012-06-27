var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

var History = require('History');

var API = require('API');
var UI = require('UI');
var View = require('View');

var SwipeAble = require('UI/Actions/SwipeAble');

var Chapter = require('./Chapter');
var Format = require('./Format');
var Metadata = require('./Metadata');
var Service = require('./Service');
var ListFiles = require('./ListFiles');

module.exports = new Class({

  Implements: [Options],

  options: {
    displayName: '',
    displayType: '',
    baseURL: null,
    saveURL: null,
    getObjectName: function(object) {
      return '';
    },
    onSave: function(object) {}
  },

  initialize: function(options) {
    this.setOptions(options);

    // Force binding to this class
    this.createView = this.createView.bind(this);
  },

  getDisplayName: function() {
    return this.options.displayName;
  },

  getDisplayType: function() {
    return this.options.displayType;
  },

  getBaseURL: function() {
    return this.options.baseURL.replace(/\/$/, '') + '/';
  },

  getSaveURL: function() {
    return this.options.saveURL;
  },

  getObjectName: function(object) {
    return this.options.getObjectName(object);
  },

  getType: function() {
    return 'main';
  },

  onSave: function(object) {
    this.options.onSave(object);
  },

  createView: function(dataStore, dataObject) {
    var baseURL = this.getBaseURL();
    var saveURL = this.getSaveURL();
    var displayName = this.getDisplayName();
    var displayType = this.getDisplayType();
    var onSave = this.onSave.bind(this);

    var formatElements = null;
    var chapterElements = null;

    var click;

    if (dataObject) {
      var outgoings = {};
      if (dataObject.outgoings) dataObject.outgoings.each(function(outgoing) {
        outgoings['outgoings.' + outgoing.uuid] = true;
      });

      dataStore
        .set('metadata', Object.flatten({metadata: dataObject.metadata}))
        .set('outgoings', outgoings);

      if (dataObject.formats) formatElements = dataObject.formats.map(function(format) {
        return Format.createUIElement(baseURL + 'new/format/{id}', dataStore, format);
      });

      if (dataObject.chapters) {
        dataObject.chapters.sort(function(a, b) {
          if (a.start == b.start) return 0;
          return a.start > b.start ? 1 : -1;
        });
        chapterElements = dataObject.chapters.map(function(chapter) {
          return Chapter.createUIElement(baseURL + 'new/chapter/{id}', dataStore, chapter);
        });
      }
    }

    var service = dataStore.get('serviceObject');
    var uiData = {
      service: (service ? service.display_type : null),
      audiofile: ListFiles.getData(dataStore).audiofile
    };
    uiData[displayType] = true;

    var object;
    View.getMain().push(object = new View.Object({
      title: this.getObjectName(dataObject) ||  'New ' + displayName,
      content: UI.render('form-main-new', Object.append({
        algorithm: Object.values(Object.map(API.getInfo('algorithms'), function(content, algorithm) {
          return Object.append({key: algorithm}, content, {
            value: (dataObject ? dataObject.algorithms[algorithm] : content.default_value)
          });
        })),
        baseURL: baseURL,
        name: this.getObjectName(dataObject),
        output_basename: dataObject && dataObject.output_basename
      }, uiData)),
      back: (dataObject ? {title: 'Cancel'} : null),
      action: {
        title: 'Save',
        onClick: function(event) {
          event.preventDefault();

          var element = object.toElement();
          var data = object.serialize();

          // Always reset formats/outgoings/chapters
          data.reset_data = true;

          dataStore.eachView(function(view, type) {
            if (view.getData)
              Object.append(data, view.getData(dataStore, element));
          });

          // Use Title from productions
          if (data.title && data.title !== '') data['metadata.title'] = data.title;
          delete data.title;

          View.getMain().showIndicator();

          API.call(saveURL, 'post', JSON.stringify(Object.expand(data))).on({
            success: function(response) {
              var stack = View.getMain().getStack();
              var baseObject = stack.getByURL(baseURL);
              stack.invalidate(baseObject);

              if (dataObject) stack.invalidate(baseURL + response.data.uuid);

              // Current object should get removed after sliding it out
              object.addEvent('hide:once', function() {
                this.getStack().remove(this);
                if (baseObject)
                  this.getStack().getCurrent().setBack(baseObject.getBackTemplate());
              });

              onSave(response.data);
            }
          });
        }
      },

      onShow: function() {
        var parent = object.toElement();

        // Title is used twice in productions
        var title = Metadata.getData(dataStore)['metadata.title'];
        object.unserialize({title: title});

        var countElement = parent.getElement('.servicesCount');
        if (countElement) {
          var count = Service.getData(dataStore).outgoings.length;
          countElement.set('text', count ? count + ' selected' : '');
        }

        var indicatorElement = parent.getElement('.output_format_required');
        var container = parent.getElement('ul.output_formats');
        if (formatElements) {
          container.adopt(formatElements);
          formatElements = null;
        } else {
          Format.add(dataStore, container, baseURL);
        }

        if (indicatorElement) {
          if (!click) click = function() {
            Format.updateRequiredIndicator(dataStore, indicatorElement);
          };

          Format.updateRequiredIndicator(dataStore, indicatorElement);
          container.getChildren().getInstanceOf(SwipeAble).clean().each(function(instance) {
            instance.addEvent('click', click);
          });
        }

        container = parent.getElement('ul.chapter_marks');
        if (chapterElements) {
          container.adopt(chapterElements);
          chapterElements = null;
        } else {
          Chapter.add(dataStore, container, baseURL);
        }
      },

      onHide: function(direction) {
        // Use metadata.title in both forms in productions.
        var data = object.serialize();
        if (data.title && data.title !== '') Metadata.getData(dataStore)['metadata.title'] = data.title;

        if (direction == 'left') dataStore.erase();
      }
    }));
  }
});
