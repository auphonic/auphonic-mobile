var Core = require('Core');
var Slick = Core.Slick;

Slick.definePseudo('internal', function(){
	return (this.hostname == location.hostname);
});

Slick.definePseudo('input', function(){
  var tag = this.tagName.toLowerCase();
  return (tag == 'input' || tag == 'textarea' || tag == 'select');
});
