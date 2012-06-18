var API = require('../API');
var Controller = require('./');
var View = require('../View');
var UI = require('../UI');

var productions = null;
var list = null;

Controller.define('/production', function() {

  View.get('Main').showLoadingIndicator({fade: true});

  API.call('productions').on({

    success: function(result) {
      list = result.data;

      productions = {};
      list.each(function(production) {
        productions[production.uuid] = production;
      });

      View.get('Main').push('production', new View.Object({
        title: 'Productions',
        content: UI.render('production', {production: list}),
        action: {
          title: 'New',
          url: '/production/new'
        }
      }));
    }

  });

});

Controller.define('/production/new', function() {

  View.get('Main').push('production', new View.Object({
    title: 'New Production',
    content: 'Hello!'
  }));

});

Controller.define('/production/{uuid}', function(req) {

  var production = productions[req.uuid];
  View.get('Main').push('production', new View.Object({
    title: production.metadata.title,
    content: UI.render('production-detail', production),
    action: {
      title: 'Edit',
      url: '/production/edit/' + production.uuid
    }
  }));

});

Controller.define('/production/edit/{uuid}', function(req) {

  var production = productions[req.uuid];
  View.get('Main').push('production', new View.Object({
    title: production.metadata.title,
    content: 'Test'
  }));

});
