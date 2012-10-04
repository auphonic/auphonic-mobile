var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

var History = require('History');

var API = require('API');
var Controller = require('./');
var View = require('View');
var UI = require('UI');

var Data = require('App/Data');
var CoverPhoto = require('App/CoverPhoto');
var MainForm = require('App/MainForm');
var Metadata = require('App/Metadata');
var OutputFiles = require('App/OutputFiles');
var OutgoingService = require('App/OutgoingService');

var Form = require('App/Form');

var form;
var presets = {};

var createForm = function(options) {
  return new Form({
    use: [
      new MainForm(Object.append({
        displayName: 'Preset',
        displayType: 'preset',
        baseURL: '/preset/',
        saveURL: 'presets',
        getObjectName: function(object) {
          return object && object.preset_name;
        },
        onSave: function(object) {
          presets[object.uuid] = object;
          History.push('/preset/' + object.uuid);
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

Controller.define('/preset', function() {
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

  View.getMain().showIndicator({stack: 'preset'});

  load(options, function(response) {
    add(response.data);
    View.getMain().push('preset', new View.Object.LoadMore({
      title: 'Presets',
      content: UI.render('presets', {preset: response.data}),
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
      templateId: 'preset'
    }).addEvent('invalidate', function() {
      API.invalidate('presets');
    }));
  });
});

Controller.define('/preset/{uuid}', function(req) {
  Data.prepare(presets[req.uuid], 'preset', function(preset) {
    addPlaceholder();
    View.getMain().push('preset', new View.Object({
      title: preset.preset_name,
      content: UI.render('detail', preset),
      action: {
        title: 'Edit',
        url: '/preset/edit/' + preset.uuid
      }
    }));
  });
});

Controller.define('/preset/{uuid}/summary', function(req) {
  var preset = presets[req.uuid];
  View.getMain().push('preset', new View.Object({
    title: preset.preset_name,
    content: UI.render('preset-detail-summary', preset)
  }));
});

Controller.define('/preset/new', {priority: 1, isGreedy: true}, function(req) {
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
