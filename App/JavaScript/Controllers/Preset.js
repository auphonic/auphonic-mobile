(function() {

var presets = null;
var list = null;

var formdata = {};

var formats = {
  "alac": {
      "display_name": "ALAC (M4A, MP4)",
      "bitrate_strings": ["optimal (stereo ~130MB/h, mono ~65MB/h)"],
      "endings": ["m4a", "mp4"]
  },
  "aac": {
      "display_name": "AAC (M4A, MP4)",
      "bitrates": ["24", "32", "40", "48", "56", "64", "80", "96", "112", "128", "160", "192", "256"],
      "default_bitrate": "80",
      "bitrate_strings": ["24 kbps, HE AAC (~11MB/h)", "32 kbps, HE AAC (~14MB/h)", "40 kbps, HE AAC (~18MB/h)", "48 kbps, HE AAC (~21MB/h)", "56 kbps, HE AAC (~25MB/h)", "64 kbps, HE AAC (~28MB/h)", "80 kbps, HE AAC (~35MB/h)", "96 kbps, HE AAC (~42MB/h)", "112 kbps, HE AAC (~49MB/h)", "128 kbps (~56MB/h)", "160 kbps (~70MB/h)", "192 kbps (~84MB/h)", "256 kbps (~113MB/h)"],
      "endings": ["m4a", "mp4"]
  },
  "mp3-vbr": {
      "display_name": "MP3 Variable Bitrate",
      "bitrates": ["32", "40", "48", "64", "80", "96", "112", "128", "160", "192", "224"],
      "default_bitrate": "96",
      "bitrate_strings": ["~32 kbps (~14MB/h)", "~40 kbps (~18MB/h)", "~48 kbps (~21MB/h)", "~64 kbps (~28MB/h)", "~80 kbps (~35MB/h)", "~96 kbps (~42MB/h)", "~112 kbps (~49MB/h)", "~128 kbps (~56MB/h)", "~160 kbps (~70MB/h)", "~192 kbps (~84MB/h)", "~224 kbps (~98MB/h)"],
      "endings": ["mp3"]
  },
  "vorbis": {
      "display_name": "OGG Vorbis",
      "bitrates": ["32", "40", "48", "64", "80", "96", "112", "128", "160", "192", "224"],
      "default_bitrate": "96",
      "bitrate_strings": ["~32 kbps (~14MB/h)", "~40 kbps (~18MB/h)", "~48 kbps (~21MB/h)", "~64 kbps (~28MB/h)", "~80 kbps (~35MB/h)", "~96 kbps (~42MB/h)", "~112 kbps (~49MB/h)", "~128 kbps (~56MB/h)", "~160 kbps (~70MB/h)", "~192 kbps (~84MB/h)", "~224 kbps (~98MB/h)"],
      "endings": ["ogg", "oga"]
  },
  "mp3": {
      "display_name": "MP3",
      "bitrates": ["32", "40", "48", "64", "80", "96", "112", "128", "160", "192", "224"],
      "default_bitrate": "96",
      "bitrate_strings": ["~32 kbps (~14MB/h)", "~40 kbps (~18MB/h)", "~48 kbps (~21MB/h)", "~64 kbps (~28MB/h)", "~80 kbps (~35MB/h)", "~96 kbps (~42MB/h)", "~112 kbps (~49MB/h)", "~128 kbps (~56MB/h)", "~160 kbps (~70MB/h)", "~192 kbps (~84MB/h)", "~224 kbps (~98MB/h)"],
      "endings": ["mp3"]
  },
  "flac": {
      "display_name": "FLAC",
      "bitrate_strings": ["optimal (stereo ~125MB/h, mono ~62MB/h)"],
      "endings": ["flac"]
  }
};

Controller.define('/preset', function() {

  API.call('/preset').on({

    success: function(result) {
      list = [
          {
              "outgoing": {
                  "basename": "base",
                  "outgoing": [],
                  "audioformats": [
                      {
                          "format": "mp3",
                          "ending": "mp3",
                          "filename": "",
                          "bitrate": 96,
                          "slug": "test1",
                          "mono_mixdown": false
                      },
                      {
                          "format": "ogg",
                          "ending": "ogg",
                          "filename": "",
                          "bitrate": 80,
                          "slug": "test2",
                          "mono_mixdown": false
                      }
                  ]
              },
              "uuid": "YdzJfizitYMHEfvcW9DxWM",
              "image": "presets/YdzJfizitYMHEfvcW9DxWM/Firefox_wallpaper.png",
              "ts_created": "2012-04-30 14:02:38",
              "presetname": "Minimal Testpreset",
              "metadata": {
                  "album": "Some Album",
                  "comment": "Comments",
                  "license": "Creative Commons Attribution 3.0 Unported",
                  "lyrics": "Lyrics...",
                  "artist": "Some Artist",
                  "track": "Some Track",
                  "title": "Title",
                  "publisher": "Some Publisher",
                  "url": "http://auphonic.com/",
                  "license_url": "http://creativecommons.org/licenses/by/3.0/",
                  "year": "2012",
                  "genre": "Talk",
                  "append_chapters": false
              }
          }
      ];

      presets = {};
      list.each(function(preset) {
        presets[preset.uuid] = preset;
      });

      Views.get('Main').push('preset', new View.Object({
        title: 'Presets',
        content: UI.render('preset', {preset: list}),
        action: {
          title: 'New',
          url: '/preset/new'
        }
      }));
    }

  });

});

Controller.define('/preset/new', function(req) {

  var object;
  Views.get('Main').push('preset', object = new View.Object({
    title: 'New Preset',
    content: UI.render('preset-new'),
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

        data.metadata = formdata.metadata;
        Object.append(data, formdata.outgoings);

        // Expand flat structures to objects as specified by the API
        for (var key in data) {
          var parts = key.split('.');
          if (parts.length == 1) continue;

          if (!data[parts[0]]) data[parts[0]] = {};
          data[parts[0]][parts[1]] = data[key];
          delete data[key];
        }

        console.log(JSON.stringify(data));
      }
    },

    onShow: function() {
      if (formdata.format) {
        var container = object.toElement().getElement('ul.output_formats');
        var content = formdata.format;
        // Select-Values are Arrays but we only need the first and only value
        content.format = content.format[0];
        content.bitrate = content.bitrate[0];

        var item = formats[content.format];
        var index = (item.bitrates ? item.bitrates.indexOf(content.bitrate) : 0);

        Element.from(UI.render('ui-removable-list-item', {
          title: item.display_name.replace(/\((.+?)\)/, '').trim(), // Remove parenthesis
          detail: item.bitrate_strings[index].replace(/\((.+?)\)/, '').trim(), // Remove parenthesis,
          label: 'Remove'
        })).store('value', formdata.format).inject(container);
        delete formdata.format;
      }
    },

    onHide: function(direction) {
      if (direction == 'left') formdata = {};
    }
  }));

});

