var renderTemplate = require('UI/renderTemplate');
var View = require('View');

exports.getType = function() {
  return 'http_upload';
};

exports.getData = function(store) {
  var value = store.get('http_upload');
  return value ? {
    input_file: value
  } : null;
};

var setData = exports.setData = function(store, data) {
  if (data) store.set('http_upload', data.http_upload);
};

exports.createView = function(store, options) {
  var object = new View.Object({
    title: 'HTTP Upload',
    content: renderTemplate('form-http-upload'),
    action: {
      title: 'Done',
      className: 'done',
      url: '/production/new',
      onClick: function() {
        exports.setData(store, View.getMain().getCurrentObject().serialize());
      }
    }
  });

  View.getMain().push(object);
};
