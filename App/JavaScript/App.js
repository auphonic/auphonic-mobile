(function() {

var router = new Router();

router.add('/login', Controller.lookup('login'));

var baseURL = '/Thesis/App/';
var baseRegex = /^\/Thesis\/App\//;
History.addEvent('change', function(url) {
  if (baseRegex.test(url)) url = url.substr(baseURL.length);
  if (!(/^\//).test(url)) url = '/' + url;

  console.log('going to', url);
  router.parse(url);
});

var boot = function() {

  window.scrollTo(0, 1);
  (new ActiveState()).attach();

  var isLoggedIn = false;
  // Browser bug: prevent this from firing twice in Chrome
  if (!isLoggedIn) setTimeout(function() {
    History.push('login');
  }, 100);

  var counter = 0;
  var isRecording = false;
  var button = document.id('record');
  var play = document.id('play');
  var timer, media, fs;

  var success = function() {
    play.style.display = 'block';
    console.log('success');
  };

  var error = function() {
    alert('error');
  };

  var updateTime = function() {
    document.id('counter').innerText = (++counter) + ' seconds';
  };

  var successFolderCreation = function(folder) {
    var file = folder.getFile('recording.mp3', {create: true, exclusive: true});

    media = new Media(file, success, error);

    if (isRecording) {
      record.innerText = 'record';
      media.stopRecord();
      isRecording = false;
      clearInterval(timer);
      document.id('counter').innerText = '';
      return;
    }

    counter = 0;
    media.startRecord();
    isRecording = true;
    record.innerText = 'stop';

    timer = setInterval(updateTime, 1000);
  };

  var fn = function(fileSystem) {
    fs = fileSystem;
    fs.root.getDirectory('media', {create: true}, successFolderCreation);
  };

  play.addEventListener('click', function(event) {
    event.preventDefault();
    media.play();
  }, false);

  button.addEventListener('click', function(event) {
    event.preventDefault();

    if (fs) fn(fs);
    else window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fn, null);
  }, false);
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
