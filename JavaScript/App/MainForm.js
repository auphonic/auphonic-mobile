var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

var History = require('History');

var API = require('API');
var UI = require('UI');
var View = require('View');

var Notice = require('UI/Notice');
var SwipeAble = require('UI/Actions/SwipeAble');

var Chapter = require('./Chapter');
var ListFiles = require('./ListFiles');
var Metadata = require('./Metadata');
var OutputFiles = require('./OutputFiles');
var Source = require('./Source');

var Auphonic = require('Auphonic');

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
    onSave: function(object) {},
    onUploadSuccess: function(uuid) {}
  },

  initialize: function(options) {
    this.setOptions(options);

    // Force binding to this class
    this.createView = this.bound('createView');
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

  setSaveURL: function(url) {
    this.options.saveURL = url;
    return this;
  },

  getObjectName: function(object) {
    return this.options.getObjectName(object);
  },

  getType: function() {
    return 'main';
  },

  reset: function() {
    this.store.erase();
    this.isRendered = false;
    this.isEditMode = false;
    this.object = null;
    this.presets = null;
    this.uploadFile = null;
  },

  showAction: function() {
    this.object.getView().updateElement('action', null, {
      title: 'Save',
      onClick: this.bound('onActionClick')
    });
  },

  hideAction: function() {
    this.object.getView().updateElement('action');
  },

  updateAction: function(hasValue) {
    if (hasValue && !this.actionIsVisible) {
      this.showAction();
      this.actionIsVisible = true;
    } else if (!hasValue && this.actionIsVisible) {
      this.hideAction();
      this.actionIsVisible = false;
    }
  },

  update: function(data) {
    var object = this.object;
    var store = this.store;

    if (data) store.set('thumbnail', data.thumbnail);

    if (this.isNewProduction) {
      // Set the default output file
      var type = OutputFiles.getType();
      if (!data) data = {};
      if (!data[type] || !data[type].length) data[type] = [Auphonic.DefaultOutputFile];
    }

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
    if (!this.isProduction) return;
    var title = Metadata.getData(this.store)['metadata.title'];
    this.object.unserialize({title: title});
    this.updateAction(!!title);
  },

  updateMetadataTitle: function() {
    if (!this.isProduction) return;
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
    this.isRendered = false;
    var isProduction = this.isProduction = (this.getDisplayType() == 'production');
    var isEditMode = this.isEditMode = !!data;
    var isNewProduction = this.isNewProduction = (isProduction && !isEditMode);
    this.store = store;
    this.presets = presets;

    if (isEditMode) this.uuid = data.uuid;

    // This is a placeholder title created by the mobile app, remove it if possible
    if (isEditMode && isProduction && data.metadata.title == Auphonic.DefaultTitle) {
      data.metadata.title = '';
      isNewProduction = this.isNewProduction = true;
    }

    var service = Source.getObject(store);
    var uiData = {
      algorithm: API.getInfo('algorithms_array'),
      baseURL: this.getBaseURL(),
      name: this.getObjectName(data),
      output_basename: isEditMode && data.output_basename,
      presets: presets && Object.values(presets),
      service: (service ? service.display_type : null),
      input_file: ListFiles.getObject(store),
      isNewProduction: isNewProduction
    };
    uiData[this.getDisplayType()] = true;

    var object = this.object = new View.Object({
      title: this.getObjectName(data) ||  'New ' + this.getDisplayName(),
      content: UI.render('form-new-main', uiData),
      back: (isEditMode ? {title: 'Cancel'} : null),

      onShow: this.bound('onShow'),
      onHide: this.bound('onHide')
    });

    store.eachView(function(view, type) {
      if (view.setup)
        view.setup(store, this.getBaseURL(), object);
    }, this);

    this.update(data);

    this.actionIsVisible = (isEditMode && !!this.getObjectName(data));
    var updateAction = this.bound('updateAction');
    object.addEvent('show:once', function() {
      // This only affects either preset_name or metadata.title
      object.toElement().getElement('[data-required]').addEvent('input', function() {
        updateAction(!!this.get('value'));
      });
    });

    if (this.isEditMode) object.addEvent('show:once', (function() {
      this.updateAlgorithms(data);
    }).bind(this));

    if (isNewProduction) object.addEvent('show:once', (function() {
      var select = object.toElement().getElement(this.options.presetChooserSelector);
      if (select) select.addEvent('change', this.bound('onPresetSelect'));
    }).bind(this));

    store.addEvent('upload', this.bound('onUpload'));

    View.getMain().push(this.getDisplayType(), object);
    this.isRendered = true;
  },

  upload: function(file) {
    return API.upload(this.getSaveURL() + '/upload', file, 'image').on({
      success: this.bound('onUploadSuccess')
    });
  },

  onShow: function() {
    this.updateTitle();

    this.actionIsVisible = false;
    this.updateAction(!!this.object.toElement().getElement('[data-required]').get('value'));
  },

  onHide: function(direction) {
    if (direction == 'left') this.reset();
    else this.updateMetadataTitle();
  },

  onPresetSelect: function() {
    // Preserve input source
    var source = Source.getData(this.store);
    var files = ListFiles.getData(this.store);
    this.store.erase();
    if (source) Source.setData(this.store, source[Source.getType()]);
    if (files) ListFiles.setFile(this.store, files[ListFiles.getType()]);

    var select = this.object.toElement().getElement(this.options.presetChooserSelector);
    var preset = this.presets[select.get('value')];
    this.store.set('preset', preset ? preset.uuid : null);
    // Worst case this is null and it removes all input
    this.update(preset);
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

    // Use the selected preset (if any) so the cover photo gets preserved
    // but only if reset_cover_image is not set
    if (!data.reset_cover_image) data.preset_cover_image = store.get('preset');

    // Use Title from productions
    if (data.title && data.title !== '') data['metadata.title'] = data.title;
    delete data.title;

    View.getMain().showIndicator();

    API.call(this.getSaveURL(), 'post', JSON.stringify(Object.expand(data))).on({
      success: this.bound('onSave')
    });
  },

  onSave: function(response) {
    var baseURL = this.getBaseURL();
    var stack = View.getMain().getStack();
    var baseObject = stack.getByURL(baseURL);
    if (baseObject) baseObject.invalidate();
    if (this.isEditMode) {
      var object = stack.getByURL(baseURL + response.data.uuid);
      if (object) object.invalidate();
    }

    this.object.addEvent('hide:once', function() {
      View.getMain().getStack().prune();
    });

    // If the production is new and a cover photo is selected we need to upload it now.
    if (this.uploadFile) {
      if (!this.isEditMode) {
        this.setSaveURL((this.getBaseURL() + '{uuid}').substitute(response.data));
        this.uuid = response.data.uuid;
      }

      this.upload(this.uploadFile);
      this.uploadFile = null;
    }

    this.options.onSave.call(this, response.data);
  },

  onUpload: function(file) {
    // Don't reset the cover photo to the selected preset
    this.store.set('preset', null);

    if (this.isEditMode) {
      this.upload(file);
      return;
    }

    // defer until after save
    this.uploadFile = file;
  },

  onUploadSuccess: function(response) {
    new Notice('The Cover Photo was successfully uploaded.');
    this.options.onUploadSuccess.call(this, [this.uuid]);
  }

});
