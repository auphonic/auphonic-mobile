var Core = require('Core');
var Element = Core.Element;
var Elements = Core.Elements;

var History = require('History');

var API = require('../API');
var Controller = require('./');
var View = require('../View');
var UI = require('../UI');

var SwipeAble = require('../UI/Actions/SwipeAble');

var presets = null;
var list = null;

var formdata = {};
var formats = {};

// TODO API call when API is available
var algorithms = {
  "denoise": {
      "display_name": "Noise Reduction ",
      "description": "Classifies regions with different background noises and automatically removes noise and hum.",
      "default_value": false
  },
  "filtering": {
      "display_name": "Filtering",
      "description": "Filters unnecessary and disturbing low frequencies depending on the context (speech, music, noise).",
      "default_value": true
  },
  "leveler": {
      "display_name": "Adaptive Leveler ",
      "description": "Corrects level differences between speakers, music and speech, etc. to achieve a balanced overall loudness.",
      "default_value": true
  },
  "normloudness": {
      "display_name": "Global Loudness Normalization",
      "description": "Adjusts the global, overall loudness to a value of -18 LUFS (see EBU R128), so that all processed files have a similar average loudness.",
      "default_value": true
  }
};

var formatServices = function(services) {
  services.each(function(service) {
    var type = service.type;
    if (type == 'dropbox') type = type.charAt(0).toUpperCase() + type.slice(1);
    else type = service.type.toUpperCase();
    service.display_type = type;
  });

  return services;
};

var createFormatUIData = function(formats, content) {
  var item = formats[content.format];
  var index = (item.bitrates ? item.bitrates.indexOf('' + content.bitrate) : 0); // Needs to be String
  return {
    title: item.display_name.replace(/\((.+?)\)/, '').trim(), // Remove parenthesis
    detail: item.bitrate_strings[index].replace(/\((.+?)\)/, '').trim(), // Remove parenthesis,
  };
};

Controller.define('/preset', function() {

  API.call('presets.json').on({

    success: function(result) {
      list = result.data;

      presets = {};
      list.each(function(preset) {
        presets[preset.uuid] = preset;
      });

      // TODO move this and cache it
      API.call('info/formats.json').on({

        success: function(result) {
          formats = result.data;

          View.get('Main').push('preset', new View.Object({
            title: 'Presets',
            content: UI.render('preset', {preset: list}),
            action: {
              title: 'New',
              url: '/preset/new'
            }
          }));
        }
      });
    }

  });

});

Controller.define('/preset/{uuid}', function(req) {

  // We need to create a new object that can be transformed for viewing
  var preset = Object.append({}, presets[req.uuid]);
  var metadata = preset.metadata;

  metadata.hasLicense = !!(metadata.license || metadata.license_url);
  preset.hasDetails = metadata.summary || metadata.publisher || metadata.url || metadata.hasLicense;

  if (preset.outgoings && preset.outgoings.length) formatServices(preset.outgoings);
  else preset.outgoings = null; // Be safe

  if (preset.algorithms) {
    var list = [];
    Object.each(preset.algorithms, function(value, algorithm) {
      if (!value) return;
      preset.hasAlgorithms = true;
      list.push(algorithms[algorithm]);
    });
    preset.algorithms = list;
  }

  if (preset.formats && preset.formats.length) {
    preset.formats = preset.formats.map(function(content) {
      return createFormatUIData(formats, content);
    });
  } else {
    preset.formats = null;
  }

  View.get('Main').push('preset', new View.Object({
    title: preset.preset_name,
    content: UI.render('preset-detail', preset)
  }));

});

Controller.define('/preset/{uuid}/summary', function(req) {

  var preset = presets[req.uuid];
  View.get('Main').push('preset', new View.Object({
    title: preset.preset_name,
    content: UI.render('preset-detail-summary', preset)
  }));

});

