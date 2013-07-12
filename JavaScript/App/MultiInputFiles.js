var Core = require('Core');
var Elements = Core.Elements;

var View = require('View');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');

var Popover = require('UI/Actions/Popover');

var attachChooseSourceListeners = require('./attachChooseSourceListeners');
var Source = require('./Source');

exports.getType = function() {
  return 'multi_input_files';
};

var getData = exports.getData = function(store) {
  return store.get('multi_input_files', {});
};

var setData = exports.setData = function(store, multi_input_files) {
  store.set('multi_input_files', Object.flatten({multi_input_files: multi_input_files}));
};

var updateMultiInputFileCounter = function(store, object) {
  var container = object.toElement().getElement('.multiInputFilesCount');
  if (!container) return;

  var hasIntro = false;
  var hasOutro = false;
  Array.forEach(getData(store).multi_input_files, function(inputFile) {
    if (inputFile.type == 'intro') hasIntro = true;
    else if (inputFile.type == 'outro') hasOutro = true;
  });

  var string = (hasIntro ? (hasOutro ? 'both' : 'intro') : (hasOutro ? 'outro' : ''));
  container.set('text', string ? string + ' defined' : '');
};

exports.setup = function(store, baseURL, object) {
  object.addEvent('show', function() {
    updateMultiInputFileCounter(store, object);
  });
};

exports.createView = function(store) {
  Source.fetch(function(list) {
    var object;
    var sources = {};
    list.forEach(function(source) {
      sources[source.uuid] = source;
    });

    var originalInputFiles = getData(store).multi_input_files;
    var inputFiles = [];
    var intro;
    var outro;
    Array.forEach(originalInputFiles, function(inputFile, index) {
      inputFiles[index] = Object.append({}, inputFile);
      if (inputFile.type == 'intro') intro = inputFile;
      else if (inputFile.type == 'outro') outro = inputFile;
    });

    var getPopover = function(ul) {
      var label = ul.getElement('.input_file_label');
      return label && label.getInstanceOf(Popover);
    };

    var removeSourceListener = function(type) {
      return function(event) {
        event.preventDefault();
        inputFiles = inputFiles.filter(function(inputFile) {
          return (inputFile.type != type);
        });
        getPopover(object.toElement().getElement('.input-file-' + type)).close();
        updateUI(type, null);
      };
    };

    var attachListeners = function(type) {
      var ul = object.toElement().getElement('.input-file-' + type);
      attachChooseSourceListeners(ul, {
        onSelectResourceFile: createCallback(type)
      });
      var popover = getPopover(ul);
      if (popover) popover.getPopover().getElement('.removeSource').addEvent('click', removeSourceListener(type));
    };

    var getUIData = function(data) {
      var source = data && sources[data.service];
      return {
        service: source && source.display_type,
        input_file: data && data.input_file.replace(/^\//, ''),
        isMultiInputFile: true,
        production: true,
        hasPopover: true
      };
    };

    var updateUI = function(type, inputFile) {
      var element = object.toElement();
      var ul = element.getElement('ul.input-file-' + type);
      ul.getElements('.input_file, .choose_source').dispose();
      Elements.from(renderTemplate('form-main-input-file', getUIData(inputFile))).inject(ul, 'top');
      UI.update(element);
      attachListeners(type);
    };

    var createCallback = function(type) {
      return function(service, file) {
        var inputFile = Array.filter(inputFiles, function(inputFile) {
          return (inputFile.type == type);
        })[0] || {};
        inputFile.service = service;
        inputFile.input_file = file;
        inputFile.type = type;
        var index = inputFiles.indexOf(inputFile);
        if (index == -1) inputFiles.push(inputFile);
        else inputFiles[index] = inputFile;

        updateUI(type, inputFile);
      };
    };

    object = new View.Object({
      title: 'Intro / Outro',
      content: renderTemplate('form-multi-input-files', {
        intro: getUIData(intro),
        outro: getUIData(outro),
      }),
      action: {
        title: 'Done',
        className: 'done',
        back: true,
        onClick: function() {
          setData(store, inputFiles);
        }
      },
      back: {
        title: 'Cancel'
      },
      onShow: function() {
        attachListeners('intro');
        attachListeners('outro');
      }
    });

    store.getViewController().push(object);
  });
};
