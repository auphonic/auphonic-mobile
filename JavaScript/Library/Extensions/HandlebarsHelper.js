var Handlebars = require('ThirdParty/Handlebars');

Handlebars.registerHelper('eachInObject', function(obj, fn) {
  var buffer = '';

  for (var key in obj) if (obj.hasOwnProperty(key)) {
    buffer += fn({key: key, value: obj[key]});
  }

  return buffer;
});

Handlebars.registerHelper('format-url', function(url) {
  return new Handlebars.SafeString(url.replace(/https?\:\/\//, '').replace(/\/$/, ''));
});
