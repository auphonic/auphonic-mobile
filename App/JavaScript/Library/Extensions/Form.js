(function(){

this.Form = new Class({

	Implements: [Class.Singleton, Class.Binds],

	initialize: function(element, action){
		this.element = element = document.id(element);
    this.action = action;

		return this.check(element) || this.setup();
	},

	setup: function(){
    this.element.addEvent('submit', this.bound('submit'));
    this.element.getElements('a.button, input[type=submit]').addEvent('click', this.bound('submit'));

		return this;
	},

	submit: function(event) {
    if (event) event.preventDefault();

    if (document.activeElement) document.activeElement.blur();
    API.call(this.action, [this.element.toQueryString()]);
  }

});

})();
