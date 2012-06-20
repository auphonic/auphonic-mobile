var History = require('History');

var API = require('../API');
var Controller = require('./');
var View = require('../View');
var UI = require('../UI');

var Chapter = require('App/Chapter');
var Data = require('App/Data');
var Format = require('App/Format');
var ListFiles = require('App/ListFiles');
var Metadata = require('App/Metadata');
var Service = require('App/Service');
var Source = require('App/Source');

var Form = require('App/Form');
var form;

var productions = null;
var list = null;

var createForm = function(options) {
  return new Form({
    use: [
      new Form.Main(Object.append({
        displayName: 'Production',
        displayType: 'production',
        baseURL: 'production/',
        saveURL: 'productions',
        getObjectName: function(object) {
          return object && object.metadata && object.metadata.title;
        },
        onSave: function(object) {
          API.invalidate('productions');
          productions[object.uuid] = object;
          History.push('production/' + object.uuid);
        }
      }, options)),
      Chapter,
      Metadata,
      Source,
      Service,
      ListFiles,
      Format
    ]
  });
};

Controller.define('/production', function() {

  View.getMain().showIndicator({stack: 'preset'});

  API.call('productions').on({

    success: function(response) {
      list = response.data;

      productions = {};
      list.each(function(production) {
        productions[production.uuid] = production;
      });

      View.getMain().push('production', new View.Object({
        title: 'Productions',
        content: UI.render('production', {production: list}),
        action: {
          title: 'New',
          url: '/production/source'
        }
      }));
    }

  });

});

var click = function(event) {
  event.preventDefault();

  var url = this.get('data-api-url');
  var method = this.get('data-method');
  if (url && method) API.call(url, method, 'null');

  this.dispose();
};

Controller.define('/production/{uuid}', function(req) {

  var production = Data.prepare(productions[req.uuid]);
  production.production = true;
  production.baseURL = 'production';

  UI.register('a.startProduction', function(elements) {
    elements.addEvent('click', click);
  });

  View.getMain().push('production', new View.Object({
    title: production.metadata.title,
    content: UI.render('data-detail', production),
    action: {
      title: 'Edit',
      url: '/production/edit/' + production.uuid
    }
  }));

});

Controller.define('/production/{uuid}/summary', function(req) {

  var production = productions[req.uuid];
  View.getMain().push('production', new View.Object({
    title: production.metadata.title,
    content: UI.render('data-detail-summary', production)
  }));

});

Controller.define('/production/edit/{uuid}', function(req) {

  var production = productions[req.uuid];
  form = createForm(production ? {saveURL: 'production/' + production.uuid} : null);
  form.show('main', production);

});

Controller.define('/production/source', {priority: 1, isGreedy: true}, function() {
  form = createForm();
  form.show('source');
});

Controller.define('/production/source/{service}', function(req) {
  form.show('listFiles', req.service);
});

Controller.define('/production/selectFile/{index}', function(req) {
  ListFiles.setFile(form, req.index);
  History.push('/production/new');
});

Controller.define('/production/new', {priority: 1, isGreedy: true}, function() {
  form.show('main', null, {
    audioSource: {
      service: form.get('serviceObject').display_type,
      file: form.get('audiofile')
    }
  });
});

Controller.define('/production/new/metadata', function() {
  form.show('metadata');
});

Controller.define('/production/new/format/:id:', function(req) {
  form.show('format', req.id);
});

Controller.define('/production/new/chapter/:id:', function(req) {
  form.show('chapter', req.id);
});

Controller.define('/production/new/outgoings', function() {
  form.show('outgoings');
});
