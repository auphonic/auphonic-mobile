var LocalStorage = require('Utility/LocalStorage');

var API = require('API');
var UI = require('UI');
var View = require('View');

var CoverPhoto = require('./CoverPhoto');

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
  var user = LocalStorage.get('User');

  object = new View.Object({
    title: 'Metadata',
    content: UI.render('form-new-metadata', {
      thumbnail: store.get('thumbnail'),
      access_token: user && '?access_token=' + user.access_token,
      random: '&' + Date.now() // Used for cache invalidation
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
        'metadata.genre': 'Podcast'
      }, metadata));
    }
  });

  CoverPhoto.createView(store, object);

  View.getMain().push(object);
};
