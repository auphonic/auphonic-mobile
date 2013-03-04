var path = require('path');
var projectPath = path.resolve(__dirname, '../');

var resolve = function(p) {
  return path.resolve(projectPath, p);
};

exports.JS = resolve('JavaScript');
exports.STYL = resolve('STYL');
exports.STYL_Server = path.resolve(exports.STYL, 'App.styl');
exports.STYL_Client = path.resolve(exports.STYL, 'App/App.styl');
exports.AndroidClient = resolve('Android/assets/App');
exports.App = resolve('App');
exports.Templates = resolve('Templates');
exports.TemplatesFile = path.resolve(exports.JS, 'Templates.js');
exports.StylusOptions = {
  paths: resolve('Images'),
  limit: false
};

exports.Cordova = '2.5.0';
exports.Server = path.resolve(resolve('Server/'), exports.Cordova);
exports.VersionFile = path.resolve(exports.Server, 'Version.js');
exports.ServerCSSFile = 'App-{hash}.css';
exports.ServerJSFile = 'App-{hash}.js';
exports.ServerJSOptions = {
  main: 'App',
  environment: 'dev',
  paths: [
    exports.JS,
    path.resolve(exports.JS, 'Library')
  ]
};
exports.ServerJSProductionOptions = JSON.parse(JSON.stringify(exports.ServerJSOptions)); // Cheap man's clone
exports.ServerJSProductionOptions.environment = 'prod';
exports.ServerJSProductionOptions.minify = true;
exports.ServerJSProductionOptions.minifyIdentifiers = true;
