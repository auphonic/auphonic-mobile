(function() {

API.on('/preset').addEvents({

  success: function(presets) {
    presets = [
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

    var template = Handlebars.compile(document.id('preset-template').get('html'));
    document.id('container').set('html', template({preset: presets}));
  }

});

Controller.define('/preset', function() {

  API.call('/preset');

});

})();
