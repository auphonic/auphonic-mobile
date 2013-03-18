var Core = require('Core');
var Browser = Core.Browser;
var Element = Core.Element;

var Platform = require('Platform');

Browser.Device = {
	name: 'other'
};

if (Browser.Platform.ios){
	var device = navigator.userAgent.toLowerCase().match(/(ip(ad|od|hone))/)[0];

	Browser.Device[device] = true;
	Browser.Device.name = device;
}

Browser.Features.Touch = (function(){
	try {
		document.createEvent('TouchEvent').initTouchEvent('touchstart');
		return true;
	} catch (exception){}

	return false;
})();

if (Platform.isIOS()) (function(){

var disabled;

Element.defineCustomEvent('touch', {

	base: 'touchend',

	condition: function(event){
		if (disabled || event.targetTouches.length !== 0) return false;

		var touch = event.changedTouches[0],
			target = document.elementFromPoint(touch.clientX, touch.clientY);

		do {
			if (target == this) return true;
		} while (target && (target = target.parentNode));

		return false;
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
	}

});

})(); else (function(){

var disabled;
var moved = false;
var start = 0;
var events = {

	touchstart: function(event){
		if (event.touches.length > 1) return;
		moved = false;
		start = event.touches[0].pageY;
	},

	touchmove: function(event){
		if (disabled || moved) return;
		var end = event.changedTouches[0].pageY;
		if (Math.abs(start - end) > 10) moved = true;
	}
};

Element.defineCustomEvent('touch', {

	base: 'touchend',

	condition: function(event){
		return !(disabled || moved || event.targetTouches.length !== 0);
	},

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
	}

});

})();

if (Browser.Features.Touch) (function(){

var name = 'click';
delete Element.NativeEvents[name];

Element.defineCustomEvent(name, {

	base: 'touch'

});

})();

(function(){

var name = 'swipe',
	distanceKey = name + ':distance',
	cancelKey = name + ':cancelVertical',
	dflt = 50;

var start = {}, disabled, active;

var clean = function(){
	active = false;
};

var events = {

	touchstart: function(event){
		if (event.touches.length > 1) return;

		var touch = event.touches[0];
		active = true;
		start = {x: touch.pageX, y: touch.pageY};
	},

	touchmove: function(event){
		if (disabled || !active) return;

		var touch = event.changedTouches[0],
			end = {x: touch.pageX, y: touch.pageY};
		if (this.retrieve(cancelKey) && Math.abs(start.y - end.y) > 10){
			active = false;
			return;
		}

		var distance = this.retrieve(distanceKey, dflt),
			delta = end.x - start.x,
			isLeftSwipe = delta < -distance,
			isRightSwipe = delta > distance;

		if (!isRightSwipe && !isLeftSwipe)
			return;

		event.preventDefault();
		active = false;
		event.direction = (isLeftSwipe ? 'left' : 'right');
		event.start = start;
		event.end = end;

		this.fireEvent(name, event);
	},

	touchend: clean,
	touchcancel: clean

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
		clean();
	}

});

})();

(function(){

var name = 'touchhold',
	delayKey = name + ':delay',
	disabled, timer;

var clear = function(){
	clearTimeout(timer);
};

var events = {

	touchstart: function(event){
		if (event.touches.length > 1){
			clear();
			return;
		}

		timer = (function(){
			Element.disableCustomEvents();
			window.addEventListener('touchend', function() {
				(function() {
					Element.enableCustomEvents();
				}).delay(50);
			}, false);

			this.fireEvent(name, event);
		}).delay(this.retrieve(delayKey) || 750, this);
	},

	touchmove: clear,
	touchcancel: clear,
	touchend: clear

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
		clear();
	}

});

})();
