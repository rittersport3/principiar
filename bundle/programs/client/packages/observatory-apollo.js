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
var EJSON = Package.ejson.EJSON;
var Log = Package.logging.Log;
var Deps = Package.deps.Deps;
var Session = Package.session.Session;
var DDP = Package.livedata.DDP;
var Template = Package.templating.Template;
var Handlebars = Package.handlebars.Handlebars;
var check = Package.check.check;
var Match = Package.check.Match;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Random = Package.random.Random;
var Spark = Package.spark.Spark;

/* Package-scope variables */
var TLog, Observatory, __coffeescriptShare;

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
// packages/observatory-apollo/lib/client/templates.coffee.js                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
/*
Template.newPost.rendered = _.wrap Template.newPost.rendered, (func)->
  console.log "Injection successful!!!"
  console.log this
  func.apply this
*/

var _ref;             

Observatory = (_ref = this.Observatory) != null ? _ref : {};

_.extend(Observatory, {
  getTemplateNames: function(includeHidden) {
    var k, ret, v;
    if (includeHidden == null) {
      includeHidden = false;
    }
    ret = [];
    for (k in Template) {
      v = Template[k];
      if (k.indexOf('_') !== 0) {
        ret.push(k);
      }
    }
    return ret;
  },
  getTemplate: function(name) {
    return _.find(Template, function(k, v) {
      return v === name;
    });
  },
  getEvents: function(name) {
    var _ref1;
    return (_ref1 = this.getTemplate(name)) != null ? _ref1._tmpl_data.events : void 0;
  },
  getHelpers: function(name) {
    var _ref1;
    return (_ref1 = this.getTemplate(name)) != null ? _ref1._tmpl_data.helpers : void 0;
  },
  logAll: function() {
    this.logTemplates();
    return this.logMeteor();
  },
  logTemplates: function() {
    var c, callbacks, names, t, _i, _len, _results;
    console.log("logging templates now");
    names = this.getTemplateNames();
    console.log(names);
    callbacks = ['created', 'rendered', 'destroyed'];
    _results = [];
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      t = names[_i];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = callbacks.length; _j < _len1; _j++) {
          c = callbacks[_j];
          if (Template[t][c] != null) {
            _results1.push(Template[t][c] = _.wrap(Template[t][c], function(f) {
              var tl;
              tl = TLog.getLogger();
              tl.debug("" + c + " call started", "Template." + t);
              f.apply(this);
              return tl.debug("" + c + " call finished", "Template." + t);
            }));
          } else {
            _results1.push(Template[t][c] = function() {
              var tl;
              tl = TLog.getLogger();
              return tl.debug("" + c + " called - not defined by user", "Template." + t);
            });
          }
        }
        return _results1;
      })());
    }
    return _results;
  },
  logCollection: function() {
    var async, m, sync, _i, _len, _results;
    sync = ['find', 'findOne'];
    async = ['insert', 'update', 'remove'];
    _results = [];
    for (_i = 0, _len = sync.length; _i < _len; _i++) {
      m = sync[_i];
      _results.push(Meteor.Collection.prototype[m] = _.wrap(Meteor.Collection.prototype[m], function(f) {
        var ret;
        console.log("" + m + " call started", "Collection." + this._name);
        console.log(arguments);
        ret = f.apply(this, _.rest(arguments));
        console.log("" + m + " call finished", "Collection." + this._name);
        return ret;
      }));
    }
    return _results;
  },
  logMeteor: function() {
    return Meteor.subscribe = _.wrap(Meteor.subscribe, function(f) {
      var args, cb, changeLast, last, name, origOnError, origOnReady, tl,
        _this = this;
      tl = Observatory.getToolbox();
      name = arguments[1];
      tl.verbose("Subscribing to " + name, "Meteor");
      last = _.last(arguments);
      changeLast = false;
      if (typeof last === 'object') {
        if (last.onReady != null) {
          origOnReady = last.onReady;
          changeLast = true;
        }
        if (last.onError != null) {
          origOnError = last.onError;
          changeLast = true;
        }
      } else {
        if (typeof last === 'function') {
          origOnReady = last;
          changeLast = true;
        }
      }
      cb = {
        onReady: function() {
          var t;
          t = Date.now() - Session.get("_obs.subscription." + name + ".profileStart");
          tl.profile("Subscription ready for " + name + " in " + t + " ms", t, {
            subscription: name,
            type: 'subscription'
          });
          if (origOnReady != null) {
            return origOnReady();
          }
        },
        onError: function(err) {
          var t;
          t = Date.now() - Session.get("_obs.subscription." + name + ".profileStart");
          tl.error(("Error while subscribing to " + name + ": ") + err.reason, {
            error: err,
            subscription: name,
            timeElapsed: t,
            type: 'subscription'
          });
          if (origOnError != null) {
            return origOnError(err);
          }
        }
      };
      args = _.rest(arguments);
      if (changeLast) {
        args[args.length - 1] = cb;
      } else {
        args.push(cb);
      }
      Session.set("_obs.subscription." + name + ".profileStart", Date.now());
      return f.apply(this, args);
    });
  }
});

(typeof exports !== "undefined" && exports !== null ? exports : this).Observatory = Observatory;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['observatory-apollo'] = {
  TLog: TLog,
  Observatory: Observatory
};

})();

//# sourceMappingURL=7cc0d63266616e11948cf8bf61c788d09d31715e.map
