var Handlebars = require('Handlebars');

module.exports = function(name, data) {
  return Handlebars.templates[name](data);
};
