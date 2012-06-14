/*
---

name: Router

description: Router for client side web apps based on CrossroadsJS (http://millermedeiros.github.com/crossroads.js), adapted to MooTools.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Class.Extras, Core/Object]

provides: Router

...
*/

var Core = require('Core');
var typeOf = Core.typeOf;
var Class = Core.Class;
var Events = Core.Events;
var Options = Core.Options;

var Route = new Class({

  Implements: Events,

  _greedy: false,
  _paramIds: null,
  _optionalParamsIds: null,
  _matchRegexp: null,
  _priority: 0,

  initialize: function(pattern, callback, priority, router) {
    this._router = router;
    this._pattern = pattern;
    this._matchRegexp = pattern;
    this._rules = {};

    if (typeOf(pattern) != 'regexp') {
      var lexer = router.getLexer();
      this._paramsIds = lexer.getParamIds(this._pattern);
      this._optionalParamsIds = lexer.getOptionalParamsIds(this._pattern);
      this._matchRegexp = lexer.compilePattern(pattern);
    }

    if (callback) this.addEvent('match', callback);
    if (priority) this._priority = priority;
  },

  match: function(request) {
    return this._matchRegexp.test(request) && this._validateParams(request);
  },

  setNormalizer: function(fn) {
    this.normalizer = fn;
    return this;
  },

  setGreedy: function(value) {
    this._greedy = !!value;
    return this;
  },

  isGreedy: function() {
    return this._greedy;
  },

  addRule: function(name, rule) {
    this._rules[name] = rule;
    return this;
  },

  addRules: function(rules) {
    Object.append(this._rules, rules);
    return this;
  },

  _validateParams: function(request) {
    var values = this._getParamsObject(request);
    return Object.every(this._rules, function(value, key) {
      if (!this._isValidParam(request, key, values)) return false;

      return true;
    }, this);
  },

  _isValidParam: function(request, key, values) {
    var validationRule = this._rules[key],
      type = typeOf(validationRule),
      val = values[key];

    if (!val && this._optionalParamsIds && this._optionalParamsIds.indexOf(key) !== -1) return true;
    else if (type == 'regexp') return validationRule.test(val);
    else if (type == 'array') return (validationRule.indexOf(val) !== -1);
    else if (type == 'function') return validationRule(val, request, values);

    return false;
  },

  _getParamsObject: function(request) {
    var values = this._router.getLexer().getParamValues(request, this._matchRegexp),
      o = {},
      n = values.length;
    while (n--) {
      o[n] = values[n]; //for RegExp pattern and also alias to normal paths
      if (this._paramsIds) o[this._paramsIds[n]] = values[n];
    }
    o.request_ = request;
    o.vals_ = values;
    return o;
  },

  _getParamsArray: function(request) {
    var norm = this.normalizer;

    if (!norm && this._router.options.normalizeFn) norm = this._router.options.normalizeFn;
    if (norm) return norm(request, this._getParamsObject(request));

    return this._router.getLexer().getParamValues(request, this._matchRegexp);
  }

});

var Router = module.exports = new Class({

  Implements: [Options, Events],

  options: {
    normalizeFn: null,
    lexer: null
  },

  initialize: function(options) {
    this.setOptions(options);

    this._lexer = this.options.lexer || Router.getDefaultLexer();
    this._routes = [];
    this._prevRoutes = [];
  },

  add: function(pattern, callback, priority) {
    var route = new Route(pattern, callback, priority, this);
    this._sortedInsert(route);
    return route;
  },

  remove: function(route) {
    var i = this._routes.indexOf(route);
    if (i !== -1) this._routes.splice(i, 1);
  },

  removeAll: function() {
    this._routes.length = 0;
  },

  parse: function(request, args) {
    request = request || '';
    if (!args) args = [];

    var routes = this._getMatchedRoutes(request),
      i = 0,
      n = routes.length,
      cur;

    if (n) {
      this._notifyPrevRoutes(request);
      this._prevRoutes = routes;
      //shold be incremental loop, execute routes in order
      while (i < n) {
        cur = routes[i];
        cur.route.fireEvent('match', args.concat(cur.params));
        cur.isFirst = !i;
        this.fireEvent('match', args.concat([request, cur]));
        i += 1;
      }

      return;
    }

    this.fireEvent('default', args.concat([request]));
  },

  _notifyPrevRoutes: function(request) {
    var i = 0, cur;
    while ((cur = this._prevRoutes[i++]))
      cur.route.fireEvent('pass', request);
  },

  _sortedInsert: function(route) {
    //simplified insertion sort
    var routes = this._routes,
      n = routes.length;
    do { --n; } while (routes[n] && route._priority <= routes[n]._priority);
    routes.splice(n + 1, 0, route);
  },

  _getMatchedRoutes: function(request) {
    var res = [],
      routes = this._routes,
      n = routes.length,
      route;

    while ((route = routes[--n])) {
      if ((!res.length || route.isGreedy()) && route.match(request)) {
        res.push({
          route: route,
          params: route._getParamsArray(request)
        });
      }
    }
    return res;
  },

  getLexer: function() {
    return this._lexer;
  }

});