Controller.define('/preset/new', {priority: 1, isGreedy: true}, function(req) {
  var object;
  View.get('Main').push('preset', object = new View.Object({
    title: 'New Preset',
    content: UI.render('preset-new', {
      algorithm: Object.values(Object.map(algorithms, function(content, algorithm) {
        return Object.append({key: algorithm}, content);
      }))
    }),
    action: {
      title: 'Save',
      url: '/preset/new/save',
      onClick: function() {
        var data = object.serialize();

        var container = object.toElement().getElement('ul.output_formats');
        data.formats = container.getChildren().retrieve('value').clean().map(function(format) {
          // Add filename if necessary
          var file = format.filename;
          var endings = formats[format.format].endings;
          var check = function(ending) {
            return file.indexOf('.' + ending) == file.length - 1 - ending.length;
          };
          if (file && !endings.some(check))
            format.filename += '.' + endings[0];

          return format;
        });

        Object.append(data, formdata.metadata, formdata.outgoings);

        // Expand flat structures to objects as specified by the API
        for (var key in data) {
          var parts = key.split('.');
          if (parts.length == 1) continue;

          if (!data[parts[0]]) data[parts[0]] = {};
          data[parts[0]][parts[1]] = data[key];
          delete data[key];
        }

        API.call('presets.json', 'post', JSON.stringify(data));
      }
    },

    onShow: function() {
      if (formdata.format) {
        var container = object.toElement().getElement('ul.output_formats');
        var content = formdata.format;
        var id = formdata.formatID || String.uniqueID();
        var previous = formdata.formatID ? container.getElement('[data-format-id=' + id + ']') : null;
        delete formdata.formatID;

        // Select-Values are Arrays but we only need the first and only value
        content.format = content.format[0];
        content.bitrate = content.bitrate[0];

        var element = Element.from(UI.render('ui-removable-list-item',
          Object.append(createFormatUIData(formats, content), {
            label: 'Remove',
            href: '/preset/new/format/' + id
          })
        )).set('data-format-id', id).store('value', content);

        if (previous) element.replaces(previous);
        else element.inject(container);

        UI.update(container);

        // Store for editing
        if (!formdata.formats) formdata.formats = {};
        formdata.formats[id] = content;

        var instance = element.getInstanceOf(SwipeAble);
        if (instance) instance.addEvent('click', function() {
          if (formdata.formats) delete formdata.formats[id];
        });

        delete formdata.format;
      }
    },

    onHide: function(direction) {
      if (direction == 'left') formdata = {};
    }
  }));

});

Controller.define('/preset/new/metadata', function(req) {

  View.get('Main').push('preset', new View.Object({
    title: 'Enter Metadata',
    content: UI.render('preset-new-metadata'),
    action: {
      title: 'Done',
      url: '/preset/new',
      onClick: function() {
        formdata.metadata = View.get('Main').getCurrentView().serialize();
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      this.unserialize(formdata.metadata);
    }
  }));

});

Controller.define('/preset/new/format/:id:', function(req) {

  var list = [];
  Object.each(formats, function(value, key) {
    value = Object.append({}, value);
    value.value = key;
    value.bitrate_format = [];
    value.bitrate_strings.each(function(string, index) {
      var bitrate = (value.bitrates ? value.bitrates[index] : 0);
      value.bitrate_format.push({
        value: bitrate,
        title: string,
        selected: (!bitrate || bitrate == value.default_bitrate)
      });
    });
    list.push(value);
  });

  var object;
  View.get('Main').push('preset', object = new View.Object({
    title: 'Add Output Format',
    content: UI.render('preset-new-format', {
      format: list
    }),
    back: {
      title: 'Cancel'
    }
  }));

  var bitrateContainer = object.toElement().getElement('.bitrates').dispose();
  var selects = object.toElement().getElements('select.empty');
  selects.addEvents({

    'change:once': function() {
      View.get('Main').updateElement('action', {}, {
        title: req.id ? 'Done' : 'Add',
        url: '/preset/new',
        onClick: function() {
          formdata.format = View.get('Main').getCurrentView().serialize();
          if (req.id) formdata.formatID = req.id;
        }
      });
    },

    change: function() {
      var data = object.serialize();
      delete data.bitrate;
      delete data.format;

      var option = this.getSelected()[0];
      var value = option.get('value');
      var parent = this.getParent('ul');
      var item = bitrateContainer.getElement('[data-format=' + value + ']').clone();

      parent.getElements('> :not(li:first-child)').dispose();
      parent.adopt(item);

      Elements.from(UI.render('preset-new-format-detail')).inject(parent);

      // Restore previous values
      object.unserialize(data);
      UI.update(parent);
    }

  });

  // editing
  if (req.id && formdata.formats[req.id]) {
    object.unserialize({format: formdata.formats[req.id].format});
    selects.fireEvent('focus:once').fireEvent('change');
    object.unserialize(formdata.formats[req.id]);
  }
});

Controller.define('/preset/new/service', function(req) {

  API.call('services.json').on({

    success: function(result) {
      var services = formatServices(result.data);

      View.get('Main').push('preset', new View.Object({
        title: 'Outgoing Transfers',
        content: UI.render('preset-new-service', {
          service: services
        }),
        action: {
          title: 'Done',
          url: '/preset/new',
          onClick: function() {
            formdata.outgoings = View.get('Main').getCurrentView().serialize();
          }
        },
        back: {
          title: 'Cancel'
        },

        onShow: function() {
          this.unserialize(formdata.outgoings);
        }
      }));

    }
  });

});

Controller.define('/preset/new/save', function(req) {

  History.push('/preset');

});
