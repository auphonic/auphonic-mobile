var API = require('API');
var renderTemplate = require('UI/renderTemplate');
var View = require('View');

var Source = require('./Source');

var Notice = require('UI/Notice');

var files = {};

var setFile = exports.setFile = function(store, filename) {
  store.set('input_file', filename);
  return filename;
};

exports.getType = function() {
  return 'input_file';
};

exports.getObject = function(store) {
  return store.get('input_file');
};

exports.getData = function(store) {
  // If there is no service (ie. an upload) we don't send the input_file name as string
  var service = Source.getData(store).service;
  if (!service) return null;

  return {
    input_file: store.get('input_file')
  };
};

exports.setData = function(store, service, index) {
  if (!files[service] || !files[service][index]) return;

  return setFile(store, files[service][index]);
};

var notice;
exports.createView = function(store) {
  var service = Source.getData(store).service;
  if (!service) return;

  View.getMain().showIndicator();
  API.on('service/' + service + '/ls', {
    lifetime: 60
  }).call('get', null, {
    timeout: 20000
  }).on({
    success: function(response) {
      if (!response || !response.data) {
        this.failure(response);
        return;
      }

      files[service] = response.data;
      var list = files[service].map(function(file, index) {
        return {
          index: index,
          display_name: file
        };
      });

      var serviceObject = Source.getObject(store);
      var object = new View.Object({
        title: serviceObject.display_type + ' ' + serviceObject.display_name,
        backTitle: serviceObject.display_type,
        content: renderTemplate('service-list', {
          files: list
        }),
        onHide: function() {
          object.invalidate();
        }
      });
      View.getMain().push(object);
    },

    error: function(event) {
      event.preventDefault();

      if (notice && notice.isOpen()) return notice.push();
      notice = new Notice('There are no files on this external service. Please try another service or make a recording.');
    }
  });
};
