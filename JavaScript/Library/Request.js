var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

// Lightweight Request Class based on MooTools from @amadeus.
var Request = module.exports = new Class({

	Implements: [Options, Events],

	options: {
		method: 'get',
		url: window.location,
		headers: {
			'Accept': 'text/plain,text/html,application/xhtml+xml,application/xml',
			'X-Requested-With': 'XMLHttpRequest'
		}
	},

	initialize: function(options) {
		this.setOptions(options);

		this.xhr = new XMLHttpRequest();
		this.xhr.addEventListener('readystatechange', this.readyStateChange.bind(this), false);
	},

	send: function(data) {
		var method = this.options.method.toUpperCase();
		if (typeof data != 'string') data = Object.toQueryString(data);
		this.xhr.open(method, this.options.url, true);

		// Set Headers
		var headers = this.options.headers;
		if (['POST', 'PUT'].contains(method))
			this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');

		for (var header in headers)
			this.xhr.setRequestHeader(header, headers[header]);

		this.xhr.send(data);
	},

	readyStateChange: function() {
		if (this.xhr.readyState !== 4) return;

		if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 0) this.success();
		else this.failure();
		this.fireEvent('complete', this.responseText);
	},

	success: function() {
		this.fireEvent('success', this.xhr.responseText);
	},

	failure: function() {
		this.fireEvent('failure', this.xhr.responseText);
	}

});

Request.JSON = new Class({

	Extends: Request,

	options: {
		headers: {
			'Accept': 'application/json'
		}
	},

	response: null,

	readyStateChange: function() {
		if (this.xhr.readyState !== 4) return;

		this.response = Function.attempt((function() {
			return JSON.parse(this.xhr.responseText);
		}).bind(this)) || undefined;
		if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 0) this.success();
		else this.failure();
		this.fireEvent('complete', this.response);
	},

	success: function() {
		if (this.response === undefined)
			return this.fireEvent('failure', this.response);

		this.fireEvent('success', this.response);
	},

	failure: function() {
		this.fireEvent('failure', this.response);
	}

});
