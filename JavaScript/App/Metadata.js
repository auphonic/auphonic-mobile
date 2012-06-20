var UI = require('UI');
var View = require('View');

exports.getType = function() {
  return 'metadata';
};

exports.getData = function(dataStore) {
  return dataStore.get('metadata', {});
};

exports.createView = function(dataStore) {
  View.getMain().push(new View.Object({
    title: 'Metadata',
    content: UI.render('form-new-metadata'),
    action: {
      title: 'Done',
      back: true,
      onClick: function() {
        dataStore.set('metadata', View.getMain().getCurrentView().serialize());
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      var metadata = dataStore.get('metadata');
      this.unserialize(Object.append({
        'metadata.year': (new Date).getFullYear(),
        'metadata.genre': 'Podcast'
      }, metadata));
    }
  }));
};
