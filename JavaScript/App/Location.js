var UI = require('UI');
var Notice = require('UI/Notice');
var TextProgressIndicator = require('UI/TextProgressIndicator');

var Popover = require('UI/Actions/Popover');

exports.getType = function() {
  return 'location';
};

exports.getData = function(store) {
  return {
    metadata: {
      location: store.get('location')
    }
  };
};

exports.setData = function(store, data) {
  // This field is being set only in the Metadata module.
};

exports.createView = function(store, object) {
  var isRequestingLocation = false;
  var indicator;
  var reset = function() {
    isRequestingLocation = false;
    indicator.reset();
    indicator = null;
  };

  var onSuccess = function(position) {
    reset();

    var container = object.toElement();
    var detail = container.getElement('.location-detail');
    container.getElement('.location-add').hide();

    detail.getElement('.location-detail').empty().set({
      'data-latitude': position.coords.latitude,
      'data-longitude': position.coords.longitude
    });
    UI.update(detail);
    detail.show();

    store.set('location', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  };

  var onError = function() {
    reset();

    new Notice('There was an error calculating your current location. If this problem persists, please make sure location services are enabled for this app.', {type: 'error'});
  };

  var addLocation = function() {
    if (isRequestingLocation) return;
    isRequestingLocation = true;

    var container = object.toElement();
    indicator = new TextProgressIndicator(container.getElement('.location-add-text'), {
      text: 'Locating'
    }).start();

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 7000
    });
  };

  var removeLocation = function() {
    var container = object.toElement();
    container.getElement('.location-detail').hide();
    container.getElement('.location-add').show();

    store.set('location', null);
    var metadata = store.get('metadata');
    metadata['metadata.location.latitude'] = null;
    metadata['metadata.location.longitude'] = null;
    store.set('metadata', metadata);
  };

  var attachListeners = function() {
    var container = object.toElement();
    container.getElement('.location-add').addEvent('click', addLocation);

    var popover = container.getElement('.location-detail-popover').getInstanceOf(Popover).getPopover();
    popover.getElement('.location-remove').addEvent('click', removeLocation);
  };

  object.addEvent('show:once', attachListeners);
};
