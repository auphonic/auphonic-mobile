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

var setFile = exports.setFile = function(dataStore, filename) {
  dataStore.set('audiofile', filename);
  return filename;
};

exports.setData = function(dataStore, index) {
  if (!files[index]) return;

  return setFile(dataStore, files[index]);
};

exports.createView = function(dataStore) {

  var service = Source.getData(dataStore).service;
  if (!service) return;

  View.getMain().showIndicator();
  API.on('service/' + service + '/ls', {
    lifetime: 60
  }).call().on({

    success: function(response) {
      files = response.data;

      var list = files.map(function(file, index) {
        return {
          index: index,
          display_name: file
        };
      });

      var serviceObject = Source.getObject(dataStore);
      var object;
      View.getMain().push(object = new View.Object({
        title: serviceObject.display_type + ' ' + serviceObject.display_name,
        backTitle: serviceObject.display_type,
        content: UI.render('service-list', {
          files: list
        }),
        onHide: function() {
          object.invalidate();
        }
      }));
    }

  });
};
