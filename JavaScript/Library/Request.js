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
		timeout: 0,
		headers: {
			'Accept': 'text/plain,text/html,application/xhtml+xml,application/xml'
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
		if (this.options.timeout)
			this.timer = this.timeoutTimer.delay(this.options.timeout, this);

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
		this.fireEvent('complete', this.responseText, 1);
		this.end();
	},

	success: function() {
		this.fireEvent('success', this.xhr.responseText, 1);
	},

	failure: function() {
		this.fireEvent('failure', this.xhr.responseText, 1);
	},

	end: function() {
		if (!this.running) return;
		this.running = false;
		clearTimeout(this.timer);
	},

	cancel: function() {
		if (!this.running) return;
		this.end();
		this.xhr.abort();
		this.xhr.removeEventListener('readystatechange', this.bound('onReadyStateChange'), false);
		this.fireEvent('cancel', 1);
	},

	timeoutTimer: function() {
		this.cancel();
		this.fireEvent('timeout', 1);
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
		var xhr = this.xhr;
		if (xhr.readyState !== 4) return;

		this.response = Function.attempt(function() {
			return JSON.parse(xhr.responseText);
		});
		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) this.success();
		else this.failure();
		this.fireEvent('complete', this.response, 1);
		this.end();
	},

	success: function() {
		if (this.xhr.responseText && this.response === null)
			return this.fireEvent('failure', this.response, 1);

		this.fireEvent('success', this.response, 1);
	},

	failure: function() {
		this.fireEvent('failure', this.response, 1);
	}

});
