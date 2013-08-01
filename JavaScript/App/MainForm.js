var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Elements = Core.Elements;

var API = require('API');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');
var View = require('View');

var Notice = require('UI/Notice');
var Popover = require('UI/Actions/Popover');

var attachChooseSourceListeners = require('./attachChooseSourceListeners');
var Chapter = require('./Chapter');
var ListFiles = require('./ListFiles');
var Metadata = require('./Metadata');
var OutputFiles = require('./OutputFiles');
var Source = require('./Source');
var upload = require('./upload');

var CurrentUpload = require('Store/CurrentUpload');
var Recording = require('Store/Recording');

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
    onStart: function(object) {},
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
    this.store = null;
    this.view = null;
    this.isRendered = false;
    this.isEditMode = false;
    this.saveAndStartProduction = false;
    this.startAfterCoverPhotoUpload = false;
    this.object = null;
    this.popover = null;
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
      if (view.setData) view.setData(store, data && data[type], this.getBaseURL(), object, this.isRendered);
    }, this);

    if (this.isRendered) {
      this.updateTitle();
      this.updateAlgorithms(data);
    }
  },

  updateTitle: function() {
    if (!this.isProduction || !this.object) return;
    var title = Metadata.getData(this.store)['metadata.title'] ||  'New ' + this.getDisplayName();
    this.object.setTitle(title);
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
    this.store = store;
    this.view = store.getViewController();
    this.presets = presets;
    if (isEditMode) this.uuid = data.uuid;

    var service = Source.getObject(store);
    inputFile = inputBasename = (ListFiles.getObject(store) || '');
    var index = inputFile.lastIndexOf('.');
    var uiData = Object.append(this.getInputFileUIData(), {
      algorithm: API.getInfo('algorithms_array'),
      name: this.getObjectName(data),
      output_basename: isEditMode && data.output_basename,
      presets: presets && Object.values(presets),
      input_file_basename: (index == -1) ? inputBasename : inputBasename.substring(0, index)
    });

    var object = this.object = new View.Object({
      title: this.getObjectName(data) ||  'New ' + this.getDisplayName(),
      content: renderTemplate('form-main', uiData),
      back: (isEditMode ? {title: 'Cancel'} : null),
      backTitle: this.getPluralDisplayName(),
      backOptions: isProduction ? {className: 'small'} : null,
      action: {
        title: 'Save',
        className: 'done',
        onClick: this.bound('onActionClick')
      },

      onShow: this.bound('onShow'),
      onHide: this.bound('onHide'),
      onUploadProgress: this.bound('onUploadProgress'),
      onRefresh: this.bound('onRefresh')
    });

    store.eachView(function(view) {
      if (view.setup) view.setup(store, this.getBaseURL(), object);
    }, this);

    store.addEvent('upload', this.bound('onUpload'));
    this.update(data);

    object.addEvent('show:once', (function() {
      var element = object.toElement();
      var saveButton = element.getElement('.saveButton');
      if (saveButton) saveButton.addEvent('click', this.bound('onSaveButtonClick'));

      this.attachChooseSourceListeners();

      if (isNewProduction) {
        var select = element.getElement(this.options.presetChooserSelector);
        if (select) select.addEvent('change', this.bound('onPresetSelect'));
      }

      var presetElement = element.getElement('.preset_name');
      if (presetElement) presetElement.addEvent('input', (function() {
        object.setTitle(presetElement.get('value') || (isEditMode ? 'Untitled' : 'New ' + this.getDisplayName()));
      }).bind(this));

      this.updateAlgorithms(data);
    }).bind(this));

    this.view.pushOn(this.getDisplayType(), object);
    this.isRendered = true;
  },

  getInputFileUIData: function() {
    var store = this.store;
    var service = Source.getObject(store);
    var uiData = {
      baseURL: this.getBaseURL(),
      service: (service ? service.display_type : null),
      input_file: (ListFiles.getObject(store) || ''),
      isNewProduction: this.isNewProduction,
      hasUpload: this.isEditMode && CurrentUpload.has(this.uuid)
    };
    uiData[this.getDisplayType()] = true;
    return uiData;
  },

  attachChooseSourceListeners: function() {
    var element = this.object.toElement();
    attachChooseSourceListeners(element, {
      onSelectFile: this.bound('onSelectResourceFile'),
      onSelectRecording: this.bound('onSelectRecording'),
      allowLocalRecordings: true
    });

    var label = element.getElement('.input_file_label');
    var popover = label ? label.getInstanceOf(Popover) : null;
    this.popover = popover;
    if (popover && CurrentUpload.has(this.uuid)) {
      var cancelButton = popover.getPopover().getElement('.cancelUpload');
      if (cancelButton) cancelButton.addEvent('click', this.bound('cancelUpload'));
    }
  },

  refreshInputFileUI: function() {
    var element = this.object.toElement();
    var ul = element.getElement('ul.input-file-container');
    ul.getElements('.input_file, .choose_source').dispose();
    Elements.from(renderTemplate('form-main-input-file', this.getInputFileUIData())).inject(ul, 'top');
    UI.update(element);
    this.attachChooseSourceListeners();
  },

  // Cancel a recording upload
  cancelUpload: function(event) {
    event.preventDefault();

    this.popover.close();
    var upload = CurrentUpload.remove(this.uuid);
    if (upload) upload.transfer.cancel();
    this.onCancel();
  },

  upload: function(file) {
    return API.upload(this.getSaveURL() + '/upload', file, 'image').on({
      success: this.bound('onUploadSuccess')
    });
  },

  startProduction: function() {
    API.call('/production/{uuid}/start'.substitute({uuid: this.uuid}), 'post', 'null').on({
      success: (function(response) {
        this.options.onStart.call(this, response.data);
      }).bind(this)
    });
  },

  onShow: function(direction) {
    if (direction == 'left') this.updateTitle();
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

    store.eachView(function(view) {
      if (view.getData) Object.append(data, view.getData(store, element));
    });

    // Use the selected preset (if any) so the cover photo gets preserved
    // but only if reset_cover_image is not set
    if (!data.reset_cover_image) data.preset_cover_image = store.get('preset');

    // Use Title from productions
    if (data.title && data.title !== '') data['metadata.title'] = data.title;
    delete data.title;

    this.view.showIndicator();

    API.call(this.getSaveURL(), 'post', JSON.stringify(Object.expand(data))).on({
      success: this.bound('onSave')
    });
  },

  onSaveButtonClick: function(event) {
    this.saveAndStartProduction = true;
    this.onActionClick(event);
  },

  onSave: function(response) {
    this.uuid = response.data.uuid;
    var baseURL = this.getBaseURL();
    var view = this.view;
    var stack = view.getStack();
    var baseObject = stack.getByURL(baseURL);
    if (baseObject) baseObject.invalidate();
    if (this.isEditMode) {
      var object = stack.getByURL(baseURL + this.uuid);
      if (object) object.invalidate();
    }

    this.object.addEvent('hide:once', function() {
      view.getStack().prune();
    });

    // If the production is new and a cover photo is selected we need to upload it now.
    var isUploadingCoverPhoto = false;
    if (this.uploadFile) {
      if (!this.isEditMode) this.setSaveURL((this.getBaseURL() + '{uuid}').substitute(response.data));

      this.upload(this.uploadFile);
      this.uploadFile = null;
      isUploadingCoverPhoto = true;
    }

    if (this.saveAndStartProduction) {
      var upload = CurrentUpload.get(this.uuid);
      if (upload) upload.transfer.on({success: this.bound('startProduction')});
      else if (isUploadingCoverPhoto) this.startAfterCoverPhotoUpload = true;
      else this.startProduction.delay(1, this);
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
    if (this.startAfterCoverPhotoUpload) this.startProduction();
  },

  onCancel: function() {
    var element = this.object.toElement();
    element.getElement('.input_file').dispose();
    element.getElement('.choose_source').show();

    Source.resetData(this.store);
    ListFiles.setFile(this.store, null);
  },

  onSelectResourceFile: function(service, file) {
    Source.setData(this.store, service);
    ListFiles.setFile(this.store, file);
    this.refreshInputFileUI();
  },

  onSelectRecording: function(id) {
    var recording = Recording.findById(id);
    if (!recording) return;

    Source.resetData(this.store);
    ListFiles.setFile(this.store, recording.name);

    var refreshInputFileUI = this.bound('refreshInputFileUI');
    var startUpload = function(uuid) {
      var currentUpload = CurrentUpload.remove(uuid);
      if (currentUpload) currentUpload.transfer.cancel();

      return upload(recording, {
        isRecording: true,
        editUUID: uuid,
        redirect: false
      }).addEvent('start', refreshInputFileUI);
    };

    // If the production does not exist yet, create one (this.uuid is empty)
    var events = startUpload(this.uuid);
    if (!this.uuid) events.addEvent('start', (function(response) {
      this.uuid = response.data.uuid;
      this.setSaveURL((this.getBaseURL() + '{uuid}').substitute(response.data));
    }).bind(this));
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
    if (this.view.getCurrentObject() == this.object)
      this.view.getStack().prune();
  }

});
