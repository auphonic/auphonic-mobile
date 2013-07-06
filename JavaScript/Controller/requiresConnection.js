var History = require('History');

var Controller = require('./');
var View = require('View');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');

var object;
Controller.define('/requires-connection/:path*:', function(req) {
  var onOnline = function() {
    obj.toElement().getElement('ul').show();
  };

  var obj = new View.Object({
    title: 'Offline',
    content: renderTemplate('requires-connection', {
      path: req[0]
    }),
    onShow: function() {
      obj.toElement().getElement('ul li a').addEvent('click', function() {
        (function() {
          UI.unhighlight(UI.getHighlightedElement());
        }).delay(250);
      });
      window.addEventListener('online', onOnline, false);
      document.addEventListener('online', onOnline, false);
    },
    onHide: function() {
      window.removeEventListener('online', onOnline, false);
      document.removeEventListener('online', onOnline, false);
    }
  });

  var main = View.getMain();
  if (main.getCurrentObject() == object) main.replace(obj);
  else main.pushOn('requires-connection', obj);
  object = obj;
});

module.exports = function(fn) {
  return function(req) {
    if (navigator.onLine) fn(req);
    else History.push('/requires-connection' + History.getPath());
  };
};