var ESCAPE_CHARS_REGEXP = /[\\.+*?\^$\[\](){}\/'#]/g, //match chars that should be escaped on string regexp
  UNNECESSARY_SLASHES_REGEXP = /\/$/g, //trailing slash
  OPTIONAL_SLASHES_REGEXP = /([:}]|\w(?=\/))\/?(:)/g, //slash between `::` or `}:` or `\w:`. $1 = before, $2 = after
  REQUIRED_SLASHES_REGEXP = /([:}])\/?(\{)/g, //used to insert slash between `:{` and `}{`

  REQUIRED_PARAMS_REGEXP = /\{([^}]+)\}/g, //match everything between `{ }`
  OPTIONAL_PARAMS_REGEXP = /:([^:]+):/g, //match everything between `: :`
  PARAMS_REGEXP = /(?:\{|:)([^}:]+)(?:\}|:)/g, //capture everything between `{ }` or `: :`
  REQUIRED_REST = /\{([^}]+)\*\}/g,
  OPTIONAL_REST = /:([^:]+)\*:/g,

  //used to save params during compile (avoid escaping things that
  //shouldn't be escaped).
  SAVE_REQUIRED_PARAMS = '__MR_RP__',
  SAVE_OPTIONAL_PARAMS = '__MR_OP__',
  SAVE_REQUIRED_REST = '__MR_RR__',
  SAVE_OPTIONAL_REST = '__MR_OR__',
  SAVE_REQUIRED_SLASHES = '__MR_RS__',
  SAVE_OPTIONAL_SLASHES = '__MR_OS__',
  SAVED_REQUIRED_REGEXP = new RegExp(SAVE_REQUIRED_PARAMS, 'g'),
  SAVED_OPTIONAL_REGEXP = new RegExp(SAVE_OPTIONAL_PARAMS, 'g'),
  SAVED_REQUIRED_REST_REGEXP = new RegExp(SAVE_REQUIRED_REST, 'g'),
  SAVED_OPTIONAL_REST_REGEXP = new RegExp(SAVE_OPTIONAL_REST, 'g'),
  SAVED_OPTIONAL_SLASHES_REGEXP = new RegExp(SAVE_OPTIONAL_SLASHES, 'g'),
  SAVED_REQUIRED_SLASHES_REGEXP = new RegExp(SAVE_REQUIRED_SLASHES, 'g');

function captureVals(regex, pattern) {
  var vals = [], match;
  while ((match = regex.exec(pattern)))
    vals.push(match[1]);
  return vals;
}

function tokenize(pattern) {
  //save chars that shouldn't be escaped
  return pattern.replace(OPTIONAL_SLASHES_REGEXP, '$1' + SAVE_OPTIONAL_SLASHES + '$2')
    .replace(REQUIRED_SLASHES_REGEXP, '$1' + SAVE_REQUIRED_SLASHES + '$2')
    .replace(OPTIONAL_REST, SAVE_OPTIONAL_REST)
    .replace(REQUIRED_REST, SAVE_REQUIRED_REST)
    .replace(OPTIONAL_PARAMS_REGEXP, SAVE_OPTIONAL_PARAMS)
    .replace(REQUIRED_PARAMS_REGEXP, SAVE_REQUIRED_PARAMS);
}

function untokenize(pattern) {
  return pattern.replace(SAVED_OPTIONAL_SLASHES_REGEXP, '\\/?')
    .replace(SAVED_REQUIRED_SLASHES_REGEXP, '\\/')
    .replace(SAVED_OPTIONAL_REST_REGEXP, '(.*)?') // optional group to avoid passing empty string as captured
    .replace(SAVED_REQUIRED_REST_REGEXP, '(.+)')
    .replace(SAVED_OPTIONAL_REGEXP, '([^\\/]+)?\/?')
    .replace(SAVED_REQUIRED_REGEXP, '([^\\/]+)');
}

var lexer = {

  getParamIds: function(pattern) {
    return captureVals(PARAMS_REGEXP, pattern);
  },

  getOptionalParamsIds: function(pattern) {
    return captureVals(OPTIONAL_PARAMS_REGEXP, pattern);
  },

  getParamValues: function(request, regexp) {
    var vals = regexp.exec(request);
    if (vals) vals.shift();
    return vals;
  },

  compilePattern: function(pattern) {
    pattern = pattern || '';
    if (pattern) {
      pattern = tokenize(pattern.replace(UNNECESSARY_SLASHES_REGEXP, ''));
      pattern = untokenize(pattern.replace(ESCAPE_CHARS_REGEXP, '\\$&'));
    }
    return new RegExp('^' + pattern + '/?$'); //trailing slash is optional
  }

};

Router.getDefaultLexer = function() {
  return lexer;
};

