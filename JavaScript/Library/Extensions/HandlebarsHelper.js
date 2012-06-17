var Handlebars = require('ThirdParty/Handlebars');

Handlebars.registerHelper('format-url', function(url) {
  return new Handlebars.SafeString(url.replace(/https?\:\/\//, '').replace(/\/$/, ''));
});
