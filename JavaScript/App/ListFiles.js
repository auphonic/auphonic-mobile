var API = require('API');
var UI = require('UI');
var View = require('View');

var Source = require('./Source');

var files = {};

var setFile = exports.setFile = function(store, filename) {
  store.set('input_file', filename);
  return filename;
};

exports.getType = function() {
  return 'listFiles';
};

exports.getData = function(store) {
  return {
    input_file: store.get('input_file')
  };
};

exports.setData = function(store, index) {
  if (!files[index]) return;

  return setFile(store, files[index]);
};

exports.createView = function(store) {

  var service = Source.getData(store).service;
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

      var serviceObject = Source.getObject(store);
      var object = new View.Object({
        title: serviceObject.display_type + ' ' + serviceObject.display_name,
        backTitle: serviceObject.display_type,
        content: UI.render('service-list', {
          files: list
        }),
        onHide: function() {
          object.invalidate();
        }
      });
      View.getMain().push(object);
    }

  });
};
