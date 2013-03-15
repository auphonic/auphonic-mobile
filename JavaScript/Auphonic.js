var Platform = require('Platform');

exports.Version = '1.1.0';
exports.APIURL = 'https://auphonic.com/';
exports.FeedbackURL = 'mailto:mobile@auphonic.com?subject=Auphonic%20Mobile%20App%20Feedback';
exports.RepositoryURL = 'https://github.com/auphonic/auphonic-mobile';
exports.IssuesURL = 'https://github.com/auphonic/auphonic-mobile/issues';
exports.RegisterURL = 'https://auphonic.com/accounts/register/';
exports.ExternalServicesURL = 'https://auphonic.com/engine/services/';
exports.TeamImage = 'https://auphonic.com/media/pics/AuphonicTeam1_small.jpg';
exports.AuphonicVideoURL = 'https://www.youtube.com/watch?v=Y6uXP-MGt8I';
exports.AudioExamplesURL = 'https://auphonic.com/audio_examples';
exports.TwitterURL = 'https://twitter.com/auphonic';
exports.FacebookURL = 'https://www.facebook.com/pages/auphonic/217115551651035';
exports.FlattrURL = 'https://flattr.com/thing/1035105/Auphonic-Mobile-App';
exports.DonateURL = 'https://auphonic.com/donate';
exports.DefaultFileName = 'mobile-recording-{uuid}';
exports.DefaultVideoFileName = 'mobile-video-{uuid}';
exports.DefaultFileNameFilter = /mobile-(?:video|recording)-(\d+)/i;
exports.FolderName = 'Auphonic';

exports.DefaultAudioFormat = Platform.isIOS() ? 'm4a' : 'ogg';
exports.DefaultOutputFile = {
  format: 'mp3',
  bitrate: '112'
};

exports.DefaultVideoOutputFile = {
  format: 'video'
};

exports.SpinnerOptions = {
  lines: 25,
  length: 0,
  width: 4,
  radius: 30,
  trail: 30,
  color: Platform.isIOS() ? '#fff' : '#000'
};

exports.ViewSpinnerOptions = {
  lines: 25,
  length: 0,
  width: 4,
  radius: 30,
  trail: 30,
  color: '#000'
};

exports.ViewSpinnerOptionsSmall = {
  lines: 9,
  length: 0,
  width: 3,
  radius: 6,
  trail: 30,
  color: '#000',
  className: 'spinner-inline-bottom'
};

exports.PlayerSpinnerOptions = {
  lines: 9,
  length: 0,
  width: 3,
  radius: 6,
  trail: 30,
  color: '#000'
};

var statusStrings = {
  '0': 'Upload',
  '1': 'Waiting',
  '2': 'Error',
  '3': 'Done',
  '4': 'Processing',
  '5': 'Encoding',
  '6': 'Transferring',
  '7': 'Encoding',
  '8': 'Splitting',
  '9': 'Incomplete',
  '10': 'Not Started',
  '11': 'Outdated',
  '12': 'Incoming',
  '13': 'Stopping'
};

exports.AlgorithmFilters = ['loudnesstarget', 'denoiseamount'];
exports.AlgorithmDisplayFilter = /^.*?(db|lufs)/i;
exports.getAlgorithmShortString = function(algorithm) {
  return (algorithm.key == 'denoiseamount') ? 'Reduction Amount' : algorithm.display_name;
};
exports.AlgorithmOrder = {
  "denoise": "01",
  "denoiseamount": "02",
  "leveler": "03",
  "normloudness": "04",
  "loudnesstarget": "05",
  "hipfilter": "06"
};

exports.ErrorStatus = 2;

exports.getStatusString = function(type) {
  return statusStrings[type] || 'Processing';
};

exports.EnableIOSScrollFlashFix = true;
