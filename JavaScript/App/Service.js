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

API.on('services', {
  formatter: function(response) {
    response.data = response.data.map(format);
    return response;
  }
});

exports.getType = function() {
  return 'outgoing_services';
};

exports.getData = function(dataStore) {
  var list = [];
  var object = Object.expand(Object.append({}, dataStore.get('outgoing_services', {})));
  Object.each(object.outgoing_services, function(value, service) {
    if (value) list.push({uuid: service});
  });
  return {
    outgoing_services: list
  };
};

var get = exports.get = function(callback) {
  API.call('services').on({
    success: function(response) {
      callback(response.data.filter(function(service) {
        return !!service.outgoing;
      }));
    }
  });
};

exports.createView = function(dataStore) {
  View.getMain().showIndicator();

  get(function(services) {
    View.getMain().push(new View.Object({
      title: 'Transfers',
      content: UI.render('form-new-service', {
        service: services
      }),
      action: {
        title: 'Done',
        back: true,
        onClick: function() {
          dataStore.set('outgoing_services', View.getMain().getCurrentView().serialize());
        }
      },
      back: {
        title: 'Cancel'
      },

      onShow: function() {
        this.unserialize(dataStore.get('outgoing_services'));
      }
    }));
  });
};
