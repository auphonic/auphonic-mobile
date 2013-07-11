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
  var isActive;
  var view = store.getViewController();
  var object = new View.Object({
    title: 'HTTP Upload',
    content: renderTemplate('form-http-upload'),
    onShow: function() {
      object.toElement().getElement('.http-upload').addEvent('input', function() {
        var hasValue = this.get('value');
        if (hasValue && !isActive) {
          isActive = true;
          view.updateElement('action', {}, {
            title: 'Done',
            className: 'done',
            url: '/production/new',
            onClick: function() {
              exports.setData(store, object.serialize());
            }
          });
        } else if (!hasValue && isActive) {
          isActive = false;
          view.updateElement('action');
        }
      });
    }
  });

  view.push(object);
};
