exports.Version = '0.91';
exports.FeedbackURL = 'mailto:christoph.pojer+auphonic@gmail.com?subject=Auphonic%20Mobile%20App%20Feedback';
exports.RepositoryURL = 'https://github.com/auphonic/auphonic-mobile';
exports.IssuesURL = 'https://github.com/auphonic/auphonic-mobile/issues';
exports.RegisterURL = 'https://auphonic.com/accounts/register/';
exports.DefaultTitle = 'Mobile App: New Production';
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

var statusStrings = {
  '0': 'Incoming',
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
  '11': 'Outdated'
};

exports.LUFSAlgorithmName = 'loudnesstarget';
exports.LUFSDisplayFilter = /^.*?lufs/i;

exports.ErrorStatus = 2;

exports.getStatusString = function(type) {
  return statusStrings[type] || 'Processing';
};
