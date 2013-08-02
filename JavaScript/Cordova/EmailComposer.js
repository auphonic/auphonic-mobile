var EmailComposer = module.exports = function(callback) {
  this.callback = callback;
};

EmailComposer.StatusCodes = {
  Cancelled: 0,
  Saved: 1,
  Sent: 2,
  Failed: 3,
  NotSent: 4
};

EmailComposer.prototype.show = function(args) {
  cordova.exec(this.callback, null, 'EmailComposer', 'showEmailComposer', [args]);
};
