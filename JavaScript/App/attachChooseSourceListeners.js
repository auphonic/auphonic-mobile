var Popover = require('UI/Actions/Popover');

var ResourceSelector = require('./ResourceSelector');

module.exports = function(element, options) {
  var onSelectResourceFile = options && options.onSelectResourceFile;

  var label = element.getElement('.input_file_label');
  var popover = label ? label.getInstanceOf(Popover) : null;
  var changeSourceButton = popover && popover.getPopover().getElement('.changeSource');
  if (changeSourceButton) changeSourceButton.addEvent('click', function(event) {
    event.preventDefault();

    new ResourceSelector(popover).addEvents({
      onSelectFile: onSelectResourceFile
    }).show();
  });

  var chooseSourceLabel = element.getElement('.chooseSource');
  if (chooseSourceLabel) {
    var chooseSourcePopover = chooseSourceLabel.getInstanceOf(Popover);
    chooseSourceLabel.addEvent('click', function() {
      new ResourceSelector(chooseSourcePopover).addEvents({
        onSelectFile: onSelectResourceFile
      }).show();
    });
  }
};
