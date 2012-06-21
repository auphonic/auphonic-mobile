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

exports.setData = function(dataStore, index) {
  if (!files[index]) return;

  dataStore.set('audiofile', files[index]);
  return files[index];
};

exports.createView = function(dataStore) {

  var service = Source.getData(dataStore).service;
  if (!service) return;

  View.getMain().showIndicator();
  API.call('service/' + service + '/ls').on({

    success: function(response) {
      files = response.data;

      var list = files.map(function(file, index) {
        return {
          index: index,
          display_name: file
        };
      });

      var serviceObject = Source.getObject(dataStore);
      View.getMain().push(new View.Object({
        title: serviceObject.display_type + ' ' + serviceObject.display_name,
        content: UI.render('service-list', {
          files: list
        })
      }));
    }

  });
};
