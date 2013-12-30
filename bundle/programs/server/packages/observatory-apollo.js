(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var Deps = Package.deps.Deps;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var MongoInternals = Package['mongo-livedata'].MongoInternals;
var Handlebars = Package.handlebars.Handlebars;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;

/* Package-scope variables */
var TLog, Observatory, __coffeescriptShare;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/server/ObservatoryServer.coffee.js                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _ref;             

Observatory = (_ref = this.Observatory) != null ? _ref : {};

Observatory.Server = (function() {
  function Server() {}

  Server.prototype.handshake = function() {
    var o;
    return o = {
      version: Observatory.version,
      settings: Observatory.settings,
      monitoring: Observatory.emitters.Monitor.isRunning,
      heartbeat: this.heartbeat()
    };
  };

  Server.prototype.heartbeat = function() {
    var _ref1;
    this.monitor = (_ref1 = this.monitor) != null ? _ref1 : new Observatory.MonitoringEmitter;
    return this.monitor.measure();
  };

  Server.prototype.publish = function(func) {
    var canPublish;
    canPublish = func != null ? func.call(this, this.userId) : true;
    if (!canPublish) {
      return;
    }
    Meteor.publish(Observatory.settings.logsCollectionName, function(numInPage, pageNumber) {
      var cl, cr;
      if (numInPage == null) {
        numInPage = 300;
      }
      if (pageNumber == null) {
        pageNumber = 0;
      }
      cl = Observatory.getMeteorLogger()._logsCollection;
      return cr = cl.find({
        type: {
          $ne: 'monitor'
        }
      }, {
        sort: {
          timestamp: -1
        },
        limit: numInPage
      });
    });
    Meteor.publish('_observatory_monitoring', function(numInPage, pageNumber) {
      var cl, handle,
        _this = this;
      if (numInPage == null) {
        numInPage = 100;
      }
      if (pageNumber == null) {
        pageNumber = 0;
      }
      cl = Observatory.getMeteorLogger()._logsCollection;
      handle = cl.find({
        type: 'monitor'
      }, {
        sort: {
          timestamp: -1
        },
        limit: numInPage
      }).observe({
        added: function(doc) {
          return _this.added('_observatory_monitoring', doc._id, doc);
        }
      });
      this.ready();
      return this.onStop = function() {
        return handle.stop();
      };
    });
    Meteor.publish('_observatory_http_logs', function(numInPage, pageNumber) {
      var cl, handle,
        _this = this;
      if (numInPage == null) {
        numInPage = 100;
      }
      if (pageNumber == null) {
        pageNumber = 0;
      }
      cl = Observatory.getMeteorLogger()._logsCollection;
      handle = cl.find({
        module: 'HTTP'
      }, {
        sort: {
          timestamp: -1
        },
        limit: numInPage
      }).observe({
        added: function(doc) {
          return _this.added('_observatory_http_logs', doc._id, doc);
        }
      });
      this.ready();
      return this.onStop = function() {
        return handle.stop();
      };
    });
    return Meteor.publish('_observatory_errors', function(numInPage, pageNumber) {
      var cl, handle,
        _this = this;
      if (numInPage == null) {
        numInPage = 100;
      }
      if (pageNumber == null) {
        pageNumber = 0;
      }
      cl = Observatory.getMeteorLogger()._logsCollection;
      handle = cl.find({
        severity: {
          $lte: 1
        }
      }, {
        sort: {
          timestamp: -1
        },
        limit: numInPage
      }).observe({
        added: function(doc) {
          return _this.added('_observatory_errors', doc._id, doc);
        }
      });
      this.ready();
      return this.onStop = function() {
        return handle.stop();
      };
    });
  };

  return Server;

})();

Meteor.methods({
  _observatoryHeartbeat: function() {
    return Observatory.meteorServer.heartbeat();
  },
  _observatoryHandshake: function() {
    return Observatory.meteorServer.handshake();
  }
});

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/server/DDPEmitter.coffee.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
/*
                            { _session:
I20130905-05:17:30.934(2)?    { session_id: undefined,
I20130905-05:17:30.934(2)?      heartbeat_delay: 25000,
I20130905-05:17:30.934(2)?      disconnect_delay: 60000,
I20130905-05:17:30.934(2)?      prefix: '/sockjs',
I20130905-05:17:30.934(2)?      send_buffer: [],
I20130905-05:17:30.934(2)?      is_closing: false,
I20130905-05:17:30.935(2)?      readyState: 1,
I20130905-05:17:30.935(2)?      timeout_cb: [Function],
I20130905-05:17:30.935(2)?      to_tref:
I20130905-05:17:30.935(2)?       { _idleTimeout: 25000,
I20130905-05:17:30.935(2)?         _idlePrev: [Object],
I20130905-05:17:30.935(2)?         _idleNext: [Object],
I20130905-05:17:30.935(2)?         _onTimeout: [Function],
I20130905-05:17:30.936(2)?         _idleStart: Thu Sep 05 2013 05:17:30 GMT+0200 (CEST) },
I20130905-05:17:30.936(2)?      connection: [Circular],
I20130905-05:17:30.936(2)?      emit_open: null,
I20130905-05:17:30.936(2)?      recv:
I20130905-05:17:30.936(2)?       { ws: [Object],
I20130905-05:17:30.936(2)?         connection: [Object],
I20130905-05:17:30.936(2)?         thingy: [Object],
I20130905-05:17:30.936(2)?         thingy_end_cb: [Function],
I20130905-05:17:30.937(2)?         session: [Circular] } },
I20130905-05:17:30.937(2)?   id: '166cd531-78c6-46de-ab03-bcbbffcc211a',
I20130905-05:17:30.937(2)?   headers:
I20130905-05:17:30.937(2)?    { 'x-forwarded-for': '127.0.0.1',
I20130905-05:17:30.937(2)?      host: 'localhost:3000',
I20130905-05:17:30.937(2)?      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1612.2 Safari/537.36' },
I20130905-05:17:30.937(2)?   prefix: '/sockjs',
I20130905-05:17:30.937(2)?   remoteAddress: '127.0.0.1',
I20130905-05:17:30.937(2)?   remotePort: 60091,
I20130905-05:17:30.938(2)?   address: { address: '127.0.0.1', family: 'IPv4', port: 3001 },
I20130905-05:17:30.938(2)?   url: '/sockjs/649/gd5r5hlq/websocket',
I20130905-05:17:30.938(2)?   pathname: '/sockjs/649/gd5r5hlq/websocket',
I20130905-05:17:30.938(2)?   protocol: 'websocket',
I20130905-05:17:30.938(2)?   send: [Function],
I20130905-05:17:30.938(2)?   _events:
I20130905-05:17:30.938(2)?    { close: [ [Function], [Function], [Function] ],
I20130905-05:17:30.938(2)?      data: [ [Function], [Function] ] },
I20130905-05:17:30.939(2)?   meteor_session:
I20130905-05:17:30.939(2)?    { id: 'D3zzXacJbKvnNTnnx',
I20130905-05:17:30.939(2)?      server:
I20130905-05:17:30.939(2)?       { publish_handlers: [Object],
I20130905-05:17:30.939(2)?         universal_publish_handlers: [Object],
I20130905-05:17:30.939(2)?         method_handlers: [Object],
I20130905-05:17:30.939(2)?         sessions: [Object],
I20130905-05:17:30.940(2)?         stream_server: [Object] },
I20130905-05:17:30.940(2)?      version: 'pre1',
I20130905-05:17:30.940(2)?      initialized: true,
I20130905-05:17:30.940(2)?      socket: [Circular],
I20130905-05:17:30.940(2)?      last_connect_time: 1378351050610,
I20130905-05:17:30.940(2)?      last_detach_time: 1378351050610,
I20130905-05:17:30.940(2)?      in_queue: [],
I20130905-05:17:30.940(2)?      blocked: false,
I20130905-05:17:30.941(2)?      worker_running: true,
I20130905-05:17:30.941(2)?      out_queue: [],
I20130905-05:17:30.941(2)?      result_cache: { '1': [Object] },
I20130905-05:17:30.941(2)?      _namedSubs:
I20130905-05:17:30.941(2)?       { DpAD9GEcSQbjS7fiP: [Object],
I20130905-05:17:30.941(2)?         fJ3Smtz87FD99ceTx: [Object],
I20130905-05:17:30.941(2)?         JbtrhYsje6wvaDWAv: [Object],
I20130905-05:17:30.941(2)?         gYELfh74gyrJjfkNo: [Object] },
I20130905-05:17:30.941(2)?      _universalSubs: [ [Object] ],
I20130905-05:17:30.942(2)?      userId: null,
I20130905-05:17:30.942(2)?      sessionData: {},
I20130905-05:17:30.942(2)?      collectionViews:
I20130905-05:17:30.942(2)?       { _observatory_logs: [Object],
I20130905-05:17:30.942(2)?         meteor_accounts_loginServiceConfiguration: [Object],
I20130905-05:17:30.942(2)?         posts: [Object] },
I20130905-05:17:30.942(2)?      _isSending: true,
I20130905-05:17:30.942(2)?      _dontStartNewUniversalSubs: false,
I20130905-05:17:30.942(2)?      _pendingReady: [] } }
*/

var _ref,             
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Observatory = (_ref = this.Observatory) != null ? _ref : {};

Observatory.DDPEmitter = (function(_super) {
  __extends(DDPEmitter, _super);

  DDPEmitter.messageStub = function() {
    var options;
    options = {
      isServer: true,
      severity: Observatory.LOGLEVEL.DEBUG,
      module: "DDP",
      timestamp: new Date
    };
    return options;
  };

  DDPEmitter._instance = void 0;

  DDPEmitter.de = function() {
    if (DDPEmitter._instance == null) {
      DDPEmitter._instance = new Observatory.DDPEmitter("DDP Emitter");
    }
    return DDPEmitter._instance;
  };

  function DDPEmitter(name, formatter) {
    this.name = name;
    this.formatter = formatter;
    DDPEmitter.__super__.constructor.call(this, this.name, this.formatter);
    if (Observatory.DDPEmitter._instance != null) {
      throw new Error("Attempted to create another instance of DDPEmitter and it is a really bad idea");
    }
    Meteor.default_server.stream_server.register(function(socket) {
      var msg;
      if (!(Observatory.DDPEmitter.de().isOn && Observatory.settings.logDDP)) {
        return;
      }
      msg = Observatory.DDPEmitter.messageStub();
      msg.socketId = socket.id;
      msg.textMessage = "Connected socket " + socket.id;
      Observatory.DDPEmitter.de().emitMessage(msg, true);
      socket.on('data', function(raw_msg) {
        if (!(Observatory.DDPEmitter.de().isOn && Observatory.settings.logDDP)) {
          return;
        }
        msg = Observatory.DDPEmitter.messageStub();
        msg.socketId = this.id;
        msg.textMessage = "Got message in a socket " + this.id;
        msg.object = raw_msg;
        msg.type = "DDP";
        return Observatory.DDPEmitter.de().emitMessage(msg, true);
      });
      return socket.on('close', function() {
        if (!(Observatory.DDPEmitter.de().isOn && Observatory.settings.logDDP)) {
          return;
        }
        msg = Observatory.DDPEmitter.messageStub();
        msg.socketId = socket.id;
        msg.textMessage = "Closed socket " + socket.id;
        return Observatory.DDPEmitter.de().emitMessage(msg, true);
      });
    });
  }

  return DDPEmitter;

}).call(this, this.Observatory.MessageEmitter);

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/server/HttpEmitter.coffee.js                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _ref,             
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Observatory = (_ref = this.Observatory) != null ? _ref : {};

Observatory.HttpEmitter = (function(_super) {
  __extends(HttpEmitter, _super);

  HttpEmitter.prototype.httpLogger = function(req, res, next) {
    var end,
      _this = this;
    if (this.isOff || (!Observatory.settings.logHttp)) {
      next();
      return;
    }
    req._startTime = new Date;
    end = res.end;
    res.end = function(chunk, encoding) {
      var obj;
      res.end = end;
      res.end(chunk, encoding);
      obj = {
        url: req.originalUrl || req.url,
        method: req.method,
        referrer: req.headers["referer"] || req.headers["referrer"],
        remoteAddress: req.ip ? req.ip : req.socket.socket ? req.socket.socket.remoteAddress : req.socket.remoteAddress,
        status: res.statusCode,
        httpVersion: req.httpVersionMajor + "." + req.httpVersionMinor,
        userAgent: req.headers["user-agent"],
        responseHeader: res._header,
        acceptLanguage: req.headers['accept-language'],
        forwardedFor: req.headers['x-forwarded-for'],
        timestamp: new Date,
        responseTime: new Date - req._startTime
      };
      return _this.emitFormattedMessage(obj, true);
    };
    return next();
  };

  function HttpEmitter(name) {
    this.name = name;
    this.httpLogger = __bind(this.httpLogger, this);
    this.formatter = function(l) {
      var msg, options, severity;
      msg = "" + l.method + " " + l.url + ": " + l.status + " from " + l.forwardedFor + " in " + l.responseTime + " ms";
      severity = Observatory.LOGLEVEL.VERBOSE;
      if (l.status >= 500) {
        severity = Observatory.LOGLEVEL.FATAL;
      } else {
        if (l.status >= 400) {
          severity = Observatory.LOGLEVEL.ERROR;
        } else {
          if (l.status >= 300) {
            severity = Observatory.LOGLEVEL.WARNING;
          }
        }
      }
      options = {
        isServer: true,
        textMessage: msg,
        module: "HTTP",
        timestamp: l.timestamp,
        severity: severity,
        ip: l.forwardedFor,
        elapsedTime: l.responseTime,
        object: l
      };
      return options;
    };
    HttpEmitter.__super__.constructor.call(this, this.name, this.formatter);
    WebApp.connectHandlers.use(this.httpLogger);
  }

  return HttpEmitter;

})(this.Observatory.MessageEmitter);

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/server/MonitoringEmitter.coffee.js                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var os, util, _ref,             
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

util = Npm.require('util');

os = Npm.require('os');

Observatory = (_ref = this.Observatory) != null ? _ref : {};

Observatory.MonitoringEmitter = (function(_super) {
  var secondsToString;

  __extends(MonitoringEmitter, _super);

  MonitoringEmitter.prototype.sysInfo = function() {
    console.dir(os.cpus());
    console.log(os.hostname(), os.type(), os.platform(), os.arch(), os.release());
    return console.log(os.networkInterfaces());
  };

  MonitoringEmitter.prototype.measure = function() {
    var obj;
    return obj = {
      procMemUse: process.memoryUsage(),
      osUptime: os.uptime(),
      procUptime: process.uptime(),
      loadavg: os.loadavg(),
      totalmem: os.totalmem(),
      freemem: os.freemem()
    };
  };

  secondsToString = function(seconds) {
    var numdays, numhours, numminutes, numseconds;
    numdays = Math.floor(seconds / 86400);
    numhours = Math.floor((seconds % 86400) / 3600);
    numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    numseconds = ((seconds % 86400) % 3600) % 60;
    return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
  };

  function MonitoringEmitter(name) {
    this.name = name;
    this.name = name != null ? name : 'Monitor';
    this._sessions = [];
    this.isRunning = false;
    this._monitorHandle = null;
    MonitoringEmitter.__super__.constructor.call(this, this.name);
  }

  MonitoringEmitter.prototype.startMonitor = function(timePeriod) {
    var _this = this;
    if (this.isRunning) {
      this.stopMonitor;
    }
    timePeriod = timePeriod != null ? timePeriod : 60000;
    return this._monitorHandle = Meteor.setInterval(function() {
      var currentSessions, msg, obj;
      currentSessions = Meteor.call("_observatoryGetOpenSessions");
      obj = _this.measure();
      obj.currentSessionNumber = currentSessions != null ? currentSessions.length : void 0;
      msg = {
        isServer: true,
        timestamp: new Date,
        module: 'Monitor',
        type: 'monitor',
        severity: Observatory.LOGLEVEL.INFO,
        object: obj,
        textMessage: "Monitoring every " + (timePeriod / 1000) + "s"
      };
      _this.emitMessage(msg);
      return _this.isRunning = true;
    }, timePeriod);
  };

  MonitoringEmitter.prototype.stopMonitor = function() {
    if (this.isRunning) {
      Meteor.clearInterval(this._monitorHandle);
      return this.isRunning = false;
    }
  };

  MonitoringEmitter.prototype.sessionToLoggingOptions = function(session) {
    var o;
    o = {
      timestamp: null
    };
    return o;
  };

  return MonitoringEmitter;

})(this.Observatory.MessageEmitter);

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/MeteorLogger.coffee.js                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _ref,             
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Observatory = (_ref = this.Observatory) != null ? _ref : {};

Observatory.MeteorLogger = (function(_super) {
  __extends(MeteorLogger, _super);

  function MeteorLogger(name, colName, connection) {
    var _this = this;
    this.name = name;
    this.colName = colName != null ? colName : '_observatory_logs';
    if (connection == null) {
      connection = null;
    }
    MeteorLogger.__super__.constructor.call(this, this.name);
    this._logsCollection = new Meteor.Collection(this.colName);
    if (Meteor.isServer) {
      this._logsCollection.allow({
        update: function(uid) {
          return false;
        },
        insert: function(uid) {
          return _this.allowInsert(uid);
        },
        remove: function(uid) {
          return _this.allowRemove(uid);
        }
      });
    }
  }

  MeteorLogger.prototype.allowInsert = function(uid) {
    return true;
  };

  MeteorLogger.prototype.allowRemove = function(uid) {
    return false;
  };

  MeteorLogger.prototype.log = function(message) {
    var msg;
    msg = message;
    msg.userId = this._checkUserId();
    return this._logsCollection.insert(msg);
  };

  MeteorLogger.prototype._checkUserId = function() {
    var err, uid, _ref1;
    try {
      uid = (_ref1 = this.userId) != null ? _ref1 : Meteor.userId();
    } catch (_error) {
      err = _error;
    }
    return uid;
  };

  return MeteorLogger;

})(Observatory.Logger);

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/TLog.coffee.js                                                                   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
         

TLog = (function() {
  function TLog() {}

  TLog.getLogger = function() {
    var tb;
    tb = Observatory.getToolbox();
    tb.dir = function(obj, message, module) {
      var msg;
      msg = message ? message : "Inspecting object:";
      return this._emitWithSeverity(Observatory.LOGLEVEL.VERBOSE, msg, this.inspect(obj, module));
    };
    tb.setOptions = this.setOptions;
    return tb;
  };

  TLog.allowRemove = function(f) {
    return Observatory.getMeteorLogger().allowRemove(f);
  };

  TLog.publish = function(f) {
    return Observatory.meteorServer.publish(f);
  };

  TLog._getLogs = function(sort) {
    return Observatory.getMeteorLogger()._logsCollection.find({}, {
      sort: {
        timestamp: -1
      }
    });
  };

  TLog.LOGLEVEL_FATAL = 0;

  TLog.LOGLEVEL_ERROR = 1;

  TLog.LOGLEVEL_WARNING = 2;

  TLog.LOGLEVEL_INFO = 3;

  TLog.LOGLEVEL_VERBOSE = 4;

  TLog.LOGLEVEL_DEBUG = 5;

  TLog.LOGLEVEL_MAX = 6;

  TLog.LOGLEVEL_NAMES = ["fatal", "error", "warning", "info", "verbose", "debug", "max"];

  TLog.LOGLEVEL_NAMES_CAPS = ["FATAL", "ERROR", "WARNING", "INFO", "VERBOSE", "DEBUG", "MAX"];

  TLog.LOGLEVEL_NAMES_SHORT = ["ftl", "err", "wrn", "inf", "vrb", "dbg", "max"];

  TLog.setOptions = function(loglevel, want_to_print, log_user, log_http, log_DDP) {
    var settings;
    if (want_to_print == null) {
      want_to_print = true;
    }
    if (log_user == null) {
      log_user = true;
    }
    if (log_http == null) {
      log_http = true;
    }
    if (log_DDP == null) {
      log_DDP = true;
    }
    settings = {
      maxSeverity: loglevel,
      printToConsole: want_to_print,
      logUser: log_user,
      logHttp: log_http,
      logDDP: log_DDP
    };
    return Observatory.setSettings(settings);
  };

  return TLog;

})();

(typeof exports !== "undefined" && exports !== null ? exports : this).TLog = TLog;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/Observatory.coffee.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _ref;             

Observatory = (_ref = this.Observatory) != null ? _ref : {};

/*
Settings format:

{
    "public": {
        "observatorySettings": {
            "logsCollectionName": "_observatory_logs",
            "logLevel": "DEBUG",
            "printToConsole": true,
            "logUser": true,
            "logHttp": true,
            "logDDP": true,
            "prohibitAutoPublish": false
        }
    }
}
*/


Observatory.subscribe = function(numOfLogs) {
  if (Meteor.isClient) {
    return Meteor.subscribe(this.settings.logsCollectionName, numOfLogs != null ? numOfLogs : 50);
  }
};

Observatory.isServer = function() {
  return Meteor.isServer;
};

Observatory.getMeteorLogger = function() {
  return Observatory._meteorLogger;
};

Observatory.initialize = _.wrap(Observatory.initialize, function(f, s) {
  var _ref1, _ref2;
  if (s == null) {
    s = (_ref1 = Meteor.settings) != null ? (_ref2 = _ref1["public"]) != null ? _ref2.observatorySettings : void 0 : void 0;
  }
  return f.call(Observatory, s);
});

Observatory.setSettings = _.wrap(Observatory.setSettings, function(f, s) {
  var _ref1, _ref2, _ref3;
  f.call(Observatory, s);
  this.settings.logUser = (_ref1 = s.logUser) != null ? _ref1 : this.settings.logUser;
  this.settings.logHttp = (_ref2 = s != null ? s.logHttp : void 0) != null ? _ref2 : this.settings.logHttp;
  return this.settings.logDDP = (_ref3 = s != null ? s.logDDP : void 0) != null ? _ref3 : this.settings.logDDP;
});

Observatory.registerInitFunction(function(s) {
  var _ref1, _ref2, _ref3, _ref4, _ref5;
  this.settings.logsCollectionName = (_ref1 = s != null ? s.logsCollectionName : void 0) != null ? _ref1 : '_observatory_logs';
  this.settings.logUser = (_ref2 = s != null ? s.logUser : void 0) != null ? _ref2 : true;
  this.settings.logHttp = (_ref3 = s != null ? s.logHttp : void 0) != null ? _ref3 : true;
  this.settings.logDDP = (_ref4 = s != null ? s.logDDP : void 0) != null ? _ref4 : false;
  this.settings.prohibitAutoPublish = (_ref5 = s != null ? s.prohibitAutoPublish : void 0) != null ? _ref5 : false;
  this._meteorLogger = new Observatory.MeteorLogger('Meteor Logger', this.settings.logsCollectionName);
  this.subscribeLogger(this._meteorLogger);
  if (Meteor.isServer) {
    this.meteorServer = new Observatory.Server;
    if (!this.settings.prohibitAutoPublish) {
      this.meteorServer.publish();
    }
    this.emitters.DDP = Observatory.DDPEmitter.de('DDP');
    this.emitters.Http = new Observatory.HttpEmitter('HTTP');
    this.emitters.Monitor = new Observatory.MonitoringEmitter('Monitor');
    return Meteor.setInterval(function() {
      var m;
      m = Observatory.getMeteorLogger();
      return m.processBuffer();
    }, 3000);
  } else {
    if (!this.settings.prohibitAutoPublish) {
      return Meteor.subscribe(this.settings.logsCollectionName);
    }
  }
});

Observatory.initialize();

/*
if Meteor.isServer
  Observatory._meteorLogger.allowInsert = (uid)->
    console.log "Trying to insert for " + uid
    true
*/


(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/observatory-apollo/lib/monitoringHooks.coffee.js                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.userIP = function(uid) {
  var k, ret, s, ss, _ref, _ref1, _ref2, _ref3;
  ret = {};
  uid = uid != null ? uid : Meteor.userId();
  if (uid != null) {
    _ref = Meteor.default_server.sessions;
    for (k in _ref) {
      ss = _ref[k];
      if (ss.userId === uid) {
        s = ss;
      }
    }
    if (s) {
      ret.forwardedFor = (_ref1 = s.socket) != null ? (_ref2 = _ref1.headers) != null ? _ref2['x-forwarded-for'] : void 0 : void 0;
      ret.remoteAddress = (_ref3 = s.socket) != null ? _ref3.remoteAddress : void 0;
    }
  }
  return ret;
};

Meteor.default_server.stream_server.register(function(socket) {
  /*
  console.log "SOCKET Connect! ----------------------------->"
  socket.on 'data', (raw_msg)->
    console.log 'Got message in a socket: --------->', @id
    console.log raw_msg
  socket.on 'close', ->
    console.log "Closing socket #{@id}"
  
  console.dir socket
  console.log "METEOR SESSION: ----------------------------->"
  Meteor.userIP()
  console.dir socket.meteor_session
  #console.log s.meteor_session.userId, s.meteor_session.socket.headers for s in Meteor.default_server.stream_server.open_sockets when s.meteor_session?
  */

});

Meteor.methods({
  _observatoryGetOpenSessions: function() {
    var k, k1, ns, o, os, ret, socket, v, v1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    ret = [];
    _ref2 = (_ref = Meteor.default_server) != null ? (_ref1 = _ref.stream_server) != null ? _ref1.open_sockets : void 0 : void 0;
    for (k in _ref2) {
      socket = _ref2[k];
      os = socket.meteor_session;
      ns = {};
      _ref3 = os._namedSubs;
      for (k1 in _ref3) {
        v1 = _ref3[k1];
        ns[k1] = {
          uid: v1.userId,
          name: v1._name,
          deactivated: v1._deactivated,
          isReady: v1._ready,
          params: v1._params
        };
        for (k in v1) {
          v = v1[k];
          if (typeof v === 'function') {
            ns[k1][k] = v.toString();
          }
        }
      }
      o = {
        ddpVersion: os.version,
        sessionId: os.id,
        initialized: os.initialized,
        lastConnect: new Date(os.last_connect_time),
        lastDetach: new Date(os.last_detach_time),
        blocked: os.blocked,
        workerRunning: os.worker_running,
        userId: os.userId,
        sessionData: os.sessionData,
        namedSubs: ns,
        collectionViews: (function() {
          var _ref4, _results;
          _ref4 = os.collectionViews;
          _results = [];
          for (k in _ref4) {
            v = _ref4[k];
            _results.push({
              name: v.collectionName,
              id: k,
              docNumber: Object.keys(v.documents).length
            });
          }
          return _results;
        })(),
        headers: (_ref4 = os.socket) != null ? _ref4.headers : void 0,
        protocol: (_ref5 = os.socket) != null ? _ref5.protocol : void 0,
        address: (_ref6 = os.socket) != null ? _ref6.address : void 0,
        remoteAddress: (_ref7 = os.socket) != null ? _ref7.remoteAddress : void 0,
        remotePort: (_ref8 = os.socket) != null ? _ref8.remotePort : void 0,
        isSending: os._isSending,
        pendingReady: os._pendingReady
      };
      ret.push(o);
    }
    return ret;
  },
  _observatoryGetCurrentServer: function() {
    var k, methodHandlers, publishHandlers, v;
    publishHandlers = (function() {
      var _ref, _ref1, _results;
      _ref1 = (_ref = Meteor.default_server) != null ? _ref.publish_handlers : void 0;
      _results = [];
      for (k in _ref1) {
        v = _ref1[k];
        _results.push({
          name: k,
          func: v.toString()
        });
      }
      return _results;
    })();
    methodHandlers = (function() {
      var _ref, _ref1, _results;
      _ref1 = (_ref = Meteor.default_server) != null ? _ref.method_handlers : void 0;
      _results = [];
      for (k in _ref1) {
        v = _ref1[k];
        _results.push({
          name: k,
          func: v.toString()
        });
      }
      return _results;
    })();
    return {
      publishHandlers: publishHandlers,
      methodHandlers: methodHandlers
    };
  },
  _observatoryGetArbitraryObj: function(line) {
    return Meteor.userIP();
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['observatory-apollo'] = {
  TLog: TLog,
  Observatory: Observatory
};

})();
