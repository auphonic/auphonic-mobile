var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

// Lightweight Request Class based on MooTools from @amadeus.
var Request = module.exports = new Class({

	Implements: [Options, Events, Class.Binds],

	options: {
		method: 'get',
		url: window.location,
		headers: {
			'Accept': 'text/plain,text/html,application/xhtml+xml,application/xml',
			'X-Requested-With': 'XMLHttpRequest'
		}
	},

	running: false,

	initialize: function(options) {
		this.setOptions(options);

		this.xhr = new XMLHttpRequest();
		this.xhr.addEventListener('readystatechange', this.bound('onReadyStateChange'), false);
	},

	send: function(data) {
		var method = this.options.method.toUpperCase();
		var url = this.options.url;

		if (typeof data != 'string') data = Object.toQueryString(data);
		if (data && method == 'GET') {
			url += (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		// Add a timestamp to prevent any sort of caching
		url += (url.contains('?') ? '&' : '?') + Date.now();

		this.xhr.open(method, url, true);

		// Set Headers
		var headers = this.options.headers;
		if (['POST', 'PUT'].contains(method) && !headers['Content-Type'])
			this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		for (var header in headers)
			this.xhr.setRequestHeader(header, headers[header]);

		this.running = true;
		this.xhr.send(data);
	},

	onReadyStateChange: function() {
		if (this.xhr.readyState !== 4) return;

		if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 0) this.success();
		else this.failure();
		this.fireEvent('complete', this.responseText);
		this.running = false;
	},

	success: function() {
		this.fireEvent('success', this.xhr.responseText);
	},

	failure: function() {
		this.fireEvent('failure', this.xhr.responseText);
	},

	cancel: function() {
		if (!this.running) return;
		this.xhr.abort();
		this.xhr.removeEventListener('readystatechange', this.bound('onReadyStateChange'), false);
		this.fireEvent('cancel');
	},

	isRunning: function() {
		return this.running;
	},

	getOption: function(property) {
		return this.options[property];
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

	onReadyStateChange: function() {
		if (this.xhr.readyState !== 4) return;

		this.response = Function.attempt((function() {
			return JSON.parse(this.xhr.responseText);
		}).bind(this)) || undefined;
		if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 0) this.success();
		else this.failure();
		this.running = false;
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
