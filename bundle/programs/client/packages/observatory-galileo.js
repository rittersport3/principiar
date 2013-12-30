//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Observatory, __coffeescriptShare;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/observatory-galileo/src/Observatory.coffee.js                                                    //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
/*

  # Commented out for Meteor usage

require = if Npm? then Npm.require else require
_ = require 'underscore'
*/

var _ref,             
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Observatory = Observatory != null ? Observatory : {};

_.extend(Observatory, {
  LOGLEVEL: {
    SILENT: -1,
    FATAL: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    VERBOSE: 4,
    DEBUG: 5,
    MAX: 6,
    NAMES: ["FATAL", "ERROR", "WARNING", "INFO", "VERBOSE", "DEBUG", "MAX"]
  },
  settings: {
    maxSeverity: 3,
    printToConsole: true
  },
  initialize: function(settings) {
    var f, _i, _len, _ref, _results;
    _ref = this._initFunctions;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      _results.push(f.call(this, settings));
    }
    return _results;
  },
  registerInitFunction: function(f) {
    return this._initFunctions.push(f);
  },
  _initFunctions: [
    function(s) {
      var _ref;
      this._loggers = [];
      this.emitters = {};
      if (s != null) {
        this.settings.maxSeverity = s.logLevel != null ? this.LOGLEVEL[s.logLevel] : 3;
        this.settings.printToConsole = (_ref = s.printToConsole) != null ? _ref : true;
      }
      this._consoleLogger = new Observatory.ConsoleLogger('default');
      if (this.settings.printToConsole) {
        this.subscribeLogger(this._consoleLogger);
      }
      this._defaultEmitter = new Observatory.Toolbox('Toolbox');
      this.emitters.Toolbox = this._defaultEmitter;
      return this.emitters.Toolbox.maxSeverity = this.settings.maxSeverity;
    }
  ],
  setSettings: function(s) {
    var _ref;
    if (s.maxSeverity != null) {
      this.settings.maxSeverity = s.maxSeverity;
    } else {
      if (s.logLevel != null) {
        this.settings.maxSeverity = s.logLevel;
      }
    }
    if ((_ref = this.emitters.Toolbox) != null) {
      _ref.maxSeverity = this.settings.maxSeverity;
    }
    if ((s.printToConsole != null) && (s.printToConsole !== this.settings.printToConsole)) {
      this.settings.printToConsole = s.printToConsole;
      if (s.printToConsole === true) {
        return this.subscribeLogger(this._consoleLogger);
      } else {
        return this.unsubscribeLogger(this._consoleLogger);
      }
    }
  },
  getDefaultLogger: function() {
    return this._defaultEmitter;
  },
  getToolbox: function() {
    return this._defaultEmitter;
  },
  isServer: function() {
    return !(typeof window !== "undefined" && window.document);
  },
  formatters: {
    basicFormatter: function(options) {
      var _ref;
      return {
        timestamp: new Date,
        severity: options.severity,
        textMessage: options.message,
        module: options.module,
        object: (_ref = options.object) != null ? _ref : options.obj,
        isServer: Observatory.isServer(),
        type: options.type
      };
    }
  },
  viewFormatters: {
    _convertDate: function(timestamp, long) {
      var ds;
      if (long == null) {
        long = false;
      }
      ds = timestamp.getUTCDate() + '/' + (timestamp.getUTCMonth() + 1);
      if (long) {
        ds = ds + +'/' + timestamp.getUTCFullYear();
      }
      return ds;
    },
    _convertTime: function(timestamp, ms) {
      var ts;
      if (ms == null) {
        ms = true;
      }
      ts = timestamp.getUTCHours() + ':' + timestamp.getUTCMinutes() + ':' + timestamp.getUTCSeconds();
      if (ms) {
        ts += '.' + timestamp.getUTCMilliseconds();
      }
      return ts;
    },
    _ps: function(s) {
      return '[' + s + ']';
    },
    basicConsole: function(o) {
      var full_message, t, ts;
      t = Observatory.viewFormatters;
      ts = t._ps(t._convertDate(o.timestamp)) + t._ps(t._convertTime(o.timestamp));
      full_message = ts + (o.isServer ? "[SERVER]" : "[CLIENT]");
      full_message += o.module ? t._ps(o.module) : "[]";
      full_message += t._ps(Observatory.LOGLEVEL.NAMES[o.severity]);
      full_message += " " + o.textMessage;
      if (o.object != null) {
        full_message += " | " + (JSON.stringify(o.object));
      }
      return full_message;
    }
  },
  _loggers: [],
  getLoggers: function() {
    return this._loggers;
  },
  subscribeLogger: function(logger) {
    return this._loggers.push(logger);
  },
  unsubscribeLogger: function(logger) {
    return this._loggers = _.without(this._loggers, logger);
  }
});

