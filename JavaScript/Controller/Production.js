var History = require('History');

var API = require('API');
var Controller = require('./');
var View = require('View');
var UI = require('UI');
var Notice = require('UI/Notice');

var LocalStorage = require('Utility/LocalStorage');

var AudioRecorder = require('UI/AudioRecorder');
var CordovaAudioRecorder = require('Capture/CordovaAudioRecorder');
var CordovaVideoRecorder = require('Capture/CordovaVideoRecorder');

var Chapter = require('App/Chapter');
var Data = require('App/Data');
var CoverPhoto = require('App/CoverPhoto');
var ListFiles = require('App/ListFiles');
var MainForm = require('App/MainForm');
var Metadata = require('App/Metadata');
var OutputFiles = require('App/OutputFiles');
var OutgoingService = require('App/OutgoingService');
var Source = require('App/Source');
var Form = require('App/Form');
var ProductionStatus = require('App/ProductionStatus');

var Auphonic = require('Auphonic');

var form;
var productions = {};
var currentEditUUID = null;
var serializedData = null;

var createForm = function(options) {
  return new Form({
    use: [
      new MainForm(Object.append({
        displayName: 'Production',
        displayType: 'production',
        baseURL: '/production/',
        saveURL: 'productions',
        getObjectName: function(object) {
          return object && object.metadata && object.metadata.title;
        },
        onSave: function(object) {
          productions[object.uuid] = object;
          History.push('/production/' + object.uuid);
        }
      }, options)),
      Chapter,
      Metadata,
      Source,
      OutgoingService,
      ListFiles,
      OutputFiles,
      CoverPhoto
    ]
  });
};

var resetEditUUID = function() {
  currentEditUUID = null;
  serializedData = null;
};

var addPlaceholder = function() {
  var stack = View.getMain().getStack();
  if (stack.getLength() > 1 || stack.getByURL('/production')) return;

  View.getMain().push('production', new View.Object({
    url: '/production',
    title: 'Productions'
  }).invalidate());
};

Controller.define('/production', function() {
  productions = {};

  var options = {
    offset: 0,
    limit: 20
  };

  var load = function(options, onSuccess) {
    API.call('productions', 'get', options).on({success: onSuccess});
  };

  var add = function(data) {
    data.each(function(item) {
      productions[item.uuid] = item;
    });
  };

  View.getMain().showIndicator({stack: 'production'});

  load(options, function(response) {
    add(response.data);
    View.getMain().push('production', new View.Object.LoadMore({
      title: 'Productions',
      content: UI.render('productions', {production: response.data}),
      action: {
        title: 'New',
        url: '/production/source'
      },
      type: response.data.length && 'white',
      loadMoreFunction: load,
      loadMoreOptions: options,
      loadedItems: response.data.length,
      addItemsFunction: add,
      onLoadFinished: function() {
        this.getItemContainerElement().removeClass('load-more');
      },
      itemContainer: '.production_container',
      templateId: 'production',
      onShow: resetEditUUID,
      onInvalidate: function() {
        API.invalidate('productions');
      }
    }));
  });
});

var statusOptions = {
  url: 'production/{uuid}',
  onFinish: function(production) {
    productions[production.uuid] = production;
    showOne(production, {refresh: true});
  }
};

var showOne = function(req, options) {
  Data.prepare(productions[req.uuid], 'production', function(production) {
    addPlaceholder();

    var object = new View.Object({
      title: production.metadata.title,
      content: UI.render('detail', production),
      action: {
        title: 'Edit',
        url: '/production/edit/' + production.uuid
      },
      onShow: function() {
        resetEditUUID();
        var production = productions[req.uuid];
        // Production is being processed
        if (!production.change_allowed) {
          var processing = object.toElement().getElement('.processing');
          var productionStatus = new ProductionStatus(processing, statusOptions);

          productionStatus.check(production);
          object.addEvent('hide', productionStatus.bound('stop'));
        }
      }
    });

    if (options && options.refresh) View.getMain().replace(object);
    else View.getMain().push('production', object);
  });
};

// Start a production and update the status
var startProduction = function(event) {
  event.preventDefault();

  this.hide();
  var processing = this.getNext('div.processing').show();
  var productionStatus = new ProductionStatus(processing, statusOptions);

  View.getMain().getCurrentObject().addEvent('hide', productionStatus.bound('stop'));

  var url = this.get('data-api-url');
  if (url) API.call(url, this.get('data-method'), 'null').on({
    success: productionStatus.bound('update')
  });
};

UI.register('a.startProduction', function(elements) {
  elements.addEvent('click', startProduction);
});

Controller.define('/production/{uuid}', function(req) {
  showOne(req);
});

Controller.define('/production/{uuid}/summary', function(req) {
  var production = productions[req.uuid];

  View.getMain().push('production', new View.Object({
    title: production.metadata.title,
    content: UI.render('data-detail-summary', production),
    onShow: function() {
      currentEditUUID = production.uuid;
    }
  }));
});

var getPresets = function(callback) {
  API.call('presets').on({
    success: function(response) {
      var presets = {};
      response.data.each(function(preset) {
        presets[preset.uuid] = preset;
      });
      callback(presets);
    }
  });
};