Controller.define('/preset/new/metadata', function(req) {

  Views.get('Main').push('preset', new View.Object({
    title: 'Enter Metadata',
    content: UI.render('preset-new-metadata'),
    action: {
      title: 'Done',
      url: '/preset/new',
      onClick: function() {
        formdata.metadata = Views.get('Main').getCurrentView().serialize();
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

Controller.define('/preset/new/format', function(req) {

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
  Views.get('Main').push('preset', object = new View.Object({
    title: 'Add Output Format',
    content: UI.render('preset-new-format', {
      format: list
    }),
    back: {
      title: 'Cancel'
    }
  }));

  var bitrateContainer = object.toElement().getElement('.bitrates').dispose();
  object.toElement().getElements('select.empty').addEvents({

    'change:once': function() {
      Views.get('Main').updateElement('action', {}, {
        title: 'Add',
        url: '/preset/new',
        onClick: function() {
          formdata.format = Views.get('Main').getCurrentView().serialize();
        }
      });
    },

    change: function() {
      var option = this.getSelected()[0];
      var value = option.get('value');
      var parent = this.getParent('ul');
      var item = bitrateContainer.getElement('[data-format=' + value + ']').clone();

      parent.getElements('> :not(li:first-child)').dispose();
      parent.adopt(item);

      Elements.from(UI.render('preset-new-format-detail')).inject(parent);

      UI.update(parent);
    }

  });

});

Controller.define('/preset/new/service', function(req) {

   var services = [
      {
          "display_name": "Georg Holzmann",
          "type": "dropbox",
          "uuid": "UC6aoChNZNt7KYZNxJTgUn",
          "email": "georg@myserver.at"
      },
      {
          "display_name": "ftp.myserver.at:21/mirror/",
          "path": "mirror/",
          "host": "ftp.myserver.at",
          "type": "ftp",
          "uuid": "r6MSycBwyeWFAJYqUKtGeX",
          "port": 21
      },
      {
          "display_name": "myserver.at:22/home/user/path/",
          "path": "/home/user/path",
          "host": "myserver.at",
          "type": "sftp",
          "uuid": "jm7yLuiyGwQe27gQUz869K",
          "port": 22
      }
  ];

  services.each(function(service) {
    var type = service.type;
    if (type == 'dropbox') type = type.charAt(0).toUpperCase() + type.slice(1);
    else type = service.type.toUpperCase();
    service.display_type = type;
  });

  Views.get('Main').push('preset', new View.Object({
    title: 'Outgoing Transfers',
    content: UI.render('preset-new-service', {
      service: services
    }),
    action: {
      title: 'Done',
      url: '/preset/new',
      onClick: function() {
        formdata.outgoings = Views.get('Main').getCurrentView().serialize();
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      this.unserialize(formdata.outgoings);
    }
  }));

});

Controller.define('/preset/new/save', function(req) {

  History.push('/preset');

});

Controller.define('/preset/{uuid}', function(req) {

  var preset = presets[req.uuid];
  Views.get('Main').push('preset', new View.Object({
    title: preset.presetname,
    content: UI.render('preset-detail', preset)
  }));

});

})();
