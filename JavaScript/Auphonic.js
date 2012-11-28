exports.Version = '1.0.4';
exports.APIURL = 'https://auphonic.com/';
exports.FeedbackURL = 'mailto:mobile@auphonic.com?subject=Auphonic%20Mobile%20App%20Feedback';
exports.RepositoryURL = 'https://github.com/auphonic/auphonic-mobile';
exports.IssuesURL = 'https://github.com/auphonic/auphonic-mobile/issues';
exports.RegisterURL = 'https://auphonic.com/accounts/register/';
exports.ExternalServicesURL = 'https://auphonic.com/engine/services/';
exports.TeamImage = 'https://auphonic.com/media/pics/AuphonicTeam1_small.jpg';
exports.TwitterURL = 'https://twitter.com/auphonic';
exports.FacebookURL = 'https://www.facebook.com/pages/auphonic/217115551651035';
exports.DefaultFileName = 'mobile-recording-{uuid}';
exports.DefaultVideoFileName = 'mobile-video-{uuid}';
exports.DefaultFileNameFilter = /mobile-(?:video|recording)-(\d+)/i;

exports.DefaultOutputFile = {
  format: 'mp3',
  bitrate: '96'
};

exports.SpinnerOptions = {
  lines: 12,
  length: 10,
  width: 7,
  radius: 13,
  trail: 30,
  color: '#fff'
};

exports.ViewSpinnerOptions = {
  lines: 12,
  length: 10,
  width: 7,
  radius: 13,
  trail: 30,
  color: '#000'
};

exports.ViewSpinnerOptionsSmall = {
  lines: 9,
  length: 4,
  width: 3,
  radius: 4,
  trail: 30,
  color: '#000',
  className: 'spinner-inline-bottom'
};

exports.PlayerSpinnerOptions = {
  lines: 9,
  length: 4,
  width: 3,
  radius: 4,
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

exports.ErrorStatus = 2;

exports.getStatusString = function(type) {
  return statusStrings[type] || 'Processing';
};

exports.EnableIOSScrollFlashFix = true;