var edit = function(production) {
  // If we have changed the source, we'll reuse the data in the form
  var reuse = form && (currentEditUUID == production.uuid);

  currentEditUUID = production.uuid;
  View.getMain().showIndicator({stack: 'production'});

  var show = function() {
    var data = Object.clone(production);
    // Update data from previous editing
    if (reuse) Object.append(data, serializedData);
    else form = createForm(data ? {saveURL: 'production/' + data.uuid} : null);
    serializedData = null;

    if (data.service) Source.setData(form, data.service);

    // Check if we are currently uploading
    var currentUpload = LocalStorage.get('currentUpload');
    if (currentUpload && currentUpload.uuid == data.uuid)
      data.input_file = currentUpload.input_file;

    ListFiles.setFile(form, data.input_file);

    getPresets(function(presets) {
      form.show('main', data, presets);
    });
  };

  if (production.service) Source.fetch(show);
  else show();
};

Controller.define('/production/edit/{uuid}', function(req) {
  var production = productions[req.uuid];
  if (production) {
    edit(production);
    return;
  }

  View.getMain().showIndicator({stack: 'production'});

  // Maybe we haven't loaded productions yet
  API.call('production/{uuid}'.substitute(req)).on({
    success: function(response) {
      // We are not bothering with the list of productions
      edit(response.data);
    }
  });
});

Controller.define('/production/new', {priority: 1, isGreedy: true}, function() {
  resetEditUUID();
  getPresets(function(presets) {
    form.show('main', null, presets);
  });
});

Controller.define('/production/source', {priority: 1, isGreedy: true}, function() {
  // Store all current information
  if (form && currentEditUUID) {
    var object = View.getMain().getCurrentObject();
    serializedData = form.serialize(object);
    Object.append(serializedData, Object.expand(object.serialize()));
    serializedData.metadata.title = serializedData.title;
    if (serializedData.reset_cover_image) serializedData['cover-photo'] = {reset_cover_image: true};

    delete serializedData.service;
    delete serializedData.input_file;
  }

  addPlaceholder();
  form = createForm(form && currentEditUUID ? {saveURL: 'production/' + currentEditUUID} : null);
  form.show('service');
});

Controller.define('/production/source/{service}', function(req) {
  var service = Source.setData(form, req.service);
  if (!service) return;

  form.show('input_file');
});

Controller.define('/production/selectFile/{index}', function(req) {
  ListFiles.setData(form, req.index);
  if (currentEditUUID) {
    View.getMain().showIndicator({stack: 'production'});

    API.call('production/{uuid}'.substitute({uuid: currentEditUUID}), 'post', JSON.stringify(Object.append({},
      Source.getData(form),
      ListFiles.getData(form)
    ))).on({
      success: function(response) {
        productions[response.data.uuid] = response.data;
        var url = '/production/edit/{uuid}'.substitute({uuid: currentEditUUID});
        var object = View.getMain().getStack().getByURL(url);
        if (object) object.invalidate();
        History.push(url);
      }
    });
  } else {
    History.push('/production/new');
  }
});

Controller.define('/production/new/metadata', function() {
  form.show('metadata');
});

Controller.define('/production/new/output_file/:id:', function(req) {
  form.show('output_files', req.id);
});

Controller.define('/production/new/chapter/:id:', function(req) {
  form.show('chapters', req.id);
});

Controller.define('/production/new/outgoing_services', function() {
  form.show('outgoing_services');
});

// Recording
var recorder;
var upload = function(file) {
  LocalStorage.push('recordings', file);

  var onCreateSuccess = function(response) {
    LocalStorage.set('currentUpload', {
      uuid: response.data.uuid,
      input_file: file.name
    });

    API.upload('production/{uuid}/upload'.substitute(response.data), file, 'input_file').on({
      success: function() {
        new Notice('The recording <span class="bold">"' + file.name + '"</span> was successfully uploaded and attached to your production.');
        LocalStorage.erase('currentUpload');
      }
    });

    var url = '/production/edit/{uuid}'.substitute(response.data);
    var object = View.getMain().getStack().getByURL(url);
    if (object) object.invalidate();
    History.push(url);
  };

  if (currentEditUUID) {
    onCreateSuccess({data: {uuid: currentEditUUID}});
    return;
  }

  var data = {metadata: {title: Auphonic.DefaultTitle}};
  API.call('productions', 'post', JSON.stringify(data)).on({
    success: onCreateSuccess
  });
};

Controller.define('/production/recording/new-video', function() {
  new CordovaVideoRecorder().addEvents({
    success: upload
  }).start();
});

Controller.define('/production/recording/new-audio', function() {
  addPlaceholder();

  View.getMain().push('production', new View.Object({
    title: 'Audio Recording',
    content: UI.render('record-audio')
  }));
});

Controller.define('/production/recording/new-audio-start', function() {
  recorder = new AudioRecorder(CordovaAudioRecorder, {
    onSuccess: upload
  }).start();
});

Controller.define('/production/recording/stop', function() {
  recorder.stop();
  recorder = null;
});
