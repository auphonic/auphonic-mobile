var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

var History = require('History');

var API = require('API');
var UI = require('UI');
var View = require('View');

var SwipeAble = require('UI/Actions/SwipeAble');

var Chapter = require('./Chapter');
var Metadata = require('./Metadata');
var OutputFiles = require('./OutputFiles');
var Service = require('./Service');
var Source = require('./Source');
var ListFiles = require('./ListFiles');

module.exports = new Class({

  Implements: [Options, Class.Binds],

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

  createView: function(store, data, presets) {
    var isEditMode = this.isEditMode = !!data;
    this.store = store;

    var service = Source.getObject(store);
    var algorithms = Object.values(Object.map(API.getInfo('algorithms'), function(content, algorithm) {
      return Object.append({key: algorithm}, content, {
        value: (isEditMode ? data.algorithms[algorithm] : content.default_value)
      });
    }));

    var uiData = {
      algorithm: algorithms,
      baseURL: this.getBaseURL(),
      name: this.getObjectName(data),
      output_basename: isEditMode && data.output_basename,
      presets: presets,
      service: (service ? service.display_type : null),
      audiofile: ListFiles.getData(store).audiofile
    };
    uiData[this.getDisplayType()] = true;

    var object = this.object = new View.Object({
      title: this.getObjectName(data) ||  'New ' + this.getDisplayName(),
      content: UI.render('form-main-new', uiData),
      back: (isEditMode ? {title: 'Cancel'} : null),
      action: {
        title: 'Save',
        onClick: this.bound('onActionClick')
      },

      onShow: function() {
        // Title is used twice in productions
        object.unserialize({title: Metadata.getData(store)['metadata.title']});

        Service.updateCounter(store, object);
      },

      onHide: function(direction) {
        // Use metadata.title in both forms in productions.
        var data = object.serialize();
        if (data.title && data.title !== '') Metadata.getData(store)['metadata.title'] = data.title;

        if (direction == 'left') store.erase();
      }
    });

    if (isEditMode) store.eachView(function(view, type) {
      if (view.setData)
        view.setData(store, data[type], this.getBaseURL(), object);
    }, this);

    View.getMain().push(object);
  },

  onActionClick: function(event) {
    event.preventDefault();

    var object = this.object;
    var store = this.store;
    var element = object.toElement();
    var data = object.serialize();

    // Always reset output_files/outgoing_services/chapters
    data.reset_data = true;

    store.eachView(function(view, type) {
      if (view.getData) Object.append(data, view.getData(store, element));
    });

    // Use Title from productions
    if (data.title && data.title !== '') data['metadata.title'] = data.title;
    delete data.title;

    View.getMain().showIndicator();

    API.call(this.getSaveURL(), 'post', JSON.stringify(Object.expand(data))).on({
      success: this.bound('onSaveSuccess')
    });
  },

  onSave: function(object) {
    this.options.onSave(object);
  },

  onSaveSuccess: function(response) {
    var baseURL = this.getBaseURL();
    var object = this.object;

    var stack = View.getMain().getStack();
    var baseObject = stack.getByURL(baseURL);
    stack.invalidate(baseObject);

    if (this.isEditMode) stack.invalidate(baseURL + response.data.uuid);

    // Current object should get removed after sliding it out
    object.addEvent('hide:once', function() {
      this.getStack().remove(this);
      if (baseObject)
        this.getStack().getCurrent().setBack(baseObject.getBackTemplate());
    });

    this.onSave(response.data);
  }

});
