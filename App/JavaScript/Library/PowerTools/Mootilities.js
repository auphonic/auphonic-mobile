/*
---

name: Accessor

description: Adds define/lookup for anything on your objects. Backport of a 2.0 component.

authors: Valerio Proietti (@kamicane)

license: MIT-style license.

requires: [Core/Object]

provides: Accessor

...
*/

(function(){

this.Accessor = function(singular, plural){
	if (!singular) singular = '';
	if (!plural) plural = singular + 's';

	var accessor = {}, matchers = [],
		define = 'define', lookup = 'lookup', match = 'match', each = 'each';

	this[define + singular] = function(key, value){
		if (typeOf(key) == 'regexp') matchers.push({regexp: key, value: value, type: typeOf(value)});
		else accessor[key] = value;
		return this;
	};

	this[define + plural] = function(object){
		for (var key in object) accessor[key] = object[key];
		return this;
	};

	var lookupSingular = this[lookup + singular] = function(key){
		if (accessor.hasOwnProperty(key)) return accessor[key];
		for (var l = matchers.length; l--; l){
			var matcher = matchers[l], matched = key.match(matcher.regexp);
			if (matched && (matched = matched.slice(1))){
				if (matcher.type == 'function') return function(){
					return matcher.value.apply(this, Array.from(arguments).concat(matched));
				}; else return matcher.value;
			}
		}
		return null;
	};

	this[lookup + plural] = function(){
		var results = {};
		for (var i = 0; i < arguments.length; i++){
			var argument = arguments[i];
			results[argument] = lookupSingular(argument);
		}
		return results;
	};

	this[each + singular] = function(fn, bind){
		Object.forEach(accessor, fn, bind);
	};

};

})();

