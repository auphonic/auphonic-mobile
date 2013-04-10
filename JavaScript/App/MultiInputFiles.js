exports.getType = function() {
  return 'multi_input_files';
};

exports.getData = function(store) {
  return store.get('multi_input_files', {});
};

exports.setData = function(store, multi_input_files) {
  store.set('multi_input_files', Object.flatten({multi_input_files: multi_input_files}));
};
