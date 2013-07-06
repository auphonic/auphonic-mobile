var History = require('History');

var Controller = require('./');
var View = require('View');
var renderTemplate = require('UI/renderTemplate');
var UI = require('UI');

var User = require('Store/User');

var object;
Controller.define('/requires-authentication/:path*:', function(req) {
  var obj = new View.Object({
    title: 'Login Required',
    content: renderTemplate('requires-authentication', {
      path: req[0]
    })
  });

  var main = View.getMain();
  if (main.getCurrentObject() == object) main.replace(obj);
  else main.pushOn('requires-authentication', obj);
  object = obj;
});

module.exports = function(fn) {
  return function(req) {
    if (User.isAuthenticated()) fn(req);
    else History.push('/requires-authentication' + History.getPath());
  };
};
