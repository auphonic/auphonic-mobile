(function() {

var productions = null;
var list = null;

Controller.define('/production', function() {

  API.call('productions.json').on({

    success: function(result) {
      list = result.data.productions;

      productions = {};
      list.each(function(production) {
        productions[production.uuid] = production;
      });

      Views.get('Main').push('production', new View.Object({
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

  Views.get('Main').push('production', new View.Object({
    title: 'New Production',
    content: 'Hello!'
  }));

});

Controller.define('/production/{uuid}', function(req) {

  var production = productions[req.uuid];
  Views.get('Main').push('production', new View.Object({
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
  Views.get('Main').push('production', new View.Object({
    title: production.metadata.title,
    content: 'Test'
  }));

});

})();
