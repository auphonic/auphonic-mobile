var UI = require('UI');
var View = require('View');

exports.getType = function() {
  return 'metadata';
};

exports.getData = function(store) {
  return store.get('metadata', {});
};

exports.setData = function(store, metadata) {
  store.set('metadata', Object.flatten({metadata: metadata}));
};

exports.createView = function(store) {
  View.getMain().push(new View.Object({
    title: 'Metadata',
    content: UI.render('form-new-metadata'),
    action: {
      title: 'Done',
      back: true,
      onClick: function() {
        store.set('metadata', View.getMain().getCurrentView().serialize());
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      var metadata = store.get('metadata');
      this.unserialize(Object.append({
        'metadata.year': (new Date).getFullYear(),
        'metadata.genre': 'Podcast'
      }, metadata));
    }
  }));
};
