var uploads = {};

exports.add = function(uuid, data) {
  uploads[uuid] = data;
};

exports.retrieve = function(uuid) {
  return uploads[uuid];
};

exports.remove = function(uuid) {
  var object = uploads[uuid];
  delete uploads[uuid];
  return object;
};

exports.has = function(uuid) {
  return !!uploads[uuid];
};
