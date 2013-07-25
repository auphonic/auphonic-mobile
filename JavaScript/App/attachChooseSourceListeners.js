var Popover = require('UI/Actions/Popover');

var ResourceSelector = require('./ResourceSelector');

module.exports = function(element, options) {
  var onSelectResourceFile = options && options.onSelectResourceFile;
  var allowLocalRecordings = options && options.allowLocalRecordings;

  var createResourceSelectorListener = function(popoverElement) {
    return function(event) {
      event.preventDefault();
      new ResourceSelector(popoverElement, {
        allowLocalRecordings: allowLocalRecordings
      }).addEvents({
        onSelectFile: onSelectResourceFile
      }).show();
    };
  };

  var label = element.getElement('.input_file_label');
  var popover = label ? label.getInstanceOf(Popover) : null;
  var changeSourceButton = popover && popover.getPopover().getElement('.changeSource');
  if (changeSourceButton) changeSourceButton.addEvent('click', createResourceSelectorListener(popover));

  var chooseSourceLabel = element.getElement('.chooseSource');
  if (chooseSourceLabel) chooseSourceLabel.addEvent('click', createResourceSelectorListener(chooseSourceLabel.getInstanceOf(Popover)));
};
