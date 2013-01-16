/*
---

name: Class.Binds

description: A clean Class.Binds Implementation

authors: Scott Kyle (@appden), Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class, Core/Function]

provides: Class.Binds

...
*/

var Core = require('Core');
var Class = Core.Class;

Class.Binds = new Class({

	$bound: {},

	bound: function(name){
		return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
	}

});


/*
---

name: Class.Instantiate

description: Simple Wrapper for Mass-Class-Instantiation

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class]

provides: Class.Instantiate

...
*/

var Core = require('Core');
var Class = Core.Class;

Class.Instantiate = function(klass, options){
	var create = function(object){
		if (object.getInstanceOf && object.getInstanceOf(klass)) return;
		new klass(object, options);
	};

	return function(objects){
		objects.each(create);
	};
};


/*
---

name: Class.Singleton

description: Beautiful Singleton Implementation that is per-context or per-object/element

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class]

provides: Class.Singleton

...
*/

var Core = require('Core');
var Class = Core.Class;
var Element = Core.Element;

var storage = {

	storage: {},

	store: function(key, value){
		this.storage[key] = value;
	},

	retrieve: function(key){
		return this.storage[key] || null;
	}

};

Class.Singleton = function(){
	this.$className = String.uniqueID();
};

Class.Singleton.prototype.check = function(item){
	if (!item) item = storage;

	var instance = item.retrieve('single:' + this.$className);
	if (!instance) item.store('single:' + this.$className, this);

	return instance;
};

var gIO = function(klass){

	var name = klass.prototype.$className;

	return name ? this.retrieve('single:' + name) : null;

};

if (Element && Element.implement) Element.implement({getInstanceOf: gIO});

Class.getInstanceOf = gIO.bind(storage);


/*
---

name: Class.Properties

description: Provides getters/setters sugar for your class properties.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class, Core/String]

provides: Class.Properties

...
*/

var Core = require('Core');
var Class = Core.Class;

var setter = function(name){
	return function(value){
		this[name] = value;
		return this;
	};
};

var getter = function(name){
	return function(){
		return this[name] !== undefined ? this[name] : null;
	};
};

Class.Mutators.Properties = function(properties){
	this.implement(properties);

	for (var prop in properties){
		var name = prop.replace(/^_+/, '').capitalize().camelCase();
		this.implement('set' + name, setter(prop));
		this.implement('get' + name, getter(prop));
	}
};

