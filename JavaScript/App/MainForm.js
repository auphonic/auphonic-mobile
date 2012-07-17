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
    presetChooserSelector: '.preset-chooser',
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

  update: function(data) {
    var object = this.object;
    var store = this.store;

    store.eachView(function(view, type) {
      if (view.setData)
        view.setData(store, data && data[type], this.getBaseURL(), object, this.isRendered);
    }, this);

    if (this.isRendered) {
      this.updateTitle();
      this.updateAlgorithms(data);
    }
  },

  // Title is used twice in productions
  updateTitle: function() {
    this.object.unserialize({title: Metadata.getData(this.store)['metadata.title']});
  },

  updateMetadataTitle: function() {
    // Use metadata.title in both forms in productions.
    var data = this.object.serialize();
    if (data.title && data.title !== '') Metadata.getData(this.store)['metadata.title'] = data.title;
  },

  updateAlgorithms: function(data) {
    // Use default values
    if (!data) data = {algorithms: Object.map(API.getInfo('algorithms'), function(algorithm) {
      return algorithm.default_value;
    })};

    this.object.unserialize(Object.flatten({algorithms: data.algorithms}));
  },

  createView: function(store, data, presets) {
    var isProduction = (this.getDisplayType() == 'production');
    var isEditMode = this.isEditMode = !!data;
    var isNewProduction = (isProduction && !isEditMode);
    this.store = store;
    this.presets = presets;

    // This is a placeholder title created by the mobile app, remove it if possible
    if (isEditMode && isProduction && data.metadata.title == 'Mobile App: New Production') {
      data.metadata.title = '';
      isNewProduction = true;
    }

    var service = Source.getObject(store);
    var algorithms = Object.values(Object.map(API.getInfo('algorithms'), function(content, algorithm) {
      return Object.append({key: algorithm}, content);
    }));

    var uiData = {
      algorithm: algorithms,
      baseURL: this.getBaseURL(),
      name: this.getObjectName(data),
      output_basename: isEditMode && data.output_basename,
      presets: presets && Object.values(presets),
      service: (service ? service.display_type : null),
      input_file: ListFiles.getData(store).input_file,
      isNewProduction: isNewProduction
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

      onShow: this.bound('onShow'),
      onHide: this.bound('onHide')
    });

    store.eachView(function(view, type) {
      if (view.setup)
        view.setup(store, this.getBaseURL(), object);
    }, this);

    this.update(data);

    if (this.isEditMode) object.addEvent('show:once', (function() {
      this.updateAlgorithms(data);
    }).bind(this));

    if (isNewProduction) object.addEvent('show:once', (function() {
      var select = object.toElement().getElement(this.options.presetChooserSelector);
      if (select) select.addEvent('change', this.bound('onPresetSelect'));
    }).bind(this));

    View.getMain().push(this.getDisplayType(), object);

    this.isRendered = true;
  },

  onShow: function() {
    this.updateTitle();
  },

  onHide: function(direction) {
    if (direction == 'left') this.store.erase();
    else this.updateMetadataTitle();
  },

  onPresetSelect: function() {
    this.store.erase();

    var select = this.object.toElement().getElement(this.options.presetChooserSelector);
    // Worst case this is null and it deletes all input
    this.update(this.presets[select.get('value')]);
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
