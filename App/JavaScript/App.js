(function() {

var boot = function() {

  window.scrollTo(0, 1);
  (new ActiveState()).attach();

  var isLoggedIn = false;
  // Browser bug: prevent this from firing twice in Chrome
  if (!isLoggedIn) setTimeout(function() {
    History.push('login');
  }, 100);

  // TODO make this work with updates
  document.getElements('a:internal').addEvent('click', function(event) {
    event.preventDefault();

    History.push(this.get('href'));
  });
};

var fired;
var ready = function(){
  if (fired) return;
  fired = true;

  boot();
};


document.addEventListener('deviceready', ready, false);
window.addEventListener('DOMContentLoaded', ready, false);

})();
