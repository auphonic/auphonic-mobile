var Core = require('Core');
var Class = Core.Class;
var Options = Core.Options;
var Events = Core.Events;

var API = require('API');

var TextProgressIndicator = require('UI/TextProgressIndicator');

var Auphonic = require('Auphonic');

module.exports = new Class({

  Implements: [Options, Events, Class.Binds],

  options: {
    url: null,
    delay: 1000,
    /*onFinish: function() {}*/
  },

  stopped: false,

  initialize: function(element, options) {
    this.setOptions(options);

    this.element = document.id(element);

    this.progress = new TextProgressIndicator(this.element);
    this.progress.start();
  },

  stop: function() {
    this.stopped = true;
    clearTimeout(this.timer);
    this.progress.stop();
    return this;
  },

  check: function(production) {
    var url = this.options.url.substitute(production);
    API.invalidate(url); // prevent caching
    API.call(url).on({
      success: this.bound('update')
    });

    return this;
  },

  update: function(response) {
    // If the updater was stopped during a request, cancel it now
    if (this.stopped) {
      this.stopped = false;
      return;
    }

    var production = response.data;
    // change_allowed means processing has finished
    if (production.change_allowed) {
      this.fireEvent('finish', [production]);
      this.stop();
      return;
    }

    this.progress.updateText(Auphonic.StatusStrings[production.status]);
    this.timer = this.check.delay(this.options.delay, this, [production]);

    return this;
  }

});
