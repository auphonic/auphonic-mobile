(function() {

var preventDefault = function(event) {
  event.preventDefault();
};

this.UI = {

  lock: function() {
    document.body.addClass('lock');
    window.addEvent('touchmove', preventDefault);
  },

  unlock: function() {
    document.body.removeClass('lock');
    window.removeEvent('touchmove', preventDefault);
  }

};

})();
