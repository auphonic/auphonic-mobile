(function() {

var presets = null;
var list = null;

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
    }
  }));

});

Controller.define('/preset/new/metadata', function(req) {

  Views.get('Main').push('preset', new View.Object({
    title: 'Enter Metadata',
    content: UI.render('preset-new-metadata'),
    action: {
      title: 'Done',
      url: '/preset/new'
    },
    back: {
      title: 'Cancel'
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
