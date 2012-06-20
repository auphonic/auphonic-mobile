var API = require('API');
var UI = require('UI');
var View = require('View');

var Service = require('./Service');

var services = {};

exports.getType = function() {
  return 'source';
};

exports.getData = function(dataStore) {
  return {
    service: dataStore.get('service')
  };
};

exports.setService = function(dataStore, id) {
  var service = services[id];
  if (!service) return;

  dataStore.set('service', service.uuid);
  dataStore.set('serviceObject', service);
  return service;
};

exports.createView = function(dataStore) {
  View.getMain().showIndicator();

  API.call('services').on({

    success: function(response) {
      var list = response.data.map(Service.format);

      services = {};
      list.each(function(service) {
        services[service.uuid] = service;
      });

      View.getMain().push('production', new View.Object({
        title: 'Choose Source',
        content: UI.render('service-choose', {
          source: list
        })
      }));
    }

  });
};
