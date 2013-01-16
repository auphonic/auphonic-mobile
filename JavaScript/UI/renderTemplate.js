var Handlebars = require('Handlebars');

module.exports = function(name, data) {
  if (!data) data = '';
  return Handlebars.templates[name](typeof data == 'string' ? {content: data} : data);
};
