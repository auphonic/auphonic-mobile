(function(){

var prefix = '-webkit-',
	key = prefix.replace(/-/g, ''),
	transition = key ? key + 'Transition' : 'transition',
	setStyleProperty = function(event){
		event.styleProperty = event.event.propertyName.replace(prefix, '');
		return true;
	};

Element.NativeEvents[transition + 'Start'] = 2;
Element.NativeEvents[transition + 'End'] = 2;

Element.defineCustomEvent('transitionStart', {
	base: transition + 'Start',
	condition: setStyleProperty
}).defineCustomEvent('transitionComplete', {
	base: transition + 'End',
	condition: setStyleProperty
}).defineCustomEvent('transformComplete', {

	base: transition + 'End',

	condition: function(event){
		setStyleProperty(event);
		return (event.styleProperty == 'transform');
	}

});

Element.implement('transition', function(options, fn) {
	var isImmediate = options && options.immediate;

	if (isImmediate) this.addClass('immediate');

	(function() {
		if (isImmediate) {
			this.removeClass('immediate');
			if (fn) fn.call(this);
			return;
		}

		if (fn) this.addEvent('transitionComplete:once', fn);
	}).delay(10, this);

	return this;
});

})();
