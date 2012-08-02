var Browser = require('Core').Browser;

var LocalStorage = require('Utility/LocalStorage');

var API = require('API');

var OutputFiles = require('./OutputFiles');
var OutgoingService = require('./OutgoingService');

var length = function(object) {
  return object && object.length;
};

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

exports.prepare = function(object, type) {
  var user = LocalStorage.get('User');

  // We need to create a new object that can be transformed for viewing
  object = Object.append({}, object);
  object.access_token = user && '?access_token=' + user.access_token;
  object.random = '&' + Date.now(); // Used for cache invalidation

  object[type] = true;
  object.baseURL = type;

  var metadata = object.metadata;

  metadata.hasLicense = !!(metadata.license || metadata.license_url);
  object.hasDetails = metadata.summary || metadata.publisher || metadata.url || metadata.hasLicense;
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

  media_files = media_files.sortByKey('format').map(function(file) {
    return file.url + object.access_token;
  });

  object.media_files = length(media_files) ? JSON.stringify(media_files) : null;
  object.output_files = length(object.output_files) ? object.output_files.map(OutputFiles.createUIData) : null;

  return object;
};
