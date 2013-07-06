var API = require('API');
var UI = require('UI');
var View = require('View');

var User = require('Store/User');

var Auphonic = require('Auphonic');

exports.setup = function() {
  API.setLogHandler(function(data) {
    if (!User.isAuthenticated() || window.__DEV__) return null;

    // We don't want an error in this block to cause cancel the logging
    // or in the worst case end in an infinite loop because of window.onerror
    try {
      var device = window.device;
      data.platform = Platform.get();
      data.os_version = (device && device.version) || Browser.version;
      data.device = ((device && device.name) || '').toLowerCase();
      data.hardware = (device && device.model);
      data.version = Auphonic.Version;

      var stack = View.getMain().getStack();
      data.stackName = stack.getName();
      data.stackItems = stack.map(function(object) {
        return {
          title: object.getTitle(),
          url: object.getURL(),
          i: object.isInvalid(),
          s: object.toElement() ? object.serialize() : null
        };
      });
    } catch(e) {}

    return data;
  });

  window.onerror = function(msg, url, line) {
    // Just in case…
    UI.enable();
    View.getMain().hideIndicator();

    var stack;
    try {
      throw new Error;
    } catch(e) {
      stack = e.stack;
    }

    API.log({
      type: 'js-error',
      message: msg,
      url: url,
      line: line,
      stack: stack // Praying that this is set.
    });

    return false;
  };

  var notice;
  var previousMessage;
  var errorHandler = function(event, data) {
    View.getMain().hideIndicator();
    UI.unhighlight(UI.getHighlightedElement());
    if (event.isPrevented()) return;

    var message = new Element('div');
    if (data && data.status_code) message.adopt([
      new Element('h1', {text: 'An error occurred'}),
      new Element('span', {text: 'Please try again or '}),
      new Element('a', {href: Auphonic.IssuesURL, text: 'report a bug'}),
      new Element('span', {text: ' so we can fix this as soon as possible.'})
    ]); else message.adopt([
      new Element('h1', {text: 'A network error occurred'}),
      new Element('span', {text: 'Please put your device in an elevated position to regain Internet access. If the problem lies on our end we\'ll make sure to fix the problem quickly :)'})
    ]);

    // If the last notice with the same text is still visible we'll not show another one.
    if (notice && notice.isOpen() && previousMessage == message.get('text')) {
      notice.push();
      return;
    }

    previousMessage = message.get('text');
    notice = new Notice(message, {type: 'error'});
  };

  API.setTimeoutHandler(errorHandler);
  API.setErrorHandler(errorHandler);

};
