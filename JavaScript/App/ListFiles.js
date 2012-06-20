var API = require('API');
var UI = require('UI');
var View = require('View');

var Source = require('./Source');

var files = {};

exports.getType = function() {
  return 'listFiles';
};

exports.getData = function(dataStore) {
  return {
    audiofile: dataStore.get('audiofile')
  };
};

exports.setFile = function(dataStore, index) {
  if (!files[index]) return;
  dataStore.set('audiofile', files[index]);
};

exports.createView = function(dataStore, serviceId) {

  var service = Source.setService(dataStore, serviceId);
  if (!service) return;

  View.getMain().showIndicator();

  API.call('service/' + service.uuid + '/ls').on({

    success: function(response) {
      files = response.data;

      var list = files.map(function(file, index) {
        return {
          index: index,
          display_name: file
        };
      });

      View.getMain().push('production', new View.Object({
        title: service.display_type + ' ' + service.display_name,
        content: UI.render('service-list', {
          files: list
        })
      }));
    }

  });
};
