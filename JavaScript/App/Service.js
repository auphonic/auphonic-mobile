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

var getData = exports.getData = function(store) {
  var list = [];
  var object = Object.expand(Object.clone(store.get('outgoing_services', {})));
  Object.each(object.outgoing_services, function(service, uuid) {
    if (!service.checked) return;

    service = Object.clone(service);
    delete service.checked;
    list.push(service);
  });
  return {
    outgoing_services: list
  };
};

API.on('services', {
  formatter: function(response) {
    response.data = response.data.map(format);
    return response;
  }
});

var updateCounter = function(store, object) {
  var container = object.toElement().getElement('.servicesCount');
  if (!container) return;

  var count = getData(store).outgoing_services.length;
  container.set('text', count ? count + ' selected' : '');
};

exports.getType = function() {
  return 'outgoing_services';
};

exports.setData = function(store, outgoing_services, baseURL, object, immediate) {
  var services = {};
  if (outgoing_services) outgoing_services.each(function(service) {
    services['outgoing_services.' + service.uuid + '.checked'] = true;
    services['outgoing_services.' + service.uuid + '.uuid'] = service.uuid;
  });

  store.set('outgoing_services', services);

  if (immediate) updateCounter(store, object);
};

exports.setup = function(store, outgoing_services, object) {
  object.addEvent('show', function() {
    updateCounter(store, object);
  });
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

exports.createView = function(store) {
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
          store.set('outgoing_services', View.getMain().getCurrentView().serialize());
        }
      },
      back: {
        title: 'Cancel'
      },

      onShow: function() {
        this.unserialize(store.get('outgoing_services'));
      }
    }));
  });
};
