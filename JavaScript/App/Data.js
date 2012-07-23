var LocalStorage = require('Utility/LocalStorage');

var API = require('API');

var OutputFiles = require('./OutputFiles');
var Service = require('./Service');

var length = function(object) {
  return object && object.length;
};

exports.prepare = function(object, type) {
  // We need to create a new object that can be transformed for viewing
  object = Object.append({}, object);
  object[type] = true;
  object.baseURL = type;

  var metadata = object.metadata;

  metadata.hasLicense = !!(metadata.license || metadata.license_url);
  object.hasDetails = metadata.summary || metadata.publisher || metadata.url || metadata.hasLicense;
  object.hasChapters = length(object.chapters);

  if (object.hasChapters) object.chapters.sortByKey('start');

  // Remove duplicates. The API currently allows to add the same service more than once
  var uuids = {};
  object.outgoing_services = length(object.outgoing_services) ? object.outgoing_services.map(Service.format).filter(function(service) {
    if (uuids[service.uuid]) return false;
    uuids[service.uuid] = true;
    return true;
  }) : null;

  var algorithms = API.getInfo('algorithms');
  object.algorithms = Object.values(Object.map(object.algorithms, function(value, algorithm) {
    return (value && algorithms[algorithm]) ? algorithms[algorithm] : null;
  })).clean();

  object.hasAlgorithms = !!length(object.algorithms);
  object.output_files = length(object.output_files) ? object.output_files.map(OutputFiles.createUIData) : null;

  var user = LocalStorage.get('User');
  object.access_token = user && '?access_token=' + user.access_token;

  return object;
};
