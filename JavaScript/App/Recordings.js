var renderTemplate = require('UI/renderTemplate');
var View = require('View');

var Recording = require('Store/Recording');

exports.getType = function() {
  return 'recording';
};

exports.getData = function(store) {
  return null;
};
exports.setData = function(store, id) {};
exports.resetData = function(store) {};

exports.createView = function(store, options) {
  var object = new View.Object({
    title: 'Recordings',
    content: renderTemplate('recording-choose', {
      recordings: Recording.getListSortedByTime()
    })
  });

  store.getViewController().push(object);
};
