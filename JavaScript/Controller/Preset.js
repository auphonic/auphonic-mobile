var History = require('History');

var API = require('API');
var Controller = require('./');
var View = require('View');
var renderTemplate = require('UI/renderTemplate');

var CoverPhoto = require('App/CoverPhoto');
var Data = require('App/Data');
var MainForm = require('App/MainForm');
var Metadata = require('App/Metadata');
var OutgoingService = require('App/OutgoingService');
var OutputFiles = require('App/OutputFiles');

var Form = require('App/Form');

var form;
var presets = {};

var createForm = function(options) {
  return new Form({
    use: [
      new MainForm(Object.append({
        displayName: 'Preset',
        pluralDisplayName: 'Presets',
        displayType: 'preset',
        baseURL: '/preset/',
        saveURL: 'presets',
        getObjectName: function(object) {
          return object && object.preset_name;
        },
        onSave: function(object) {
          presets[object.uuid] = object;
          History.push('/preset/' + object.uuid);
        },
        onUploadSuccess: function(object) {
          View.getMain().getCurrentObject().fireEvent('refresh', [object]);
        }
      }, options)),
      Metadata,
      OutgoingService,
      OutputFiles,
      CoverPhoto
    ]
  });
};

var addPlaceholder = function() {
  var stack = View.getMain().getStack();
  if (stack.getLength() > 1 || stack.getByURL('/preset')) return;

  View.getMain().push('preset', new View.Object({
    url: '/preset',
    title: 'Presets'
  }).invalidate());
};

var showAll = function() {
  presets = {};

  var options = {
    offset: 0,
    limit: 10
  };

  var load = function(options, onSuccess) {
    API.call('presets', 'get', options).on({success: onSuccess});
  };

  var add = function(data) {
    data.each(function(item) {
      presets[item.uuid] = item;
    });
  };

  View.getMain().showIndicator();

  load(options, function(response) {
    add(response.data);
    var object = new View.Object.LoadMore({
      title: 'Presets',
      content: renderTemplate('presets', {preset: response.data}),
      action: {
        title: 'New',
        url: '/preset/new'
      },
      type: response.data.length && 'white',
      loadMoreFunction: load,
      loadMoreOptions: options,
      loadedItems: response.data.length,
      addItemsFunction: add,
      onLoadFinished: function() {
        this.getItemContainerElement().removeClass('load-more');
      },
      itemContainer: '.preset_container',
      templateId: 'preset',
      onInvalidate: function() {
        API.invalidate('presets');
      }
    });

    View.getMain().push('preset', object);
    var getElements = function() {
      return object.toElement().getElements('ul.main-list >');
    };

    getElements().addEvent('remove', function(uuid) {
      if (options.offset > 0) options.offset--;
      delete presets[uuid];
      object.invalidate();
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

var showOne = function(req, options) {
  Data.prepare(presets[req.uuid], 'preset', function(preset) {
    addPlaceholder();

    var object = new View.Object({
      title: preset.preset_name,
      content: renderTemplate('detail', preset),
      action: {
        title: 'Edit',
        url: '/preset/edit/' + preset.uuid
      },

      onRefresh: function(data) {
        if (data.uuid == preset.uuid && object == View.getMain().getCurrentObject()) {
          presets[data.uuid] = data;
          showOne(data, {refresh: true});
        }
      }

    });

    if (options && options.refresh) View.getMain().replace(object);
    else View.getMain().push('preset', object);
  });
};

Controller.define('/preset', showAll);

Controller.define('/preset/{uuid}', function(req) {
  showOne(req);
});

Controller.define('/preset/{uuid}/summary', function(req) {
  var preset = presets[req.uuid];
  View.getMain().push('preset', new View.Object({
    title: preset.preset_name,
    content: renderTemplate('detail-summary', preset)
  }));
});

Controller.define('/preset/new', {priority: 1, isGreedy: true}, function() {
  addPlaceholder();
  form = createForm();
  form.show('main');
});

Controller.define('/preset/edit/{uuid}', {priority: 1, isGreedy: true}, function(req) {
  var preset = presets[req.uuid];
  form = createForm(preset ? {saveURL: 'preset/' + preset.uuid} : null);
  form.show('main', preset);
});

Controller.define('/preset/new/metadata', function() {
  form.show('metadata');
});

Controller.define('/preset/new/output_file/:id:', function(req) {
  form.show('output_files', req.id);
});

Controller.define('/preset/new/outgoing_services', function() {
  form.show('outgoing_services');
});
