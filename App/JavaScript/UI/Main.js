(function() {

this.UI = {
  
  lock: function() {
    document.body.addClass('lock');
  },
  
  unlock: function() {
    document.body.removeClass('lock');
  }
  
};

})();
