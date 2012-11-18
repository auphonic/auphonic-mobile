var API = require('API');
var UI = require('UI');
var View = require('View');

var CoverPhoto = require('./CoverPhoto');

var Auphonic = require('Auphonic');

exports.getType = function() {
  return 'metadata';
};

exports.getData = function(store) {
  return store.get('metadata', {});
};

exports.setData = function(store, metadata) {
  store.set('metadata', Object.flatten({metadata: metadata}));
};

exports.createView = function(store, data) {
  var object;

  object = new View.Object({
    title: 'Metadata',
    content: UI.render('form-new-metadata', {
      thumbnail: store.get('thumbnail'),
    }),
    action: {
      title: 'Done',
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
        'metadata.year': (new Date).getFullYear(),
        'metadata.genre': Auphonic.DefaultGenre
      }, metadata));
    }
  });

  CoverPhoto.createView(store, object);

  View.getMain().push(object);
};
