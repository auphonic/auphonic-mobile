var History = require('History');

var API = require('API');
var Controller = require('./');
var View = require('View');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');
var Notice = require('UI/Notice');

var AudioRecorder = require('UI/AudioRecorder');
var CordovaAudioRecorder = require('Capture/CordovaAudioRecorder');
var CordovaVideoRecorder = require('Capture/CordovaVideoRecorder');

var Chapter = require('App/Chapter');
var CoverPhoto = require('App/CoverPhoto');
var Data = require('App/Data');
var Form = require('App/Form');
var ListFiles = require('App/ListFiles');
var Location = require('App/Location');
var MainForm = require('App/MainForm');
var Metadata = require('App/Metadata');
var MultiInputFiles = require('App/MultiInputFiles');
var OutgoingService = require('App/OutgoingService');
var OutputFiles = require('App/OutputFiles');
var ProductionStatus = require('App/ProductionStatus');
var Source = require('App/Source');

var CurrentUpload = require('Store/CurrentUpload');
var Recording = require('Store/Recording');
var User = require('Store/User');
var WebIntent = require('Cordova/WebIntent');

var Auphonic = require('Auphonic');
var Platform = require('Platform');

var form;
var productions = {};
var currentEditUUID = null;
var serializedData = null;

var createForm = function(options) {
  return new Form({
    use: [
      new MainForm(Object.append({
        displayName: 'Production',
        pluralDisplayName: 'Productions',
        displayType: 'production',
        baseURL: '/production/',
        saveURL: 'productions',
        getObjectName: function(object) {
          return (object ? ((object.metadata && object.metadata.title) || 'Untitled') : null);
        },
        onSave: function(object) {
          productions[object.uuid] = object;
          History.push('/production/' + object.uuid);
        },
        onUploadSuccess: function(object) {
          View.getMain().getCurrentObject().fireEvent('refresh', [object]);
        }
      }, options)),
      Chapter,
      Metadata,
      MultiInputFiles,
      Source,
      OutgoingService,
      ListFiles,
      OutputFiles,
      CoverPhoto,
      Location
    ]
  });
};

var resetEditUUID = function() {
  currentEditUUID = null;
  serializedData = null;
};

var addPlaceholder = function() {
  var stack = View.getMain().getStack();
  if (stack && stack.getName() == 'production' && (stack.getLength() > 1 || stack.getByURL('/production')))
    return;

  var object = new View.Object({
    url: '/production',
    title: 'Productions',
    backOptions: {
      className: 'small'
    }
  }).invalidate();

  View.getMain().pushOn('production', object);

  // Subsequent invalidations should invalidate the cache
  object.addEvent('invalidate', function() {
    API.invalidate('productions');
  });
};

