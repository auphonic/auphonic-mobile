var Core = require('Core');
var Events = Core.Events;
var Element = Core.Element;
var History = require('History');

var API = require('API');
var View = require('View');
var Notice = require('UI/Notice');

var CurrentUpload = require('Store/CurrentUpload');
var Recording = require('Store/Recording');

var Auphonic = require('Auphonic');

module.exports = function(recording, options) {
  var isRecording = (options && 'isRecording' in options) ? options.isRecording : true;
  var redirect = (options && 'redirect' in options) ? options.redirect : true;
  var editUUID = options && options.editUUID;
  var events = new Events;
  API.invalidate('productions');

  if (redirect) View.getMain().showIndicator();

  var onCreateSuccess = function(response) {
    var uuid = response.data.uuid;
    if (isRecording) Recording.addProduction(recording.id, uuid);

    var transfer = API.upload('production/{uuid}/upload'.substitute(response.data), recording, 'input_file').on({

      success: function(uploadResponse) {
        new Notice([
          new Element('span', {text: recording.display_name + ' was successfully uploaded and attached to your production.'})
        ]);
        CurrentUpload.remove(uuid);
        View.getMain().getStack().notifyAll('refresh', [uploadResponse.data]);
      },

      error: function() {
        var element;
        if (isRecording) element = new Element('span', {text: '. You can find your recording in the "Recordings" tab and you can try uploading it again later.'});
        else element = new Element('span', {text: '. Please try again later.'});

        new Notice([
          new Element('span', {text: 'There was an error uploading ' + recording.display_name}),
          element
        ]);

        CurrentUpload.remove(uuid);

        View.getMain().getStack().notifyAll('uploadProgress', [{
          uuid: uuid,
          hasError: true
        }]);
      },

      progress: function(event) {
        // Bound this between 0 and 100 just to make sure to never have a crazy percentage here :)
        var percentage = Math.max(0, Math.min(100, Math.round(event.loaded / event.total * 100)));

        View.getMain().getStack().notifyAll('uploadProgress', [{
          uuid: uuid,
          percentage: percentage
        }]);
      }

    });

    CurrentUpload.add(uuid, {
      transfer: transfer,
      file: recording
    });

    if (redirect) {
      var url = '/production/edit/{uuid}'.substitute(response.data);
      var object = View.getMain().getStack().getByURL(url);
      if (object) object.invalidate();
      History.push(url);
    }

    events.fireEvent('start', [response]);
  };

  // Either create a new production or overwrite the chapters
  var url = 'productions';
  if (editUUID) url = 'production/{uuid}'.substitute({uuid: editUUID});

  var output_files = [Auphonic.DefaultOutputFile];
  if (recording.media_type == 'video') output_files.push(Auphonic.DefaultVideoOutputFile);

  // Try to create a meaningfull file basename
  var basename = recording.display_name.replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-_]/g, '');
  var data = {
    metadata: {title: recording.display_name},
    output_basename: basename,
    output_files: output_files,
    algorithms: {denoise: true},
    chapters: recording.chapters
  };

  API.call(url, 'post', JSON.stringify(data)).on({
    success: onCreateSuccess
  });

  return events;
};
