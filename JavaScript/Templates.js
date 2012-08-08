var Handlebars = require("Handlebars"); var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['about'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<ul>\n  <li><span class=\"right\">";
  stack1 = depth0.version;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span><label class=\"left\">Version</label></li>\n  <li><a href=\"";
  stack1 = depth0.repository;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"share\"><span></span>Repository <span class=\"light\">";
  stack1 = depth0.repository;
  foundHelper = helpers['format-url'];
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "format-url", stack1, {hash:{}});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span></a></li>\n</ul>\n";
  return buffer;});
templates['data-detail-summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"content detail\">\n  ";
  stack1 = depth0.metadata;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.summary;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n</div>\n";
  return buffer;});
templates['data-detail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <img src=\"";
  stack1 = depth0.thumbnail;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.access_token;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.random;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"thumbnail\" />\n  ";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.track;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <h1>";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</h1>\n    ";
  stack1 = depth0.genre;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.album;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(8, program8, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.year;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(10, program10, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.artist;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(12, program12, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;}
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"track\">#";
  stack1 = depth0.track;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"genre\">";
  stack1 = depth0.genre;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"album\">";
  stack1 = depth0.album;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"year\">";
  stack1 = depth0.year;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"artist small light\">";
  stack1 = depth0.artist;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <span class=\"small service\">\n      ";
  stack1 = depth0.service_display_type;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(15, program15, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  stack1 = depth0.service_display_name;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(17, program17, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </span>\n    <span class=\"small file\">";
  stack1 = depth0.input_file;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n  ";
  return buffer;}
function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"light bold\">";
  stack1 = depth0.service_display_type;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"bold\">";
  stack1 = depth0.service_display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>";
  return buffer;}

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<div class=\"clear-left small light\">";
  stack1 = depth0.metadata;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.subtitle;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</div>";
  return buffer;}

function program21(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"player\">\n    <div class=\"play-button content full\">\n      <a class=\"play\" href=\"#\"><span class=\"hidden\" data-media=\"1\">";
  stack1 = depth0.media_files;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></a>\n    </div>\n    <div class=\"waveform content full\">\n      <img src=\"";
  stack1 = depth0.waveform_image;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.access_token;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.random;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" />\n      <div class=\"position\"></div>\n    </div>\n  </div>\n";
  return buffer;}

function program23(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a href=\"#\" data-api-url=\"/production/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "/start\" data-method=\"post\" class=\"button green expand startProduction\">Start Production</a>\n";
  return buffer;}

function program25(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Details</h1>\n  <ul>\n    ";
  stack1 = depth0.metadata;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.summary;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(26, program26, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n  ";
  stack1 = depth0.metadata;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  stack1 = stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(28, program28, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program26(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li><a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "/summary\" class=\"arrow\"><span></span>Summary</a></li>";
  return buffer;}

function program28(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.publisher;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(29, program29, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.url;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(31, program31, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.hasLicense;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(33, program33, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.tags;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(46, program46, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;}
function program29(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li><label>Publisher <span class=\"light\">";
  stack1 = depth0.publisher;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></label></li>";
  return buffer;}

function program31(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n      <li><a href=\"";
  stack1 = depth0.url;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"share\"><span></span>URL <span class=\"light\">";
  stack1 = depth0.url;
  foundHelper = helpers['format-url'];
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "format-url", stack1, {hash:{}});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<span></a></li>\n    ";
  return buffer;}

function program33(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li>\n        ";
  stack1 = depth0.license_url;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(36, program36, data),fn:self.program(34, program34, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n        License <span class=\"light\">";
  stack1 = depth0.license;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(40, program40, data),fn:self.program(38, program38, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n\n        ";
  stack1 = depth0.license_url;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(44, program44, data),fn:self.program(42, program42, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </li>\n    ";
  return buffer;}
function program34(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <a href=\"";
  stack1 = depth0.license_url;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"share\"><span></span>\n        ";
  return buffer;}

function program36(depth0,data) {
  
  
  return "\n          <label>\n        ";}

function program38(depth0,data) {
  
  var stack1;
  stack1 = depth0.license;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  return escapeExpression(stack1);}

function program40(depth0,data) {
  
  var stack1, foundHelper;
  stack1 = depth0.license_url;
  foundHelper = helpers['format-url'];
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "format-url", stack1, {hash:{}});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }}

function program42(depth0,data) {
  
  
  return "\n          </a>\n        ";}

function program44(depth0,data) {
  
  
  return "\n          </label>\n        ";}

function program46(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><label>Tags <span class=\"light\">";
  stack1 = depth0.tags;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</label></li>\n    ";
  return buffer;}

function program48(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Output Files</h1>\n  <ul>\n    ";
  stack1 = depth0.output_basename;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(49, program49, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = depth0.output_files;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(51, program51, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program49(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li>\n        <label class=\"left\">\n          Prefix <small class=\"light\">";
  stack1 = depth0.output_basename;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small>\n        </label>\n      </li>\n    ";
  return buffer;}

function program51(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li>\n        <label>";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.detail;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(52, program52, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</label>\n      </li>\n    ";
  return buffer;}
function program52(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " <small class=\"light\">";
  stack1 = depth0.detail;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small>";
  return buffer;}

function program54(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Chapter Marks</h1>\n  <ul>\n    ";
  stack1 = depth0.chapters;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(55, program55, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program55(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li>\n        <label>\n          <small class=\"light\">";
  stack1 = depth0.start;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small> ";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n        </label>\n      </li>\n    ";
  return buffer;}

function program57(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Outgoing File Transfers</h1>\n  <ul>\n    ";
  stack1 = depth0.outgoing_services;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(58, program58, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program58(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><label><span class=\"light\">";
  stack1 = depth0.display_type;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span> <small>";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small></label></li>\n    ";
  return buffer;}

function program60(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <h1>Algorithms</h1>\n  <ul>\n  ";
  stack1 = depth0.algorithms;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(61, program61, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program61(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li>\n      <label class=\"info\">\n        <span></span>";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n        <div class=\"hidden popover top justify\" data-position=\"top\">\n          <h1>";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</h1>\n          ";
  stack1 = depth0.description;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n        </div>\n      </label>\n    </li>\n  ";
  return buffer;}

  buffer += "<div class=\"white-above\"></div>\n<div class=\"content detail expand\">\n  ";
  stack1 = depth0.thumbnail;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = depth0.metadata;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  stack1 = stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = depth0.input_file;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(14, program14, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = depth0.metadata;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.subtitle;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(19, program19, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n";
  stack1 = depth0.media_files;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(21, program21, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = depth0.start_allowed;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(23, program23, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = depth0.hasDetails;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(25, program25, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = depth0.output_files;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(48, program48, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = depth0.hasChapters;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(54, program54, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = depth0.outgoing_services;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(57, program57, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = depth0.hasAlgorithms;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(60, program60, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['default'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"logo\"></div>\n<ul>\n  <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Recording</a></li>\n  <li><a href=\"/production/source\" class=\"arrow\"><span></span>Create a new Production</a></li>\n  <li><a href=\"/preset/new\" class=\"arrow\"><span></span>Define a Preset</a></li>\n</ul>\n";});
templates['form-new-chapter'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\">\n      <input type=\"text\" name=\"start\" placeholder=\"00:00:00\" class=\"right\" data-required=\"1\" data-format-time=\"1\" data-matches=\"^([01]?\\d|2[0-3]):([0-5]\\d?)(:([0-5]\\d?(\\.(\\d{1,6})?)?)?)?$\" />\n      Start\n    </label>\n  </li>\n  <li>\n    <label class=\"left\">\n      <input type=\"text\" name=\"title\" class=\"right\" data-required=\"1\" />\n      Title\n    </label>\n  </li>\n</ul>\n";});
templates['form-new-main'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li>\n      <label";
  stack1 = depth0.isNewProduction;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n        ";
  stack1 = depth0.isNewProduction;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <span class=\"light\">";
  stack1 = depth0.service;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span> <small>";
  stack1 = depth0.input_file;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small>\n        ";
  stack1 = depth0.isNewProduction;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(10, program10, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </label>\n    </li>\n  ";
  return buffer;}
function program2(depth0,data) {
  
  
  return " class=\"info\"";}

function program4(depth0,data) {
  
  
  return "<span></span>";}

function program6(depth0,data) {
  
  var stack1;
  stack1 = depth0.service;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  return escapeExpression(stack1);}

function program8(depth0,data) {
  
  
  return "Upload";}

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <div class=\"hidden popover bottom justify\" data-position=\"bottom\">\n            <a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "source\" class=\"button expand\">Change Source</a>\n          </div>\n        ";
  return buffer;}

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.production;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(13, program13, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;}
function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "source\" class=\"arrow\"><span></span>Choose Source</a></li>\n    ";
  return buffer;}

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.isNewProduction;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(16, program16, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <li>\n      <label class=\"left\">\n        <input type=\"text\" name=\"title\" data-required=\"1\" value=\"";
  stack1 = depth0.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" placeholder=\"choose production title\" class=\"right\" />\n        Title\n      </label>\n    </li>\n  ";
  return buffer;}
function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = depth0.presets;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(17, program17, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}
function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li>\n          <label class=\"left\">\n            <select name=\"format\" class=\"preset-chooser right empty\" data-select-type=\"preserve-null-state\">\n              <option value=\"\" selected>No Preset</option>\n              ";
  stack1 = depth0.presets;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(18, program18, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n            <span class=\"right placeholder\">choose a preset</span>\n            Preset\n          </label>\n        </li>\n      ";
  return buffer;}
function program18(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <option value=\"";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0.preset_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</option>\n              ";
  return buffer;}

function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li>\n      <label class=\"left\">\n        <input type=\"text\" name=\"preset_name\" data-required=\"1\" value=\"";
  stack1 = depth0.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" placeholder=\"choose a preset name\" class=\"right\" />\n        Name\n      </label>\n    </li>\n  ";
  return buffer;}

function program22(depth0,data) {
  
  
  return "<small class=\"output_files_required\">(one is required)</small>";}

function program24(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<h1>Chapter Marks</h1>\n<ul class=\"chapter_marks\">\n  <li><a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "new/chapter\" class=\"plus\"><span></span>Add Chapter Mark</a></li>\n</ul>\n";
  return buffer;}

function program26(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"wide\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"ON\" data-off=\"OFF\"></span>\n            <input type=\"checkbox\" name=\"algorithms.";
  stack1 = depth0.key;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" value=\"1\"";
  stack1 = depth0.default_value;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(27, program27, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n          </div>\n        </div>\n      </div>\n      <label class=\"left info\">\n        ";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n        <div class=\"hidden popover top justify\" data-position=\"top\">\n          <h1>";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</h1>\n          ";
  stack1 = depth0.description;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n        </div>\n      </label>\n    </li>\n  ";
  return buffer;}
function program27(depth0,data) {
  
  
  return " checked=\"checked\"";}

  buffer += "<ul class=\"formcontent\">\n  ";
  stack1 = depth0.input_file;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(12, program12, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  ";
  stack1 = depth0.production;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(15, program15, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  ";
  stack1 = depth0.preset;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(20, program20, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  <li><a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "new/metadata\" class=\"arrow\"><span></span>Metadata</a></li>\n  <li><a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "new/outgoing_services\" class=\"arrow\"><span></span>Outgoing Transfers <small class=\"servicesCount light\"></small></a></li>\n</ul>\n\n<h1>Output Files ";
  stack1 = depth0.production;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(22, program22, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>\n<ul class=\"output_files\">\n  <li>\n    <label class=\"left\">\n      <input type=\"text\" name=\"output_basename\" value=\"";
  stack1 = depth0.output_basename;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" placeholder=\"file name prefix\" class=\"right\" />\n      Prefix\n    </label>\n  </li>\n  <li><a href=\"";
  stack1 = depth0.baseURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "new/output_file\" class=\"plus\"><span></span>Add Audio Format</a></li>\n</ul>\n\n";
  stack1 = depth0.production;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(24, program24, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<h1>Algorithms</h1>\n<ul class=\"formcontent\">\n  ";
  stack1 = depth0.algorithm;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(26, program26, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;});
templates['form-new-metadata'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " hidden";}

function program3(depth0,data) {
  
  
  return " hidden";}

  buffer += "<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.title\" class=\"right\" />Title</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.album\" class=\"right\" />Album</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.artist\" class=\"right\" />Artist</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"tel\" name=\"metadata.track\" class=\"right\" />Track</label>\n  </li>\n</ul>\n\n<h1>Cover Photo</h1>\n<img src=\"";
  stack1 = depth0.thumbnail;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.access_token;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.random;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"thumbnail";
  stack1 = depth0.thumbnail;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n<ul>\n  <li>\n    <label class=\"show-popover\">\n      Upload\n      <div class=\"hidden popover top justify\" data-position=\"top\">\n        <a href=\"#\" class=\"button expand upload_take_photo\">Take a Photo</a>\n        <a href=\"#\" class=\"button expand upload_from_library\">Choose from Libraray</a>\n      </div>\n    </label>\n  </li>\n  <li class=\"remove_thumbnail";
  stack1 = depth0.thumbnail;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    <a href=\"#\">Remove</a>\n  </li>\n</ul>\n\n<h1 class=\"clear\">Details</h1>\n<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.genre\" class=\"right\" />Genre</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"tel\" name=\"metadata.year\" class=\"right\" />Year</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.publisher\" class=\"right\" />Publisher</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.url\" class=\"right\" autocapitalize=\"off\" />URL</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.license\" placeholder=\"License etc.\" class=\"right\" />Copyright</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.license_url\" placeholder=\"URL\" autocapitalize=\"off\" class=\"right\" />License</label>\n  </li>\n  <li>\n    <label class=\"left\"><input type=\"text\" name=\"metadata.tags\" placeholder=\"comma separated\" class=\"right\" />Tags</label>\n  </li>\n  <li class=\"wide\">\n    <label class=\"left\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n            <input type=\"checkbox\" name=\"metadata.append_chapters\" value=\"1\" />\n          </div>\n        </div>\n      </div>\n      Append Chapters\n    </label>\n  </li>\n</ul>\n\n<h1>Subtitle <small>(max 255 characters)</small></h1>\n<ul class=\"formcontent\">\n  <li><textarea class=\"autogrow\" name=\"metadata.subtitle\"></textarea></li>\n</ul>\n<h1>Summary</h1>\n<ul class=\"formcontent\">\n  <li><textarea class=\"autogrow\" name=\"metadata.summary\"></textarea></li>\n</ul>\n";
  return buffer;});
templates['form-new-output-file-detail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n  <li class=\"wide\">\n    <label class=\"left\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n            <input type=\"checkbox\" name=\"mono_mixdown\" value=\"1\" />\n          </div>\n        </div>\n      </div>\n      Mono Mixdown\n    </label>\n  </li>\n  <li class=\"wide\">\n    <label class=\"left\">\n      <div class=\"right\">\n        <div class=\"checkbox\">\n          <div>\n            <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n            <input type=\"checkbox\" name=\"split_on_chapters\" value=\"1\" />\n          </div>\n        </div>\n      </div>\n      Split on Chapters\n    </label>\n  </li>\n";}

  stack1 = depth0.has_options;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<li>\n  <label class=\"left\">\n    <input type=\"text\" name=\"filename\" placeholder=\"optional\" class=\"right\" />\n    Filename\n  </label>\n</li>\n";
  return buffer;});
templates['form-new-output-file'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <optgroup label=\"";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">\n            ";
  stack1 = depth0.items;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </optgroup>\n        ";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <option value=\"";
  stack1 = depth0.value;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</option>\n            ";
  return buffer;}

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.items;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = depth0.has_options;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li data-output-file=\"";
  stack1 = depth0.value;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">\n          <label class=\"left\">\n            <select name=\"bitrate\" class=\"right small\">\n              ";
  stack1 = depth0.bitrate_format;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n            Bitrate\n          </label>\n        </li>\n      ";
  return buffer;}
function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <option value=\"";
  stack1 = depth0.value;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\"";
  stack1 = depth0.selected;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(8, program8, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</option>\n              ";
  return buffer;}
function program8(depth0,data) {
  
  
  return "selected=\"selected\"";}

  buffer += "<ul class=\"formcontent\">\n  <li>\n    <label class=\"left\">\n      <select name=\"format\" class=\"right empty\">\n        ";
  stack1 = depth0.formats;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </select>\n      <span class=\"right placeholder\">choose a format</span>\n      Format\n    </label>\n  </li>\n</ul>\n\n<ul class=\"bitrates hidden\">\n  ";
  stack1 = depth0.formats;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;});
templates['form-new-service'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"wide\">\n      <input type=\"hidden\" name=\"outgoing_services.";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".uuid\" value=\"";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" />\n      <label class=\"left\">\n        <div class=\"right\">\n          <div class=\"checkbox\">\n            <div>\n              <span class=\"left\"></span><span class=\"thumb\" data-on=\"ON\" data-off=\"OFF\"></span>\n              <input type=\"checkbox\" name=\"outgoing_services.";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".checked\" data-uuid=\"";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" value=\"1\" />\n            </div>\n          </div>\n        </div>\n        <small><span class=\"light\">";
  stack1 = depth0.display_type;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span> ";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small>\n      </label>\n    </li>\n  ";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = depth0.parameters;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;}
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"fade\" data-service-uuid=\"";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">\n      <h1>";
  stack1 = depth0.display_type;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + " - ";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</h1>\n      <ul>\n        ";
  stack1 = depth0.parameters;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n    </div>\n  ";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          ";
  stack1 = depth0.checkbox;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = depth0.select;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(9, program9, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = depth0.input;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(19, program19, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;}
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li class=\"wide\">\n              <label class=\"left\">\n                <div class=\"right\">\n                  <div class=\"checkbox\">\n                    <div>\n                      <span class=\"left\"></span><span class=\"thumb\" data-on=\"YES\" data-off=\"NO\"></span>\n                      <input type=\"checkbox\" name=\"outgoing_services.";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".";
  stack1 = depth0.key;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" value=\"1\" ";
  stack1 = depth0.default_value;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "/>\n                    </div>\n                  </div>\n                </div>\n                ";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n              </label>\n            </li>\n          ";
  return buffer;}
function program7(depth0,data) {
  
  
  return "checked=\"checked\"";}

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li>\n              <label class=\"left\">\n                <select name=\"outgoing_services.";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".";
  stack1 = depth0.key;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"right";
  stack1 = depth0.default_value;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(10, program10, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"";
  stack1 = depth0.hasEmptyOption;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(12, program12, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                  ";
  stack1 = depth0.options;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(14, program14, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                </select>\n                ";
  stack1 = depth0.default_value;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(17, program17, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                ";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n              </label>\n            </li>\n          ";
  return buffer;}
function program10(depth0,data) {
  
  
  return " empty";}

function program12(depth0,data) {
  
  
  return " data-select-type=\"preserve-null-state\"";}

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                    <option value=\"";
  stack1 = depth0.value;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\"";
  stack1 = depth0.selected;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(15, program15, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</option>\n                  ";
  return buffer;}
function program15(depth0,data) {
  
  
  return "selected=\"selected\"";}

function program17(depth0,data) {
  
  
  return "\n                  <span class=\"right placeholder\">select a value</span>\n                ";}

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li>\n              <label class=\"left\">\n                <input type=\"text\" name=\"outgoing_services.";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".";
  stack1 = depth0.key;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" value=\"";
  stack1 = depth0.default_value;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\"  class=\"right\" />\n                ";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n              </label>\n            </li>\n          ";
  return buffer;}

  buffer += "<ul class=\"formcontent\">\n  ";
  stack1 = depth0.service;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n";
  stack1 = depth0.service;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form action=\"/asdf/\" method=\"post\">\n  <input type=\"hidden\" name=\"client_id\" value=\"";
  stack1 = depth0.client_id;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" />\n  <input type=\"hidden\" name=\"client_secret\" value=\"";
  stack1 = depth0.client_secret;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" />\n  <div class=\"formcontent\">\n    <input type=\"text\" name=\"name\" placeholder=\"email or username\" autocapitalize=\"off\" />\n    <input type=\"password\" name=\"password\" placeholder=\"password\" />\n  </div>\n  <div>\n    <input type=\"submit\" name=\"submit\" value=\"Login\" />\n    <a href=\"";
  stack1 = depth0.registerURL;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" value=\"Register\" class=\"register button\">Register</a>\n  </div>\n</form>\n";
  return buffer;});
templates['preset'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " expanded";}

function program3(depth0,data) {
  
  
  return " expanded";}

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <br />\n      <span class=\"light small bold info-left\">\n        ";
  stack1 = depth0.short_info;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n      </span>\n    ";
  return buffer;}

  buffer += "<li class=\"swipeable show-popover\" data-popover-event=\"touchhold\" data-api-url=\"preset/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" data-method=\"delete\">\n  <span class=\"right removable";
  stack1 = depth0.short_info;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    <span><a href=\"#\" class=\"button red small\">Delete</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a href=\"/preset/edit/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"button expand\">Edit</a>\n    <a href=\"#\" class=\"button expand red deleteable\">Delete</a>\n  </div>\n  <a href=\"/preset/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow ";
  stack1 = depth0.short_info;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    <span></span>\n    ";
  stack1 = depth0.preset_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n    ";
  stack1 = depth0.short_info;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n</li>\n";
  return buffer;});
templates['presets'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul class=\"preset_container expand load-more\">\n    ";
  stack1 = depth0.preset;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials.preset, 'preset', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">You have no presets yet.</h1>\n  <p class=\"null\">A preset helps you predefine settings like metadata or output files for new productions, speeding up the production-flow when only few values change.</p>\n  <ul>\n    <li><a href=\"/preset/new\" class=\"arrow\"><span></span>Define a new Preset</a></li>\n  </ul>\n";}

  stack1 = depth0.preset;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['production'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"show-popover\" data-popover-event=\"touchhold\">\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a href=\"/production/edit/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"button expand\">Edit</a>\n  </div>\n  <a href=\"/production/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow expanded\">\n    <span></span>\n    ";
  stack1 = depth0.metadata;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "<br />\n    <span class=\"small bold info-left\">\n      ";
  stack1 = depth0.short_status_string;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + " <span class=\"light\">";
  stack1 = depth0.short_info;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n    </span>\n  </a>\n</li>\n";
  return buffer;});
templates['productions'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul class=\"production_container expand load-more\">\n    ";
  stack1 = depth0.production;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials.production, 'production', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">You have not created any productions yet</h1>\n  <ul>\n    <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Recording</a></li>\n    <li><a href=\"/production/source\" class=\"arrow\"><span></span>Create a new Production</a></li>\n  </ul>\n";}

  stack1 = depth0.production;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['record-audio'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<ul class=\"record_button\">\n  <li><a href=\"/production/recording/new-audio-start\">Start Recording</a></li>\n</ul>\n<ul class=\"stop_record_button hidden\">\n  <li><span class=\"record_status right light\"></span><a href=\"/production/recording/stop\">Stop recording</a></li>\n</ul>\n";});
templates['recording'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul>\n  ";
  stack1 = depth0.recordings;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li><a href=\"/production/recording/";
  stack1 = depth0.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow\"><span></span>";
  stack1 = depth0.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a></li>\n  ";
  return buffer;}

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">You have no recent recordings.</h1>\n  <ul>\n    <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Recording</a></li>\n  </ul>\n";}

  stack1 = depth0.recordings;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['service-choose'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li><a href=\"/production/source/";
  stack1 = depth0.uuid;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow\"><span></span><span class=\"light\">";
  stack1 = depth0.display_type;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span> <small>";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small></a></li>\n  ";
  return buffer;}

  buffer += "<ul>\n  <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>New Audio Recording</a></li>\n  <li><a href=\"/production/recording/new-video\" class=\"arrow\"><span></span>New Video Recording</a></li>\n  ";
  stack1 = depth0.source;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;});
templates['service-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <ul>\n    ";
  stack1 = depth0.files;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <li><a href=\"/production/selectFile/";
  stack1 = depth0.index;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow\"><span></span>";
  stack1 = depth0.display_name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a></li>\n    ";
  return buffer;}

function program4(depth0,data) {
  
  
  return "\n  <h1 class=\"null\">No files found</h1>\n  <p class=\"null\">There are no files on this input source. Please upload a file to this service or start a new recording from within the application.</p>\n  <ul>\n    <li><a href=\"/production/source\" class=\"arrow\"><span></span>Select an input source</a></li>\n    <li><a href=\"/production/recording/new-audio\" class=\"arrow\"><span></span>Start a new Recording</a></li>\n  </ul>\n";}

  stack1 = depth0.files;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['settings'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul>\n  <li><a href=\"/settings/about\" class=\"arrow\"><span></span>About</a></li>\n  <li><a href=\"";
  stack1 = depth0.feedback;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"share\"><span></span>Feedback</a></li>\n</ul>\n\n<ul>\n  <li><span class=\"right\">";
  stack1 = depth0.user;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span><label class=\"left\">User</label></li>\n</ul>\n\n<a href=\"/logout\" class=\"button red expand\">Logout</a>\n";
  return buffer;});
templates['ui-action'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"";
  stack1 = depth0.url;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"button-right hidden\" data-hit-target=\"1\"><span class=\"button\" title=\"";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></a>\n";
  return buffer;});
templates['ui-back'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"#\" class=\"button-left\" data-hit-target=\"1\"><span class=\"button\" title=\"";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></a>\n";
  return buffer;});
templates['ui-removable-chapter-list-item'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"swipeable show-popover\" data-popover-event=\"touchhold\">\n  <span class=\"right removable\">\n    <span><a href=\"#\" class=\"button red small\">";
  stack1 = depth0.label;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a href=\"#\" class=\"button expand red deleteable\">";
  stack1 = depth0.label;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a>\n  </div>\n  <a href=\"";
  stack1 = depth0.href;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow\"><span></span><small class=\"light\">";
  stack1 = depth0.start;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small> ";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a>\n</li>\n";
  return buffer;});
templates['ui-removable-list-item'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " <small class=\"light\">";
  stack1 = depth0.detail;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</small>";
  return buffer;}

  buffer += "<li class=\"swipeable show-popover\" data-popover-event=\"touchhold\">\n  <span class=\"right removable\">\n    <span><a href=\"#\" class=\"button red small\">";
  stack1 = depth0.label;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a></span>\n  </span>\n  <div class=\"hidden popover top justify\" data-position=\"top\">\n    <a href=\"#\" class=\"button expand red deleteable\">";
  stack1 = depth0.label;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a>\n  </div>\n  <a href=\"";
  stack1 = depth0.href;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\" class=\"arrow\"><span></span>";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1);
  stack1 = depth0.detail;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n</li>\n";
  return buffer;});
templates['ui-title'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1 title=\"";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0.title;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</h1>\n";
  return buffer;});