Observatory.MessageEmitter = (function() {
  var _loggers;

  _loggers = [];

  MessageEmitter.prototype._getLoggers = function() {
    return this._loggers;
  };

  function MessageEmitter(name, formatter) {
    this.name = name;
    this.formatter = formatter;
    this._loggers = [];
    this.isOn = true;
    this.isOff = false;
  }

  MessageEmitter.prototype.turnOn = function() {
    this.isOn = true;
    return this.isOff = false;
  };

  MessageEmitter.prototype.turnOff = function() {
    this.isOn = false;
    return this.isOff = true;
  };

  MessageEmitter.prototype.subscribeLogger = function(logger) {
    return this._loggers.push(logger);
  };

  MessageEmitter.prototype.unsubscribeLogger = function(logger) {
    return this._loggers = _.without(this._loggers, logger);
  };

  MessageEmitter.prototype.emitMessage = function(message, buffer) {
    var l, _i, _j, _len, _len1, _ref, _ref1;
    if (buffer == null) {
      buffer = false;
    }
    if (!this.isOn) {
      return;
    }
    _ref = Observatory.getLoggers();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      l.addMessage(message, buffer);
    }
    if (this._loggers.length > 0) {
      _ref1 = this._loggers;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        l = _ref1[_j];
        l.addMessage(message, buffer);
      }
    }
    return message;
  };

  MessageEmitter.prototype.emitFormattedMessage = function(message, buffer) {
    if (buffer == null) {
      buffer = false;
    }
    if (this.isOn && (this.formatter != null) && (typeof this.formatter === 'function')) {
      this.emitMessage(this.formatter(message), buffer);
    }
    return message;
  };

  return MessageEmitter;

})();

Observatory.Logger = (function() {
  var messageBuffer;

  messageBuffer = [];

  function Logger(name, formatter, useBuffer, interval) {
    this.name = name;
    this.formatter = formatter != null ? formatter : Observatory.viewFormatters.basicConsole;
    this.useBuffer = useBuffer != null ? useBuffer : false;
    this.interval = interval != null ? interval : 3000;
    if (typeof formatter === 'boolean') {
      this.interval = this.useBuffer;
      this.useBuffer = this.formatter;
      this.formatter = Observatory.viewFormatters.basicConsole;
    }
    this.messageBuffer = [];
  }

  Logger.prototype.messageAcceptable = function(m) {
    return (m != null) && (m.timestamp != null) && (m.severity != null) && (m.isServer != null) && ((m.textMessage != null) || (m.htmlMessage != null));
  };

  Logger.prototype.addMessage = function(message, useBuffer) {
    if (useBuffer == null) {
      useBuffer = false;
    }
    if (!this.messageAcceptable(message)) {
      throw new Error("Unacceptable message format in logger: " + this.name);
    }
    if (this.useBuffer || useBuffer) {
      return this.messageBuffer.push(message);
    } else {
      return this.log(message);
    }
  };

  Logger.prototype.log = function(message) {
    throw new Error("log() function needs to be overriden to perform actual output!");
  };

  Logger.prototype.processBuffer = function() {
    var obj, _i, _len, _ref;
    if (!(this.messageBuffer.length > 0)) {
      return;
    }
    _ref = this.messageBuffer;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      this.log(obj);
    }
    return this.messageBuffer = [];
  };

  return Logger;

})();

Observatory.GenericEmitter = (function(_super) {
  __extends(GenericEmitter, _super);

  function GenericEmitter(name, maxSeverity, formatter) {
    var i, m, _i, _len, _ref;
    this.maxSeverity = maxSeverity;
    if ((formatter != null) && typeof formatter === 'function') {
      this.formatter = formatter;
    } else {
      this.formatter = Observatory.formatters.basicFormatter;
    }
    GenericEmitter.__super__.constructor.call(this, name, this.formatter);
    _ref = ['fatal', 'error', 'warn', 'info', 'verbose', 'debug', 'insaneVerbose'];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      m = _ref[i];
      this[m] = this._emitWithSeverity.bind(this, i);
    }
  }

  GenericEmitter.prototype.trace = function(error, msg, module) {
    var message, _ref;
    message = msg + '\n' + ((_ref = error.stack) != null ? _ref : error);
    return this._emitWithSeverity(Observatory.LOGLEVEL.ERROR, message, error, module);
  };

  GenericEmitter.prototype._forceEmitWithSeverity = function(severity, message, obj, module, type, buffer) {
    var options;
    if (buffer == null) {
      buffer = false;
    }
    if (typeof message === 'object') {
      buffer = type;
      type = module;
      module = obj;
      obj = message;
      message = JSON.stringify(obj);
    }
    if (typeof obj === 'string') {
      buffer = type;
      type = module;
      module = obj;
      obj = null;
    }
    options = {
      severity: severity,
      message: message,
      object: obj,
      type: type,
      module: module != null ? module : this.name
    };
    return this.emitMessage(this.formatter(options), buffer);
  };

  GenericEmitter.prototype._emitWithSeverity = function(severity, message, obj, module, type, buffer) {
    if (buffer == null) {
      buffer = false;
    }
    if ((severity == null) || (severity > this.maxSeverity)) {
      return false;
    }
    return this._forceEmitWithSeverity(severity, message, obj, module, type, buffer);
  };

  return GenericEmitter;

})(Observatory.MessageEmitter);

