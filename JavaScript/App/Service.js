var API = require('API');
var UI = require('UI');
var View = require('View');

var services = {};

var format = exports.format = function(service) {
  var type = service.type;
  if (type == 'dropbox') type = type.charAt(0).toUpperCase() + type.slice(1);
  else type = service.type.toUpperCase();
  service.display_type = type;

  return service;
};

exports.getType = function() {
  return 'outgoings';
};

exports.getData = function(dataStore) {
  return dataStore.get('outgoings', {});
};

exports.createView = function(dataStore) {
  View.getMain().showIndicator();

  API.call('services').on({

    success: function(response) {
      var services = response.data.map(format);

      View.getMain().push(new View.Object({
        title: 'Transfers',
        content: UI.render('form-new-service', {
          service: services
        }),
        action: {
          title: 'Done',
          back: true,
          onClick: function() {
            dataStore.set('outgoings', View.getMain().getCurrentView().serialize());
          }
        },
        back: {
          title: 'Cancel'
        },

        onShow: function() {
          this.unserialize(dataStore.get('outgoings'));
        }
      }));

    }
  });
};
