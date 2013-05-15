var renderTemplate = require('UI/renderTemplate');
var View = require('View');

var CoverPhoto = require('./CoverPhoto');
var Location = require('./Location');

exports.getType = function() {
  return 'metadata';
};

exports.getData = function(store) {
  return store.get('metadata', {});
};

exports.setData = function(store, metadata) {
  store.set('metadata', Object.flatten({metadata: metadata}));
  store.set('location', metadata['location.latitude'] ? {
    latitude: metadata['location.latitude'],
    longitude: metadata['location.longitude']
  } : null);
};

exports.createView = function(store, options) {
  var object = new View.Object({
    title: 'Metadata',
    content: renderTemplate('form-metadata', {
      thumbnail: store.get('thumbnail'),
      location: store.get('location'),
      withLocation: options && options.withLocation
    }),
    action: {
      title: 'Done',
      className: 'done',
      back: true,
      onClick: function() {
        store.set('metadata', View.getMain().getCurrentObject().serialize());
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      var metadata = store.get('metadata');
      this.unserialize(Object.append({
        'metadata.year': (new Date).getFullYear()
      }, metadata));
    }
  });

  CoverPhoto.createView(store, object);

  if (options && options.withLocation) Location.createView(store, object);

  View.getMain().push(object);
};
