var API = require('API');

var OutputFiles = require('./OutputFiles');
var Service = require('./Service');

exports.prepare = function(object) {
  // We need to create a new object that can be transformed for viewing
  object = Object.append({}, object);
  var metadata = object.metadata;

  metadata.hasLicense = !!(metadata.license || metadata.license_url);
  object.hasDetails = metadata.summary || metadata.publisher || metadata.url || metadata.hasLicense;
  object.hasChapters = object.chapters && object.chapters.length;

  if (object.hasChapters) object.chapters.sort(function(a, b) {
    if (a.start == b.start) return 0;
    return a.start > b.start ? 1 : -1;
  });


  if (object.outgoing_services && object.outgoing_services.length) {
    var uuids = {};
    // Remove duplicates. The API currently allows to add the same service more than once
    object.outgoing_services = object.outgoing_services.map(Service.format).filter(function(service) {
      if (uuids[service.uuid]) return false;
      uuids[service.uuid] = true;
      return true;
    });
  } else {
    object.outgoing_services = null; // Be safe
  }

  if (object.algorithms) {
    var list = [];
    var algorithms = API.getInfo('algorithms');
    Object.each(object.algorithms, function(value, algorithm) {
      if (!value) return;
      if (!algorithms[algorithm]) return;
      object.hasAlgorithms = true;
      list.push(algorithms[algorithm]);
    });
    object.algorithms = list;
  }

  if (object.output_files && object.output_files.length)
    object.output_files = object.output_files.map(OutputFiles.createUIData);
  else
    object.output_files = null;

  return object;
};