Observatory.ConsoleLogger = (function(_super) {
  __extends(ConsoleLogger, _super);

  function ConsoleLogger() {
    _ref = ConsoleLogger.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ConsoleLogger.prototype.log = function(m) {
    return console.log(this.formatter(m));
  };

  ConsoleLogger.prototype.addMessage = function(message, useBuffer) {
    if (!this.messageAcceptable(message)) {
      throw new Error("Unacceptable message format in logger: " + this.name);
    }
    return this.log(message);
  };

  return ConsoleLogger;

})(Observatory.Logger);

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/observatory-galileo/src/Toolbox.coffee.js                                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
/*

  # Commented out for Meteor usage

if require?
  Observatory = (require './Observatory.coffee').Observatory
  {MessageEmitter, GenericEmitter, Logger, ConsoleLogger, LOGLEVEL} = Observatory
*/

var _ref,             
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Observatory = Observatory != null ? Observatory : {};

Observatory.Toolbox = (function(_super) {
  __extends(Toolbox, _super);

  function Toolbox() {
    this.exec = __bind(this.exec, this);
    _ref = Toolbox.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Toolbox.prototype.exec = function(f, options) {
    var e, obj, ret, t, t2;
    if (options == null) {
      options = {
        errors: true,
        profile: true,
        profileLoglevel: 'INFO',
        message: "exec() call",
        module: 'profiler'
      };
    }
    if (typeof f !== 'function') {
      this.error("Tried to call exec() without a function as an argument");
      return;
    }
    obj = {
      "function": f.toString(),
      type: 'profile'
    };
    if (options.profile) {
      this._emitWithSeverity(Observatory.LOGLEVEL[options.profileLoglevel], options.message + " starting for " + obj["function"], options.module);
    }
    if (options.errors) {
      try {
        t = Date.now();
        ret = f.call(this);
        t2 = Date.now() - t;
      } catch (_error) {
        e = _error;
        t2 = Date.now() - t;
        this.trace(e);
      }
    } else {
      t = Date.now();
      ret = f.call(this);
      t2 = Date.now() - t;
    }
    if (options.profile) {
      this.profile(options.message + (" done in " + t2 + " ms"), t2, obj, module, options.profileLoglevel);
    }
    return ret;
  };

  Toolbox.prototype.profile = function(message, time, object, module, severity, buffer) {
    if (module == null) {
      module = 'profiler';
    }
    if (severity == null) {
      severity = 'VERBOSE';
    }
    if (buffer == null) {
      buffer = false;
    }
    object = object != null ? object : {};
    object.timeElapsed = time;
    return this._emitWithSeverity(Observatory.LOGLEVEL[severity], message, object, module, 'profile');
  };

  Toolbox.prototype.inspect = function(obj, long, print) {
    var it, k, ret, t, v, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
    if (long == null) {
      long = true;
    }
    if (print == null) {
      print = false;
    }
    ret = {
      functions: [],
      objects: [],
      vars: []
    };
    for (k in obj) {
      v = obj[k];
      switch (typeof v) {
        case 'function':
          ret.functions.push({
            key: k,
            value: v
          });
          break;
        case 'object':
          ret.objects.push({
            key: k,
            value: v
          });
          break;
        default:
          ret.vars.push({
            key: k,
            value: v
          });
      }
    }
    if (print) {
      _ref1 = ['functions', 'objects', 'vars'];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        t = _ref1[_i];
        if (ret[t].length > 0) {
          console.log("****** PRINTING " + t + " ***********");
        }
        if (long) {
          _ref2 = ret[t];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            it = _ref2[_j];
            console.log("" + it.key + ": " + it.value);
          }
        } else {
          _ref3 = ret[t];
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            it = _ref3[_k];
            console.log(it.key);
          }
        }
      }
    }
    return ret;
  };

  return Toolbox;

})(Observatory.GenericEmitter);

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['observatory-galileo'] = {
  Observatory: Observatory
};

})();

//# sourceMappingURL=894ef6408d452a2cbdcd2436a6f5e5653ccfce5e.map
