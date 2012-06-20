var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

var History = require('History');

var API = require('API');
var Controller = require('./');
var View = require('View');
var UI = require('UI');

var Data = require('App/Data');
var Format = require('App/Format');
var Metadata = require('App/Metadata');
var Service = require('App/Service');

var Form = require('App/Form');
var form;

var presets = null;
var list = null;

var createForm = function(options) {
  return new Form({
    use: [
      new Form.Main(Object.append({
        displayName: 'Preset',
        displayType: 'preset',
        baseURL: 'preset/',
        saveURL: 'presets',
        getObjectName: function(object) {
          return object && object.preset_name;
        },
        onSave: function(object) {
          API.invalidate('presets');
          presets[object.uuid] = object;
          History.push('preset/' + object.uuid);
        }
      }, options)),
      Metadata,
      Service,
      Format
    ]
  });
};

Controller.define('/preset', function() {

  View.getMain().showIndicator({stack: 'preset'});

  list = [];
  presets = {};

  API.call('presets').on({

    success: function(response) {
      list = response.data;

      presets = {};
      list.each(function(preset) {
        presets[preset.uuid] = preset;
      });

      View.getMain().push('preset', new View.Object({
        title: 'Presets',
        content: UI.render('preset', {preset: list}),
        action: {
          title: 'New',
          url: '/preset/new'
        }
      }));
    }

  });

});

Controller.define('/preset/{uuid}', function(req) {

  var preset = Data.prepare(presets[req.uuid]);
  preset.preset = true;
  preset.baseURL = 'preset';

  View.getMain().push('preset', new View.Object({
    title: preset.preset_name,
    content: UI.render('data-detail', preset),
    action: {
      title: 'Edit',
      url: '/preset/edit/' + preset.uuid
    }
  }));

});

Controller.define('/preset/{uuid}/summary', function(req) {

  var preset = presets[req.uuid];
  View.getMain().push('preset', new View.Object({
    title: preset.preset_name,
    content: UI.render('preset-detail-summary', preset)
  }));

});

Controller.define('/preset/new', {priority: 1, isGreedy: true}, function(req) {
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

Controller.define('/preset/new/format/:id:', function(req) {
  form.show('format', req.id);
});

Controller.define('/preset/new/outgoings', function() {
  form.show('outgoings');
});
