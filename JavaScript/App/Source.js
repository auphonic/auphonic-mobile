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

exports.setData = function(dataStore, id) {
  var service = services[id];
  if (!service) return;

  dataStore.set('service', service.uuid);
  dataStore.set('serviceObject', service);
  return service;
};

exports.getObject = function(dataStore) {
  return dataStore.get('serviceObject', {});
};

var get = exports.get = function(callback) {
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

exports.createView = function(dataStore) {
  View.getMain().showIndicator();

  get(function(list) {
    View.getMain().push(new View.Object({
      title: 'Input Source',
      backTitle: 'Source',
      content: UI.render('service-choose', {
        source: list
      })
    }));
  });
};
