var Handlebars = require("Handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['about'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<ul>\n  <li><span class=\"right\">"
    + escapeExpression(((stack1 = depth0.version),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><label class=\"left\">Version</label></li>\n  <li><span class=\"right\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><label class=\"left\">User</label></li>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.repository),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>Repository <span class=\"light\">";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers['format-url']),stack1 ? stack1.call(depth0, depth0.repository, options) : helperMissing.call(depth0, "format-url", depth0.repository, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span></a></li>\n</ul>\n";
  return buffer;
  });
templates['algorithm-popover'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1 class=\"small\">Available Options</h1>\n    <ul>\n    ";
  stack1 = helpers.each.call(depth0, depth0.options, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n    ";
  return buffer;
  }

  buffer += "<div class=\"hidden popover top justify\" data-position=\"top\">\n  <h1>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n  "
    + escapeExpression(((stack1 = depth0.description),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n  ";
  stack2 = helpers['if'].call(depth0, depth0.options, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['audio-recorder'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"audio-recorder\">\n  <div class=\"meter\">\n    <div class=\"audio-level\">\n      <div class=\"peak-meter\"></div>\n      <div class=\"average-meter\"></div>\n      <div class=\"stripes\"></div>\n    </div>\n    <div class=\"scale\">\n      <div class=\"scale-48\">-48</div>\n      <div class=\"scale-42\">-42</div>\n      <div class=\"scale-36\">-36</div>\n      <div class=\"scale-30\">-30</div>\n      <div class=\"scale-24\">-24</div>\n      <div class=\"scale-18\">-18</div>\n      <div class=\"scale-12\">-12</div>\n      <div class=\"scale-6\">-6</div>\n      <div class=\"scale-0\">0</div>\n    </div>\n  </div>\n\n  <a class=\"button red recorder\">Start</a>\n\n  <ul class=\"status expand hidden fade out\">\n    <li>\n      <span class=\"recording-length right light\"></span>\n      <label>Length</label>\n    </li>\n    <li class=\"wide\">\n      <a class=\"add-chapter-mark\" class=\"left\">\n        <span class=\"right light out\"></span>\n        Add Chapter Mark\n      </a>\n    </li>\n    <li class=\"chapter-text transition-able fade\">\n      <input type=\"text\" data-clearable=\"1\">\n    </li>\n  </ul>\n</div>\n";
  });
templates['container'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"container scrolling scrollable\">\n  <div class=\"scroll-content\"></div>\n</div>\n";
  });
templates['detail-summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"content\">\n  "
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.summary)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>\n";
  return buffer;
  });
templates['detail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  return " with-image";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n      <div class=\"dark-background\"></div>\n      <div class=\"cover-photo\" style=\"background-image: url(";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.thumbnail, options) : helperMissing.call(depth0, "image", depth0.thumbnail, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ");\"></div>\n      <div class=\"cover-photo\" style=\"background-image: url(";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "image", depth0.image, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ");\"></div>\n      <div class=\"gradient\"></div>\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "\n      <div class=\"light-background\"></div>\n    ";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.hasDescription, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.year, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.genre, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers.unless.call(depth0, depth0.hasDescription, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        ";
  stack1 = helpers['if'].call(depth0, depth0.album, {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.track, {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.artist, {hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<h1>";
  stack1 = helpers['if'].call(depth0, depth0.title, {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>";
  return buffer;
  }
function program9(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program11(depth0,data) {
  
  
  return "Untitled";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"year\">"
    + escapeExpression(((stack1 = depth0.year),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"genre\">"
    + escapeExpression(((stack1 = depth0.genre),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"album\">"
    + escapeExpression(((stack1 = depth0.album),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"track\">#"
    + escapeExpression(((stack1 = depth0.track),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

function program21(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"artist small\">"
    + escapeExpression(((stack1 = depth0.artist),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

function program23(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = self.invokePartial(partials.player, 'player', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }

function program25(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1>Video</h1>\n    <video controls>\n      <source src=\""
    + escapeExpression(((stack1 = depth0.videoPath),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n    </video>\n  ";
  return buffer;
  }

function program27(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"content uploading\">\n      <span></span>\n      <div class=\"progress-bar hidden\"><div></div></div>\n    </div>\n    <a class=\"clear button red expand cancelUpload\" data-id=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Cancel Upload</a>\n  ";
  return buffer;
  }

function program29(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.start_allowed, {hash:{},inverse:self.program(32, program32, data),fn:self.program(30, program30, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program30(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <a data-api-url=\"/production/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/start\" data-method=\"post\" class=\"clear button green expand startProduction\">Start Production</a>\n      <div class=\"content processing hidden\"></div>\n    ";
  return buffer;
  }

function program32(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = helpers.unless.call(depth0, depth0.change_allowed, {hash:{},inverse:self.noop,fn:self.program(33, program33, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program33(depth0,data) {
  
  
  return "\n        <div class=\"content processing\">Processing</div>\n      ";
  }

function program35(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <h1>Details</h1>\n    <ul>\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.summary), {hash:{},inverse:self.noop,fn:self.program(36, program36, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      ";
  stack2 = helpers['if'].call(depth0, depth0.image, {hash:{},inverse:self.noop,fn:self.program(38, program38, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      ";
  stack2 = ((stack1 = ((stack1 = depth0.metadata),typeof stack1 === functionType ? stack1.apply(depth0) : stack1)),blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(40, program40, data),data:data}));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </ul>\n  ";
  return buffer;
  }
function program36(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/summary\" class=\"arrow\"><span></span>Summary</a></li>";
  return buffer;
  }

function program38(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n        <li><a href=\"";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "image", depth0.image, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" class=\"share\"><span></span>Cover Photo</a></li>\n      ";
  return buffer;
  }

function program40(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.publisher, {hash:{},inverse:self.noop,fn:self.program(41, program41, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.url, {hash:{},inverse:self.noop,fn:self.program(43, program43, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.hasLicense, {hash:{},inverse:self.noop,fn:self.program(45, program45, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(58, program58, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program41(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li><label>Publisher <span class=\"light\">"
    + escapeExpression(((stack1 = depth0.publisher),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></label></li>";
  return buffer;
  }

function program43(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n          <li><a href=\""
    + escapeExpression(((stack1 = depth0.url),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>URL <span class=\"light\">";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers['format-url']),stack1 ? stack1.call(depth0, depth0.url, options) : helperMissing.call(depth0, "format-url", depth0.url, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span></a></li>\n        ";
  return buffer;
  }

function program45(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li>\n            ";
  stack1 = helpers['if'].call(depth0, depth0.license_url, {hash:{},inverse:self.program(48, program48, data),fn:self.program(46, program46, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n            License <span class=\"light\">";
  stack1 = helpers['if'].call(depth0, depth0.license, {hash:{},inverse:self.program(52, program52, data),fn:self.program(50, program50, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n\n            ";
  stack1 = helpers['if'].call(depth0, depth0.license_url, {hash:{},inverse:self.program(56, program56, data),fn:self.program(54, program54, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </li>\n        ";
  return buffer;
  }
function program46(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <a href=\""
    + escapeExpression(((stack1 = depth0.license_url),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>\n            ";
  return buffer;
  }

function program48(depth0,data) {
  
  
  return "\n              <label>\n            ";
  }

function program50(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.license),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program52(depth0,data) {
  
  var stack1, stack2, options;
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers['format-url']),stack1 ? stack1.call(depth0, depth0.license_url, options) : helperMissing.call(depth0, "format-url", depth0.license_url, options));
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program54(depth0,data) {
  
  
  return "\n              </a>\n            ";
  }

function program56(depth0,data) {
  
  
  return "\n              </label>\n            ";
  }

function program58(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <li><label>Tags <span class=\"light\">"
    + escapeExpression(((stack1 = depth0.tags),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></label></li>\n        ";
  return buffer;
  }

function program60(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = helpers['if'].call(depth0, depth0.output_basename, {hash:{},inverse:self.noop,fn:self.program(61, program61, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  stack1 = helpers.each.call(depth0, depth0.output_files, {hash:{},inverse:self.noop,fn:self.program(63, program63, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program61(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li>\n          <label>Filename <small class=\"light\">"
    + escapeExpression(((stack1 = depth0.output_basename),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></label>\n        </li>\n      ";
  return buffer;
  }

function program63(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.size_string, {hash:{},inverse:self.program(69, program69, data),fn:self.program(64, program64, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program64(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n          <li class=\"wide\">\n            ";
  stack1 = helpers['if'].call(depth0, depth0.size_string, {hash:{},inverse:self.noop,fn:self.program(65, program65, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            <label class=\"left\">"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers['if'].call(depth0, depth0.detail, {hash:{},inverse:self.noop,fn:self.program(67, program67, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</label>\n          </li>\n        ";
  return buffer;
  }
function program65(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"right light\"><small>"
    + escapeExpression(((stack1 = depth0.size_string),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></span>";
  return buffer;
  }

function program67(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " <small class=\"light\">"
    + escapeExpression(((stack1 = depth0.detail),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>";
  return buffer;
  }

function program69(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n          <li>\n            <label>"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers['if'].call(depth0, depth0.detail, {hash:{},inverse:self.noop,fn:self.program(67, program67, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</label>\n          </li>\n        ";
  return buffer;
  }

function program71(depth0,data) {
  
  
  return "\n        <li>\n          <label class=\"info\">\n            <span></span>\n            No Output Files are set\n            <div class=\"hidden popover top justify\" data-position=\"top\">\n              <h1>Missing Output Files</h1>\n              Add at least one output file to be able to start the production.\n            </div>\n          </label>\n        </li>\n    ";
  }

function program73(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1>Chapter Marks</h1>\n    <ul>\n      ";
  stack1 = helpers.each.call(depth0, depth0.chapters, {hash:{},inverse:self.noop,fn:self.program(74, program74, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  ";
  return buffer;
  }
function program74(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li>\n          <label>\n            <small class=\"light\">"
    + escapeExpression(((stack1 = depth0.start),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small> "
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          </label>\n        </li>\n      ";
  return buffer;
  }

function program76(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1>Input Source";
  stack1 = helpers['if'].call(depth0, depth0.service_display_type, {hash:{},inverse:self.noop,fn:self.program(77, program77, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>\n    <ul>\n      <li>\n        <label>\n          ";
  stack1 = helpers['if'].call(depth0, depth0.service_display_name, {hash:{},inverse:self.program(81, program81, data),fn:self.program(79, program79, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </label>\n      </li>\n    </ul>\n  ";
  return buffer;
  }
function program77(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " - "
    + escapeExpression(((stack1 = depth0.service_display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

function program79(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <span class=\"light\">"
    + escapeExpression(((stack1 = depth0.service_display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n            <small>"
    + escapeExpression(((stack1 = depth0.input_file),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n          ";
  return buffer;
  }

function program81(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            "
    + escapeExpression(((stack1 = depth0.input_file),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          ";
  return buffer;
  }

function program83(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1>Outgoing File Transfers</h1>\n    <ul>\n      ";
  stack1 = helpers.each.call(depth0, depth0.outgoing_services, {hash:{},inverse:self.noop,fn:self.program(84, program84, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  ";
  return buffer;
  }
function program84(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li>\n          ";
  stack1 = helpers['if'].call(depth0, depth0.result_page, {hash:{},inverse:self.program(87, program87, data),fn:self.program(85, program85, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </li>\n      ";
  return buffer;
  }
function program85(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <a href=\""
    + escapeExpression(((stack1 = depth0.result_page),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span><span class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> <small>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></a>\n          ";
  return buffer;
  }

function program87(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            ";
  stack1 = helpers['if'].call(depth0, depth0.result_urls, {hash:{},inverse:self.program(90, program90, data),fn:self.program(88, program88, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  return buffer;
  }
function program88(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <a href=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.result_urls),stack1 == null || stack1 === false ? stack1 : stack1[0])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span><span class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> <small>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></a>\n            ";
  return buffer;
  }

function program90(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <label><span class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> <small>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></label>\n            ";
  return buffer;
  }

function program92(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1>Subtitle</h1>\n    <div class=\"content\">\n      "
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.subtitle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </div>\n  ";
  return buffer;
  }

function program94(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <h1>Algorithms</h1>\n    <ul>\n    ";
  stack1 = helpers.each.call(depth0, depth0.algorithms, {hash:{},inverse:self.noop,fn:self.program(95, program95, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  ";
  return buffer;
  }
function program95(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <li class=\"wide\">\n        <label class=\"show-popover ";
  stack1 = helpers['if'].call(depth0, depth0.select, {hash:{},inverse:self.program(98, program98, data),fn:self.program(96, program96, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n          ";
  stack1 = helpers['if'].call(depth0, depth0.select, {hash:{},inverse:self.program(102, program102, data),fn:self.program(100, program100, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          "
    + escapeExpression(((stack1 = depth0.short_display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          ";
  stack2 = self.invokePartial(partials['algorithm-popover'], 'algorithm-popover', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </label>\n      </li>\n    ";
  return buffer;
  }
function program96(depth0,data) {
  
  
  return "left";
  }

function program98(depth0,data) {
  
  
  return "info";
  }

function program100(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <span class=\"right light bold\">"
    + escapeExpression(((stack1 = depth0.value_string),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n          ";
  return buffer;
  }

function program102(depth0,data) {
  
  
  return "\n            <span></span>\n          ";
  }

  buffer += "<div class=\"detailView\">\n  <div class=\"detail expand";
  stack1 = helpers['if'].call(depth0, depth0.thumbnail, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.thumbnail, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <div class=\"detail-inner\">\n      ";
  stack2 = ((stack1 = ((stack1 = depth0.metadata),typeof stack1 === functionType ? stack1.apply(depth0) : stack1)),blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data}));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n    <div class=\"clear\"></div>\n  </div>\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.media_files, {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <div class=\"clear\"></div>\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.hasVideo, {hash:{},inverse:self.noop,fn:self.program(25, program25, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.is_uploading, {hash:{},inverse:self.noop,fn:self.program(27, program27, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.production, {hash:{},inverse:self.noop,fn:self.program(29, program29, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.hasDetails, {hash:{},inverse:self.noop,fn:self.program(35, program35, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  <h1>Output Files</h1>\n  <ul>\n    ";
  stack2 = helpers['if'].call(depth0, depth0.output_files, {hash:{},inverse:self.program(71, program71, data),fn:self.program(60, program60, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </ul>\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.hasChapters, {hash:{},inverse:self.noop,fn:self.program(73, program73, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.input_file, {hash:{},inverse:self.noop,fn:self.program(76, program76, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.outgoing_services, {hash:{},inverse:self.noop,fn:self.program(83, program83, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.subtitle), {hash:{},inverse:self.noop,fn:self.program(92, program92, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.hasAlgorithms, {hash:{},inverse:self.noop,fn:self.program(94, program94, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n";
  return buffer;
  });
templates['external-services'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>External Services</h1>\n  <ul>\n    ";
  stack1 = helpers.each.call(depth0, depth0.services, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><label><span class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> <small>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></label></li>\n    ";
  return buffer;
  }

  buffer += "<ul>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.url),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>Add an external service</a></li>\n</ul>\n\n";
  stack2 = helpers['if'].call(depth0, depth0.services, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n";
  return buffer;
  });
templates['form-chapter'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\">\n      <input type=\"text\" name=\"start\" placeholder=\"00:00:00\" class=\"right\" data-required=\"1\" data-format-time=\"1\" data-matches=\"^(\\d?\\d)?:([0-5]\\d?)(:([0-5]\\d?(\\.(\\d{1,6})?)?)?)?$\" />\n      Start\n    </label>\n  </li>\n  <li>\n    <label class=\"left\">\n      <input type=\"text\" name=\"title\" class=\"right\" data-required=\"1\" data-clearable=\"1\" />\n      Title\n    </label>\n  </li>\n</ul>\n";
  });
templates['form-main'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <li class=\"input_file\">\n      <label class=\"input_file_label";
  stack1 = helpers['if'].call(depth0, depth0.hasPopover, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.hasPopover, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <span class=\"light\">";
  stack1 = helpers['if'].call(depth0, depth0.service, {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span> <small class=\"input_file_name";
  stack1 = helpers['if'].call(depth0, depth0.hasUpload, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">"
    + escapeExpression(((stack1 = depth0.input_file),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n        ";
  stack2 = helpers['if'].call(depth0, depth0.hasPopover, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </label>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.hasUpload, {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </li>\n    <li class=\"change_source hidden\"><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "source\" class=\"arrow\"><span></span>Choose Source</a></li>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " info";
  }

function program4(depth0,data) {
  
  
  return "<span></span>";
  }

function program6(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.service),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program8(depth0,data) {
  
  
  return "Upload<small class=\"uploading hidden\"></small>";
  }

function program10(depth0,data) {
  
  
  return " hidden";
  }

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <div class=\"hidden popover bottom justify\" data-position=\"bottom\">\n            ";
  stack1 = helpers['if'].call(depth0, depth0.hasUpload, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  stack1 = helpers.unless.call(depth0, depth0.isNewProduction, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </div>\n        ";
  return buffer;
  }
function program13(depth0,data) {
  
  
  return "<a class=\"button red expand cancelUpload\">Cancel Upload</a>";
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "source\" class=\"button expand\">Change Source</a>";
  return buffer;
  }

function program17(depth0,data) {
  
  
  return "<div class=\"progress-bar hidden\"><div></div></div>";
  }

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.production, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "source\" class=\"arrow\"><span></span>Choose Source</a></li>\n    ";
  return buffer;
  }

function program22(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.presets, {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program23(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li>\n        <label class=\"left\">\n          <select class=\"preset-chooser right empty\" data-select-type=\"preserve-null-state\">\n            <option value=\"\" selected>No Preset</option>\n            ";
  stack1 = helpers.each.call(depth0, depth0.presets, {hash:{},inverse:self.noop,fn:self.program(24, program24, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </select>\n          <span class=\"right placeholder\">choose a preset</span>\n          Preset\n        </label>\n      </li>\n    ";
  return buffer;
  }
function program24(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <option value=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.preset_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n            ";
  return buffer;
  }

function program26(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li>\n      <label class=\"left\">\n        <input type=\"text\" class=\"preset_name right\" name=\"preset_name\" data-clearable=\"1\" value=\""
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\"type a preset name\" />\n        Name\n      </label>\n    </li>\n  ";
  return buffer;
  }

function program28(depth0,data) {
  
  
  return "<small class=\"output_files_required\">(one is required)</small>";
  }

function program30(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.output_basename),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program32(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.input_file_basename),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program34(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<h1>Chapter Marks</h1>\n<ul class=\"chapter_marks\">\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "new/chapter\" class=\"plus\"><span></span>Add Chapter Mark</a></li>\n</ul>\n";
  return buffer;
  }

function program36(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"wide";
  stack1 = helpers['if'].call(depth0, depth0.belongs_to, {hash:{},inverse:self.noop,fn:self.program(37, program37, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"";
  stack1 = helpers['if'].call(depth0, depth0.belongs_to, {hash:{},inverse:self.noop,fn:self.program(39, program39, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n      ";
  stack1 = helpers['if'].call(depth0, depth0.checkbox, {hash:{},inverse:self.noop,fn:self.program(41, program41, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  stack1 = helpers['if'].call(depth0, depth0.select, {hash:{},inverse:self.noop,fn:self.program(44, program44, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </li>\n  ";
  return buffer;
  }
function program37(depth0,data) {
  
  
  return " transition-able";
  }

function program39(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " data-belongs-to=\"algorithms."
    + escapeExpression(((stack1 = depth0.belongs_to),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"";
  return buffer;
  }

function program41(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        <div class=\"right\">\n          <div class=\"checkbox\">\n            <div>\n              <span class=\"left\"></span><span class=\"thumb\" data-on=\"ON\" data-off=\"OFF\"></span>\n              <input type=\"checkbox\" name=\"algorithms."
    + escapeExpression(((stack1 = depth0.key),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"1\"";
  stack2 = helpers['if'].call(depth0, depth0.default_value, {hash:{},inverse:self.noop,fn:self.program(42, program42, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " />\n            </div>\n          </div>\n        </div>\n        <label class=\"left info\">\n          "
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          <div class=\"hidden popover top justify\" data-position=\"top\">\n            <h1>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n            "
    + escapeExpression(((stack1 = depth0.description),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          </div>\n        </label>\n      ";
  return buffer;
  }
function program42(depth0,data) {
  
  
  return " checked=\"checked\"";
  }

function program44(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        <select name=\"algorithms."
    + escapeExpression(((stack1 = depth0.key),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"right\">\n          ";
  stack2 = helpers.each.call(depth0, depth0.options, {hash:{},inverse:self.noop,fn:self.program(45, program45, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </select>\n        <label class=\"left info\">\n          "
    + escapeExpression(((stack1 = depth0.short_display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          ";
  stack2 = self.invokePartial(partials['algorithm-popover'], 'algorithm-popover', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </label>\n      ";
  return buffer;
  }
function program45(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n            <option value=\""
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"";
  stack2 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(46, program46, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">"
    + escapeExpression(((stack1 = depth0.short_display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n          ";
  return buffer;
  }
function program46(depth0,data) {
  
  
  return "selected=\"selected\"";
  }

  buffer += "<ul class=\"formcontent\">\n  ";
  stack1 = helpers['if'].call(depth0, depth0.input_file, {hash:{},inverse:self.program(19, program19, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  ";
  stack1 = helpers['if'].call(depth0, depth0.isNewProduction, {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  ";
  stack1 = helpers['if'].call(depth0, depth0.preset, {hash:{},inverse:self.noop,fn:self.program(26, program26, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "new/metadata\" class=\"arrow\"><span></span>Metadata</a></li>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "new/outgoing_services\" class=\"arrow\"><span></span>Outgoing Transfers <small class=\"servicesCount light\"></small></a></li>\n</ul>\n\n<h1>Output Files ";
  stack2 = helpers['if'].call(depth0, depth0.production, {hash:{},inverse:self.noop,fn:self.program(28, program28, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</h1>\n<ul class=\"output_files\">\n  <li>\n    <label class=\"left\">\n      <input type=\"text\" name=\"output_basename\" value=\"";
  stack2 = helpers['if'].call(depth0, depth0.output_basename, {hash:{},inverse:self.program(32, program32, data),fn:self.program(30, program30, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" data-clearable=\"1\" placeholder=\"without extension\" class=\"right\" />\n      Filename\n    </label>\n  </li>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.baseURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "new/output_file\" class=\"plus\"><span></span>Add Audio Format</a></li>\n</ul>\n\n";
  stack2 = helpers['if'].call(depth0, depth0.production, {hash:{},inverse:self.noop,fn:self.program(34, program34, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n<h1>Algorithms</h1>\n<ul class=\"formcontent\">\n  ";
  stack2 = helpers.each.call(depth0, depth0.algorithm, {hash:{},inverse:self.noop,fn:self.program(36, program36, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>\n";
  return buffer;
  });
templates['form-metadata'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  return " hidden";
  }

  buffer += "<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.title\" class=\"right\" data-clearable=\"1\" />Title</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.album\" class=\"right\" />Album</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.artist\" class=\"right\" />Artist</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" pattern=\"[0-9]*\" name=\"metadata.track\" class=\"right\" />Track</label>\n  </li>\n</ul>\n\n<h1>Cover Photo</h1>\n<img src=\"";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.thumbnail, options) : helperMissing.call(depth0, "image", depth0.thumbnail, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" class=\"thumbnail";
  stack2 = helpers.unless.call(depth0, depth0.thumbnail, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" />\n<ul>\n  <li>\n    <label class=\"upload-cover-photo show-popover\">\n      Upload\n      <div class=\"hidden popover top justify\" data-position=\"top\">\n        <a href=\"#\" class=\"button expand upload_take_photo\">Take a Photo</a>\n        <a href=\"#\" class=\"button expand upload_from_library\">Choose from Library</a>\n      </div>\n    </label>\n  </li>\n  <li class=\"remove_thumbnail";
  stack2 = helpers.unless.call(depth0, depth0.thumbnail, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n    <a href=\"#\">Remove</a>\n  </li>\n</ul>\n\n<h1 class=\"clear\">Details</h1>\n<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.genre\" class=\"right\" />Genre</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"tel\" name=\"metadata.year\" class=\"right\" data-clearable=\"1\" />Year</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.publisher\" class=\"right\" />Publisher</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"url\" name=\"metadata.url\" class=\"right\" autocapitalize=\"off\" />URL</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.license\" placeholder=\"License etc.\" class=\"right\" />Copyright</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"url\" name=\"metadata.license_url\" placeholder=\"URL\" autocapitalize=\"off\" class=\"right\" />License</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.tags\" placeholder=\"comma separated\" class=\"right\" />Tags</label>\n  </li>\n  <li class=\"wide\">\n    <label class=\"left\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n            <input type=\"checkbox\" name=\"metadata.append_chapters\" value=\"1\" />\n          </div>\n        </div>\n      </div>\n      Append Chapters\n    </label>\n  </li>\n</ul>\n\n<h1>Subtitle <small>(max 255 characters)</small></h1>\n<ul class=\"formcontent\">\n  <li><label><textarea class=\"autogrow\" name=\"metadata.subtitle\" maxlength=\"255\"></textarea></label></li>\n</ul>\n<h1>Summary</h1>\n<ul class=\"formcontent\">\n  <li><label><textarea class=\"autogrow\" name=\"metadata.summary\"></textarea></label></li>\n</ul>\n";
  return buffer;
  });
templates['form-output-file-detail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <li class=\"wide\">\n    <label class=\"left\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n            <input type=\"checkbox\" name=\"mono_mixdown\" value=\"1\" ";
  stack1 = helpers['if'].call(depth0, depth0.mono_mixdown, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "/>\n          </div>\n        </div>\n      </div>\n      Mono Mixdown\n    </label>\n  </li>\n  <li class=\"wide\">\n    <label class=\"left\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n            <input type=\"checkbox\" name=\"split_on_chapters\" value=\"1\" ";
  stack1 = helpers['if'].call(depth0, depth0.split_on_chapters, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "/>\n          </div>\n        </div>\n      </div>\n      Split on Chapters\n    </label>\n  </li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " checked=\"checked\"";
  }

  stack1 = helpers['if'].call(depth0, depth0.has_options, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<li>\n  <label class=\"left\">\n    <input type=\"text\" name=\"suffix\" placeholder=\"optional\" class=\"right\" />\n    Suffix\n  </label>\n</li>\n";
  return buffer;
  });
templates['form-output-file'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n          <optgroup label=\""
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n            ";
  stack2 = helpers.each.call(depth0, depth0.items, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n          </optgroup>\n        ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <option value=\""
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n            ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers.each.call(depth0, depth0.items, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = helpers['if'].call(depth0, depth0.has_options, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        <li data-output-file=\""
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n          <label class=\"left\">\n            <select name=\"bitrate\" class=\"right small\">\n              ";
  stack2 = helpers.each.call(depth0, depth0.bitrate_format, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </select>\n            Bitrate\n          </label>\n        </li>\n      ";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n                <option value=\""
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"";
  stack2 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n              ";
  return buffer;
  }
function program8(depth0,data) {
  
  
  return "selected=\"selected\"";
  }

  buffer += "<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\">\n      <select name=\"format\" class=\"right empty\">\n        ";
  stack1 = helpers.each.call(depth0, depth0.formats, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </select>\n      <span class=\"right placeholder\">choose a format</span>\n      Format\n    </label>\n  </li>\n</ul>\n\n<ul class=\"bitrates hidden\">\n  ";
  stack1 = helpers.each.call(depth0, depth0.formats, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });
templates['form-service'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul class=\"formcontent\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.service, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n\n  ";
  stack1 = helpers.each.call(depth0, depth0.service, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li class=\"wide\">\n        <input type=\"hidden\" name=\"outgoing_services."
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ".uuid\" value=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n        <label class=\"left\">\n          <div class=\"right\">\n            <div class=\"checkbox\">\n              <div>\n                <span class=\"left\"></span><span class=\"thumb\" data-on=\"ON\" data-off=\"OFF\"></span>\n                <input type=\"checkbox\" name=\"outgoing_services."
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ".checked\" data-uuid=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"1\" />\n              </div>\n            </div>\n          </div>\n          <small><span class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> "
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n        </label>\n      </li>\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.parameters, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <div class=\"fade\" data-service-uuid=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        <h1>"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " - "
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n        <ul>\n          ";
  stack2 = helpers.each.call(depth0, depth0.parameters, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </ul>\n      </div>\n    ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            ";
  stack1 = helpers['if'].call(depth0, depth0.checkbox, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  stack1 = helpers['if'].call(depth0, depth0.select, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n              <li class=\"wide\">\n                <label class=\"left\">\n                  <div class=\"right\">\n                    <div class=\"checkbox\">\n                      <div>\n                        <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n                        <input type=\"checkbox\" name=\"outgoing_services."
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "."
    + escapeExpression(((stack1 = depth0.key),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"1\" ";
  stack2 = helpers['if'].call(depth0, depth0.default_value, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "/>\n                      </div>\n                    </div>\n                  </div>\n                  "
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                </label>\n              </li>\n            ";
  return buffer;
  }
function program8(depth0,data) {
  
  
  return "checked=\"checked\"";
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n              <li>\n                <label class=\"left\">\n                  <select name=\"outgoing_services."
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "."
    + escapeExpression(((stack1 = depth0.key),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"right";
  stack2 = helpers.unless.call(depth0, depth0.default_value, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\"";
  stack2 = helpers['if'].call(depth0, depth0.hasEmptyOption, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">\n                    ";
  stack2 = helpers.each.call(depth0, depth0.options, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                  </select>\n                  ";
  stack2 = helpers.unless.call(depth0, depth0.default_value, {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n                  "
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                </label>\n              </li>\n            ";
  return buffer;
  }
function program11(depth0,data) {
  
  
  return " empty";
  }

function program13(depth0,data) {
  
  
  return " data-select-type=\"preserve-null-state\"";
  }

function program15(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n                      <option value=\""
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"";
  stack2 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n                    ";
  return buffer;
  }
function program16(depth0,data) {
  
  
  return "selected=\"selected\"";
  }

function program18(depth0,data) {
  
  
  return "\n                    <span class=\"right placeholder\">select a value</span>\n                  ";
  }

function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1 class=\"null\">You have no outgoing services.</h1>\n  <p class=\"null\">Please go to the Auphonic website and add external services so you can automatically export your recordings.</p>\n  <ul>\n    <li><a href=\""
    + escapeExpression(((stack1 = depth0.url),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>Add an external service</a></li>\n  </ul>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.service, {hash:{},inverse:self.program(20, program20, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['home'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n  <a href=\"/logout\" class=\"button red expand\">Logout</a>\n";
  }

  buffer += "<div class=\"logo\"></div>\n<ul>\n  <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Audio Recording</a></li>\n  <li><a href=\"/production/source\" class=\"arrow\"><span></span>Create a new Production</a></li>\n  <li><a href=\"/preset/new\" class=\"arrow\"><span></span>Define a Preset</a></li>\n  <li><a href=\"/external-services\" class=\"arrow\"><span></span>External Services</a></li>\n  <li><a href=\"/about\" class=\"arrow\"><span></span>About</a></li>\n  <li><a href=\"/team\" class=\"arrow\"><span></span>Team</a></li>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.feedback),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>Feedback</a></li>\n</ul>\n\n";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.platform),stack1 ? stack1.call(depth0, "ios", options) : helperMissing.call(depth0, "platform", "ios", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n";
  return buffer;
  });
templates['login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form action=\"/\" method=\"post\">\n  <input type=\"hidden\" name=\"client_id\" value=\""
    + escapeExpression(((stack1 = depth0.client_id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n  <input type=\"hidden\" name=\"client_secret\" value=\""
    + escapeExpression(((stack1 = depth0.client_secret),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n  <input type=\"hidden\" name=\"grant_type\" value=\"password\" />\n  <div class=\"formcontent\">\n    <label>\n      <input type=\"text\" name=\"username\" value=\""
    + escapeExpression(((stack1 = depth0.username),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\"email or username\" autocapitalize=\"off\" autocorrect=\"off\" data-clearable=\"1\" />\n    </label>\n    <label>\n      <input type=\"password\" name=\"password\" placeholder=\"password\" />\n    </label>\n  </div>\n  <div>\n    <input type=\"submit\" name=\"submit\" value=\"Login\" />\n    <a href=\""
    + escapeExpression(((stack1 = depth0.registerURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"Register\" class=\"register button\">Register</a>\n  </div>\n</form>\n";
  return buffer;
  });
templates['logout-popover'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"hidden popover right white justify\">\n  <a href=\"/logout\" class=\"button red expand\">Logout</a>\n</div>\n";
  });
templates['player'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "<span class=\"hidden\" data-local=\"1\" />";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n      <img src=\"";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.waveform_image, options) : helperMissing.call(depth0, "image", depth0.waveform_image, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" />\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "\n      <div class=\"line\"></div>\n    ";
  }

  buffer += "<div class=\"player content expand with-shadow clear\">\n  <div class=\"play-button content full\">\n    <a class=\"play\">\n      <span class=\"hidden\" data-media=\"1\">"
    + escapeExpression(((stack1 = depth0.media_files),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n      <span class=\"hidden\" data-chapters=\"1\">"
    + escapeExpression(((stack1 = depth0.player_chapters),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n      <span class=\"hidden\" data-duration=\"1\">"
    + escapeExpression(((stack1 = depth0.duration),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.isLocal, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </a>\n  </div>\n  <div class=\"waveform content full show-popover\" data-popover-open-event=\"touchstart\" data-popover-open-delay=\"300\" data-popover-close-event=\"touchend\">\n    ";
  stack2 = helpers['if'].call(depth0, depth0.waveform_image, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    <div class=\"position\"></div>\n      <div class=\"hidden popover top center auto-width\" data-position=\"top\"></div>\n  </div>\n\n  <div class=\"player-details\">\n    <div class=\"duration light\">"
    + escapeExpression(((stack1 = depth0.duration_string),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n    <div class=\"current-time light\"></div>\n    <div class=\"chapter-mark bold\"></div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['preset'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <br />\n      <span class=\"light small bold info-left\">\n        "
    + escapeExpression(((stack1 = depth0.short_info),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n      </span>\n    ";
  return buffer;
  }

  buffer += "<li class=\"swipeable show-popover\" data-popover-open-event=\"touchhold\" data-api-url=\"preset/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-method=\"delete\" data-id=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-fire-event=\"remove\">\n  <span class=\"right removable expanded hidden\">\n    <span><a class=\"button red small\">Delete</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a href=\"/preset/edit/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"button expand\">Edit</a>\n    <a class=\"button expand red deleteable\">Delete</a>\n  </div>\n  <a href=\"/preset/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow expanded\">\n    <span></span>\n    <img src=\"";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.thumbnail, options) : helperMissing.call(depth0, "image", depth0.thumbnail, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" class=\"small-logo list-thumbnail\" />\n    "
    + escapeExpression(((stack1 = depth0.preset_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    ";
  stack2 = helpers['if'].call(depth0, depth0.short_info, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </a>\n</li>\n";
  return buffer;
  });
templates['presets'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul class=\"preset_container expand load-more main-list\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.preset, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = self.invokePartial(partials.preset, 'preset', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">You have no presets yet.</h1>\n  <p class=\"null\">A preset helps you predefine settings like metadata or output files and speeds up creating new productions.</p>\n  <ul>\n    <li><a href=\"/preset/new\" class=\"arrow\"><span></span>Define a new Preset</a></li>\n  </ul>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.preset, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['production'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      "
    + escapeExpression(((stack1 = ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n      Untitled\n    ";
  }

  buffer += "<li class=\"swipeable show-popover\" data-popover-open-event=\"touchhold\" data-api-url=\"production/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-method=\"delete\" data-id=\""
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-fire-event=\"remove\">\n  <span class=\"right removable expanded hidden\">\n    <span><a class=\"button red small\">Delete</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a href=\"/production/edit/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"button expand\">Edit</a>\n    <a class=\"button expand red deleteable\">Delete</a>\n  </div>\n  <a href=\"/production/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow expanded\">\n    <span></span>\n    <img src=\"";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.image),stack1 ? stack1.call(depth0, depth0.thumbnail, options) : helperMissing.call(depth0, "image", depth0.thumbnail, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" class=\"small-logo list-thumbnail\" />\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.metadata),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    <br />\n    <span class=\"small bold info-left\">\n      "
    + escapeExpression(((stack1 = depth0.short_status_string),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <span class=\"light\">"
    + escapeExpression(((stack1 = depth0.short_info),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    </span>\n  </a>\n</li>\n";
  return buffer;
  });
templates['productions'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul class=\"production_container expand load-more main-list\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.production, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = self.invokePartial(partials.production, 'production', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">You have not created any productions yet</h1>\n  <ul>\n    <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Audio Recording</a></li>\n    <li><a href=\"/production/source\" class=\"arrow\"><span></span>Create a new Production</a></li>\n  </ul>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.production, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['recording'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = self.invokePartial(partials.player, 'player', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Video</h1>\n  <video controls>\n    <source src=\""
    + escapeExpression(((stack1 = depth0.fullPath),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n  </video>\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Associated Productions</h1>\n  <ul>\n    ";
  stack1 = helpers.each.call(depth0, depth0.display_productions, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <li>\n        <a href=\"/production/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow\">\n          <span></span>\n          ";
  stack2 = helpers['if'].call(depth0, depth0.title, {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </a>\n      </li>\n    ";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            "
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          ";
  return buffer;
  }

function program9(depth0,data) {
  
  
  return "\n            Untitled\n          ";
  }

  buffer += "<div class=\"light-background\"></div>\n<ul class=\"formcontent expand with-shadow\">\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"display_name\" value=\""
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"right\" data-clearable=\"1\" />Name</label>\n  </li>\n  <li>\n    <span class=\"right light bold\">"
    + escapeExpression(((stack1 = depth0.display_size),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    <label class=\"left\">Size</label>\n  </li>\n  <li>\n    <span class=\"right light bold\">"
    + escapeExpression(((stack1 = depth0.display_date),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    <label class=\"left\">Date</label>\n  </li>\n</ul>\n\n";
  stack2 = helpers['if'].call(depth0, depth0.isAudio, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n<a href=\""
    + escapeExpression(((stack1 = depth0.uploadURL),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"clear button green expand startProduction\">Upload and create a Production</a>\n\n<h1>Chapter Marks</h1>\n<ul class=\"chapter_marks\">\n  <li><a href=\"/recording/new/chapter\" class=\"plus\"><span></span>Add Chapter Mark</a></li>\n</ul>\n\n";
  stack2 = helpers['if'].call(depth0, depth0.hasProductions, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n";
  return buffer;
  });
templates['recordings'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul class=\"main-list\">\n  ";
  stack1 = helpers.each.call(depth0, depth0.recordings, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"swipeable show-popover\" data-popover-open-event=\"touchhold\" data-id=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-fire-event=\"remove\">\n      <span class=\"right removable hidden\">\n        <span><a class=\"button red small\">Delete</a></span>\n      </span>\n      <div class=\"hidden popover top justify\" data-position=\"top\">\n        <a class=\"button expand red deleteable\">Delete</a>\n      </div>\n      <a href=\"/recording/"
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow\">\n        <span></span>\n        "
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        <small class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_date),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n      </a>\n    </li>\n  ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">You have no recent recordings.</h1>\n  <ul>\n    <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Audio Recording</a></li>\n  </ul>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.recordings, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['service-choose'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li><a href=\"/production/source/"
    + escapeExpression(((stack1 = depth0.uuid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow\"><span></span><span class=\"light\">"
    + escapeExpression(((stack1 = depth0.display_type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> <small>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small></a></li>\n  ";
  return buffer;
  }

  buffer += "<ul>\n  <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>New Audio Recording</a></li>\n  <li><a href=\"/production/recording/new-video\" class=\"arrow\"><span></span>New Video Recording</a></li>\n  ";
  stack1 = helpers.each.call(depth0, depth0.source, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });
templates['service-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul>\n    ";
  stack1 = helpers.each.call(depth0, depth0.files, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><a href=\"/production/selectFile/"
    + escapeExpression(((stack1 = depth0.index),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow\"><span></span>"
    + escapeExpression(((stack1 = depth0.display_name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">No files found</h1>\n  <p class=\"null\">There are no files on this input source. Please upload a file to this service or start a new recording from within the application.</p>\n  <ul>\n    <li><a href=\"/production/source\" class=\"arrow\"><span></span>Select an input source</a></li>\n    <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Audio Recording</a></li>\n  </ul>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.files, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['team'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"detailView\">\n  <div class=\"detail expand with-image\">\n    <div class=\"dark-background\"></div>\n    <div class=\"cover-photo\" style=\"background-image: url("
    + escapeExpression(((stack1 = depth0.image),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ");\"></div>\n    <div class=\"gradient\"></div>\n    <div class=\"detail-inner\">\n      <span class=\"year\">2012</span>\n      <span class=\"genre\">Graz</span>\n      <h1>Auphonic Team</h1>\n      <span class=\"artist small wrap\">\n        André Rattinger, Ferdinand Fuhrmann, Christoph Pojer, Georg Holzmann and Florian Hollerweger\n      </span>\n    </div>\n    <div class=\"clear\"></div>\n  </div>\n  <div class=\"clear\"></div>\n\n  <div class=\"content\">\n    Our service is being developed in the lovely City of Graz, Austria.\n    <br/><br/>\n    We develop new algorithms in the area of music information retrieval and audio signal processing to create an automatic audio post production web service for broadcasters, podcasts, radio shows, audio books, lecture recordings, screencasts and more.\n  </div>\n</div>\n\n<ul>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.twitter),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>Auphonic on Twitter</a></li>\n  <li><a href=\""
    + escapeExpression(((stack1 = depth0.facebook),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"share\"><span></span>Auphonic on Facebook</a></li>\n</ul>\n";
  return buffer;
  });
templates['ui-action'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " "
    + escapeExpression(((stack1 = depth0.className),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

  buffer += "<a href=\""
    + escapeExpression(((stack1 = depth0.url),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"button-right hidden\" data-hit-target=\"1\"><span class=\"button";
  stack2 = helpers['if'].call(depth0, depth0.className, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n  <span></span><span>"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></span>\n</a>\n";
  return buffer;
  });
templates['ui-back'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " "
    + escapeExpression(((stack1 = depth0.className),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

  buffer += "<a href=\"#\" class=\"button-left\" data-hit-target=\"1\"><span class=\"button";
  stack1 = helpers['if'].call(depth0, depth0.className, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></a>\n";
  return buffer;
  });
templates['ui-removable-chapter-list-item'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"swipeable show-popover\" data-popover-open-event=\"touchhold\">\n  <span class=\"right removable\">\n    <span><a class=\"button red small\">"
    + escapeExpression(((stack1 = depth0.label),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a class=\"button expand red deleteable\">"
    + escapeExpression(((stack1 = depth0.label),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n  </div>\n  <a href=\""
    + escapeExpression(((stack1 = depth0.href),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow\"><span></span><small class=\"light\">"
    + escapeExpression(((stack1 = depth0.start),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small> "
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n</li>\n";
  return buffer;
  });
templates['ui-removable-list-item'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " <small class=\"light\">"
    + escapeExpression(((stack1 = depth0.detail),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>";
  return buffer;
  }

  buffer += "<li class=\"swipeable show-popover\" data-popover-open-event=\"touchhold\">\n  <span class=\"right removable\">\n    <span><a class=\"button red small\">"
    + escapeExpression(((stack1 = depth0.label),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a class=\"button expand red deleteable\">"
    + escapeExpression(((stack1 = depth0.label),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n  </div>\n  <a href=\""
    + escapeExpression(((stack1 = depth0.href),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"arrow\"><span></span>"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  stack2 = helpers['if'].call(depth0, depth0.detail, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</a>\n</li>\n";
  return buffer;
  });
templates['ui-title'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1><span class=\"back\"></span><span class=\"icon\"></span>"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n";
  return buffer;
  });
templates['ui'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compiledVersion = '1.0.rc.2';
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id=\"ui\" class=\"hidden\">\n  <header></header>\n  <footer>\n    <ul>\n      <li><a href=\"/\" class=\"home\"><span></span><span>Home</span></a></li>\n      <li><a href=\"/production\" class=\"production\"><span></span><span>Productions</span></a></li>\n      <li><a href=\"/recording\" class=\"record\"><span></span><span>Recordings</span></a></li>\n      <li><a href=\"/preset\" class=\"preset\"><span></span><span>Presets</span></a></li>\n    </ul>\n  </footer>\n  <div class=\"headerBackground\"></div>\n  <div class=\"footerBackground\"></div>\n  <div id=\"main\" class=\"main\"></div>\n</div>\n";
  });
