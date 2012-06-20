var Core = require('Core');
var Browser = Core.Browser;

var EventStack = require('EventStack');

module.exports = new EventStack.OuterClick({
  event: Browser.Features.Touch ? 'touchstart' : 'click'
});