var showAll = function() {
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

  View.getMain().showIndicator();

  load(options, function(response) {
    add(response.data);

    var object = new View.Object.LoadMore({
      title: 'Productions',
      content: renderTemplate('productions', {production: response.data}),
      action: {
        title: 'New',
        className: 'new',
        url: '/production/source'
      },
      backOptions: {
        className: 'small'
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
    });

    View.getMain().pushOn('production', object);

    var getElements = function() {
      return object.toElement().getElements('ul.main-list >');
    };

    getElements().addEvent('remove', function(uuid) {
      if (options.offset > 0) options.offset--;
      delete productions[uuid];
      if (getElements().length == 1) {
        // If the last item is being deleted, refresh now
        object.invalidate();
        showAll();
      } else {
        // otherwise invalidate onHide
        object.addEvent('hide', function() {
          object.invalidate();
        });
      }
    });
  });
};

var statusOptions = {
  url: 'production/{uuid}',
  onUpdate: function(production) {
    if (production) productions[production.uuid] = production;
  },
  onFinish: function(production) {
    if (production.status == Auphonic.ErrorStatus)
      new Notice('There was an error with your production. Please ensure that the file format is supported and correctly encoded.');

    productions[production.uuid] = production;
    View.getMain().getStack().notifyAll('refresh', [production]);
  }
};

var showOne = function(req, options) {
  Data.prepare(productions[req.uuid], 'production', function(production) {
    addPlaceholder();

    var productionStatus;
    var object = new View.Object({
      title: production.metadata.title || 'Untitled',
      content: renderTemplate('detail', production),
      action: {
        title: 'Edit',
        className: 'edit',
        url: '/production/edit/{uuid}'.substitute(production)
      },

      onShow: function() {
        resetEditUUID();

        var production = productions[req.uuid];
        // Production is being processed
        if (!production.change_allowed) {
          var processing = object.toElement().getElement('.processing');
          if (productionStatus) productionStatus.stop();
          productionStatus = new ProductionStatus(processing, statusOptions);
          productionStatus.check(production);
        }
      },

      onHide: function() {
        if (productionStatus) productionStatus.stop();
        productionStatus = null;
      },

      onRefresh: function(data) {
        // If the production is currently being viewed, refresh.
        if (data.uuid == production.uuid && object == View.getMain().getCurrentObject()) {
          productions[data.uuid] = data;
          showOne(data, {refresh: true});
        }
      },

      onStartProduction: function(element) {
        element.hide();
        var processing = element.getNext('div.processing').show();
        processing.getNext('a.stopProduction').show();

        if (productionStatus) productionStatus.stop();
        productionStatus = new ProductionStatus(processing, statusOptions);

        var url = element.get('data-api-url');
        if (url) API.call(url, element.get('data-method'), 'null').on({
          success: productionStatus.bound('update')
        });
      },

      onUploadProgress: function(data) {
        if (data.uuid != production.uuid) return;

        var element = object.toElement();
        var uploading = element.getElement('.uploading > span');
        if (uploading) uploading.set('text', 'Uploading ' + data.percentage + ' %');

        var progressBar = element.getElement('.uploading .progress-bar');
        if (progressBar) progressBar.show().setStyle('width', data.percentage + '%');
      }
    });

    if (options && options.refresh) View.getMain().replace(object);
    else View.getMain().pushOn('production', object);
  });
};

// Start a production and update the status
var startProduction = function(event) {
  event.preventDefault();
  View.getMain().getCurrentObject().fireEvent('startProduction', [this]);
};

var stopProduction = function(event) {
  event.preventDefault();

  this.hide();
  var uuid = this.get('data-id');
  var url = this.get('data-api-url');
  if (url) API.call(url, this.get('data-method'), 'null');
  // The view will be automatically refreshed through the ProductionStatus instance once the
  // production has been stopped.
};

var cancelUpload = function(event) {
  event.preventDefault();

  var uuid = this.get('data-id');
  var upload = CurrentUpload.remove(uuid);
  if (!upload) return;

  upload.transfer.cancel();
  showOne(productions[uuid], {refresh: true});
};

UI.register({

  'div.detailView a.startProduction': function(elements) {
    elements.addEvent('click', startProduction);
  },

  'div.detailView a.stopProduction': function(elements) {
    elements.addEvent('click', stopProduction);
  },

  'div.detailView a.cancelUpload': function(elements) {
    elements.addEvent('click', cancelUpload);
  }

});

Controller.define('/production', showAll);

Controller.define('/production/{uuid}', function(req) {
  var production = productions[req.uuid];
  if (production) {
    showOne(production);
    return;
  }

  View.getMain().showIndicator();
  API.call('production/{uuid}'.substitute(req)).on({
    success: function(response) {
      productions[response.data.uuid] = response.data;
      showOne(response.data);
    }
  });
});

Controller.define('/production/{uuid}/summary', function(req) {
  var production = productions[req.uuid];

  View.getMain().pushOn('production', new View.Object({
    title: production.metadata.title,
    content: renderTemplate('detail-summary', production),
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

  var show = function() {
    var data = Object.clone(production);
    // Update data from previous editing
    if (reuse) Object.append(data, serializedData);
    else form = createForm(data ? {saveURL: 'production/{uuid}'.substitute(data)} : null);
    serializedData = null;

    if (data.service) Source.setData(form, data.service);

    // Check if we are currently uploading
    var currentUpload = CurrentUpload.get(data.uuid);
    var isNew = currentUpload && !reuse;
    if (currentUpload) {
      data.input_file = currentUpload.file.name;
      // Remove an eventual service uuid.
      delete data.service;
      Source.resetData(form);
    }

    ListFiles.setFile(form, data.input_file);

    getPresets(function(presets) {
      form.show('main', data, presets, isNew);
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

  View.getMain().showIndicator();

  // Maybe we haven't loaded productions yet
  API.call('production/{uuid}'.substitute(req)).on({
    success: function(response) {
      // We are not bothering with the list of productions
      edit(response.data);
    }
  });
});

Controller.define('/production/new', {priority: 1, isGreedy: true}, function() {
  addPlaceholder();
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

  form = createForm(form && currentEditUUID ? {saveURL: 'production/{uuid}'.substitute({uuid: currentEditUUID})} : null);
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
    View.getMain().showIndicator();

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
  form.show('metadata', {
    withLocation: true
  });
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
var upload = function(recording, isRecording) {
  if (arguments.length == 1) isRecording = true;
  API.invalidate('productions');

  View.getMain().showIndicator();

  var onCreateSuccess = function(response) {
    var uuid = response.data.uuid;
    if (isRecording) Recording.addProduction(recording.id, uuid);

    var transfer = API.upload('production/{uuid}/upload'.substitute(response.data), recording, 'input_file').on({

      success: function(uploadResponse) {
        new Notice([
          new Element('span.bold', {text: recording.display_name}),
          new Element('span', {text: ' was successfully uploaded and attached to your production.'})
        ]);
        CurrentUpload.remove(uuid);
        View.getMain().getStack().notifyAll('refresh', [uploadResponse.data]);
      },

      error: function() {
        var element;
        if (isRecording) element = new Element('span', {text: '. You can find your recording in the "Recordings" tab and you can try uploading it again later.'});
        else element = new Element('span', {text: '. Please try again later.'});

        new Notice([
          new Element('span', {text: 'There was an error uploading '}),
          new Element('span.bold', {text: recording.display_name}),
          element
        ]);

        CurrentUpload.remove(uuid);

        View.getMain().getStack().notifyAll('uploadProgress', [{
          uuid: uuid,
          hasError: true
        }]);
      },

      progress: function(event) {
        // Bound this between 0 and 100 just to make sure to never have a crazy percentage here :)
        var percentage = Math.max(0, Math.min(100, Math.round(event.loaded / event.total * 100)));

        View.getMain().getStack().notifyAll('uploadProgress', [{
          uuid: uuid,
          percentage: percentage
        }]);
      }

    });

    CurrentUpload.add(uuid, {
      transfer: transfer,
      file: recording
    });

    var url = '/production/edit/{uuid}'.substitute(response.data);
    var object = View.getMain().getStack().getByURL(url);
    if (object) object.invalidate();
    History.push(url);
  };

  // Either create a new production or overwrite the chapters
  var url = 'productions';
  if (currentEditUUID) url = 'production/{uuid}'.substitute({uuid: currentEditUUID});

  var output_files = [Auphonic.DefaultOutputFile];
  if (recording.media_type == 'video') output_files.push(Auphonic.DefaultVideoOutputFile);

  // Try to create a meaningfull file basename
  var basename = recording.display_name.replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-_]/g, '');
  var data = {
    metadata: {title: recording.display_name},
    output_basename: basename,
    output_files: output_files,
    algorithms: {denoise: true},
    chapters: recording.chapters
  };

  API.call('productions', 'post', JSON.stringify(data)).on({
    success: onCreateSuccess
  });
};

var showRecording = function(file, isSilent) {
  var recording = Recording.add(file);

  // Invalidate recordings view if we are in the recordings tab.
  var object = View.getMain().getStack().getByURL('/recording');
  if (object) object.invalidate();

  if (!isSilent) History.push('/recording/{id}'.substitute(recording));

  API.log({
    type: 'recording',
    name: file.name,
    size: file.size,
    duration: file.duration,
    media_type: file.media_type,
    chapter_count: file.chapters && file.chapters.length,
    silent: isSilent
  });
};

var error = function(event) {
  API.log({
    type: 'recording-error',
    event: event
  });
};

Controller.define('/production/recording/upload/{id}', function(req) {
  addPlaceholder();

  var recording = Recording.findById(req.id);
  if (recording) upload(recording);
});

// Android only
if (Platform.isAndroid()) {
  var onReceiveFile = function(file) {
    if (!file) return;

    addPlaceholder();
    (function() {
      var name = file.substr(file.lastIndexOf('/') + 1);
      upload({
        name: name,
        display_name: name.substr(0, name.lastIndexOf('.')),
        fullPath: file
      }, false);
    }).delay(1);
  };

  // Check if there is an intent and upload the file.
  if (window.cordova && window.cordova.exec) window.addEvent('appStart', function() {
    WebIntent.getURI(onReceiveFile);
  });

  var noticeShownOnce = false;
  Controller.define('/production/recording/file-upload', function() {
    var camera = navigator.camera;
    camera.getPicture(onReceiveFile, function() {
      if (!noticeShownOnce) new Notice('If you haven\'t found what you were looking for, please consider installing a file manager from the Google Play Store.', {type: 'error'});
      noticeShownOnce = true;
      UI.unhighlight(UI.getHighlightedElement());
    }, {
      quality: 100,
      destinationType: camera.DestinationType.FILE_URI,
      sourceType: camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: camera.MediaType.ALLMEDIA
    });
  });
}

Controller.define('/production/recording/new-video', function() {
  new CordovaVideoRecorder({
      generateFileName: function() {
        return Auphonic.DefaultVideoFileName.substitute({
          user: User.getId(),
          uuid: Recording.generateRecordingId()
        });
      }
    }).addEvents({
    success: showRecording,
    error: error,
    cancel: function() {
      UI.unhighlight(UI.getHighlightedElement());
    }
  }).start();
});

Controller.define('/production/recording/new-audio', function() {
  var recorder;
  var object = new View.Object({
    title: 'Audio Recording',
    backTitle: 'Recorder',
    content: renderTemplate('audio-recorder')
  });

  View.getMain().push(object);
  recorder = new AudioRecorder(CordovaAudioRecorder, object, {
    generateFileName: function() {
      return Auphonic.DefaultFileName.substitute({
        user: User.getId(),
        uuid: Recording.generateRecordingId()
      });
    },
    onPause: function() {
      View.getMain().updateElement('back', {fade: true}, object.getBackTemplate());
      View.getMain().updateElement('action', {}, {
        title: 'Done',
        className: 'done',
        onClick: recorder.bound('stop')
      });
    },
    onStart: function() {
      View.getMain().updateElement('action');
      View.getMain().updateElement('back', {fade: true});
    },
    onError: error,
    onSuccess: showRecording
  });
});

Controller.define('/', {isGreedy: false}, function() {
  resetEditUUID();
});

Controller.define('/recording', {isGreedy: true}, function() {
  resetEditUUID();
});
