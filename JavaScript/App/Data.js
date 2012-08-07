var Core = require('Core');
var typeOf = Core.typeOf;
var Browser = Core.Browser;

var LocalStorage = require('Utility/LocalStorage');

var API = require('API');

var OutputFiles = require('./OutputFiles');
var OutgoingService = require('./OutgoingService');
var Source = require('./Source');

var length = function(object) {
  return object && object.length;
};

var statuses = {
  '0': 'Incoming',
  '1': 'Waiting',
  '2': 'Error',
  '3': 'Done',
  '4': 'Processing',
  '5': 'Encoding',
  '6': 'Transferring',
  '7': 'Encoding',
  '8': 'Splitting',
  '9': 'Incomplete',
  '10': 'Not Started',
  '11': 'Outdated'
};

var fields = ['output_files', 'outgoing_services', 'chapters'];
var singular = ['file', 'service', 'chapter'];
var format = exports.format = function(production) {
  production.short_status_string = statuses[production.status];

  var short_info = [];
  fields.each(function(field, index) {
    var data = length(production[field]);
    if (data) short_info.push(data + ' ' + singular[index] + (data == '1' ? '' : 's'));
  });

  production.short_info = short_info.join(', ');
  return production;
};

API.on('productions', {
  formatter: function(response) {
    if (typeOf(response.data) == 'array')
      response.data = response.data.map(format);
    return response;
  }
});

API.on('presets', {
  formatter: function(response) {
    if (typeOf(response.data) == 'array')
      response.data = response.data.map(format);
    return response;
  }
});



var preferredFormats = {
  mp3: 1,
  'mp3-vbr': 3, // Variable Bitrate mp3's sometime cause issues
  aac: 2,
  alac: 3,
  dflt: 4
};

if (!Browser.Platform.ios) {
  preferredFormats.vorbis = 2;
  preferredFormats.flac = 3;
}

exports.prepare = function(object, type, fn) {
  Source.fetch(function(sources) {
    if (object.service) {
      var source;
      for (var i = 0; i < sources.length; i++) {
        source = sources[i];
        if (source.uuid == object.service) break;
      }

      if (source) {
        object.service_display_type = source.display_type;
        object.service_display_name = source.display_name;
      }
    }

    fn(object);
  });

  var user = LocalStorage.get('User');

  // We need to create a new object that can be transformed for viewing
  object = Object.clone(object);
  object.access_token = user && '?access_token=' + user.access_token;
  object.random = '&' + Date.now(); // Used for cache invalidation

  object[type] = true;
  object.baseURL = type;

  var metadata = object.metadata;

  metadata.hasLicense = !!(metadata.license || metadata.license_url);
  object.hasDetails =
    metadata.summary ||
    metadata.publisher ||
    metadata.url ||
    metadata.hasLicense ||
    length(metadata.tags && metadata.tags.erase('')); // The API returns an array with one empty string

  object.hasChapters = length(object.chapters);

  if (object.hasChapters) object.chapters.sortByKey('start');

  // Remove duplicates. The API currently allows to add the same service more than once
  var uuids = {};
  object.outgoing_services = length(object.outgoing_services) ? object.outgoing_services.map(OutgoingService.format).filter(function(service) {
    if (uuids[service.uuid]) return false;
    uuids[service.uuid] = true;
    return true;
  }) : null;

  var algorithms = API.getInfo('algorithms');
  object.algorithms = Object.values(Object.map(object.algorithms, function(value, algorithm) {
    return (value && algorithms[algorithm]) ? algorithms[algorithm] : null;
  })).clean();

  object.hasAlgorithms = !!length(object.algorithms);

  var media_files = [];
  if (object.output_files) object.output_files.each(function(file) {
    if (!file.download_url) return;

    media_files.push({
      format: parseFloat((preferredFormats[file.format] || preferredFormats.dflt) + '.' + String('000' + (file.bitrate || 0)).slice(-3)),
      url: encodeURI(file.download_url)
    });
  });

  if (length(metadata.tags)) metadata.tags = metadata.tags.join(', ');

  media_files = media_files.sortByKey('format').map(function(file) {
    return file.url + object.access_token;
  });

  object.media_files = length(media_files) ? JSON.stringify(media_files) : null;
  object.output_files = length(object.output_files) ? object.output_files.map(OutputFiles.createUIData) : null;
};
