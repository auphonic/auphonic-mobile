var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;

var History = require('History');

var API = require('API');
var UI = require('UI');
var View = require('View');

var Notice = require('UI/Notice');
var SwipeAble = require('UI/Actions/SwipeAble');
var Popover = require('UI/Actions/Popover');

var Chapter = require('./Chapter');
var ListFiles = require('./ListFiles');
var Metadata = require('./Metadata');
var OutputFiles = require('./OutputFiles');
var Source = require('./Source');

var CurrentUpload = require('Store/CurrentUpload');

var Auphonic = require('Auphonic');

module.exports = new Class({

  Implements: [Options, Class.Binds],

  options: {
    displayName: '',
    pluralDisplayName: '',
    displayType: '',
    baseURL: null,
    saveURL: null,
    presetChooserSelector: '.preset-chooser',
    getObjectName: function(object) {
      return '';
    },
    onSave: function(object) {},
    onUploadSuccess: function(object) {}
  },

  initialize: function(options) {
    this.setOptions(options);

    // Force binding to this class
    this.createView = this.bound('createView');
  },

  getDisplayName: function() {
    return this.options.displayName;
  },

  getPluralDisplayName: function() {
    return this.options.pluralDisplayName;
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

  update: function(data) {
    var object = this.object;
    var store = this.store;

    if (data) store.set('thumbnail', data.thumbnail);

    if (!this.isEditMode || this.isNewProduction) {
      // Set the default output file
      var type = OutputFiles.getType();
      if (!data) data = {};
      if (!data[type] || !data[type].length) data[type] = [Auphonic.DefaultOutputFile];
    }

    store.eachView(function(view, type) {
      // If a preset gets selected, don't remove chapters
      if (this.isRendered && view.getType() == Chapter.getType()) return;

      if (view.setData)
        view.setData(store, data && data[type], this.getBaseURL(), object, this.isRendered);
    }, this);

    if (this.isRendered) this.updateAlgorithms(data);
  },

  updateAlgorithms: function(data) {
    // Use default values
    if (!data) data = {};
    if (!data.algorithms) data.algorithms = Object.map(API.getInfo('algorithms'), function(algorithm) {
      return algorithm.default_value;
    });

    this.object.unserialize(Object.flatten({algorithms: data.algorithms}));
  },

  createView: function(store, data, presets, isNew) {
    this.isRendered = false;
    var inputFile, inputBasename;
    var isProduction = this.isProduction = (this.getDisplayType() == 'production');
    var isEditMode = this.isEditMode = !!data;
    var isNewProduction = this.isNewProduction = (isProduction && !isEditMode) || isNew;
    var hasPopover = !isNewProduction;
    var hasUpload = false;
    this.store = store;
    this.presets = presets;

    if (isEditMode) {
      this.uuid = data.uuid;
      hasUpload = CurrentUpload.has(this.uuid);
      if (!hasPopover) hasPopover = hasUpload;
    }

    var service = Source.getObject(store);
    inputFile = inputBasename = (ListFiles.getObject(store) || '');
    var index = inputFile.lastIndexOf('.');

    var uiData = {
      algorithm: API.getInfo('algorithms_array'),
      baseURL: this.getBaseURL(),
      name: this.getObjectName(data),
      output_basename: isEditMode && data.output_basename,
      presets: presets && Object.values(presets),
      service: (service ? service.display_type : null),
      input_file: inputFile,
      input_file_basename: (index == -1) ? inputBasename : inputBasename.substring(0, index),
      isNewProduction: isNewProduction,
      hasPopover: hasPopover,
      hasUpload: hasUpload
    };
    uiData[this.getDisplayType()] = true;

    var object = this.object = new View.Object({
      title: this.getObjectName(data) ||  'New ' + this.getDisplayName(),
      content: UI.render('form-new-main', uiData),
      back: (isEditMode ? {title: 'Cancel'} : null),
      backTitle: this.getPluralDisplayName(),
      backOptions: isProduction ? {className: 'small'} : null,
      action: {
        title: 'Save',
        onClick: this.bound('onActionClick')
      },

      onHide: this.bound('onHide'),
      onUploadProgress: this.bound('onUploadProgress'),
      onRefresh: this.bound('onRefresh')
    });

    store.eachView(function(view, type) {
      if (view.setup)
        view.setup(store, this.getBaseURL(), object);
    }, this);

    store.addEvent('upload', this.bound('onUpload'));
    this.update(data);

    object.addEvent('show:once', (function() {
      if (hasUpload) {
        var label = object.toElement().getElement('.input_file_label');
        var popover = label ? label.getInstanceOf(Popover) : null;
        var cancelButton = popover ? popover.getPopover().getElement('.cancelUpload') : null;
        if (cancelButton) cancelButton.addEvent('click', this.bound('cancelUpload'));
      }

      if (isNewProduction) {
        var select = object.toElement().getElement(this.options.presetChooserSelector);
        if (select) select.addEvent('change', this.bound('onPresetSelect'));
      }

      this.updateAlgorithms(data);
    }).bind(this));

    View.getMain().push(this.getDisplayType(), object);
    this.isRendered = true;
  },

  // Cancel a recording upload
  cancelUpload: function(event) {
    event.preventDefault();

    var upload = CurrentUpload.remove(this.uuid);
    if (upload) upload.transfer.cancel();
    this.onCancel();
  },

  upload: function(file) {
    return API.upload(this.getSaveURL() + '/upload', file, 'image').on({
      success: this.bound('onUploadSuccess')
    });
  },

  onHide: function(direction) {
    if (direction == 'left') this.reset();
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

    if (this.getDisplayType() == 'preset' && !data.preset_name)
      data.preset_name = 'Untitled';

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
    this.options.onUploadSuccess.call(this, response.data);
  },

  onCancel: function() {
    var element = this.object.toElement();
    element.getElement('.input_file').dispose();
    element.getElement('.change_source').show();

    ListFiles.setFile(this.store, null);
  },

  onUploadProgress: function(data) {
    if (data.uuid != this.uuid) return;

    if (data.hasError) {
      this.onCancel();
      return;
    }

    var element = this.object.toElement();
    var uploading = element.getElement('.input_file_label .uploading');
    if (uploading) uploading.show().set('text', ' ' + data.percentage + ' %');

    var progressBar = element.getElement('.progress-bar');
    if (progressBar) progressBar.show().setStyle('width', data.percentage + '%');
  },

  // When the upload finishes, onRefresh is being called
  onRefresh: function(data) {
    if (data.uuid != this.uuid) return;

    var element = this.object.toElement();
    var label = element.getElement('.input_file_label');

    var progressBar = element.getElement('.progress-bar');
    if (progressBar) progressBar.hide().setStyle('width', '0%');

    var uploading = label.getElement('.uploading');
    if (uploading) uploading.hide().set('text', '');

    var inputFileName = label.getElement('.input_file_name');
    if (inputFileName) inputFileName.show();

    label.removeClass('info');
    label.getInstanceOf(Popover).detach();

    // We need to prune the stack because Change Source is supposed to transition to the right.
    if (View.getMain().getCurrentObject() == this.object)
      View.getMain().getStack().prune();
  }

});
