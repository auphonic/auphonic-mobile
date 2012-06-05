(function() {

var presets = null;
var list = null;

var formdata = {};

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

  Views.get('Main').push('preset', new View.Object({
    title: 'New Preset',
    content: UI.render('preset-new'),
    action: {
      title: 'Save',
      url: '/preset/new/save'
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

  Views.get('Main').push('preset', new View.Object({
    title: 'Add Output Format',
    content: UI.render('preset-new-format'),
    action: {
      title: 'Done',
      url: '/preset/new'
    },
    back: {
      title: 'Cancel'
    }
  }));

});

Controller.define('/preset/new/service', function(req) {

   var services = [
      {
          "display_name": "Dropbox - Georg Holzmann",
          "type": "dropbox",
          "uuid": "UC6aoChNZNt7KYZNxJTgUn",
          "email": "georg@myserver.at"
      },
      {
          "display_name": "FTP - ftp.myserver.at:21/mirror/",
          "path": "mirror/",
          "host": "ftp.myserver.at",
          "type": "ftp",
          "uuid": "r6MSycBwyeWFAJYqUKtGeX",
          "port": 21
      },
      {
          "display_name": "SFTP - myserver.at:22/home/user/path/",
          "path": "/home/user/path",
          "host": "myserver.at",
          "type": "sftp",
          "uuid": "jm7yLuiyGwQe27gQUz869K",
          "port": 22
      }
  ];

  Views.get('Main').push('preset', new View.Object({
    title: 'Outgoing Transfers',
    content: UI.render('preset-new-service', {
      service: services
    }),
    action: {
      title: 'Done',
      url: '/preset/new',
      onClick: function() {
        formdata.services = Views.get('Main').getCurrentView().serialize();
      }
    },
    back: {
      title: 'Cancel'
    },

    onShow: function() {
      this.unserialize(formdata.services);
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
