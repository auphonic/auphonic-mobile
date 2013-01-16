var API = require('API');
var renderTemplate = require('UI/renderTemplate');
var View = require('View');

var services = {};

exports.getType = function() {
  return 'service';
};

exports.getData = function(store) {
  return {
    service: store.get('service')
  };
};

exports.setData = function(store, id) {
  var service = services[id];
  if (!service) return;

  store.set('service', service.uuid);
  store.set('serviceObject', service);
  return service;
};

exports.resetData = function(store) {
  store.set('service', null);
  store.set('serviceObject', null);
};

exports.getObject = function(store) {
  return store.get('serviceObject', {});
};

var fetch = exports.fetch = function(callback) {
  API.call('services').on({

    success: function(response) {
      var list = response.data.filter(function(service) {
        return !!service.incoming;
      });

      services = {};
      list.each(function(service) {
        services[service.uuid] = service;
      });

      callback(list);
    }
  });
};

exports.createView = function() {
  View.getMain().showIndicator();

  fetch(function(list) {
    View.getMain().push(new View.Object({
      title: 'Input Source',
      backTitle: 'Source',
      content: renderTemplate('service-choose', {
        source: list
      })
    }));
  });
};
