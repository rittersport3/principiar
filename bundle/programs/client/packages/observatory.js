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
var Template = Package.templating.Template;
var Observatory = Package['observatory-apollo'].Observatory;
var TLog = Package['observatory-apollo'].TLog;
var Spark = Package.spark.Spark;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/observatory/lib/codemirror/codemirror.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// CodeMirror is the only global var we claim                                                                          // 1
window.CodeMirror = (function() {                                                                                      // 2
  "use strict";                                                                                                        // 3
                                                                                                                       // 4
  // BROWSER SNIFFING                                                                                                  // 5
                                                                                                                       // 6
  // Crude, but necessary to handle a number of hard-to-feature-detect                                                 // 7
  // bugs and behavior differences.                                                                                    // 8
  var gecko = /gecko\/\d/i.test(navigator.userAgent);                                                                  // 9
  var ie = /MSIE \d/.test(navigator.userAgent);                                                                        // 10
  var ie_lt8 = ie && (document.documentMode == null || document.documentMode < 8);                                     // 11
  var ie_lt9 = ie && (document.documentMode == null || document.documentMode < 9);                                     // 12
  var webkit = /WebKit\//.test(navigator.userAgent);                                                                   // 13
  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);                                                   // 14
  var chrome = /Chrome\//.test(navigator.userAgent);                                                                   // 15
  var opera = /Opera\//.test(navigator.userAgent);                                                                     // 16
  var safari = /Apple Computer/.test(navigator.vendor);                                                                // 17
  var khtml = /KHTML\//.test(navigator.userAgent);                                                                     // 18
  var mac_geLion = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent);                                           // 19
  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);                                   // 20
  var phantom = /PhantomJS/.test(navigator.userAgent);                                                                 // 21
                                                                                                                       // 22
  var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);                        // 23
  // This is woefully incomplete. Suggestions for alternative methods welcome.                                         // 24
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);            // 25
  var mac = ios || /Mac/.test(navigator.platform);                                                                     // 26
  var windows = /windows/i.test(navigator.platform);                                                                   // 27
                                                                                                                       // 28
  var opera_version = opera && navigator.userAgent.match(/Version\/(\d*\.\d*)/);                                       // 29
  if (opera_version) opera_version = Number(opera_version[1]);                                                         // 30
  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X                                           // 31
  var flipCtrlCmd = mac && (qtwebkit || opera && (opera_version == null || opera_version < 12.11));                    // 32
  var captureMiddleClick = gecko || (ie && !ie_lt9);                                                                   // 33
                                                                                                                       // 34
  // Optimize some code when these features are not used                                                               // 35
  var sawReadOnlySpans = false, sawCollapsedSpans = false;                                                             // 36
                                                                                                                       // 37
  // CONSTRUCTOR                                                                                                       // 38
                                                                                                                       // 39
  function CodeMirror(place, options) {                                                                                // 40
    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);                                          // 41
                                                                                                                       // 42
    this.options = options = options || {};                                                                            // 43
    // Determine effective options based on given values and defaults.                                                 // 44
    for (var opt in defaults) if (!options.hasOwnProperty(opt) && defaults.hasOwnProperty(opt))                        // 45
      options[opt] = defaults[opt];                                                                                    // 46
    setGuttersForLineNumbers(options);                                                                                 // 47
                                                                                                                       // 48
    var docStart = typeof options.value == "string" ? 0 : options.value.first;                                         // 49
    var display = this.display = makeDisplay(place, docStart);                                                         // 50
    display.wrapper.CodeMirror = this;                                                                                 // 51
    updateGutters(this);                                                                                               // 52
    if (options.autofocus && !mobile) focusInput(this);                                                                // 53
                                                                                                                       // 54
    this.state = {keyMaps: [],                                                                                         // 55
                  overlays: [],                                                                                        // 56
                  modeGen: 0,                                                                                          // 57
                  overwrite: false, focused: false,                                                                    // 58
                  suppressEdits: false, pasteIncoming: false,                                                          // 59
                  draggingText: false,                                                                                 // 60
                  highlight: new Delayed()};                                                                           // 61
                                                                                                                       // 62
    themeChanged(this);                                                                                                // 63
    if (options.lineWrapping)                                                                                          // 64
      this.display.wrapper.className += " CodeMirror-wrap";                                                            // 65
                                                                                                                       // 66
    var doc = options.value;                                                                                           // 67
    if (typeof doc == "string") doc = new Doc(options.value, options.mode);                                            // 68
    operation(this, attachDoc)(this, doc);                                                                             // 69
                                                                                                                       // 70
    // Override magic textarea content restore that IE sometimes does                                                  // 71
    // on our hidden textarea on reload                                                                                // 72
    if (ie) setTimeout(bind(resetInput, this, true), 20);                                                              // 73
                                                                                                                       // 74
    registerEventHandlers(this);                                                                                       // 75
    // IE throws unspecified error in certain cases, when                                                              // 76
    // trying to access activeElement before onload                                                                    // 77
    var hasFocus; try { hasFocus = (document.activeElement == display.input); } catch(e) { }                           // 78
    if (hasFocus || (options.autofocus && !mobile)) setTimeout(bind(onFocus, this), 20);                               // 79
    else onBlur(this);                                                                                                 // 80
                                                                                                                       // 81
    operation(this, function() {                                                                                       // 82
      for (var opt in optionHandlers)                                                                                  // 83
        if (optionHandlers.propertyIsEnumerable(opt))                                                                  // 84
          optionHandlers[opt](this, options[opt], Init);                                                               // 85
      for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);                                                   // 86
    })();                                                                                                              // 87
  }                                                                                                                    // 88
                                                                                                                       // 89
  // DISPLAY CONSTRUCTOR                                                                                               // 90
                                                                                                                       // 91
  function makeDisplay(place, docStart) {                                                                              // 92
    var d = {};                                                                                                        // 93
                                                                                                                       // 94
    var input = d.input = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none;");
    if (webkit) input.style.width = "1000px";                                                                          // 96
    else input.setAttribute("wrap", "off");                                                                            // 97
    // if border: 0; -- iOS fails to open keyboard (issue #1287)                                                       // 98
    if (ios) input.style.border = "1px solid black";                                                                   // 99
    input.setAttribute("autocorrect", "off"); input.setAttribute("autocapitalize", "off");                             // 100
                                                                                                                       // 101
    // Wraps and hides input textarea                                                                                  // 102
    d.inputDiv = elt("div", [input], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");          // 103
    // The actual fake scrollbars.                                                                                     // 104
    d.scrollbarH = elt("div", [elt("div", null, null, "height: 1px")], "CodeMirror-hscrollbar");                       // 105
    d.scrollbarV = elt("div", [elt("div", null, null, "width: 1px")], "CodeMirror-vscrollbar");                        // 106
    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");                                               // 107
    // DIVs containing the selection and the actual code                                                               // 108
    d.lineDiv = elt("div");                                                                                            // 109
    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");                                         // 110
    // Blinky cursor, and element used to ensure cursor fits at the end of a line                                      // 111
    d.cursor = elt("div", "\u00a0", "CodeMirror-cursor");                                                              // 112
    // Secondary cursor, shown when on a 'jump' in bi-directional text                                                 // 113
    d.otherCursor = elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor");                              // 114
    // Used to measure text size                                                                                       // 115
    d.measure = elt("div", null, "CodeMirror-measure");                                                                // 116
    // Wraps everything that needs to exist inside the vertically-padded coordinate system                             // 117
    d.lineSpace = elt("div", [d.measure, d.selectionDiv, d.lineDiv, d.cursor, d.otherCursor],                          // 118
                         null, "position: relative; outline: none");                                                   // 119
    // Moved around its parent to cover visible view                                                                   // 120
    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");                 // 121
    // Set to the height of the text, causes scrolling                                                                 // 122
    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");                                                               // 123
    // D is needed because behavior of elts with overflow: auto and padding is inconsistent across browsers            // 124
    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerCutOff + "px; width: 1px;");      // 125
    // Will contain the gutters, if any                                                                                // 126
    d.gutters = elt("div", null, "CodeMirror-gutters");                                                                // 127
    d.lineGutter = null;                                                                                               // 128
    // Helper element to properly size the gutter backgrounds                                                          // 129
    var scrollerInner = elt("div", [d.sizer, d.heightForcer, d.gutters], null, "position: relative; min-height: 100%");
    // Provides scrolling                                                                                              // 131
    d.scroller = elt("div", [scrollerInner], "CodeMirror-scroll");                                                     // 132
    d.scroller.setAttribute("tabIndex", "-1");                                                                         // 133
    // The element in which the editor lives.                                                                          // 134
    d.wrapper = elt("div", [d.inputDiv, d.scrollbarH, d.scrollbarV,                                                    // 135
                            d.scrollbarFiller, d.scroller], "CodeMirror");                                             // 136
    // Work around IE7 z-index bug                                                                                     // 137
    if (ie_lt8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }                                    // 138
    if (place.appendChild) place.appendChild(d.wrapper); else place(d.wrapper);                                        // 139
                                                                                                                       // 140
    // Needed to hide big blue blinking cursor on Mobile Safari                                                        // 141
    if (ios) input.style.width = "0px";                                                                                // 142
    if (!webkit) d.scroller.draggable = true;                                                                          // 143
    // Needed to handle Tab key in KHTML                                                                               // 144
    if (khtml) { d.inputDiv.style.height = "1px"; d.inputDiv.style.position = "absolute"; }                            // 145
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).                           // 146
    else if (ie_lt8) d.scrollbarH.style.minWidth = d.scrollbarV.style.minWidth = "18px";                               // 147
                                                                                                                       // 148
    // Current visible range (may be bigger than the view window).                                                     // 149
    d.viewOffset = d.lastSizeC = 0;                                                                                    // 150
    d.showingFrom = d.showingTo = docStart;                                                                            // 151
                                                                                                                       // 152
    // Used to only resize the line number gutter when necessary (when                                                 // 153
    // the amount of lines crosses a boundary that makes its width change)                                             // 154
    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;                                                      // 155
    // See readInput and resetInput                                                                                    // 156
    d.prevInput = "";                                                                                                  // 157
    // Set to true when a non-horizontal-scrolling widget is added. As                                                 // 158
    // an optimization, widget aligning is skipped when d is false.                                                    // 159
    d.alignWidgets = false;                                                                                            // 160
    // Flag that indicates whether we currently expect input to appear                                                 // 161
    // (after some event like 'keypress' or 'input') and are polling                                                   // 162
    // intensively.                                                                                                    // 163
    d.pollingFast = false;                                                                                             // 164
    // Self-resetting timeout for the poller                                                                           // 165
    d.poll = new Delayed();                                                                                            // 166
    // True when a drag from the editor is active                                                                      // 167
    d.draggingText = false;                                                                                            // 168
                                                                                                                       // 169
    d.cachedCharWidth = d.cachedTextHeight = null;                                                                     // 170
    d.measureLineCache = [];                                                                                           // 171
    d.measureLineCachePos = 0;                                                                                         // 172
                                                                                                                       // 173
    // Tracks when resetInput has punted to just putting a short                                                       // 174
    // string instead of the (large) selection.                                                                        // 175
    d.inaccurateSelection = false;                                                                                     // 176
                                                                                                                       // 177
    // Tracks the maximum line length so that the horizontal scrollbar                                                 // 178
    // can be kept static when scrolling.                                                                              // 179
    d.maxLine = null;                                                                                                  // 180
    d.maxLineLength = 0;                                                                                               // 181
    d.maxLineChanged = false;                                                                                          // 182
                                                                                                                       // 183
    // Used for measuring wheel scrolling granularity                                                                  // 184
    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;                                                      // 185
                                                                                                                       // 186
    return d;                                                                                                          // 187
  }                                                                                                                    // 188
                                                                                                                       // 189
  // STATE UPDATES                                                                                                     // 190
                                                                                                                       // 191
  // Used to get the editor into a consistent state again when options change.                                         // 192
                                                                                                                       // 193
  function loadMode(cm) {                                                                                              // 194
    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);                                                   // 195
    cm.doc.iter(function(line) {                                                                                       // 196
      if (line.stateAfter) line.stateAfter = null;                                                                     // 197
      if (line.styles) line.styles = null;                                                                             // 198
    });                                                                                                                // 199
    cm.doc.frontier = cm.doc.first;                                                                                    // 200
    startWorker(cm, 100);                                                                                              // 201
    cm.state.modeGen++;                                                                                                // 202
    if (cm.curOp) regChange(cm);                                                                                       // 203
  }                                                                                                                    // 204
                                                                                                                       // 205
  function wrappingChanged(cm) {                                                                                       // 206
    if (cm.options.lineWrapping) {                                                                                     // 207
      cm.display.wrapper.className += " CodeMirror-wrap";                                                              // 208
      cm.display.sizer.style.minWidth = "";                                                                            // 209
    } else {                                                                                                           // 210
      cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-wrap", "");                     // 211
      computeMaxLength(cm);                                                                                            // 212
    }                                                                                                                  // 213
    estimateLineHeights(cm);                                                                                           // 214
    regChange(cm);                                                                                                     // 215
    clearCaches(cm);                                                                                                   // 216
    setTimeout(function(){updateScrollbars(cm.display, cm.doc.height);}, 100);                                         // 217
  }                                                                                                                    // 218
                                                                                                                       // 219
  function estimateHeight(cm) {                                                                                        // 220
    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;                                               // 221
    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);                // 222
    return function(line) {                                                                                            // 223
      if (lineIsHidden(cm.doc, line))                                                                                  // 224
        return 0;                                                                                                      // 225
      else if (wrapping)                                                                                               // 226
        return (Math.ceil(line.text.length / perLine) || 1) * th;                                                      // 227
      else                                                                                                             // 228
        return th;                                                                                                     // 229
    };                                                                                                                 // 230
  }                                                                                                                    // 231
                                                                                                                       // 232
  function estimateLineHeights(cm) {                                                                                   // 233
    var doc = cm.doc, est = estimateHeight(cm);                                                                        // 234
    doc.iter(function(line) {                                                                                          // 235
      var estHeight = est(line);                                                                                       // 236
      if (estHeight != line.height) updateLineHeight(line, estHeight);                                                 // 237
    });                                                                                                                // 238
  }                                                                                                                    // 239
                                                                                                                       // 240
  function keyMapChanged(cm) {                                                                                         // 241
    var style = keyMap[cm.options.keyMap].style;                                                                       // 242
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") +                     // 243
      (style ? " cm-keymap-" + style : "");                                                                            // 244
  }                                                                                                                    // 245
                                                                                                                       // 246
  function themeChanged(cm) {                                                                                          // 247
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +                          // 248
      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");                                                                // 249
    clearCaches(cm);                                                                                                   // 250
  }                                                                                                                    // 251
                                                                                                                       // 252
  function guttersChanged(cm) {                                                                                        // 253
    updateGutters(cm);                                                                                                 // 254
    regChange(cm);                                                                                                     // 255
  }                                                                                                                    // 256
                                                                                                                       // 257
  function updateGutters(cm) {                                                                                         // 258
    var gutters = cm.display.gutters, specs = cm.options.gutters;                                                      // 259
    removeChildren(gutters);                                                                                           // 260
    for (var i = 0; i < specs.length; ++i) {                                                                           // 261
      var gutterClass = specs[i];                                                                                      // 262
      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));                            // 263
      if (gutterClass == "CodeMirror-linenumbers") {                                                                   // 264
        cm.display.lineGutter = gElt;                                                                                  // 265
        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";                                                      // 266
      }                                                                                                                // 267
    }                                                                                                                  // 268
    gutters.style.display = i ? "" : "none";                                                                           // 269
  }                                                                                                                    // 270
                                                                                                                       // 271
  function lineLength(doc, line) {                                                                                     // 272
    if (line.height == 0) return 0;                                                                                    // 273
    var len = line.text.length, merged, cur = line;                                                                    // 274
    while (merged = collapsedSpanAtStart(cur)) {                                                                       // 275
      var found = merged.find();                                                                                       // 276
      cur = getLine(doc, found.from.line);                                                                             // 277
      len += found.from.ch - found.to.ch;                                                                              // 278
    }                                                                                                                  // 279
    cur = line;                                                                                                        // 280
    while (merged = collapsedSpanAtEnd(cur)) {                                                                         // 281
      var found = merged.find();                                                                                       // 282
      len -= cur.text.length - found.from.ch;                                                                          // 283
      cur = getLine(doc, found.to.line);                                                                               // 284
      len += cur.text.length - found.to.ch;                                                                            // 285
    }                                                                                                                  // 286
    return len;                                                                                                        // 287
  }                                                                                                                    // 288
                                                                                                                       // 289
  function computeMaxLength(cm) {                                                                                      // 290
    var d = cm.display, doc = cm.doc;                                                                                  // 291
    d.maxLine = getLine(doc, doc.first);                                                                               // 292
    d.maxLineLength = lineLength(doc, d.maxLine);                                                                      // 293
    d.maxLineChanged = true;                                                                                           // 294
    doc.iter(function(line) {                                                                                          // 295
      var len = lineLength(doc, line);                                                                                 // 296
      if (len > d.maxLineLength) {                                                                                     // 297
        d.maxLineLength = len;                                                                                         // 298
        d.maxLine = line;                                                                                              // 299
      }                                                                                                                // 300
    });                                                                                                                // 301
  }                                                                                                                    // 302
                                                                                                                       // 303
  // Make sure the gutters options contains the element                                                                // 304
  // "CodeMirror-linenumbers" when the lineNumbers option is true.                                                     // 305
  function setGuttersForLineNumbers(options) {                                                                         // 306
    var found = false;                                                                                                 // 307
    for (var i = 0; i < options.gutters.length; ++i) {                                                                 // 308
      if (options.gutters[i] == "CodeMirror-linenumbers") {                                                            // 309
        if (options.lineNumbers) found = true;                                                                         // 310
        else options.gutters.splice(i--, 1);                                                                           // 311
      }                                                                                                                // 312
    }                                                                                                                  // 313
    if (!found && options.lineNumbers)                                                                                 // 314
      options.gutters.push("CodeMirror-linenumbers");                                                                  // 315
  }                                                                                                                    // 316
                                                                                                                       // 317
  // SCROLLBARS                                                                                                        // 318
                                                                                                                       // 319
  // Re-synchronize the fake scrollbars with the actual size of the                                                    // 320
  // content. Optionally force a scrollTop.                                                                            // 321
  function updateScrollbars(d /* display */, docHeight) {                                                              // 322
    var totalHeight = docHeight + 2 * paddingTop(d);                                                                   // 323
    d.sizer.style.minHeight = d.heightForcer.style.top = totalHeight + "px";                                           // 324
    var scrollHeight = Math.max(totalHeight, d.scroller.scrollHeight);                                                 // 325
    var needsH = d.scroller.scrollWidth > d.scroller.clientWidth;                                                      // 326
    var needsV = scrollHeight > d.scroller.clientHeight;                                                               // 327
    if (needsV) {                                                                                                      // 328
      d.scrollbarV.style.display = "block";                                                                            // 329
      d.scrollbarV.style.bottom = needsH ? scrollbarWidth(d.measure) + "px" : "0";                                     // 330
      d.scrollbarV.firstChild.style.height =                                                                           // 331
        (scrollHeight - d.scroller.clientHeight + d.scrollbarV.clientHeight) + "px";                                   // 332
    } else d.scrollbarV.style.display = "";                                                                            // 333
    if (needsH) {                                                                                                      // 334
      d.scrollbarH.style.display = "block";                                                                            // 335
      d.scrollbarH.style.right = needsV ? scrollbarWidth(d.measure) + "px" : "0";                                      // 336
      d.scrollbarH.firstChild.style.width =                                                                            // 337
        (d.scroller.scrollWidth - d.scroller.clientWidth + d.scrollbarH.clientWidth) + "px";                           // 338
    } else d.scrollbarH.style.display = "";                                                                            // 339
    if (needsH && needsV) {                                                                                            // 340
      d.scrollbarFiller.style.display = "block";                                                                       // 341
      d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = scrollbarWidth(d.measure) + "px";               // 342
    } else d.scrollbarFiller.style.display = "";                                                                       // 343
                                                                                                                       // 344
    if (mac_geLion && scrollbarWidth(d.measure) === 0)                                                                 // 345
      d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = mac_geMountainLion ? "18px" : "12px";               // 346
  }                                                                                                                    // 347
                                                                                                                       // 348
  function visibleLines(display, doc, viewPort) {                                                                      // 349
    var top = display.scroller.scrollTop, height = display.wrapper.clientHeight;                                       // 350
    if (typeof viewPort == "number") top = viewPort;                                                                   // 351
    else if (viewPort) {top = viewPort.top; height = viewPort.bottom - viewPort.top;}                                  // 352
    top = Math.floor(top - paddingTop(display));                                                                       // 353
    var bottom = Math.ceil(top + height);                                                                              // 354
    return {from: lineAtHeight(doc, top), to: lineAtHeight(doc, bottom)};                                              // 355
  }                                                                                                                    // 356
                                                                                                                       // 357
  // LINE NUMBERS                                                                                                      // 358
                                                                                                                       // 359
  function alignHorizontally(cm) {                                                                                     // 360
    var display = cm.display;                                                                                          // 361
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;                     // 362
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;                        // 363
    var gutterW = display.gutters.offsetWidth, l = comp + "px";                                                        // 364
    for (var n = display.lineDiv.firstChild; n; n = n.nextSibling) if (n.alignable) {                                  // 365
      for (var i = 0, a = n.alignable; i < a.length; ++i) a[i].style.left = l;                                         // 366
    }                                                                                                                  // 367
    if (cm.options.fixedGutter)                                                                                        // 368
      display.gutters.style.left = (comp + gutterW) + "px";                                                            // 369
  }                                                                                                                    // 370
                                                                                                                       // 371
  function maybeUpdateLineNumberWidth(cm) {                                                                            // 372
    if (!cm.options.lineNumbers) return false;                                                                         // 373
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;                // 374
    if (last.length != display.lineNumChars) {                                                                         // 375
      var test = display.measure.appendChild(elt("div", [elt("div", last)],                                            // 376
                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));                      // 377
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;                                   // 378
      display.lineGutter.style.width = "";                                                                             // 379
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding);                          // 380
      display.lineNumWidth = display.lineNumInnerWidth + padding;                                                      // 381
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;                                             // 382
      display.lineGutter.style.width = display.lineNumWidth + "px";                                                    // 383
      return true;                                                                                                     // 384
    }                                                                                                                  // 385
    return false;                                                                                                      // 386
  }                                                                                                                    // 387
                                                                                                                       // 388
  function lineNumberFor(options, i) {                                                                                 // 389
    return String(options.lineNumberFormatter(i + options.firstLineNumber));                                           // 390
  }                                                                                                                    // 391
  function compensateForHScroll(display) {                                                                             // 392
    return getRect(display.scroller).left - getRect(display.sizer).left;                                               // 393
  }                                                                                                                    // 394
                                                                                                                       // 395
  // DISPLAY DRAWING                                                                                                   // 396
                                                                                                                       // 397
  function updateDisplay(cm, changes, viewPort) {                                                                      // 398
    var oldFrom = cm.display.showingFrom, oldTo = cm.display.showingTo;                                                // 399
    var updated = updateDisplayInner(cm, changes, viewPort);                                                           // 400
    if (updated) {                                                                                                     // 401
      signalLater(cm, "update", cm);                                                                                   // 402
      if (cm.display.showingFrom != oldFrom || cm.display.showingTo != oldTo)                                          // 403
        signalLater(cm, "viewportChange", cm, cm.display.showingFrom, cm.display.showingTo);                           // 404
    }                                                                                                                  // 405
    updateSelection(cm);                                                                                               // 406
    updateScrollbars(cm.display, cm.doc.height);                                                                       // 407
                                                                                                                       // 408
    return updated;                                                                                                    // 409
  }                                                                                                                    // 410
                                                                                                                       // 411
  // Uses a set of changes plus the current scroll position to                                                         // 412
  // determine which DOM updates have to be made, and makes the                                                        // 413
  // updates.                                                                                                          // 414
  function updateDisplayInner(cm, changes, viewPort) {                                                                 // 415
    var display = cm.display, doc = cm.doc;                                                                            // 416
    if (!display.wrapper.clientWidth) {                                                                                // 417
      display.showingFrom = display.showingTo = doc.first;                                                             // 418
      display.viewOffset = 0;                                                                                          // 419
      return;                                                                                                          // 420
    }                                                                                                                  // 421
                                                                                                                       // 422
    // Compute the new visible window                                                                                  // 423
    // If scrollTop is specified, use that to determine which lines                                                    // 424
    // to render instead of the current scrollbar position.                                                            // 425
    var visible = visibleLines(display, doc, viewPort);                                                                // 426
    // Bail out if the visible area is already rendered and nothing changed.                                           // 427
    if (changes.length == 0 &&                                                                                         // 428
        visible.from > display.showingFrom && visible.to < display.showingTo)                                          // 429
      return;                                                                                                          // 430
                                                                                                                       // 431
    if (maybeUpdateLineNumberWidth(cm))                                                                                // 432
      changes = [{from: doc.first, to: doc.first + doc.size}];                                                         // 433
    var gutterW = display.sizer.style.marginLeft = display.gutters.offsetWidth + "px";                                 // 434
    display.scrollbarH.style.left = cm.options.fixedGutter ? gutterW : "0";                                            // 435
                                                                                                                       // 436
    // Used to determine which lines need their line numbers updated                                                   // 437
    var positionsChangedFrom = Infinity;                                                                               // 438
    if (cm.options.lineNumbers)                                                                                        // 439
      for (var i = 0; i < changes.length; ++i)                                                                         // 440
        if (changes[i].diff) { positionsChangedFrom = changes[i].from; break; }                                        // 441
                                                                                                                       // 442
    var end = doc.first + doc.size;                                                                                    // 443
    var from = Math.max(visible.from - cm.options.viewportMargin, doc.first);                                          // 444
    var to = Math.min(end, visible.to + cm.options.viewportMargin);                                                    // 445
    if (display.showingFrom < from && from - display.showingFrom < 20) from = Math.max(doc.first, display.showingFrom);
    if (display.showingTo > to && display.showingTo - to < 20) to = Math.min(end, display.showingTo);                  // 447
    if (sawCollapsedSpans) {                                                                                           // 448
      from = lineNo(visualLine(doc, getLine(doc, from)));                                                              // 449
      while (to < end && lineIsHidden(doc, getLine(doc, to))) ++to;                                                    // 450
    }                                                                                                                  // 451
                                                                                                                       // 452
    // Create a range of theoretically intact lines, and punch holes                                                   // 453
    // in that using the change info.                                                                                  // 454
    var intact = [{from: Math.max(display.showingFrom, doc.first),                                                     // 455
                   to: Math.min(display.showingTo, end)}];                                                             // 456
    if (intact[0].from >= intact[0].to) intact = [];                                                                   // 457
    else intact = computeIntact(intact, changes);                                                                      // 458
    // When merged lines are present, we might have to reduce the                                                      // 459
    // intact ranges because changes in continued fragments of the                                                     // 460
    // intact lines do require the lines to be redrawn.                                                                // 461
    if (sawCollapsedSpans)                                                                                             // 462
      for (var i = 0; i < intact.length; ++i) {                                                                        // 463
        var range = intact[i], merged;                                                                                 // 464
        while (merged = collapsedSpanAtEnd(getLine(doc, range.to - 1))) {                                              // 465
          var newTo = merged.find().from.line;                                                                         // 466
          if (newTo > range.from) range.to = newTo;                                                                    // 467
          else { intact.splice(i--, 1); break; }                                                                       // 468
        }                                                                                                              // 469
      }                                                                                                                // 470
                                                                                                                       // 471
    // Clip off the parts that won't be visible                                                                        // 472
    var intactLines = 0;                                                                                               // 473
    for (var i = 0; i < intact.length; ++i) {                                                                          // 474
      var range = intact[i];                                                                                           // 475
      if (range.from < from) range.from = from;                                                                        // 476
      if (range.to > to) range.to = to;                                                                                // 477
      if (range.from >= range.to) intact.splice(i--, 1);                                                               // 478
      else intactLines += range.to - range.from;                                                                       // 479
    }                                                                                                                  // 480
    if (intactLines == to - from && from == display.showingFrom && to == display.showingTo) {                          // 481
      updateViewOffset(cm);                                                                                            // 482
      return;                                                                                                          // 483
    }                                                                                                                  // 484
    intact.sort(function(a, b) {return a.from - b.from;});                                                             // 485
                                                                                                                       // 486
    var focused = document.activeElement;                                                                              // 487
    if (intactLines < (to - from) * .7) display.lineDiv.style.display = "none";                                        // 488
    patchDisplay(cm, from, to, intact, positionsChangedFrom);                                                          // 489
    display.lineDiv.style.display = "";                                                                                // 490
    if (document.activeElement != focused && focused.offsetHeight) focused.focus();                                    // 491
                                                                                                                       // 492
    var different = from != display.showingFrom || to != display.showingTo ||                                          // 493
      display.lastSizeC != display.wrapper.clientHeight;                                                               // 494
    // This is just a bogus formula that detects when the editor is                                                    // 495
    // resized or the font size changes.                                                                               // 496
    if (different) display.lastSizeC = display.wrapper.clientHeight;                                                   // 497
    display.showingFrom = from; display.showingTo = to;                                                                // 498
    startWorker(cm, 100);                                                                                              // 499
                                                                                                                       // 500
    var prevBottom = display.lineDiv.offsetTop;                                                                        // 501
    for (var node = display.lineDiv.firstChild, height; node; node = node.nextSibling) if (node.lineObj) {             // 502
      if (ie_lt8) {                                                                                                    // 503
        var bot = node.offsetTop + node.offsetHeight;                                                                  // 504
        height = bot - prevBottom;                                                                                     // 505
        prevBottom = bot;                                                                                              // 506
      } else {                                                                                                         // 507
        var box = getRect(node);                                                                                       // 508
        height = box.bottom - box.top;                                                                                 // 509
      }                                                                                                                // 510
      var diff = node.lineObj.height - height;                                                                         // 511
      if (height < 2) height = textHeight(display);                                                                    // 512
      if (diff > .001 || diff < -.001) {                                                                               // 513
        updateLineHeight(node.lineObj, height);                                                                        // 514
        var widgets = node.lineObj.widgets;                                                                            // 515
        if (widgets) for (var i = 0; i < widgets.length; ++i)                                                          // 516
          widgets[i].height = widgets[i].node.offsetHeight;                                                            // 517
      }                                                                                                                // 518
    }                                                                                                                  // 519
    updateViewOffset(cm);                                                                                              // 520
                                                                                                                       // 521
    if (visibleLines(display, doc, viewPort).to > to)                                                                  // 522
      updateDisplayInner(cm, [], viewPort);                                                                            // 523
    return true;                                                                                                       // 524
  }                                                                                                                    // 525
                                                                                                                       // 526
  function updateViewOffset(cm) {                                                                                      // 527
    var off = cm.display.viewOffset = heightAtLine(cm, getLine(cm.doc, cm.display.showingFrom));                       // 528
    // Position the mover div to align with the current virtual scroll position                                        // 529
    cm.display.mover.style.top = off + "px";                                                                           // 530
  }                                                                                                                    // 531
                                                                                                                       // 532
  function computeIntact(intact, changes) {                                                                            // 533
    for (var i = 0, l = changes.length || 0; i < l; ++i) {                                                             // 534
      var change = changes[i], intact2 = [], diff = change.diff || 0;                                                  // 535
      for (var j = 0, l2 = intact.length; j < l2; ++j) {                                                               // 536
        var range = intact[j];                                                                                         // 537
        if (change.to <= range.from && change.diff) {                                                                  // 538
          intact2.push({from: range.from + diff, to: range.to + diff});                                                // 539
        } else if (change.to <= range.from || change.from >= range.to) {                                               // 540
          intact2.push(range);                                                                                         // 541
        } else {                                                                                                       // 542
          if (change.from > range.from)                                                                                // 543
            intact2.push({from: range.from, to: change.from});                                                         // 544
          if (change.to < range.to)                                                                                    // 545
            intact2.push({from: change.to + diff, to: range.to + diff});                                               // 546
        }                                                                                                              // 547
      }                                                                                                                // 548
      intact = intact2;                                                                                                // 549
    }                                                                                                                  // 550
    return intact;                                                                                                     // 551
  }                                                                                                                    // 552
                                                                                                                       // 553
  function getDimensions(cm) {                                                                                         // 554
    var d = cm.display, left = {}, width = {};                                                                         // 555
    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {                                             // 556
      left[cm.options.gutters[i]] = n.offsetLeft;                                                                      // 557
      width[cm.options.gutters[i]] = n.offsetWidth;                                                                    // 558
    }                                                                                                                  // 559
    return {fixedPos: compensateForHScroll(d),                                                                         // 560
            gutterTotalWidth: d.gutters.offsetWidth,                                                                   // 561
            gutterLeft: left,                                                                                          // 562
            gutterWidth: width,                                                                                        // 563
            wrapperWidth: d.wrapper.clientWidth};                                                                      // 564
  }                                                                                                                    // 565
                                                                                                                       // 566
  function patchDisplay(cm, from, to, intact, updateNumbersFrom) {                                                     // 567
    var dims = getDimensions(cm);                                                                                      // 568
    var display = cm.display, lineNumbers = cm.options.lineNumbers;                                                    // 569
    if (!intact.length && (!webkit || !cm.display.currentWheelTarget))                                                 // 570
      removeChildren(display.lineDiv);                                                                                 // 571
    var container = display.lineDiv, cur = container.firstChild;                                                       // 572
                                                                                                                       // 573
    function rm(node) {                                                                                                // 574
      var next = node.nextSibling;                                                                                     // 575
      if (webkit && mac && cm.display.currentWheelTarget == node) {                                                    // 576
        node.style.display = "none";                                                                                   // 577
        node.lineObj = null;                                                                                           // 578
      } else {                                                                                                         // 579
        node.parentNode.removeChild(node);                                                                             // 580
      }                                                                                                                // 581
      return next;                                                                                                     // 582
    }                                                                                                                  // 583
                                                                                                                       // 584
    var nextIntact = intact.shift(), lineN = from;                                                                     // 585
    cm.doc.iter(from, to, function(line) {                                                                             // 586
      if (nextIntact && nextIntact.to == lineN) nextIntact = intact.shift();                                           // 587
      if (lineIsHidden(cm.doc, line)) {                                                                                // 588
        if (line.height != 0) updateLineHeight(line, 0);                                                               // 589
        if (line.widgets && cur.previousSibling) for (var i = 0; i < line.widgets.length; ++i)                         // 590
          if (line.widgets[i].showIfHidden) {                                                                          // 591
            var prev = cur.previousSibling;                                                                            // 592
            if (/pre/i.test(prev.nodeName)) {                                                                          // 593
              var wrap = elt("div", null, null, "position: relative");                                                 // 594
              prev.parentNode.replaceChild(wrap, prev);                                                                // 595
              wrap.appendChild(prev);                                                                                  // 596
              prev = wrap;                                                                                             // 597
            }                                                                                                          // 598
            var wnode = prev.appendChild(elt("div", [line.widgets[i].node], "CodeMirror-linewidget"));                 // 599
            positionLineWidget(line.widgets[i], wnode, prev, dims);                                                    // 600
          }                                                                                                            // 601
      } else if (nextIntact && nextIntact.from <= lineN && nextIntact.to > lineN) {                                    // 602
        // This line is intact. Skip to the actual node. Update its                                                    // 603
        // line number if needed.                                                                                      // 604
        while (cur.lineObj != line) cur = rm(cur);                                                                     // 605
        if (lineNumbers && updateNumbersFrom <= lineN && cur.lineNumber)                                               // 606
          setTextContent(cur.lineNumber, lineNumberFor(cm.options, lineN));                                            // 607
        cur = cur.nextSibling;                                                                                         // 608
      } else {                                                                                                         // 609
        // For lines with widgets, make an attempt to find and reuse                                                   // 610
        // the existing element, so that widgets aren't needlessly                                                     // 611
        // removed and re-inserted into the dom                                                                        // 612
        if (line.widgets) for (var j = 0, search = cur, reuse; search && j < 20; ++j, search = search.nextSibling)     // 613
          if (search.lineObj == line && /div/i.test(search.nodeName)) { reuse = search; break; }                       // 614
        // This line needs to be generated.                                                                            // 615
        var lineNode = buildLineElement(cm, line, lineN, dims, reuse);                                                 // 616
        if (lineNode != reuse) {                                                                                       // 617
          container.insertBefore(lineNode, cur);                                                                       // 618
        } else {                                                                                                       // 619
          while (cur != reuse) cur = rm(cur);                                                                          // 620
          cur = cur.nextSibling;                                                                                       // 621
        }                                                                                                              // 622
                                                                                                                       // 623
        lineNode.lineObj = line;                                                                                       // 624
      }                                                                                                                // 625
      ++lineN;                                                                                                         // 626
    });                                                                                                                // 627
    while (cur) cur = rm(cur);                                                                                         // 628
  }                                                                                                                    // 629
                                                                                                                       // 630
  function buildLineElement(cm, line, lineNo, dims, reuse) {                                                           // 631
    var lineElement = lineContent(cm, line);                                                                           // 632
    var markers = line.gutterMarkers, display = cm.display, wrap;                                                      // 633
                                                                                                                       // 634
    if (!cm.options.lineNumbers && !markers && !line.bgClass && !line.wrapClass && !line.widgets)                      // 635
      return lineElement;                                                                                              // 636
                                                                                                                       // 637
    // Lines with gutter elements, widgets or a background class need                                                  // 638
    // to be wrapped again, and have the extra elements added to the                                                   // 639
    // wrapper div                                                                                                     // 640
                                                                                                                       // 641
    if (reuse) {                                                                                                       // 642
      reuse.alignable = null;                                                                                          // 643
      var isOk = true, widgetsSeen = 0;                                                                                // 644
      for (var n = reuse.firstChild, next; n; n = next) {                                                              // 645
        next = n.nextSibling;                                                                                          // 646
        if (!/\bCodeMirror-linewidget\b/.test(n.className)) {                                                          // 647
          reuse.removeChild(n);                                                                                        // 648
        } else {                                                                                                       // 649
          for (var i = 0, first = true; i < line.widgets.length; ++i) {                                                // 650
            var widget = line.widgets[i], isFirst = false;                                                             // 651
            if (!widget.above) { isFirst = first; first = false; }                                                     // 652
            if (widget.node == n.firstChild) {                                                                         // 653
              positionLineWidget(widget, n, reuse, dims);                                                              // 654
              ++widgetsSeen;                                                                                           // 655
              if (isFirst) reuse.insertBefore(lineElement, n);                                                         // 656
              break;                                                                                                   // 657
            }                                                                                                          // 658
          }                                                                                                            // 659
          if (i == line.widgets.length) { isOk = false; break; }                                                       // 660
        }                                                                                                              // 661
      }                                                                                                                // 662
      if (isOk && widgetsSeen == line.widgets.length) {                                                                // 663
        wrap = reuse;                                                                                                  // 664
        reuse.className = line.wrapClass || "";                                                                        // 665
      }                                                                                                                // 666
    }                                                                                                                  // 667
    if (!wrap) {                                                                                                       // 668
      wrap = elt("div", null, line.wrapClass, "position: relative");                                                   // 669
      wrap.appendChild(lineElement);                                                                                   // 670
    }                                                                                                                  // 671
    // Kludge to make sure the styled element lies behind the selection (by z-index)                                   // 672
    if (line.bgClass)                                                                                                  // 673
      wrap.insertBefore(elt("div", null, line.bgClass + " CodeMirror-linebackground"), wrap.firstChild);               // 674
    if (cm.options.lineNumbers || markers) {                                                                           // 675
      var gutterWrap = wrap.insertBefore(elt("div", null, null, "position: absolute; left: " +                         // 676
                                             (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"),
                                         wrap.firstChild);                                                             // 678
      if (cm.options.fixedGutter) (wrap.alignable || (wrap.alignable = [])).push(gutterWrap);                          // 679
      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))                                  // 680
        wrap.lineNumber = gutterWrap.appendChild(                                                                      // 681
          elt("div", lineNumberFor(cm.options, lineNo),                                                                // 682
              "CodeMirror-linenumber CodeMirror-gutter-elt",                                                           // 683
              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "                                     // 684
              + display.lineNumInnerWidth + "px"));                                                                    // 685
      if (markers)                                                                                                     // 686
        for (var k = 0; k < cm.options.gutters.length; ++k) {                                                          // 687
          var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];                           // 688
          if (found)                                                                                                   // 689
            gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +                             // 690
                                       dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));            // 691
        }                                                                                                              // 692
    }                                                                                                                  // 693
    if (ie_lt8) wrap.style.zIndex = 2;                                                                                 // 694
    if (line.widgets && wrap != reuse) for (var i = 0, ws = line.widgets; i < ws.length; ++i) {                        // 695
      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");                                   // 696
      positionLineWidget(widget, node, wrap, dims);                                                                    // 697
      if (widget.above)                                                                                                // 698
        wrap.insertBefore(node, cm.options.lineNumbers && line.height != 0 ? gutterWrap : lineElement);                // 699
      else                                                                                                             // 700
        wrap.appendChild(node);                                                                                        // 701
      signalLater(widget, "redraw");                                                                                   // 702
    }                                                                                                                  // 703
    return wrap;                                                                                                       // 704
  }                                                                                                                    // 705
                                                                                                                       // 706
  function positionLineWidget(widget, node, wrap, dims) {                                                              // 707
    if (widget.noHScroll) {                                                                                            // 708
      (wrap.alignable || (wrap.alignable = [])).push(node);                                                            // 709
      var width = dims.wrapperWidth;                                                                                   // 710
      node.style.left = dims.fixedPos + "px";                                                                          // 711
      if (!widget.coverGutter) {                                                                                       // 712
        width -= dims.gutterTotalWidth;                                                                                // 713
        node.style.paddingLeft = dims.gutterTotalWidth + "px";                                                         // 714
      }                                                                                                                // 715
      node.style.width = width + "px";                                                                                 // 716
    }                                                                                                                  // 717
    if (widget.coverGutter) {                                                                                          // 718
      node.style.zIndex = 5;                                                                                           // 719
      node.style.position = "relative";                                                                                // 720
      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";                                    // 721
    }                                                                                                                  // 722
  }                                                                                                                    // 723
                                                                                                                       // 724
  // SELECTION / CURSOR                                                                                                // 725
                                                                                                                       // 726
  function updateSelection(cm) {                                                                                       // 727
    var display = cm.display;                                                                                          // 728
    var collapsed = posEq(cm.doc.sel.from, cm.doc.sel.to);                                                             // 729
    if (collapsed || cm.options.showCursorWhenSelecting)                                                               // 730
      updateSelectionCursor(cm);                                                                                       // 731
    else                                                                                                               // 732
      display.cursor.style.display = display.otherCursor.style.display = "none";                                       // 733
    if (!collapsed)                                                                                                    // 734
      updateSelectionRange(cm);                                                                                        // 735
    else                                                                                                               // 736
      display.selectionDiv.style.display = "none";                                                                     // 737
                                                                                                                       // 738
    // Move the hidden textarea near the cursor to prevent scrolling artifacts                                         // 739
    var headPos = cursorCoords(cm, cm.doc.sel.head, "div");                                                            // 740
    var wrapOff = getRect(display.wrapper), lineOff = getRect(display.lineDiv);                                        // 741
    display.inputDiv.style.top = Math.max(0, Math.min(display.wrapper.clientHeight - 10,                               // 742
                                                      headPos.top + lineOff.top - wrapOff.top)) + "px";                // 743
    display.inputDiv.style.left = Math.max(0, Math.min(display.wrapper.clientWidth - 10,                               // 744
                                                       headPos.left + lineOff.left - wrapOff.left)) + "px";            // 745
  }                                                                                                                    // 746
                                                                                                                       // 747
  // No selection, plain cursor                                                                                        // 748
  function updateSelectionCursor(cm) {                                                                                 // 749
    var display = cm.display, pos = cursorCoords(cm, cm.doc.sel.head, "div");                                          // 750
    display.cursor.style.left = pos.left + "px";                                                                       // 751
    display.cursor.style.top = pos.top + "px";                                                                         // 752
    display.cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";                  // 753
    display.cursor.style.display = "";                                                                                 // 754
                                                                                                                       // 755
    if (pos.other) {                                                                                                   // 756
      display.otherCursor.style.display = "";                                                                          // 757
      display.otherCursor.style.left = pos.other.left + "px";                                                          // 758
      display.otherCursor.style.top = pos.other.top + "px";                                                            // 759
      display.otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";                              // 760
    } else { display.otherCursor.style.display = "none"; }                                                             // 761
  }                                                                                                                    // 762
                                                                                                                       // 763
  // Highlight selection                                                                                               // 764
  function updateSelectionRange(cm) {                                                                                  // 765
    var display = cm.display, doc = cm.doc, sel = cm.doc.sel;                                                          // 766
    var fragment = document.createDocumentFragment();                                                                  // 767
    var clientWidth = display.lineSpace.offsetWidth, pl = paddingLeft(cm.display);                                     // 768
                                                                                                                       // 769
    function add(left, top, width, bottom) {                                                                           // 770
      if (top < 0) top = 0;                                                                                            // 771
      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +               // 772
                               "px; top: " + top + "px; width: " + (width == null ? clientWidth - left : width) +      // 773
                               "px; height: " + (bottom - top) + "px"));                                               // 774
    }                                                                                                                  // 775
                                                                                                                       // 776
    function drawForLine(line, fromArg, toArg, retTop) {                                                               // 777
      var lineObj = getLine(doc, line);                                                                                // 778
      var lineLen = lineObj.text.length, rVal = retTop ? Infinity : -Infinity;                                         // 779
      function coords(ch) {                                                                                            // 780
        return charCoords(cm, Pos(line, ch), "div", lineObj);                                                          // 781
      }                                                                                                                // 782
                                                                                                                       // 783
      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {  // 784
        var leftPos = coords(dir == "rtl" ? to - 1 : from);                                                            // 785
        var rightPos = coords(dir == "rtl" ? from : to - 1);                                                           // 786
        var left = leftPos.left, right = rightPos.right;                                                               // 787
        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part                                        // 788
          add(left, leftPos.top, null, leftPos.bottom);                                                                // 789
          left = pl;                                                                                                   // 790
          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);                            // 791
        }                                                                                                              // 792
        if (toArg == null && to == lineLen) right = clientWidth;                                                       // 793
        if (fromArg == null && from == 0) left = pl;                                                                   // 794
        rVal = retTop ? Math.min(rightPos.top, rVal) : Math.max(rightPos.bottom, rVal);                                // 795
        if (left < pl + 1) left = pl;                                                                                  // 796
        add(left, rightPos.top, right - left, rightPos.bottom);                                                        // 797
      });                                                                                                              // 798
      return rVal;                                                                                                     // 799
    }                                                                                                                  // 800
                                                                                                                       // 801
    if (sel.from.line == sel.to.line) {                                                                                // 802
      drawForLine(sel.from.line, sel.from.ch, sel.to.ch);                                                              // 803
    } else {                                                                                                           // 804
      var fromObj = getLine(doc, sel.from.line);                                                                       // 805
      var cur = fromObj, merged, path = [sel.from.line, sel.from.ch], singleLine;                                      // 806
      while (merged = collapsedSpanAtEnd(cur)) {                                                                       // 807
        var found = merged.find();                                                                                     // 808
        path.push(found.from.ch, found.to.line, found.to.ch);                                                          // 809
        if (found.to.line == sel.to.line) {                                                                            // 810
          path.push(sel.to.ch);                                                                                        // 811
          singleLine = true;                                                                                           // 812
          break;                                                                                                       // 813
        }                                                                                                              // 814
        cur = getLine(doc, found.to.line);                                                                             // 815
      }                                                                                                                // 816
                                                                                                                       // 817
      // This is a single, merged line                                                                                 // 818
      if (singleLine) {                                                                                                // 819
        for (var i = 0; i < path.length; i += 3)                                                                       // 820
          drawForLine(path[i], path[i+1], path[i+2]);                                                                  // 821
      } else {                                                                                                         // 822
        var middleTop, middleBot, toObj = getLine(doc, sel.to.line);                                                   // 823
        if (sel.from.ch)                                                                                               // 824
          // Draw the first line of selection.                                                                         // 825
          middleTop = drawForLine(sel.from.line, sel.from.ch, null, false);                                            // 826
        else                                                                                                           // 827
          // Simply include it in the middle block.                                                                    // 828
          middleTop = heightAtLine(cm, fromObj) - display.viewOffset;                                                  // 829
                                                                                                                       // 830
        if (!sel.to.ch)                                                                                                // 831
          middleBot = heightAtLine(cm, toObj) - display.viewOffset;                                                    // 832
        else                                                                                                           // 833
          middleBot = drawForLine(sel.to.line, collapsedSpanAtStart(toObj) ? null : 0, sel.to.ch, true);               // 834
                                                                                                                       // 835
        if (middleTop < middleBot) add(pl, middleTop, null, middleBot);                                                // 836
      }                                                                                                                // 837
    }                                                                                                                  // 838
                                                                                                                       // 839
    removeChildrenAndAdd(display.selectionDiv, fragment);                                                              // 840
    display.selectionDiv.style.display = "";                                                                           // 841
  }                                                                                                                    // 842
                                                                                                                       // 843
  // Cursor-blinking                                                                                                   // 844
  function restartBlink(cm) {                                                                                          // 845
    var display = cm.display;                                                                                          // 846
    clearInterval(display.blinker);                                                                                    // 847
    var on = true;                                                                                                     // 848
    display.cursor.style.visibility = display.otherCursor.style.visibility = "";                                       // 849
    display.blinker = setInterval(function() {                                                                         // 850
      if (!display.cursor.offsetHeight) return;                                                                        // 851
      display.cursor.style.visibility = display.otherCursor.style.visibility = (on = !on) ? "" : "hidden";             // 852
    }, cm.options.cursorBlinkRate);                                                                                    // 853
  }                                                                                                                    // 854
                                                                                                                       // 855
  // HIGHLIGHT WORKER                                                                                                  // 856
                                                                                                                       // 857
  function startWorker(cm, time) {                                                                                     // 858
    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.showingTo)                                              // 859
      cm.state.highlight.set(time, bind(highlightWorker, cm));                                                         // 860
  }                                                                                                                    // 861
                                                                                                                       // 862
  function highlightWorker(cm) {                                                                                       // 863
    var doc = cm.doc;                                                                                                  // 864
    if (doc.frontier < doc.first) doc.frontier = doc.first;                                                            // 865
    if (doc.frontier >= cm.display.showingTo) return;                                                                  // 866
    var end = +new Date + cm.options.workTime;                                                                         // 867
    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));                                                 // 868
    var changed = [], prevChange;                                                                                      // 869
    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.showingTo + 500), function(line) {                // 870
      if (doc.frontier >= cm.display.showingFrom) { // Visible                                                         // 871
        var oldStyles = line.styles;                                                                                   // 872
        line.styles = highlightLine(cm, line, state);                                                                  // 873
        var ischange = !oldStyles || oldStyles.length != line.styles.length;                                           // 874
        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];             // 875
        if (ischange) {                                                                                                // 876
          if (prevChange && prevChange.end == doc.frontier) prevChange.end++;                                          // 877
          else changed.push(prevChange = {start: doc.frontier, end: doc.frontier + 1});                                // 878
        }                                                                                                              // 879
        line.stateAfter = copyState(doc.mode, state);                                                                  // 880
      } else {                                                                                                         // 881
        processLine(cm, line, state);                                                                                  // 882
        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;                                   // 883
      }                                                                                                                // 884
      ++doc.frontier;                                                                                                  // 885
      if (+new Date > end) {                                                                                           // 886
        startWorker(cm, cm.options.workDelay);                                                                         // 887
        return true;                                                                                                   // 888
      }                                                                                                                // 889
    });                                                                                                                // 890
    if (changed.length)                                                                                                // 891
      operation(cm, function() {                                                                                       // 892
        for (var i = 0; i < changed.length; ++i)                                                                       // 893
          regChange(this, changed[i].start, changed[i].end);                                                           // 894
      })();                                                                                                            // 895
  }                                                                                                                    // 896
                                                                                                                       // 897
  // Finds the line to start with when starting a parse. Tries to                                                      // 898
  // find a line with a stateAfter, so that it can start with a                                                        // 899
  // valid state. If that fails, it returns the line with the                                                          // 900
  // smallest indentation, which tends to need the least context to                                                    // 901
  // parse correctly.                                                                                                  // 902
  function findStartLine(cm, n) {                                                                                      // 903
    var minindent, minline, doc = cm.doc;                                                                              // 904
    for (var search = n, lim = n - 100; search > lim; --search) {                                                      // 905
      if (search <= doc.first) return doc.first;                                                                       // 906
      var line = getLine(doc, search - 1);                                                                             // 907
      if (line.stateAfter) return search;                                                                              // 908
      var indented = countColumn(line.text, null, cm.options.tabSize);                                                 // 909
      if (minline == null || minindent > indented) {                                                                   // 910
        minline = search - 1;                                                                                          // 911
        minindent = indented;                                                                                          // 912
      }                                                                                                                // 913
    }                                                                                                                  // 914
    return minline;                                                                                                    // 915
  }                                                                                                                    // 916
                                                                                                                       // 917
  function getStateBefore(cm, n) {                                                                                     // 918
    var doc = cm.doc, display = cm.display;                                                                            // 919
      if (!doc.mode.startState) return true;                                                                           // 920
    var pos = findStartLine(cm, n), state = pos > doc.first && getLine(doc, pos-1).stateAfter;                         // 921
    if (!state) state = startState(doc.mode);                                                                          // 922
    else state = copyState(doc.mode, state);                                                                           // 923
    doc.iter(pos, n, function(line) {                                                                                  // 924
      processLine(cm, line, state);                                                                                    // 925
      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.showingFrom && pos < display.showingTo;                // 926
      line.stateAfter = save ? copyState(doc.mode, state) : null;                                                      // 927
      ++pos;                                                                                                           // 928
    });                                                                                                                // 929
    return state;                                                                                                      // 930
  }                                                                                                                    // 931
                                                                                                                       // 932
  // POSITION MEASUREMENT                                                                                              // 933
                                                                                                                       // 934
  function paddingTop(display) {return display.lineSpace.offsetTop;}                                                   // 935
  function paddingLeft(display) {                                                                                      // 936
    var e = removeChildrenAndAdd(display.measure, elt("pre", null, null, "text-align: left")).appendChild(elt("span", "x"));
    return e.offsetLeft;                                                                                               // 938
  }                                                                                                                    // 939
                                                                                                                       // 940
  function measureChar(cm, line, ch, data) {                                                                           // 941
    var dir = -1;                                                                                                      // 942
    data = data || measureLine(cm, line);                                                                              // 943
                                                                                                                       // 944
    for (var pos = ch;; pos += dir) {                                                                                  // 945
      var r = data[pos];                                                                                               // 946
      if (r) break;                                                                                                    // 947
      if (dir < 0 && pos == 0) dir = 1;                                                                                // 948
    }                                                                                                                  // 949
    return {left: pos < ch ? r.right : r.left,                                                                         // 950
            right: pos > ch ? r.left : r.right,                                                                        // 951
            top: r.top, bottom: r.bottom};                                                                             // 952
  }                                                                                                                    // 953
                                                                                                                       // 954
  function findCachedMeasurement(cm, line) {                                                                           // 955
    var cache = cm.display.measureLineCache;                                                                           // 956
    for (var i = 0; i < cache.length; ++i) {                                                                           // 957
      var memo = cache[i];                                                                                             // 958
      if (memo.text == line.text && memo.markedSpans == line.markedSpans &&                                            // 959
          cm.display.scroller.clientWidth == memo.width &&                                                             // 960
          memo.classes == line.textClass + "|" + line.bgClass + "|" + line.wrapClass)                                  // 961
        return memo.measure;                                                                                           // 962
    }                                                                                                                  // 963
  }                                                                                                                    // 964
                                                                                                                       // 965
  function measureLine(cm, line) {                                                                                     // 966
    // First look in the cache                                                                                         // 967
    var measure = findCachedMeasurement(cm, line);                                                                     // 968
    if (!measure) {                                                                                                    // 969
      // Failing that, recompute and store result in cache                                                             // 970
      measure = measureLineInner(cm, line);                                                                            // 971
      var cache = cm.display.measureLineCache;                                                                         // 972
      var memo = {text: line.text, width: cm.display.scroller.clientWidth,                                             // 973
                  markedSpans: line.markedSpans, measure: measure,                                                     // 974
                  classes: line.textClass + "|" + line.bgClass + "|" + line.wrapClass};                                // 975
      if (cache.length == 16) cache[++cm.display.measureLineCachePos % 16] = memo;                                     // 976
      else cache.push(memo);                                                                                           // 977
    }                                                                                                                  // 978
    return measure;                                                                                                    // 979
  }                                                                                                                    // 980
                                                                                                                       // 981
  function measureLineInner(cm, line) {                                                                                // 982
    var display = cm.display, measure = emptyArray(line.text.length);                                                  // 983
    var pre = lineContent(cm, line, measure);                                                                          // 984
                                                                                                                       // 985
    // IE does not cache element positions of inline elements between                                                  // 986
    // calls to getBoundingClientRect. This makes the loop below,                                                      // 987
    // which gathers the positions of all the characters on the line,                                                  // 988
    // do an amount of layout work quadratic to the number of                                                          // 989
    // characters. When line wrapping is off, we try to improve things                                                 // 990
    // by first subdividing the line into a bunch of inline blocks, so                                                 // 991
    // that IE can reuse most of the layout information from caches                                                    // 992
    // for those blocks. This does interfere with line wrapping, so it                                                 // 993
    // doesn't work when wrapping is on, but in that case the                                                          // 994
    // situation is slightly better, since IE does cache line-wrapping                                                 // 995
    // information and only recomputes per-line.                                                                       // 996
    if (ie && !ie_lt8 && !cm.options.lineWrapping && pre.childNodes.length > 100) {                                    // 997
      var fragment = document.createDocumentFragment();                                                                // 998
      var chunk = 10, n = pre.childNodes.length;                                                                       // 999
      for (var i = 0, chunks = Math.ceil(n / chunk); i < chunks; ++i) {                                                // 1000
        var wrap = elt("div", null, null, "display: inline-block");                                                    // 1001
        for (var j = 0; j < chunk && n; ++j) {                                                                         // 1002
          wrap.appendChild(pre.firstChild);                                                                            // 1003
          --n;                                                                                                         // 1004
        }                                                                                                              // 1005
        fragment.appendChild(wrap);                                                                                    // 1006
      }                                                                                                                // 1007
      pre.appendChild(fragment);                                                                                       // 1008
    }                                                                                                                  // 1009
                                                                                                                       // 1010
    removeChildrenAndAdd(display.measure, pre);                                                                        // 1011
                                                                                                                       // 1012
    var outer = getRect(display.lineDiv);                                                                              // 1013
    var vranges = [], data = emptyArray(line.text.length), maxBot = pre.offsetHeight;                                  // 1014
    // Work around an IE7/8 bug where it will sometimes have randomly                                                  // 1015
    // replaced our pre with a clone at this point.                                                                    // 1016
    if (ie_lt9 && display.measure.first != pre)                                                                        // 1017
      removeChildrenAndAdd(display.measure, pre);                                                                      // 1018
                                                                                                                       // 1019
    for (var i = 0, cur; i < measure.length; ++i) if (cur = measure[i]) {                                              // 1020
      var size = getRect(cur);                                                                                         // 1021
      var top = Math.max(0, size.top - outer.top), bot = Math.min(size.bottom - outer.top, maxBot);                    // 1022
      for (var j = 0; j < vranges.length; j += 2) {                                                                    // 1023
        var rtop = vranges[j], rbot = vranges[j+1];                                                                    // 1024
        if (rtop > bot || rbot < top) continue;                                                                        // 1025
        if (rtop <= top && rbot >= bot ||                                                                              // 1026
            top <= rtop && bot >= rbot ||                                                                              // 1027
            Math.min(bot, rbot) - Math.max(top, rtop) >= (bot - top) >> 1) {                                           // 1028
          vranges[j] = Math.min(top, rtop);                                                                            // 1029
          vranges[j+1] = Math.max(bot, rbot);                                                                          // 1030
          break;                                                                                                       // 1031
        }                                                                                                              // 1032
      }                                                                                                                // 1033
      if (j == vranges.length) vranges.push(top, bot);                                                                 // 1034
      var right = size.right;                                                                                          // 1035
      if (cur.measureRight) right = getRect(cur.measureRight).left;                                                    // 1036
      data[i] = {left: size.left - outer.left, right: right - outer.left, top: j};                                     // 1037
    }                                                                                                                  // 1038
    for (var i = 0, cur; i < data.length; ++i) if (cur = data[i]) {                                                    // 1039
      var vr = cur.top;                                                                                                // 1040
      cur.top = vranges[vr]; cur.bottom = vranges[vr+1];                                                               // 1041
    }                                                                                                                  // 1042
                                                                                                                       // 1043
    return data;                                                                                                       // 1044
  }                                                                                                                    // 1045
                                                                                                                       // 1046
  function measureLineWidth(cm, line) {                                                                                // 1047
    var hasBadSpan = false;                                                                                            // 1048
    if (line.markedSpans) for (var i = 0; i < line.markedSpans; ++i) {                                                 // 1049
      var sp = line.markedSpans[i];                                                                                    // 1050
      if (sp.collapsed && (sp.to == null || sp.to == line.text.length)) hasBadSpan = true;                             // 1051
    }                                                                                                                  // 1052
    var cached = !hasBadSpan && findCachedMeasurement(cm, line);                                                       // 1053
    if (cached) return measureChar(cm, line, line.text.length, cached).right;                                          // 1054
                                                                                                                       // 1055
    var pre = lineContent(cm, line);                                                                                   // 1056
    var end = pre.appendChild(zeroWidthElement(cm.display.measure));                                                   // 1057
    removeChildrenAndAdd(cm.display.measure, pre);                                                                     // 1058
    return getRect(end).right - getRect(cm.display.lineDiv).left;                                                      // 1059
  }                                                                                                                    // 1060
                                                                                                                       // 1061
  function clearCaches(cm) {                                                                                           // 1062
    cm.display.measureLineCache.length = cm.display.measureLineCachePos = 0;                                           // 1063
    cm.display.cachedCharWidth = cm.display.cachedTextHeight = null;                                                   // 1064
    cm.display.maxLineChanged = true;                                                                                  // 1065
    cm.display.lineNumChars = null;                                                                                    // 1066
  }                                                                                                                    // 1067
                                                                                                                       // 1068
  // Context is one of "line", "div" (display.lineDiv), "local"/null (editor), or "page"                               // 1069
  function intoCoordSystem(cm, lineObj, rect, context) {                                                               // 1070
    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {              // 1071
      var size = widgetHeight(lineObj.widgets[i]);                                                                     // 1072
      rect.top += size; rect.bottom += size;                                                                           // 1073
    }                                                                                                                  // 1074
    if (context == "line") return rect;                                                                                // 1075
    if (!context) context = "local";                                                                                   // 1076
    var yOff = heightAtLine(cm, lineObj);                                                                              // 1077
    if (context != "local") yOff -= cm.display.viewOffset;                                                             // 1078
    if (context == "page") {                                                                                           // 1079
      var lOff = getRect(cm.display.lineSpace);                                                                        // 1080
      yOff += lOff.top + (window.pageYOffset || (document.documentElement || document.body).scrollTop);                // 1081
      var xOff = lOff.left + (window.pageXOffset || (document.documentElement || document.body).scrollLeft);           // 1082
      rect.left += xOff; rect.right += xOff;                                                                           // 1083
    }                                                                                                                  // 1084
    rect.top += yOff; rect.bottom += yOff;                                                                             // 1085
    return rect;                                                                                                       // 1086
  }                                                                                                                    // 1087
                                                                                                                       // 1088
  function charCoords(cm, pos, context, lineObj) {                                                                     // 1089
    if (!lineObj) lineObj = getLine(cm.doc, pos.line);                                                                 // 1090
    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch), context);                                    // 1091
  }                                                                                                                    // 1092
                                                                                                                       // 1093
  function cursorCoords(cm, pos, context, lineObj, measurement) {                                                      // 1094
    lineObj = lineObj || getLine(cm.doc, pos.line);                                                                    // 1095
    if (!measurement) measurement = measureLine(cm, lineObj);                                                          // 1096
    function get(ch, right) {                                                                                          // 1097
      var m = measureChar(cm, lineObj, ch, measurement);                                                               // 1098
      if (right) m.left = m.right; else m.right = m.left;                                                              // 1099
      return intoCoordSystem(cm, lineObj, m, context);                                                                 // 1100
    }                                                                                                                  // 1101
    var order = getOrder(lineObj), ch = pos.ch;                                                                        // 1102
    if (!order) return get(ch);                                                                                        // 1103
    var main, other, linedir = order[0].level;                                                                         // 1104
    for (var i = 0; i < order.length; ++i) {                                                                           // 1105
      var part = order[i], rtl = part.level % 2, nb, here;                                                             // 1106
      if (part.from < ch && part.to > ch) return get(ch, rtl);                                                         // 1107
      var left = rtl ? part.to : part.from, right = rtl ? part.from : part.to;                                         // 1108
      if (left == ch) {                                                                                                // 1109
        // IE returns bogus offsets and widths for edges where the                                                     // 1110
        // direction flips, but only for the side with the lower                                                       // 1111
        // level. So we try to use the side with the higher level.                                                     // 1112
        if (i && part.level < (nb = order[i-1]).level) here = get(nb.level % 2 ? nb.from : nb.to - 1, true);           // 1113
        else here = get(rtl && part.from != part.to ? ch - 1 : ch);                                                    // 1114
        if (rtl == linedir) main = here; else other = here;                                                            // 1115
      } else if (right == ch) {                                                                                        // 1116
        var nb = i < order.length - 1 && order[i+1];                                                                   // 1117
        if (!rtl && nb && nb.from == nb.to) continue;                                                                  // 1118
        if (nb && part.level < nb.level) here = get(nb.level % 2 ? nb.to - 1 : nb.from);                               // 1119
        else here = get(rtl ? ch : ch - 1, true);                                                                      // 1120
        if (rtl == linedir) main = here; else other = here;                                                            // 1121
      }                                                                                                                // 1122
    }                                                                                                                  // 1123
    if (linedir && !ch) other = get(order[0].to - 1);                                                                  // 1124
    if (!main) return other;                                                                                           // 1125
    if (other) main.other = other;                                                                                     // 1126
    return main;                                                                                                       // 1127
  }                                                                                                                    // 1128
                                                                                                                       // 1129
  function PosMaybeOutside(line, ch, outside) {                                                                        // 1130
    var pos = new Pos(line, ch);                                                                                       // 1131
    if (outside) pos.outside = true;                                                                                   // 1132
    return pos;                                                                                                        // 1133
  }                                                                                                                    // 1134
                                                                                                                       // 1135
  // Coords must be lineSpace-local                                                                                    // 1136
  function coordsChar(cm, x, y) {                                                                                      // 1137
    var doc = cm.doc;                                                                                                  // 1138
    y += cm.display.viewOffset;                                                                                        // 1139
    if (y < 0) return PosMaybeOutside(doc.first, 0, true);                                                             // 1140
    var lineNo = lineAtHeight(doc, y), last = doc.first + doc.size - 1;                                                // 1141
    if (lineNo > last)                                                                                                 // 1142
      return PosMaybeOutside(doc.first + doc.size - 1, getLine(doc, last).text.length, true);                          // 1143
    if (x < 0) x = 0;                                                                                                  // 1144
                                                                                                                       // 1145
    for (;;) {                                                                                                         // 1146
      var lineObj = getLine(doc, lineNo);                                                                              // 1147
      var found = coordsCharInner(cm, lineObj, lineNo, x, y);                                                          // 1148
      var merged = collapsedSpanAtEnd(lineObj);                                                                        // 1149
      var mergedPos = merged && merged.find();                                                                         // 1150
      if (merged && found.ch >= mergedPos.from.ch)                                                                     // 1151
        lineNo = mergedPos.to.line;                                                                                    // 1152
      else                                                                                                             // 1153
        return found;                                                                                                  // 1154
    }                                                                                                                  // 1155
  }                                                                                                                    // 1156
                                                                                                                       // 1157
  function coordsCharInner(cm, lineObj, lineNo, x, y) {                                                                // 1158
    var innerOff = y - heightAtLine(cm, lineObj);                                                                      // 1159
    var wrongLine = false, cWidth = cm.display.wrapper.clientWidth;                                                    // 1160
    var measurement = measureLine(cm, lineObj);                                                                        // 1161
                                                                                                                       // 1162
    function getX(ch) {                                                                                                // 1163
      var sp = cursorCoords(cm, Pos(lineNo, ch), "line",                                                               // 1164
                            lineObj, measurement);                                                                     // 1165
      wrongLine = true;                                                                                                // 1166
      if (innerOff > sp.bottom) return Math.max(0, sp.left - cWidth);                                                  // 1167
      else if (innerOff < sp.top) return sp.left + cWidth;                                                             // 1168
      else wrongLine = false;                                                                                          // 1169
      return sp.left;                                                                                                  // 1170
    }                                                                                                                  // 1171
                                                                                                                       // 1172
    var bidi = getOrder(lineObj), dist = lineObj.text.length;                                                          // 1173
    var from = lineLeft(lineObj), to = lineRight(lineObj);                                                             // 1174
    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;                            // 1175
                                                                                                                       // 1176
    if (x > toX) return PosMaybeOutside(lineNo, to, toOutside);                                                        // 1177
    // Do a binary search between these bounds.                                                                        // 1178
    for (;;) {                                                                                                         // 1179
      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {                                // 1180
        var after = x - fromX < toX - x, ch = after ? from : to;                                                       // 1181
        while (isExtendingChar.test(lineObj.text.charAt(ch))) ++ch;                                                    // 1182
        var pos = PosMaybeOutside(lineNo, ch, after ? fromOutside : toOutside);                                        // 1183
        pos.after = after;                                                                                             // 1184
        return pos;                                                                                                    // 1185
      }                                                                                                                // 1186
      var step = Math.ceil(dist / 2), middle = from + step;                                                            // 1187
      if (bidi) {                                                                                                      // 1188
        middle = from;                                                                                                 // 1189
        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);                                      // 1190
      }                                                                                                                // 1191
      var middleX = getX(middle);                                                                                      // 1192
      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist -= step;}             // 1193
      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist = step;}                                     // 1194
    }                                                                                                                  // 1195
  }                                                                                                                    // 1196
                                                                                                                       // 1197
  var measureText;                                                                                                     // 1198
  function textHeight(display) {                                                                                       // 1199
    if (display.cachedTextHeight != null) return display.cachedTextHeight;                                             // 1200
    if (measureText == null) {                                                                                         // 1201
      measureText = elt("pre");                                                                                        // 1202
      // Measure a bunch of lines, for browsers that compute                                                           // 1203
      // fractional heights.                                                                                           // 1204
      for (var i = 0; i < 49; ++i) {                                                                                   // 1205
        measureText.appendChild(document.createTextNode("x"));                                                         // 1206
        measureText.appendChild(elt("br"));                                                                            // 1207
      }                                                                                                                // 1208
      measureText.appendChild(document.createTextNode("x"));                                                           // 1209
    }                                                                                                                  // 1210
    removeChildrenAndAdd(display.measure, measureText);                                                                // 1211
    var height = measureText.offsetHeight / 50;                                                                        // 1212
    if (height > 3) display.cachedTextHeight = height;                                                                 // 1213
    removeChildren(display.measure);                                                                                   // 1214
    return height || 1;                                                                                                // 1215
  }                                                                                                                    // 1216
                                                                                                                       // 1217
  function charWidth(display) {                                                                                        // 1218
    if (display.cachedCharWidth != null) return display.cachedCharWidth;                                               // 1219
    var anchor = elt("span", "x");                                                                                     // 1220
    var pre = elt("pre", [anchor]);                                                                                    // 1221
    removeChildrenAndAdd(display.measure, pre);                                                                        // 1222
    var width = anchor.offsetWidth;                                                                                    // 1223
    if (width > 2) display.cachedCharWidth = width;                                                                    // 1224
    return width || 10;                                                                                                // 1225
  }                                                                                                                    // 1226
                                                                                                                       // 1227
  // OPERATIONS                                                                                                        // 1228
                                                                                                                       // 1229
  // Operations are used to wrap changes in such a way that each                                                       // 1230
  // change won't have to update the cursor and display (which would                                                   // 1231
  // be awkward, slow, and error-prone), but instead updates are                                                       // 1232
  // batched and then all combined and executed at once.                                                               // 1233
                                                                                                                       // 1234
  var nextOpId = 0;                                                                                                    // 1235
  function startOperation(cm) {                                                                                        // 1236
    cm.curOp = {                                                                                                       // 1237
      // An array of ranges of lines that have to be updated. See                                                      // 1238
      // updateDisplay.                                                                                                // 1239
      changes: [],                                                                                                     // 1240
      updateInput: null,                                                                                               // 1241
      userSelChange: null,                                                                                             // 1242
      textChanged: null,                                                                                               // 1243
      selectionChanged: false,                                                                                         // 1244
      updateMaxLine: false,                                                                                            // 1245
      updateScrollPos: false,                                                                                          // 1246
      id: ++nextOpId                                                                                                   // 1247
    };                                                                                                                 // 1248
    if (!delayedCallbackDepth++) delayedCallbacks = [];                                                                // 1249
  }                                                                                                                    // 1250
                                                                                                                       // 1251
  function endOperation(cm) {                                                                                          // 1252
    var op = cm.curOp, doc = cm.doc, display = cm.display;                                                             // 1253
    cm.curOp = null;                                                                                                   // 1254
                                                                                                                       // 1255
    if (op.updateMaxLine) computeMaxLength(cm);                                                                        // 1256
    if (display.maxLineChanged && !cm.options.lineWrapping) {                                                          // 1257
      var width = measureLineWidth(cm, display.maxLine);                                                               // 1258
      display.sizer.style.minWidth = Math.max(0, width + 3 + scrollerCutOff) + "px";                                   // 1259
      display.maxLineChanged = false;                                                                                  // 1260
      var maxScrollLeft = Math.max(0, display.sizer.offsetLeft + display.sizer.offsetWidth - display.scroller.clientWidth);
      if (maxScrollLeft < doc.scrollLeft && !op.updateScrollPos)                                                       // 1262
        setScrollLeft(cm, Math.min(display.scroller.scrollLeft, maxScrollLeft), true);                                 // 1263
    }                                                                                                                  // 1264
    var newScrollPos, updated;                                                                                         // 1265
    if (op.updateScrollPos) {                                                                                          // 1266
      newScrollPos = op.updateScrollPos;                                                                               // 1267
    } else if (op.selectionChanged && display.scroller.clientHeight) { // don't rescroll if not visible                // 1268
      var coords = cursorCoords(cm, doc.sel.head);                                                                     // 1269
      newScrollPos = calculateScrollPos(cm, coords.left, coords.top, coords.left, coords.bottom);                      // 1270
    }                                                                                                                  // 1271
    if (op.changes.length || newScrollPos && newScrollPos.scrollTop != null)                                           // 1272
      updated = updateDisplay(cm, op.changes, newScrollPos && newScrollPos.scrollTop);                                 // 1273
    if (!updated && op.selectionChanged) updateSelection(cm);                                                          // 1274
    if (op.updateScrollPos) {                                                                                          // 1275
      display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = newScrollPos.scrollTop;              // 1276
      display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = newScrollPos.scrollLeft;          // 1277
      alignHorizontally(cm);                                                                                           // 1278
    } else if (newScrollPos) {                                                                                         // 1279
      scrollCursorIntoView(cm);                                                                                        // 1280
    }                                                                                                                  // 1281
    if (op.selectionChanged) restartBlink(cm);                                                                         // 1282
                                                                                                                       // 1283
    if (cm.state.focused && op.updateInput)                                                                            // 1284
      resetInput(cm, op.userSelChange);                                                                                // 1285
                                                                                                                       // 1286
    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;                                            // 1287
    if (hidden) for (var i = 0; i < hidden.length; ++i)                                                                // 1288
      if (!hidden[i].lines.length) signal(hidden[i], "hide");                                                          // 1289
    if (unhidden) for (var i = 0; i < unhidden.length; ++i)                                                            // 1290
      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");                                                     // 1291
                                                                                                                       // 1292
    var delayed;                                                                                                       // 1293
    if (!--delayedCallbackDepth) {                                                                                     // 1294
      delayed = delayedCallbacks;                                                                                      // 1295
      delayedCallbacks = null;                                                                                         // 1296
    }                                                                                                                  // 1297
    if (op.textChanged)                                                                                                // 1298
      signal(cm, "change", cm, op.textChanged);                                                                        // 1299
    if (op.selectionChanged) signal(cm, "cursorActivity", cm);                                                         // 1300
    if (delayed) for (var i = 0; i < delayed.length; ++i) delayed[i]();                                                // 1301
  }                                                                                                                    // 1302
                                                                                                                       // 1303
  // Wraps a function in an operation. Returns the wrapped function.                                                   // 1304
  function operation(cm1, f) {                                                                                         // 1305
    return function() {                                                                                                // 1306
      var cm = cm1 || this, withOp = !cm.curOp;                                                                        // 1307
      if (withOp) startOperation(cm);                                                                                  // 1308
      try { var result = f.apply(cm, arguments); }                                                                     // 1309
      finally { if (withOp) endOperation(cm); }                                                                        // 1310
      return result;                                                                                                   // 1311
    };                                                                                                                 // 1312
  }                                                                                                                    // 1313
  function docOperation(f) {                                                                                           // 1314
    return function() {                                                                                                // 1315
      var withOp = this.cm && !this.cm.curOp, result;                                                                  // 1316
      if (withOp) startOperation(this.cm);                                                                             // 1317
      try { result = f.apply(this, arguments); }                                                                       // 1318
      finally { if (withOp) endOperation(this.cm); }                                                                   // 1319
      return result;                                                                                                   // 1320
    };                                                                                                                 // 1321
  }                                                                                                                    // 1322
  function runInOp(cm, f) {                                                                                            // 1323
    var withOp = !cm.curOp, result;                                                                                    // 1324
    if (withOp) startOperation(cm);                                                                                    // 1325
    try { result = f(); }                                                                                              // 1326
    finally { if (withOp) endOperation(cm); }                                                                          // 1327
    return result;                                                                                                     // 1328
  }                                                                                                                    // 1329
                                                                                                                       // 1330
  function regChange(cm, from, to, lendiff) {                                                                          // 1331
    if (from == null) from = cm.doc.first;                                                                             // 1332
    if (to == null) to = cm.doc.first + cm.doc.size;                                                                   // 1333
    cm.curOp.changes.push({from: from, to: to, diff: lendiff});                                                        // 1334
  }                                                                                                                    // 1335
                                                                                                                       // 1336
  // INPUT HANDLING                                                                                                    // 1337
                                                                                                                       // 1338
  function slowPoll(cm) {                                                                                              // 1339
    if (cm.display.pollingFast) return;                                                                                // 1340
    cm.display.poll.set(cm.options.pollInterval, function() {                                                          // 1341
      readInput(cm);                                                                                                   // 1342
      if (cm.state.focused) slowPoll(cm);                                                                              // 1343
    });                                                                                                                // 1344
  }                                                                                                                    // 1345
                                                                                                                       // 1346
  function fastPoll(cm) {                                                                                              // 1347
    var missed = false;                                                                                                // 1348
    cm.display.pollingFast = true;                                                                                     // 1349
    function p() {                                                                                                     // 1350
      var changed = readInput(cm);                                                                                     // 1351
      if (!changed && !missed) {missed = true; cm.display.poll.set(60, p);}                                            // 1352
      else {cm.display.pollingFast = false; slowPoll(cm);}                                                             // 1353
    }                                                                                                                  // 1354
    cm.display.poll.set(20, p);                                                                                        // 1355
  }                                                                                                                    // 1356
                                                                                                                       // 1357
  // prevInput is a hack to work with IME. If we reset the textarea                                                    // 1358
  // on every change, that breaks IME. So we look for changes                                                          // 1359
  // compared to the previous content instead. (Modern browsers have                                                   // 1360
  // events that indicate IME taking place, but these are not widely                                                   // 1361
  // supported or compatible enough yet to rely on.)                                                                   // 1362
  function readInput(cm) {                                                                                             // 1363
    var input = cm.display.input, prevInput = cm.display.prevInput, doc = cm.doc, sel = doc.sel;                       // 1364
    if (!cm.state.focused || hasSelection(input) || isReadOnly(cm)) return false;                                      // 1365
    var text = input.value;                                                                                            // 1366
    if (text == prevInput && posEq(sel.from, sel.to)) return false;                                                    // 1367
    // IE enjoys randomly deselecting our input's text when                                                            // 1368
    // re-focusing. If the selection is gone but the cursor is at the                                                  // 1369
    // start of the input, that's probably what happened.                                                              // 1370
    if (ie && text && input.selectionStart === 0) {                                                                    // 1371
      resetInput(cm, true);                                                                                            // 1372
      return false;                                                                                                    // 1373
    }                                                                                                                  // 1374
    var withOp = !cm.curOp;                                                                                            // 1375
    if (withOp) startOperation(cm);                                                                                    // 1376
    sel.shift = false;                                                                                                 // 1377
    var same = 0, l = Math.min(prevInput.length, text.length);                                                         // 1378
    while (same < l && prevInput[same] == text[same]) ++same;                                                          // 1379
    var from = sel.from, to = sel.to;                                                                                  // 1380
    if (same < prevInput.length)                                                                                       // 1381
      from = Pos(from.line, from.ch - (prevInput.length - same));                                                      // 1382
    else if (cm.state.overwrite && posEq(from, to) && !cm.state.pasteIncoming)                                         // 1383
      to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + (text.length - same)));                    // 1384
    var updateInput = cm.curOp.updateInput;                                                                            // 1385
    makeChange(cm.doc, {from: from, to: to, text: splitLines(text.slice(same)),                                        // 1386
                        origin: cm.state.pasteIncoming ? "paste" : "+input"}, "end");                                  // 1387
                                                                                                                       // 1388
    cm.curOp.updateInput = updateInput;                                                                                // 1389
    if (text.length > 1000) input.value = cm.display.prevInput = "";                                                   // 1390
    else cm.display.prevInput = text;                                                                                  // 1391
    if (withOp) endOperation(cm);                                                                                      // 1392
    cm.state.pasteIncoming = false;                                                                                    // 1393
    return true;                                                                                                       // 1394
  }                                                                                                                    // 1395
                                                                                                                       // 1396
  function resetInput(cm, user) {                                                                                      // 1397
    var minimal, selected, doc = cm.doc;                                                                               // 1398
    if (!posEq(doc.sel.from, doc.sel.to)) {                                                                            // 1399
      cm.display.prevInput = "";                                                                                       // 1400
      minimal = hasCopyEvent &&                                                                                        // 1401
        (doc.sel.to.line - doc.sel.from.line > 100 || (selected = cm.getSelection()).length > 1000);                   // 1402
      if (minimal) cm.display.input.value = "-";                                                                       // 1403
      else cm.display.input.value = selected || cm.getSelection();                                                     // 1404
      if (cm.state.focused) selectInput(cm.display.input);                                                             // 1405
    } else if (user) cm.display.prevInput = cm.display.input.value = "";                                               // 1406
    cm.display.inaccurateSelection = minimal;                                                                          // 1407
  }                                                                                                                    // 1408
                                                                                                                       // 1409
  function focusInput(cm) {                                                                                            // 1410
    if (cm.options.readOnly != "nocursor" && (!mobile || document.activeElement != cm.display.input))                  // 1411
      cm.display.input.focus();                                                                                        // 1412
  }                                                                                                                    // 1413
                                                                                                                       // 1414
  function isReadOnly(cm) {                                                                                            // 1415
    return cm.options.readOnly || cm.doc.cantEdit;                                                                     // 1416
  }                                                                                                                    // 1417
                                                                                                                       // 1418
  // EVENT HANDLERS                                                                                                    // 1419
                                                                                                                       // 1420
  function registerEventHandlers(cm) {                                                                                 // 1421
    var d = cm.display;                                                                                                // 1422
    on(d.scroller, "mousedown", operation(cm, onMouseDown));                                                           // 1423
    on(d.scroller, "dblclick", operation(cm, e_preventDefault));                                                       // 1424
    on(d.lineSpace, "selectstart", function(e) {                                                                       // 1425
      if (!eventInWidget(d, e)) e_preventDefault(e);                                                                   // 1426
    });                                                                                                                // 1427
    // Gecko browsers fire contextmenu *after* opening the menu, at                                                    // 1428
    // which point we can't mess with it anymore. Context menu is                                                      // 1429
    // handled in onMouseDown for Gecko.                                                                               // 1430
    if (!captureMiddleClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});                       // 1431
                                                                                                                       // 1432
    on(d.scroller, "scroll", function() {                                                                              // 1433
      setScrollTop(cm, d.scroller.scrollTop);                                                                          // 1434
      setScrollLeft(cm, d.scroller.scrollLeft, true);                                                                  // 1435
      signal(cm, "scroll", cm);                                                                                        // 1436
    });                                                                                                                // 1437
    on(d.scrollbarV, "scroll", function() {                                                                            // 1438
      setScrollTop(cm, d.scrollbarV.scrollTop);                                                                        // 1439
    });                                                                                                                // 1440
    on(d.scrollbarH, "scroll", function() {                                                                            // 1441
      setScrollLeft(cm, d.scrollbarH.scrollLeft);                                                                      // 1442
    });                                                                                                                // 1443
                                                                                                                       // 1444
    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});                                                  // 1445
    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});                                              // 1446
                                                                                                                       // 1447
    function reFocus() { if (cm.state.focused) setTimeout(bind(focusInput, cm), 0); }                                  // 1448
    on(d.scrollbarH, "mousedown", reFocus);                                                                            // 1449
    on(d.scrollbarV, "mousedown", reFocus);                                                                            // 1450
    // Prevent wrapper from ever scrolling                                                                             // 1451
    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });                           // 1452
                                                                                                                       // 1453
    function onResize() {                                                                                              // 1454
      // Might be a text scaling operation, clear size caches.                                                         // 1455
      d.cachedCharWidth = d.cachedTextHeight = null;                                                                   // 1456
      clearCaches(cm);                                                                                                 // 1457
      runInOp(cm, bind(regChange, cm));                                                                                // 1458
    }                                                                                                                  // 1459
    on(window, "resize", onResize);                                                                                    // 1460
    // Above handler holds on to the editor and its data structures.                                                   // 1461
    // Here we poll to unregister it when the editor is no longer in                                                   // 1462
    // the document, so that it can be garbage-collected.                                                              // 1463
    function unregister() {                                                                                            // 1464
      for (var p = d.wrapper.parentNode; p && p != document.body; p = p.parentNode) {}                                 // 1465
      if (p) setTimeout(unregister, 5000);                                                                             // 1466
      else off(window, "resize", onResize);                                                                            // 1467
    }                                                                                                                  // 1468
    setTimeout(unregister, 5000);                                                                                      // 1469
                                                                                                                       // 1470
    on(d.input, "keyup", operation(cm, function(e) {                                                                   // 1471
      if (cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;                                      // 1472
      if (e.keyCode == 16) cm.doc.sel.shift = false;                                                                   // 1473
    }));                                                                                                               // 1474
    on(d.input, "input", bind(fastPoll, cm));                                                                          // 1475
    on(d.input, "keydown", operation(cm, onKeyDown));                                                                  // 1476
    on(d.input, "keypress", operation(cm, onKeyPress));                                                                // 1477
    on(d.input, "focus", bind(onFocus, cm));                                                                           // 1478
    on(d.input, "blur", bind(onBlur, cm));                                                                             // 1479
                                                                                                                       // 1480
    function drag_(e) {                                                                                                // 1481
      if (cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))) return;                                    // 1482
      e_stop(e);                                                                                                       // 1483
    }                                                                                                                  // 1484
    if (cm.options.dragDrop) {                                                                                         // 1485
      on(d.scroller, "dragstart", function(e){onDragStart(cm, e);});                                                   // 1486
      on(d.scroller, "dragenter", drag_);                                                                              // 1487
      on(d.scroller, "dragover", drag_);                                                                               // 1488
      on(d.scroller, "drop", operation(cm, onDrop));                                                                   // 1489
    }                                                                                                                  // 1490
    on(d.scroller, "paste", function(e){                                                                               // 1491
      if (eventInWidget(d, e)) return;                                                                                 // 1492
      focusInput(cm);                                                                                                  // 1493
      fastPoll(cm);                                                                                                    // 1494
    });                                                                                                                // 1495
    on(d.input, "paste", function() {                                                                                  // 1496
      cm.state.pasteIncoming = true;                                                                                   // 1497
      fastPoll(cm);                                                                                                    // 1498
    });                                                                                                                // 1499
                                                                                                                       // 1500
    function prepareCopy() {                                                                                           // 1501
      if (d.inaccurateSelection) {                                                                                     // 1502
        d.prevInput = "";                                                                                              // 1503
        d.inaccurateSelection = false;                                                                                 // 1504
        d.input.value = cm.getSelection();                                                                             // 1505
        selectInput(d.input);                                                                                          // 1506
      }                                                                                                                // 1507
    }                                                                                                                  // 1508
    on(d.input, "cut", prepareCopy);                                                                                   // 1509
    on(d.input, "copy", prepareCopy);                                                                                  // 1510
                                                                                                                       // 1511
    // Needed to handle Tab key in KHTML                                                                               // 1512
    if (khtml) on(d.sizer, "mouseup", function() {                                                                     // 1513
        if (document.activeElement == d.input) d.input.blur();                                                         // 1514
        focusInput(cm);                                                                                                // 1515
    });                                                                                                                // 1516
  }                                                                                                                    // 1517
                                                                                                                       // 1518
  function eventInWidget(display, e) {                                                                                 // 1519
    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {                                                // 1520
      if (!n) return true;                                                                                             // 1521
      if (/\bCodeMirror-(?:line)?widget\b/.test(n.className) ||                                                        // 1522
          n.parentNode == display.sizer && n != display.mover) return true;                                            // 1523
    }                                                                                                                  // 1524
  }                                                                                                                    // 1525
                                                                                                                       // 1526
  function posFromMouse(cm, e, liberal) {                                                                              // 1527
    var display = cm.display;                                                                                          // 1528
    if (!liberal) {                                                                                                    // 1529
      var target = e_target(e);                                                                                        // 1530
      if (target == display.scrollbarH || target == display.scrollbarH.firstChild ||                                   // 1531
          target == display.scrollbarV || target == display.scrollbarV.firstChild ||                                   // 1532
          target == display.scrollbarFiller) return null;                                                              // 1533
    }                                                                                                                  // 1534
    var x, y, space = getRect(display.lineSpace);                                                                      // 1535
    // Fails unpredictably on IE[67] when mouse is dragged around quickly.                                             // 1536
    try { x = e.clientX; y = e.clientY; } catch (e) { return null; }                                                   // 1537
    return coordsChar(cm, x - space.left, y - space.top);                                                              // 1538
  }                                                                                                                    // 1539
                                                                                                                       // 1540
  var lastClick, lastDoubleClick;                                                                                      // 1541
  function onMouseDown(e) {                                                                                            // 1542
    var cm = this, display = cm.display, doc = cm.doc, sel = doc.sel;                                                  // 1543
    sel.shift = e.shiftKey;                                                                                            // 1544
                                                                                                                       // 1545
    if (eventInWidget(display, e)) {                                                                                   // 1546
      if (!webkit) {                                                                                                   // 1547
        display.scroller.draggable = false;                                                                            // 1548
        setTimeout(function(){display.scroller.draggable = true;}, 100);                                               // 1549
      }                                                                                                                // 1550
      return;                                                                                                          // 1551
    }                                                                                                                  // 1552
    if (clickInGutter(cm, e)) return;                                                                                  // 1553
    var start = posFromMouse(cm, e);                                                                                   // 1554
                                                                                                                       // 1555
    switch (e_button(e)) {                                                                                             // 1556
    case 3:                                                                                                            // 1557
      if (captureMiddleClick) onContextMenu.call(cm, cm, e);                                                           // 1558
      return;                                                                                                          // 1559
    case 2:                                                                                                            // 1560
      if (start) extendSelection(cm.doc, start);                                                                       // 1561
      setTimeout(bind(focusInput, cm), 20);                                                                            // 1562
      e_preventDefault(e);                                                                                             // 1563
      return;                                                                                                          // 1564
    }                                                                                                                  // 1565
    // For button 1, if it was clicked inside the editor                                                               // 1566
    // (posFromMouse returning non-null), we have to adjust the                                                        // 1567
    // selection.                                                                                                      // 1568
    if (!start) {if (e_target(e) == display.scroller) e_preventDefault(e); return;}                                    // 1569
                                                                                                                       // 1570
    if (!cm.state.focused) onFocus(cm);                                                                                // 1571
                                                                                                                       // 1572
    var now = +new Date, type = "single";                                                                              // 1573
    if (lastDoubleClick && lastDoubleClick.time > now - 400 && posEq(lastDoubleClick.pos, start)) {                    // 1574
      type = "triple";                                                                                                 // 1575
      e_preventDefault(e);                                                                                             // 1576
      setTimeout(bind(focusInput, cm), 20);                                                                            // 1577
      selectLine(cm, start.line);                                                                                      // 1578
    } else if (lastClick && lastClick.time > now - 400 && posEq(lastClick.pos, start)) {                               // 1579
      type = "double";                                                                                                 // 1580
      lastDoubleClick = {time: now, pos: start};                                                                       // 1581
      e_preventDefault(e);                                                                                             // 1582
      var word = findWordAt(getLine(doc, start.line).text, start);                                                     // 1583
      extendSelection(cm.doc, word.from, word.to);                                                                     // 1584
    } else { lastClick = {time: now, pos: start}; }                                                                    // 1585
                                                                                                                       // 1586
    var last = start;                                                                                                  // 1587
    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) && !posEq(sel.from, sel.to) &&                           // 1588
        !posLess(start, sel.from) && !posLess(sel.to, start) && type == "single") {                                    // 1589
      var dragEnd = operation(cm, function(e2) {                                                                       // 1590
        if (webkit) display.scroller.draggable = false;                                                                // 1591
        cm.state.draggingText = false;                                                                                 // 1592
        off(document, "mouseup", dragEnd);                                                                             // 1593
        off(display.scroller, "drop", dragEnd);                                                                        // 1594
        if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {                                // 1595
          e_preventDefault(e2);                                                                                        // 1596
          extendSelection(cm.doc, start);                                                                              // 1597
          focusInput(cm);                                                                                              // 1598
        }                                                                                                              // 1599
      });                                                                                                              // 1600
      // Let the drag handler handle this.                                                                             // 1601
      if (webkit) display.scroller.draggable = true;                                                                   // 1602
      cm.state.draggingText = dragEnd;                                                                                 // 1603
      // IE's approach to draggable                                                                                    // 1604
      if (display.scroller.dragDrop) display.scroller.dragDrop();                                                      // 1605
      on(document, "mouseup", dragEnd);                                                                                // 1606
      on(display.scroller, "drop", dragEnd);                                                                           // 1607
      return;                                                                                                          // 1608
    }                                                                                                                  // 1609
    e_preventDefault(e);                                                                                               // 1610
    if (type == "single") extendSelection(cm.doc, clipPos(doc, start));                                                // 1611
                                                                                                                       // 1612
    var startstart = sel.from, startend = sel.to;                                                                      // 1613
                                                                                                                       // 1614
    function doSelect(cur) {                                                                                           // 1615
      if (type == "single") {                                                                                          // 1616
        extendSelection(cm.doc, clipPos(doc, start), cur);                                                             // 1617
        return;                                                                                                        // 1618
      }                                                                                                                // 1619
                                                                                                                       // 1620
      startstart = clipPos(doc, startstart);                                                                           // 1621
      startend = clipPos(doc, startend);                                                                               // 1622
      if (type == "double") {                                                                                          // 1623
        var word = findWordAt(getLine(doc, cur.line).text, cur);                                                       // 1624
        if (posLess(cur, startstart)) extendSelection(cm.doc, word.from, startend);                                    // 1625
        else extendSelection(cm.doc, startstart, word.to);                                                             // 1626
      } else if (type == "triple") {                                                                                   // 1627
        if (posLess(cur, startstart)) extendSelection(cm.doc, startend, clipPos(doc, Pos(cur.line, 0)));               // 1628
        else extendSelection(cm.doc, startstart, clipPos(doc, Pos(cur.line + 1, 0)));                                  // 1629
      }                                                                                                                // 1630
    }                                                                                                                  // 1631
                                                                                                                       // 1632
    var editorSize = getRect(display.wrapper);                                                                         // 1633
    // Used to ensure timeout re-tries don't fire when another extend                                                  // 1634
    // happened in the meantime (clearTimeout isn't reliable -- at                                                     // 1635
    // least on Chrome, the timeouts still happen even when cleared,                                                   // 1636
    // if the clear happens after their scheduled firing time).                                                        // 1637
    var counter = 0;                                                                                                   // 1638
                                                                                                                       // 1639
    function extend(e) {                                                                                               // 1640
      var curCount = ++counter;                                                                                        // 1641
      var cur = posFromMouse(cm, e, true);                                                                             // 1642
      if (!cur) return;                                                                                                // 1643
      if (!posEq(cur, last)) {                                                                                         // 1644
        if (!cm.state.focused) onFocus(cm);                                                                            // 1645
        last = cur;                                                                                                    // 1646
        doSelect(cur);                                                                                                 // 1647
        var visible = visibleLines(display, doc);                                                                      // 1648
        if (cur.line >= visible.to || cur.line < visible.from)                                                         // 1649
          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);                             // 1650
      } else {                                                                                                         // 1651
        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;                       // 1652
        if (outside) setTimeout(operation(cm, function() {                                                             // 1653
          if (counter != curCount) return;                                                                             // 1654
          display.scroller.scrollTop += outside;                                                                       // 1655
          extend(e);                                                                                                   // 1656
        }), 50);                                                                                                       // 1657
      }                                                                                                                // 1658
    }                                                                                                                  // 1659
                                                                                                                       // 1660
    function done(e) {                                                                                                 // 1661
      counter = Infinity;                                                                                              // 1662
      var cur = posFromMouse(cm, e);                                                                                   // 1663
      if (cur) doSelect(cur);                                                                                          // 1664
      e_preventDefault(e);                                                                                             // 1665
      focusInput(cm);                                                                                                  // 1666
      off(document, "mousemove", move);                                                                                // 1667
      off(document, "mouseup", up);                                                                                    // 1668
    }                                                                                                                  // 1669
                                                                                                                       // 1670
    var move = operation(cm, function(e) {                                                                             // 1671
      if (!ie && !e_button(e)) done(e);                                                                                // 1672
      else extend(e);                                                                                                  // 1673
    });                                                                                                                // 1674
    var up = operation(cm, done);                                                                                      // 1675
    on(document, "mousemove", move);                                                                                   // 1676
    on(document, "mouseup", up);                                                                                       // 1677
  }                                                                                                                    // 1678
                                                                                                                       // 1679
  function onDrop(e) {                                                                                                 // 1680
    var cm = this;                                                                                                     // 1681
    if (eventInWidget(cm.display, e) || (cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))))            // 1682
      return;                                                                                                          // 1683
    e_preventDefault(e);                                                                                               // 1684
    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;                                                 // 1685
    if (!pos || isReadOnly(cm)) return;                                                                                // 1686
    if (files && files.length && window.FileReader && window.File) {                                                   // 1687
      var n = files.length, text = Array(n), read = 0;                                                                 // 1688
      var loadFile = function(file, i) {                                                                               // 1689
        var reader = new FileReader;                                                                                   // 1690
        reader.onload = function() {                                                                                   // 1691
          text[i] = reader.result;                                                                                     // 1692
          if (++read == n) {                                                                                           // 1693
            pos = clipPos(cm.doc, pos);                                                                                // 1694
            makeChange(cm.doc, {from: pos, to: pos, text: splitLines(text.join("\n")), origin: "paste"}, "around");    // 1695
          }                                                                                                            // 1696
        };                                                                                                             // 1697
        reader.readAsText(file);                                                                                       // 1698
      };                                                                                                               // 1699
      for (var i = 0; i < n; ++i) loadFile(files[i], i);                                                               // 1700
    } else {                                                                                                           // 1701
      // Don't do a replace if the drop happened inside of the selected text.                                          // 1702
      if (cm.state.draggingText && !(posLess(pos, cm.doc.sel.from) || posLess(cm.doc.sel.to, pos))) {                  // 1703
        cm.state.draggingText(e);                                                                                      // 1704
        // Ensure the editor is re-focused                                                                             // 1705
        setTimeout(bind(focusInput, cm), 20);                                                                          // 1706
        return;                                                                                                        // 1707
      }                                                                                                                // 1708
      try {                                                                                                            // 1709
        var text = e.dataTransfer.getData("Text");                                                                     // 1710
        if (text) {                                                                                                    // 1711
          var curFrom = cm.doc.sel.from, curTo = cm.doc.sel.to;                                                        // 1712
          setSelection(cm.doc, pos, pos);                                                                              // 1713
          if (cm.state.draggingText) replaceRange(cm.doc, "", curFrom, curTo, "paste");                                // 1714
          cm.replaceSelection(text, null, "paste");                                                                    // 1715
          focusInput(cm);                                                                                              // 1716
          onFocus(cm);                                                                                                 // 1717
        }                                                                                                              // 1718
      }                                                                                                                // 1719
      catch(e){}                                                                                                       // 1720
    }                                                                                                                  // 1721
  }                                                                                                                    // 1722
                                                                                                                       // 1723
  function clickInGutter(cm, e) {                                                                                      // 1724
    var display = cm.display;                                                                                          // 1725
    try { var mX = e.clientX, mY = e.clientY; }                                                                        // 1726
    catch(e) { return false; }                                                                                         // 1727
                                                                                                                       // 1728
    if (mX >= Math.floor(getRect(display.gutters).right)) return false;                                                // 1729
    e_preventDefault(e);                                                                                               // 1730
    if (!hasHandler(cm, "gutterClick")) return true;                                                                   // 1731
                                                                                                                       // 1732
    var lineBox = getRect(display.lineDiv);                                                                            // 1733
    if (mY > lineBox.bottom) return true;                                                                              // 1734
    mY -= lineBox.top - display.viewOffset;                                                                            // 1735
                                                                                                                       // 1736
    for (var i = 0; i < cm.options.gutters.length; ++i) {                                                              // 1737
      var g = display.gutters.childNodes[i];                                                                           // 1738
      if (g && getRect(g).right >= mX) {                                                                               // 1739
        var line = lineAtHeight(cm.doc, mY);                                                                           // 1740
        var gutter = cm.options.gutters[i];                                                                            // 1741
        signalLater(cm, "gutterClick", cm, line, gutter, e);                                                           // 1742
        break;                                                                                                         // 1743
      }                                                                                                                // 1744
    }                                                                                                                  // 1745
    return true;                                                                                                       // 1746
  }                                                                                                                    // 1747
                                                                                                                       // 1748
  function onDragStart(cm, e) {                                                                                        // 1749
    if (eventInWidget(cm.display, e)) return;                                                                          // 1750
                                                                                                                       // 1751
    var txt = cm.getSelection();                                                                                       // 1752
    e.dataTransfer.setData("Text", txt);                                                                               // 1753
                                                                                                                       // 1754
    // Use dummy image instead of default browsers image.                                                              // 1755
    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.                  // 1756
    if (e.dataTransfer.setDragImage) {                                                                                 // 1757
      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");                                           // 1758
      if (opera) {                                                                                                     // 1759
        img.width = img.height = 1;                                                                                    // 1760
        cm.display.wrapper.appendChild(img);                                                                           // 1761
        // Force a relayout, or Opera won't use our image for some obscure reason                                      // 1762
        img._top = img.offsetTop;                                                                                      // 1763
      }                                                                                                                // 1764
      if (safari) {                                                                                                    // 1765
        if (cm.display.dragImg) {                                                                                      // 1766
          img = cm.display.dragImg;                                                                                    // 1767
        } else {                                                                                                       // 1768
          cm.display.dragImg = img;                                                                                    // 1769
          img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";                      // 1770
          cm.display.wrapper.appendChild(img);                                                                         // 1771
        }                                                                                                              // 1772
      }                                                                                                                // 1773
      e.dataTransfer.setDragImage(img, 0, 0);                                                                          // 1774
      if (opera) img.parentNode.removeChild(img);                                                                      // 1775
    }                                                                                                                  // 1776
  }                                                                                                                    // 1777
                                                                                                                       // 1778
  function setScrollTop(cm, val) {                                                                                     // 1779
    if (Math.abs(cm.doc.scrollTop - val) < 2) return;                                                                  // 1780
    cm.doc.scrollTop = val;                                                                                            // 1781
    if (!gecko) updateDisplay(cm, [], val);                                                                            // 1782
    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;                                     // 1783
    if (cm.display.scrollbarV.scrollTop != val) cm.display.scrollbarV.scrollTop = val;                                 // 1784
    if (gecko) updateDisplay(cm, []);                                                                                  // 1785
  }                                                                                                                    // 1786
  function setScrollLeft(cm, val, isScroller) {                                                                        // 1787
    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;                         // 1788
    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);                            // 1789
    cm.doc.scrollLeft = val;                                                                                           // 1790
    alignHorizontally(cm);                                                                                             // 1791
    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;                                   // 1792
    if (cm.display.scrollbarH.scrollLeft != val) cm.display.scrollbarH.scrollLeft = val;                               // 1793
  }                                                                                                                    // 1794
                                                                                                                       // 1795
  // Since the delta values reported on mouse wheel events are                                                         // 1796
  // unstandardized between browsers and even browser versions, and                                                    // 1797
  // generally horribly unpredictable, this code starts by measuring                                                   // 1798
  // the scroll effect that the first few mouse wheel events have,                                                     // 1799
  // and, from that, detects the way it can convert deltas to pixel                                                    // 1800
  // offsets afterwards.                                                                                               // 1801
  //                                                                                                                   // 1802
  // The reason we want to know the amount a wheel event will scroll                                                   // 1803
  // is that it gives us a chance to update the display before the                                                     // 1804
  // actual scrolling happens, reducing flickering.                                                                    // 1805
                                                                                                                       // 1806
  var wheelSamples = 0, wheelPixelsPerUnit = null;                                                                     // 1807
  // Fill in a browser-detected starting value on browsers where we                                                    // 1808
  // know one. These don't have to be accurate -- the result of them                                                   // 1809
  // being wrong would just be a slight flicker on the first wheel                                                     // 1810
  // scroll (if it is large enough).                                                                                   // 1811
  if (ie) wheelPixelsPerUnit = -.53;                                                                                   // 1812
  else if (gecko) wheelPixelsPerUnit = 15;                                                                             // 1813
  else if (chrome) wheelPixelsPerUnit = -.7;                                                                           // 1814
  else if (safari) wheelPixelsPerUnit = -1/3;                                                                          // 1815
                                                                                                                       // 1816
  function onScrollWheel(cm, e) {                                                                                      // 1817
    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;                                                                        // 1818
    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;                                          // 1819
    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;                                            // 1820
    else if (dy == null) dy = e.wheelDelta;                                                                            // 1821
                                                                                                                       // 1822
    // Webkit browsers on OS X abort momentum scrolls when the target                                                  // 1823
    // of the scroll event is removed from the scrollable element.                                                     // 1824
    // This hack (see related code in patchDisplay) makes sure the                                                     // 1825
    // element is kept around.                                                                                         // 1826
    if (dy && mac && webkit) {                                                                                         // 1827
      for (var cur = e.target; cur != scroll; cur = cur.parentNode) {                                                  // 1828
        if (cur.lineObj) {                                                                                             // 1829
          cm.display.currentWheelTarget = cur;                                                                         // 1830
          break;                                                                                                       // 1831
        }                                                                                                              // 1832
      }                                                                                                                // 1833
    }                                                                                                                  // 1834
                                                                                                                       // 1835
    var display = cm.display, scroll = display.scroller;                                                               // 1836
    // On some browsers, horizontal scrolling will cause redraws to                                                    // 1837
    // happen before the gutter has been realigned, causing it to                                                      // 1838
    // wriggle around in a most unseemly way. When we have an                                                          // 1839
    // estimated pixels/delta value, we just handle horizontal                                                         // 1840
    // scrolling entirely here. It'll be slightly off from native, but                                                 // 1841
    // better than glitching out.                                                                                      // 1842
    if (dx && !gecko && !opera && wheelPixelsPerUnit != null) {                                                        // 1843
      if (dy)                                                                                                          // 1844
        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
      e_preventDefault(e);                                                                                             // 1847
      display.wheelStartX = null; // Abort measurement, if in progress                                                 // 1848
      return;                                                                                                          // 1849
    }                                                                                                                  // 1850
                                                                                                                       // 1851
    if (dy && wheelPixelsPerUnit != null) {                                                                            // 1852
      var pixels = dy * wheelPixelsPerUnit;                                                                            // 1853
      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;                                            // 1854
      if (pixels < 0) top = Math.max(0, top + pixels - 50);                                                            // 1855
      else bot = Math.min(cm.doc.height, bot + pixels + 50);                                                           // 1856
      updateDisplay(cm, [], {top: top, bottom: bot});                                                                  // 1857
    }                                                                                                                  // 1858
                                                                                                                       // 1859
    if (wheelSamples < 20) {                                                                                           // 1860
      if (display.wheelStartX == null) {                                                                               // 1861
        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;                               // 1862
        display.wheelDX = dx; display.wheelDY = dy;                                                                    // 1863
        setTimeout(function() {                                                                                        // 1864
          if (display.wheelStartX == null) return;                                                                     // 1865
          var movedX = scroll.scrollLeft - display.wheelStartX;                                                        // 1866
          var movedY = scroll.scrollTop - display.wheelStartY;                                                         // 1867
          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||                                      // 1868
            (movedX && display.wheelDX && movedX / display.wheelDX);                                                   // 1869
          display.wheelStartX = display.wheelStartY = null;                                                            // 1870
          if (!sample) return;                                                                                         // 1871
          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);                      // 1872
          ++wheelSamples;                                                                                              // 1873
        }, 200);                                                                                                       // 1874
      } else {                                                                                                         // 1875
        display.wheelDX += dx; display.wheelDY += dy;                                                                  // 1876
      }                                                                                                                // 1877
    }                                                                                                                  // 1878
  }                                                                                                                    // 1879
                                                                                                                       // 1880
  function doHandleBinding(cm, bound, dropShift) {                                                                     // 1881
    if (typeof bound == "string") {                                                                                    // 1882
      bound = commands[bound];                                                                                         // 1883
      if (!bound) return false;                                                                                        // 1884
    }                                                                                                                  // 1885
    // Ensure previous input has been read, so that the handler sees a                                                 // 1886
    // consistent view of the document                                                                                 // 1887
    if (cm.display.pollingFast && readInput(cm)) cm.display.pollingFast = false;                                       // 1888
    var doc = cm.doc, prevShift = doc.sel.shift, done = false;                                                         // 1889
    try {                                                                                                              // 1890
      if (isReadOnly(cm)) cm.state.suppressEdits = true;                                                               // 1891
      if (dropShift) doc.sel.shift = false;                                                                            // 1892
      done = bound(cm) != Pass;                                                                                        // 1893
    } finally {                                                                                                        // 1894
      doc.sel.shift = prevShift;                                                                                       // 1895
      cm.state.suppressEdits = false;                                                                                  // 1896
    }                                                                                                                  // 1897
    return done;                                                                                                       // 1898
  }                                                                                                                    // 1899
                                                                                                                       // 1900
  function allKeyMaps(cm) {                                                                                            // 1901
    var maps = cm.state.keyMaps.slice(0);                                                                              // 1902
    maps.push(cm.options.keyMap);                                                                                      // 1903
    if (cm.options.extraKeys) maps.unshift(cm.options.extraKeys);                                                      // 1904
    return maps;                                                                                                       // 1905
  }                                                                                                                    // 1906
                                                                                                                       // 1907
  var maybeTransition;                                                                                                 // 1908
  function handleKeyBinding(cm, e) {                                                                                   // 1909
    // Handle auto keymap transitions                                                                                  // 1910
    var startMap = getKeyMap(cm.options.keyMap), next = startMap.auto;                                                 // 1911
    clearTimeout(maybeTransition);                                                                                     // 1912
    if (next && !isModifierKey(e)) maybeTransition = setTimeout(function() {                                           // 1913
      if (getKeyMap(cm.options.keyMap) == startMap)                                                                    // 1914
        cm.options.keyMap = (next.call ? next.call(null, cm) : next);                                                  // 1915
    }, 50);                                                                                                            // 1916
                                                                                                                       // 1917
    var name = keyName(e, true), handled = false;                                                                      // 1918
    if (!name) return false;                                                                                           // 1919
    var keymaps = allKeyMaps(cm);                                                                                      // 1920
                                                                                                                       // 1921
    if (e.shiftKey) {                                                                                                  // 1922
      // First try to resolve full name (including 'Shift-'). Failing                                                  // 1923
      // that, see if there is a cursor-motion command (starting with                                                  // 1924
      // 'go') bound to the keyname without 'Shift-'.                                                                  // 1925
      handled = lookupKey("Shift-" + name, keymaps, function(b) {return doHandleBinding(cm, b, true);})                // 1926
             || lookupKey(name, keymaps, function(b) {                                                                 // 1927
                  if (typeof b == "string" && /^go[A-Z]/.test(b)) return doHandleBinding(cm, b);                       // 1928
                });                                                                                                    // 1929
    } else {                                                                                                           // 1930
      handled = lookupKey(name, keymaps, function(b) { return doHandleBinding(cm, b); });                              // 1931
    }                                                                                                                  // 1932
    if (handled == "stop") handled = false;                                                                            // 1933
                                                                                                                       // 1934
    if (handled) {                                                                                                     // 1935
      e_preventDefault(e);                                                                                             // 1936
      restartBlink(cm);                                                                                                // 1937
      if (ie_lt9) { e.oldKeyCode = e.keyCode; e.keyCode = 0; }                                                         // 1938
    }                                                                                                                  // 1939
    return handled;                                                                                                    // 1940
  }                                                                                                                    // 1941
                                                                                                                       // 1942
  function handleCharBinding(cm, e, ch) {                                                                              // 1943
    var handled = lookupKey("'" + ch + "'", allKeyMaps(cm),                                                            // 1944
                            function(b) { return doHandleBinding(cm, b, true); });                                     // 1945
    if (handled) {                                                                                                     // 1946
      e_preventDefault(e);                                                                                             // 1947
      restartBlink(cm);                                                                                                // 1948
    }                                                                                                                  // 1949
    return handled;                                                                                                    // 1950
  }                                                                                                                    // 1951
                                                                                                                       // 1952
  var lastStoppedKey = null;                                                                                           // 1953
  function onKeyDown(e) {                                                                                              // 1954
    var cm = this;                                                                                                     // 1955
    if (!cm.state.focused) onFocus(cm);                                                                                // 1956
    if (ie && e.keyCode == 27) { e.returnValue = false; }                                                              // 1957
    if (cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;                                        // 1958
    var code = e.keyCode;                                                                                              // 1959
    // IE does strange things with escape.                                                                             // 1960
    cm.doc.sel.shift = code == 16 || e.shiftKey;                                                                       // 1961
    // First give onKeyEvent option a chance to handle this.                                                           // 1962
    var handled = handleKeyBinding(cm, e);                                                                             // 1963
    if (opera) {                                                                                                       // 1964
      lastStoppedKey = handled ? code : null;                                                                          // 1965
      // Opera has no cut event... we try to at least catch the key combo                                              // 1966
      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))                                    // 1967
        cm.replaceSelection("");                                                                                       // 1968
    }                                                                                                                  // 1969
  }                                                                                                                    // 1970
                                                                                                                       // 1971
  function onKeyPress(e) {                                                                                             // 1972
    var cm = this;                                                                                                     // 1973
    if (cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;                                        // 1974
    var keyCode = e.keyCode, charCode = e.charCode;                                                                    // 1975
    if (opera && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}                      // 1976
    if (((opera && (!e.which || e.which < 10)) || khtml) && handleKeyBinding(cm, e)) return;                           // 1977
    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);                                               // 1978
    if (this.options.electricChars && this.doc.mode.electricChars &&                                                   // 1979
        this.options.smartIndent && !isReadOnly(this) &&                                                               // 1980
        this.doc.mode.electricChars.indexOf(ch) > -1)                                                                  // 1981
      setTimeout(operation(cm, function() {indentLine(cm, cm.doc.sel.to.line, "smart");}), 75);                        // 1982
    if (handleCharBinding(cm, e, ch)) return;                                                                          // 1983
    fastPoll(cm);                                                                                                      // 1984
  }                                                                                                                    // 1985
                                                                                                                       // 1986
  function onFocus(cm) {                                                                                               // 1987
    if (cm.options.readOnly == "nocursor") return;                                                                     // 1988
    if (!cm.state.focused) {                                                                                           // 1989
      signal(cm, "focus", cm);                                                                                         // 1990
      cm.state.focused = true;                                                                                         // 1991
      if (cm.display.wrapper.className.search(/\bCodeMirror-focused\b/) == -1)                                         // 1992
        cm.display.wrapper.className += " CodeMirror-focused";                                                         // 1993
      resetInput(cm, true);                                                                                            // 1994
    }                                                                                                                  // 1995
    slowPoll(cm);                                                                                                      // 1996
    restartBlink(cm);                                                                                                  // 1997
  }                                                                                                                    // 1998
  function onBlur(cm) {                                                                                                // 1999
    if (cm.state.focused) {                                                                                            // 2000
      signal(cm, "blur", cm);                                                                                          // 2001
      cm.state.focused = false;                                                                                        // 2002
      cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-focused", "");                  // 2003
    }                                                                                                                  // 2004
    clearInterval(cm.display.blinker);                                                                                 // 2005
    setTimeout(function() {if (!cm.state.focused) cm.doc.sel.shift = false;}, 150);                                    // 2006
  }                                                                                                                    // 2007
                                                                                                                       // 2008
  var detectingSelectAll;                                                                                              // 2009
  function onContextMenu(cm, e) {                                                                                      // 2010
    var display = cm.display, sel = cm.doc.sel;                                                                        // 2011
    if (eventInWidget(display, e)) return;                                                                             // 2012
                                                                                                                       // 2013
    var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;                                             // 2014
    if (!pos || opera) return; // Opera is difficult.                                                                  // 2015
    if (posEq(sel.from, sel.to) || posLess(pos, sel.from) || !posLess(pos, sel.to))                                    // 2016
      operation(cm, setSelection)(cm.doc, pos, pos);                                                                   // 2017
                                                                                                                       // 2018
    var oldCSS = display.input.style.cssText;                                                                          // 2019
    display.inputDiv.style.position = "absolute";                                                                      // 2020
    display.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +              // 2021
      "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: white; outline: none;" +                        // 2022
      "border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);";   // 2023
    focusInput(cm);                                                                                                    // 2024
    resetInput(cm, true);                                                                                              // 2025
    // Adds "Select all" to context menu in FF                                                                         // 2026
    if (posEq(sel.from, sel.to)) display.input.value = display.prevInput = " ";                                        // 2027
                                                                                                                       // 2028
    function rehide() {                                                                                                // 2029
      display.inputDiv.style.position = "relative";                                                                    // 2030
      display.input.style.cssText = oldCSS;                                                                            // 2031
      if (ie_lt9) display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos;                               // 2032
      slowPoll(cm);                                                                                                    // 2033
                                                                                                                       // 2034
      // Try to detect the user choosing select-all                                                                    // 2035
      if (display.input.selectionStart != null && (!ie || ie_lt9)) {                                                   // 2036
        clearTimeout(detectingSelectAll);                                                                              // 2037
        var extval = display.input.value = " " + (posEq(sel.from, sel.to) ? "" : display.input.value), i = 0;          // 2038
        display.prevInput = " ";                                                                                       // 2039
        display.input.selectionStart = 1; display.input.selectionEnd = extval.length;                                  // 2040
        var poll = function(){                                                                                         // 2041
          if (display.prevInput == " " && display.input.selectionStart == 0)                                           // 2042
            operation(cm, commands.selectAll)(cm);                                                                     // 2043
          else if (i++ < 10) detectingSelectAll = setTimeout(poll, 500);                                               // 2044
          else resetInput(cm);                                                                                         // 2045
        };                                                                                                             // 2046
        detectingSelectAll = setTimeout(poll, 200);                                                                    // 2047
      }                                                                                                                // 2048
    }                                                                                                                  // 2049
                                                                                                                       // 2050
    if (captureMiddleClick) {                                                                                          // 2051
      e_stop(e);                                                                                                       // 2052
      var mouseup = function() {                                                                                       // 2053
        off(window, "mouseup", mouseup);                                                                               // 2054
        setTimeout(rehide, 20);                                                                                        // 2055
      };                                                                                                               // 2056
      on(window, "mouseup", mouseup);                                                                                  // 2057
    } else {                                                                                                           // 2058
      setTimeout(rehide, 50);                                                                                          // 2059
    }                                                                                                                  // 2060
  }                                                                                                                    // 2061
                                                                                                                       // 2062
  // UPDATING                                                                                                          // 2063
                                                                                                                       // 2064
  function changeEnd(change) {                                                                                         // 2065
    return Pos(change.from.line + change.text.length - 1,                                                              // 2066
               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));                              // 2067
  }                                                                                                                    // 2068
                                                                                                                       // 2069
  // Make sure a position will be valid after the given change.                                                        // 2070
  function clipPostChange(doc, change, pos) {                                                                          // 2071
    if (!posLess(change.from, pos)) return clipPos(doc, pos);                                                          // 2072
    var diff = (change.text.length - 1) - (change.to.line - change.from.line);                                         // 2073
    if (pos.line > change.to.line + diff) {                                                                            // 2074
      var preLine = pos.line - diff, lastLine = doc.first + doc.size - 1;                                              // 2075
      if (preLine > lastLine) return Pos(lastLine, getLine(doc, lastLine).text.length);                                // 2076
      return clipToLen(pos, getLine(doc, preLine).text.length);                                                        // 2077
    }                                                                                                                  // 2078
    if (pos.line == change.to.line + diff)                                                                             // 2079
      return clipToLen(pos, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0) +                 // 2080
                       getLine(doc, change.to.line).text.length - change.to.ch);                                       // 2081
    var inside = pos.line - change.from.line;                                                                          // 2082
    return clipToLen(pos, change.text[inside].length + (inside ? 0 : change.from.ch));                                 // 2083
  }                                                                                                                    // 2084
                                                                                                                       // 2085
  // Hint can be null|"end"|"start"|"around"|{anchor,head}                                                             // 2086
  function computeSelAfterChange(doc, change, hint) {                                                                  // 2087
    if (hint && typeof hint == "object") // Assumed to be {anchor, head} object                                        // 2088
      return {anchor: clipPostChange(doc, change, hint.anchor),                                                        // 2089
              head: clipPostChange(doc, change, hint.head)};                                                           // 2090
                                                                                                                       // 2091
    if (hint == "start") return {anchor: change.from, head: change.from};                                              // 2092
                                                                                                                       // 2093
    var end = changeEnd(change);                                                                                       // 2094
    if (hint == "around") return {anchor: change.from, head: end};                                                     // 2095
    if (hint == "end") return {anchor: end, head: end};                                                                // 2096
                                                                                                                       // 2097
    // hint is null, leave the selection alone as much as possible                                                     // 2098
    var adjustPos = function(pos) {                                                                                    // 2099
      if (posLess(pos, change.from)) return pos;                                                                       // 2100
      if (!posLess(change.to, pos)) return end;                                                                        // 2101
                                                                                                                       // 2102
      var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;                 // 2103
      if (pos.line == change.to.line) ch += end.ch - change.to.ch;                                                     // 2104
      return Pos(line, ch);                                                                                            // 2105
    };                                                                                                                 // 2106
    return {anchor: adjustPos(doc.sel.anchor), head: adjustPos(doc.sel.head)};                                         // 2107
  }                                                                                                                    // 2108
                                                                                                                       // 2109
  function filterChange(doc, change) {                                                                                 // 2110
    var obj = {                                                                                                        // 2111
      canceled: false,                                                                                                 // 2112
      from: change.from,                                                                                               // 2113
      to: change.to,                                                                                                   // 2114
      text: change.text,                                                                                               // 2115
      origin: change.origin,                                                                                           // 2116
      update: function(from, to, text, origin) {                                                                       // 2117
        if (from) this.from = clipPos(doc, from);                                                                      // 2118
        if (to) this.to = clipPos(doc, to);                                                                            // 2119
        if (text) this.text = text;                                                                                    // 2120
        if (origin !== undefined) this.origin = origin;                                                                // 2121
      },                                                                                                               // 2122
      cancel: function() { this.canceled = true; }                                                                     // 2123
    };                                                                                                                 // 2124
    signal(doc, "beforeChange", doc, obj);                                                                             // 2125
    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);                                                           // 2126
                                                                                                                       // 2127
    if (obj.canceled) return null;                                                                                     // 2128
    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};                                           // 2129
  }                                                                                                                    // 2130
                                                                                                                       // 2131
  // Replace the range from from to to by the strings in replacement.                                                  // 2132
  // change is a {from, to, text [, origin]} object                                                                    // 2133
  function makeChange(doc, change, selUpdate, ignoreReadOnly) {                                                        // 2134
    if (doc.cm) {                                                                                                      // 2135
      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, selUpdate, ignoreReadOnly);                 // 2136
      if (doc.cm.state.suppressEdits) return;                                                                          // 2137
    }                                                                                                                  // 2138
                                                                                                                       // 2139
    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {                             // 2140
      change = filterChange(doc, change);                                                                              // 2141
      if (!change) return;                                                                                             // 2142
    }                                                                                                                  // 2143
                                                                                                                       // 2144
    // Possibly split or suppress the update based on the presence                                                     // 2145
    // of read-only spans in its range.                                                                                // 2146
    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);              // 2147
    if (split) {                                                                                                       // 2148
      for (var i = split.length - 1; i >= 1; --i)                                                                      // 2149
        makeChangeNoReadonly(doc, {from: split[i].from, to: split[i].to, text: [""]});                                 // 2150
      if (split.length)                                                                                                // 2151
        makeChangeNoReadonly(doc, {from: split[0].from, to: split[0].to, text: change.text}, selUpdate);               // 2152
    } else {                                                                                                           // 2153
      makeChangeNoReadonly(doc, change, selUpdate);                                                                    // 2154
    }                                                                                                                  // 2155
  }                                                                                                                    // 2156
                                                                                                                       // 2157
  function makeChangeNoReadonly(doc, change, selUpdate) {                                                              // 2158
    var selAfter = computeSelAfterChange(doc, change, selUpdate);                                                      // 2159
    addToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);                                               // 2160
                                                                                                                       // 2161
    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));                                   // 2162
    var rebased = [];                                                                                                  // 2163
                                                                                                                       // 2164
    linkedDocs(doc, function(doc, sharedHist) {                                                                        // 2165
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {                                                        // 2166
        rebaseHist(doc.history, change);                                                                               // 2167
        rebased.push(doc.history);                                                                                     // 2168
      }                                                                                                                // 2169
      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));                                     // 2170
    });                                                                                                                // 2171
  }                                                                                                                    // 2172
                                                                                                                       // 2173
  function makeChangeFromHistory(doc, type) {                                                                          // 2174
    var hist = doc.history;                                                                                            // 2175
    var event = (type == "undo" ? hist.done : hist.undone).pop();                                                      // 2176
    if (!event) return;                                                                                                // 2177
    hist.dirtyCounter += type == "undo" ? -1 : 1;                                                                      // 2178
                                                                                                                       // 2179
    var anti = {changes: [], anchorBefore: event.anchorAfter, headBefore: event.headAfter,                             // 2180
                anchorAfter: event.anchorBefore, headAfter: event.headBefore};                                         // 2181
    (type == "undo" ? hist.undone : hist.done).push(anti);                                                             // 2182
                                                                                                                       // 2183
    for (var i = event.changes.length - 1; i >= 0; --i) {                                                              // 2184
      var change = event.changes[i];                                                                                   // 2185
      change.origin = type;                                                                                            // 2186
      anti.changes.push(historyChangeFromChange(doc, change));                                                         // 2187
                                                                                                                       // 2188
      var after = i ? computeSelAfterChange(doc, change, null)                                                         // 2189
                    : {anchor: event.anchorBefore, head: event.headBefore};                                            // 2190
      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));                                             // 2191
      var rebased = [];                                                                                                // 2192
                                                                                                                       // 2193
      linkedDocs(doc, function(doc, sharedHist) {                                                                      // 2194
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {                                                      // 2195
          rebaseHist(doc.history, change);                                                                             // 2196
          rebased.push(doc.history);                                                                                   // 2197
        }                                                                                                              // 2198
        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));                                            // 2199
      });                                                                                                              // 2200
    }                                                                                                                  // 2201
  }                                                                                                                    // 2202
                                                                                                                       // 2203
  function shiftDoc(doc, distance) {                                                                                   // 2204
    function shiftPos(pos) {return Pos(pos.line + distance, pos.ch);}                                                  // 2205
    doc.first += distance;                                                                                             // 2206
    if (doc.cm) regChange(doc.cm, doc.first, doc.first, distance);                                                     // 2207
    doc.sel.head = shiftPos(doc.sel.head); doc.sel.anchor = shiftPos(doc.sel.anchor);                                  // 2208
    doc.sel.from = shiftPos(doc.sel.from); doc.sel.to = shiftPos(doc.sel.to);                                          // 2209
  }                                                                                                                    // 2210
                                                                                                                       // 2211
  function makeChangeSingleDoc(doc, change, selAfter, spans) {                                                         // 2212
    if (doc.cm && !doc.cm.curOp)                                                                                       // 2213
      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);                                     // 2214
                                                                                                                       // 2215
    if (change.to.line < doc.first) {                                                                                  // 2216
      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));                                     // 2217
      return;                                                                                                          // 2218
    }                                                                                                                  // 2219
    if (change.from.line > doc.lastLine()) return;                                                                     // 2220
                                                                                                                       // 2221
    // Clip the change to the size of this doc                                                                         // 2222
    if (change.from.line < doc.first) {                                                                                // 2223
      var shift = change.text.length - 1 - (doc.first - change.from.line);                                             // 2224
      shiftDoc(doc, shift);                                                                                            // 2225
      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),                                // 2226
                text: [lst(change.text)], origin: change.origin};                                                      // 2227
    }                                                                                                                  // 2228
    var last = doc.lastLine();                                                                                         // 2229
    if (change.to.line > last) {                                                                                       // 2230
      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),                                      // 2231
                text: [change.text[0]], origin: change.origin};                                                        // 2232
    }                                                                                                                  // 2233
                                                                                                                       // 2234
    if (!selAfter) selAfter = computeSelAfterChange(doc, change, null);                                                // 2235
    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans, selAfter);                                          // 2236
    else updateDoc(doc, change, spans, selAfter);                                                                      // 2237
  }                                                                                                                    // 2238
                                                                                                                       // 2239
  function makeChangeSingleDocInEditor(cm, change, spans, selAfter) {                                                  // 2240
    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;                                        // 2241
                                                                                                                       // 2242
    var recomputeMaxLength = false, checkWidthStart = from.line;                                                       // 2243
    if (!cm.options.lineWrapping) {                                                                                    // 2244
      checkWidthStart = lineNo(visualLine(doc, getLine(doc, from.line)));                                              // 2245
      doc.iter(checkWidthStart, to.line + 1, function(line) {                                                          // 2246
        if (line == display.maxLine) {                                                                                 // 2247
          recomputeMaxLength = true;                                                                                   // 2248
          return true;                                                                                                 // 2249
        }                                                                                                              // 2250
      });                                                                                                              // 2251
    }                                                                                                                  // 2252
                                                                                                                       // 2253
    updateDoc(doc, change, spans, selAfter, estimateHeight(cm));                                                       // 2254
                                                                                                                       // 2255
    if (!cm.options.lineWrapping) {                                                                                    // 2256
      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {                                       // 2257
        var len = lineLength(doc, line);                                                                               // 2258
        if (len > display.maxLineLength) {                                                                             // 2259
          display.maxLine = line;                                                                                      // 2260
          display.maxLineLength = len;                                                                                 // 2261
          display.maxLineChanged = true;                                                                               // 2262
          recomputeMaxLength = false;                                                                                  // 2263
        }                                                                                                              // 2264
      });                                                                                                              // 2265
      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;                                                           // 2266
    }                                                                                                                  // 2267
                                                                                                                       // 2268
    // Adjust frontier, schedule worker                                                                                // 2269
    doc.frontier = Math.min(doc.frontier, from.line);                                                                  // 2270
    startWorker(cm, 400);                                                                                              // 2271
                                                                                                                       // 2272
    var lendiff = change.text.length - (to.line - from.line) - 1;                                                      // 2273
    // Remember that these lines changed, for updating the display                                                     // 2274
    regChange(cm, from.line, to.line + 1, lendiff);                                                                    // 2275
    if (hasHandler(cm, "change")) {                                                                                    // 2276
      var changeObj = {from: from, to: to, text: change.text, origin: change.origin};                                  // 2277
      if (cm.curOp.textChanged) {                                                                                      // 2278
        for (var cur = cm.curOp.textChanged; cur.next; cur = cur.next) {}                                              // 2279
        cur.next = changeObj;                                                                                          // 2280
      } else cm.curOp.textChanged = changeObj;                                                                         // 2281
    }                                                                                                                  // 2282
  }                                                                                                                    // 2283
                                                                                                                       // 2284
  function replaceRange(doc, code, from, to, origin) {                                                                 // 2285
    if (!to) to = from;                                                                                                // 2286
    if (posLess(to, from)) { var tmp = to; to = from; from = tmp; }                                                    // 2287
    if (typeof code == "string") code = splitLines(code);                                                              // 2288
    makeChange(doc, {from: from, to: to, text: code, origin: origin}, null);                                           // 2289
  }                                                                                                                    // 2290
                                                                                                                       // 2291
  // POSITION OBJECT                                                                                                   // 2292
                                                                                                                       // 2293
  function Pos(line, ch) {                                                                                             // 2294
    if (!(this instanceof Pos)) return new Pos(line, ch);                                                              // 2295
    this.line = line; this.ch = ch;                                                                                    // 2296
  }                                                                                                                    // 2297
  CodeMirror.Pos = Pos;                                                                                                // 2298
                                                                                                                       // 2299
  function posEq(a, b) {return a.line == b.line && a.ch == b.ch;}                                                      // 2300
  function posLess(a, b) {return a.line < b.line || (a.line == b.line && a.ch < b.ch);}                                // 2301
  function copyPos(x) {return Pos(x.line, x.ch);}                                                                      // 2302
                                                                                                                       // 2303
  // SELECTION                                                                                                         // 2304
                                                                                                                       // 2305
  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}                       // 2306
  function clipPos(doc, pos) {                                                                                         // 2307
    if (pos.line < doc.first) return Pos(doc.first, 0);                                                                // 2308
    var last = doc.first + doc.size - 1;                                                                               // 2309
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);                                             // 2310
    return clipToLen(pos, getLine(doc, pos.line).text.length);                                                         // 2311
  }                                                                                                                    // 2312
  function clipToLen(pos, linelen) {                                                                                   // 2313
    var ch = pos.ch;                                                                                                   // 2314
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);                                                     // 2315
    else if (ch < 0) return Pos(pos.line, 0);                                                                          // 2316
    else return pos;                                                                                                   // 2317
  }                                                                                                                    // 2318
  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}                                         // 2319
                                                                                                                       // 2320
  // If shift is held, this will move the selection anchor. Otherwise,                                                 // 2321
  // it'll set the whole selection.                                                                                    // 2322
  function extendSelection(doc, pos, other, bias) {                                                                    // 2323
    if (doc.sel.shift || doc.sel.extend) {                                                                             // 2324
      var anchor = doc.sel.anchor;                                                                                     // 2325
      if (other) {                                                                                                     // 2326
        var posBefore = posLess(pos, anchor);                                                                          // 2327
        if (posBefore != posLess(other, anchor)) {                                                                     // 2328
          anchor = pos;                                                                                                // 2329
          pos = other;                                                                                                 // 2330
        } else if (posBefore != posLess(pos, other)) {                                                                 // 2331
          pos = other;                                                                                                 // 2332
        }                                                                                                              // 2333
      }                                                                                                                // 2334
      setSelection(doc, anchor, pos, bias);                                                                            // 2335
    } else {                                                                                                           // 2336
      setSelection(doc, pos, other || pos, bias);                                                                      // 2337
    }                                                                                                                  // 2338
    if (doc.cm) doc.cm.curOp.userSelChange = true;                                                                     // 2339
  }                                                                                                                    // 2340
                                                                                                                       // 2341
  function filterSelectionChange(doc, anchor, head) {                                                                  // 2342
    var obj = {anchor: anchor, head: head};                                                                            // 2343
    signal(doc, "beforeSelectionChange", doc, obj);                                                                    // 2344
    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);                                                  // 2345
    obj.anchor = clipPos(doc, obj.anchor); obj.head = clipPos(doc, obj.head);                                          // 2346
    return obj;                                                                                                        // 2347
  }                                                                                                                    // 2348
                                                                                                                       // 2349
  // Update the selection. Last two args are only used by                                                              // 2350
  // updateDoc, since they have to be expressed in the line                                                            // 2351
  // numbers before the update.                                                                                        // 2352
  function setSelection(doc, anchor, head, bias, checkAtomic) {                                                        // 2353
    if (!checkAtomic && hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) {
      var filtered = filterSelectionChange(doc, anchor, head);                                                         // 2355
      head = filtered.head;                                                                                            // 2356
      anchor = filtered.anchor;                                                                                        // 2357
    }                                                                                                                  // 2358
                                                                                                                       // 2359
    var sel = doc.sel;                                                                                                 // 2360
    sel.goalColumn = null;                                                                                             // 2361
    // Skip over atomic spans.                                                                                         // 2362
    if (checkAtomic || !posEq(anchor, sel.anchor))                                                                     // 2363
      anchor = skipAtomic(doc, anchor, bias, checkAtomic != "push");                                                   // 2364
    if (checkAtomic || !posEq(head, sel.head))                                                                         // 2365
      head = skipAtomic(doc, head, bias, checkAtomic != "push");                                                       // 2366
                                                                                                                       // 2367
    if (posEq(sel.anchor, anchor) && posEq(sel.head, head)) return;                                                    // 2368
                                                                                                                       // 2369
    sel.anchor = anchor; sel.head = head;                                                                              // 2370
    var inv = posLess(head, anchor);                                                                                   // 2371
    sel.from = inv ? head : anchor;                                                                                    // 2372
    sel.to = inv ? anchor : head;                                                                                      // 2373
                                                                                                                       // 2374
    if (doc.cm)                                                                                                        // 2375
      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = true;                                                 // 2376
                                                                                                                       // 2377
    signalLater(doc, "cursorActivity", doc);                                                                           // 2378
  }                                                                                                                    // 2379
                                                                                                                       // 2380
  function reCheckSelection(cm) {                                                                                      // 2381
    setSelection(cm.doc, cm.doc.sel.from, cm.doc.sel.to, null, "push");                                                // 2382
  }                                                                                                                    // 2383
                                                                                                                       // 2384
  function skipAtomic(doc, pos, bias, mayClear) {                                                                      // 2385
    var flipped = false, curPos = pos;                                                                                 // 2386
    var dir = bias || 1;                                                                                               // 2387
    doc.cantEdit = false;                                                                                              // 2388
    search: for (;;) {                                                                                                 // 2389
      var line = getLine(doc, curPos.line), toClear;                                                                   // 2390
      if (line.markedSpans) {                                                                                          // 2391
        for (var i = 0; i < line.markedSpans.length; ++i) {                                                            // 2392
          var sp = line.markedSpans[i], m = sp.marker;                                                                 // 2393
          if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&                   // 2394
              (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {                        // 2395
            if (mayClear && m.clearOnEnter) {                                                                          // 2396
              (toClear || (toClear = [])).push(m);                                                                     // 2397
              continue;                                                                                                // 2398
            } else if (!m.atomic) continue;                                                                            // 2399
            var newPos = m.find()[dir < 0 ? "from" : "to"];                                                            // 2400
            if (posEq(newPos, curPos)) {                                                                               // 2401
              newPos.ch += dir;                                                                                        // 2402
              if (newPos.ch < 0) {                                                                                     // 2403
                if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));                              // 2404
                else newPos = null;                                                                                    // 2405
              } else if (newPos.ch > line.text.length) {                                                               // 2406
                if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);                          // 2407
                else newPos = null;                                                                                    // 2408
              }                                                                                                        // 2409
              if (!newPos) {                                                                                           // 2410
                if (flipped) {                                                                                         // 2411
                  // Driven in a corner -- no valid cursor position found at all                                       // 2412
                  // -- try again *with* clearing, if we didn't already                                                // 2413
                  if (!mayClear) return skipAtomic(doc, pos, bias, true);                                              // 2414
                  // Otherwise, turn off editing until further notice, and return the start of the doc                 // 2415
                  doc.cantEdit = true;                                                                                 // 2416
                  return Pos(doc.first, 0);                                                                            // 2417
                }                                                                                                      // 2418
                flipped = true; newPos = pos; dir = -dir;                                                              // 2419
              }                                                                                                        // 2420
            }                                                                                                          // 2421
            curPos = newPos;                                                                                           // 2422
            continue search;                                                                                           // 2423
          }                                                                                                            // 2424
        }                                                                                                              // 2425
        if (toClear) for (var i = 0; i < toClear.length; ++i) toClear[i].clear();                                      // 2426
      }                                                                                                                // 2427
      return curPos;                                                                                                   // 2428
    }                                                                                                                  // 2429
  }                                                                                                                    // 2430
                                                                                                                       // 2431
  // SCROLLING                                                                                                         // 2432
                                                                                                                       // 2433
  function scrollCursorIntoView(cm) {                                                                                  // 2434
    var coords = scrollPosIntoView(cm, cm.doc.sel.head);                                                               // 2435
    if (!cm.state.focused) return;                                                                                     // 2436
    var display = cm.display, box = getRect(display.sizer), doScroll = null;                                           // 2437
    if (coords.top + box.top < 0) doScroll = true;                                                                     // 2438
    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
    if (doScroll != null && !phantom) {                                                                                // 2440
      var hidden = display.cursor.style.display == "none";                                                             // 2441
      if (hidden) {                                                                                                    // 2442
        display.cursor.style.display = "";                                                                             // 2443
        display.cursor.style.left = coords.left + "px";                                                                // 2444
        display.cursor.style.top = (coords.top - display.viewOffset) + "px";                                           // 2445
      }                                                                                                                // 2446
      display.cursor.scrollIntoView(doScroll);                                                                         // 2447
      if (hidden) display.cursor.style.display = "none";                                                               // 2448
    }                                                                                                                  // 2449
  }                                                                                                                    // 2450
                                                                                                                       // 2451
  function scrollPosIntoView(cm, pos) {                                                                                // 2452
    for (;;) {                                                                                                         // 2453
      var changed = false, coords = cursorCoords(cm, pos);                                                             // 2454
      var scrollPos = calculateScrollPos(cm, coords.left, coords.top, coords.left, coords.bottom);                     // 2455
      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;                                                  // 2456
      if (scrollPos.scrollTop != null) {                                                                               // 2457
        setScrollTop(cm, scrollPos.scrollTop);                                                                         // 2458
        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;                                                 // 2459
      }                                                                                                                // 2460
      if (scrollPos.scrollLeft != null) {                                                                              // 2461
        setScrollLeft(cm, scrollPos.scrollLeft);                                                                       // 2462
        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;                                               // 2463
      }                                                                                                                // 2464
      if (!changed) return coords;                                                                                     // 2465
    }                                                                                                                  // 2466
  }                                                                                                                    // 2467
                                                                                                                       // 2468
  function scrollIntoView(cm, x1, y1, x2, y2) {                                                                        // 2469
    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);                                                            // 2470
    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);                                            // 2471
    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);                                         // 2472
  }                                                                                                                    // 2473
                                                                                                                       // 2474
  function calculateScrollPos(cm, x1, y1, x2, y2) {                                                                    // 2475
    var display = cm.display, pt = paddingTop(display);                                                                // 2476
    y1 += pt; y2 += pt;                                                                                                // 2477
    var screen = display.scroller.clientHeight - scrollerCutOff, screentop = display.scroller.scrollTop, result = {};  // 2478
    var docBottom = cm.doc.height + 2 * pt;                                                                            // 2479
    var atTop = y1 < pt + 10, atBottom = y2 + pt > docBottom - 10;                                                     // 2480
    if (y1 < screentop) result.scrollTop = atTop ? 0 : Math.max(0, y1);                                                // 2481
    else if (y2 > screentop + screen) result.scrollTop = (atBottom ? docBottom : y2) - screen;                         // 2482
                                                                                                                       // 2483
    var screenw = display.scroller.clientWidth - scrollerCutOff, screenleft = display.scroller.scrollLeft;             // 2484
    x1 += display.gutters.offsetWidth; x2 += display.gutters.offsetWidth;                                              // 2485
    var gutterw = display.gutters.offsetWidth;                                                                         // 2486
    var atLeft = x1 < gutterw + 10;                                                                                    // 2487
    if (x1 < screenleft + gutterw || atLeft) {                                                                         // 2488
      if (atLeft) x1 = 0;                                                                                              // 2489
      result.scrollLeft = Math.max(0, x1 - 10 - gutterw);                                                              // 2490
    } else if (x2 > screenw + screenleft - 3) {                                                                        // 2491
      result.scrollLeft = x2 + 10 - screenw;                                                                           // 2492
    }                                                                                                                  // 2493
    return result;                                                                                                     // 2494
  }                                                                                                                    // 2495
                                                                                                                       // 2496
  function updateScrollPos(cm, left, top) {                                                                            // 2497
    cm.curOp.updateScrollPos = {scrollLeft: left, scrollTop: top};                                                     // 2498
  }                                                                                                                    // 2499
                                                                                                                       // 2500
  function addToScrollPos(cm, left, top) {                                                                             // 2501
    var pos = cm.curOp.updateScrollPos || (cm.curOp.updateScrollPos = {scrollLeft: cm.doc.scrollLeft, scrollTop: cm.doc.scrollTop});
    var scroll = cm.display.scroller;                                                                                  // 2503
    pos.scrollTop = Math.max(0, Math.min(scroll.scrollHeight - scroll.clientHeight, pos.scrollTop + top));             // 2504
    pos.scrollLeft = Math.max(0, Math.min(scroll.scrollWidth - scroll.clientWidth, pos.scrollLeft + left));            // 2505
  }                                                                                                                    // 2506
                                                                                                                       // 2507
  // API UTILITIES                                                                                                     // 2508
                                                                                                                       // 2509
  function indentLine(cm, n, how, aggressive) {                                                                        // 2510
    var doc = cm.doc;                                                                                                  // 2511
    if (!how) how = "add";                                                                                             // 2512
    if (how == "smart") {                                                                                              // 2513
      if (!cm.doc.mode.indent) how = "prev";                                                                           // 2514
      else var state = getStateBefore(cm, n);                                                                          // 2515
    }                                                                                                                  // 2516
                                                                                                                       // 2517
    var tabSize = cm.options.tabSize;                                                                                  // 2518
    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);                                      // 2519
    var curSpaceString = line.text.match(/^\s*/)[0], indentation;                                                      // 2520
    if (how == "smart") {                                                                                              // 2521
      indentation = cm.doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);                      // 2522
      if (indentation == Pass) {                                                                                       // 2523
        if (!aggressive) return;                                                                                       // 2524
        how = "prev";                                                                                                  // 2525
      }                                                                                                                // 2526
    }                                                                                                                  // 2527
    if (how == "prev") {                                                                                               // 2528
      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);                             // 2529
      else indentation = 0;                                                                                            // 2530
    } else if (how == "add") {                                                                                         // 2531
      indentation = curSpace + cm.options.indentUnit;                                                                  // 2532
    } else if (how == "subtract") {                                                                                    // 2533
      indentation = curSpace - cm.options.indentUnit;                                                                  // 2534
    }                                                                                                                  // 2535
    indentation = Math.max(0, indentation);                                                                            // 2536
                                                                                                                       // 2537
    var indentString = "", pos = 0;                                                                                    // 2538
    if (cm.options.indentWithTabs)                                                                                     // 2539
      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}                  // 2540
    if (pos < indentation) indentString += spaceStr(indentation - pos);                                                // 2541
                                                                                                                       // 2542
    if (indentString != curSpaceString)                                                                                // 2543
      replaceRange(cm.doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");                          // 2544
    line.stateAfter = null;                                                                                            // 2545
  }                                                                                                                    // 2546
                                                                                                                       // 2547
  function changeLine(cm, handle, op) {                                                                                // 2548
    var no = handle, line = handle, doc = cm.doc;                                                                      // 2549
    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));                                         // 2550
    else no = lineNo(handle);                                                                                          // 2551
    if (no == null) return null;                                                                                       // 2552
    if (op(line, no)) regChange(cm, no, no + 1);                                                                       // 2553
    else return null;                                                                                                  // 2554
    return line;                                                                                                       // 2555
  }                                                                                                                    // 2556
                                                                                                                       // 2557
  function findPosH(doc, pos, dir, unit, visually) {                                                                   // 2558
    var line = pos.line, ch = pos.ch;                                                                                  // 2559
    var lineObj = getLine(doc, line);                                                                                  // 2560
    var possible = true;                                                                                               // 2561
    function findNextLine() {                                                                                          // 2562
      var l = line + dir;                                                                                              // 2563
      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);                                       // 2564
      line = l;                                                                                                        // 2565
      return lineObj = getLine(doc, l);                                                                                // 2566
    }                                                                                                                  // 2567
    function moveOnce(boundToLine) {                                                                                   // 2568
      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);                                    // 2569
      if (next == null) {                                                                                              // 2570
        if (!boundToLine && findNextLine()) {                                                                          // 2571
          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);                                                // 2572
          else ch = dir < 0 ? lineObj.text.length : 0;                                                                 // 2573
        } else return (possible = false);                                                                              // 2574
      } else ch = next;                                                                                                // 2575
      return true;                                                                                                     // 2576
    }                                                                                                                  // 2577
                                                                                                                       // 2578
    if (unit == "char") moveOnce();                                                                                    // 2579
    else if (unit == "column") moveOnce(true);                                                                         // 2580
    else if (unit == "word") {                                                                                         // 2581
      var sawWord = false;                                                                                             // 2582
      for (;;) {                                                                                                       // 2583
        if (dir < 0) if (!moveOnce()) break;                                                                           // 2584
        if (isWordChar(lineObj.text.charAt(ch))) sawWord = true;                                                       // 2585
        else if (sawWord) {if (dir < 0) {dir = 1; moveOnce();} break;}                                                 // 2586
        if (dir > 0) if (!moveOnce()) break;                                                                           // 2587
      }                                                                                                                // 2588
    }                                                                                                                  // 2589
    var result = skipAtomic(doc, Pos(line, ch), dir, true);                                                            // 2590
    if (!possible) result.hitSide = true;                                                                              // 2591
    return result;                                                                                                     // 2592
  }                                                                                                                    // 2593
                                                                                                                       // 2594
  function findPosV(cm, pos, dir, unit) {                                                                              // 2595
    var doc = cm.doc, x = pos.left, y;                                                                                 // 2596
    if (unit == "page") {                                                                                              // 2597
      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));                                  // 2599
    } else if (unit == "line") {                                                                                       // 2600
      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;                                                                      // 2601
    }                                                                                                                  // 2602
    for (;;) {                                                                                                         // 2603
      var target = coordsChar(cm, x, y);                                                                               // 2604
      if (!target.outside) break;                                                                                      // 2605
      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }                                        // 2606
      y += dir * 5;                                                                                                    // 2607
    }                                                                                                                  // 2608
    return target;                                                                                                     // 2609
  }                                                                                                                    // 2610
                                                                                                                       // 2611
  function findWordAt(line, pos) {                                                                                     // 2612
    var start = pos.ch, end = pos.ch;                                                                                  // 2613
    if (line) {                                                                                                        // 2614
      if (pos.after === false || end == line.length) --start; else ++end;                                              // 2615
      var startChar = line.charAt(start);                                                                              // 2616
      var check = isWordChar(startChar) ? isWordChar :                                                                 // 2617
        /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);} :                                                  // 2618
      function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};                                                        // 2619
      while (start > 0 && check(line.charAt(start - 1))) --start;                                                      // 2620
      while (end < line.length && check(line.charAt(end))) ++end;                                                      // 2621
    }                                                                                                                  // 2622
    return {from: Pos(pos.line, start), to: Pos(pos.line, end)};                                                       // 2623
  }                                                                                                                    // 2624
                                                                                                                       // 2625
  function selectLine(cm, line) {                                                                                      // 2626
    extendSelection(cm.doc, Pos(line, 0), clipPos(cm.doc, Pos(line + 1, 0)));                                          // 2627
  }                                                                                                                    // 2628
                                                                                                                       // 2629
  // PROTOTYPE                                                                                                         // 2630
                                                                                                                       // 2631
  // The publicly visible API. Note that operation(null, f) means                                                      // 2632
  // 'wrap f in an operation, performed on its `this` parameter'                                                       // 2633
                                                                                                                       // 2634
  CodeMirror.prototype = {                                                                                             // 2635
    focus: function(){window.focus(); focusInput(this); onFocus(this); fastPoll(this);},                               // 2636
                                                                                                                       // 2637
    setOption: function(option, value) {                                                                               // 2638
      var options = this.options, old = options[option];                                                               // 2639
      if (options[option] == value && option != "mode") return;                                                        // 2640
      options[option] = value;                                                                                         // 2641
      if (optionHandlers.hasOwnProperty(option))                                                                       // 2642
        operation(this, optionHandlers[option])(this, value, old);                                                     // 2643
    },                                                                                                                 // 2644
                                                                                                                       // 2645
    getOption: function(option) {return this.options[option];},                                                        // 2646
    getDoc: function() {return this.doc;},                                                                             // 2647
                                                                                                                       // 2648
    addKeyMap: function(map) {                                                                                         // 2649
      this.state.keyMaps.push(map);                                                                                    // 2650
    },                                                                                                                 // 2651
    removeKeyMap: function(map) {                                                                                      // 2652
      var maps = this.state.keyMaps;                                                                                   // 2653
      for (var i = 0; i < maps.length; ++i)                                                                            // 2654
        if ((typeof map == "string" ? maps[i].name : maps[i]) == map) {                                                // 2655
          maps.splice(i, 1);                                                                                           // 2656
          return true;                                                                                                 // 2657
        }                                                                                                              // 2658
    },                                                                                                                 // 2659
                                                                                                                       // 2660
    addOverlay: operation(null, function(spec, options) {                                                              // 2661
      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);                                           // 2662
      if (mode.startState) throw new Error("Overlays may not be stateful.");                                           // 2663
      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});                       // 2664
      this.state.modeGen++;                                                                                            // 2665
      regChange(this);                                                                                                 // 2666
    }),                                                                                                                // 2667
    removeOverlay: operation(null, function(spec) {                                                                    // 2668
      var overlays = this.state.overlays;                                                                              // 2669
      for (var i = 0; i < overlays.length; ++i) {                                                                      // 2670
        if (overlays[i].modeSpec == spec) {                                                                            // 2671
          overlays.splice(i, 1);                                                                                       // 2672
          this.state.modeGen++;                                                                                        // 2673
          regChange(this);                                                                                             // 2674
          return;                                                                                                      // 2675
        }                                                                                                              // 2676
      }                                                                                                                // 2677
    }),                                                                                                                // 2678
                                                                                                                       // 2679
    indentLine: operation(null, function(n, dir, aggressive) {                                                         // 2680
      if (typeof dir != "string") {                                                                                    // 2681
        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";                                            // 2682
        else dir = dir ? "add" : "subtract";                                                                           // 2683
      }                                                                                                                // 2684
      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);                                                   // 2685
    }),                                                                                                                // 2686
    indentSelection: operation(null, function(how) {                                                                   // 2687
      var sel = this.doc.sel;                                                                                          // 2688
      if (posEq(sel.from, sel.to)) return indentLine(this, sel.from.line, how);                                        // 2689
      var e = sel.to.line - (sel.to.ch ? 0 : 1);                                                                       // 2690
      for (var i = sel.from.line; i <= e; ++i) indentLine(this, i, how);                                               // 2691
    }),                                                                                                                // 2692
                                                                                                                       // 2693
    // Fetch the parser token for a given character. Useful for hacks                                                  // 2694
    // that want to inspect the mode state (say, for completion).                                                      // 2695
    getTokenAt: function(pos) {                                                                                        // 2696
      var doc = this.doc;                                                                                              // 2697
      pos = clipPos(doc, pos);                                                                                         // 2698
      var state = getStateBefore(this, pos.line), mode = this.doc.mode;                                                // 2699
      var line = getLine(doc, pos.line);                                                                               // 2700
      var stream = new StringStream(line.text, this.options.tabSize);                                                  // 2701
      while (stream.pos < pos.ch && !stream.eol()) {                                                                   // 2702
        stream.start = stream.pos;                                                                                     // 2703
        var style = mode.token(stream, state);                                                                         // 2704
      }                                                                                                                // 2705
      return {start: stream.start,                                                                                     // 2706
              end: stream.pos,                                                                                         // 2707
              string: stream.current(),                                                                                // 2708
              className: style || null, // Deprecated, use 'type' instead                                              // 2709
              type: style || null,                                                                                     // 2710
              state: state};                                                                                           // 2711
    },                                                                                                                 // 2712
                                                                                                                       // 2713
    getStateAfter: function(line) {                                                                                    // 2714
      var doc = this.doc;                                                                                              // 2715
      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);                                             // 2716
      return getStateBefore(this, line + 1);                                                                           // 2717
    },                                                                                                                 // 2718
                                                                                                                       // 2719
    cursorCoords: function(start, mode) {                                                                              // 2720
      var pos, sel = this.doc.sel;                                                                                     // 2721
      if (start == null) pos = sel.head;                                                                               // 2722
      else if (typeof start == "object") pos = clipPos(this.doc, start);                                               // 2723
      else pos = start ? sel.from : sel.to;                                                                            // 2724
      return cursorCoords(this, pos, mode || "page");                                                                  // 2725
    },                                                                                                                 // 2726
                                                                                                                       // 2727
    charCoords: function(pos, mode) {                                                                                  // 2728
      return charCoords(this, clipPos(this.doc, pos), mode || "page");                                                 // 2729
    },                                                                                                                 // 2730
                                                                                                                       // 2731
    coordsChar: function(coords) {                                                                                     // 2732
      var off = getRect(this.display.lineSpace);                                                                       // 2733
      var scrollY = window.pageYOffset || (document.documentElement || document.body).scrollTop;                       // 2734
      var scrollX = window.pageXOffset || (document.documentElement || document.body).scrollLeft;                      // 2735
      return coordsChar(this, coords.left - off.left - scrollX, coords.top - off.top - scrollY);                       // 2736
    },                                                                                                                 // 2737
                                                                                                                       // 2738
    defaultTextHeight: function() { return textHeight(this.display); },                                                // 2739
                                                                                                                       // 2740
    setGutterMarker: operation(null, function(line, gutterID, value) {                                                 // 2741
      return changeLine(this, line, function(line) {                                                                   // 2742
        var markers = line.gutterMarkers || (line.gutterMarkers = {});                                                 // 2743
        markers[gutterID] = value;                                                                                     // 2744
        if (!value && isEmpty(markers)) line.gutterMarkers = null;                                                     // 2745
        return true;                                                                                                   // 2746
      });                                                                                                              // 2747
    }),                                                                                                                // 2748
                                                                                                                       // 2749
    clearGutter: operation(null, function(gutterID) {                                                                  // 2750
      var cm = this, doc = cm.doc, i = doc.first;                                                                      // 2751
      doc.iter(function(line) {                                                                                        // 2752
        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {                                                      // 2753
          line.gutterMarkers[gutterID] = null;                                                                         // 2754
          regChange(cm, i, i + 1);                                                                                     // 2755
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;                                                  // 2756
        }                                                                                                              // 2757
        ++i;                                                                                                           // 2758
      });                                                                                                              // 2759
    }),                                                                                                                // 2760
                                                                                                                       // 2761
    addLineClass: operation(null, function(handle, where, cls) {                                                       // 2762
      return changeLine(this, handle, function(line) {                                                                 // 2763
        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";                    // 2764
        if (!line[prop]) line[prop] = cls;                                                                             // 2765
        else if (new RegExp("\\b" + cls + "\\b").test(line[prop])) return false;                                       // 2766
        else line[prop] += " " + cls;                                                                                  // 2767
        return true;                                                                                                   // 2768
      });                                                                                                              // 2769
    }),                                                                                                                // 2770
                                                                                                                       // 2771
    removeLineClass: operation(null, function(handle, where, cls) {                                                    // 2772
      return changeLine(this, handle, function(line) {                                                                 // 2773
        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";                    // 2774
        var cur = line[prop];                                                                                          // 2775
        if (!cur) return false;                                                                                        // 2776
        else if (cls == null) line[prop] = null;                                                                       // 2777
        else {                                                                                                         // 2778
          var upd = cur.replace(new RegExp("^" + cls + "\\b\\s*|\\s*\\b" + cls + "\\b"), "");                          // 2779
          if (upd == cur) return false;                                                                                // 2780
          line[prop] = upd || null;                                                                                    // 2781
        }                                                                                                              // 2782
        return true;                                                                                                   // 2783
      });                                                                                                              // 2784
    }),                                                                                                                // 2785
                                                                                                                       // 2786
    addLineWidget: operation(null, function(handle, node, options) {                                                   // 2787
      return addLineWidget(this, handle, node, options);                                                               // 2788
    }),                                                                                                                // 2789
                                                                                                                       // 2790
    removeLineWidget: function(widget) { widget.clear(); },                                                            // 2791
                                                                                                                       // 2792
    lineInfo: function(line) {                                                                                         // 2793
      if (typeof line == "number") {                                                                                   // 2794
        if (!isLine(this.doc, line)) return null;                                                                      // 2795
        var n = line;                                                                                                  // 2796
        line = getLine(this.doc, line);                                                                                // 2797
        if (!line) return null;                                                                                        // 2798
      } else {                                                                                                         // 2799
        var n = lineNo(line);                                                                                          // 2800
        if (n == null) return null;                                                                                    // 2801
      }                                                                                                                // 2802
      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,                               // 2803
              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,                             // 2804
              widgets: line.widgets};                                                                                  // 2805
    },                                                                                                                 // 2806
                                                                                                                       // 2807
    getViewport: function() { return {from: this.display.showingFrom, to: this.display.showingTo};},                   // 2808
                                                                                                                       // 2809
    addWidget: function(pos, node, scroll, vert, horiz) {                                                              // 2810
      var display = this.display;                                                                                      // 2811
      pos = cursorCoords(this, clipPos(this.doc, pos));                                                                // 2812
      var top = pos.bottom, left = pos.left;                                                                           // 2813
      node.style.position = "absolute";                                                                                // 2814
      display.sizer.appendChild(node);                                                                                 // 2815
      if (vert == "over") {                                                                                            // 2816
        top = pos.top;                                                                                                 // 2817
      } else if (vert == "above" || vert == "near") {                                                                  // 2818
        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),                                          // 2819
        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);                                   // 2820
        // Default to positioning above (if specified and possible); otherwise default to positioning below            // 2821
        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)               // 2822
          top = pos.top - node.offsetHeight;                                                                           // 2823
        else if (pos.bottom + node.offsetHeight <= vspace)                                                             // 2824
          top = pos.bottom;                                                                                            // 2825
        if (left + node.offsetWidth > hspace)                                                                          // 2826
          left = hspace - node.offsetWidth;                                                                            // 2827
      }                                                                                                                // 2828
      node.style.top = (top + paddingTop(display)) + "px";                                                             // 2829
      node.style.left = node.style.right = "";                                                                         // 2830
      if (horiz == "right") {                                                                                          // 2831
        left = display.sizer.clientWidth - node.offsetWidth;                                                           // 2832
        node.style.right = "0px";                                                                                      // 2833
      } else {                                                                                                         // 2834
        if (horiz == "left") left = 0;                                                                                 // 2835
        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;                         // 2836
        node.style.left = left + "px";                                                                                 // 2837
      }                                                                                                                // 2838
      if (scroll)                                                                                                      // 2839
        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);                             // 2840
    },                                                                                                                 // 2841
                                                                                                                       // 2842
    triggerOnKeyDown: operation(null, onKeyDown),                                                                      // 2843
                                                                                                                       // 2844
    execCommand: function(cmd) {return commands[cmd](this);},                                                          // 2845
                                                                                                                       // 2846
    findPosH: function(from, amount, unit, visually) {                                                                 // 2847
      var dir = 1;                                                                                                     // 2848
      if (amount < 0) { dir = -1; amount = -amount; }                                                                  // 2849
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {                                                // 2850
        cur = findPosH(this.doc, cur, dir, unit, visually);                                                            // 2851
        if (cur.hitSide) break;                                                                                        // 2852
      }                                                                                                                // 2853
      return cur;                                                                                                      // 2854
    },                                                                                                                 // 2855
                                                                                                                       // 2856
    moveH: operation(null, function(dir, unit) {                                                                       // 2857
      var sel = this.doc.sel, pos;                                                                                     // 2858
      if (sel.shift || sel.extend || posEq(sel.from, sel.to))                                                          // 2859
        pos = findPosH(this.doc, sel.head, dir, unit, this.options.rtlMoveVisually);                                   // 2860
      else                                                                                                             // 2861
        pos = dir < 0 ? sel.from : sel.to;                                                                             // 2862
      extendSelection(this.doc, pos, pos, dir);                                                                        // 2863
    }),                                                                                                                // 2864
                                                                                                                       // 2865
    deleteH: operation(null, function(dir, unit) {                                                                     // 2866
      var sel = this.doc.sel;                                                                                          // 2867
      if (!posEq(sel.from, sel.to)) replaceRange(this.doc, "", sel.from, sel.to, "+delete");                           // 2868
      else replaceRange(this.doc, "", sel.from, findPosH(this.doc, sel.head, dir, unit, false), "+delete");            // 2869
      this.curOp.userSelChange = true;                                                                                 // 2870
    }),                                                                                                                // 2871
                                                                                                                       // 2872
    findPosV: function(from, amount, unit, goalColumn) {                                                               // 2873
      var dir = 1, x = goalColumn;                                                                                     // 2874
      if (amount < 0) { dir = -1; amount = -amount; }                                                                  // 2875
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {                                                // 2876
        var coords = cursorCoords(this, cur, "div");                                                                   // 2877
        if (x == null) x = coords.left;                                                                                // 2878
        else coords.left = x;                                                                                          // 2879
        cur = findPosV(this, coords, dir, unit);                                                                       // 2880
        if (cur.hitSide) break;                                                                                        // 2881
      }                                                                                                                // 2882
      return cur;                                                                                                      // 2883
    },                                                                                                                 // 2884
                                                                                                                       // 2885
    moveV: operation(null, function(dir, unit) {                                                                       // 2886
      var sel = this.doc.sel;                                                                                          // 2887
      var pos = cursorCoords(this, sel.head, "div");                                                                   // 2888
      if (sel.goalColumn != null) pos.left = sel.goalColumn;                                                           // 2889
      var target = findPosV(this, pos, dir, unit);                                                                     // 2890
                                                                                                                       // 2891
      if (unit == "page") addToScrollPos(this, 0, charCoords(this, target, "div").top - pos.top);                      // 2892
      extendSelection(this.doc, target, target, dir);                                                                  // 2893
      sel.goalColumn = pos.left;                                                                                       // 2894
    }),                                                                                                                // 2895
                                                                                                                       // 2896
    toggleOverwrite: function() {                                                                                      // 2897
      if (this.state.overwrite = !this.state.overwrite)                                                                // 2898
        this.display.cursor.className += " CodeMirror-overwrite";                                                      // 2899
      else                                                                                                             // 2900
        this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", "");            // 2901
    },                                                                                                                 // 2902
                                                                                                                       // 2903
    scrollTo: operation(null, function(x, y) {                                                                         // 2904
      updateScrollPos(this, x, y);                                                                                     // 2905
    }),                                                                                                                // 2906
    getScrollInfo: function() {                                                                                        // 2907
      var scroller = this.display.scroller, co = scrollerCutOff;                                                       // 2908
      return {left: scroller.scrollLeft, top: scroller.scrollTop,                                                      // 2909
              height: scroller.scrollHeight - co, width: scroller.scrollWidth - co,                                    // 2910
              clientHeight: scroller.clientHeight - co, clientWidth: scroller.clientWidth - co};                       // 2911
    },                                                                                                                 // 2912
                                                                                                                       // 2913
    scrollIntoView: function(pos) {                                                                                    // 2914
      if (typeof pos == "number") pos = Pos(pos, 0);                                                                   // 2915
      if (!pos || pos.line != null) {                                                                                  // 2916
        pos = pos ? clipPos(this.doc, pos) : this.doc.sel.head;                                                        // 2917
        scrollPosIntoView(this, pos);                                                                                  // 2918
      } else {                                                                                                         // 2919
        scrollIntoView(this, pos.left, pos.top, pos.right, pos.bottom);                                                // 2920
      }                                                                                                                // 2921
    },                                                                                                                 // 2922
                                                                                                                       // 2923
    setSize: function(width, height) {                                                                                 // 2924
      function interpret(val) {                                                                                        // 2925
        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;                                 // 2926
      }                                                                                                                // 2927
      if (width != null) this.display.wrapper.style.width = interpret(width);                                          // 2928
      if (height != null) this.display.wrapper.style.height = interpret(height);                                       // 2929
      this.refresh();                                                                                                  // 2930
    },                                                                                                                 // 2931
                                                                                                                       // 2932
    on: function(type, f) {on(this, type, f);},                                                                        // 2933
    off: function(type, f) {off(this, type, f);},                                                                      // 2934
                                                                                                                       // 2935
    operation: function(f){return runInOp(this, f);},                                                                  // 2936
                                                                                                                       // 2937
    refresh: operation(null, function() {                                                                              // 2938
      clearCaches(this);                                                                                               // 2939
      updateScrollPos(this, this.doc.scrollLeft, this.doc.scrollTop);                                                  // 2940
      regChange(this);                                                                                                 // 2941
    }),                                                                                                                // 2942
                                                                                                                       // 2943
    swapDoc: operation(null, function(doc) {                                                                           // 2944
      var old = this.doc;                                                                                              // 2945
      old.cm = null;                                                                                                   // 2946
      attachDoc(this, doc);                                                                                            // 2947
      clearCaches(this);                                                                                               // 2948
      updateScrollPos(this, doc.scrollLeft, doc.scrollTop);                                                            // 2949
      return old;                                                                                                      // 2950
    }),                                                                                                                // 2951
                                                                                                                       // 2952
    getInputField: function(){return this.display.input;},                                                             // 2953
    getWrapperElement: function(){return this.display.wrapper;},                                                       // 2954
    getScrollerElement: function(){return this.display.scroller;},                                                     // 2955
    getGutterElement: function(){return this.display.gutters;}                                                         // 2956
  };                                                                                                                   // 2957
                                                                                                                       // 2958
  // OPTION DEFAULTS                                                                                                   // 2959
                                                                                                                       // 2960
  var optionHandlers = CodeMirror.optionHandlers = {};                                                                 // 2961
                                                                                                                       // 2962
  // The default configuration options.                                                                                // 2963
  var defaults = CodeMirror.defaults = {};                                                                             // 2964
                                                                                                                       // 2965
  function option(name, deflt, handle, notOnInit) {                                                                    // 2966
    CodeMirror.defaults[name] = deflt;                                                                                 // 2967
    if (handle) optionHandlers[name] =                                                                                 // 2968
      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;                            // 2969
  }                                                                                                                    // 2970
                                                                                                                       // 2971
  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};                                      // 2972
                                                                                                                       // 2973
  // These two are, on init, called from the constructor because they                                                  // 2974
  // have to be initialized before the editor can start at all.                                                        // 2975
  option("value", "", function(cm, val) {                                                                              // 2976
    cm.setValue(val);                                                                                                  // 2977
  }, true);                                                                                                            // 2978
  option("mode", null, function(cm, val) {                                                                             // 2979
    cm.doc.modeOption = val;                                                                                           // 2980
    loadMode(cm);                                                                                                      // 2981
  }, true);                                                                                                            // 2982
                                                                                                                       // 2983
  option("indentUnit", 2, loadMode, true);                                                                             // 2984
  option("indentWithTabs", false);                                                                                     // 2985
  option("smartIndent", true);                                                                                         // 2986
  option("tabSize", 4, function(cm) {                                                                                  // 2987
    loadMode(cm);                                                                                                      // 2988
    clearCaches(cm);                                                                                                   // 2989
    regChange(cm);                                                                                                     // 2990
  }, true);                                                                                                            // 2991
  option("electricChars", true);                                                                                       // 2992
  option("rtlMoveVisually", !windows);                                                                                 // 2993
                                                                                                                       // 2994
  option("theme", "default", function(cm) {                                                                            // 2995
    themeChanged(cm);                                                                                                  // 2996
    guttersChanged(cm);                                                                                                // 2997
  }, true);                                                                                                            // 2998
  option("keyMap", "default", keyMapChanged);                                                                          // 2999
  option("extraKeys", null);                                                                                           // 3000
                                                                                                                       // 3001
  option("onKeyEvent", null);                                                                                          // 3002
  option("onDragEvent", null);                                                                                         // 3003
                                                                                                                       // 3004
  option("lineWrapping", false, wrappingChanged, true);                                                                // 3005
  option("gutters", [], function(cm) {                                                                                 // 3006
    setGuttersForLineNumbers(cm.options);                                                                              // 3007
    guttersChanged(cm);                                                                                                // 3008
  }, true);                                                                                                            // 3009
  option("fixedGutter", true, function(cm, val) {                                                                      // 3010
    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";                               // 3011
    cm.refresh();                                                                                                      // 3012
  }, true);                                                                                                            // 3013
  option("lineNumbers", false, function(cm) {                                                                          // 3014
    setGuttersForLineNumbers(cm.options);                                                                              // 3015
    guttersChanged(cm);                                                                                                // 3016
  }, true);                                                                                                            // 3017
  option("firstLineNumber", 1, guttersChanged, true);                                                                  // 3018
  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);                            // 3019
  option("showCursorWhenSelecting", false, updateSelection, true);                                                     // 3020
                                                                                                                       // 3021
  option("readOnly", false, function(cm, val) {                                                                        // 3022
    if (val == "nocursor") {onBlur(cm); cm.display.input.blur();}                                                      // 3023
    else if (!val) resetInput(cm, true);                                                                               // 3024
  });                                                                                                                  // 3025
  option("dragDrop", true);                                                                                            // 3026
                                                                                                                       // 3027
  option("cursorBlinkRate", 530);                                                                                      // 3028
  option("cursorHeight", 1);                                                                                           // 3029
  option("workTime", 100);                                                                                             // 3030
  option("workDelay", 100);                                                                                            // 3031
  option("flattenSpans", true);                                                                                        // 3032
  option("pollInterval", 100);                                                                                         // 3033
  option("undoDepth", 40, function(cm, val){cm.doc.history.undoDepth = val;});                                         // 3034
  option("viewportMargin", 10, function(cm){cm.refresh();}, true);                                                     // 3035
                                                                                                                       // 3036
  option("tabindex", null, function(cm, val) {                                                                         // 3037
    cm.display.input.tabIndex = val || "";                                                                             // 3038
  });                                                                                                                  // 3039
  option("autofocus", null);                                                                                           // 3040
                                                                                                                       // 3041
  // MODE DEFINITION AND QUERYING                                                                                      // 3042
                                                                                                                       // 3043
  // Known modes, by name and by MIME                                                                                  // 3044
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};                                            // 3045
                                                                                                                       // 3046
  CodeMirror.defineMode = function(name, mode) {                                                                       // 3047
    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;                                  // 3048
    if (arguments.length > 2) {                                                                                        // 3049
      mode.dependencies = [];                                                                                          // 3050
      for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i]);                                 // 3051
    }                                                                                                                  // 3052
    modes[name] = mode;                                                                                                // 3053
  };                                                                                                                   // 3054
                                                                                                                       // 3055
  CodeMirror.defineMIME = function(mime, spec) {                                                                       // 3056
    mimeModes[mime] = spec;                                                                                            // 3057
  };                                                                                                                   // 3058
                                                                                                                       // 3059
  CodeMirror.resolveMode = function(spec) {                                                                            // 3060
    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec))                                                     // 3061
      spec = mimeModes[spec];                                                                                          // 3062
    else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec))                                          // 3063
      return CodeMirror.resolveMode("application/xml");                                                                // 3064
    if (typeof spec == "string") return {name: spec};                                                                  // 3065
    else return spec || {name: "null"};                                                                                // 3066
  };                                                                                                                   // 3067
                                                                                                                       // 3068
  CodeMirror.getMode = function(options, spec) {                                                                       // 3069
    spec = CodeMirror.resolveMode(spec);                                                                               // 3070
    var mfactory = modes[spec.name];                                                                                   // 3071
    if (!mfactory) return CodeMirror.getMode(options, "text/plain");                                                   // 3072
    var modeObj = mfactory(options, spec);                                                                             // 3073
    if (modeExtensions.hasOwnProperty(spec.name)) {                                                                    // 3074
      var exts = modeExtensions[spec.name];                                                                            // 3075
      for (var prop in exts) {                                                                                         // 3076
        if (!exts.hasOwnProperty(prop)) continue;                                                                      // 3077
        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];                                         // 3078
        modeObj[prop] = exts[prop];                                                                                    // 3079
      }                                                                                                                // 3080
    }                                                                                                                  // 3081
    modeObj.name = spec.name;                                                                                          // 3082
    return modeObj;                                                                                                    // 3083
  };                                                                                                                   // 3084
                                                                                                                       // 3085
  CodeMirror.defineMode("null", function() {                                                                           // 3086
    return {token: function(stream) {stream.skipToEnd();}};                                                            // 3087
  });                                                                                                                  // 3088
  CodeMirror.defineMIME("text/plain", "null");                                                                         // 3089
                                                                                                                       // 3090
  var modeExtensions = CodeMirror.modeExtensions = {};                                                                 // 3091
  CodeMirror.extendMode = function(mode, properties) {                                                                 // 3092
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});               // 3093
    copyObj(properties, exts);                                                                                         // 3094
  };                                                                                                                   // 3095
                                                                                                                       // 3096
  // EXTENSIONS                                                                                                        // 3097
                                                                                                                       // 3098
  CodeMirror.defineExtension = function(name, func) {                                                                  // 3099
    CodeMirror.prototype[name] = func;                                                                                 // 3100
  };                                                                                                                   // 3101
                                                                                                                       // 3102
  CodeMirror.defineOption = option;                                                                                    // 3103
                                                                                                                       // 3104
  var initHooks = [];                                                                                                  // 3105
  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};                                                        // 3106
                                                                                                                       // 3107
  // MODE STATE HANDLING                                                                                               // 3108
                                                                                                                       // 3109
  // Utility functions for working with state. Exported because modes                                                  // 3110
  // sometimes need to do this.                                                                                        // 3111
  function copyState(mode, state) {                                                                                    // 3112
    if (state === true) return state;                                                                                  // 3113
    if (mode.copyState) return mode.copyState(state);                                                                  // 3114
    var nstate = {};                                                                                                   // 3115
    for (var n in state) {                                                                                             // 3116
      var val = state[n];                                                                                              // 3117
      if (val instanceof Array) val = val.concat([]);                                                                  // 3118
      nstate[n] = val;                                                                                                 // 3119
    }                                                                                                                  // 3120
    return nstate;                                                                                                     // 3121
  }                                                                                                                    // 3122
  CodeMirror.copyState = copyState;                                                                                    // 3123
                                                                                                                       // 3124
  function startState(mode, a1, a2) {                                                                                  // 3125
    return mode.startState ? mode.startState(a1, a2) : true;                                                           // 3126
  }                                                                                                                    // 3127
  CodeMirror.startState = startState;                                                                                  // 3128
                                                                                                                       // 3129
  CodeMirror.innerMode = function(mode, state) {                                                                       // 3130
    while (mode.innerMode) {                                                                                           // 3131
      var info = mode.innerMode(state);                                                                                // 3132
      state = info.state;                                                                                              // 3133
      mode = info.mode;                                                                                                // 3134
    }                                                                                                                  // 3135
    return info || {mode: mode, state: state};                                                                         // 3136
  };                                                                                                                   // 3137
                                                                                                                       // 3138
  // STANDARD COMMANDS                                                                                                 // 3139
                                                                                                                       // 3140
  var commands = CodeMirror.commands = {                                                                               // 3141
    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()));},                            // 3142
    killLine: function(cm) {                                                                                           // 3143
      var from = cm.getCursor(true), to = cm.getCursor(false), sel = !posEq(from, to);                                 // 3144
      if (!sel && cm.getLine(from.line).length == from.ch)                                                             // 3145
        cm.replaceRange("", from, Pos(from.line + 1, 0), "+delete");                                                   // 3146
      else cm.replaceRange("", from, sel ? to : Pos(from.line), "+delete");                                            // 3147
    },                                                                                                                 // 3148
    deleteLine: function(cm) {                                                                                         // 3149
      var l = cm.getCursor().line;                                                                                     // 3150
      cm.replaceRange("", Pos(l, 0), Pos(l), "+delete");                                                               // 3151
    },                                                                                                                 // 3152
    undo: function(cm) {cm.undo();},                                                                                   // 3153
    redo: function(cm) {cm.redo();},                                                                                   // 3154
    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},                                            // 3155
    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},                                                  // 3156
    goLineStart: function(cm) {                                                                                        // 3157
      cm.extendSelection(lineStart(cm, cm.getCursor().line));                                                          // 3158
    },                                                                                                                 // 3159
    goLineStartSmart: function(cm) {                                                                                   // 3160
      var cur = cm.getCursor(), start = lineStart(cm, cur.line);                                                       // 3161
      var line = cm.getLineHandle(start.line);                                                                         // 3162
      var order = getOrder(line);                                                                                      // 3163
      if (!order || order[0].level == 0) {                                                                             // 3164
        var firstNonWS = Math.max(0, line.text.search(/\S/));                                                          // 3165
        var inWS = cur.line == start.line && cur.ch <= firstNonWS && cur.ch;                                           // 3166
        cm.extendSelection(Pos(start.line, inWS ? 0 : firstNonWS));                                                    // 3167
      } else cm.extendSelection(start);                                                                                // 3168
    },                                                                                                                 // 3169
    goLineEnd: function(cm) {                                                                                          // 3170
      cm.extendSelection(lineEnd(cm, cm.getCursor().line));                                                            // 3171
    },                                                                                                                 // 3172
    goLineUp: function(cm) {cm.moveV(-1, "line");},                                                                    // 3173
    goLineDown: function(cm) {cm.moveV(1, "line");},                                                                   // 3174
    goPageUp: function(cm) {cm.moveV(-1, "page");},                                                                    // 3175
    goPageDown: function(cm) {cm.moveV(1, "page");},                                                                   // 3176
    goCharLeft: function(cm) {cm.moveH(-1, "char");},                                                                  // 3177
    goCharRight: function(cm) {cm.moveH(1, "char");},                                                                  // 3178
    goColumnLeft: function(cm) {cm.moveH(-1, "column");},                                                              // 3179
    goColumnRight: function(cm) {cm.moveH(1, "column");},                                                              // 3180
    goWordLeft: function(cm) {cm.moveH(-1, "word");},                                                                  // 3181
    goWordRight: function(cm) {cm.moveH(1, "word");},                                                                  // 3182
    delCharBefore: function(cm) {cm.deleteH(-1, "char");},                                                             // 3183
    delCharAfter: function(cm) {cm.deleteH(1, "char");},                                                               // 3184
    delWordBefore: function(cm) {cm.deleteH(-1, "word");},                                                             // 3185
    delWordAfter: function(cm) {cm.deleteH(1, "word");},                                                               // 3186
    indentAuto: function(cm) {cm.indentSelection("smart");},                                                           // 3187
    indentMore: function(cm) {cm.indentSelection("add");},                                                             // 3188
    indentLess: function(cm) {cm.indentSelection("subtract");},                                                        // 3189
    insertTab: function(cm) {cm.replaceSelection("\t", "end", "+input");},                                             // 3190
    defaultTab: function(cm) {                                                                                         // 3191
      if (cm.somethingSelected()) cm.indentSelection("add");                                                           // 3192
      else cm.replaceSelection("\t", "end", "+input");                                                                 // 3193
    },                                                                                                                 // 3194
    transposeChars: function(cm) {                                                                                     // 3195
      var cur = cm.getCursor(), line = cm.getLine(cur.line);                                                           // 3196
      if (cur.ch > 0 && cur.ch < line.length - 1)                                                                      // 3197
        cm.replaceRange(line.charAt(cur.ch) + line.charAt(cur.ch - 1),                                                 // 3198
                        Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1));                                         // 3199
    },                                                                                                                 // 3200
    newlineAndIndent: function(cm) {                                                                                   // 3201
      operation(cm, function() {                                                                                       // 3202
        cm.replaceSelection("\n", "end", "+input");                                                                    // 3203
        cm.indentLine(cm.getCursor().line, null, true);                                                                // 3204
      })();                                                                                                            // 3205
    },                                                                                                                 // 3206
    toggleOverwrite: function(cm) {cm.toggleOverwrite();}                                                              // 3207
  };                                                                                                                   // 3208
                                                                                                                       // 3209
  // STANDARD KEYMAPS                                                                                                  // 3210
                                                                                                                       // 3211
  var keyMap = CodeMirror.keyMap = {};                                                                                 // 3212
  keyMap.basic = {                                                                                                     // 3213
    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",                              // 3214
    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",                    // 3215
    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Tab": "defaultTab", "Shift-Tab": "indentAuto",            // 3216
    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite"                                                           // 3217
  };                                                                                                                   // 3218
  // Note that the save and find-related commands aren't defined by                                                    // 3219
  // default. Unknown commands are simply ignored.                                                                     // 3220
  keyMap.pcDefault = {                                                                                                 // 3221
    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",         // 3222
    "Ctrl-Home": "goDocStart", "Alt-Up": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Down": "goDocEnd",                // 3223
    "Ctrl-Left": "goWordLeft", "Ctrl-Right": "goWordRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",       // 3224
    "Ctrl-Backspace": "delWordBefore", "Ctrl-Delete": "delWordAfter", "Ctrl-S": "save", "Ctrl-F": "find",              // 3225
    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",         // 3226
    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",                                                                    // 3227
    fallthrough: "basic"                                                                                               // 3228
  };                                                                                                                   // 3229
  keyMap.macDefault = {                                                                                                // 3230
    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",              // 3231
    "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goWordLeft",                   // 3232
    "Alt-Right": "goWordRight", "Cmd-Left": "goLineStart", "Cmd-Right": "goLineEnd", "Alt-Backspace": "delWordBefore", // 3233
    "Ctrl-Alt-Backspace": "delWordAfter", "Alt-Delete": "delWordAfter", "Cmd-S": "save", "Cmd-F": "find",              // 3234
    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",           // 3235
    "Cmd-[": "indentLess", "Cmd-]": "indentMore",                                                                      // 3236
    fallthrough: ["basic", "emacsy"]                                                                                   // 3237
  };                                                                                                                   // 3238
  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;                                                      // 3239
  keyMap.emacsy = {                                                                                                    // 3240
    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",                     // 3241
    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",                     // 3242
    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",           // 3243
    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"        // 3244
  };                                                                                                                   // 3245
                                                                                                                       // 3246
  // KEYMAP DISPATCH                                                                                                   // 3247
                                                                                                                       // 3248
  function getKeyMap(val) {                                                                                            // 3249
    if (typeof val == "string") return keyMap[val];                                                                    // 3250
    else return val;                                                                                                   // 3251
  }                                                                                                                    // 3252
                                                                                                                       // 3253
  function lookupKey(name, maps, handle) {                                                                             // 3254
    function lookup(map) {                                                                                             // 3255
      map = getKeyMap(map);                                                                                            // 3256
      var found = map[name];                                                                                           // 3257
      if (found === false) return "stop";                                                                              // 3258
      if (found != null && handle(found)) return true;                                                                 // 3259
      if (map.nofallthrough) return "stop";                                                                            // 3260
                                                                                                                       // 3261
      var fallthrough = map.fallthrough;                                                                               // 3262
      if (fallthrough == null) return false;                                                                           // 3263
      if (Object.prototype.toString.call(fallthrough) != "[object Array]")                                             // 3264
        return lookup(fallthrough);                                                                                    // 3265
      for (var i = 0, e = fallthrough.length; i < e; ++i) {                                                            // 3266
        var done = lookup(fallthrough[i]);                                                                             // 3267
        if (done) return done;                                                                                         // 3268
      }                                                                                                                // 3269
      return false;                                                                                                    // 3270
    }                                                                                                                  // 3271
                                                                                                                       // 3272
    for (var i = 0; i < maps.length; ++i) {                                                                            // 3273
      var done = lookup(maps[i]);                                                                                      // 3274
      if (done) return done;                                                                                           // 3275
    }                                                                                                                  // 3276
  }                                                                                                                    // 3277
  function isModifierKey(event) {                                                                                      // 3278
    var name = keyNames[event.keyCode];                                                                                // 3279
    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";                                        // 3280
  }                                                                                                                    // 3281
  function keyName(event, noShift) {                                                                                   // 3282
    var name = keyNames[event.keyCode];                                                                                // 3283
    if (name == null || event.altGraphKey) return false;                                                               // 3284
    if (event.altKey) name = "Alt-" + name;                                                                            // 3285
    if (flipCtrlCmd ? event.metaKey : event.ctrlKey) name = "Ctrl-" + name;                                            // 3286
    if (flipCtrlCmd ? event.ctrlKey : event.metaKey) name = "Cmd-" + name;                                             // 3287
    if (!noShift && event.shiftKey) name = "Shift-" + name;                                                            // 3288
    return name;                                                                                                       // 3289
  }                                                                                                                    // 3290
  CodeMirror.lookupKey = lookupKey;                                                                                    // 3291
  CodeMirror.isModifierKey = isModifierKey;                                                                            // 3292
  CodeMirror.keyName = keyName;                                                                                        // 3293
                                                                                                                       // 3294
  // FROMTEXTAREA                                                                                                      // 3295
                                                                                                                       // 3296
  CodeMirror.fromTextArea = function(textarea, options) {                                                              // 3297
    if (!options) options = {};                                                                                        // 3298
    options.value = textarea.value;                                                                                    // 3299
    if (!options.tabindex && textarea.tabindex)                                                                        // 3300
      options.tabindex = textarea.tabindex;                                                                            // 3301
    // Set autofocus to true if this textarea is focused, or if it has                                                 // 3302
    // autofocus and no other element is focused.                                                                      // 3303
    if (options.autofocus == null) {                                                                                   // 3304
      var hasFocus = document.body;                                                                                    // 3305
      // doc.activeElement occasionally throws on IE                                                                   // 3306
      try { hasFocus = document.activeElement; } catch(e) {}                                                           // 3307
      options.autofocus = hasFocus == textarea ||                                                                      // 3308
        textarea.getAttribute("autofocus") != null && hasFocus == document.body;                                       // 3309
    }                                                                                                                  // 3310
                                                                                                                       // 3311
    function save() {textarea.value = cm.getValue();}                                                                  // 3312
    if (textarea.form) {                                                                                               // 3313
      on(textarea.form, "submit", save);                                                                               // 3314
      // Deplorable hack to make the submit method do the right thing.                                                 // 3315
      if (!options.leaveSubmitMethodAlone) {                                                                           // 3316
        var form = textarea.form, realSubmit = form.submit;                                                            // 3317
        try {                                                                                                          // 3318
          var wrappedSubmit = form.submit = function() {                                                               // 3319
            save();                                                                                                    // 3320
            form.submit = realSubmit;                                                                                  // 3321
            form.submit();                                                                                             // 3322
            form.submit = wrappedSubmit;                                                                               // 3323
          };                                                                                                           // 3324
        } catch(e) {}                                                                                                  // 3325
      }                                                                                                                // 3326
    }                                                                                                                  // 3327
                                                                                                                       // 3328
    textarea.style.display = "none";                                                                                   // 3329
    var cm = CodeMirror(function(node) {                                                                               // 3330
      textarea.parentNode.insertBefore(node, textarea.nextSibling);                                                    // 3331
    }, options);                                                                                                       // 3332
    cm.save = save;                                                                                                    // 3333
    cm.getTextArea = function() { return textarea; };                                                                  // 3334
    cm.toTextArea = function() {                                                                                       // 3335
      save();                                                                                                          // 3336
      textarea.parentNode.removeChild(cm.getWrapperElement());                                                         // 3337
      textarea.style.display = "";                                                                                     // 3338
      if (textarea.form) {                                                                                             // 3339
        off(textarea.form, "submit", save);                                                                            // 3340
        if (typeof textarea.form.submit == "function")                                                                 // 3341
          textarea.form.submit = realSubmit;                                                                           // 3342
      }                                                                                                                // 3343
    };                                                                                                                 // 3344
    return cm;                                                                                                         // 3345
  };                                                                                                                   // 3346
                                                                                                                       // 3347
  // STRING STREAM                                                                                                     // 3348
                                                                                                                       // 3349
  // Fed to the mode parsers, provides helper functions to make                                                        // 3350
  // parsers more succinct.                                                                                            // 3351
                                                                                                                       // 3352
  // The character stream used by a mode's parser.                                                                     // 3353
  function StringStream(string, tabSize) {                                                                             // 3354
    this.pos = this.start = 0;                                                                                         // 3355
    this.string = string;                                                                                              // 3356
    this.tabSize = tabSize || 8;                                                                                       // 3357
    this.lastColumnPos = this.lastColumnValue = 0;                                                                     // 3358
  }                                                                                                                    // 3359
                                                                                                                       // 3360
  StringStream.prototype = {                                                                                           // 3361
    eol: function() {return this.pos >= this.string.length;},                                                          // 3362
    sol: function() {return this.pos == 0;},                                                                           // 3363
    peek: function() {return this.string.charAt(this.pos) || undefined;},                                              // 3364
    next: function() {                                                                                                 // 3365
      if (this.pos < this.string.length)                                                                               // 3366
        return this.string.charAt(this.pos++);                                                                         // 3367
    },                                                                                                                 // 3368
    eat: function(match) {                                                                                             // 3369
      var ch = this.string.charAt(this.pos);                                                                           // 3370
      if (typeof match == "string") var ok = ch == match;                                                              // 3371
      else var ok = ch && (match.test ? match.test(ch) : match(ch));                                                   // 3372
      if (ok) {++this.pos; return ch;}                                                                                 // 3373
    },                                                                                                                 // 3374
    eatWhile: function(match) {                                                                                        // 3375
      var start = this.pos;                                                                                            // 3376
      while (this.eat(match)){}                                                                                        // 3377
      return this.pos > start;                                                                                         // 3378
    },                                                                                                                 // 3379
    eatSpace: function() {                                                                                             // 3380
      var start = this.pos;                                                                                            // 3381
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;                                              // 3382
      return this.pos > start;                                                                                         // 3383
    },                                                                                                                 // 3384
    skipToEnd: function() {this.pos = this.string.length;},                                                            // 3385
    skipTo: function(ch) {                                                                                             // 3386
      var found = this.string.indexOf(ch, this.pos);                                                                   // 3387
      if (found > -1) {this.pos = found; return true;}                                                                 // 3388
    },                                                                                                                 // 3389
    backUp: function(n) {this.pos -= n;},                                                                              // 3390
    column: function() {                                                                                               // 3391
      if (this.lastColumnPos < this.start) {                                                                           // 3392
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;                                                                               // 3394
      }                                                                                                                // 3395
      return this.lastColumnValue;                                                                                     // 3396
    },                                                                                                                 // 3397
    indentation: function() {return countColumn(this.string, null, this.tabSize);},                                    // 3398
    match: function(pattern, consume, caseInsensitive) {                                                               // 3399
      if (typeof pattern == "string") {                                                                                // 3400
        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};                                 // 3401
        var substr = this.string.substr(this.pos, pattern.length);                                                     // 3402
        if (cased(substr) == cased(pattern)) {                                                                         // 3403
          if (consume !== false) this.pos += pattern.length;                                                           // 3404
          return true;                                                                                                 // 3405
        }                                                                                                              // 3406
      } else {                                                                                                         // 3407
        var match = this.string.slice(this.pos).match(pattern);                                                        // 3408
        if (match && match.index > 0) return null;                                                                     // 3409
        if (match && consume !== false) this.pos += match[0].length;                                                   // 3410
        return match;                                                                                                  // 3411
      }                                                                                                                // 3412
    },                                                                                                                 // 3413
    current: function(){return this.string.slice(this.start, this.pos);}                                               // 3414
  };                                                                                                                   // 3415
  CodeMirror.StringStream = StringStream;                                                                              // 3416
                                                                                                                       // 3417
  // TEXTMARKERS                                                                                                       // 3418
                                                                                                                       // 3419
  function TextMarker(doc, type) {                                                                                     // 3420
    this.lines = [];                                                                                                   // 3421
    this.type = type;                                                                                                  // 3422
    this.doc = doc;                                                                                                    // 3423
  }                                                                                                                    // 3424
  CodeMirror.TextMarker = TextMarker;                                                                                  // 3425
                                                                                                                       // 3426
  TextMarker.prototype.clear = function() {                                                                            // 3427
    if (this.explicitlyCleared) return;                                                                                // 3428
    var cm = this.doc.cm, withOp = cm && !cm.curOp;                                                                    // 3429
    if (withOp) startOperation(cm);                                                                                    // 3430
    var min = null, max = null;                                                                                        // 3431
    for (var i = 0; i < this.lines.length; ++i) {                                                                      // 3432
      var line = this.lines[i];                                                                                        // 3433
      var span = getMarkedSpanFor(line.markedSpans, this);                                                             // 3434
      if (span.to != null) max = lineNo(line);                                                                         // 3435
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);                                                     // 3436
      if (span.from != null)                                                                                           // 3437
        min = lineNo(line);                                                                                            // 3438
      else if (this.collapsed && !lineIsHidden(this.doc, line) && cm)                                                  // 3439
        updateLineHeight(line, textHeight(cm.display));                                                                // 3440
    }                                                                                                                  // 3441
    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {                // 3442
      var visual = visualLine(cm.doc, this.lines[i]), len = lineLength(cm.doc, visual);                                // 3443
      if (len > cm.display.maxLineLength) {                                                                            // 3444
        cm.display.maxLine = visual;                                                                                   // 3445
        cm.display.maxLineLength = len;                                                                                // 3446
        cm.display.maxLineChanged = true;                                                                              // 3447
      }                                                                                                                // 3448
    }                                                                                                                  // 3449
                                                                                                                       // 3450
    if (min != null && cm) regChange(cm, min, max + 1);                                                                // 3451
    this.lines.length = 0;                                                                                             // 3452
    this.explicitlyCleared = true;                                                                                     // 3453
    if (this.collapsed && this.doc.cantEdit) {                                                                         // 3454
      this.doc.cantEdit = false;                                                                                       // 3455
      if (cm) reCheckSelection(cm);                                                                                    // 3456
    }                                                                                                                  // 3457
    if (withOp) endOperation(cm);                                                                                      // 3458
    signalLater(this, "clear");                                                                                        // 3459
  };                                                                                                                   // 3460
                                                                                                                       // 3461
  TextMarker.prototype.find = function() {                                                                             // 3462
    var from, to;                                                                                                      // 3463
    for (var i = 0; i < this.lines.length; ++i) {                                                                      // 3464
      var line = this.lines[i];                                                                                        // 3465
      var span = getMarkedSpanFor(line.markedSpans, this);                                                             // 3466
      if (span.from != null || span.to != null) {                                                                      // 3467
        var found = lineNo(line);                                                                                      // 3468
        if (span.from != null) from = Pos(found, span.from);                                                           // 3469
        if (span.to != null) to = Pos(found, span.to);                                                                 // 3470
      }                                                                                                                // 3471
    }                                                                                                                  // 3472
    if (this.type == "bookmark") return from;                                                                          // 3473
    return from && {from: from, to: to};                                                                               // 3474
  };                                                                                                                   // 3475
                                                                                                                       // 3476
  TextMarker.prototype.getOptions = function(copyWidget) {                                                             // 3477
    var repl = this.replacedWith;                                                                                      // 3478
    return {className: this.className,                                                                                 // 3479
            inclusiveLeft: this.inclusiveLeft, inclusiveRight: this.inclusiveRight,                                    // 3480
            atomic: this.atomic,                                                                                       // 3481
            collapsed: this.collapsed,                                                                                 // 3482
            clearOnEnter: this.clearOnEnter,                                                                           // 3483
            replacedWith: copyWidget ? repl && repl.cloneNode(true) : repl,                                            // 3484
            readOnly: this.readOnly,                                                                                   // 3485
            startStyle: this.startStyle, endStyle: this.endStyle};                                                     // 3486
  };                                                                                                                   // 3487
                                                                                                                       // 3488
  TextMarker.prototype.attachLine = function(line) {                                                                   // 3489
    if (!this.lines.length && this.doc.cm) {                                                                           // 3490
      var op = this.doc.cm.curOp;                                                                                      // 3491
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)                                        // 3492
        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);                                        // 3493
    }                                                                                                                  // 3494
    this.lines.push(line);                                                                                             // 3495
  };                                                                                                                   // 3496
  TextMarker.prototype.detachLine = function(line) {                                                                   // 3497
    this.lines.splice(indexOf(this.lines, line), 1);                                                                   // 3498
    if (!this.lines.length && this.doc.cm) {                                                                           // 3499
      var op = this.doc.cm.curOp;                                                                                      // 3500
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);                                              // 3501
    }                                                                                                                  // 3502
  };                                                                                                                   // 3503
                                                                                                                       // 3504
  function markText(doc, from, to, options, type) {                                                                    // 3505
    if (options && options.shared) return markTextShared(doc, from, to, options, type);                                // 3506
    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);                     // 3507
                                                                                                                       // 3508
    var marker = new TextMarker(doc, type);                                                                            // 3509
    if (type == "range" && !posLess(from, to)) return marker;                                                          // 3510
    if (options) copyObj(options, marker);                                                                             // 3511
    if (marker.replacedWith) {                                                                                         // 3512
      marker.collapsed = true;                                                                                         // 3513
      marker.replacedWith = elt("span", [marker.replacedWith], "CodeMirror-widget");                                   // 3514
    }                                                                                                                  // 3515
    if (marker.collapsed) sawCollapsedSpans = true;                                                                    // 3516
                                                                                                                       // 3517
    var curLine = from.line, size = 0, collapsedAtStart, collapsedAtEnd, cm = doc.cm, updateMaxLine;                   // 3518
    doc.iter(curLine, to.line + 1, function(line) {                                                                    // 3519
      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(doc, line) == cm.display.maxLine)           // 3520
        updateMaxLine = true;                                                                                          // 3521
      var span = {from: null, to: null, marker: marker};                                                               // 3522
      size += line.text.length;                                                                                        // 3523
      if (curLine == from.line) {span.from = from.ch; size -= from.ch;}                                                // 3524
      if (curLine == to.line) {span.to = to.ch; size -= line.text.length - to.ch;}                                     // 3525
      if (marker.collapsed) {                                                                                          // 3526
        if (curLine == to.line) collapsedAtEnd = collapsedSpanAt(line, to.ch);                                         // 3527
        if (curLine == from.line) collapsedAtStart = collapsedSpanAt(line, from.ch);                                   // 3528
        else updateLineHeight(line, 0);                                                                                // 3529
      }                                                                                                                // 3530
      addMarkedSpan(line, span);                                                                                       // 3531
      ++curLine;                                                                                                       // 3532
    });                                                                                                                // 3533
    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {                                            // 3534
      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);                                                          // 3535
    });                                                                                                                // 3536
                                                                                                                       // 3537
    if (marker.readOnly) {                                                                                             // 3538
      sawReadOnlySpans = true;                                                                                         // 3539
      if (doc.history.done.length || doc.history.undone.length)                                                        // 3540
        doc.clearHistory();                                                                                            // 3541
    }                                                                                                                  // 3542
    if (marker.collapsed) {                                                                                            // 3543
      if (collapsedAtStart != collapsedAtEnd)                                                                          // 3544
        throw new Error("Inserting collapsed marker overlapping an existing one");                                     // 3545
      marker.size = size;                                                                                              // 3546
      marker.atomic = true;                                                                                            // 3547
    }                                                                                                                  // 3548
    if (cm) {                                                                                                          // 3549
      if (updateMaxLine) cm.curOp.updateMaxLine = true;                                                                // 3550
      if (marker.className || marker.startStyle || marker.endStyle || marker.collapsed)                                // 3551
        regChange(cm, from.line, to.line + 1);                                                                         // 3552
      if (marker.atomic) reCheckSelection(cm);                                                                         // 3553
    }                                                                                                                  // 3554
    return marker;                                                                                                     // 3555
  }                                                                                                                    // 3556
                                                                                                                       // 3557
  // SHARED TEXTMARKERS                                                                                                // 3558
                                                                                                                       // 3559
  function SharedTextMarker(markers, primary) {                                                                        // 3560
    this.markers = markers;                                                                                            // 3561
    this.primary = primary;                                                                                            // 3562
    for (var i = 0, me = this; i < markers.length; ++i) {                                                              // 3563
      markers[i].parent = this;                                                                                        // 3564
      on(markers[i], "clear", function(){me.clear();});                                                                // 3565
    }                                                                                                                  // 3566
  }                                                                                                                    // 3567
  CodeMirror.SharedTextMarker = SharedTextMarker;                                                                      // 3568
                                                                                                                       // 3569
  SharedTextMarker.prototype.clear = function() {                                                                      // 3570
    if (this.explicitlyCleared) return;                                                                                // 3571
    this.explicitlyCleared = true;                                                                                     // 3572
    for (var i = 0; i < this.markers.length; ++i)                                                                      // 3573
      this.markers[i].clear();                                                                                         // 3574
    signalLater(this, "clear");                                                                                        // 3575
  };                                                                                                                   // 3576
  SharedTextMarker.prototype.find = function() {                                                                       // 3577
    return this.primary.find();                                                                                        // 3578
  };                                                                                                                   // 3579
  SharedTextMarker.prototype.getOptions = function(copyWidget) {                                                       // 3580
    var inner = this.primary.getOptions(copyWidget);                                                                   // 3581
    inner.shared = true;                                                                                               // 3582
    return inner;                                                                                                      // 3583
  };                                                                                                                   // 3584
                                                                                                                       // 3585
  function markTextShared(doc, from, to, options, type) {                                                              // 3586
    options = copyObj(options);                                                                                        // 3587
    options.shared = false;                                                                                            // 3588
    var markers = [markText(doc, from, to, options, type)], primary = markers[0];                                      // 3589
    var widget = options.replacedWith;                                                                                 // 3590
    linkedDocs(doc, function(doc) {                                                                                    // 3591
      if (widget) options.replacedWith = widget.cloneNode(true);                                                       // 3592
      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));                                // 3593
      for (var i = 0; i < doc.linked.length; ++i)                                                                      // 3594
        if (doc.linked[i].isParent) return;                                                                            // 3595
      primary = lst(markers);                                                                                          // 3596
    });                                                                                                                // 3597
    return new SharedTextMarker(markers, primary);                                                                     // 3598
  }                                                                                                                    // 3599
                                                                                                                       // 3600
  // TEXTMARKER SPANS                                                                                                  // 3601
                                                                                                                       // 3602
  function getMarkedSpanFor(spans, marker) {                                                                           // 3603
    if (spans) for (var i = 0; i < spans.length; ++i) {                                                                // 3604
      var span = spans[i];                                                                                             // 3605
      if (span.marker == marker) return span;                                                                          // 3606
    }                                                                                                                  // 3607
  }                                                                                                                    // 3608
  function removeMarkedSpan(spans, span) {                                                                             // 3609
    for (var r, i = 0; i < spans.length; ++i)                                                                          // 3610
      if (spans[i] != span) (r || (r = [])).push(spans[i]);                                                            // 3611
    return r;                                                                                                          // 3612
  }                                                                                                                    // 3613
  function addMarkedSpan(line, span) {                                                                                 // 3614
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];                                    // 3615
    span.marker.attachLine(line);                                                                                      // 3616
  }                                                                                                                    // 3617
                                                                                                                       // 3618
  function markedSpansBefore(old, startCh, isInsert) {                                                                 // 3619
    if (old) for (var i = 0, nw; i < old.length; ++i) {                                                                // 3620
      var span = old[i], marker = span.marker;                                                                         // 3621
      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);     // 3622
      if (startsBefore || marker.type == "bookmark" && span.from == startCh && (!isInsert || !span.marker.insertLeft)) {
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);           // 3624
        (nw || (nw = [])).push({from: span.from,                                                                       // 3625
                                to: endsAfter ? null : span.to,                                                        // 3626
                                marker: marker});                                                                      // 3627
      }                                                                                                                // 3628
    }                                                                                                                  // 3629
    return nw;                                                                                                         // 3630
  }                                                                                                                    // 3631
                                                                                                                       // 3632
  function markedSpansAfter(old, endCh, isInsert) {                                                                    // 3633
    if (old) for (var i = 0, nw; i < old.length; ++i) {                                                                // 3634
      var span = old[i], marker = span.marker;                                                                         // 3635
      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);                 // 3636
      if (endsAfter || marker.type == "bookmark" && span.from == endCh && (!isInsert || span.marker.insertLeft)) {     // 3637
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);       // 3638
        (nw || (nw = [])).push({from: startsBefore ? null : span.from - endCh,                                         // 3639
                                to: span.to == null ? null : span.to - endCh,                                          // 3640
                                marker: marker});                                                                      // 3641
      }                                                                                                                // 3642
    }                                                                                                                  // 3643
    return nw;                                                                                                         // 3644
  }                                                                                                                    // 3645
                                                                                                                       // 3646
  function stretchSpansOverChange(doc, change) {                                                                       // 3647
    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;                        // 3648
    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;                             // 3649
    if (!oldFirst && !oldLast) return null;                                                                            // 3650
                                                                                                                       // 3651
    var startCh = change.from.ch, endCh = change.to.ch, isInsert = posEq(change.from, change.to);                      // 3652
    // Get the spans that 'stick out' on both sides                                                                    // 3653
    var first = markedSpansBefore(oldFirst, startCh, isInsert);                                                        // 3654
    var last = markedSpansAfter(oldLast, endCh, isInsert);                                                             // 3655
                                                                                                                       // 3656
    // Next, merge those two ends                                                                                      // 3657
    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);               // 3658
    if (first) {                                                                                                       // 3659
      // Fix up .to properties of first                                                                                // 3660
      for (var i = 0; i < first.length; ++i) {                                                                         // 3661
        var span = first[i];                                                                                           // 3662
        if (span.to == null) {                                                                                         // 3663
          var found = getMarkedSpanFor(last, span.marker);                                                             // 3664
          if (!found) span.to = startCh;                                                                               // 3665
          else if (sameLine) span.to = found.to == null ? null : found.to + offset;                                    // 3666
        }                                                                                                              // 3667
      }                                                                                                                // 3668
    }                                                                                                                  // 3669
    if (last) {                                                                                                        // 3670
      // Fix up .from in last (or move them into first in case of sameLine)                                            // 3671
      for (var i = 0; i < last.length; ++i) {                                                                          // 3672
        var span = last[i];                                                                                            // 3673
        if (span.to != null) span.to += offset;                                                                        // 3674
        if (span.from == null) {                                                                                       // 3675
          var found = getMarkedSpanFor(first, span.marker);                                                            // 3676
          if (!found) {                                                                                                // 3677
            span.from = offset;                                                                                        // 3678
            if (sameLine) (first || (first = [])).push(span);                                                          // 3679
          }                                                                                                            // 3680
        } else {                                                                                                       // 3681
          span.from += offset;                                                                                         // 3682
          if (sameLine) (first || (first = [])).push(span);                                                            // 3683
        }                                                                                                              // 3684
      }                                                                                                                // 3685
    }                                                                                                                  // 3686
                                                                                                                       // 3687
    var newMarkers = [first];                                                                                          // 3688
    if (!sameLine) {                                                                                                   // 3689
      // Fill gap with whole-line-spans                                                                                // 3690
      var gap = change.text.length - 2, gapMarkers;                                                                    // 3691
      if (gap > 0 && first)                                                                                            // 3692
        for (var i = 0; i < first.length; ++i)                                                                         // 3693
          if (first[i].to == null)                                                                                     // 3694
            (gapMarkers || (gapMarkers = [])).push({from: null, to: null, marker: first[i].marker});                   // 3695
      for (var i = 0; i < gap; ++i)                                                                                    // 3696
        newMarkers.push(gapMarkers);                                                                                   // 3697
      newMarkers.push(last);                                                                                           // 3698
    }                                                                                                                  // 3699
    return newMarkers;                                                                                                 // 3700
  }                                                                                                                    // 3701
                                                                                                                       // 3702
  function mergeOldSpans(doc, change) {                                                                                // 3703
    var old = getOldSpans(doc, change);                                                                                // 3704
    var stretched = stretchSpansOverChange(doc, change);                                                               // 3705
    if (!old) return stretched;                                                                                        // 3706
    if (!stretched) return old;                                                                                        // 3707
                                                                                                                       // 3708
    for (var i = 0; i < old.length; ++i) {                                                                             // 3709
      var oldCur = old[i], stretchCur = stretched[i];                                                                  // 3710
      if (oldCur && stretchCur) {                                                                                      // 3711
        spans: for (var j = 0; j < stretchCur.length; ++j) {                                                           // 3712
          var span = stretchCur[j];                                                                                    // 3713
          for (var k = 0; k < oldCur.length; ++k)                                                                      // 3714
            if (oldCur[k].marker == span.marker) continue spans;                                                       // 3715
          oldCur.push(span);                                                                                           // 3716
        }                                                                                                              // 3717
      } else if (stretchCur) {                                                                                         // 3718
        old[i] = stretchCur;                                                                                           // 3719
      }                                                                                                                // 3720
    }                                                                                                                  // 3721
    return old;                                                                                                        // 3722
  }                                                                                                                    // 3723
                                                                                                                       // 3724
  function removeReadOnlyRanges(doc, from, to) {                                                                       // 3725
    var markers = null;                                                                                                // 3726
    doc.iter(from.line, to.line + 1, function(line) {                                                                  // 3727
      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {                                        // 3728
        var mark = line.markedSpans[i].marker;                                                                         // 3729
        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))                                               // 3730
          (markers || (markers = [])).push(mark);                                                                      // 3731
      }                                                                                                                // 3732
    });                                                                                                                // 3733
    if (!markers) return null;                                                                                         // 3734
    var parts = [{from: from, to: to}];                                                                                // 3735
    for (var i = 0; i < markers.length; ++i) {                                                                         // 3736
      var mk = markers[i], m = mk.find();                                                                              // 3737
      for (var j = 0; j < parts.length; ++j) {                                                                         // 3738
        var p = parts[j];                                                                                              // 3739
        if (posLess(p.to, m.from) || posLess(m.to, p.from)) continue;                                                  // 3740
        var newParts = [j, 1];                                                                                         // 3741
        if (posLess(p.from, m.from) || !mk.inclusiveLeft && posEq(p.from, m.from))                                     // 3742
          newParts.push({from: p.from, to: m.from});                                                                   // 3743
        if (posLess(m.to, p.to) || !mk.inclusiveRight && posEq(p.to, m.to))                                            // 3744
          newParts.push({from: m.to, to: p.to});                                                                       // 3745
        parts.splice.apply(parts, newParts);                                                                           // 3746
        j += newParts.length - 1;                                                                                      // 3747
      }                                                                                                                // 3748
    }                                                                                                                  // 3749
    return parts;                                                                                                      // 3750
  }                                                                                                                    // 3751
                                                                                                                       // 3752
  function collapsedSpanAt(line, ch) {                                                                                 // 3753
    var sps = sawCollapsedSpans && line.markedSpans, found;                                                            // 3754
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {                                                                // 3755
      sp = sps[i];                                                                                                     // 3756
      if (!sp.marker.collapsed) continue;                                                                              // 3757
      if ((sp.from == null || sp.from < ch) &&                                                                         // 3758
          (sp.to == null || sp.to > ch) &&                                                                             // 3759
          (!found || found.width < sp.marker.width))                                                                   // 3760
        found = sp.marker;                                                                                             // 3761
    }                                                                                                                  // 3762
    return found;                                                                                                      // 3763
  }                                                                                                                    // 3764
  function collapsedSpanAtStart(line) { return collapsedSpanAt(line, -1); }                                            // 3765
  function collapsedSpanAtEnd(line) { return collapsedSpanAt(line, line.text.length + 1); }                            // 3766
                                                                                                                       // 3767
  function visualLine(doc, line) {                                                                                     // 3768
    var merged;                                                                                                        // 3769
    while (merged = collapsedSpanAtStart(line))                                                                        // 3770
      line = getLine(doc, merged.find().from.line);                                                                    // 3771
    return line;                                                                                                       // 3772
  }                                                                                                                    // 3773
                                                                                                                       // 3774
  function lineIsHidden(doc, line) {                                                                                   // 3775
    var sps = sawCollapsedSpans && line.markedSpans;                                                                   // 3776
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {                                                                // 3777
      sp = sps[i];                                                                                                     // 3778
      if (!sp.marker.collapsed) continue;                                                                              // 3779
      if (sp.from == null) return true;                                                                                // 3780
      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))                                 // 3781
        return true;                                                                                                   // 3782
    }                                                                                                                  // 3783
  }                                                                                                                    // 3784
  function lineIsHiddenInner(doc, line, span) {                                                                        // 3785
    if (span.to == null) {                                                                                             // 3786
      var end = span.marker.find().to, endLine = getLine(doc, end.line);                                               // 3787
      return lineIsHiddenInner(doc, endLine, getMarkedSpanFor(endLine.markedSpans, span.marker));                      // 3788
    }                                                                                                                  // 3789
    if (span.marker.inclusiveRight && span.to == line.text.length)                                                     // 3790
      return true;                                                                                                     // 3791
    for (var sp, i = 0; i < line.markedSpans.length; ++i) {                                                            // 3792
      sp = line.markedSpans[i];                                                                                        // 3793
      if (sp.marker.collapsed && sp.from == span.to &&                                                                 // 3794
          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&                                                   // 3795
          lineIsHiddenInner(doc, line, sp)) return true;                                                               // 3796
    }                                                                                                                  // 3797
  }                                                                                                                    // 3798
                                                                                                                       // 3799
  function detachMarkedSpans(line) {                                                                                   // 3800
    var spans = line.markedSpans;                                                                                      // 3801
    if (!spans) return;                                                                                                // 3802
    for (var i = 0; i < spans.length; ++i)                                                                             // 3803
      spans[i].marker.detachLine(line);                                                                                // 3804
    line.markedSpans = null;                                                                                           // 3805
  }                                                                                                                    // 3806
                                                                                                                       // 3807
  function attachMarkedSpans(line, spans) {                                                                            // 3808
    if (!spans) return;                                                                                                // 3809
    for (var i = 0; i < spans.length; ++i)                                                                             // 3810
      spans[i].marker.attachLine(line);                                                                                // 3811
    line.markedSpans = spans;                                                                                          // 3812
  }                                                                                                                    // 3813
                                                                                                                       // 3814
  // LINE WIDGETS                                                                                                      // 3815
                                                                                                                       // 3816
  var LineWidget = CodeMirror.LineWidget = function(cm, node, options) {                                               // 3817
    for (var opt in options) if (options.hasOwnProperty(opt))                                                          // 3818
      this[opt] = options[opt];                                                                                        // 3819
    this.cm = cm;                                                                                                      // 3820
    this.node = node;                                                                                                  // 3821
  };                                                                                                                   // 3822
  function widgetOperation(f) {                                                                                        // 3823
    return function() {                                                                                                // 3824
      var withOp = !this.cm.curOp;                                                                                     // 3825
      if (withOp) startOperation(this.cm);                                                                             // 3826
      try {var result = f.apply(this, arguments);}                                                                     // 3827
      finally {if (withOp) endOperation(this.cm);}                                                                     // 3828
      return result;                                                                                                   // 3829
    };                                                                                                                 // 3830
  }                                                                                                                    // 3831
  LineWidget.prototype.clear = widgetOperation(function() {                                                            // 3832
    var ws = this.line.widgets, no = lineNo(this.line);                                                                // 3833
    if (no == null || !ws) return;                                                                                     // 3834
    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);                                          // 3835
    if (!ws.length) this.line.widgets = null;                                                                          // 3836
    updateLineHeight(this.line, Math.max(0, this.line.height - widgetHeight(this)));                                   // 3837
    regChange(this.cm, no, no + 1);                                                                                    // 3838
  });                                                                                                                  // 3839
  LineWidget.prototype.changed = widgetOperation(function() {                                                          // 3840
    var oldH = this.height;                                                                                            // 3841
    this.height = null;                                                                                                // 3842
    var diff = widgetHeight(this) - oldH;                                                                              // 3843
    if (!diff) return;                                                                                                 // 3844
    updateLineHeight(this.line, this.line.height + diff);                                                              // 3845
    var no = lineNo(this.line);                                                                                        // 3846
    regChange(this.cm, no, no + 1);                                                                                    // 3847
  });                                                                                                                  // 3848
                                                                                                                       // 3849
  function widgetHeight(widget) {                                                                                      // 3850
    if (widget.height != null) return widget.height;                                                                   // 3851
    if (!widget.node.parentNode || widget.node.parentNode.nodeType != 1)                                               // 3852
      removeChildrenAndAdd(widget.cm.display.measure, elt("div", [widget.node], null, "position: relative"));          // 3853
    return widget.height = widget.node.offsetHeight;                                                                   // 3854
  }                                                                                                                    // 3855
                                                                                                                       // 3856
  function addLineWidget(cm, handle, node, options) {                                                                  // 3857
    var widget = new LineWidget(cm, node, options);                                                                    // 3858
    if (widget.noHScroll) cm.display.alignWidgets = true;                                                              // 3859
    changeLine(cm, handle, function(line) {                                                                            // 3860
      (line.widgets || (line.widgets = [])).push(widget);                                                              // 3861
      widget.line = line;                                                                                              // 3862
      if (!lineIsHidden(cm.doc, line) || widget.showIfHidden) {                                                        // 3863
        var aboveVisible = heightAtLine(cm, line) < cm.display.scroller.scrollTop;                                     // 3864
        updateLineHeight(line, line.height + widgetHeight(widget));                                                    // 3865
        if (aboveVisible) addToScrollPos(cm, 0, widget.height);                                                        // 3866
      }                                                                                                                // 3867
      return true;                                                                                                     // 3868
    });                                                                                                                // 3869
    return widget;                                                                                                     // 3870
  }                                                                                                                    // 3871
                                                                                                                       // 3872
  // LINE DATA STRUCTURE                                                                                               // 3873
                                                                                                                       // 3874
  // Line objects. These hold state related to a line, including                                                       // 3875
  // highlighting info (the styles array).                                                                             // 3876
  function makeLine(text, markedSpans, estimateHeight) {                                                               // 3877
    var line = {text: text};                                                                                           // 3878
    attachMarkedSpans(line, markedSpans);                                                                              // 3879
    line.height = estimateHeight ? estimateHeight(line) : 1;                                                           // 3880
    return line;                                                                                                       // 3881
  }                                                                                                                    // 3882
                                                                                                                       // 3883
  function updateLine(line, text, markedSpans, estimateHeight) {                                                       // 3884
    line.text = text;                                                                                                  // 3885
    if (line.stateAfter) line.stateAfter = null;                                                                       // 3886
    if (line.styles) line.styles = null;                                                                               // 3887
    if (line.order != null) line.order = null;                                                                         // 3888
    detachMarkedSpans(line);                                                                                           // 3889
    attachMarkedSpans(line, markedSpans);                                                                              // 3890
    var estHeight = estimateHeight ? estimateHeight(line) : 1;                                                         // 3891
    if (estHeight != line.height) updateLineHeight(line, estHeight);                                                   // 3892
    signalLater(line, "change");                                                                                       // 3893
  }                                                                                                                    // 3894
                                                                                                                       // 3895
  function cleanUpLine(line) {                                                                                         // 3896
    line.parent = null;                                                                                                // 3897
    detachMarkedSpans(line);                                                                                           // 3898
  }                                                                                                                    // 3899
                                                                                                                       // 3900
  // Run the given mode's parser over a line, update the styles                                                        // 3901
  // array, which contains alternating fragments of text and CSS                                                       // 3902
  // classes.                                                                                                          // 3903
  function runMode(cm, text, mode, state, f) {                                                                         // 3904
    var flattenSpans = mode.flattenSpans;                                                                              // 3905
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;                                                  // 3906
    var curText = "", curStyle = null;                                                                                 // 3907
    var stream = new StringStream(text, cm.options.tabSize);                                                           // 3908
    if (text == "" && mode.blankLine) mode.blankLine(state);                                                           // 3909
    while (!stream.eol()) {                                                                                            // 3910
      var style = mode.token(stream, state);                                                                           // 3911
      if (stream.pos > 5000) {                                                                                         // 3912
        flattenSpans = false;                                                                                          // 3913
        // Webkit seems to refuse to render text nodes longer than 57444 characters                                    // 3914
        stream.pos = Math.min(text.length, stream.start + 50000);                                                      // 3915
        style = null;                                                                                                  // 3916
      }                                                                                                                // 3917
      var substr = stream.current();                                                                                   // 3918
      stream.start = stream.pos;                                                                                       // 3919
      if (!flattenSpans || curStyle != style) {                                                                        // 3920
        if (curText) f(curText, curStyle);                                                                             // 3921
        curText = substr; curStyle = style;                                                                            // 3922
      } else curText = curText + substr;                                                                               // 3923
    }                                                                                                                  // 3924
    if (curText) f(curText, curStyle);                                                                                 // 3925
  }                                                                                                                    // 3926
                                                                                                                       // 3927
  function highlightLine(cm, line, state) {                                                                            // 3928
    // A styles array always starts with a number identifying the                                                      // 3929
    // mode/overlays that it is based on (for easy invalidation).                                                      // 3930
    var st = [cm.state.modeGen];                                                                                       // 3931
    // Compute the base array of styles                                                                                // 3932
    runMode(cm, line.text, cm.doc.mode, state, function(txt, style) {st.push(txt, style);});                           // 3933
                                                                                                                       // 3934
    // Run overlays, adjust style array.                                                                               // 3935
    for (var o = 0; o < cm.state.overlays.length; ++o) {                                                               // 3936
      var overlay = cm.state.overlays[o], i = 1;                                                                       // 3937
      runMode(cm, line.text, overlay.mode, true, function(txt, style) {                                                // 3938
        var start = i, len = txt.length;                                                                               // 3939
        // Ensure there's a token end at the current position, and that i points at it                                 // 3940
        while (len) {                                                                                                  // 3941
          var cur = st[i], len_ = cur.length;                                                                          // 3942
          if (len_ <= len) {                                                                                           // 3943
            len -= len_;                                                                                               // 3944
          } else {                                                                                                     // 3945
            st.splice(i, 1, cur.slice(0, len), st[i+1], cur.slice(len));                                               // 3946
            len = 0;                                                                                                   // 3947
          }                                                                                                            // 3948
          i += 2;                                                                                                      // 3949
        }                                                                                                              // 3950
        if (!style) return;                                                                                            // 3951
        if (overlay.opaque) {                                                                                          // 3952
          st.splice(start, i - start, txt, style);                                                                     // 3953
          i = start + 2;                                                                                               // 3954
        } else {                                                                                                       // 3955
          for (; start < i; start += 2) {                                                                              // 3956
            var cur = st[start+1];                                                                                     // 3957
            st[start+1] = cur ? cur + " " + style : style;                                                             // 3958
          }                                                                                                            // 3959
        }                                                                                                              // 3960
      });                                                                                                              // 3961
    }                                                                                                                  // 3962
                                                                                                                       // 3963
    return st;                                                                                                         // 3964
  }                                                                                                                    // 3965
                                                                                                                       // 3966
  function getLineStyles(cm, line) {                                                                                   // 3967
    if (!line.styles || line.styles[0] != cm.state.modeGen)                                                            // 3968
      line.styles = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));                       // 3969
    return line.styles;                                                                                                // 3970
  }                                                                                                                    // 3971
                                                                                                                       // 3972
  // Lightweight form of highlight -- proceed over this line and                                                       // 3973
  // update state, but don't save a style array.                                                                       // 3974
  function processLine(cm, line, state) {                                                                              // 3975
    var mode = cm.doc.mode;                                                                                            // 3976
    var stream = new StringStream(line.text, cm.options.tabSize);                                                      // 3977
    if (line.text == "" && mode.blankLine) mode.blankLine(state);                                                      // 3978
    while (!stream.eol() && stream.pos <= 5000) {                                                                      // 3979
      mode.token(stream, state);                                                                                       // 3980
      stream.start = stream.pos;                                                                                       // 3981
    }                                                                                                                  // 3982
  }                                                                                                                    // 3983
                                                                                                                       // 3984
  var styleToClassCache = {};                                                                                          // 3985
  function styleToClass(style) {                                                                                       // 3986
    if (!style) return null;                                                                                           // 3987
    return styleToClassCache[style] ||                                                                                 // 3988
      (styleToClassCache[style] = "cm-" + style.replace(/ +/g, " cm-"));                                               // 3989
  }                                                                                                                    // 3990
                                                                                                                       // 3991
  function lineContent(cm, realLine, measure) {                                                                        // 3992
    var merged, line = realLine, lineBefore, sawBefore, simple = true;                                                 // 3993
    while (merged = collapsedSpanAtStart(line)) {                                                                      // 3994
      simple = false;                                                                                                  // 3995
      line = getLine(cm.doc, merged.find().from.line);                                                                 // 3996
      if (!lineBefore) lineBefore = line;                                                                              // 3997
    }                                                                                                                  // 3998
                                                                                                                       // 3999
    var builder = {pre: elt("pre"), col: 0, pos: 0, display: !measure,                                                 // 4000
                   measure: null, addedOne: false, cm: cm};                                                            // 4001
    if (line.textClass) builder.pre.className = line.textClass;                                                        // 4002
                                                                                                                       // 4003
    do {                                                                                                               // 4004
      builder.measure = line == realLine && measure;                                                                   // 4005
      builder.pos = 0;                                                                                                 // 4006
      builder.addToken = builder.measure ? buildTokenMeasure : buildToken;                                             // 4007
      if (measure && sawBefore && line != realLine && !builder.addedOne) {                                             // 4008
        measure[0] = builder.pre.appendChild(zeroWidthElement(cm.display.measure));                                    // 4009
        builder.addedOne = true;                                                                                       // 4010
      }                                                                                                                // 4011
      var next = insertLineContent(line, builder, getLineStyles(cm, line));                                            // 4012
      sawBefore = line == lineBefore;                                                                                  // 4013
      if (next) {                                                                                                      // 4014
        line = getLine(cm.doc, next.to.line);                                                                          // 4015
        simple = false;                                                                                                // 4016
      }                                                                                                                // 4017
    } while (next);                                                                                                    // 4018
                                                                                                                       // 4019
    if (measure && !builder.addedOne)                                                                                  // 4020
      measure[0] = builder.pre.appendChild(simple ? elt("span", "\u00a0") : zeroWidthElement(cm.display.measure));     // 4021
    if (!builder.pre.firstChild && !lineIsHidden(cm.doc, realLine))                                                    // 4022
      builder.pre.appendChild(document.createTextNode("\u00a0"));                                                      // 4023
                                                                                                                       // 4024
    var order;                                                                                                         // 4025
    // Work around problem with the reported dimensions of single-char                                                 // 4026
    // direction spans on IE (issue #1129). See also the comment in                                                    // 4027
    // cursorCoords.                                                                                                   // 4028
    if (measure && ie && (order = getOrder(line))) {                                                                   // 4029
      var l = order.length - 1;                                                                                        // 4030
      if (order[l].from == order[l].to) --l;                                                                           // 4031
      var last = order[l], prev = order[l - 1];                                                                        // 4032
      if (last.from + 1 == last.to && prev && last.level < prev.level) {                                               // 4033
        var span = measure[builder.pos - 1];                                                                           // 4034
        if (span) span.parentNode.insertBefore(span.measureRight = zeroWidthElement(cm.display.measure),               // 4035
                                               span.nextSibling);                                                      // 4036
      }                                                                                                                // 4037
    }                                                                                                                  // 4038
                                                                                                                       // 4039
    return builder.pre;                                                                                                // 4040
  }                                                                                                                    // 4041
                                                                                                                       // 4042
  var tokenSpecialChars = /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\uFEFF]/g;                                          // 4043
  function buildToken(builder, text, style, startStyle, endStyle) {                                                    // 4044
    if (!text) return;                                                                                                 // 4045
    if (!tokenSpecialChars.test(text)) {                                                                               // 4046
      builder.col += text.length;                                                                                      // 4047
      var content = document.createTextNode(text);                                                                     // 4048
    } else {                                                                                                           // 4049
      var content = document.createDocumentFragment(), pos = 0;                                                        // 4050
      while (true) {                                                                                                   // 4051
        tokenSpecialChars.lastIndex = pos;                                                                             // 4052
        var m = tokenSpecialChars.exec(text);                                                                          // 4053
        var skipped = m ? m.index - pos : text.length - pos;                                                           // 4054
        if (skipped) {                                                                                                 // 4055
          content.appendChild(document.createTextNode(text.slice(pos, pos + skipped)));                                // 4056
          builder.col += skipped;                                                                                      // 4057
        }                                                                                                              // 4058
        if (!m) break;                                                                                                 // 4059
        pos += skipped + 1;                                                                                            // 4060
        if (m[0] == "\t") {                                                                                            // 4061
          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;                        // 4062
          content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));                                              // 4063
          builder.col += tabWidth;                                                                                     // 4064
        } else {                                                                                                       // 4065
          var token = elt("span", "\u2022", "cm-invalidchar");                                                         // 4066
          token.title = "\\u" + m[0].charCodeAt(0).toString(16);                                                       // 4067
          content.appendChild(token);                                                                                  // 4068
          builder.col += 1;                                                                                            // 4069
        }                                                                                                              // 4070
      }                                                                                                                // 4071
    }                                                                                                                  // 4072
    if (style || startStyle || endStyle || builder.measure) {                                                          // 4073
      var fullStyle = style || "";                                                                                     // 4074
      if (startStyle) fullStyle += startStyle;                                                                         // 4075
      if (endStyle) fullStyle += endStyle;                                                                             // 4076
      return builder.pre.appendChild(elt("span", [content], fullStyle));                                               // 4077
    }                                                                                                                  // 4078
    builder.pre.appendChild(content);                                                                                  // 4079
  }                                                                                                                    // 4080
                                                                                                                       // 4081
  function buildTokenMeasure(builder, text, style, startStyle, endStyle) {                                             // 4082
    var wrapping = builder.cm.options.lineWrapping;                                                                    // 4083
    for (var i = 0; i < text.length; ++i) {                                                                            // 4084
      var ch = text.charAt(i), start = i == 0;                                                                         // 4085
      if (ch >= "\ud800" && ch < "\udbff" && i < text.length - 1) {                                                    // 4086
        ch = text.slice(i, i + 2);                                                                                     // 4087
        ++i;                                                                                                           // 4088
      } else if (i && wrapping &&                                                                                      // 4089
                 spanAffectsWrapping.test(text.slice(i - 1, i + 1))) {                                                 // 4090
        builder.pre.appendChild(elt("wbr"));                                                                           // 4091
      }                                                                                                                // 4092
      var span = builder.measure[builder.pos] =                                                                        // 4093
        buildToken(builder, ch, style,                                                                                 // 4094
                   start && startStyle, i == text.length - 1 && endStyle);                                             // 4095
      // In IE single-space nodes wrap differently than spaces                                                         // 4096
      // embedded in larger text nodes, except when set to                                                             // 4097
      // white-space: normal (issue #1268).                                                                            // 4098
      if (ie && wrapping && ch == " " && i && !/\s/.test(text.charAt(i - 1)) &&                                        // 4099
          i < text.length - 1 && !/\s/.test(text.charAt(i + 1)))                                                       // 4100
        span.style.whiteSpace = "normal";                                                                              // 4101
      builder.pos += ch.length;                                                                                        // 4102
    }                                                                                                                  // 4103
    if (text.length) builder.addedOne = true;                                                                          // 4104
  }                                                                                                                    // 4105
                                                                                                                       // 4106
  function buildCollapsedSpan(builder, size, widget) {                                                                 // 4107
    if (widget) {                                                                                                      // 4108
      if (!builder.display) widget = widget.cloneNode(true);                                                           // 4109
      builder.pre.appendChild(widget);                                                                                 // 4110
      if (builder.measure && size) {                                                                                   // 4111
        builder.measure[builder.pos] = widget;                                                                         // 4112
        builder.addedOne = true;                                                                                       // 4113
      }                                                                                                                // 4114
    }                                                                                                                  // 4115
    builder.pos += size;                                                                                               // 4116
  }                                                                                                                    // 4117
                                                                                                                       // 4118
  // Outputs a number of spans to make up a line, taking highlighting                                                  // 4119
  // and marked text into account.                                                                                     // 4120
  function insertLineContent(line, builder, styles) {                                                                  // 4121
    var spans = line.markedSpans;                                                                                      // 4122
    if (!spans) {                                                                                                      // 4123
      for (var i = 1; i < styles.length; i+=2)                                                                         // 4124
        builder.addToken(builder, styles[i], styleToClass(styles[i+1]));                                               // 4125
      return;                                                                                                          // 4126
    }                                                                                                                  // 4127
                                                                                                                       // 4128
    var allText = line.text, len = allText.length;                                                                     // 4129
    var pos = 0, i = 1, text = "", style;                                                                              // 4130
    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed;                                            // 4131
    for (;;) {                                                                                                         // 4132
      if (nextChange == pos) { // Update current marker set                                                            // 4133
        spanStyle = spanEndStyle = spanStartStyle = "";                                                                // 4134
        collapsed = null; nextChange = Infinity;                                                                       // 4135
        var foundBookmark = null;                                                                                      // 4136
        for (var j = 0; j < spans.length; ++j) {                                                                       // 4137
          var sp = spans[j], m = sp.marker;                                                                            // 4138
          if (sp.from <= pos && (sp.to == null || sp.to > pos)) {                                                      // 4139
            if (sp.to != null && nextChange > sp.to) { nextChange = sp.to; spanEndStyle = ""; }                        // 4140
            if (m.className) spanStyle += " " + m.className;                                                           // 4141
            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;                                  // 4142
            if (m.endStyle && sp.to == nextChange) spanEndStyle += " " + m.endStyle;                                   // 4143
            if (m.collapsed && (!collapsed || collapsed.marker.width < m.width))                                       // 4144
              collapsed = sp;                                                                                          // 4145
          } else if (sp.from > pos && nextChange > sp.from) {                                                          // 4146
            nextChange = sp.from;                                                                                      // 4147
          }                                                                                                            // 4148
          if (m.type == "bookmark" && sp.from == pos && m.replacedWith)                                                // 4149
            foundBookmark = m.replacedWith;                                                                            // 4150
        }                                                                                                              // 4151
        if (collapsed && (collapsed.from || 0) == pos) {                                                               // 4152
          buildCollapsedSpan(builder, (collapsed.to == null ? len : collapsed.to) - pos,                               // 4153
                             collapsed.from != null && collapsed.marker.replacedWith);                                 // 4154
          if (collapsed.to == null) return collapsed.marker.find();                                                    // 4155
        }                                                                                                              // 4156
        if (foundBookmark && !collapsed) buildCollapsedSpan(builder, 0, foundBookmark);                                // 4157
      }                                                                                                                // 4158
      if (pos >= len) break;                                                                                           // 4159
                                                                                                                       // 4160
      var upto = Math.min(len, nextChange);                                                                            // 4161
      while (true) {                                                                                                   // 4162
        if (text) {                                                                                                    // 4163
          var end = pos + text.length;                                                                                 // 4164
          if (!collapsed) {                                                                                            // 4165
            var tokenText = end > upto ? text.slice(0, upto - pos) : text;                                             // 4166
            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,                                // 4167
                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "");                // 4168
          }                                                                                                            // 4169
          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}                                         // 4170
          pos = end;                                                                                                   // 4171
          spanStartStyle = "";                                                                                         // 4172
        }                                                                                                              // 4173
        text = styles[i++]; style = styleToClass(styles[i++]);                                                         // 4174
      }                                                                                                                // 4175
    }                                                                                                                  // 4176
  }                                                                                                                    // 4177
                                                                                                                       // 4178
  // DOCUMENT DATA STRUCTURE                                                                                           // 4179
                                                                                                                       // 4180
  function updateDoc(doc, change, markedSpans, selAfter, estimateHeight) {                                             // 4181
    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}                                                 // 4182
                                                                                                                       // 4183
    var from = change.from, to = change.to, text = change.text;                                                        // 4184
    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);                                         // 4185
    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;                     // 4186
                                                                                                                       // 4187
    // First adjust the line structure                                                                                 // 4188
    if (from.ch == 0 && to.ch == 0 && lastText == "") {                                                                // 4189
      // This is a whole-line replace. Treated specially to make                                                       // 4190
      // sure line objects move the way they are supposed to.                                                          // 4191
      for (var i = 0, e = text.length - 1, added = []; i < e; ++i)                                                     // 4192
        added.push(makeLine(text[i], spansFor(i), estimateHeight));                                                    // 4193
      updateLine(lastLine, lastLine.text, lastSpans, estimateHeight);                                                  // 4194
      if (nlines) doc.remove(from.line, nlines);                                                                       // 4195
      if (added.length) doc.insert(from.line, added);                                                                  // 4196
    } else if (firstLine == lastLine) {                                                                                // 4197
      if (text.length == 1) {                                                                                          // 4198
        updateLine(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch),               // 4199
                   lastSpans, estimateHeight);                                                                         // 4200
      } else {                                                                                                         // 4201
        for (var added = [], i = 1, e = text.length - 1; i < e; ++i)                                                   // 4202
          added.push(makeLine(text[i], spansFor(i), estimateHeight));                                                  // 4203
        added.push(makeLine(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));                       // 4204
        updateLine(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0), estimateHeight);                // 4205
        doc.insert(from.line + 1, added);                                                                              // 4206
      }                                                                                                                // 4207
    } else if (text.length == 1) {                                                                                     // 4208
      updateLine(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch),                   // 4209
                 spansFor(0), estimateHeight);                                                                         // 4210
      doc.remove(from.line + 1, nlines);                                                                               // 4211
    } else {                                                                                                           // 4212
      updateLine(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0), estimateHeight);                  // 4213
      updateLine(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans, estimateHeight);                          // 4214
      for (var i = 1, e = text.length - 1, added = []; i < e; ++i)                                                     // 4215
        added.push(makeLine(text[i], spansFor(i), estimateHeight));                                                    // 4216
      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);                                                           // 4217
      doc.insert(from.line + 1, added);                                                                                // 4218
    }                                                                                                                  // 4219
                                                                                                                       // 4220
    signalLater(doc, "change", doc, change);                                                                           // 4221
    setSelection(doc, selAfter.anchor, selAfter.head, null, true);                                                     // 4222
  }                                                                                                                    // 4223
                                                                                                                       // 4224
  function LeafChunk(lines) {                                                                                          // 4225
    this.lines = lines;                                                                                                // 4226
    this.parent = null;                                                                                                // 4227
    for (var i = 0, e = lines.length, height = 0; i < e; ++i) {                                                        // 4228
      lines[i].parent = this;                                                                                          // 4229
      height += lines[i].height;                                                                                       // 4230
    }                                                                                                                  // 4231
    this.height = height;                                                                                              // 4232
  }                                                                                                                    // 4233
                                                                                                                       // 4234
  LeafChunk.prototype = {                                                                                              // 4235
    chunkSize: function() { return this.lines.length; },                                                               // 4236
    removeInner: function(at, n) {                                                                                     // 4237
      for (var i = at, e = at + n; i < e; ++i) {                                                                       // 4238
        var line = this.lines[i];                                                                                      // 4239
        this.height -= line.height;                                                                                    // 4240
        cleanUpLine(line);                                                                                             // 4241
        signalLater(line, "delete");                                                                                   // 4242
      }                                                                                                                // 4243
      this.lines.splice(at, n);                                                                                        // 4244
    },                                                                                                                 // 4245
    collapse: function(lines) {                                                                                        // 4246
      lines.splice.apply(lines, [lines.length, 0].concat(this.lines));                                                 // 4247
    },                                                                                                                 // 4248
    insertInner: function(at, lines, height) {                                                                         // 4249
      this.height += height;                                                                                           // 4250
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));                                 // 4251
      for (var i = 0, e = lines.length; i < e; ++i) lines[i].parent = this;                                            // 4252
    },                                                                                                                 // 4253
    iterN: function(at, n, op) {                                                                                       // 4254
      for (var e = at + n; at < e; ++at)                                                                               // 4255
        if (op(this.lines[at])) return true;                                                                           // 4256
    }                                                                                                                  // 4257
  };                                                                                                                   // 4258
                                                                                                                       // 4259
  function BranchChunk(children) {                                                                                     // 4260
    this.children = children;                                                                                          // 4261
    var size = 0, height = 0;                                                                                          // 4262
    for (var i = 0, e = children.length; i < e; ++i) {                                                                 // 4263
      var ch = children[i];                                                                                            // 4264
      size += ch.chunkSize(); height += ch.height;                                                                     // 4265
      ch.parent = this;                                                                                                // 4266
    }                                                                                                                  // 4267
    this.size = size;                                                                                                  // 4268
    this.height = height;                                                                                              // 4269
    this.parent = null;                                                                                                // 4270
  }                                                                                                                    // 4271
                                                                                                                       // 4272
  BranchChunk.prototype = {                                                                                            // 4273
    chunkSize: function() { return this.size; },                                                                       // 4274
    removeInner: function(at, n) {                                                                                     // 4275
      this.size -= n;                                                                                                  // 4276
      for (var i = 0; i < this.children.length; ++i) {                                                                 // 4277
        var child = this.children[i], sz = child.chunkSize();                                                          // 4278
        if (at < sz) {                                                                                                 // 4279
          var rm = Math.min(n, sz - at), oldHeight = child.height;                                                     // 4280
          child.removeInner(at, rm);                                                                                   // 4281
          this.height -= oldHeight - child.height;                                                                     // 4282
          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }                                         // 4283
          if ((n -= rm) == 0) break;                                                                                   // 4284
          at = 0;                                                                                                      // 4285
        } else at -= sz;                                                                                               // 4286
      }                                                                                                                // 4287
      if (this.size - n < 25) {                                                                                        // 4288
        var lines = [];                                                                                                // 4289
        this.collapse(lines);                                                                                          // 4290
        this.children = [new LeafChunk(lines)];                                                                        // 4291
        this.children[0].parent = this;                                                                                // 4292
      }                                                                                                                // 4293
    },                                                                                                                 // 4294
    collapse: function(lines) {                                                                                        // 4295
      for (var i = 0, e = this.children.length; i < e; ++i) this.children[i].collapse(lines);                          // 4296
    },                                                                                                                 // 4297
    insertInner: function(at, lines, height) {                                                                         // 4298
      this.size += lines.length;                                                                                       // 4299
      this.height += height;                                                                                           // 4300
      for (var i = 0, e = this.children.length; i < e; ++i) {                                                          // 4301
        var child = this.children[i], sz = child.chunkSize();                                                          // 4302
        if (at <= sz) {                                                                                                // 4303
          child.insertInner(at, lines, height);                                                                        // 4304
          if (child.lines && child.lines.length > 50) {                                                                // 4305
            while (child.lines.length > 50) {                                                                          // 4306
              var spilled = child.lines.splice(child.lines.length - 25, 25);                                           // 4307
              var newleaf = new LeafChunk(spilled);                                                                    // 4308
              child.height -= newleaf.height;                                                                          // 4309
              this.children.splice(i + 1, 0, newleaf);                                                                 // 4310
              newleaf.parent = this;                                                                                   // 4311
            }                                                                                                          // 4312
            this.maybeSpill();                                                                                         // 4313
          }                                                                                                            // 4314
          break;                                                                                                       // 4315
        }                                                                                                              // 4316
        at -= sz;                                                                                                      // 4317
      }                                                                                                                // 4318
    },                                                                                                                 // 4319
    maybeSpill: function() {                                                                                           // 4320
      if (this.children.length <= 10) return;                                                                          // 4321
      var me = this;                                                                                                   // 4322
      do {                                                                                                             // 4323
        var spilled = me.children.splice(me.children.length - 5, 5);                                                   // 4324
        var sibling = new BranchChunk(spilled);                                                                        // 4325
        if (!me.parent) { // Become the parent node                                                                    // 4326
          var copy = new BranchChunk(me.children);                                                                     // 4327
          copy.parent = me;                                                                                            // 4328
          me.children = [copy, sibling];                                                                               // 4329
          me = copy;                                                                                                   // 4330
        } else {                                                                                                       // 4331
          me.size -= sibling.size;                                                                                     // 4332
          me.height -= sibling.height;                                                                                 // 4333
          var myIndex = indexOf(me.parent.children, me);                                                               // 4334
          me.parent.children.splice(myIndex + 1, 0, sibling);                                                          // 4335
        }                                                                                                              // 4336
        sibling.parent = me.parent;                                                                                    // 4337
      } while (me.children.length > 10);                                                                               // 4338
      me.parent.maybeSpill();                                                                                          // 4339
    },                                                                                                                 // 4340
    iterN: function(at, n, op) {                                                                                       // 4341
      for (var i = 0, e = this.children.length; i < e; ++i) {                                                          // 4342
        var child = this.children[i], sz = child.chunkSize();                                                          // 4343
        if (at < sz) {                                                                                                 // 4344
          var used = Math.min(n, sz - at);                                                                             // 4345
          if (child.iterN(at, used, op)) return true;                                                                  // 4346
          if ((n -= used) == 0) break;                                                                                 // 4347
          at = 0;                                                                                                      // 4348
        } else at -= sz;                                                                                               // 4349
      }                                                                                                                // 4350
    }                                                                                                                  // 4351
  };                                                                                                                   // 4352
                                                                                                                       // 4353
  var nextDocId = 0;                                                                                                   // 4354
  var Doc = CodeMirror.Doc = function(text, mode, firstLine) {                                                         // 4355
    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);                                                 // 4356
    if (firstLine == null) firstLine = 0;                                                                              // 4357
                                                                                                                       // 4358
    BranchChunk.call(this, [new LeafChunk([makeLine("", null)])]);                                                     // 4359
    this.first = firstLine;                                                                                            // 4360
    this.scrollTop = this.scrollLeft = 0;                                                                              // 4361
    this.cantEdit = false;                                                                                             // 4362
    this.history = makeHistory();                                                                                      // 4363
    this.frontier = firstLine;                                                                                         // 4364
    var start = Pos(firstLine, 0);                                                                                     // 4365
    this.sel = {from: start, to: start, head: start, anchor: start, shift: false, extend: false, goalColumn: null};    // 4366
    this.id = ++nextDocId;                                                                                             // 4367
    this.modeOption = mode;                                                                                            // 4368
                                                                                                                       // 4369
    if (typeof text == "string") text = splitLines(text);                                                              // 4370
    updateDoc(this, {from: start, to: start, text: text}, null, {head: start, anchor: start});                         // 4371
  };                                                                                                                   // 4372
                                                                                                                       // 4373
  Doc.prototype = createObj(BranchChunk.prototype, {                                                                   // 4374
    iter: function(from, to, op) {                                                                                     // 4375
      if (op) this.iterN(from - this.first, to - from, op);                                                            // 4376
      else this.iterN(this.first, this.first + this.size, from);                                                       // 4377
    },                                                                                                                 // 4378
                                                                                                                       // 4379
    insert: function(at, lines) {                                                                                      // 4380
      var height = 0;                                                                                                  // 4381
      for (var i = 0, e = lines.length; i < e; ++i) height += lines[i].height;                                         // 4382
      this.insertInner(at - this.first, lines, height);                                                                // 4383
    },                                                                                                                 // 4384
    remove: function(at, n) { this.removeInner(at - this.first, n); },                                                 // 4385
                                                                                                                       // 4386
    getValue: function(lineSep) {                                                                                      // 4387
      var lines = getLines(this, this.first, this.first + this.size);                                                  // 4388
      if (lineSep === false) return lines;                                                                             // 4389
      return lines.join(lineSep || "\n");                                                                              // 4390
    },                                                                                                                 // 4391
    setValue: function(code) {                                                                                         // 4392
      var top = Pos(this.first, 0), last = this.first + this.size - 1;                                                 // 4393
      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),                                     // 4394
                        text: splitLines(code), origin: "setValue"},                                                   // 4395
                 {head: top, anchor: top}, true);                                                                      // 4396
    },                                                                                                                 // 4397
    replaceRange: function(code, from, to, origin) {                                                                   // 4398
      from = clipPos(this, from);                                                                                      // 4399
      to = to ? clipPos(this, to) : from;                                                                              // 4400
      replaceRange(this, code, from, to, origin);                                                                      // 4401
    },                                                                                                                 // 4402
    getRange: function(from, to, lineSep) {                                                                            // 4403
      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));                                            // 4404
      if (lineSep === false) return lines;                                                                             // 4405
      return lines.join(lineSep || "\n");                                                                              // 4406
    },                                                                                                                 // 4407
                                                                                                                       // 4408
    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},                                   // 4409
    setLine: function(line, text) {                                                                                    // 4410
      if (isLine(this, line))                                                                                          // 4411
        replaceRange(this, text, Pos(line, 0), clipPos(this, Pos(line)));                                              // 4412
    },                                                                                                                 // 4413
    removeLine: function(line) {                                                                                       // 4414
      if (isLine(this, line))                                                                                          // 4415
        replaceRange(this, "", Pos(line, 0), clipPos(this, Pos(line + 1, 0)));                                         // 4416
    },                                                                                                                 // 4417
                                                                                                                       // 4418
    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},                               // 4419
    getLineNumber: function(line) {return lineNo(line);},                                                              // 4420
                                                                                                                       // 4421
    lineCount: function() {return this.size;},                                                                         // 4422
    firstLine: function() {return this.first;},                                                                        // 4423
    lastLine: function() {return this.first + this.size - 1;},                                                         // 4424
                                                                                                                       // 4425
    clipPos: function(pos) {return clipPos(this, pos);},                                                               // 4426
                                                                                                                       // 4427
    getCursor: function(start) {                                                                                       // 4428
      var sel = this.sel, pos;                                                                                         // 4429
      if (start == null || start == "head") pos = sel.head;                                                            // 4430
      else if (start == "anchor") pos = sel.anchor;                                                                    // 4431
      else if (start == "end" || start === false) pos = sel.to;                                                        // 4432
      else pos = sel.from;                                                                                             // 4433
      return copyPos(pos);                                                                                             // 4434
    },                                                                                                                 // 4435
    somethingSelected: function() {return !posEq(this.sel.head, this.sel.anchor);},                                    // 4436
                                                                                                                       // 4437
    setCursor: docOperation(function(line, ch, extend) {                                                               // 4438
      var pos = clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line);                                    // 4439
      if (extend) extendSelection(this, pos);                                                                          // 4440
      else setSelection(this, pos, pos);                                                                               // 4441
    }),                                                                                                                // 4442
    setSelection: docOperation(function(anchor, head) {                                                                // 4443
      setSelection(this, clipPos(this, anchor), clipPos(this, head || anchor));                                        // 4444
    }),                                                                                                                // 4445
    extendSelection: docOperation(function(from, to) {                                                                 // 4446
      extendSelection(this, clipPos(this, from), to && clipPos(this, to));                                             // 4447
    }),                                                                                                                // 4448
                                                                                                                       // 4449
    getSelection: function(lineSep) {return this.getRange(this.sel.from, this.sel.to, lineSep);},                      // 4450
    replaceSelection: function(code, collapse, origin) {                                                               // 4451
      makeChange(this, {from: this.sel.from, to: this.sel.to, text: splitLines(code), origin: origin}, collapse || "around");
    },                                                                                                                 // 4453
    undo: docOperation(function() {makeChangeFromHistory(this, "undo");}),                                             // 4454
    redo: docOperation(function() {makeChangeFromHistory(this, "redo");}),                                             // 4455
                                                                                                                       // 4456
    setExtending: function(val) {this.sel.extend = val;},                                                              // 4457
                                                                                                                       // 4458
    historySize: function() {                                                                                          // 4459
      var hist = this.history;                                                                                         // 4460
      return {undo: hist.done.length, redo: hist.undone.length};                                                       // 4461
    },                                                                                                                 // 4462
    clearHistory: function() {this.history = makeHistory();},                                                          // 4463
                                                                                                                       // 4464
    markClean: function() {                                                                                            // 4465
      this.history.dirtyCounter = 0;                                                                                   // 4466
      this.history.lastOp = this.history.lastOrigin = null;                                                            // 4467
    },                                                                                                                 // 4468
    isClean: function () {return this.history.dirtyCounter == 0;},                                                     // 4469
                                                                                                                       // 4470
    getHistory: function() {                                                                                           // 4471
      return {done: copyHistoryArray(this.history.done),                                                               // 4472
              undone: copyHistoryArray(this.history.undone)};                                                          // 4473
    },                                                                                                                 // 4474
    setHistory: function(histData) {                                                                                   // 4475
      var hist = this.history = makeHistory();                                                                         // 4476
      hist.done = histData.done.slice(0);                                                                              // 4477
      hist.undone = histData.undone.slice(0);                                                                          // 4478
    },                                                                                                                 // 4479
                                                                                                                       // 4480
    markText: function(from, to, options) {                                                                            // 4481
      return markText(this, clipPos(this, from), clipPos(this, to), options, "range");                                 // 4482
    },                                                                                                                 // 4483
    setBookmark: function(pos, options) {                                                                              // 4484
      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),                  // 4485
                      insertLeft: options && options.insertLeft};                                                      // 4486
      pos = clipPos(this, pos);                                                                                        // 4487
      return markText(this, pos, pos, realOpts, "bookmark");                                                           // 4488
    },                                                                                                                 // 4489
    findMarksAt: function(pos) {                                                                                       // 4490
      pos = clipPos(this, pos);                                                                                        // 4491
      var markers = [], spans = getLine(this, pos.line).markedSpans;                                                   // 4492
      if (spans) for (var i = 0; i < spans.length; ++i) {                                                              // 4493
        var span = spans[i];                                                                                           // 4494
        if ((span.from == null || span.from <= pos.ch) &&                                                              // 4495
            (span.to == null || span.to >= pos.ch))                                                                    // 4496
          markers.push(span.marker.parent || span.marker);                                                             // 4497
      }                                                                                                                // 4498
      return markers;                                                                                                  // 4499
    },                                                                                                                 // 4500
    getAllMarks: function() {                                                                                          // 4501
      var markers = [];                                                                                                // 4502
      this.iter(function(line) {                                                                                       // 4503
        var sps = line.markedSpans;                                                                                    // 4504
        if (sps) for (var i = 0; i < sps.length; ++i)                                                                  // 4505
          if (sps[i].from != null) markers.push(sps[i].marker);                                                        // 4506
      });                                                                                                              // 4507
      return markers;                                                                                                  // 4508
    },                                                                                                                 // 4509
                                                                                                                       // 4510
    posFromIndex: function(off) {                                                                                      // 4511
      var ch, lineNo = this.first;                                                                                     // 4512
      this.iter(function(line) {                                                                                       // 4513
        var sz = line.text.length + 1;                                                                                 // 4514
        if (sz > off) { ch = off; return true; }                                                                       // 4515
        off -= sz;                                                                                                     // 4516
        ++lineNo;                                                                                                      // 4517
      });                                                                                                              // 4518
      return clipPos(this, Pos(lineNo, ch));                                                                           // 4519
    },                                                                                                                 // 4520
    indexFromPos: function (coords) {                                                                                  // 4521
      coords = clipPos(this, coords);                                                                                  // 4522
      var index = coords.ch;                                                                                           // 4523
      if (coords.line < this.first || coords.ch < 0) return 0;                                                         // 4524
      this.iter(this.first, coords.line, function (line) {                                                             // 4525
        index += line.text.length + 1;                                                                                 // 4526
      });                                                                                                              // 4527
      return index;                                                                                                    // 4528
    },                                                                                                                 // 4529
                                                                                                                       // 4530
    copy: function(copyHistory) {                                                                                      // 4531
      var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);              // 4532
      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;                                                // 4533
      doc.sel = {from: this.sel.from, to: this.sel.to, head: this.sel.head, anchor: this.sel.anchor,                   // 4534
                 shift: this.sel.shift, extend: false, goalColumn: this.sel.goalColumn};                               // 4535
      if (copyHistory) {                                                                                               // 4536
        doc.history.undoDepth = this.history.undoDepth;                                                                // 4537
        doc.setHistory(this.getHistory());                                                                             // 4538
      }                                                                                                                // 4539
      return doc;                                                                                                      // 4540
    },                                                                                                                 // 4541
                                                                                                                       // 4542
    linkedDoc: function(options) {                                                                                     // 4543
      if (!options) options = {};                                                                                      // 4544
      var from = this.first, to = this.first + this.size;                                                              // 4545
      if (options.from != null && options.from > from) from = options.from;                                            // 4546
      if (options.to != null && options.to < to) to = options.to;                                                      // 4547
      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);                             // 4548
      if (options.sharedHist) copy.history = this.history;                                                             // 4549
      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});                           // 4550
      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];                                     // 4551
      return copy;                                                                                                     // 4552
    },                                                                                                                 // 4553
    unlinkDoc: function(other) {                                                                                       // 4554
      if (other instanceof CodeMirror) other = other.doc;                                                              // 4555
      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {                                                  // 4556
        var link = this.linked[i];                                                                                     // 4557
        if (link.doc != other) continue;                                                                               // 4558
        this.linked.splice(i, 1);                                                                                      // 4559
        other.unlinkDoc(this);                                                                                         // 4560
        break;                                                                                                         // 4561
      }                                                                                                                // 4562
      // If the histories were shared, split them again                                                                // 4563
      if (other.history == this.history) {                                                                             // 4564
        var splitIds = [other.id];                                                                                     // 4565
        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);                                               // 4566
        other.history = makeHistory();                                                                                 // 4567
        other.history.done = copyHistoryArray(this.history.done, splitIds);                                            // 4568
        other.history.undone = copyHistoryArray(this.history.undone, splitIds);                                        // 4569
      }                                                                                                                // 4570
    },                                                                                                                 // 4571
    iterLinkedDocs: function(f) {linkedDocs(this, f);},                                                                // 4572
                                                                                                                       // 4573
    getMode: function() {return this.mode;},                                                                           // 4574
    getEditor: function() {return this.cm;}                                                                            // 4575
  });                                                                                                                  // 4576
                                                                                                                       // 4577
  Doc.prototype.eachLine = Doc.prototype.iter;                                                                         // 4578
                                                                                                                       // 4579
  // The Doc methods that should be available on CodeMirror instances                                                  // 4580
  var dontDelegate = "iter insert remove copy getEditor".split(" ");                                                   // 4581
  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)           // 4582
    CodeMirror.prototype[prop] = (function(method) {                                                                   // 4583
      return function() {return method.apply(this.doc, arguments);};                                                   // 4584
    })(Doc.prototype[prop]);                                                                                           // 4585
                                                                                                                       // 4586
  function linkedDocs(doc, f, sharedHistOnly) {                                                                        // 4587
    function propagate(doc, skip, sharedHist) {                                                                        // 4588
      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {                                                    // 4589
        var rel = doc.linked[i];                                                                                       // 4590
        if (rel.doc == skip) continue;                                                                                 // 4591
        var shared = sharedHist && rel.sharedHist;                                                                     // 4592
        if (sharedHistOnly && !shared) continue;                                                                       // 4593
        f(rel.doc, shared);                                                                                            // 4594
        propagate(rel.doc, doc, shared);                                                                               // 4595
      }                                                                                                                // 4596
    }                                                                                                                  // 4597
    propagate(doc, null, true);                                                                                        // 4598
  }                                                                                                                    // 4599
                                                                                                                       // 4600
  function attachDoc(cm, doc) {                                                                                        // 4601
    if (doc.cm) throw new Error("This document is already in use.");                                                   // 4602
    cm.doc = doc;                                                                                                      // 4603
    doc.cm = cm;                                                                                                       // 4604
    estimateLineHeights(cm);                                                                                           // 4605
    loadMode(cm);                                                                                                      // 4606
    if (!cm.options.lineWrapping) computeMaxLength(cm);                                                                // 4607
    cm.options.mode = doc.modeOption;                                                                                  // 4608
    regChange(cm);                                                                                                     // 4609
  }                                                                                                                    // 4610
                                                                                                                       // 4611
  // LINE UTILITIES                                                                                                    // 4612
                                                                                                                       // 4613
  function getLine(chunk, n) {                                                                                         // 4614
    n -= chunk.first;                                                                                                  // 4615
    while (!chunk.lines) {                                                                                             // 4616
      for (var i = 0;; ++i) {                                                                                          // 4617
        var child = chunk.children[i], sz = child.chunkSize();                                                         // 4618
        if (n < sz) { chunk = child; break; }                                                                          // 4619
        n -= sz;                                                                                                       // 4620
      }                                                                                                                // 4621
    }                                                                                                                  // 4622
    return chunk.lines[n];                                                                                             // 4623
  }                                                                                                                    // 4624
                                                                                                                       // 4625
  function getBetween(doc, start, end) {                                                                               // 4626
    var out = [], n = start.line;                                                                                      // 4627
    doc.iter(start.line, end.line + 1, function(line) {                                                                // 4628
      var text = line.text;                                                                                            // 4629
      if (n == end.line) text = text.slice(0, end.ch);                                                                 // 4630
      if (n == start.line) text = text.slice(start.ch);                                                                // 4631
      out.push(text);                                                                                                  // 4632
      ++n;                                                                                                             // 4633
    });                                                                                                                // 4634
    return out;                                                                                                        // 4635
  }                                                                                                                    // 4636
  function getLines(doc, from, to) {                                                                                   // 4637
    var out = [];                                                                                                      // 4638
    doc.iter(from, to, function(line) { out.push(line.text); });                                                       // 4639
    return out;                                                                                                        // 4640
  }                                                                                                                    // 4641
                                                                                                                       // 4642
  function updateLineHeight(line, height) {                                                                            // 4643
    var diff = height - line.height;                                                                                   // 4644
    for (var n = line; n; n = n.parent) n.height += diff;                                                              // 4645
  }                                                                                                                    // 4646
                                                                                                                       // 4647
  function lineNo(line) {                                                                                              // 4648
    if (line.parent == null) return null;                                                                              // 4649
    var cur = line.parent, no = indexOf(cur.lines, line);                                                              // 4650
    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {                                           // 4651
      for (var i = 0;; ++i) {                                                                                          // 4652
        if (chunk.children[i] == cur) break;                                                                           // 4653
        no += chunk.children[i].chunkSize();                                                                           // 4654
      }                                                                                                                // 4655
    }                                                                                                                  // 4656
    return no + cur.first;                                                                                             // 4657
  }                                                                                                                    // 4658
                                                                                                                       // 4659
  function lineAtHeight(chunk, h) {                                                                                    // 4660
    var n = chunk.first;                                                                                               // 4661
    outer: do {                                                                                                        // 4662
      for (var i = 0, e = chunk.children.length; i < e; ++i) {                                                         // 4663
        var child = chunk.children[i], ch = child.height;                                                              // 4664
        if (h < ch) { chunk = child; continue outer; }                                                                 // 4665
        h -= ch;                                                                                                       // 4666
        n += child.chunkSize();                                                                                        // 4667
      }                                                                                                                // 4668
      return n;                                                                                                        // 4669
    } while (!chunk.lines);                                                                                            // 4670
    for (var i = 0, e = chunk.lines.length; i < e; ++i) {                                                              // 4671
      var line = chunk.lines[i], lh = line.height;                                                                     // 4672
      if (h < lh) break;                                                                                               // 4673
      h -= lh;                                                                                                         // 4674
    }                                                                                                                  // 4675
    return n + i;                                                                                                      // 4676
  }                                                                                                                    // 4677
                                                                                                                       // 4678
  function heightAtLine(cm, lineObj) {                                                                                 // 4679
    lineObj = visualLine(cm.doc, lineObj);                                                                             // 4680
                                                                                                                       // 4681
    var h = 0, chunk = lineObj.parent;                                                                                 // 4682
    for (var i = 0; i < chunk.lines.length; ++i) {                                                                     // 4683
      var line = chunk.lines[i];                                                                                       // 4684
      if (line == lineObj) break;                                                                                      // 4685
      else h += line.height;                                                                                           // 4686
    }                                                                                                                  // 4687
    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {                                                       // 4688
      for (var i = 0; i < p.children.length; ++i) {                                                                    // 4689
        var cur = p.children[i];                                                                                       // 4690
        if (cur == chunk) break;                                                                                       // 4691
        else h += cur.height;                                                                                          // 4692
      }                                                                                                                // 4693
    }                                                                                                                  // 4694
    return h;                                                                                                          // 4695
  }                                                                                                                    // 4696
                                                                                                                       // 4697
  function getOrder(line) {                                                                                            // 4698
    var order = line.order;                                                                                            // 4699
    if (order == null) order = line.order = bidiOrdering(line.text);                                                   // 4700
    return order;                                                                                                      // 4701
  }                                                                                                                    // 4702
                                                                                                                       // 4703
  // HISTORY                                                                                                           // 4704
                                                                                                                       // 4705
  function makeHistory() {                                                                                             // 4706
    return {                                                                                                           // 4707
      // Arrays of history events. Doing something adds an event to                                                    // 4708
      // done and clears undo. Undoing moves events from done to                                                       // 4709
      // undone, redoing moves them in the other direction.                                                            // 4710
      done: [], undone: [], undoDepth: Infinity,                                                                       // 4711
      // Used to track when changes can be merged into a single undo                                                   // 4712
      // event                                                                                                         // 4713
      lastTime: 0, lastOp: null, lastOrigin: null,                                                                     // 4714
      // Used by the isClean() method                                                                                  // 4715
      dirtyCounter: 0                                                                                                  // 4716
    };                                                                                                                 // 4717
  }                                                                                                                    // 4718
                                                                                                                       // 4719
  function attachLocalSpans(doc, change, from, to) {                                                                   // 4720
    var existing = change["spans_" + doc.id], n = 0;                                                                   // 4721
    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {                           // 4722
      if (line.markedSpans)                                                                                            // 4723
        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;                               // 4724
      ++n;                                                                                                             // 4725
    });                                                                                                                // 4726
  }                                                                                                                    // 4727
                                                                                                                       // 4728
  function historyChangeFromChange(doc, change) {                                                                      // 4729
    var histChange = {from: change.from, to: changeEnd(change), text: getBetween(doc, change.from, change.to)};        // 4730
    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);                                           // 4731
    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);   // 4732
    return histChange;                                                                                                 // 4733
  }                                                                                                                    // 4734
                                                                                                                       // 4735
  function addToHistory(doc, change, selAfter, opId) {                                                                 // 4736
    var hist = doc.history;                                                                                            // 4737
    hist.undone.length = 0;                                                                                            // 4738
    var time = +new Date, cur = lst(hist.done);                                                                        // 4739
                                                                                                                       // 4740
    if (cur &&                                                                                                         // 4741
        (hist.lastOp == opId ||                                                                                        // 4742
         hist.lastOrigin == change.origin && change.origin &&                                                          // 4743
         ((change.origin.charAt(0) == "+" && hist.lastTime > time - 600) || change.origin.charAt(0) == "*"))) {        // 4744
      // Merge this change into the last event                                                                         // 4745
      var last = lst(cur.changes);                                                                                     // 4746
      if (posEq(change.from, change.to) && posEq(change.from, last.to)) {                                              // 4747
        // Optimized case for simple insertion -- don't want to add                                                    // 4748
        // new changesets for every character typed                                                                    // 4749
        last.to = changeEnd(change);                                                                                   // 4750
      } else {                                                                                                         // 4751
        // Add new sub-event                                                                                           // 4752
        cur.changes.push(historyChangeFromChange(doc, change));                                                        // 4753
      }                                                                                                                // 4754
      cur.anchorAfter = selAfter.anchor; cur.headAfter = selAfter.head;                                                // 4755
    } else {                                                                                                           // 4756
      // Can not be merged, start a new event.                                                                         // 4757
      cur = {changes: [historyChangeFromChange(doc, change)],                                                          // 4758
             anchorBefore: doc.sel.anchor, headBefore: doc.sel.head,                                                   // 4759
             anchorAfter: selAfter.anchor, headAfter: selAfter.head};                                                  // 4760
      hist.done.push(cur);                                                                                             // 4761
      while (hist.done.length > hist.undoDepth)                                                                        // 4762
        hist.done.shift();                                                                                             // 4763
      if (hist.dirtyCounter < 0)                                                                                       // 4764
        // The user has made a change after undoing past the last clean state.                                         // 4765
        // We can never get back to a clean state now until markClean() is called.                                     // 4766
        hist.dirtyCounter = NaN;                                                                                       // 4767
      else                                                                                                             // 4768
        hist.dirtyCounter++;                                                                                           // 4769
    }                                                                                                                  // 4770
    hist.lastTime = time;                                                                                              // 4771
    hist.lastOp = opId;                                                                                                // 4772
    hist.lastOrigin = change.origin;                                                                                   // 4773
  }                                                                                                                    // 4774
                                                                                                                       // 4775
  function removeClearedSpans(spans) {                                                                                 // 4776
    if (!spans) return null;                                                                                           // 4777
    for (var i = 0, out; i < spans.length; ++i) {                                                                      // 4778
      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }                                    // 4779
      else if (out) out.push(spans[i]);                                                                                // 4780
    }                                                                                                                  // 4781
    return !out ? spans : out.length ? out : null;                                                                     // 4782
  }                                                                                                                    // 4783
                                                                                                                       // 4784
  function getOldSpans(doc, change) {                                                                                  // 4785
    var found = change["spans_" + doc.id];                                                                             // 4786
    if (!found) return null;                                                                                           // 4787
    for (var i = 0, nw = []; i < change.text.length; ++i)                                                              // 4788
      nw.push(removeClearedSpans(found[i]));                                                                           // 4789
    return nw;                                                                                                         // 4790
  }                                                                                                                    // 4791
                                                                                                                       // 4792
  // Used both to provide a JSON-safe object in .getHistory, and, when                                                 // 4793
  // detaching a document, to split the history in two                                                                 // 4794
  function copyHistoryArray(events, newGroup) {                                                                        // 4795
    for (var i = 0, copy = []; i < events.length; ++i) {                                                               // 4796
      var event = events[i], changes = event.changes, newChanges = [];                                                 // 4797
      copy.push({changes: newChanges, anchorBefore: event.anchorBefore, headBefore: event.headBefore,                  // 4798
                 anchorAfter: event.anchorAfter, headAfter: event.headAfter});                                         // 4799
      for (var j = 0; j < changes.length; ++j) {                                                                       // 4800
        var change = changes[j], m;                                                                                    // 4801
        newChanges.push({from: change.from, to: change.to, text: change.text});                                        // 4802
        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {                                  // 4803
          if (indexOf(newGroup, Number(m[1])) > -1) {                                                                  // 4804
            lst(newChanges)[prop] = change[prop];                                                                      // 4805
            delete change[prop];                                                                                       // 4806
          }                                                                                                            // 4807
        }                                                                                                              // 4808
      }                                                                                                                // 4809
    }                                                                                                                  // 4810
    return copy;                                                                                                       // 4811
  }                                                                                                                    // 4812
                                                                                                                       // 4813
  // Rebasing/resetting history to deal with externally-sourced changes                                                // 4814
                                                                                                                       // 4815
  function rebaseHistSel(pos, from, to, diff) {                                                                        // 4816
    if (to < pos.line) {                                                                                               // 4817
      pos.line += diff;                                                                                                // 4818
    } else if (from < pos.line) {                                                                                      // 4819
      pos.line = from;                                                                                                 // 4820
      pos.ch = 0;                                                                                                      // 4821
    }                                                                                                                  // 4822
  }                                                                                                                    // 4823
                                                                                                                       // 4824
  // Tries to rebase an array of history events given a change in the                                                  // 4825
  // document. If the change touches the same lines as the event, the                                                  // 4826
  // event, and everything 'behind' it, is discarded. If the change is                                                 // 4827
  // before the event, the event's positions are updated. Uses a                                                       // 4828
  // copy-on-write scheme for the positions, to avoid having to                                                        // 4829
  // reallocate them all on every rebase, but also avoid problems with                                                 // 4830
  // shared position objects being unsafely updated.                                                                   // 4831
  function rebaseHistArray(array, from, to, diff) {                                                                    // 4832
    for (var i = 0; i < array.length; ++i) {                                                                           // 4833
      var sub = array[i], ok = true;                                                                                   // 4834
      for (var j = 0; j < sub.changes.length; ++j) {                                                                   // 4835
        var cur = sub.changes[j];                                                                                      // 4836
        if (!sub.copied) { cur.from = copyPos(cur.from); cur.to = copyPos(cur.to); }                                   // 4837
        if (to < cur.from.line) {                                                                                      // 4838
          cur.from.line += diff;                                                                                       // 4839
          cur.to.line += diff;                                                                                         // 4840
        } else if (from <= cur.to.line) {                                                                              // 4841
          ok = false;                                                                                                  // 4842
          break;                                                                                                       // 4843
        }                                                                                                              // 4844
      }                                                                                                                // 4845
      if (!sub.copied) {                                                                                               // 4846
        sub.anchorBefore = copyPos(sub.anchorBefore); sub.headBefore = copyPos(sub.headBefore);                        // 4847
        sub.anchorAfter = copyPos(sub.anchorAfter); sub.readAfter = copyPos(sub.headAfter);                            // 4848
        sub.copied = true;                                                                                             // 4849
      }                                                                                                                // 4850
      if (!ok) {                                                                                                       // 4851
        array.splice(0, i + 1);                                                                                        // 4852
        i = 0;                                                                                                         // 4853
      } else {                                                                                                         // 4854
        rebaseHistSel(sub.anchorBefore); rebaseHistSel(sub.headBefore);                                                // 4855
        rebaseHistSel(sub.anchorAfter); rebaseHistSel(sub.headAfter);                                                  // 4856
      }                                                                                                                // 4857
    }                                                                                                                  // 4858
  }                                                                                                                    // 4859
                                                                                                                       // 4860
  function rebaseHist(hist, change) {                                                                                  // 4861
    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;                     // 4862
    rebaseHistArray(hist.done, from, to, diff);                                                                        // 4863
    rebaseHistArray(hist.undone, from, to, diff);                                                                      // 4864
  }                                                                                                                    // 4865
                                                                                                                       // 4866
  // EVENT OPERATORS                                                                                                   // 4867
                                                                                                                       // 4868
  function stopMethod() {e_stop(this);}                                                                                // 4869
  // Ensure an event has a stop method.                                                                                // 4870
  function addStop(event) {                                                                                            // 4871
    if (!event.stop) event.stop = stopMethod;                                                                          // 4872
    return event;                                                                                                      // 4873
  }                                                                                                                    // 4874
                                                                                                                       // 4875
  function e_preventDefault(e) {                                                                                       // 4876
    if (e.preventDefault) e.preventDefault();                                                                          // 4877
    else e.returnValue = false;                                                                                        // 4878
  }                                                                                                                    // 4879
  function e_stopPropagation(e) {                                                                                      // 4880
    if (e.stopPropagation) e.stopPropagation();                                                                        // 4881
    else e.cancelBubble = true;                                                                                        // 4882
  }                                                                                                                    // 4883
  function e_stop(e) {e_preventDefault(e); e_stopPropagation(e);}                                                      // 4884
  CodeMirror.e_stop = e_stop;                                                                                          // 4885
  CodeMirror.e_preventDefault = e_preventDefault;                                                                      // 4886
  CodeMirror.e_stopPropagation = e_stopPropagation;                                                                    // 4887
                                                                                                                       // 4888
  function e_target(e) {return e.target || e.srcElement;}                                                              // 4889
  function e_button(e) {                                                                                               // 4890
    var b = e.which;                                                                                                   // 4891
    if (b == null) {                                                                                                   // 4892
      if (e.button & 1) b = 1;                                                                                         // 4893
      else if (e.button & 2) b = 3;                                                                                    // 4894
      else if (e.button & 4) b = 2;                                                                                    // 4895
    }                                                                                                                  // 4896
    if (mac && e.ctrlKey && b == 1) b = 3;                                                                             // 4897
    return b;                                                                                                          // 4898
  }                                                                                                                    // 4899
                                                                                                                       // 4900
  // EVENT HANDLING                                                                                                    // 4901
                                                                                                                       // 4902
  function on(emitter, type, f) {                                                                                      // 4903
    if (emitter.addEventListener)                                                                                      // 4904
      emitter.addEventListener(type, f, false);                                                                        // 4905
    else if (emitter.attachEvent)                                                                                      // 4906
      emitter.attachEvent("on" + type, f);                                                                             // 4907
    else {                                                                                                             // 4908
      var map = emitter._handlers || (emitter._handlers = {});                                                         // 4909
      var arr = map[type] || (map[type] = []);                                                                         // 4910
      arr.push(f);                                                                                                     // 4911
    }                                                                                                                  // 4912
  }                                                                                                                    // 4913
                                                                                                                       // 4914
  function off(emitter, type, f) {                                                                                     // 4915
    if (emitter.removeEventListener)                                                                                   // 4916
      emitter.removeEventListener(type, f, false);                                                                     // 4917
    else if (emitter.detachEvent)                                                                                      // 4918
      emitter.detachEvent("on" + type, f);                                                                             // 4919
    else {                                                                                                             // 4920
      var arr = emitter._handlers && emitter._handlers[type];                                                          // 4921
      if (!arr) return;                                                                                                // 4922
      for (var i = 0; i < arr.length; ++i)                                                                             // 4923
        if (arr[i] == f) { arr.splice(i, 1); break; }                                                                  // 4924
    }                                                                                                                  // 4925
  }                                                                                                                    // 4926
                                                                                                                       // 4927
  function signal(emitter, type /*, values...*/) {                                                                     // 4928
    var arr = emitter._handlers && emitter._handlers[type];                                                            // 4929
    if (!arr) return;                                                                                                  // 4930
    var args = Array.prototype.slice.call(arguments, 2);                                                               // 4931
    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);                                                     // 4932
  }                                                                                                                    // 4933
                                                                                                                       // 4934
  var delayedCallbacks, delayedCallbackDepth = 0;                                                                      // 4935
  function signalLater(emitter, type /*, values...*/) {                                                                // 4936
    var arr = emitter._handlers && emitter._handlers[type];                                                            // 4937
    if (!arr) return;                                                                                                  // 4938
    var args = Array.prototype.slice.call(arguments, 2);                                                               // 4939
    if (!delayedCallbacks) {                                                                                           // 4940
      ++delayedCallbackDepth;                                                                                          // 4941
      delayedCallbacks = [];                                                                                           // 4942
      setTimeout(fireDelayed, 0);                                                                                      // 4943
    }                                                                                                                  // 4944
    function bnd(f) {return function(){f.apply(null, args);};};                                                        // 4945
    for (var i = 0; i < arr.length; ++i)                                                                               // 4946
      delayedCallbacks.push(bnd(arr[i]));                                                                              // 4947
  }                                                                                                                    // 4948
                                                                                                                       // 4949
  function fireDelayed() {                                                                                             // 4950
    --delayedCallbackDepth;                                                                                            // 4951
    var delayed = delayedCallbacks;                                                                                    // 4952
    delayedCallbacks = null;                                                                                           // 4953
    for (var i = 0; i < delayed.length; ++i) delayed[i]();                                                             // 4954
  }                                                                                                                    // 4955
                                                                                                                       // 4956
  function hasHandler(emitter, type) {                                                                                 // 4957
    var arr = emitter._handlers && emitter._handlers[type];                                                            // 4958
    return arr && arr.length > 0;                                                                                      // 4959
  }                                                                                                                    // 4960
                                                                                                                       // 4961
  CodeMirror.on = on; CodeMirror.off = off; CodeMirror.signal = signal;                                                // 4962
                                                                                                                       // 4963
  // MISC UTILITIES                                                                                                    // 4964
                                                                                                                       // 4965
  // Number of pixels added to scroller and sizer to hide scrollbar                                                    // 4966
  var scrollerCutOff = 30;                                                                                             // 4967
                                                                                                                       // 4968
  // Returned or thrown by various protocols to signal 'I'm not                                                        // 4969
  // handling this'.                                                                                                   // 4970
  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};                                      // 4971
                                                                                                                       // 4972
  function Delayed() {this.id = null;}                                                                                 // 4973
  Delayed.prototype = {set: function(ms, f) {clearTimeout(this.id); this.id = setTimeout(f, ms);}};                    // 4974
                                                                                                                       // 4975
  // Counts the column offset in a string, taking tabs into account.                                                   // 4976
  // Used mostly to find indentation.                                                                                  // 4977
  function countColumn(string, end, tabSize, startIndex, startValue) {                                                 // 4978
    if (end == null) {                                                                                                 // 4979
      end = string.search(/[^\s\u00a0]/);                                                                              // 4980
      if (end == -1) end = string.length;                                                                              // 4981
    }                                                                                                                  // 4982
    for (var i = startIndex || 0, n = startValue || 0; i < end; ++i) {                                                 // 4983
      if (string.charAt(i) == "\t") n += tabSize - (n % tabSize);                                                      // 4984
      else ++n;                                                                                                        // 4985
    }                                                                                                                  // 4986
    return n;                                                                                                          // 4987
  }                                                                                                                    // 4988
  CodeMirror.countColumn = countColumn;                                                                                // 4989
                                                                                                                       // 4990
  var spaceStrs = [""];                                                                                                // 4991
  function spaceStr(n) {                                                                                               // 4992
    while (spaceStrs.length <= n)                                                                                      // 4993
      spaceStrs.push(lst(spaceStrs) + " ");                                                                            // 4994
    return spaceStrs[n];                                                                                               // 4995
  }                                                                                                                    // 4996
                                                                                                                       // 4997
  function lst(arr) { return arr[arr.length-1]; }                                                                      // 4998
                                                                                                                       // 4999
  function selectInput(node) {                                                                                         // 5000
    if (ios) { // Mobile Safari apparently has a bug where select() is broken.                                         // 5001
      node.selectionStart = 0;                                                                                         // 5002
      node.selectionEnd = node.value.length;                                                                           // 5003
    } else node.select();                                                                                              // 5004
  }                                                                                                                    // 5005
                                                                                                                       // 5006
  function indexOf(collection, elt) {                                                                                  // 5007
    if (collection.indexOf) return collection.indexOf(elt);                                                            // 5008
    for (var i = 0, e = collection.length; i < e; ++i)                                                                 // 5009
      if (collection[i] == elt) return i;                                                                              // 5010
    return -1;                                                                                                         // 5011
  }                                                                                                                    // 5012
                                                                                                                       // 5013
  function createObj(base, props) {                                                                                    // 5014
    function Obj() {}                                                                                                  // 5015
    Obj.prototype = base;                                                                                              // 5016
    var inst = new Obj();                                                                                              // 5017
    if (props) copyObj(props, inst);                                                                                   // 5018
    return inst;                                                                                                       // 5019
  }                                                                                                                    // 5020
                                                                                                                       // 5021
  function copyObj(obj, target) {                                                                                      // 5022
    if (!target) target = {};                                                                                          // 5023
    for (var prop in obj) if (obj.hasOwnProperty(prop)) target[prop] = obj[prop];                                      // 5024
    return target;                                                                                                     // 5025
  }                                                                                                                    // 5026
                                                                                                                       // 5027
  function emptyArray(size) {                                                                                          // 5028
    for (var a = [], i = 0; i < size; ++i) a.push(undefined);                                                          // 5029
    return a;                                                                                                          // 5030
  }                                                                                                                    // 5031
                                                                                                                       // 5032
  function bind(f) {                                                                                                   // 5033
    var args = Array.prototype.slice.call(arguments, 1);                                                               // 5034
    return function(){return f.apply(null, args);};                                                                    // 5035
  }                                                                                                                    // 5036
                                                                                                                       // 5037
  var nonASCIISingleCaseWordChar = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc]/;                           // 5038
  function isWordChar(ch) {                                                                                            // 5039
    return /\w/.test(ch) || ch > "\x80" &&                                                                             // 5040
      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));                                   // 5041
  }                                                                                                                    // 5042
                                                                                                                       // 5043
  function isEmpty(obj) {                                                                                              // 5044
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;                                              // 5045
    return true;                                                                                                       // 5046
  }                                                                                                                    // 5047
                                                                                                                       // 5048
  var isExtendingChar = /[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff]/;
                                                                                                                       // 5050
  // DOM UTILITIES                                                                                                     // 5051
                                                                                                                       // 5052
  function elt(tag, content, className, style) {                                                                       // 5053
    var e = document.createElement(tag);                                                                               // 5054
    if (className) e.className = className;                                                                            // 5055
    if (style) e.style.cssText = style;                                                                                // 5056
    if (typeof content == "string") setTextContent(e, content);                                                        // 5057
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);                              // 5058
    return e;                                                                                                          // 5059
  }                                                                                                                    // 5060
                                                                                                                       // 5061
  function removeChildren(e) {                                                                                         // 5062
    // IE will break all parent-child relations in subnodes when setting innerHTML                                     // 5063
    if (!ie) e.innerHTML = "";                                                                                         // 5064
    else while (e.firstChild) e.removeChild(e.firstChild);                                                             // 5065
    return e;                                                                                                          // 5066
  }                                                                                                                    // 5067
                                                                                                                       // 5068
  function removeChildrenAndAdd(parent, e) {                                                                           // 5069
    return removeChildren(parent).appendChild(e);                                                                      // 5070
  }                                                                                                                    // 5071
                                                                                                                       // 5072
  function setTextContent(e, str) {                                                                                    // 5073
    if (ie_lt9) {                                                                                                      // 5074
      e.innerHTML = "";                                                                                                // 5075
      e.appendChild(document.createTextNode(str));                                                                     // 5076
    } else e.textContent = str;                                                                                        // 5077
  }                                                                                                                    // 5078
                                                                                                                       // 5079
  function getRect(node) {                                                                                             // 5080
    return node.getBoundingClientRect();                                                                               // 5081
  }                                                                                                                    // 5082
  CodeMirror.replaceGetRect = function(f) { getRect = f; };                                                            // 5083
                                                                                                                       // 5084
  // FEATURE DETECTION                                                                                                 // 5085
                                                                                                                       // 5086
  // Detect drag-and-drop                                                                                              // 5087
  var dragAndDrop = function() {                                                                                       // 5088
    // There is *some* kind of drag-and-drop support in IE6-8, but I                                                   // 5089
    // couldn't get it to work yet.                                                                                    // 5090
    if (ie_lt9) return false;                                                                                          // 5091
    var div = elt('div');                                                                                              // 5092
    return "draggable" in div || "dragDrop" in div;                                                                    // 5093
  }();                                                                                                                 // 5094
                                                                                                                       // 5095
  // For a reason I have yet to figure out, some browsers disallow                                                     // 5096
  // word wrapping between certain characters *only* if a new inline                                                   // 5097
  // element is started between them. This makes it hard to reliably                                                   // 5098
  // measure the position of things, since that requires inserting an                                                  // 5099
  // extra span. This terribly fragile set of regexps matches the                                                      // 5100
  // character combinations that suffer from this phenomenon on the                                                    // 5101
  // various browsers.                                                                                                 // 5102
  var spanAffectsWrapping = /^$/; // Won't match any two-character string                                              // 5103
  if (gecko) spanAffectsWrapping = /$'/;                                                                               // 5104
  else if (safari && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent)) spanAffectsWrapping = /\-[^ \-?]|\?[^ !'\"\),.\-\/:;\?\]\}]/;
  else if (webkit) spanAffectsWrapping = /[~!#%&*)=+}\]|\"\.>,:;][({[<]|-[^\-?\.]|\?[\w~`@#$%\^&*(_=+{[|><]/;          // 5106
                                                                                                                       // 5107
  var knownScrollbarWidth;                                                                                             // 5108
  function scrollbarWidth(measure) {                                                                                   // 5109
    if (knownScrollbarWidth != null) return knownScrollbarWidth;                                                       // 5110
    var test = elt("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");                                // 5111
    removeChildrenAndAdd(measure, test);                                                                               // 5112
    if (test.offsetWidth)                                                                                              // 5113
      knownScrollbarWidth = test.offsetHeight - test.clientHeight;                                                     // 5114
    return knownScrollbarWidth || 0;                                                                                   // 5115
  }                                                                                                                    // 5116
                                                                                                                       // 5117
  var zwspSupported;                                                                                                   // 5118
  function zeroWidthElement(measure) {                                                                                 // 5119
    if (zwspSupported == null) {                                                                                       // 5120
      var test = elt("span", "\u200b");                                                                                // 5121
      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));                                // 5122
      if (measure.firstChild.offsetHeight != 0)                                                                        // 5123
        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !ie_lt8;                                     // 5124
    }                                                                                                                  // 5125
    if (zwspSupported) return elt("span", "\u200b");                                                                   // 5126
    else return elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");                  // 5127
  }                                                                                                                    // 5128
                                                                                                                       // 5129
  // See if "".split is the broken IE version, if so, provide an                                                       // 5130
  // alternative way to split lines.                                                                                   // 5131
  var splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {                                                // 5132
    var pos = 0, result = [], l = string.length;                                                                       // 5133
    while (pos <= l) {                                                                                                 // 5134
      var nl = string.indexOf("\n", pos);                                                                              // 5135
      if (nl == -1) nl = string.length;                                                                                // 5136
      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);                                       // 5137
      var rt = line.indexOf("\r");                                                                                     // 5138
      if (rt != -1) {                                                                                                  // 5139
        result.push(line.slice(0, rt));                                                                                // 5140
        pos += rt + 1;                                                                                                 // 5141
      } else {                                                                                                         // 5142
        result.push(line);                                                                                             // 5143
        pos = nl + 1;                                                                                                  // 5144
      }                                                                                                                // 5145
    }                                                                                                                  // 5146
    return result;                                                                                                     // 5147
  } : function(string){return string.split(/\r\n?|\n/);};                                                              // 5148
  CodeMirror.splitLines = splitLines;                                                                                  // 5149
                                                                                                                       // 5150
  var hasSelection = window.getSelection ? function(te) {                                                              // 5151
    try { return te.selectionStart != te.selectionEnd; }                                                               // 5152
    catch(e) { return false; }                                                                                         // 5153
  } : function(te) {                                                                                                   // 5154
    try {var range = te.ownerDocument.selection.createRange();}                                                        // 5155
    catch(e) {}                                                                                                        // 5156
    if (!range || range.parentElement() != te) return false;                                                           // 5157
    return range.compareEndPoints("StartToEnd", range) != 0;                                                           // 5158
  };                                                                                                                   // 5159
                                                                                                                       // 5160
  var hasCopyEvent = (function() {                                                                                     // 5161
    var e = elt("div");                                                                                                // 5162
    if ("oncopy" in e) return true;                                                                                    // 5163
    e.setAttribute("oncopy", "return;");                                                                               // 5164
    return typeof e.oncopy == 'function';                                                                              // 5165
  })();                                                                                                                // 5166
                                                                                                                       // 5167
  // KEY NAMING                                                                                                        // 5168
                                                                                                                       // 5169
  var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",               // 5170
                  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",        // 5171
                  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",            // 5172
                  46: "Delete", 59: ";", 91: "Mod", 92: "Mod", 93: "Mod", 109: "-", 107: "=", 127: "Delete",           // 5173
                  186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",           // 5174
                  221: "]", 222: "'", 63276: "PageUp", 63277: "PageDown", 63275: "End", 63273: "Home",                 // 5175
                  63234: "Left", 63232: "Up", 63235: "Right", 63233: "Down", 63302: "Insert", 63272: "Delete"};        // 5176
  CodeMirror.keyNames = keyNames;                                                                                      // 5177
  (function() {                                                                                                        // 5178
    // Number keys                                                                                                     // 5179
    for (var i = 0; i < 10; i++) keyNames[i + 48] = String(i);                                                         // 5180
    // Alphabetic keys                                                                                                 // 5181
    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);                                               // 5182
    // Function keys                                                                                                   // 5183
    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;                                   // 5184
  })();                                                                                                                // 5185
                                                                                                                       // 5186
  // BIDI HELPERS                                                                                                      // 5187
                                                                                                                       // 5188
  function iterateBidiSections(order, from, to, f) {                                                                   // 5189
    if (!order) return f(from, to, "ltr");                                                                             // 5190
    for (var i = 0; i < order.length; ++i) {                                                                           // 5191
      var part = order[i];                                                                                             // 5192
      if (part.from < to && part.to > from || from == to && part.to == from)                                           // 5193
        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");                          // 5194
    }                                                                                                                  // 5195
  }                                                                                                                    // 5196
                                                                                                                       // 5197
  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }                                             // 5198
  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }                                            // 5199
                                                                                                                       // 5200
  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }                       // 5201
  function lineRight(line) {                                                                                           // 5202
    var order = getOrder(line);                                                                                        // 5203
    if (!order) return line.text.length;                                                                               // 5204
    return bidiRight(lst(order));                                                                                      // 5205
  }                                                                                                                    // 5206
                                                                                                                       // 5207
  function lineStart(cm, lineN) {                                                                                      // 5208
    var line = getLine(cm.doc, lineN);                                                                                 // 5209
    var visual = visualLine(cm.doc, line);                                                                             // 5210
    if (visual != line) lineN = lineNo(visual);                                                                        // 5211
    var order = getOrder(visual);                                                                                      // 5212
    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);                                   // 5213
    return Pos(lineN, ch);                                                                                             // 5214
  }                                                                                                                    // 5215
  function lineEnd(cm, lineN) {                                                                                        // 5216
    var merged, line;                                                                                                  // 5217
    while (merged = collapsedSpanAtEnd(line = getLine(cm.doc, lineN)))                                                 // 5218
      lineN = merged.find().to.line;                                                                                   // 5219
    var order = getOrder(line);                                                                                        // 5220
    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);                        // 5221
    return Pos(lineN, ch);                                                                                             // 5222
  }                                                                                                                    // 5223
                                                                                                                       // 5224
  // This is somewhat involved. It is needed in order to move                                                          // 5225
  // 'visually' through bi-directional text -- i.e., pressing left                                                     // 5226
  // should make the cursor go left, even when in RTL text. The                                                        // 5227
  // tricky part is the 'jumps', where RTL and LTR text touch each                                                     // 5228
  // other. This often requires the cursor offset to move more than                                                    // 5229
  // one unit, in order to visually move one unit.                                                                     // 5230
  function moveVisually(line, start, dir, byUnit) {                                                                    // 5231
    var bidi = getOrder(line);                                                                                         // 5232
    if (!bidi) return moveLogically(line, start, dir, byUnit);                                                         // 5233
    var moveOneUnit = byUnit ? function(pos, dir) {                                                                    // 5234
      do pos += dir;                                                                                                   // 5235
      while (pos > 0 && isExtendingChar.test(line.text.charAt(pos)));                                                  // 5236
      return pos;                                                                                                      // 5237
    } : function(pos, dir) { return pos + dir; };                                                                      // 5238
    var linedir = bidi[0].level;                                                                                       // 5239
    for (var i = 0; i < bidi.length; ++i) {                                                                            // 5240
      var part = bidi[i], sticky = part.level % 2 == linedir;                                                          // 5241
      if ((part.from < start && part.to > start) ||                                                                    // 5242
          (sticky && (part.from == start || part.to == start))) break;                                                 // 5243
    }                                                                                                                  // 5244
    var target = moveOneUnit(start, part.level % 2 ? -dir : dir);                                                      // 5245
                                                                                                                       // 5246
    while (target != null) {                                                                                           // 5247
      if (part.level % 2 == linedir) {                                                                                 // 5248
        if (target < part.from || target > part.to) {                                                                  // 5249
          part = bidi[i += dir];                                                                                       // 5250
          target = part && (dir > 0 == part.level % 2 ? moveOneUnit(part.to, -1) : moveOneUnit(part.from, 1));         // 5251
        } else break;                                                                                                  // 5252
      } else {                                                                                                         // 5253
        if (target == bidiLeft(part)) {                                                                                // 5254
          part = bidi[--i];                                                                                            // 5255
          target = part && bidiRight(part);                                                                            // 5256
        } else if (target == bidiRight(part)) {                                                                        // 5257
          part = bidi[++i];                                                                                            // 5258
          target = part && bidiLeft(part);                                                                             // 5259
        } else break;                                                                                                  // 5260
      }                                                                                                                // 5261
    }                                                                                                                  // 5262
                                                                                                                       // 5263
    return target < 0 || target > line.text.length ? null : target;                                                    // 5264
  }                                                                                                                    // 5265
                                                                                                                       // 5266
  function moveLogically(line, start, dir, byUnit) {                                                                   // 5267
    var target = start + dir;                                                                                          // 5268
    if (byUnit) while (target > 0 && isExtendingChar.test(line.text.charAt(target))) target += dir;                    // 5269
    return target < 0 || target > line.text.length ? null : target;                                                    // 5270
  }                                                                                                                    // 5271
                                                                                                                       // 5272
  // Bidirectional ordering algorithm                                                                                  // 5273
  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm                                                  // 5274
  // that this (partially) implements.                                                                                 // 5275
                                                                                                                       // 5276
  // One-char codes used for character types:                                                                          // 5277
  // L (L):   Left-to-Right                                                                                            // 5278
  // R (R):   Right-to-Left                                                                                            // 5279
  // r (AL):  Right-to-Left Arabic                                                                                     // 5280
  // 1 (EN):  European Number                                                                                          // 5281
  // + (ES):  European Number Separator                                                                                // 5282
  // % (ET):  European Number Terminator                                                                               // 5283
  // n (AN):  Arabic Number                                                                                            // 5284
  // , (CS):  Common Number Separator                                                                                  // 5285
  // m (NSM): Non-Spacing Mark                                                                                         // 5286
  // b (BN):  Boundary Neutral                                                                                         // 5287
  // s (B):   Paragraph Separator                                                                                      // 5288
  // t (S):   Segment Separator                                                                                        // 5289
  // w (WS):  Whitespace                                                                                               // 5290
  // N (ON):  Other Neutrals                                                                                           // 5291
                                                                                                                       // 5292
  // Returns null if characters are ordered as they appear                                                             // 5293
  // (left-to-right), or an array of sections ({from, to, level}                                                       // 5294
  // objects) in the order in which they occur visually.                                                               // 5295
  var bidiOrdering = (function() {                                                                                     // 5296
    // Character types for codepoints 0 to 0xff                                                                        // 5297
    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL";
    // Character types for codepoints 0x600 to 0x6ff                                                                   // 5299
    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr";
    function charType(code) {                                                                                          // 5301
      if (code <= 0xff) return lowTypes.charAt(code);                                                                  // 5302
      else if (0x590 <= code && code <= 0x5f4) return "R";                                                             // 5303
      else if (0x600 <= code && code <= 0x6ff) return arabicTypes.charAt(code - 0x600);                                // 5304
      else if (0x700 <= code && code <= 0x8ac) return "r";                                                             // 5305
      else return "L";                                                                                                 // 5306
    }                                                                                                                  // 5307
                                                                                                                       // 5308
    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;                                                          // 5309
    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;                       // 5310
    // Browsers seem to always treat the boundaries of block elements as being L.                                      // 5311
    var outerType = "L";                                                                                               // 5312
                                                                                                                       // 5313
    return function(str) {                                                                                             // 5314
      if (!bidiRE.test(str)) return false;                                                                             // 5315
      var len = str.length, types = [];                                                                                // 5316
      for (var i = 0, type; i < len; ++i)                                                                              // 5317
        types.push(type = charType(str.charCodeAt(i)));                                                                // 5318
                                                                                                                       // 5319
      // W1. Examine each non-spacing mark (NSM) in the level run, and                                                 // 5320
      // change the type of the NSM to the type of the previous                                                        // 5321
      // character. If the NSM is at the start of the level run, it will                                               // 5322
      // get the type of sor.                                                                                          // 5323
      for (var i = 0, prev = outerType; i < len; ++i) {                                                                // 5324
        var type = types[i];                                                                                           // 5325
        if (type == "m") types[i] = prev;                                                                              // 5326
        else prev = type;                                                                                              // 5327
      }                                                                                                                // 5328
                                                                                                                       // 5329
      // W2. Search backwards from each instance of a European number                                                  // 5330
      // until the first strong type (R, L, AL, or sor) is found. If an                                                // 5331
      // AL is found, change the type of the European number to Arabic                                                 // 5332
      // number.                                                                                                       // 5333
      // W3. Change all ALs to R.                                                                                      // 5334
      for (var i = 0, cur = outerType; i < len; ++i) {                                                                 // 5335
        var type = types[i];                                                                                           // 5336
        if (type == "1" && cur == "r") types[i] = "n";                                                                 // 5337
        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }                                 // 5338
      }                                                                                                                // 5339
                                                                                                                       // 5340
      // W4. A single European separator between two European numbers                                                  // 5341
      // changes to a European number. A single common separator between                                               // 5342
      // two numbers of the same type changes to that type.                                                            // 5343
      for (var i = 1, prev = types[0]; i < len - 1; ++i) {                                                             // 5344
        var type = types[i];                                                                                           // 5345
        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";                                           // 5346
        else if (type == "," && prev == types[i+1] &&                                                                  // 5347
                 (prev == "1" || prev == "n")) types[i] = prev;                                                        // 5348
        prev = type;                                                                                                   // 5349
      }                                                                                                                // 5350
                                                                                                                       // 5351
      // W5. A sequence of European terminators adjacent to European                                                   // 5352
      // numbers changes to all European numbers.                                                                      // 5353
      // W6. Otherwise, separators and terminators change to Other                                                     // 5354
      // Neutral.                                                                                                      // 5355
      for (var i = 0; i < len; ++i) {                                                                                  // 5356
        var type = types[i];                                                                                           // 5357
        if (type == ",") types[i] = "N";                                                                               // 5358
        else if (type == "%") {                                                                                        // 5359
          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}                                              // 5360
          var replace = (i && types[i-1] == "!") || (end < len - 1 && types[end] == "1") ? "1" : "N";                  // 5361
          for (var j = i; j < end; ++j) types[j] = replace;                                                            // 5362
          i = end - 1;                                                                                                 // 5363
        }                                                                                                              // 5364
      }                                                                                                                // 5365
                                                                                                                       // 5366
      // W7. Search backwards from each instance of a European number                                                  // 5367
      // until the first strong type (R, L, or sor) is found. If an L is                                               // 5368
      // found, then change the type of the European number to L.                                                      // 5369
      for (var i = 0, cur = outerType; i < len; ++i) {                                                                 // 5370
        var type = types[i];                                                                                           // 5371
        if (cur == "L" && type == "1") types[i] = "L";                                                                 // 5372
        else if (isStrong.test(type)) cur = type;                                                                      // 5373
      }                                                                                                                // 5374
                                                                                                                       // 5375
      // N1. A sequence of neutrals takes the direction of the                                                         // 5376
      // surrounding strong text if the text on both sides has the same                                                // 5377
      // direction. European and Arabic numbers act as if they were R in                                               // 5378
      // terms of their influence on neutrals. Start-of-level-run (sor)                                                // 5379
      // and end-of-level-run (eor) are used at level run boundaries.                                                  // 5380
      // N2. Any remaining neutrals take the embedding direction.                                                      // 5381
      for (var i = 0; i < len; ++i) {                                                                                  // 5382
        if (isNeutral.test(types[i])) {                                                                                // 5383
          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}                                     // 5384
          var before = (i ? types[i-1] : outerType) == "L";                                                            // 5385
          var after = (end < len - 1 ? types[end] : outerType) == "L";                                                 // 5386
          var replace = before || after ? "L" : "R";                                                                   // 5387
          for (var j = i; j < end; ++j) types[j] = replace;                                                            // 5388
          i = end - 1;                                                                                                 // 5389
        }                                                                                                              // 5390
      }                                                                                                                // 5391
                                                                                                                       // 5392
      // Here we depart from the documented algorithm, in order to avoid                                               // 5393
      // building up an actual levels array. Since there are only three                                                // 5394
      // levels (0, 1, 2) in an implementation that doesn't take                                                       // 5395
      // explicit embedding into account, we can build up the order on                                                 // 5396
      // the fly, without following the level-based algorithm.                                                         // 5397
      var order = [], m;                                                                                               // 5398
      for (var i = 0; i < len;) {                                                                                      // 5399
        if (countsAsLeft.test(types[i])) {                                                                             // 5400
          var start = i;                                                                                               // 5401
          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}                                                    // 5402
          order.push({from: start, to: i, level: 0});                                                                  // 5403
        } else {                                                                                                       // 5404
          var pos = i, at = order.length;                                                                              // 5405
          for (++i; i < len && types[i] != "L"; ++i) {}                                                                // 5406
          for (var j = pos; j < i;) {                                                                                  // 5407
            if (countsAsNum.test(types[j])) {                                                                          // 5408
              if (pos < j) order.splice(at, 0, {from: pos, to: j, level: 1});                                          // 5409
              var nstart = j;                                                                                          // 5410
              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}                                                   // 5411
              order.splice(at, 0, {from: nstart, to: j, level: 2});                                                    // 5412
              pos = j;                                                                                                 // 5413
            } else ++j;                                                                                                // 5414
          }                                                                                                            // 5415
          if (pos < i) order.splice(at, 0, {from: pos, to: i, level: 1});                                              // 5416
        }                                                                                                              // 5417
      }                                                                                                                // 5418
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {                                                            // 5419
        order[0].from = m[0].length;                                                                                   // 5420
        order.unshift({from: 0, to: m[0].length, level: 0});                                                           // 5421
      }                                                                                                                // 5422
      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {                                                          // 5423
        lst(order).to -= m[0].length;                                                                                  // 5424
        order.push({from: len - m[0].length, to: len, level: 0});                                                      // 5425
      }                                                                                                                // 5426
      if (order[0].level != lst(order).level)                                                                          // 5427
        order.push({from: len, to: len, level: order[0].level});                                                       // 5428
                                                                                                                       // 5429
      return order;                                                                                                    // 5430
    };                                                                                                                 // 5431
  })();                                                                                                                // 5432
                                                                                                                       // 5433
  // THE END                                                                                                           // 5434
                                                                                                                       // 5435
  CodeMirror.version = "3.1 +";                                                                                        // 5436
                                                                                                                       // 5437
  return CodeMirror;                                                                                                   // 5438
})();                                                                                                                  // 5439
                                                                                                                       // 5440
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/observatory/lib/codemirror/javascript.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// TODO actually recognize syntax of TypeScript constructs                                                             // 1
                                                                                                                       // 2
CodeMirror.defineMode("javascript", function(config, parserConfig) {                                                   // 3
  var indentUnit = config.indentUnit;                                                                                  // 4
  var jsonMode = parserConfig.json;                                                                                    // 5
  var isTS = parserConfig.typescript;                                                                                  // 6
                                                                                                                       // 7
  // Tokenizer                                                                                                         // 8
                                                                                                                       // 9
  var keywords = function(){                                                                                           // 10
    function kw(type) {return {type: type, style: "keyword"};}                                                         // 11
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");                                                 // 12
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};                                               // 13
                                                                                                                       // 14
    var jsKeywords = {                                                                                                 // 15
      "if": A, "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,                                      // 16
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C,                                       // 17
      "var": kw("var"), "const": kw("var"), "let": kw("var"),                                                          // 18
      "function": kw("function"), "catch": kw("catch"),                                                                // 19
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),                          // 20
      "in": operator, "typeof": operator, "instanceof": operator,                                                      // 21
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,                     // 22
      "this": kw("this")                                                                                               // 23
    };                                                                                                                 // 24
                                                                                                                       // 25
    // Extend the 'normal' keywords with the TypeScript language extensions                                            // 26
    if (isTS) {                                                                                                        // 27
      var type = {type: "variable", style: "variable-3"};                                                              // 28
      var tsKeywords = {                                                                                               // 29
        // object-like things                                                                                          // 30
        "interface": kw("interface"),                                                                                  // 31
        "class": kw("class"),                                                                                          // 32
        "extends": kw("extends"),                                                                                      // 33
        "constructor": kw("constructor"),                                                                              // 34
                                                                                                                       // 35
        // scope modifiers                                                                                             // 36
        "public": kw("public"),                                                                                        // 37
        "private": kw("private"),                                                                                      // 38
        "protected": kw("protected"),                                                                                  // 39
        "static": kw("static"),                                                                                        // 40
                                                                                                                       // 41
        "super": kw("super"),                                                                                          // 42
                                                                                                                       // 43
        // types                                                                                                       // 44
        "string": type, "number": type, "bool": type, "any": type                                                      // 45
      };                                                                                                               // 46
                                                                                                                       // 47
      for (var attr in tsKeywords) {                                                                                   // 48
        jsKeywords[attr] = tsKeywords[attr];                                                                           // 49
      }                                                                                                                // 50
    }                                                                                                                  // 51
                                                                                                                       // 52
    return jsKeywords;                                                                                                 // 53
  }();                                                                                                                 // 54
                                                                                                                       // 55
  var isOperatorChar = /[+\-*&%=<>!?|~^]/;                                                                             // 56
                                                                                                                       // 57
  function chain(stream, state, f) {                                                                                   // 58
    state.tokenize = f;                                                                                                // 59
    return f(stream, state);                                                                                           // 60
  }                                                                                                                    // 61
                                                                                                                       // 62
  function nextUntilUnescaped(stream, end) {                                                                           // 63
    var escaped = false, next;                                                                                         // 64
    while ((next = stream.next()) != null) {                                                                           // 65
      if (next == end && !escaped)                                                                                     // 66
        return false;                                                                                                  // 67
      escaped = !escaped && next == "\\";                                                                              // 68
    }                                                                                                                  // 69
    return escaped;                                                                                                    // 70
  }                                                                                                                    // 71
                                                                                                                       // 72
  // Used as scratch variables to communicate multiple values without                                                  // 73
  // consing up tons of objects.                                                                                       // 74
  var type, content;                                                                                                   // 75
  function ret(tp, style, cont) {                                                                                      // 76
    type = tp; content = cont;                                                                                         // 77
    return style;                                                                                                      // 78
  }                                                                                                                    // 79
                                                                                                                       // 80
  function jsTokenBase(stream, state) {                                                                                // 81
    var ch = stream.next();                                                                                            // 82
    if (ch == '"' || ch == "'")                                                                                        // 83
      return chain(stream, state, jsTokenString(ch));                                                                  // 84
    else if (/[\[\]{}\(\),;\:\.]/.test(ch))                                                                            // 85
      return ret(ch);                                                                                                  // 86
    else if (ch == "0" && stream.eat(/x/i)) {                                                                          // 87
      stream.eatWhile(/[\da-f]/i);                                                                                     // 88
      return ret("number", "number");                                                                                  // 89
    }                                                                                                                  // 90
    else if (/\d/.test(ch) || ch == "-" && stream.eat(/\d/)) {                                                         // 91
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);                                                                // 92
      return ret("number", "number");                                                                                  // 93
    }                                                                                                                  // 94
    else if (ch == "/") {                                                                                              // 95
      if (stream.eat("*")) {                                                                                           // 96
        return chain(stream, state, jsTokenComment);                                                                   // 97
      }                                                                                                                // 98
      else if (stream.eat("/")) {                                                                                      // 99
        stream.skipToEnd();                                                                                            // 100
        return ret("comment", "comment");                                                                              // 101
      }                                                                                                                // 102
      else if (state.lastType == "operator" || state.lastType == "keyword c" ||                                        // 103
               /^[\[{}\(,;:]$/.test(state.lastType)) {                                                                 // 104
        nextUntilUnescaped(stream, "/");                                                                               // 105
        stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla                                                // 106
        return ret("regexp", "string-2");                                                                              // 107
      }                                                                                                                // 108
      else {                                                                                                           // 109
        stream.eatWhile(isOperatorChar);                                                                               // 110
        return ret("operator", null, stream.current());                                                                // 111
      }                                                                                                                // 112
    }                                                                                                                  // 113
    else if (ch == "#") {                                                                                              // 114
      stream.skipToEnd();                                                                                              // 115
      return ret("error", "error");                                                                                    // 116
    }                                                                                                                  // 117
    else if (isOperatorChar.test(ch)) {                                                                                // 118
      stream.eatWhile(isOperatorChar);                                                                                 // 119
      return ret("operator", null, stream.current());                                                                  // 120
    }                                                                                                                  // 121
    else {                                                                                                             // 122
      stream.eatWhile(/[\w\$_]/);                                                                                      // 123
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];                      // 124
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :                                   // 125
                     ret("variable", "variable", word);                                                                // 126
    }                                                                                                                  // 127
  }                                                                                                                    // 128
                                                                                                                       // 129
  function jsTokenString(quote) {                                                                                      // 130
    return function(stream, state) {                                                                                   // 131
      if (!nextUntilUnescaped(stream, quote))                                                                          // 132
        state.tokenize = jsTokenBase;                                                                                  // 133
      return ret("string", "string");                                                                                  // 134
    };                                                                                                                 // 135
  }                                                                                                                    // 136
                                                                                                                       // 137
  function jsTokenComment(stream, state) {                                                                             // 138
    var maybeEnd = false, ch;                                                                                          // 139
    while (ch = stream.next()) {                                                                                       // 140
      if (ch == "/" && maybeEnd) {                                                                                     // 141
        state.tokenize = jsTokenBase;                                                                                  // 142
        break;                                                                                                         // 143
      }                                                                                                                // 144
      maybeEnd = (ch == "*");                                                                                          // 145
    }                                                                                                                  // 146
    return ret("comment", "comment");                                                                                  // 147
  }                                                                                                                    // 148
                                                                                                                       // 149
  // Parser                                                                                                            // 150
                                                                                                                       // 151
  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true};    // 152
                                                                                                                       // 153
  function JSLexical(indented, column, type, align, prev, info) {                                                      // 154
    this.indented = indented;                                                                                          // 155
    this.column = column;                                                                                              // 156
    this.type = type;                                                                                                  // 157
    this.prev = prev;                                                                                                  // 158
    this.info = info;                                                                                                  // 159
    if (align != null) this.align = align;                                                                             // 160
  }                                                                                                                    // 161
                                                                                                                       // 162
  function inScope(state, varname) {                                                                                   // 163
    for (var v = state.localVars; v; v = v.next)                                                                       // 164
      if (v.name == varname) return true;                                                                              // 165
  }                                                                                                                    // 166
                                                                                                                       // 167
  function parseJS(state, style, type, content, stream) {                                                              // 168
    var cc = state.cc;                                                                                                 // 169
    // Communicate our context to the combinators.                                                                     // 170
    // (Less wasteful than consing up a hundred closures on every call.)                                               // 171
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;                                                // 172
                                                                                                                       // 173
    if (!state.lexical.hasOwnProperty("align"))                                                                        // 174
      state.lexical.align = true;                                                                                      // 175
                                                                                                                       // 176
    while(true) {                                                                                                      // 177
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;                                       // 178
      if (combinator(type, content)) {                                                                                 // 179
        while(cc.length && cc[cc.length - 1].lex)                                                                      // 180
          cc.pop()();                                                                                                  // 181
        if (cx.marked) return cx.marked;                                                                               // 182
        if (type == "variable" && inScope(state, content)) return "variable-2";                                        // 183
        return style;                                                                                                  // 184
      }                                                                                                                // 185
    }                                                                                                                  // 186
  }                                                                                                                    // 187
                                                                                                                       // 188
  // Combinator utils                                                                                                  // 189
                                                                                                                       // 190
  var cx = {state: null, column: null, marked: null, cc: null};                                                        // 191
  function pass() {                                                                                                    // 192
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);                                          // 193
  }                                                                                                                    // 194
  function cont() {                                                                                                    // 195
    pass.apply(null, arguments);                                                                                       // 196
    return true;                                                                                                       // 197
  }                                                                                                                    // 198
  function register(varname) {                                                                                         // 199
    function inList(list) {                                                                                            // 200
      for (var v = list; v; v = v.next)                                                                                // 201
        if (v.name == varname) return true;                                                                            // 202
      return false;                                                                                                    // 203
    }                                                                                                                  // 204
    var state = cx.state;                                                                                              // 205
    if (state.context) {                                                                                               // 206
      cx.marked = "def";                                                                                               // 207
      if (inList(state.localVars)) return;                                                                             // 208
      state.localVars = {name: varname, next: state.localVars};                                                        // 209
    } else {                                                                                                           // 210
      if (inList(state.globalVars)) return;                                                                            // 211
      state.globalVars = {name: varname, next: state.globalVars};                                                      // 212
    }                                                                                                                  // 213
  }                                                                                                                    // 214
                                                                                                                       // 215
  // Combinators                                                                                                       // 216
                                                                                                                       // 217
  var defaultVars = {name: "this", next: {name: "arguments"}};                                                         // 218
  function pushcontext() {                                                                                             // 219
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};                                             // 220
    cx.state.localVars = defaultVars;                                                                                  // 221
  }                                                                                                                    // 222
  function popcontext() {                                                                                              // 223
    cx.state.localVars = cx.state.context.vars;                                                                        // 224
    cx.state.context = cx.state.context.prev;                                                                          // 225
  }                                                                                                                    // 226
  function pushlex(type, info) {                                                                                       // 227
    var result = function() {                                                                                          // 228
      var state = cx.state;                                                                                            // 229
      state.lexical = new JSLexical(state.indented, cx.stream.column(), type, null, state.lexical, info);              // 230
    };                                                                                                                 // 231
    result.lex = true;                                                                                                 // 232
    return result;                                                                                                     // 233
  }                                                                                                                    // 234
  function poplex() {                                                                                                  // 235
    var state = cx.state;                                                                                              // 236
    if (state.lexical.prev) {                                                                                          // 237
      if (state.lexical.type == ")")                                                                                   // 238
        state.indented = state.lexical.indented;                                                                       // 239
      state.lexical = state.lexical.prev;                                                                              // 240
    }                                                                                                                  // 241
  }                                                                                                                    // 242
  poplex.lex = true;                                                                                                   // 243
                                                                                                                       // 244
  function expect(wanted) {                                                                                            // 245
    return function(type) {                                                                                            // 246
      if (type == wanted) return cont();                                                                               // 247
      else if (wanted == ";") return pass();                                                                           // 248
      else return cont(arguments.callee);                                                                              // 249
    };                                                                                                                 // 250
  }                                                                                                                    // 251
                                                                                                                       // 252
  function statement(type) {                                                                                           // 253
    if (type == "var") return cont(pushlex("vardef"), vardef1, expect(";"), poplex);                                   // 254
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);                              // 255
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);                                          // 256
    if (type == "{") return cont(pushlex("}"), block, poplex);                                                         // 257
    if (type == ";") return cont();                                                                                    // 258
    if (type == "function") return cont(functiondef);                                                                  // 259
    if (type == "for") return cont(pushlex("form"), expect("("), pushlex(")"), forspec1, expect(")"),                  // 260
                                      poplex, statement, poplex);                                                      // 261
    if (type == "variable") return cont(pushlex("stat"), maybelabel);                                                  // 262
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),                // 263
                                         block, poplex, poplex);                                                       // 264
    if (type == "case") return cont(expression, expect(":"));                                                          // 265
    if (type == "default") return cont(expect(":"));                                                                   // 266
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),                   // 267
                                        statement, poplex, popcontext);                                                // 268
    return pass(pushlex("stat"), expression, expect(";"), poplex);                                                     // 269
  }                                                                                                                    // 270
  function expression(type) {                                                                                          // 271
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeoperator);                                                  // 272
    if (type == "function") return cont(functiondef);                                                                  // 273
    if (type == "keyword c") return cont(maybeexpression);                                                             // 274
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeoperator);                   // 275
    if (type == "operator") return cont(expression);                                                                   // 276
    if (type == "[") return cont(pushlex("]"), commasep(expression, "]"), poplex, maybeoperator);                      // 277
    if (type == "{") return cont(pushlex("}"), commasep(objprop, "}"), poplex, maybeoperator);                         // 278
    return cont();                                                                                                     // 279
  }                                                                                                                    // 280
  function maybeexpression(type) {                                                                                     // 281
    if (type.match(/[;\}\)\],]/)) return pass();                                                                       // 282
    return pass(expression);                                                                                           // 283
  }                                                                                                                    // 284
                                                                                                                       // 285
  function maybeoperator(type, value) {                                                                                // 286
    if (type == "operator") {                                                                                          // 287
      if (/\+\+|--/.test(value)) return cont(maybeoperator);                                                           // 288
      if (value == "?") return cont(expression, expect(":"), expression);                                              // 289
      return cont(expression);                                                                                         // 290
    }                                                                                                                  // 291
    if (type == ";") return;                                                                                           // 292
    if (type == "(") return cont(pushlex(")"), commasep(expression, ")"), poplex, maybeoperator);                      // 293
    if (type == ".") return cont(property, maybeoperator);                                                             // 294
    if (type == "[") return cont(pushlex("]"), expression, expect("]"), poplex, maybeoperator);                        // 295
  }                                                                                                                    // 296
  function maybelabel(type) {                                                                                          // 297
    if (type == ":") return cont(poplex, statement);                                                                   // 298
    return pass(maybeoperator, expect(";"), poplex);                                                                   // 299
  }                                                                                                                    // 300
  function property(type) {                                                                                            // 301
    if (type == "variable") {cx.marked = "property"; return cont();}                                                   // 302
  }                                                                                                                    // 303
  function objprop(type) {                                                                                             // 304
    if (type == "variable") cx.marked = "property";                                                                    // 305
    else if (type == "number" || type == "string") cx.marked = type + " property";                                     // 306
    if (atomicTypes.hasOwnProperty(type)) return cont(expect(":"), expression);                                        // 307
  }                                                                                                                    // 308
  function commasep(what, end) {                                                                                       // 309
    function proceed(type) {                                                                                           // 310
      if (type == ",") return cont(what, proceed);                                                                     // 311
      if (type == end) return cont();                                                                                  // 312
      return cont(expect(end));                                                                                        // 313
    }                                                                                                                  // 314
    return function(type) {                                                                                            // 315
      if (type == end) return cont();                                                                                  // 316
      else return pass(what, proceed);                                                                                 // 317
    };                                                                                                                 // 318
  }                                                                                                                    // 319
  function block(type) {                                                                                               // 320
    if (type == "}") return cont();                                                                                    // 321
    return pass(statement, block);                                                                                     // 322
  }                                                                                                                    // 323
  function maybetype(type) {                                                                                           // 324
    if (type == ":") return cont(typedef);                                                                             // 325
    return pass();                                                                                                     // 326
  }                                                                                                                    // 327
  function typedef(type) {                                                                                             // 328
    if (type == "variable"){cx.marked = "variable-3"; return cont();}                                                  // 329
    return pass();                                                                                                     // 330
  }                                                                                                                    // 331
  function vardef1(type, value) {                                                                                      // 332
    if (type == "variable") {                                                                                          // 333
      register(value);                                                                                                 // 334
      return isTS ? cont(maybetype, vardef2) : cont(vardef2);                                                          // 335
    }                                                                                                                  // 336
    return pass();                                                                                                     // 337
  }                                                                                                                    // 338
  function vardef2(type, value) {                                                                                      // 339
    if (value == "=") return cont(expression, vardef2);                                                                // 340
    if (type == ",") return cont(vardef1);                                                                             // 341
  }                                                                                                                    // 342
  function forspec1(type) {                                                                                            // 343
    if (type == "var") return cont(vardef1, expect(";"), forspec2);                                                    // 344
    if (type == ";") return cont(forspec2);                                                                            // 345
    if (type == "variable") return cont(formaybein);                                                                   // 346
    return cont(forspec2);                                                                                             // 347
  }                                                                                                                    // 348
  function formaybein(_type, value) {                                                                                  // 349
    if (value == "in") return cont(expression);                                                                        // 350
    return cont(maybeoperator, forspec2);                                                                              // 351
  }                                                                                                                    // 352
  function forspec2(type, value) {                                                                                     // 353
    if (type == ";") return cont(forspec3);                                                                            // 354
    if (value == "in") return cont(expression);                                                                        // 355
    return cont(expression, expect(";"), forspec3);                                                                    // 356
  }                                                                                                                    // 357
  function forspec3(type) {                                                                                            // 358
    if (type != ")") cont(expression);                                                                                 // 359
  }                                                                                                                    // 360
  function functiondef(type, value) {                                                                                  // 361
    if (type == "variable") {register(value); return cont(functiondef);}                                               // 362
    if (type == "(") return cont(pushlex(")"), pushcontext, commasep(funarg, ")"), poplex, statement, popcontext);     // 363
  }                                                                                                                    // 364
  function funarg(type, value) {                                                                                       // 365
    if (type == "variable") {register(value); return isTS ? cont(maybetype) : cont();}                                 // 366
  }                                                                                                                    // 367
                                                                                                                       // 368
  // Interface                                                                                                         // 369
                                                                                                                       // 370
  return {                                                                                                             // 371
    startState: function(basecolumn) {                                                                                 // 372
      return {                                                                                                         // 373
        tokenize: jsTokenBase,                                                                                         // 374
        lastType: null,                                                                                                // 375
        cc: [],                                                                                                        // 376
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),                                     // 377
        localVars: parserConfig.localVars,                                                                             // 378
        globalVars: parserConfig.globalVars,                                                                           // 379
        context: parserConfig.localVars && {vars: parserConfig.localVars},                                             // 380
        indented: 0                                                                                                    // 381
      };                                                                                                               // 382
    },                                                                                                                 // 383
                                                                                                                       // 384
    token: function(stream, state) {                                                                                   // 385
      if (stream.sol()) {                                                                                              // 386
        if (!state.lexical.hasOwnProperty("align"))                                                                    // 387
          state.lexical.align = false;                                                                                 // 388
        state.indented = stream.indentation();                                                                         // 389
      }                                                                                                                // 390
      if (stream.eatSpace()) return null;                                                                              // 391
      var style = state.tokenize(stream, state);                                                                       // 392
      if (type == "comment") return style;                                                                             // 393
      state.lastType = type;                                                                                           // 394
      return parseJS(state, style, type, content, stream);                                                             // 395
    },                                                                                                                 // 396
                                                                                                                       // 397
    indent: function(state, textAfter) {                                                                               // 398
      if (state.tokenize == jsTokenComment) return CodeMirror.Pass;                                                    // 399
      if (state.tokenize != jsTokenBase) return 0;                                                                     // 400
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;                                       // 401
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;                                          // 402
      var type = lexical.type, closing = firstChar == type;                                                            // 403
      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? 4 : 0); // 404
      else if (type == "form" && firstChar == "{") return lexical.indented;                                            // 405
      else if (type == "form") return lexical.indented + indentUnit;                                                   // 406
      else if (type == "stat")                                                                                         // 407
        return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? indentUnit : 0);            // 408
      else if (lexical.info == "switch" && !closing)                                                                   // 409
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);               // 410
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);                                               // 411
      else return lexical.indented + (closing ? 0 : indentUnit);                                                       // 412
    },                                                                                                                 // 413
                                                                                                                       // 414
    electricChars: ":{}",                                                                                              // 415
                                                                                                                       // 416
    jsonMode: jsonMode                                                                                                 // 417
  };                                                                                                                   // 418
});                                                                                                                    // 419
                                                                                                                       // 420
CodeMirror.defineMIME("text/javascript", "javascript");                                                                // 421
CodeMirror.defineMIME("text/ecmascript", "javascript");                                                                // 422
CodeMirror.defineMIME("application/javascript", "javascript");                                                         // 423
CodeMirror.defineMIME("application/ecmascript", "javascript");                                                         // 424
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});                                           // 425
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });                                    // 426
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });                             // 427
                                                                                                                       // 428
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/observatory/lib/codemirror/coffeescript.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Link to the project's GitHub page:                                                                                  // 2
 * https://github.com/pickhardt/coffeescript-codemirror-mode                                                           // 3
 */                                                                                                                    // 4
CodeMirror.defineMode('coffeescript', function(conf) {                                                                 // 5
    var ERRORCLASS = 'error';                                                                                          // 6
                                                                                                                       // 7
    function wordRegexp(words) {                                                                                       // 8
        return new RegExp("^((" + words.join(")|(") + "))\\b");                                                        // 9
    }                                                                                                                  // 10
                                                                                                                       // 11
    var singleOperators = new RegExp("^[\\+\\-\\*/%&|\\^~<>!\?]");                                                     // 12
    var singleDelimiters = new RegExp('^[\\(\\)\\[\\]\\{\\},:`=;\\.]');                                                // 13
    var doubleOperators = new RegExp("^((\->)|(\=>)|(\\+\\+)|(\\+\\=)|(\\-\\-)|(\\-\\=)|(\\*\\*)|(\\*\\=)|(\\/\\/)|(\\/\\=)|(==)|(!=)|(<=)|(>=)|(<>)|(<<)|(>>)|(//))");
    var doubleDelimiters = new RegExp("^((\\.\\.)|(\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))");                // 15
    var tripleDelimiters = new RegExp("^((\\.\\.\\.)|(//=)|(>>=)|(<<=)|(\\*\\*=))");                                   // 16
    var identifiers = new RegExp("^[_A-Za-z$][_A-Za-z$0-9]*");                                                         // 17
    var properties = new RegExp("^(@|this\.)[_A-Za-z$][_A-Za-z$0-9]*");                                                // 18
                                                                                                                       // 19
    var wordOperators = wordRegexp(['and', 'or', 'not',                                                                // 20
                                    'is', 'isnt', 'in',                                                                // 21
                                    'instanceof', 'typeof']);                                                          // 22
    var indentKeywords = ['for', 'while', 'loop', 'if', 'unless', 'else',                                              // 23
                          'switch', 'try', 'catch', 'finally', 'class'];                                               // 24
    var commonKeywords = ['break', 'by', 'continue', 'debugger', 'delete',                                             // 25
                          'do', 'in', 'of', 'new', 'return', 'then',                                                   // 26
                          'this', 'throw', 'when', 'until'];                                                           // 27
                                                                                                                       // 28
    var keywords = wordRegexp(indentKeywords.concat(commonKeywords));                                                  // 29
                                                                                                                       // 30
    indentKeywords = wordRegexp(indentKeywords);                                                                       // 31
                                                                                                                       // 32
                                                                                                                       // 33
    var stringPrefixes = new RegExp("^('{3}|\"{3}|['\"])");                                                            // 34
    var regexPrefixes = new RegExp("^(/{3}|/)");                                                                       // 35
    var commonConstants = ['Infinity', 'NaN', 'undefined', 'null', 'true', 'false', 'on', 'off', 'yes', 'no'];         // 36
    var constants = wordRegexp(commonConstants);                                                                       // 37
                                                                                                                       // 38
    // Tokenizers                                                                                                      // 39
    function tokenBase(stream, state) {                                                                                // 40
        // Handle scope changes                                                                                        // 41
        if (stream.sol()) {                                                                                            // 42
            var scopeOffset = state.scopes[0].offset;                                                                  // 43
            if (stream.eatSpace()) {                                                                                   // 44
                var lineOffset = stream.indentation();                                                                 // 45
                if (lineOffset > scopeOffset) {                                                                        // 46
                    return 'indent';                                                                                   // 47
                } else if (lineOffset < scopeOffset) {                                                                 // 48
                    return 'dedent';                                                                                   // 49
                }                                                                                                      // 50
                return null;                                                                                           // 51
            } else {                                                                                                   // 52
                if (scopeOffset > 0) {                                                                                 // 53
                    dedent(stream, state);                                                                             // 54
                }                                                                                                      // 55
            }                                                                                                          // 56
        }                                                                                                              // 57
        if (stream.eatSpace()) {                                                                                       // 58
            return null;                                                                                               // 59
        }                                                                                                              // 60
                                                                                                                       // 61
        var ch = stream.peek();                                                                                        // 62
                                                                                                                       // 63
        // Handle docco title comment (single line)                                                                    // 64
        if (stream.match("####")) {                                                                                    // 65
            stream.skipToEnd();                                                                                        // 66
            return 'comment';                                                                                          // 67
        }                                                                                                              // 68
                                                                                                                       // 69
        // Handle multi line comments                                                                                  // 70
        if (stream.match("###")) {                                                                                     // 71
            state.tokenize = longComment;                                                                              // 72
            return state.tokenize(stream, state);                                                                      // 73
        }                                                                                                              // 74
                                                                                                                       // 75
        // Single line comment                                                                                         // 76
        if (ch === '#') {                                                                                              // 77
            stream.skipToEnd();                                                                                        // 78
            return 'comment';                                                                                          // 79
        }                                                                                                              // 80
                                                                                                                       // 81
        // Handle number literals                                                                                      // 82
        if (stream.match(/^-?[0-9\.]/, false)) {                                                                       // 83
            var floatLiteral = false;                                                                                  // 84
            // Floats                                                                                                  // 85
            if (stream.match(/^-?\d*\.\d+(e[\+\-]?\d+)?/i)) {                                                          // 86
              floatLiteral = true;                                                                                     // 87
            }                                                                                                          // 88
            if (stream.match(/^-?\d+\.\d*/)) {                                                                         // 89
              floatLiteral = true;                                                                                     // 90
            }                                                                                                          // 91
            if (stream.match(/^-?\.\d+/)) {                                                                            // 92
              floatLiteral = true;                                                                                     // 93
            }                                                                                                          // 94
                                                                                                                       // 95
            if (floatLiteral) {                                                                                        // 96
                // prevent from getting extra . on 1..                                                                 // 97
                if (stream.peek() == "."){                                                                             // 98
                    stream.backUp(1);                                                                                  // 99
                }                                                                                                      // 100
                return 'number';                                                                                       // 101
            }                                                                                                          // 102
            // Integers                                                                                                // 103
            var intLiteral = false;                                                                                    // 104
            // Hex                                                                                                     // 105
            if (stream.match(/^-?0x[0-9a-f]+/i)) {                                                                     // 106
              intLiteral = true;                                                                                       // 107
            }                                                                                                          // 108
            // Decimal                                                                                                 // 109
            if (stream.match(/^-?[1-9]\d*(e[\+\-]?\d+)?/)) {                                                           // 110
                intLiteral = true;                                                                                     // 111
            }                                                                                                          // 112
            // Zero by itself with no other piece of number.                                                           // 113
            if (stream.match(/^-?0(?![\dx])/i)) {                                                                      // 114
              intLiteral = true;                                                                                       // 115
            }                                                                                                          // 116
            if (intLiteral) {                                                                                          // 117
                return 'number';                                                                                       // 118
            }                                                                                                          // 119
        }                                                                                                              // 120
                                                                                                                       // 121
        // Handle strings                                                                                              // 122
        if (stream.match(stringPrefixes)) {                                                                            // 123
            state.tokenize = tokenFactory(stream.current(), 'string');                                                 // 124
            return state.tokenize(stream, state);                                                                      // 125
        }                                                                                                              // 126
        // Handle regex literals                                                                                       // 127
        if (stream.match(regexPrefixes)) {                                                                             // 128
            if (stream.current() != '/' || stream.match(/^.*\//, false)) { // prevent highlight of division            // 129
                state.tokenize = tokenFactory(stream.current(), 'string-2');                                           // 130
                return state.tokenize(stream, state);                                                                  // 131
            } else {                                                                                                   // 132
                stream.backUp(1);                                                                                      // 133
            }                                                                                                          // 134
        }                                                                                                              // 135
                                                                                                                       // 136
        // Handle operators and delimiters                                                                             // 137
        if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters)) {                                        // 138
            return 'punctuation';                                                                                      // 139
        }                                                                                                              // 140
        if (stream.match(doubleOperators)                                                                              // 141
            || stream.match(singleOperators)                                                                           // 142
            || stream.match(wordOperators)) {                                                                          // 143
            return 'operator';                                                                                         // 144
        }                                                                                                              // 145
        if (stream.match(singleDelimiters)) {                                                                          // 146
            return 'punctuation';                                                                                      // 147
        }                                                                                                              // 148
                                                                                                                       // 149
        if (stream.match(constants)) {                                                                                 // 150
            return 'atom';                                                                                             // 151
        }                                                                                                              // 152
                                                                                                                       // 153
        if (stream.match(keywords)) {                                                                                  // 154
            return 'keyword';                                                                                          // 155
        }                                                                                                              // 156
                                                                                                                       // 157
        if (stream.match(identifiers)) {                                                                               // 158
            return 'variable';                                                                                         // 159
        }                                                                                                              // 160
                                                                                                                       // 161
        if (stream.match(properties)) {                                                                                // 162
            return 'property';                                                                                         // 163
        }                                                                                                              // 164
                                                                                                                       // 165
        // Handle non-detected items                                                                                   // 166
        stream.next();                                                                                                 // 167
        return ERRORCLASS;                                                                                             // 168
    }                                                                                                                  // 169
                                                                                                                       // 170
    function tokenFactory(delimiter, outclass) {                                                                       // 171
        var singleline = delimiter.length == 1;                                                                        // 172
        return function(stream, state) {                                                                               // 173
            while (!stream.eol()) {                                                                                    // 174
                stream.eatWhile(/[^'"\/\\]/);                                                                          // 175
                if (stream.eat('\\')) {                                                                                // 176
                    stream.next();                                                                                     // 177
                    if (singleline && stream.eol()) {                                                                  // 178
                        return outclass;                                                                               // 179
                    }                                                                                                  // 180
                } else if (stream.match(delimiter)) {                                                                  // 181
                    state.tokenize = tokenBase;                                                                        // 182
                    return outclass;                                                                                   // 183
                } else {                                                                                               // 184
                    stream.eat(/['"\/]/);                                                                              // 185
                }                                                                                                      // 186
            }                                                                                                          // 187
            if (singleline) {                                                                                          // 188
                if (conf.mode.singleLineStringErrors) {                                                                // 189
                    outclass = ERRORCLASS;                                                                             // 190
                } else {                                                                                               // 191
                    state.tokenize = tokenBase;                                                                        // 192
                }                                                                                                      // 193
            }                                                                                                          // 194
            return outclass;                                                                                           // 195
        };                                                                                                             // 196
    }                                                                                                                  // 197
                                                                                                                       // 198
    function longComment(stream, state) {                                                                              // 199
        while (!stream.eol()) {                                                                                        // 200
            stream.eatWhile(/[^#]/);                                                                                   // 201
            if (stream.match("###")) {                                                                                 // 202
                state.tokenize = tokenBase;                                                                            // 203
                break;                                                                                                 // 204
            }                                                                                                          // 205
            stream.eatWhile("#");                                                                                      // 206
        }                                                                                                              // 207
        return "comment";                                                                                              // 208
    }                                                                                                                  // 209
                                                                                                                       // 210
    function indent(stream, state, type) {                                                                             // 211
        type = type || 'coffee';                                                                                       // 212
        var indentUnit = 0;                                                                                            // 213
        if (type === 'coffee') {                                                                                       // 214
            for (var i = 0; i < state.scopes.length; i++) {                                                            // 215
                if (state.scopes[i].type === 'coffee') {                                                               // 216
                    indentUnit = state.scopes[i].offset + conf.indentUnit;                                             // 217
                    break;                                                                                             // 218
                }                                                                                                      // 219
            }                                                                                                          // 220
        } else {                                                                                                       // 221
            indentUnit = stream.column() + stream.current().length;                                                    // 222
        }                                                                                                              // 223
        state.scopes.unshift({                                                                                         // 224
            offset: indentUnit,                                                                                        // 225
            type: type                                                                                                 // 226
        });                                                                                                            // 227
    }                                                                                                                  // 228
                                                                                                                       // 229
    function dedent(stream, state) {                                                                                   // 230
        if (state.scopes.length == 1) return;                                                                          // 231
        if (state.scopes[0].type === 'coffee') {                                                                       // 232
            var _indent = stream.indentation();                                                                        // 233
            var _indent_index = -1;                                                                                    // 234
            for (var i = 0; i < state.scopes.length; ++i) {                                                            // 235
                if (_indent === state.scopes[i].offset) {                                                              // 236
                    _indent_index = i;                                                                                 // 237
                    break;                                                                                             // 238
                }                                                                                                      // 239
            }                                                                                                          // 240
            if (_indent_index === -1) {                                                                                // 241
                return true;                                                                                           // 242
            }                                                                                                          // 243
            while (state.scopes[0].offset !== _indent) {                                                               // 244
                state.scopes.shift();                                                                                  // 245
            }                                                                                                          // 246
            return false;                                                                                              // 247
        } else {                                                                                                       // 248
            state.scopes.shift();                                                                                      // 249
            return false;                                                                                              // 250
        }                                                                                                              // 251
    }                                                                                                                  // 252
                                                                                                                       // 253
    function tokenLexer(stream, state) {                                                                               // 254
        var style = state.tokenize(stream, state);                                                                     // 255
        var current = stream.current();                                                                                // 256
                                                                                                                       // 257
        // Handle '.' connected identifiers                                                                            // 258
        if (current === '.') {                                                                                         // 259
            style = state.tokenize(stream, state);                                                                     // 260
            current = stream.current();                                                                                // 261
            if (/^\.[\w$]+$/.test(current)) {                                                                          // 262
                return 'variable';                                                                                     // 263
            } else {                                                                                                   // 264
                return ERRORCLASS;                                                                                     // 265
            }                                                                                                          // 266
        }                                                                                                              // 267
                                                                                                                       // 268
        // Handle scope changes.                                                                                       // 269
        if (current === 'return') {                                                                                    // 270
            state.dedent += 1;                                                                                         // 271
        }                                                                                                              // 272
        if (((current === '->' || current === '=>') &&                                                                 // 273
                  !state.lambda &&                                                                                     // 274
                  state.scopes[0].type == 'coffee' &&                                                                  // 275
                  stream.peek() === '')                                                                                // 276
               || style === 'indent') {                                                                                // 277
            indent(stream, state);                                                                                     // 278
        }                                                                                                              // 279
        var delimiter_index = '[({'.indexOf(current);                                                                  // 280
        if (delimiter_index !== -1) {                                                                                  // 281
            indent(stream, state, '])}'.slice(delimiter_index, delimiter_index+1));                                    // 282
        }                                                                                                              // 283
        if (indentKeywords.exec(current)){                                                                             // 284
            indent(stream, state);                                                                                     // 285
        }                                                                                                              // 286
        if (current == 'then'){                                                                                        // 287
            dedent(stream, state);                                                                                     // 288
        }                                                                                                              // 289
                                                                                                                       // 290
                                                                                                                       // 291
        if (style === 'dedent') {                                                                                      // 292
            if (dedent(stream, state)) {                                                                               // 293
                return ERRORCLASS;                                                                                     // 294
            }                                                                                                          // 295
        }                                                                                                              // 296
        delimiter_index = '])}'.indexOf(current);                                                                      // 297
        if (delimiter_index !== -1) {                                                                                  // 298
            if (dedent(stream, state)) {                                                                               // 299
                return ERRORCLASS;                                                                                     // 300
            }                                                                                                          // 301
        }                                                                                                              // 302
        if (state.dedent > 0 && stream.eol() && state.scopes[0].type == 'coffee') {                                    // 303
            if (state.scopes.length > 1) state.scopes.shift();                                                         // 304
            state.dedent -= 1;                                                                                         // 305
        }                                                                                                              // 306
                                                                                                                       // 307
        return style;                                                                                                  // 308
    }                                                                                                                  // 309
                                                                                                                       // 310
    var external = {                                                                                                   // 311
        startState: function(basecolumn) {                                                                             // 312
            return {                                                                                                   // 313
              tokenize: tokenBase,                                                                                     // 314
              scopes: [{offset:basecolumn || 0, type:'coffee'}],                                                       // 315
              lastToken: null,                                                                                         // 316
              lambda: false,                                                                                           // 317
              dedent: 0                                                                                                // 318
          };                                                                                                           // 319
        },                                                                                                             // 320
                                                                                                                       // 321
        token: function(stream, state) {                                                                               // 322
            var style = tokenLexer(stream, state);                                                                     // 323
                                                                                                                       // 324
            state.lastToken = {style:style, content: stream.current()};                                                // 325
                                                                                                                       // 326
            if (stream.eol() && stream.lambda) {                                                                       // 327
                state.lambda = false;                                                                                  // 328
            }                                                                                                          // 329
                                                                                                                       // 330
            return style;                                                                                              // 331
        },                                                                                                             // 332
                                                                                                                       // 333
        indent: function(state) {                                                                                      // 334
            if (state.tokenize != tokenBase) {                                                                         // 335
                return 0;                                                                                              // 336
            }                                                                                                          // 337
                                                                                                                       // 338
            return state.scopes[0].offset;                                                                             // 339
        },                                                                                                             // 340
                                                                                                                       // 341
        lineComment: "#",                                                                                              // 342
        fold: "indent"                                                                                                 // 343
    };                                                                                                                 // 344
    return external;                                                                                                   // 345
});                                                                                                                    // 346
                                                                                                                       // 347
CodeMirror.defineMIME('text/x-coffeescript', 'coffeescript');                                                          // 348
                                                                                                                       // 349
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/observatory/mars/template.observatory.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.__define__("logs_bootstrap",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"",["{",[[0,"theme"]]],"\" id=\"lb_id_containing_box\"><!-- theming support -->\n        <div id=\"id_logs_bootstrap\" ",["#",[[0,"if"],[0,"isDynamic"]],["class=\"observatory_panel ",["{",[[0,"height"]]],"\""],["class=\"observatory_panel_static  ",["#",[[0,"if"],[0,"isHidden"]],["lb_hidden"]],"\""]],">\n              ",["#",[[0,"if"],[0,"fullFeatured"]],["\n              <ul class=\"nav-tabs\" id=\"lb_main_tab\">\n                    <li><a href=\"#\" data-target=\"observatoryjsLogsTab\" id=\"id_logs_tab_btn\">Logs</a></li>\n                    <li><a href=\"#\" data-target=\"observatoryjsInternalsTab\" id=\"id_app_tab_btn\">Templates Inspection</a></li>\n                    <!-- <li><a href=\"#id_templates_tab\" id=\"id_templates_tab_btn\">Tests</a></li> -->\n                    <!-- <li><a href=\"#\" data-target=\"observatoryjsLogsSimple\" id=\"id_export_tab_btn\">Export</a></li> -->\n                    <li><a href=\"#\" data-target=\"observatoryjsHelpTab\" id=\"id_help_tab_btn\">Help</a></li>\n                    <li><button class=\"lb_btn pull-right\" type=\"button\" id=\"lb_btn_change_theme\">change theme</button></li>\n                   <!-- <li><button class=\"btn btn-mini btn-info\" type=\"button\" id=\"lb_btn_switch_dynamic\">toggle full page</button></li> -->\n                    <li><button class=\"lb_btn pull-right\" id=\"lb_btn_clear_logs\" type=\"button\" disabled>clear logs</button></li>\n                  <div id=\"lb_status_line\" class=\"pull-right\">\n                      ",["#",[[0,"with"],[0,"blGetSession"],"observatoryjs.ConnectionStatus"],["\n                      ",["#",[[0,"if"],[0,"connected"]],["\n                      <span style=\"color: #2c2;\">connected</span>\n                      "],["\n                      <span style=\"color: #c22;\">disconnected:</span>",["{",[[0,"reason"]]]," (",["{",[[0,"retryCount"]]],")\n                      | status: ",["{",[[0,"status"]]],"\n                      "]],"\n                      "]],"\n                  </div>\n              </ul>\n               "],["\n                <div id=\"lb_status_line\">\n                    ",["#",[[0,"with"],[0,"blGetSession"],"observatoryjs.ConnectionStatus"],["\n                    ",["#",[[0,"if"],[0,"connected"]],["\n                    <span style=\"color: #2c2;\">connected</span>\n                    "],["\n                    <span style=\"color: #c22;\">disconnected:</span>",["{",[[0,"reason"]]]," (",["{",[[0,"retryCount"]]],")\n                    | status: ",["{",[[0,"status"]]],"\n                    "]],"\n                    "]],"\n                </div>\n              "]],"\n\n        ",["!",[[0,"observatoryjsRenderCurrent"]]],"\n        </div>\n        <a class=\"observatory_trigger\" href=\"#\" id=\"btn_toggle_logs\">O!</a>\n        <a class=\"observatory_trigger\" href=\"#\" id=\"btn_toggle_session\">S!</a>\n    </div>\n\n        ",[">","observatoryjsSession"]]));
Template.__define__("observatoryjsLogsTab",Package.handlebars.Handlebars.json_ast_to_func(["<!-- logs tab tab -->\n    <div class=\"tab-pane\" style=\"height: 100%;\" id=\"observatoryjsLogsTab\" >\n\n        <div class=\"lb_scrollable\">\n            <table class=\"table table-condensed lb_table-striped\">\n                <thead>\n                <tr class=\"lb_header\">\n                    <th id=\"lbh_timestamp\" class=\"lb_timestamp\"><a href=\"#\">timestamp</a></th>\n                    <th id=\"lbh_user\" class=\"lb_user\"><a href=\"#\">user</a></th>\n                    <th id=\"lbh_source\" class=\"lb_server\"><a href=\"#\">src</a></th>\n                    <th id=\"lbh_module\" class=\"lb_module\"><a href=\"#\">module</a></th>\n                    <th id=\"lbh_severity\" class=\"lb_loglevel\"><a href=\"#\">severity</a></th>\n                    <th><a href=\"#\">message</a></th>\n                </tr>\n                </thead>\n                <tbody>\n                ",["#",[[0,"each"],[0,"log_messages"]],["\n                <tr class=\"",["{",[[0,"lb_loglevel_row_decoration"]]]," no_border\">\n                    <td class=\"lb_timestamp\">",["{",[[0,"format_timestamp"],[0,"timestamp"]]],"</td>\n                    <td class=\"lb_user\">",["{",[[0,"getUser"],[0]]],"</td>\n                    ",["#",[[0,"if"],[0,"isServer"]],["\n                    <td class=\"lb_server\"><span class=\"label label-inverse\">server</span></td>\n                    "],["\n                    <td class=\"lb_client\"><span class=\"label lb_test_label\">client</span></td>\n                    "]],"\n                    <td class=\"lb_module\">\n                        ",["#",[[0,"if"],[0,"module"]],["\n                        <span class=\"label label-primary\">",["{",[[0,"module"]]],"</span>\n                        "]],"\n                    </td>\n                    <td class=\"lb_loglevel\"><span class=\"label ",["{",[[0,"lb_loglevel_decoration"]]],"\">",["{",[[0,"loglevel_names"],[0,"severity"]]],"</span></td>\n                    <td class=\"lb_message\"><pre class=\" ",["{",[[0,"lb_loglevel_msg_decoration"]]],"\">",["{",[[0,"textMessage"]]],"</pre></td>\n                    "]],"\n                </tbody>\n            </table>\n        </div>\n\n\n    </div>"]));
Template.__define__("observatoryjsInternalsTab",Package.handlebars.Handlebars.json_ast_to_func(["<!-- templates & events tab -->\n    <div class=\"tab-pane\" style=\"height: 100%;\" >\n\n        <!-- application internals tab -->\n        <div class=\"lb_scrollable\" id=\"id_templates_div\">\n            <select id=\"selTemplateNames\">\n                ",["#",[[0,"each"],[0,"templates"]],["\n                <option value=\"",["{",[[0]]],"\">",["{",[[0]]],"</option>\n                "]],"\n            </select>\n\n            <table>\n                <tbody>\n                <tr>\n                    <th>main callbacks</th>\n                </tr>\n                <tr>\n                    <td><a href=\"#\" class=\"lb_template_events_list\" templateName=\"",["{",[[0,"selectedTemplateName"]]],"\" methodName=\"created\">created</a></td>\n                </tr>\n                <tr>\n                    <td><a href=\"#\" class=\"lb_template_events_list\" templateName=\"",["{",[[0,"selectedTemplateName"]]],"\" methodName=\"rendered\">rendered</a></td>\n                </tr>\n                <tr>\n                    <td><a href=\"#\" class=\"lb_template_events_list\" templateName=\"",["{",[[0,"selectedTemplateName"]]],"\" methodName=\"destroyed\">destroyed</a></td>\n                </tr>\n                <tr>\n                    <th>events</th>\n                </tr>\n                <tr>\n                    <td>\n                        ",["#",[[0,"each"],[0,"currentTemplateEvents"]],["\n                        <a href=\"#\" class=\"lb_template_events_list\" templateName=\"",["{",[[0,"selectedTemplateName"]]],"\" methodName=\"",["{",[[0]]],"\">",["{",[[0]]],"</a><br/>\n                        "]],"\n                    </td>\n                </tr>\n                <tr>\n                    <th>helpers</th>\n                </tr>\n                <tr>\n                    <td colspan=\"3\">\n                        ",["#",[[0,"each"],[0,"currentTemplateHelpers"]],["\n                        <a href=\"#\" class=\"lb_template_events_list\" templateName=\"",["{",[[0,"selectedTemplateName"]]],"\" methodName=\"",["{",[[0]]],"\">",["{",[[0]]],"</a><br/>\n                        "]],"\n                    </td>\n                </tr>\n                </tbody>\n            </table>\n            <div>\n                ",["#",[[0,"each"],[0,"blGetSession"],"observatoryjs.CurrentSubscriptions"],["\n                ",["{",[[0,"name"]]],": ",["{",[[0,"inactive"]]],": ",["{",[[0,"ready"]]]," <br/>\n                "]],"\n            </div>\n        </div>\n\n        <div id=\"lb_code_console\">\n        </div>\n    </div>"]));
Template.__define__("observatoryjsSession",Package.handlebars.Handlebars.json_ast_to_func(["<div class=\"",["{",[[0,"theme"]]],"\">\n    <div id=\"lb_session_popup\" class=\"",["{",[[0,"sessionWidth"]]],"\">\n        <table class=\"table table-condensed\" id=\"tableSession\" style=\"margin: 6px 6px 6px 6px\">\n            <thead>\n            <tr><th>Session</th></tr>\n            </thead>\n\n            <tbody>\n            ",["#",[[0,"each"],[0,"session_keys"]],["\n            <tr class=\"sessionKey\" style=\"padding: 0; margin: 0\">\n                <th class=\"\" style=\"padding: 0; margin: 0\">",["{",[[0,"key"]]],":</th>\n            </tr>\n            <tr class=\"\" style=\"padding: 0; margin: 0\">\n                <td class=\"\" style=\"padding: 0; margin: 0\">",["{",[[0,"value"]]],"</td>\n            </tr>\n            "]],"\n            </tbody>\n        </table>\n\n    </div>\n    </div>"]));
Template.__define__("observatoryjsHelpTab",Package.handlebars.Handlebars.json_ast_to_func(["<!-- help tab -->\n    <div id=\"id_help_tab\" class=\"tab-pane\" style=\"height:100%;\">\n        <div class=\"lb_scrollable\">\n            <p>Please see <a href=\"http://observatoryjs.com/\">Observatory web page</a> for the complete documentation. Since \n                <span class=\"label label-success\">version 0.3.0</span> we have shifted main development focus to Observatory: Vega\n                - cloud-based easy to use logging, monitoring and application management for your Meteor apps. \n                <a href=\"http://observatoryjs.com/\">Check it out!</a>\n            </p>\n            <p>\n                Observatory panel is controlled by pressing the \"O!\" button in the bottom-left corner of the page or \"ctrl + ~\" key:\n                you can have it small, medium,\n                large or completely turned off. By moving between tabs you can analyze logs (updated live), your application's templates with\n                events, as well as monitor other internals (currently, Session state, more to come). Everything is scrollable, logs are\n                sortable (just click on the column name).</p>\n            <p>\n                Session panel is controlled by clicking \"S!\" button or pressing \"~\" key.\n            </p>\n            <p>\n                We love to hear your feedback: please <a href=\"https://github.com/jhoxray/observatory\">submit your ideas,\n                questions, suggestions on Github</a> as issues!\n            </p>\n            <h5>Logging in a nutshell:</h5>\n            <p>\n                Simply call <code>tb = Observatory.getToolbox()</code> once in your app's common\n                code (that gets executed on both client and server) and then call the following obvious methods:\n                <code>tb.fatal(\"...\"), error, warn, info, verbose, debug</code>. Your logs will be updated automatically in the \"Log\" tab.\n                There's much, much more - <a href=\"http://observatoryjs.com/#docInstallation\">read the docs</a> for automagical logging,\n                monitoring, profiling and app management features!\n            </p>\n        </div>\n\n    </div>"]));
Template.__define__("observatoryjsLogsSimple",Package.handlebars.Handlebars.json_ast_to_func([["#",[[0,"each"],[0,"log_messages"]],["\n",["{",[[0,"full_message"]]],"<br/>\n"]]]));
                                                                                                                       // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/observatory/mars/observatoryTemplates.coffee.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _tlog;

_tlog = TLog.getLogger();

Meteor.startup(function() {
  return Handlebars.registerHelper("blGetSession", function(name) {
    return Session.get(name);
  });
});

Template.logs_bootstrap.events({
  "click #lb_main_tab": function(evt) {
    var tg;
    tg = evt.target.getAttribute("data-target");
    if (tg) {
      return Session.set("observatoryjs-currentRender", tg);
    }
  },
  "click #lb_btn_change_theme": function() {
    if (Session.get("bl_current_theme") === "lb_theme_dark") {
      Session.set("bl_current_theme", "lb_theme_light");
      return Session.set("bl_current_codemirror_theme", "solarized");
    } else {
      Session.set("bl_current_theme", "lb_theme_dark");
      return Session.set("bl_current_codemirror_theme", "ambiance");
    }
  },
  "click #lb_btn_clear_logs": function() {
    return TLog._clear();
  },
  "click #btn_toggle_session": function() {
    var w;
    w = Session.get("bl_current_session_width");
    switch (w) {
      case "lb_invisible":
        return Session.set("bl_current_session_width", "lb_width25");
      case "lb_width25":
        return Session.set("bl_current_session_width", "lb_width50");
      case "lb_width50":
        return Session.set("bl_current_session_width", "lb_invisible");
    }
  },
  "click #btn_toggle_logs": function(evt, tmpl) {
    return Template.logs_bootstrap.toggleLogs();
  }
});

Template.logs_bootstrap.helpers({
  observatoryjsRenderCurrent: function() {
    var tmpl;
    tmpl = Session.get("observatoryjs-currentRender");
    if (Template[tmpl]) {
      return new Handlebars.SafeString(Template[tmpl]());
    } else {
      return new Handlebars.SafeString(Template["observatoryjsLogsTab"]());
    }
  },
  isHidden: function() {
    return !(Session.get("bl_is_visible"));
  },
  isDynamic: function() {
    return Session.get("bl_is_dynamic");
  },
  fullFeatured: function() {
    return Session.get("bl_full_featured_panel");
  },
  theme: function() {
    return Session.get("bl_current_theme");
  },
  height: function() {
    return Session.get("bl_panel_height_class");
  }
});

_.extend(Template.logs_bootstrap, {
  toggleLogs: function() {
    var tt;
    switch (Session.get("bl_panel_height_class")) {
      case "height50":
        Session.set("bl_is_dynamic", false);
        Session.set("bl_panel_height_class", "height90");
        Session.set("bl_full_featured_panel", true);
        break;
      case "height90":
        Session.set("bl_panel_height_class", "");
        $("#id_logs_bootstrap").hide("fast");
        Session.set("bl_is_visible", false);
        break;
      case "height25":
        Session.set("bl_panel_height_class", "height50");
        Session.set("bl_full_featured_panel", true);
        break;
      case "":
        Session.set("bl_is_dynamic", true);
        Session.set("bl_panel_height_class", "height25");
        Session.set("bl_full_featured_panel", false);
        Session.set("bl_is_visible", true);
        $("#id_logs_bootstrap").removeClass("lb_hidden");
        $("#id_logs_bootstrap").show("slow");
    }
    Deps.flush();
    if (Session.equals("bl_is_visible", true)) {
      tt = $('#id_logs_bootstrap').outerHeight();
      return $("body").children().last().css('margin-bottom', tt + 20);
    } else {
      return $("body").children().last().css('margin-bottom', 0);
    }
  },
  destroyed: function() {},
  created: function() {
    var def;
    def = Session.get("bl_default_panel");
    if (def != null) {
      Template.logs_bootstrap.setDefault(def);
    } else {
      Template.logs_bootstrap.setDefault("hidden");
    }
    Session.setDefault("bl_current_codemirror_theme", "ambiance");
    Session.setDefault("bl_current_session_width", "lb_invisible");
    return Deps.autorun(function() {
      return Session.set("observatoryjs.ConnectionStatus", Meteor.status());
    });
  },
  rendered: function() {
    Session.setDefault("observatoryjs-currentRender", "observatoryjsLogsTab");
    return $('body').on('keydown', function(evt) {
      var w;
      evt.stopImmediatePropagation();
      if (evt.which === 192 && !$(evt.target).is("input")) {
        if (evt.ctrlKey) {
          return Template.logs_bootstrap.toggleLogs();
        } else {
          w = Session.get("bl_current_session_width");
          switch (w) {
            case "lb_invisible":
              return Session.set("bl_current_session_width", "lb_width25");
            case "lb_width25":
              return Session.set("bl_current_session_width", "lb_width50");
            case "lb_width50":
              return Session.set("bl_current_session_width", "lb_invisible");
          }
        }
      }
    });
  },
  setDefault: function(option) {
    switch (option) {
      case "hidden":
        Session.setDefault("bl_sort_desc", true);
        Session.setDefault("bl_sort_by", "timestamp");
        Session.setDefault("bl_full_featured_panel", false);
        Session.setDefault("bl_panel_height_class", "");
        Session.setDefault("bl_current_theme", "lb_theme_dark");
        Session.setDefault("bl_is_dynamic", false);
        return Session.setDefault("bl_is_visible", false);
      case "half":
        Session.setDefault("bl_sort_desc", true);
        Session.setDefault("bl_sort_by", "timestamp");
        Session.setDefault("bl_full_featured_panel", false);
        Session.setDefault("bl_panel_height_class", "height25");
        Session.setDefault("bl_current_theme", "lb_theme_dark");
        Session.setDefault("bl_is_dynamic", true);
        return Session.setDefault("bl_is_visible", true);
    }
  }
});

Template.observatoryjsInternalsTab.events({
  "mouseleave .lb_template_events_list": function(evt, templ) {
    var e, events, func, k, method, selTmpl, _i, _len, _ref, _ref1, _results;
    selTmpl = Template[evt.target.getAttribute("templateName")];
    if (selTmpl == null) {
      return;
    }
    method = evt.target.getAttribute("methodName");
    func = (_ref = selTmpl._tmpl_data) != null ? (_ref1 = _ref.events) != null ? _ref1[method] : void 0 : void 0;
    if (func) {
      events = method.split(',');
      _results = [];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        e = events[_i];
        k = e.split(' ');
        _results.push($(k[1]).removeClass("lb_highlight_element"));
      }
      return _results;
    }
  },
  "mouseenter .lb_template_events_list": function(evt, templ) {
    var e, events, func, k, method, selTmpl, strFunc, _i, _len, _ref, _ref1;
    selTmpl = Template[evt.target.getAttribute("templateName")];
    if (selTmpl == null) {
      return;
    }
    method = evt.target.getAttribute("methodName");
    if (method === "created" || method === "rendered" || method === "destroyed") {
      func = selTmpl[method];
      strFunc = "// Template." + evt.target.getAttribute("templateName") + "." + method + ":\n" + func;
    } else {
      func = (_ref = selTmpl._tmpl_data.events) != null ? _ref[method] : void 0;
      if (func) {
        strFunc = "// EVENT: " + method + ":\n" + func;
        events = method.split(',');
        for (_i = 0, _len = events.length; _i < _len; _i++) {
          e = events[_i];
          k = e.split(' ');
          $(k[1]).addClass("lb_highlight_element");
        }
      } else {
        func = (_ref1 = selTmpl._tmpl_data.helpers) != null ? _ref1[method] : void 0;
        strFunc = "// HELPER: " + method + ":\n" + func;
      }
    }
    return templ.myCodeMirror.setValue(strFunc);
  },
  "change #selTemplateNames": function(evt) {
    _tlog.debug($(evt.target).val());
    return Session.set("bl_selected_template_name", $(evt.target).val());
  }
});

Template.observatoryjsInternalsTab.helpers({
  selectedTemplateName: function() {
    return Session.get("bl_selected_template_name");
  },
  templates: function() {
    var rt;
    rt = Inspect.methods(Template);
    rt.sort();
    return rt;
  },
  currentTemplateEvents: function() {
    return Template.observatoryjsInternalsTab.getMethodMap("events", Session.get("bl_selected_template_name"));
  },
  currentTemplateHelpers: function() {
    return Template.observatoryjsInternalsTab.getMethodMap("helpers", Session.get("bl_selected_template_name"));
  }
});

_.extend(Template.observatoryjsInternalsTab, {
  destroyed: function() {},
  created: function() {
    /*
    @_handle = Meteor.setInterval =>
      @_subscriptions = (v for k,v of TLog._global_logs._manager?._subscriptions)
      @_collections = Meteor._LocalCollectionDriver.collections
      Session.set "observatoryjs.CurrentSubscriptions", @_subscriptions
    , 5000
    */

  },
  rendered: function() {
    $("#selTemplateNames").val(Session.get("bl_selected_template_name"));
    Session.set("bl_selected_template_name", $("#selTemplateNames").val());
    this.myCodeMirror = null;
    if (this.myCodeMirror == null) {
      return this.myCodeMirror = CodeMirror(document.getElementById("lb_code_console"), {
        value: "",
        mode: "javascript",
        theme: Session.get("bl_current_codemirror_theme"),
        readOnly: true
      });
    }
  },
  getMethodMap: function(type, tmpl) {
    var rt, tt, _ref, _ref1;
    rt = [];
    for (tt in (_ref = Template[tmpl]) != null ? (_ref1 = _ref._tmpl_data) != null ? _ref1[type] : void 0 : void 0) {
      rt.push(tt);
    }
    return rt.sort();
  }
});

Template.observatoryjsSession.helpers({
  sessionWidth: function() {
    return Session.get("bl_current_session_width");
  },
  theme: function() {
    return Session.get("bl_current_theme");
  },
  session_keys: function() {
    var key, rt;
    rt = [];
    for (key in Session.keys) {
      rt.push({
        "key": key,
        "value": JSON.stringify(Session.get(key))
      });
    }
    return rt.sort();
  }
});

Template.observatoryjsLogsTab.events({
  "click #lbh_timestamp": function() {
    var sort_desc;
    Session.set("bl_sort_by", "timestamp");
    sort_desc = Session.get("bl_sort_desc");
    if (sort_desc) {
      return Session.set("bl_sort_desc", false);
    } else {
      return Session.set("bl_sort_desc", true);
    }
  },
  "click #lbh_module": function() {
    var sort_desc;
    Session.set("bl_sort_by", "module");
    sort_desc = Session.get("bl_sort_desc");
    if (sort_desc) {
      return Session.set("bl_sort_desc", false);
    } else {
      return Session.set("bl_sort_desc", true);
    }
  },
  "click #lbh_severity": function() {
    var sort_desc;
    Session.set("bl_sort_by", "severity");
    sort_desc = Session.get("bl_sort_desc");
    if (sort_desc) {
      return Session.set("bl_sort_desc", false);
    } else {
      return Session.set("bl_sort_desc", true);
    }
  },
  "click #lbh_source": function() {
    var sort_desc;
    Session.set("bl_sort_by", "source");
    sort_desc = Session.get("bl_sort_desc");
    if (sort_desc) {
      return Session.set("bl_sort_desc", false);
    } else {
      return Session.set("bl_sort_desc", true);
    }
  }
});

Template.observatoryjsLogsTab.helpers({
  log_messages: function() {
    var sort, sort_order;
    sort_order = Session.get("bl_sort_desc") ? -1 : 1;
    sort = {
      timestamp: sort_order
    };
    switch (Session.get("bl_sort_by")) {
      case "severity":
        sort = {
          loglevel: sort_order
        };
        break;
      case "source":
        sort = {
          isServer: sort_order
        };
        break;
      case "module":
        sort = {
          module: sort_order
        };
    }
    return TLog._getLogs(sort);
  },
  loglevel_names: function(i) {
    return TLog.LOGLEVEL_NAMES[i];
  },
  format_timestamp: function(ts) {
    var d;
    d = new Date(ts);
    return Observatory.viewFormatters._convertDate(d) + ' ' + Observatory.viewFormatters._convertTime(d);
  },
  getUser: function(log) {
    var u, uid, user;
    uid = log.uid;
    user = "";
    if (uid) {
      u = Meteor.users.findOne(uid);
      if (u && u.username) {
        user = u.username;
      } else {
        if (u && u.emails && u.emails[0]) {
          user = u.emails[0].address;
        } else {
          user = uid;
        }
      }
    } else if (log.ip) {
      user = log.ip;
    }
    return user;
  },
  lb_loglevel_decoration: function() {
    var cl;
    switch (this.severity) {
      case TLog.LOGLEVEL_FATAL:
        return cl = "label-fatal";
      case TLog.LOGLEVEL_ERROR:
        return cl = "label-danger";
      case TLog.LOGLEVEL_WARNING:
        return cl = "label-warning";
      case TLog.LOGLEVEL_INFO:
        return cl = "label-primary";
      case TLog.LOGLEVEL_DEBUG:
        return cl = "lb_test_label";
      case TLog.LOGLEVEL_VERBOSE:
        return cl = "label-success";
    }
  },
  lb_loglevel_msg_decoration: function() {
    var cl;
    switch (this.severity) {
      case TLog.LOGLEVEL_FATAL:
        return cl = "lb_msg_error";
      case TLog.LOGLEVEL_ERROR:
        return cl = "text-error";
      case TLog.LOGLEVEL_WARNING:
        return cl = "lb_msg_warning";
    }
  },
  lb_loglevel_row_decoration: function() {
    var cl;
    switch (this.severity) {
      case TLog.LOGLEVEL_FATAL:
        return cl = "error";
      case TLog.LOGLEVEL_ERROR:
        return cl = "error";
      case TLog.LOGLEVEL_WARNING:
        return cl = "warning";
    }
  }
});

_.extend(Template.observatoryjsLogsSimple, {
  log_messages: function() {
    return TLog._getLogs();
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.observatory = {};

})();

//# sourceMappingURL=bf144a9f6d21b8b667a6fddf5c619739d344c00e.map
