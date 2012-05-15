(function() {

var productions = null;
var list = null;

Controller.define('/production', function() {

  API.call('/production').on({

    success: function(result) {
      list = getList();

      productions = {};
      list.each(function(production) {
        productions[production.uuid] = production;
      });

      Views.get('Main').push('production', new View.Object({
        title: 'Productions',
        content: UI.render('production', {production: list}),
        action: {
          title: 'New',
          url: '/production/new'
        }
      }));
    }

  });

});

Controller.define('/production/new', function() {

  Views.get('Main').push('production', new View.Object({
    title: 'New Production',
    content: 'Hello!'
  }));

});

Controller.define('/production/{uuid}', function(req) {

  var production = productions[req.uuid];
  Views.get('Main').push('production', new View.Object({
    title: production.metadata.title,
    content: UI.render('production-detail', production),
    action: {
      title: 'Edit',
      url: '/production/edit/' + production.uuid
    }
  }));

});

Controller.define('/production/edit/{uuid}', function(req) {

  var production = productions[req.uuid];
  Views.get('Main').push('production', new View.Object({
    title: production.metadata.title,
    content: 'Test'
  }));

});

// This is only temporary
var getList = function() {
  return [
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "o7FhVjwhrR4bXWkCSbB3M3",
        "image": "",
        "ts_upload_start": "2012-05-07 12:40:54",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "AR",
            "track": "d",
            "title": "API Test Title 5",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                },
                {
                    "ending": "m4a",
                    "bitrate": 96,
                    "format": "aac"
                }
            ]
        },
        "uuid": "3vaprXt6kfzqHKojMhKfxK",
        "image": "presets/3vaprXt6kfzqHKojMhKfxK/Firefox_wallpaper.png",
        "ts_upload_start": "2012-05-07 10:21:03",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title 4",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "o62SX93ySUgZBvjRUn23HU",
        "image": "presets/o62SX93ySUgZBvjRUn23HU/Firefox_wallpaper.png",
        "ts_upload_start": "2012-05-07 10:20:43",
        "filename": "",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "a",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "4p3sR8FJEEEoHehUFqpQM3",
        "image": "",
        "ts_upload_start": "2012-05-07 10:19:47",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title 3",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "qaZ2VY2Eeyimsjm6nXPmuN",
        "image": "",
        "ts_upload_start": "2012-05-07 10:19:32",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title 2",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "qz44Usf7kwfeCzBWBMFAhd",
        "image": "",
        "ts_upload_start": "2012-05-06 22:16:45",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title 2",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "enuyaNSppciMuBXkjrqDag",
        "image": "",
        "ts_upload_start": "2012-05-06 22:15:14",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title 2",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "CcKtZEjqAHW7HNzpzmQWsg",
        "image": "",
        "ts_upload_start": "2012-05-06 22:13:39",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title 1",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "YJWddPPnA34Kj34GD83ZMK",
        "image": "",
        "ts_upload_start": "2012-05-06 22:13:10",
        "filename": "",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "a",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "J6EpeYkwyhXaKD5cb5YVv6",
        "image": "",
        "ts_upload_start": "2012-05-06 22:00:00",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "YtdMNmakBEnYqXtAiqTkGU",
        "image": "",
        "ts_upload_start": "2012-05-06 17:48:40",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "xuUpew7LKDNdHQkxkiuaHR",
        "image": "",
        "ts_upload_start": "2012-05-06 14:42:25",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "API Test Title",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "KXy8T6LUkbt8CHugRV92pA",
        "image": "",
        "ts_upload_start": "2012-05-06 13:34:54",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "cxpPeR6DgvnLRJBAyL36ND",
        "image": "",
        "ts_upload_start": "2012-05-06 13:34:11",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "ScShmrpiXMLpLhRQoyVg2L",
        "image": "",
        "ts_upload_start": "2012-05-06 12:59:26",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "WBLZxq9RjzeRAFxsbe4s8c",
        "image": "",
        "ts_upload_start": "2012-05-06 12:32:03",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "a",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "gBRgnJCk4pQ6zGGzEARGye",
        "image": "",
        "ts_upload_start": "2012-05-06 12:31:29",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "a",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "MMqaKTho2vwkTpsAaaXZG6",
        "image": "",
        "ts_upload_start": "2012-05-06 12:17:37",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "mx8frkfJX74YThF4QYeHpd",
        "image": "",
        "ts_upload_start": "2012-05-06 12:11:33",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "KNmHQwDsSCuVVXF7wYV67e",
        "image": "",
        "ts_upload_start": "2012-05-06 00:19:19",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "74MnMahN4Jt9AKgEKepTYA",
        "image": "",
        "ts_upload_start": "2012-05-06 00:18:36",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "DmpQbFQmgx9XkxtsYosPjj",
        "image": "",
        "ts_upload_start": "2012-05-06 00:17:53",
        "filename": "",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "a",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "Test",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 64,
                    "format": "mp3"
                },
                {
                    "ending": "oga",
                    "bitrate": 96,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "Enoa6ShjBRvo3quQRR8A38",
        "image": "",
        "ts_upload_start": "2012-05-06 00:09:08",
        "filename": "",
        "metadata": {
            "album": "c",
            "comment": "e",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "h",
            "artist": "b",
            "track": "d",
            "title": "a",
            "publisher": "i",
            "url": "http://auphonic.com/",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 96,
                    "format": "mp3"
                }
            ]
        },
        "uuid": "GPtEi4ZJCHdHYgSrYesJRF",
        "image": "",
        "ts_upload_start": "2012-05-05 23:08:20",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "KRNqrKbTLzamLnNdMUJVeP",
        "image": "",
        "ts_upload_start": "2012-05-05 23:06:32",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "96cZ3ikeoMaEQypVKu8G7D",
        "image": "",
        "ts_upload_start": "2012-05-05 23:01:00",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "TsSacDRNmkeVYzUqFn9wpW",
        "image": "",
        "ts_upload_start": "2012-05-05 23:00:26",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "rSECQhcT7x6w2o5AN5GGjf",
        "image": "",
        "ts_upload_start": "2012-05-05 22:57:11",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "3MUVcJwKNsKhXFpzWLoBRa",
        "image": "",
        "ts_upload_start": "2012-05-05 22:56:50",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "QqFMLG97DoyqVhGDULk9sn",
        "image": "",
        "ts_upload_start": "2012-05-05 22:56:00",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "6xmMGArPSoieeTuquz6F3k",
        "image": "",
        "ts_upload_start": "2012-05-05 22:13:53",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "Ld6ADNGfRD2EJB6aFHNSAH",
        "image": "",
        "ts_upload_start": "2012-05-05 22:11:24",
        "filename": "",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API Test Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 96,
                    "format": "mp3"
                }
            ]
        },
        "uuid": "H2Hkr2EZGZ8PbDTgnJwjVm",
        "image": "",
        "ts_upload_start": "2012-05-03 19:53:34",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "Title",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 96,
                    "format": "mp3"
                }
            ]
        },
        "uuid": "SE9HHTviCkhGw8MyZUwTE3",
        "image": "",
        "ts_upload_start": "2012-05-03 19:52:17",
        "filename": "bbc4.mp3",
        "metadata": {
            "album": "",
            "comment": "",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "Test Damaged Chapter File",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "2012",
            "genre": "Podcast",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "4iMEcFxsQTKraxNSNSSdha",
        "image": "",
        "ts_upload_start": "2012-05-03 10:32:58",
        "filename": "",
        "metadata": {
            "album": "Some Album",
            "comment": "trying the api",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "K73pX44K42PkkzxB4rungS",
        "image": "",
        "ts_upload_start": "2012-05-03 10:22:28",
        "filename": "",
        "metadata": {
            "album": "Some Album",
            "comment": "trying the api",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "DhtNuQZiYaHd8QsEp34Q3Q",
        "image": "",
        "ts_upload_start": "2012-05-03 10:14:42",
        "filename": "",
        "metadata": {
            "album": "Some Album",
            "comment": "trying the api",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "ynajUsSAF4ChTmQpmpUSkF",
        "image": "",
        "ts_upload_start": "2012-05-03 09:24:58",
        "filename": "",
        "metadata": {
            "album": "Some Album",
            "comment": "trying the api",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "",
            "outgoing": [],
            "audioformats": []
        },
        "uuid": "kiJ5EzVk3yYxwdRG5MiDqQ",
        "image": "",
        "ts_upload_start": "2012-05-03 08:52:44",
        "filename": "",
        "metadata": {
            "album": "Some Album",
            "comment": "trying the api",
            "license": "",
            "lyrics": "",
            "artist": "",
            "track": "",
            "title": "API",
            "publisher": "",
            "url": "",
            "license_url": "",
            "year": "",
            "genre": "",
            "append_chapters": false
        }
    },
    {
        "outgoing": {
            "basename": "base",
            "outgoing": [],
            "audioformats": [
                {
                    "ending": "mp3",
                    "bitrate": 96,
                    "format": "mp3"
                },
                {
                    "ending": "ogg",
                    "bitrate": 80,
                    "format": "ogg"
                }
            ]
        },
        "uuid": "G5jCm6bFXZtfoE5GQ2fBaT",
        "image": "/home/andre/auphonic/auphonic-web/auphonic/../auphonic/../media/audio-upload/G5jCm6bFXZtfoE5GQ2fBaT/Firefox_wallpaper.png",
        "ts_upload_start": "2012-05-01 22:21:44",
        "filename": "",
        "metadata": {
            "album": "Some Album",
            "comment": "Comments",
            "license": "Creative Commons Attribution 3.0 Unported",
            "lyrics": "Lyrics...",
            "artist": "Some Artist",
            "track": "Some Track",
            "title": "Title",
            "publisher": "Some Publisher",
            "url": "",
            "license_url": "http://creativecommons.org/licenses/by/3.0/",
            "year": "2012",
            "genre": "Talk",
            "append_chapters": false
        }
    }
  ];
};

})();
