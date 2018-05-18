(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"util/":5}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":4,"_process":2,"inherits":3}],6:[function(require,module,exports){
"use strict";
// AABB
// Simple bounding boxes
Object.defineProperty(exports, "__esModule", { value: true });
var AABB = /** @class */ (function () {
    // Constructor uses MAX and MIN Number values to allow easier AABB calculation
    function AABB(minX, maxX, minY, maxY) {
        if (minX === void 0) { minX = Number.MAX_VALUE; }
        if (maxX === void 0) { maxX = Number.MIN_VALUE; }
        if (minY === void 0) { minY = Number.MAX_VALUE; }
        if (maxY === void 0) { maxY = Number.MIN_VALUE; }
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }
    AABB.FromRect = function (x, y, width, height) {
        var aabb = new AABB(x, x + width, y, y + height);
        return aabb;
    };
    AABB.prototype.isPointInside = function (px, py) {
        if (px < this.minX || px > this.maxX || py < this.minY || py > this.maxY) {
            return false;
        }
        else {
            return true;
        }
    };
    Object.defineProperty(AABB.prototype, "width", {
        get: function () {
            return Math.abs(this.maxX - this.minX);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "height", {
        get: function () {
            return Math.abs(this.maxY - this.minY);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "center", {
        get: function () {
            return [this.minX + this.width / 2, this.minY + this.height / 2];
        },
        enumerable: true,
        configurable: true
    });
    return AABB;
}());
exports.AABB = AABB;

},{}],7:[function(require,module,exports){
"use strict";
// App
// Entry point for application
// Manages app/browser level functionality
Object.defineProperty(exports, "__esModule", { value: true });
var composer_1 = require("./composer");
var events_1 = require("./events");
var ui_1 = require("./ui");
var vec2_1 = require("./vec2");
exports.PALETTE = ["#880000", "#CC44CC", "#00CC55", "#0000AA", "#EEEE77", "#DD8855"];
var App = /** @class */ (function () {
    function App(canvas, context) {
        var _this = this;
        // Translate low level input events to higher level events:
        // - onMouseClick: indicates a down then up with no movement in-between
        // - onMouseOver: indicates mouse movement over frame
        // - onMouseLeave: indicates mouse moved out of the frame
        // Mouse drag applies to the same frame until drag ends (even if cursor left frame):
        // - onMouseDragBegin: indicates a button down and move action start
        // - onMouseDragUpdate: indicates a continued drag event
        // - onMouseDragEnd: indicates a button up after dragging
        this.onMouseDown = function (event) {
            _this.mouseDownPos = new vec2_1.Vec2(event.x - _this.appCanvas.canvas.offsetLeft, event.y - _this.appCanvas.canvas.offsetTop + window.pageYOffset);
            _this.mouseDown = true;
        };
        this.onMouseMove = function (event) {
            var pos = new vec2_1.Vec2(event.x - _this.appCanvas.canvas.offsetLeft, event.y - _this.appCanvas.canvas.offsetTop + window.pageYOffset);
            if (_this.mouseDown) {
                // begin of drag
                _this.mouseDragFrame = _this.getFrame(_this.mouseDownPos);
                _this.mouseDragFrame.onMouseDragBegin(_this.mouseDownPos.x, _this.mouseDownPos.y);
                _this.mouseDrag = true;
                _this.mouseDown = false;
            }
            else if (_this.mouseDrag) {
                // drag update
                _this.mouseDragFrame.onMouseDragUpdate(pos.x, pos.y);
            }
            else {
                // mouse over
                var overFrame = _this.getFrame(pos);
                overFrame.onMouseOver(pos.x, pos.y);
                if (_this.mouseOverFrame !== null && _this.mouseOverFrame !== overFrame) {
                    // Mouse moved out of a frame
                    _this.mouseOverFrame.onMouseLeave();
                }
                _this.mouseOverFrame = overFrame;
            }
        };
        this.onMouseUp = function (event) {
            var pos = new vec2_1.Vec2(event.x - _this.appCanvas.canvas.offsetLeft, event.y - _this.appCanvas.canvas.offsetTop + window.pageYOffset);
            if (_this.mouseDrag) {
                // drag over
                _this.mouseDragFrame.onMouseDragEnd(pos.x, pos.y);
                _this.mouseDrag = false;
            }
            else if (_this.mouseDown) {
                // click
                _this.getFrame(pos).onMouseClick(pos.x, pos.y);
                _this.mouseDown = false;
            }
        };
        // App Canvas
        this.appCanvas = { canvas: canvas, context: context };
        // Create collision canvas
        this.appCanvas.collCanvas = document.createElement("canvas");
        this.appCanvas.collCanvas.width = this.appCanvas.canvas.width;
        this.appCanvas.collCanvas.height = this.appCanvas.canvas.height;
        this.appCanvas.collContext = this.appCanvas.collCanvas.getContext("2d");
        // Mouse events data init
        this.mouseDownPos = null;
        this.mouseDown = false;
        this.mouseDrag = false;
        this.mouseOverFrame = null;
        this.mouseDragFrame = null;
    }
    App.prototype.start = function () {
        var ctx = this.appCanvas.context;
        var canvas = this.appCanvas.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.appEvents = new events_1.AppEvents();
        // Init Frames
        var uiWidth = 50;
        this.uiFrame = new ui_1.UIFrame(this.appEvents, this.appCanvas, 0, uiWidth);
        this.composerFrame = new composer_1.ComposerFrame(this.appEvents, this.appCanvas, 0, canvas.width);
        canvas.addEventListener("mousedown", this.onMouseDown, false);
        canvas.addEventListener("mouseup", this.onMouseUp, false);
        canvas.addEventListener("mousemove", this.onMouseMove, false);
    };
    App.prototype.onFrame = function () {
        var collCtx = this.appCanvas.collContext;
        var collCanvas = this.appCanvas.collCanvas;
        // Run events dispatch
        this.appEvents.runEventDispatcher([this.uiFrame, this.composerFrame]);
        // Clear collision frame
        collCtx.clearRect(0, 0, collCanvas.width, collCanvas.height);
        this.composerFrame.draw();
        this.uiFrame.draw();
    };
    App.prototype.getFrame = function (pos) {
        return this.uiFrame.boundingBox.isPointInside(pos.x, pos.y) ? this.uiFrame : this.composerFrame;
    };
    return App;
}());
exports.App = App;

},{"./composer":11,"./events":12,"./ui":21,"./vec2":22}],8:[function(require,module,exports){
"use strict";
// Button
// Handles simple UI buttons interactions.
Object.defineProperty(exports, "__esModule", { value: true });
var aabb_1 = require("./aabb");
var canvas_tools_1 = require("./canvas-tools");
var Button = /** @class */ (function () {
    function Button(name, eventType, eventData, x, y, width, height, tooltip, icon, enabled, color) {
        if (enabled === void 0) { enabled = true; }
        this.enabled = enabled;
        this.name = name;
        this.event = { data: eventData, type: eventType };
        this.aabb = aabb_1.AABB.FromRect(x, y, width, height);
        this.icon = icon;
        this.color = color !== undefined ? color : "#aab";
        this.tooltip = tooltip;
        this.base = new Path2D();
        this.base.rect(x, y, width, height);
        this.wasClicked = 0;
    }
    Button.prototype.draw = function (ctx, defaultLineWidth) {
        this.drawButton(ctx, defaultLineWidth);
        if (this.mouseOver) {
            this.drawTooltip(ctx);
        }
        if (this.wasClicked > 0) {
            this.wasClicked--;
        }
    };
    Button.prototype.click = function (appEvents) {
        this.wasClicked = 6;
        appEvents.broadcastEvent(this.event.type, this.event.data);
    };
    Object.defineProperty(Button.prototype, "boundingBox", {
        // Accessors
        get: function () {
            return this.aabb;
        },
        enumerable: true,
        configurable: true
    });
    // Privates
    Button.prototype.drawButton = function (ctx, defaultLineWidth) {
        var bgColor = "#80aaaabb";
        var borderColor = "#888";
        var iconColor = "#888";
        if (this.enabled) {
            // Set interaction colors
            bgColor = this.wasClicked === 0 ? this.color : "#000";
            borderColor = "#fff";
            iconColor = this.mouseOver ? "#7300f7" : "#fff";
        }
        // Button background
        canvas_tools_1.CanvasTools.DrawPath(ctx, this.base, bgColor, borderColor);
        // Icon
        if (this.icon != null) {
            canvas_tools_1.CanvasTools.FillPath(ctx, this.icon, iconColor);
        }
        // Highlight
        if (this.enabled && this.mouseOver === true) {
            canvas_tools_1.CanvasTools.StrokePath(ctx, this.base, "#fff", 2.5);
        }
    };
    Button.prototype.drawTooltip = function (ctx) {
        if (this.tooltip != null && this.tooltip.length > 0) {
            var tbox = aabb_1.AABB.FromRect(this.aabb.minX + this.aabb.width - 1, this.aabb.minY + this.aabb.height / 2 - 13, 140, 25);
            var path = new Path2D();
            path.rect(tbox.minX, tbox.minY, tbox.width, tbox.height);
            canvas_tools_1.CanvasTools.DrawPath(ctx, path, "#fffecc", "#000");
            ctx.fillStyle = "#000";
            ctx.fillText(this.tooltip, tbox.minX + 3, tbox.minY + tbox.height / 2 + 4, tbox.width);
        }
    };
    return Button;
}());
exports.Button = Button;

},{"./aabb":6,"./canvas-tools":9}],9:[function(require,module,exports){
"use strict";
// CanvasTools
// Shortcuts to some frequently used canvas routines.
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasTools = /** @class */ (function () {
    function CanvasTools() {
    }
    CanvasTools.DrawLine = function (ctx, color, start, delta) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(start[0] + delta[0], start[1] + delta[1]);
        ctx.stroke();
    };
    CanvasTools.DrawPath = function (ctx, path, fillColor, strokeColor) {
        // Button background
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.fill(path);
        ctx.strokeStyle = strokeColor;
        ctx.stroke(path);
    };
    CanvasTools.DrawCircle = function (ctx, x, y, radius, fillColor, strokeColor, lineWidth) {
        if (lineWidth === void 0) { lineWidth = 1.0; }
        ctx.save();
        ctx.beginPath();
        ctx.fillColor = fillColor;
        ctx.strokeColor = strokeColor;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    };
    CanvasTools.FillPath = function (ctx, path, fillColor) {
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.fill(path);
    };
    CanvasTools.StrokePath = function (ctx, path, strokeColor, lineWidth) {
        if (lineWidth === void 0) { lineWidth = 1.0; }
        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.stroke(path);
        ctx.restore();
    };
    CanvasTools.StrokeRect = function (ctx, rect, strokeColor, lineWidth) {
        if (lineWidth === void 0) { lineWidth = 1.0; }
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.restore();
    };
    return CanvasTools;
}());
exports.CanvasTools = CanvasTools;

},{}],10:[function(require,module,exports){
"use strict";
// Collision
// Collision operations for shapes.
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var ENTITY_COLOR_MULTIPLIER = 0x20;
var Collision = /** @class */ (function () {
    function Collision() {
    }
    // Converts entity id to html color as a string: #NNNNNN
    Collision.IdToColor = function (id) {
        var color = (id * ENTITY_COLOR_MULTIPLIER).toString(16);
        assert(color.length <= 6);
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    };
    // Converts html color (#NNNNNN) to entity id
    Collision.ColorToId = function (color) {
        return (parseInt(color.substr(1), 16) & 0xffffff) / ENTITY_COLOR_MULTIPLIER;
    };
    // Data given as: [R,G,B,A]
    Collision.RGBToId = function (data) {
        return ((data[0] << 16) + (data[1] << 8) + data[2]) / ENTITY_COLOR_MULTIPLIER;
    };
    return Collision;
}());
exports.Collision = Collision;

},{"assert":1}],11:[function(require,module,exports){
"use strict";
// ComposerFrame
// ShapeComposer window and functionality.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var collision_1 = require("./collision");
var events = require("./events");
var frame_1 = require("./frame");
var persistence_1 = require("./persistence");
var selection_box_1 = require("./selection-box");
var shape_1 = require("./shape");
var shape_tools_1 = require("./shape-tools");
var vec2_1 = require("./vec2");
var ComposerFrame = /** @class */ (function (_super) {
    __extends(ComposerFrame, _super);
    function ComposerFrame(appEvents, appCanvas, startx, width) {
        var _this = _super.call(this, appEvents, appCanvas, startx, width) || this;
        // Mouse interactions
        _this.onMouseOver = function (mouseX, mouseY) {
            // Reset mouse over highlight
            if (_this.mouseOverShape) {
                _this.mouseOverShape.mouseOver = false;
            }
            // Changing mouse cursor if over selectionBox
            if (_this.selectionBox) {
                if (_this.selectionBox.isInsideTransform(mouseX, mouseY)) {
                    _this.selectionBox.onMouseOver(_this.appCanvas, mouseX, mouseY);
                }
                else {
                    _this.selectionBox.resetMouseCursor(_this.appCanvas);
                }
            }
            // Check pixel at mouse position from collision canvas for shape id
            var shape = _this.getShapeCollision(mouseX, mouseY);
            if (shape) {
                shape.mouseOver = true;
                _this.mouseOverShape = shape;
            }
            else {
                _this.mouseOverShape = null;
            }
        };
        _this.onMouseLeave = function () {
            if (_this.mouseOverShape) {
                _this.mouseOverShape.mouseOver = false;
                _this.mouseOverShape = null;
            }
            if (_this.selectionBox) {
                _this.selectionBox.resetMouseCursor(_this.appCanvas);
            }
        };
        _this.onMouseClick = function (mouseX, mouseY) {
            var shape = _this.getShapeCollision(mouseX, mouseY);
            if (shape) {
                _this.selectionBox = new selection_box_1.SelectionBox(shape, _this.appEvents);
            }
            else {
                _this.unselect();
            }
        };
        _this.onMouseDragBegin = function (mouseX, mouseY) {
            var dragTaken = false;
            if (_this.selectionBox) {
                dragTaken = _this.selectionBox.onMouseDragBegin(mouseX, mouseY);
            }
            // If dragging on non-selected shape, select and drag that shape!
            if (!dragTaken) {
                var shape = _this.getShapeCollision(mouseX, mouseY);
                if (shape) {
                    _this.unselect(true);
                    _this.selectionBox = new selection_box_1.SelectionBox(shape, _this.appEvents);
                    _this.selectionBox.onMouseDragBegin(mouseX, mouseY);
                }
            }
        };
        _this.onMouseDragUpdate = function (mouseX, mouseY) {
            if (_this.selectionBox) {
                _this.selectionBox.onMouseDragUpdate(mouseX, mouseY);
            }
        };
        _this.onMouseDragEnd = function (mouseX, mouseY) {
            if (_this.selectionBox) {
                _this.selectionBox.onMouseDragEnd(mouseX, mouseY);
            }
        };
        _this.bgColor = "#ddd";
        _this.loadScene();
        return _this;
    }
    // Draw everything
    ComposerFrame.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.appCanvas.context.lineWidth = 0.5;
        this.appCanvas.context.font = "13px arial";
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            shape.draw(this.appCanvas, 0.5);
        }
        if (this.selectionBox) {
            this.selectionBox.draw(this.appCanvas);
        }
    };
    // Events
    ComposerFrame.prototype.onEvent = function (event) {
        if (event.type === events.Events.CREATE) {
            var d = Math.floor(Math.random() * 128 + 128);
            this.shapes.push(this.translateShape(this.createShape(event.data, d, d, this.randomColor()), 64 + Math.random() * (this.width - 128), 64 + Math.random() * (this.height - 128)));
            this.appEvents.broadcastEvent(events.Events.STORESCENE);
        }
        else if (event.type === events.Events.DELETE) {
            if (this.selectionBox) {
                var shape = this.selectionBox.selectedShape;
                this.unselect();
                var idx = this.shapes.indexOf(shape);
                if (idx > -1) {
                    this.shapes.splice(idx, 1);
                }
            }
            this.appEvents.broadcastEvent(events.Events.STORESCENE);
        }
        else if (event.type === events.Events.RESETSCENE) {
            this.unselect();
            this.resetScene();
        }
        else if (event.type === events.Events.STORESCENE) {
            this.storeScene();
        }
    };
    // Privates
    ComposerFrame.prototype.resetScene = function () {
        // Create starter shapes
        this.shapes = [];
        this.shapes.push(this.translateShape(this.createShape(shape_1.EShape.rect, 128, 128, this.randomColor()), this.width / 2 - 128, this.height / 2 - 92));
        this.shapes.push(this.translateShape(this.createShape(shape_1.EShape.circle, 128, 128, this.randomColor()), this.width / 2 + 128, this.height / 2 - 92));
        this.shapes.push(this.translateShape(this.createShape(shape_1.EShape.triangle, 128, 128, this.randomColor()), this.width / 2 - 128, this.height / 2 + 92));
        this.shapes.push(this.translateShape(this.createShape(shape_1.EShape.star, 128, 128, this.randomColor()), this.width / 2 + 128, this.height / 2 + 92));
        this.storeScene();
    };
    ComposerFrame.prototype.storeScene = function () {
        var scene = [];
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            scene.push(shape.data);
        }
        persistence_1.Persistence.storeData(JSON.stringify(scene));
    };
    ComposerFrame.prototype.loadScene = function () {
        if (persistence_1.Persistence.hasPreviousScene()) {
            this.shapes = [];
            var save = JSON.parse(persistence_1.Persistence.loadData());
            for (var _i = 0, save_1 = save; _i < save_1.length; _i++) {
                var shape = save_1[_i];
                var verts = [];
                for (var _a = 0, _b = shape.verts; _a < _b.length; _a++) {
                    var v = _b[_a];
                    verts.push(new vec2_1.Vec2(v.x, v.y));
                }
                this.shapes.push(new shape_1.Shape(verts, shape.color));
            }
        }
        else {
            this.resetScene();
        }
    };
    ComposerFrame.prototype.unselect = function (dontSendEvent) {
        if (dontSendEvent === void 0) { dontSendEvent = false; }
        if (this.selectionBox) {
            this.selectionBox.onUnselect(dontSendEvent);
            this.selectionBox = null;
        }
    };
    ComposerFrame.prototype.randomColor = function () {
        return app_1.PALETTE[Math.floor(Math.random() * app_1.PALETTE.length)];
    };
    // Gets shape by Id, returns null if no shape matches Id
    ComposerFrame.prototype.getShape = function (id) {
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            if (shape.id === id) {
                return shape;
            }
        }
        return null;
    };
    // Returns: shape under given x, y. null if nothing is there.
    ComposerFrame.prototype.getShapeCollision = function (x, y) {
        var collisionId = collision_1.Collision.RGBToId(this.appCanvas.collContext.getImageData(x, y, 1, 1).data);
        return collisionId > 0 ? this.getShape(collisionId) : null;
    };
    ComposerFrame.prototype.createShape = function (type, width, height, color) {
        var verts = [];
        switch (type) {
            case shape_1.EShape.rect:
                verts = shape_tools_1.ShapeTools.Rect(width, height);
                break;
            case shape_1.EShape.circle:
                verts = shape_tools_1.ShapeTools.Circle(width / 2);
                break;
            case shape_1.EShape.triangle:
                verts = shape_tools_1.ShapeTools.Triangle(width, height);
                break;
            case shape_1.EShape.star:
                verts = shape_tools_1.ShapeTools.Star(width / 2);
                break;
        }
        return new shape_1.Shape(verts, color);
    };
    ComposerFrame.prototype.translateShape = function (shape, dx, dy) {
        shape.translate(dx, dy);
        return shape;
    };
    return ComposerFrame;
}(frame_1.Frame));
exports.ComposerFrame = ComposerFrame;

},{"./app":7,"./collision":10,"./events":12,"./frame":13,"./persistence":16,"./selection-box":18,"./shape":20,"./shape-tools":19,"./vec2":22}],12:[function(require,module,exports){
"use strict";
// AppEvents
// Classes for event management and dispatch.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = {
    CREATE: "create",
    DELETE: "delete",
    NOSELECTION: "noselection",
    RESETSCENE: "reset",
    SELECTION: "selection",
    STORESCENE: "store" // Scene changed, store scene data for persistency
};
var AppEvents = /** @class */ (function () {
    function AppEvents() {
        this.events = [];
    }
    AppEvents.prototype.broadcastEvent = function (type, data) {
        if (data === void 0) { data = null; }
        this.events.push({ type: type, data: data });
    };
    AppEvents.prototype.runEventDispatcher = function (frames) {
        if (this.events.length > 0) {
            // Extract current events for iteration so any events added
            // during any onEvent call will be dispatched next frame:
            var evs = this.events.splice(0, this.events.length);
            while (evs.length > 0) {
                var e = evs.pop();
                for (var _i = 0, frames_1 = frames; _i < frames_1.length; _i++) {
                    var f = frames_1[_i];
                    f.onEvent(e);
                }
            }
        }
    };
    return AppEvents;
}());
exports.AppEvents = AppEvents;

},{}],13:[function(require,module,exports){
"use strict";
// Frame
// Base class for UI and Composer frames
// Handles any shared functionality.
Object.defineProperty(exports, "__esModule", { value: true });
var aabb_1 = require("./aabb");
var Frame = /** @class */ (function () {
    function Frame(appEvents, appCanvas, startx, width) {
        this.appEvents = appEvents;
        this.appCanvas = appCanvas;
        this.startx = startx;
        this.width = width;
        this.height = this.appCanvas.canvas.height;
        this.bgColor = "#000";
        this.aabb = new aabb_1.AABB(startx, startx + width, 0, this.height);
    }
    Frame.prototype.draw = function () {
        this.appCanvas.context.beginPath();
        this.appCanvas.context.fillStyle = this.bgColor;
        this.appCanvas.context.fillRect(this.startx, 0, this.width, this.height);
    };
    Frame.prototype.onEvent = function (event) {
        // For receiving events
    };
    Object.defineProperty(Frame.prototype, "boundingBox", {
        // Accessors
        get: function () {
            return this.aabb;
        },
        enumerable: true,
        configurable: true
    });
    return Frame;
}());
exports.Frame = Frame;

},{"./aabb":6}],14:[function(require,module,exports){
"use strict";
// Shape Composer 2
// App entry script
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var app = null;
function viewLoop() {
    requestAnimationFrame(viewLoop);
    app.onFrame();
}
window.onload = function () {
    var elt = document.getElementById("loadingMessage");
    elt.innerText = "";
    var canvas = document.getElementById("scCanvas");
    var context = canvas.getContext("2d");
    // fix for double-click to select
    canvas.onselectstart = function () {
        return false;
    };
    app = new app_1.App(canvas, context);
    app.start();
    viewLoop();
};

},{"./app":7}],15:[function(require,module,exports){
"use strict";
// MouseCursor
// Provides functions for setting mouse cursor.
Object.defineProperty(exports, "__esModule", { value: true });
var cursors = [
    "auto",
    "nw-resize",
    "n-resize",
    "ne-resize",
    "w-resize",
    "move",
    "e-resize",
    "sw-resize",
    "s-resize",
    "se-resize",
    "col-resize"
];
var MouseCursor = /** @class */ (function () {
    function MouseCursor() {
    }
    MouseCursor.ResetMouseCursor = function (appCanvas) {
        appCanvas.canvas.style.cursor = "auto";
    };
    // Set cursor to movement cross
    MouseCursor.SetMouseCursorToCross = function (appCanvas) {
        appCanvas.canvas.style.cursor = "move";
    };
    // Set cursor to directional scaling or movement cross:
    //   8  1  2   NW N NE
    //   7  9  3 = W  +  E
    //   6  5  4   SW S SE
    MouseCursor.SetMouseCursorTransform = function (appCanvas, mode) {
        appCanvas.canvas.style.cursor = cursors[mode];
    };
    MouseCursor.SetMouseCursorRotator = function (appCanvas) {
        appCanvas.canvas.style.cursor = "col-resize";
    };
    return MouseCursor;
}());
exports.MouseCursor = MouseCursor;

},{}],16:[function(require,module,exports){
"use strict";
// Persistence
// Handles global persistency operations.
Object.defineProperty(exports, "__esModule", { value: true });
var Persistence = /** @class */ (function () {
    function Persistence() {
    }
    Persistence.hasPreviousScene = function () {
        return window.localStorage.getItem(this.STORAGE_NAME) !== null;
    };
    Persistence.loadData = function () {
        return window.localStorage.getItem(this.DATA_NAME);
    };
    Persistence.storeData = function (data) {
        window.localStorage.clear();
        window.localStorage.setItem(this.STORAGE_NAME, "true");
        window.localStorage.setItem(this.DATA_NAME, data);
    };
    Persistence.STORAGE_NAME = "Verse2";
    Persistence.DATA_NAME = "verse2data";
    return Persistence;
}());
exports.Persistence = Persistence;

},{}],17:[function(require,module,exports){
"use strict";
// Rect
// Simple rect class
Object.defineProperty(exports, "__esModule", { value: true });
var Rect = /** @class */ (function () {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    return Rect;
}());
exports.Rect = Rect;

},{}],18:[function(require,module,exports){
"use strict";
// Selection Box
// Handles selection box representation and operations.
Object.defineProperty(exports, "__esModule", { value: true });
var aabb_1 = require("./aabb");
var canvas_tools_1 = require("./canvas-tools");
var events = require("./events");
var mouse_cursor_1 = require("./mouse-cursor");
var rect_1 = require("./rect");
var vec2_1 = require("./vec2");
var SCALER_THICKNESS = 10;
var ROTATOR_DISTANCE = 20;
var ROTATOR_RADIUS = 7;
var ETransformMode;
(function (ETransformMode) {
    ETransformMode[ETransformMode["None"] = 0] = "None";
    ETransformMode[ETransformMode["Moving"] = 1] = "Moving";
    ETransformMode[ETransformMode["Rotating"] = 2] = "Rotating";
    ETransformMode[ETransformMode["Scaling"] = 3] = "Scaling";
})(ETransformMode || (ETransformMode = {}));
// Selection box broadcasts two events:
// 1. Event indicating something was selected (dispatched on construction)
// 2. Event indicating nothing is selected (called before destruction: onUnselect)
var SelectionBox = /** @class */ (function () {
    function SelectionBox(shape, appEvents) {
        this.shape = shape;
        this.appEvents = appEvents;
        this.appEvents.broadcastEvent(events.Events.SELECTION);
        this.transformMode = ETransformMode.None;
        this.lastTransformPos = new vec2_1.Vec2(0, 0);
        this.scalerMultiplier = 1.0;
        this.updateAABBs(this.shape);
    }
    SelectionBox.prototype.draw = function (appCanvas) {
        // Selection box is made up of:
        // - 3 rectangles to indicate bounds
        // - 4 corner circles to show corner scaling areas
        // - 1 circle at the top toe show rotation
        var corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        var context = appCanvas.context;
        var aabb = this.shape.boundingBox;
        // Bounding boxes
        var rc = new rect_1.Rect(aabb.minX + 1, aabb.minY + 1, aabb.width - 2, aabb.height - 2);
        canvas_tools_1.CanvasTools.StrokeRect(context, rc, "#0f0f0f", 2.0);
        rc = new rect_1.Rect(aabb.minX + 3, aabb.minY + 3, aabb.width - 6, aabb.height - 6);
        canvas_tools_1.CanvasTools.StrokeRect(context, rc, "#fff", 3.0);
        // Scaler circles
        context.strokeStyle = "#222";
        context.lineWidth = 2.0;
        context.fillStyle = "#efe";
        for (var _i = 0, corners_1 = corners; _i < corners_1.length; _i++) {
            var c = corners_1[_i];
            canvas_tools_1.CanvasTools.DrawCircle(context, aabb.center[0] + c[0] * aabb.width / 2 + -c[0] * 4, aabb.center[1] + c[1] * aabb.height / 2 - c[1] * 4, 4, "#efe", "#222", 2.0);
        }
        // Dashed border line
        context.setLineDash([2, 2]);
        rc = new rect_1.Rect(aabb.minX, aabb.minY, aabb.width, aabb.height);
        canvas_tools_1.CanvasTools.StrokeRect(context, rc, "#fff", 1.0);
        // Boundary to rotation circle dashed line
        context.setLineDash([2, 2]);
        canvas_tools_1.CanvasTools.DrawLine(context, "#fff", [aabb.center[0], aabb.minY], [0, -ROTATOR_DISTANCE]);
        context.setLineDash([]);
        // Rotation circle
        canvas_tools_1.CanvasTools.DrawCircle(context, aabb.center[0], aabb.minY - 20, ROTATOR_RADIUS, "#fff", "#222");
        this.updateAABBs(this.shape);
    };
    SelectionBox.prototype.isInsideTransform = function (mouseX, mouseY) {
        return (this.aabb.isPointInside(mouseX, mouseY) || this.aabbRotator.isPointInside(mouseX, mouseY));
    };
    SelectionBox.prototype.onUnselect = function (dontSendEvent) {
        if (dontSendEvent === void 0) { dontSendEvent = false; }
        if (!dontSendEvent) {
            this.appEvents.broadcastEvent(events.Events.NOSELECTION);
        }
        // If unselected while transforming, store scene event
        if (this.transformMode !== ETransformMode.None) {
            this.appEvents.broadcastEvent(events.Events.STORESCENE);
        }
    };
    SelectionBox.prototype.onMouseOver = function (appCanvas, mouseX, mouseY) {
        var transformMode = this.determineTransformMode(mouseX, mouseY);
        mouse_cursor_1.MouseCursor.SetMouseCursorTransform(appCanvas, transformMode);
    };
    // Returns: true if drag is on selection box, false if not
    SelectionBox.prototype.onMouseDragBegin = function (mouseX, mouseY) {
        var transformType = this.determineTransformMode(mouseX, mouseY);
        this.lastTransformPos = new vec2_1.Vec2(mouseX, mouseY);
        if (transformType === 10) {
            // Rotation circle
            this.transformMode = ETransformMode.Rotating;
        }
        else if (transformType === 5) {
            // Moving (central area)
            this.transformMode = ETransformMode.Moving;
        }
        else if (transformType > 0) {
            // Scalers
            // for scaling to match selection box: property scalerMultipler is set
            // by determineTransformMode to 1 for edges, and sqrt(2) for corners
            this.transformMode = ETransformMode.Scaling;
        }
        else {
            this.transformMode = ETransformMode.None;
            return false;
        }
        return true;
    };
    SelectionBox.prototype.onMouseDragUpdate = function (mouseX, mouseY) {
        if (this.transformMode !== ETransformMode.None) {
            var currPos = new vec2_1.Vec2(mouseX, mouseY);
            // Transforming shape
            if (this.transformMode === ETransformMode.Moving) {
                // ---- Translation
                this.shape.translate(currPos.x - this.lastTransformPos.x, currPos.y - this.lastTransformPos.y);
            }
            else if (this.transformMode === ETransformMode.Rotating) {
                // ---- Rotation
                var rotateFactor = (currPos.x - this.lastTransformPos.x) * 0.5 * Math.PI / 180;
                this.shape.rotate(rotateFactor);
            }
            else if (this.transformMode === ETransformMode.Scaling) {
                // ---- Scaling
                var scaleFactor = currPos.sub(this.shape.center).distance() /
                    (this.shape.boundingBox.width * this.scalerMultiplier / 2);
                this.shape.scale(scaleFactor, scaleFactor);
            }
            this.lastTransformPos.x = mouseX;
            this.lastTransformPos.y = mouseY;
        }
    };
    SelectionBox.prototype.onMouseDragEnd = function (mouseX, mouseY) {
        // Store scene if transformation took place
        if (this.transformMode !== ETransformMode.None) {
            this.appEvents.broadcastEvent(events.Events.STORESCENE);
            this.transformMode = ETransformMode.None;
        }
    };
    SelectionBox.prototype.resetMouseCursor = function (appCanvas) {
        mouse_cursor_1.MouseCursor.ResetMouseCursor(appCanvas);
    };
    Object.defineProperty(SelectionBox.prototype, "selectedShape", {
        // Accessors
        get: function () {
            return this.shape;
        },
        enumerable: true,
        configurable: true
    });
    // Privates
    // Updates transform and rotator bounding boxes
    SelectionBox.prototype.updateAABBs = function (shape) {
        this.aabb = this.shape.boundingBox;
        // Calculate rotator AABB based on transform AABB
        var left = this.aabb.center[0] - ROTATOR_RADIUS;
        var top = this.aabb.minY - ROTATOR_DISTANCE - ROTATOR_RADIUS;
        this.aabbRotator = aabb_1.AABB.FromRect(left, top, ROTATOR_RADIUS * 2, ROTATOR_RADIUS * 2);
    };
    // 0: no transform
    // 1, 2, 3, 4, 6, 7, 8, 9: scalers 1=N 2=NE 3=E 4=SE 6=S 7=SW 8=W 9=NW
    // 5: mover
    // 10: rotation
    SelectionBox.prototype.determineTransformMode = function (mouseX, mouseY) {
        if (this.aabb.isPointInside(mouseX, mouseY)) {
            var mx = 2;
            var my = 2;
            // Horizontal
            if (mouseX <= this.aabb.minX + SCALER_THICKNESS) {
                // -- Left side scaler
                mx = 0;
            }
            else if (mouseX <= this.aabb.maxX - SCALER_THICKNESS) {
                // -- Center area
                mx = 1;
            } // Else: Right side scaler
            // Vertical
            if (mouseY <= this.aabb.minY + SCALER_THICKNESS) {
                // -- Top side scaler
                my = 0;
            }
            else if (mouseY <= this.aabb.maxY - SCALER_THICKNESS) {
                // -- Center area
                my = 1;
            } // Else: Bottom side scaler
            this.scalerMultiplier = mx !== 1 && my !== 1 ? Math.SQRT2 : 1.0;
            return my * 3 + mx + 1;
        }
        else if (this.aabbRotator.isPointInside(mouseX, mouseY)) {
            return 10;
        }
        else {
            return 0;
        }
    };
    return SelectionBox;
}());
exports.SelectionBox = SelectionBox;

},{"./aabb":6,"./canvas-tools":9,"./events":12,"./mouse-cursor":15,"./rect":17,"./vec2":22}],19:[function(require,module,exports){
"use strict";
// ShapeTools
// Transformation and conversion functions for shapes.
Object.defineProperty(exports, "__esModule", { value: true });
var vec2_1 = require("./vec2");
var ShapeTools = /** @class */ (function () {
    function ShapeTools() {
    }
    // Generates path2D from list of vertices.
    ShapeTools.ToPath2D = function (verts) {
        if (verts.length === 0) {
            throw new Error("Shape.VerticesToPath2D() given empty vertex list.");
        }
        var path = new Path2D();
        path.moveTo(verts[0].x, verts[0].y);
        for (var _i = 0, verts_1 = verts; _i < verts_1.length; _i++) {
            var v = verts_1[_i];
            path.lineTo(v.x, v.y);
        }
        path.closePath();
        return path;
    };
    // Shape transformation
    ShapeTools.Translate = function (verts, deltaxy) {
        var tverts = [];
        for (var _i = 0, verts_2 = verts; _i < verts_2.length; _i++) {
            var v = verts_2[_i];
            tverts.push(v.add(new vec2_1.Vec2(deltaxy[0], deltaxy[1])));
        }
        return tverts;
    };
    ShapeTools.Rotate = function (verts, centerxy, angleRadians) {
        var tverts = [];
        for (var _i = 0, verts_3 = verts; _i < verts_3.length; _i++) {
            var v = verts_3[_i];
            tverts.push(v.rotate(angleRadians, new vec2_1.Vec2(centerxy[0], centerxy[1])));
        }
        return tverts;
    };
    ShapeTools.Scale = function (verts, centerxy, scalexy) {
        var tverts = [];
        var center = new vec2_1.Vec2(centerxy[0], centerxy[1]);
        for (var _i = 0, verts_4 = verts; _i < verts_4.length; _i++) {
            var v = verts_4[_i];
            tverts.push(v
                .sub(center)
                .scalexy(scalexy[0], scalexy[1])
                .add(center));
        }
        return tverts;
    };
    // Shape creation
    ShapeTools.Rect = function (width, height) {
        return [
            new vec2_1.Vec2(-width / 2, -height / 2),
            new vec2_1.Vec2(+width / 2, -height / 2),
            new vec2_1.Vec2(+width / 2, +height / 2),
            new vec2_1.Vec2(-width / 2, +height / 2)
        ];
    };
    ShapeTools.Circle = function (radius, circleSegments) {
        if (circleSegments === void 0) { circleSegments = 32; }
        var v = [];
        for (var r = 0.0; r < 2 * Math.PI; r += 2 * Math.PI / circleSegments) {
            v.push(new vec2_1.Vec2(Math.cos(r) * radius, Math.sin(r) * radius));
        }
        return v;
    };
    ShapeTools.Triangle = function (baseWidth, height) {
        var v = [];
        var x = -baseWidth / 2;
        var y = -height / 2;
        v.push(new vec2_1.Vec2(x + baseWidth / 2, y));
        v.push(new vec2_1.Vec2(x + baseWidth, y + height));
        v.push(new vec2_1.Vec2(x, y + height));
        return v;
    };
    ShapeTools.Star = function (radius) {
        var v = [];
        var innerRadius = 0.5 * radius;
        var points = 5.0;
        var angle = Math.PI * 2 / (points * 2);
        for (var i = points * 2 + 1; i > 0; --i) {
            var r = i % 2 === 1 ? radius : innerRadius;
            var omega = angle * i;
            var tx = r * Math.sin(omega);
            var ty = r * Math.cos(omega);
            v.push(new vec2_1.Vec2(tx, ty + 7)); // star slightly offset upwards
        }
        return v;
    };
    return ShapeTools;
}());
exports.ShapeTools = ShapeTools;

},{"./vec2":22}],20:[function(require,module,exports){
"use strict";
// Shape
// Each instance represents a shape in-game.
Object.defineProperty(exports, "__esModule", { value: true });
var aabb_1 = require("./aabb");
var collision_1 = require("./collision");
var shape_tools_1 = require("./shape-tools");
var vec2_1 = require("./vec2");
var CIRCLE_SEGMENTS = 40;
var EShape;
(function (EShape) {
    EShape[EShape["rect"] = 0] = "rect";
    EShape[EShape["circle"] = 1] = "circle";
    EShape[EShape["triangle"] = 2] = "triangle";
    EShape[EShape["star"] = 3] = "star";
})(EShape = exports.EShape || (exports.EShape = {}));
var Shape = /** @class */ (function () {
    function Shape(vertices, color) {
        this.shape = {};
        this.shape.id = ++Shape.currentId;
        this.shape.verts = vertices;
        this.shape.color = color;
        this.aabb = this.calculateBoundingBox();
    }
    // Shape drawing
    Shape.prototype.draw = function (appCanvas, defaultLineWidth) {
        if (this.shape.verts.length === 0) {
            throw new Error("Shape " + this.shape.id + ": has an empty vertex list.");
        }
        appCanvas.context.beginPath();
        appCanvas.context.fillStyle = this.shape.color;
        appCanvas.context.strokeStyle = this.mouseOver
            ? "#fff"
            : "#000";
        var path = new Path2D();
        path.moveTo(this.shape.verts[this.shape.verts.length - 1].x, this.shape.verts[this.shape.verts.length - 1].y);
        for (var _i = 0, _a = this.shape.verts; _i < _a.length; _i++) {
            var v = _a[_i];
            path.lineTo(v.x, v.y);
        }
        appCanvas.context.fill(path);
        appCanvas.context.lineWidth = this.mouseOver ? 3 : defaultLineWidth;
        appCanvas.context.stroke(path);
        // Shape collision
        appCanvas.collContext.fillStyle = collision_1.Collision.IdToColor(this.shape.id);
        appCanvas.collContext.fill(path);
        appCanvas.context.lineWidth = defaultLineWidth;
    };
    Shape.prototype.translate = function (dx, dy) {
        this.shape.verts = shape_tools_1.ShapeTools.Translate(this.shape.verts, [dx, dy]);
        this.aabb = this.calculateBoundingBox();
    };
    Shape.prototype.rotate = function (angleRadians) {
        this.shape.verts = shape_tools_1.ShapeTools.Rotate(this.shape.verts, this.aabb.center, angleRadians);
        this.aabb = this.calculateBoundingBox();
    };
    Shape.prototype.scale = function (sx, sy) {
        this.shape.verts = shape_tools_1.ShapeTools.Scale(this.shape.verts, this.aabb.center, [sx, sy]);
        this.aabb = this.calculateBoundingBox();
    };
    Object.defineProperty(Shape.prototype, "data", {
        // Accessors
        get: function () {
            return this.shape;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "id", {
        get: function () {
            return this.shape.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "boundingBox", {
        get: function () {
            return this.aabb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "center", {
        get: function () {
            return new vec2_1.Vec2(this.aabb.center[0], this.aabb.center[1]);
        },
        enumerable: true,
        configurable: true
    });
    // Shape transformation
    Shape.prototype.calculateBoundingBox = function () {
        var aabb = new aabb_1.AABB();
        for (var _i = 0, _a = this.shape.verts; _i < _a.length; _i++) {
            var v = _a[_i];
            aabb.minX = v.x < aabb.minX ? v.x : aabb.minX;
            aabb.maxX = v.x > aabb.maxX ? v.x : aabb.maxX;
            aabb.minY = v.y < aabb.minY ? v.y : aabb.minY;
            aabb.maxY = v.y > aabb.maxY ? v.y : aabb.maxY;
        }
        return aabb;
    };
    Shape.currentId = 0;
    return Shape;
}());
exports.Shape = Shape;

},{"./aabb":6,"./collision":10,"./shape-tools":19,"./vec2":22}],21:[function(require,module,exports){
"use strict";
// UIFrame
// In-app UI frame.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var button_1 = require("./button");
var canvas_tools_1 = require("./canvas-tools");
var events_1 = require("./events");
var frame_1 = require("./frame");
var shape_1 = require("./shape");
var shape_tools_1 = require("./shape-tools");
var UIFrame = /** @class */ (function (_super) {
    __extends(UIFrame, _super);
    function UIFrame(appEvents, appCanvas, startx, width) {
        var _this = _super.call(this, appEvents, appCanvas, startx, width) || this;
        // Mouse Events
        _this.onMouseOver = function (mouseX, mouseY) {
            for (var _i = 0, _a = _this.buttons; _i < _a.length; _i++) {
                var button = _a[_i];
                if (button.enabled && button.boundingBox.isPointInside(mouseX, mouseY)) {
                    button.mouseOver = true;
                }
                else {
                    button.mouseOver = false;
                }
            }
        };
        _this.onMouseLeave = function () {
            for (var _i = 0, _a = _this.buttons; _i < _a.length; _i++) {
                var button = _a[_i];
                button.mouseOver = false;
            }
        };
        _this.onMouseClick = function (mouseX, mouseY) {
            for (var _i = 0, _a = _this.buttons; _i < _a.length; _i++) {
                var button = _a[_i];
                if (button.enabled && button.boundingBox.isPointInside(mouseX, mouseY)) {
                    button.click(_this.appEvents);
                }
            }
        };
        _this.onMouseDragBegin = function (mouseX, mouseY) { };
        _this.onMouseDragUpdate = function (mouseX, mouseY) { };
        _this.onMouseDragEnd = function (mouseX, mouseY) { };
        _this.bgColor = "#448";
        _this.seperatorLine = new Path2D();
        _this.seperatorLine.moveTo(_this.width, 0);
        _this.seperatorLine.lineTo(_this.width, _this.height);
        _this.buttons = [];
        _this.initAppButtons();
        return _this;
    }
    UIFrame.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.appCanvas.context.lineWidth = 1;
        this.appCanvas.context.font = "13px arial";
        this.appCanvas.context.beginPath();
        this.appCanvas.context.strokeStyle = "#222";
        this.appCanvas.context.stroke(this.seperatorLine);
        this.drawSeperator(2, 255, 46, 0);
        // Buttons
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.draw(this.appCanvas.context, 1);
        }
    };
    // Events
    UIFrame.prototype.onEvent = function (event) {
        if (event.type === events_1.Events.SELECTION) {
            this.deleteButton.enabled = true;
        }
        else if (event.type === events_1.Events.NOSELECTION || event.type === events_1.Events.DELETE) {
            this.deleteButton.enabled = false;
        }
    };
    // ----------------------------------
    // Privates
    UIFrame.prototype.initAppButtons = function () {
        var icon = [
            shape_tools_1.ShapeTools.ToPath2D(shape_tools_1.ShapeTools.Translate(shape_tools_1.ShapeTools.Rect(30, 30), [25, 75])),
            shape_tools_1.ShapeTools.ToPath2D(shape_tools_1.ShapeTools.Translate(shape_tools_1.ShapeTools.Circle(15), [25, 125])),
            shape_tools_1.ShapeTools.ToPath2D(shape_tools_1.ShapeTools.Translate(shape_tools_1.ShapeTools.Triangle(30, 30), [25, 175])),
            shape_tools_1.ShapeTools.ToPath2D(shape_tools_1.ShapeTools.Translate(shape_tools_1.ShapeTools.Star(15), [25, 220]))
        ];
        var tip = [
            "Reset scene to default",
            "Create new Rect",
            "Create New Circle",
            "Create New Triangle",
            "Create new Star",
            "Delete selected shape"
        ];
        this.buttons = [
            new button_1.Button("Reset", events_1.Events.RESETSCENE, null, 5, 5, 40, 40, tip[0], null, true, "#aaf"),
            new button_1.Button("createRect", events_1.Events.CREATE, shape_1.EShape.rect, 5, 55, 40, 40, tip[1], icon[0]),
            new button_1.Button("createCircle", events_1.Events.CREATE, shape_1.EShape.circle, 5, 105, 40, 40, tip[2], icon[1]),
            new button_1.Button("createTriangle", events_1.Events.CREATE, shape_1.EShape.triangle, 5, 155, 40, 40, tip[3], icon[2]),
            new button_1.Button("createStar", events_1.Events.CREATE, shape_1.EShape.star, 5, 205, 40, 40, tip[4], icon[3])
        ];
        this.deleteButton = new button_1.Button("deleteSelected", events_1.Events.DELETE, null, 5, 265, 40, 40, tip[5], null, false, "#c33");
        this.buttons.push(this.deleteButton);
    };
    UIFrame.prototype.drawSeperator = function (x, y, width, height) {
        canvas_tools_1.CanvasTools.DrawLine(this.appCanvas.context, "#000", [x + 1, y + 1], [width, height]);
        canvas_tools_1.CanvasTools.DrawLine(this.appCanvas.context, "#fff", [x, y], [width, height]);
    };
    return UIFrame;
}(frame_1.Frame));
exports.UIFrame = UIFrame;

},{"./button":8,"./canvas-tools":9,"./events":12,"./frame":13,"./shape":20,"./shape-tools":19}],22:[function(require,module,exports){
"use strict";
// Vec2
// Vector 2 container and math. Math methods are non-mutating.
Object.defineProperty(exports, "__esModule", { value: true });
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        this.x = x;
        this.y = y;
    }
    // Returns:  vector + b vector
    Vec2.prototype.add = function (b) {
        return new Vec2(this.x + b.x, this.y + b.y);
    };
    // Returns: vector - b vector
    Vec2.prototype.sub = function (b) {
        return new Vec2(this.x - b.x, this.y - b.y);
    };
    // Returns: direction of this vector in radians
    Vec2.prototype.direction = function () {
        if (this.x !== 0.0) {
            return Math.atan2(this.y, this.x);
        }
        else if (this.y !== 0.0) {
            return this.y > 0.0 ? 90.0 * Math.PI / 180.0 : -90.0 * Math.PI / 180.0;
        }
        else {
            // considered domain error
            // returning zero following standard IEC-60559/IEEE 754
            return 0.0;
        }
    };
    // Returns: magnitude of vec2
    Vec2.prototype.distance = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    // Returns: calculated normal for vector
    Vec2.prototype.normal = function () {
        var m = this.distance();
        return new Vec2(this.x / m, this.y / m);
    };
    // Returns: rotated vector around a given point (or origin if null).
    Vec2.prototype.rotate = function (radians, aroundPoint) {
        if (aroundPoint === void 0) { aroundPoint = null; }
        var p = aroundPoint != null ? aroundPoint : new Vec2(0, 0);
        var rv = new Vec2(this.x, this.y);
        var x2 = p.x + (rv.x - p.x) * Math.cos(radians) - (rv.y - p.y) * Math.sin(radians);
        var y2 = p.y + (rv.x - p.x) * Math.sin(radians) + (rv.y - p.y) * Math.cos(radians);
        rv.x = x2;
        rv.y = y2;
        return rv;
    };
    Vec2.prototype.scalexy = function (sx, sy) {
        return new Vec2(this.x * sx, this.y * sy);
    };
    return Vec2;
}());
exports.Vec2 = Vec2;

},{}]},{},[14,7,13,21,11,20,19,22,6,12,8,10,18,15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9hYWJiLnRzIiwic3JjL2FwcC50cyIsInNyYy9idXR0b24udHMiLCJzcmMvY2FudmFzLXRvb2xzLnRzIiwic3JjL2NvbGxpc2lvbi50cyIsInNyYy9jb21wb3Nlci50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZnJhbWUudHMiLCJzcmMvbWFpbi50cyIsInNyYy9tb3VzZS1jdXJzb3IudHMiLCJzcmMvcGVyc2lzdGVuY2UudHMiLCJzcmMvcmVjdC50cyIsInNyYy9zZWxlY3Rpb24tYm94LnRzIiwic3JjL3NoYXBlLXRvb2xzLnRzIiwic3JjL3NoYXBlLnRzIiwic3JjL3VpLnRzIiwic3JjL3ZlYzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMxa0JBLE9BQU87QUFDUCx3QkFBd0I7O0FBRXhCO0lBV0UsOEVBQThFO0lBQzlFLGNBQ0UsSUFBK0IsRUFDL0IsSUFBK0IsRUFDL0IsSUFBK0IsRUFDL0IsSUFBK0I7UUFIL0IscUJBQUEsRUFBQSxPQUFlLE1BQU0sQ0FBQyxTQUFTO1FB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QztRQUNyRixFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNWLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1YsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU0sc0JBQU8sR0FBZCxVQUFlLEVBQVUsRUFBRSxFQUFVO1FBQ25DLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0gsV0FBQztBQUFELENBekRBLEFBeURDLElBQUE7QUF6RFksb0JBQUkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNvbXBhcmUgYW5kIGlzQnVmZmVyIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvYmxvYi82ODBlOWU1ZTQ4OGYyMmFhYzI3NTk5YTU3ZGM4NDRhNjMxNTkyOGRkL2luZGV4LmpzXG4vLyBvcmlnaW5hbCBub3RpY2U6XG5cbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIHggPSBhLmxlbmd0aDtcbiAgdmFyIHkgPSBiLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXTtcbiAgICAgIHkgPSBiW2ldO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmICh5IDwgeCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICBpZiAoZ2xvYmFsLkJ1ZmZlciAmJiB0eXBlb2YgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKGIpO1xuICB9XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpO1xufVxuXG4vLyBiYXNlZCBvbiBub2RlIGFzc2VydCwgb3JpZ2luYWwgbm90aWNlOlxuXG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZ1bmN0aW9uc0hhdmVOYW1lcyA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb28oKSB7fS5uYW1lID09PSAnZm9vJztcbn0oKSk7XG5mdW5jdGlvbiBwVG9TdHJpbmcgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG59XG5mdW5jdGlvbiBpc1ZpZXcoYXJyYnVmKSB7XG4gIGlmIChpc0J1ZmZlcihhcnJidWYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsLkFycmF5QnVmZmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyhhcnJidWYpO1xuICB9XG4gIGlmICghYXJyYnVmKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChhcnJidWYgaW5zdGFuY2VvZiBEYXRhVmlldykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChhcnJidWYuYnVmZmVyICYmIGFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbnZhciByZWdleCA9IC9cXHMqZnVuY3Rpb25cXHMrKFteXFwoXFxzXSopXFxzKi87XG4vLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2Z1bmN0aW9uLnByb3RvdHlwZS5uYW1lL2Jsb2IvYWRlZWVlYzhiZmNjNjA2OGIxODdkN2Q5ZmIzZDViYjFkM2EzMDg5OS9pbXBsZW1lbnRhdGlvbi5qc1xuZnVuY3Rpb24gZ2V0TmFtZShmdW5jKSB7XG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMpIHtcbiAgICByZXR1cm4gZnVuYy5uYW1lO1xuICB9XG4gIHZhciBzdHIgPSBmdW5jLnRvU3RyaW5nKCk7XG4gIHZhciBtYXRjaCA9IHN0ci5tYXRjaChyZWdleCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXTtcbn1cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBnZXROYW1lKHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc3BlY3Qoc29tZXRoaW5nKSB7XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgfHwgIXV0aWwuaXNGdW5jdGlvbihzb21ldGhpbmcpKSB7XG4gICAgcmV0dXJuIHV0aWwuaW5zcGVjdChzb21ldGhpbmcpO1xuICB9XG4gIHZhciByYXduYW1lID0gZ2V0TmFtZShzb21ldGhpbmcpO1xuICB2YXIgbmFtZSA9IHJhd25hbWUgPyAnOiAnICsgcmF3bmFtZSA6ICcnO1xuICByZXR1cm4gJ1tGdW5jdGlvbicgKyAgbmFtZSArICddJztcbn1cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuZXhwZWN0ZWQpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIGRlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBTdHJpY3RFcXVhbCcsIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAmJiBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gY29tcGFyZShhY3R1YWwsIGV4cGVjdGVkKSA9PT0gMDtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoKGFjdHVhbCA9PT0gbnVsbCB8fCB0eXBlb2YgYWN0dWFsICE9PSAnb2JqZWN0JykgJiZcbiAgICAgICAgICAgICAoZXhwZWN0ZWQgPT09IG51bGwgfHwgdHlwZW9mIGV4cGVjdGVkICE9PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gc3RyaWN0ID8gYWN0dWFsID09PSBleHBlY3RlZCA6IGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyBJZiBib3RoIHZhbHVlcyBhcmUgaW5zdGFuY2VzIG9mIHR5cGVkIGFycmF5cywgd3JhcCB0aGVpciB1bmRlcmx5aW5nXG4gIC8vIEFycmF5QnVmZmVycyBpbiBhIEJ1ZmZlciBlYWNoIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlXG4gIC8vIFRoaXMgb3B0aW1pemF0aW9uIHJlcXVpcmVzIHRoZSBhcnJheXMgdG8gaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGNoZWNrZWQgYnlcbiAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyAoYWthIHBUb1N0cmluZykuIE5ldmVyIHBlcmZvcm0gYmluYXJ5XG4gIC8vIGNvbXBhcmlzb25zIGZvciBGbG9hdCpBcnJheXMsIHRob3VnaCwgc2luY2UgZS5nLiArMCA9PT0gLTAgYnV0IHRoZWlyXG4gIC8vIGJpdCBwYXR0ZXJucyBhcmUgbm90IGlkZW50aWNhbC5cbiAgfSBlbHNlIGlmIChpc1ZpZXcoYWN0dWFsKSAmJiBpc1ZpZXcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgcFRvU3RyaW5nKGFjdHVhbCkgPT09IHBUb1N0cmluZyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICAhKGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSB8fFxuICAgICAgICAgICAgICAgYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSkge1xuICAgIHJldHVybiBjb21wYXJlKG5ldyBVaW50OEFycmF5KGFjdHVhbC5idWZmZXIpLFxuICAgICAgICAgICAgICAgICAgIG5ldyBVaW50OEFycmF5KGV4cGVjdGVkLmJ1ZmZlcikpID09PSAwO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAhPT0gaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG1lbW9zID0gbWVtb3MgfHwge2FjdHVhbDogW10sIGV4cGVjdGVkOiBbXX07XG5cbiAgICB2YXIgYWN0dWFsSW5kZXggPSBtZW1vcy5hY3R1YWwuaW5kZXhPZihhY3R1YWwpO1xuICAgIGlmIChhY3R1YWxJbmRleCAhPT0gLTEpIHtcbiAgICAgIGlmIChhY3R1YWxJbmRleCA9PT0gbWVtb3MuZXhwZWN0ZWQuaW5kZXhPZihleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb3MuYWN0dWFsLnB1c2goYWN0dWFsKTtcbiAgICBtZW1vcy5leHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcblxuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSB7XG4gIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKVxuICAgIHJldHVybiBhID09PSBiO1xuICBpZiAoc3RyaWN0ICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSAhPT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKTtcbiAgdmFyIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYiwgc3RyaWN0KTtcbiAgfVxuICB2YXIga2EgPSBvYmplY3RLZXlzKGEpO1xuICB2YXIga2IgPSBvYmplY3RLZXlzKGIpO1xuICB2YXIga2V5LCBpO1xuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9PSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5ub3REZWVwU3RyaWN0RXF1YWwgPSBub3REZWVwU3RyaWN0RXF1YWw7XG5mdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBTdHJpY3RFcXVhbCcsIG5vdERlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn1cblxuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSWdub3JlLiAgVGhlIGluc3RhbmNlb2YgY2hlY2sgZG9lc24ndCB3b3JrIGZvciBhcnJvdyBmdW5jdGlvbnMuXG4gIH1cblxuICBpZiAoRXJyb3IuaXNQcm90b3R5cGVPZihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKSB7XG4gIHZhciBlcnJvcjtcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBibG9jayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYmxvY2tcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIGFjdHVhbCA9IF90cnlCbG9jayhibG9jayk7XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICB2YXIgdXNlclByb3ZpZGVkTWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJztcbiAgdmFyIGlzVW53YW50ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgdXRpbC5pc0Vycm9yKGFjdHVhbCk7XG4gIHZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmICFleHBlY3RlZDtcblxuICBpZiAoKGlzVW53YW50ZWRFeGNlcHRpb24gJiZcbiAgICAgIHVzZXJQcm92aWRlZE1lc3NhZ2UgJiZcbiAgICAgIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fFxuICAgICAgaXNVbmV4cGVjdGVkRXhjZXB0aW9uKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKHRydWUsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyhmYWxzZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHRocm93IGVycjsgfTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiLy8gQUFCQlxuLy8gU2ltcGxlIGJvdW5kaW5nIGJveGVzXG5cbmV4cG9ydCBjbGFzcyBBQUJCIHtcbiAgcHVibGljIHN0YXRpYyBGcm9tUmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBBQUJCIHtcbiAgICBjb25zdCBhYWJiOiBBQUJCID0gbmV3IEFBQkIoeCwgeCArIHdpZHRoLCB5LCB5ICsgaGVpZ2h0KTtcbiAgICByZXR1cm4gYWFiYjtcbiAgfVxuXG4gIHB1YmxpYyBtaW5YOiBudW1iZXI7XG4gIHB1YmxpYyBtYXhYOiBudW1iZXI7XG4gIHB1YmxpYyBtaW5ZOiBudW1iZXI7XG4gIHB1YmxpYyBtYXhZOiBudW1iZXI7XG5cbiAgLy8gQ29uc3RydWN0b3IgdXNlcyBNQVggYW5kIE1JTiBOdW1iZXIgdmFsdWVzIHRvIGFsbG93IGVhc2llciBBQUJCIGNhbGN1bGF0aW9uXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBtaW5YOiBudW1iZXIgPSBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgIG1heFg6IG51bWJlciA9IE51bWJlci5NSU5fVkFMVUUsXG4gICAgbWluWTogbnVtYmVyID0gTnVtYmVyLk1BWF9WQUxVRSxcbiAgICBtYXhZOiBudW1iZXIgPSBOdW1iZXIuTUlOX1ZBTFVFXG4gICkge1xuICAgIHRoaXMubWluWCA9IG1pblg7XG4gICAgdGhpcy5tYXhYID0gbWF4WDtcbiAgICB0aGlzLm1pblkgPSBtaW5ZO1xuICAgIHRoaXMubWF4WSA9IG1heFk7XG4gIH1cblxuICBwdWJsaWMgaXNQb2ludEluc2lkZShweDogbnVtYmVyLCBweTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKHB4IDwgdGhpcy5taW5YIHx8IHB4ID4gdGhpcy5tYXhYIHx8IHB5IDwgdGhpcy5taW5ZIHx8IHB5ID4gdGhpcy5tYXhZKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLmFicyh0aGlzLm1heFggLSB0aGlzLm1pblgpO1xuICB9XG5cbiAgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLmFicyh0aGlzLm1heFkgLSB0aGlzLm1pblkpO1xuICB9XG5cbiAgZ2V0IGNlbnRlcigpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICByZXR1cm4gW3RoaXMubWluWCArIHRoaXMud2lkdGggLyAyLCB0aGlzLm1pblkgKyB0aGlzLmhlaWdodCAvIDJdO1xuICB9XG59XG4iLCIvLyBBcHBcbi8vIEVudHJ5IHBvaW50IGZvciBhcHBsaWNhdGlvblxuLy8gTWFuYWdlcyBhcHAvYnJvd3NlciBsZXZlbCBmdW5jdGlvbmFsaXR5XG5cbmltcG9ydCB7IENvbXBvc2VyRnJhbWUgfSBmcm9tIFwiLi9jb21wb3NlclwiO1xuaW1wb3J0IHsgQXBwRXZlbnRzLCBFdmVudHMsIElFdmVudCB9IGZyb20gXCIuL2V2ZW50c1wiO1xuaW1wb3J0IHsgRnJhbWUgfSBmcm9tIFwiLi9mcmFtZVwiO1xuaW1wb3J0IHsgVUlGcmFtZSB9IGZyb20gXCIuL3VpXCI7XG5pbXBvcnQgeyBWZWMyIH0gZnJvbSBcIi4vdmVjMlwiO1xuXG5leHBvcnQgY29uc3QgUEFMRVRURTogc3RyaW5nW10gPSBbXCIjODgwMDAwXCIsIFwiI0NDNDRDQ1wiLCBcIiMwMENDNTVcIiwgXCIjMDAwMEFBXCIsIFwiI0VFRUU3N1wiLCBcIiNERDg4NTVcIl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcENhbnZhcyB7XG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgY29sbENhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNvbGxDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG59XG5cbmV4cG9ydCBjbGFzcyBBcHAge1xuICBwcml2YXRlIHVpRnJhbWU6IFVJRnJhbWU7XG4gIHByaXZhdGUgY29tcG9zZXJGcmFtZTogQ29tcG9zZXJGcmFtZTtcbiAgcHJpdmF0ZSBhcHBDYW52YXM6IElBcHBDYW52YXM7XG4gIHByaXZhdGUgYXBwRXZlbnRzOiBBcHBFdmVudHM7XG5cbiAgLy8gTW91c2UgZXZlbnRzXG4gIHByaXZhdGUgbW91c2VEb3duUG9zOiBWZWMyO1xuICBwcml2YXRlIG1vdXNlRG93bjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBtb3VzZURyYWc6IGJvb2xlYW47XG4gIHByaXZhdGUgbW91c2VPdmVyRnJhbWU6IEZyYW1lO1xuICBwcml2YXRlIG1vdXNlRHJhZ0ZyYW1lOiBGcmFtZTtcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICAvLyBBcHAgQ2FudmFzXG4gICAgdGhpcy5hcHBDYW52YXMgPSB7IGNhbnZhcywgY29udGV4dCB9IGFzIElBcHBDYW52YXM7XG5cbiAgICAvLyBDcmVhdGUgY29sbGlzaW9uIGNhbnZhc1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbGxDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbGxDYW52YXMud2lkdGggPSB0aGlzLmFwcENhbnZhcy5jYW52YXMud2lkdGg7XG4gICAgdGhpcy5hcHBDYW52YXMuY29sbENhbnZhcy5oZWlnaHQgPSB0aGlzLmFwcENhbnZhcy5jYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbGxDb250ZXh0ID0gdGhpcy5hcHBDYW52YXMuY29sbENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAvLyBNb3VzZSBldmVudHMgZGF0YSBpbml0XG4gICAgdGhpcy5tb3VzZURvd25Qb3MgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURyYWcgPSBmYWxzZTtcbiAgICB0aGlzLm1vdXNlT3ZlckZyYW1lID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRHJhZ0ZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmFwcENhbnZhcy5jb250ZXh0O1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuYXBwQ2FudmFzLmNhbnZhcztcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5hcHBFdmVudHMgPSBuZXcgQXBwRXZlbnRzKCk7XG5cbiAgICAvLyBJbml0IEZyYW1lc1xuICAgIGNvbnN0IHVpV2lkdGggPSA1MDtcbiAgICB0aGlzLnVpRnJhbWUgPSBuZXcgVUlGcmFtZSh0aGlzLmFwcEV2ZW50cywgdGhpcy5hcHBDYW52YXMsIDAsIHVpV2lkdGgpO1xuICAgIHRoaXMuY29tcG9zZXJGcmFtZSA9IG5ldyBDb21wb3NlckZyYW1lKHRoaXMuYXBwRXZlbnRzLCB0aGlzLmFwcENhbnZhcywgMCwgY2FudmFzLndpZHRoKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSwgZmFsc2UpO1xuICB9XG5cbiAgcHVibGljIG9uRnJhbWUoKTogdm9pZCB7XG4gICAgY29uc3QgY29sbEN0eCA9IHRoaXMuYXBwQ2FudmFzLmNvbGxDb250ZXh0O1xuICAgIGNvbnN0IGNvbGxDYW52YXMgPSB0aGlzLmFwcENhbnZhcy5jb2xsQ2FudmFzO1xuICAgIC8vIFJ1biBldmVudHMgZGlzcGF0Y2hcbiAgICB0aGlzLmFwcEV2ZW50cy5ydW5FdmVudERpc3BhdGNoZXIoW3RoaXMudWlGcmFtZSwgdGhpcy5jb21wb3NlckZyYW1lXSk7XG4gICAgLy8gQ2xlYXIgY29sbGlzaW9uIGZyYW1lXG4gICAgY29sbEN0eC5jbGVhclJlY3QoMCwgMCwgY29sbENhbnZhcy53aWR0aCwgY29sbENhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuY29tcG9zZXJGcmFtZS5kcmF3KCk7XG4gICAgdGhpcy51aUZyYW1lLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFRyYW5zbGF0ZSBsb3cgbGV2ZWwgaW5wdXQgZXZlbnRzIHRvIGhpZ2hlciBsZXZlbCBldmVudHM6XG4gIC8vIC0gb25Nb3VzZUNsaWNrOiBpbmRpY2F0ZXMgYSBkb3duIHRoZW4gdXAgd2l0aCBubyBtb3ZlbWVudCBpbi1iZXR3ZWVuXG4gIC8vIC0gb25Nb3VzZU92ZXI6IGluZGljYXRlcyBtb3VzZSBtb3ZlbWVudCBvdmVyIGZyYW1lXG4gIC8vIC0gb25Nb3VzZUxlYXZlOiBpbmRpY2F0ZXMgbW91c2UgbW92ZWQgb3V0IG9mIHRoZSBmcmFtZVxuICAvLyBNb3VzZSBkcmFnIGFwcGxpZXMgdG8gdGhlIHNhbWUgZnJhbWUgdW50aWwgZHJhZyBlbmRzIChldmVuIGlmIGN1cnNvciBsZWZ0IGZyYW1lKTpcbiAgLy8gLSBvbk1vdXNlRHJhZ0JlZ2luOiBpbmRpY2F0ZXMgYSBidXR0b24gZG93biBhbmQgbW92ZSBhY3Rpb24gc3RhcnRcbiAgLy8gLSBvbk1vdXNlRHJhZ1VwZGF0ZTogaW5kaWNhdGVzIGEgY29udGludWVkIGRyYWcgZXZlbnRcbiAgLy8gLSBvbk1vdXNlRHJhZ0VuZDogaW5kaWNhdGVzIGEgYnV0dG9uIHVwIGFmdGVyIGRyYWdnaW5nXG4gIHB1YmxpYyBvbk1vdXNlRG93biA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIHRoaXMubW91c2VEb3duUG9zID0gbmV3IFZlYzIoXG4gICAgICBldmVudC54IC0gdGhpcy5hcHBDYW52YXMuY2FudmFzLm9mZnNldExlZnQsXG4gICAgICBldmVudC55IC0gdGhpcy5hcHBDYW52YXMuY2FudmFzLm9mZnNldFRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICk7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICB9O1xuXG4gIHB1YmxpYyBvbk1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHBvcyA9IG5ldyBWZWMyKFxuICAgICAgZXZlbnQueCAtIHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5vZmZzZXRMZWZ0LFxuICAgICAgZXZlbnQueSAtIHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5vZmZzZXRUb3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICApO1xuICAgIGlmICh0aGlzLm1vdXNlRG93bikge1xuICAgICAgLy8gYmVnaW4gb2YgZHJhZ1xuICAgICAgdGhpcy5tb3VzZURyYWdGcmFtZSA9IHRoaXMuZ2V0RnJhbWUodGhpcy5tb3VzZURvd25Qb3MpO1xuICAgICAgdGhpcy5tb3VzZURyYWdGcmFtZS5vbk1vdXNlRHJhZ0JlZ2luKHRoaXMubW91c2VEb3duUG9zLngsIHRoaXMubW91c2VEb3duUG9zLnkpO1xuICAgICAgdGhpcy5tb3VzZURyYWcgPSB0cnVlO1xuICAgICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubW91c2VEcmFnKSB7XG4gICAgICAvLyBkcmFnIHVwZGF0ZVxuICAgICAgdGhpcy5tb3VzZURyYWdGcmFtZS5vbk1vdXNlRHJhZ1VwZGF0ZShwb3MueCwgcG9zLnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtb3VzZSBvdmVyXG4gICAgICBjb25zdCBvdmVyRnJhbWUgPSB0aGlzLmdldEZyYW1lKHBvcyk7XG4gICAgICBvdmVyRnJhbWUub25Nb3VzZU92ZXIocG9zLngsIHBvcy55KTtcbiAgICAgIGlmICh0aGlzLm1vdXNlT3ZlckZyYW1lICE9PSBudWxsICYmIHRoaXMubW91c2VPdmVyRnJhbWUgIT09IG92ZXJGcmFtZSkge1xuICAgICAgICAvLyBNb3VzZSBtb3ZlZCBvdXQgb2YgYSBmcmFtZVxuICAgICAgICB0aGlzLm1vdXNlT3ZlckZyYW1lLm9uTW91c2VMZWF2ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5tb3VzZU92ZXJGcmFtZSA9IG92ZXJGcmFtZTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG9uTW91c2VVcCA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHBvcyA9IG5ldyBWZWMyKFxuICAgICAgZXZlbnQueCAtIHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5vZmZzZXRMZWZ0LFxuICAgICAgZXZlbnQueSAtIHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5vZmZzZXRUb3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICApO1xuICAgIGlmICh0aGlzLm1vdXNlRHJhZykge1xuICAgICAgLy8gZHJhZyBvdmVyXG4gICAgICB0aGlzLm1vdXNlRHJhZ0ZyYW1lLm9uTW91c2VEcmFnRW5kKHBvcy54LCBwb3MueSk7XG4gICAgICB0aGlzLm1vdXNlRHJhZyA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb3VzZURvd24pIHtcbiAgICAgIC8vIGNsaWNrXG4gICAgICB0aGlzLmdldEZyYW1lKHBvcykub25Nb3VzZUNsaWNrKHBvcy54LCBwb3MueSk7XG4gICAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGdldEZyYW1lKHBvczogVmVjMik6IEZyYW1lIHtcbiAgICByZXR1cm4gdGhpcy51aUZyYW1lLmJvdW5kaW5nQm94LmlzUG9pbnRJbnNpZGUocG9zLngsIHBvcy55KSA/IHRoaXMudWlGcmFtZSA6IHRoaXMuY29tcG9zZXJGcmFtZTtcbiAgfVxufVxuIiwiLy8gQnV0dG9uXG4vLyBIYW5kbGVzIHNpbXBsZSBVSSBidXR0b25zIGludGVyYWN0aW9ucy5cblxuaW1wb3J0IHsgQUFCQiB9IGZyb20gXCIuL2FhYmJcIjtcbmltcG9ydCB7IENhbnZhc1Rvb2xzIH0gZnJvbSBcIi4vY2FudmFzLXRvb2xzXCI7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBCdXR0b24ge1xuICBwdWJsaWMgbW91c2VPdmVyOiBib29sZWFuO1xuICBwdWJsaWMgZW5hYmxlZDogYm9vbGVhbjtcblxuICBwcml2YXRlIG5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBldmVudDogZXZlbnRzLklFdmVudDtcbiAgcHJpdmF0ZSBiYXNlOiBQYXRoMkQ7XG4gIHByaXZhdGUgaWNvbjogUGF0aDJEO1xuICBwcml2YXRlIGNvbG9yOiBzdHJpbmc7XG4gIHByaXZhdGUgYWFiYjogQUFCQjtcbiAgcHJpdmF0ZSB0b29sdGlwOiBzdHJpbmc7XG4gIHByaXZhdGUgd2FzQ2xpY2tlZDogbnVtYmVyOyAvLyBVc2VkIHRvIFwiYmxpbmtcIiBmb3IgMSsgZnJhbWVzXG5cbiAgY29uc3RydWN0b3IoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGV2ZW50VHlwZTogc3RyaW5nLFxuICAgIGV2ZW50RGF0YTogYW55LFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICB0b29sdGlwPzogc3RyaW5nLFxuICAgIGljb24/OiBQYXRoMkQsXG4gICAgZW5hYmxlZDogYm9vbGVhbiA9IHRydWUsXG4gICAgY29sb3I/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZXZlbnQgPSB7IGRhdGE6IGV2ZW50RGF0YSwgdHlwZTogZXZlbnRUeXBlIH0gYXMgZXZlbnRzLklFdmVudDtcbiAgICB0aGlzLmFhYmIgPSBBQUJCLkZyb21SZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuaWNvbiA9IGljb247XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yICE9PSB1bmRlZmluZWQgPyBjb2xvciA6IFwiI2FhYlwiO1xuICAgIHRoaXMudG9vbHRpcCA9IHRvb2x0aXA7XG4gICAgdGhpcy5iYXNlID0gbmV3IFBhdGgyRCgpO1xuICAgIHRoaXMuYmFzZS5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMud2FzQ2xpY2tlZCA9IDA7XG4gIH1cblxuICBwdWJsaWMgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGVmYXVsdExpbmVXaWR0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3QnV0dG9uKGN0eCwgZGVmYXVsdExpbmVXaWR0aCk7XG4gICAgaWYgKHRoaXMubW91c2VPdmVyKSB7XG4gICAgICB0aGlzLmRyYXdUb29sdGlwKGN0eCk7XG4gICAgfVxuICAgIGlmICh0aGlzLndhc0NsaWNrZWQgPiAwKSB7XG4gICAgICB0aGlzLndhc0NsaWNrZWQtLTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2xpY2soYXBwRXZlbnRzOiBldmVudHMuQXBwRXZlbnRzKTogdm9pZCB7XG4gICAgdGhpcy53YXNDbGlja2VkID0gNjtcbiAgICBhcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQodGhpcy5ldmVudC50eXBlLCB0aGlzLmV2ZW50LmRhdGEpO1xuICB9XG5cbiAgLy8gQWNjZXNzb3JzXG4gIHB1YmxpYyBnZXQgYm91bmRpbmdCb3goKTogQUFCQiB7XG4gICAgcmV0dXJuIHRoaXMuYWFiYjtcbiAgfVxuXG4gIC8vIFByaXZhdGVzXG5cbiAgcHJpdmF0ZSBkcmF3QnV0dG9uKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBkZWZhdWx0TGluZVdpZHRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgYmdDb2xvciA9IFwiIzgwYWFhYWJiXCI7XG4gICAgbGV0IGJvcmRlckNvbG9yID0gXCIjODg4XCI7XG4gICAgbGV0IGljb25Db2xvciA9IFwiIzg4OFwiO1xuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIC8vIFNldCBpbnRlcmFjdGlvbiBjb2xvcnNcbiAgICAgIGJnQ29sb3IgPSB0aGlzLndhc0NsaWNrZWQgPT09IDAgPyB0aGlzLmNvbG9yIDogXCIjMDAwXCI7XG4gICAgICBib3JkZXJDb2xvciA9IFwiI2ZmZlwiO1xuICAgICAgaWNvbkNvbG9yID0gdGhpcy5tb3VzZU92ZXIgPyBcIiM3MzAwZjdcIiA6IFwiI2ZmZlwiO1xuICAgIH1cbiAgICAvLyBCdXR0b24gYmFja2dyb3VuZFxuICAgIENhbnZhc1Rvb2xzLkRyYXdQYXRoKGN0eCwgdGhpcy5iYXNlLCBiZ0NvbG9yLCBib3JkZXJDb2xvcik7XG4gICAgLy8gSWNvblxuICAgIGlmICh0aGlzLmljb24gIT0gbnVsbCkge1xuICAgICAgQ2FudmFzVG9vbHMuRmlsbFBhdGgoY3R4LCB0aGlzLmljb24sIGljb25Db2xvcik7XG4gICAgfVxuICAgIC8vIEhpZ2hsaWdodFxuICAgIGlmICh0aGlzLmVuYWJsZWQgJiYgdGhpcy5tb3VzZU92ZXIgPT09IHRydWUpIHtcbiAgICAgIENhbnZhc1Rvb2xzLlN0cm9rZVBhdGgoY3R4LCB0aGlzLmJhc2UsIFwiI2ZmZlwiLCAyLjUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZHJhd1Rvb2x0aXAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sdGlwICE9IG51bGwgJiYgdGhpcy50b29sdGlwLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHRib3g6IEFBQkIgPSBBQUJCLkZyb21SZWN0KFxuICAgICAgICB0aGlzLmFhYmIubWluWCArIHRoaXMuYWFiYi53aWR0aCAtIDEsXG4gICAgICAgIHRoaXMuYWFiYi5taW5ZICsgdGhpcy5hYWJiLmhlaWdodCAvIDIgLSAxMyxcbiAgICAgICAgMTQwLFxuICAgICAgICAyNVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcbiAgICAgIHBhdGgucmVjdCh0Ym94Lm1pblgsIHRib3gubWluWSwgdGJveC53aWR0aCwgdGJveC5oZWlnaHQpO1xuICAgICAgQ2FudmFzVG9vbHMuRHJhd1BhdGgoY3R4LCBwYXRoLCBcIiNmZmZlY2NcIiwgXCIjMDAwXCIpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiIzAwMFwiO1xuICAgICAgY3R4LmZpbGxUZXh0KHRoaXMudG9vbHRpcCwgdGJveC5taW5YICsgMywgdGJveC5taW5ZICsgdGJveC5oZWlnaHQgLyAyICsgNCwgdGJveC53aWR0aCk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBDYW52YXNUb29sc1xuLy8gU2hvcnRjdXRzIHRvIHNvbWUgZnJlcXVlbnRseSB1c2VkIGNhbnZhcyByb3V0aW5lcy5cblxuaW1wb3J0IHsgUmVjdCB9IGZyb20gXCIuL3JlY3RcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENhbnZhc1Rvb2xzIHtcbiAgcHVibGljIHN0YXRpYyBEcmF3TGluZShcbiAgICBjdHg6IGFueSxcbiAgICBjb2xvcjogc3RyaW5nLFxuICAgIHN0YXJ0OiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIGRlbHRhOiBbbnVtYmVyLCBudW1iZXJdXG4gICk6IHZvaWQge1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHgubW92ZVRvKHN0YXJ0WzBdLCBzdGFydFsxXSk7XG4gICAgY3R4LmxpbmVUbyhzdGFydFswXSArIGRlbHRhWzBdLCBzdGFydFsxXSArIGRlbHRhWzFdKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIERyYXdQYXRoKGN0eDogYW55LCBwYXRoOiBQYXRoMkQsIGZpbGxDb2xvcjogc3RyaW5nLCBzdHJva2VDb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gQnV0dG9uIGJhY2tncm91bmRcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvcjtcbiAgICBjdHguZmlsbChwYXRoKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvcjtcbiAgICBjdHguc3Ryb2tlKHBhdGgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBEcmF3Q2lyY2xlKGN0eDogYW55LCB4Om51bWJlciwgeTpudW1iZXIsIHJhZGl1czpudW1iZXIsIGZpbGxDb2xvcjpzdHJpbmcsIHN0cm9rZUNvbG9yOnN0cmluZywgbGluZVdpZHRoOm51bWJlciA9IDEuMCkge1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5maWxsQ29sb3IgPSBmaWxsQ29sb3I7XG4gICAgY3R4LnN0cm9rZUNvbG9yID0gc3Ryb2tlQ29sb3I7XG4gICAgY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBGaWxsUGF0aChjdHg6IGFueSwgcGF0aDogUGF0aDJELCBmaWxsQ29sb3I6IHN0cmluZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3I7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5maWxsKHBhdGgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTdHJva2VQYXRoKGN0eDogYW55LCBwYXRoOiBQYXRoMkQsIHN0cm9rZUNvbG9yOiBzdHJpbmcsIGxpbmVXaWR0aDogbnVtYmVyID0gMS4wKSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKHBhdGgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFN0cm9rZVJlY3QoY3R4OiBhbnksIHJlY3Q6IFJlY3QsIHN0cm9rZUNvbG9yOiBzdHJpbmcsIGxpbmVXaWR0aDogbnVtYmVyID0gMS4wKSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3I7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICBjdHguc3Ryb2tlUmVjdChyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8vIENvbGxpc2lvblxuLy8gQ29sbGlzaW9uIG9wZXJhdGlvbnMgZm9yIHNoYXBlcy5cblxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gXCJhc3NlcnRcIjtcblxuY29uc3QgRU5USVRZX0NPTE9SX01VTFRJUExJRVI6IG51bWJlciA9IDB4MjA7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb2xsaXNpb24ge1xuICAvLyBDb252ZXJ0cyBlbnRpdHkgaWQgdG8gaHRtbCBjb2xvciBhcyBhIHN0cmluZzogI05OTk5OTlxuICBwdWJsaWMgc3RhdGljIElkVG9Db2xvcihpZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBsZXQgY29sb3IgPSAoaWQgKiBFTlRJVFlfQ09MT1JfTVVMVElQTElFUikudG9TdHJpbmcoMTYpO1xuICAgIGFzc2VydChjb2xvci5sZW5ndGggPD0gNik7XG4gICAgd2hpbGUgKGNvbG9yLmxlbmd0aCA8IDYpIHtcbiAgICAgIGNvbG9yID0gXCIwXCIgKyBjb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIFwiI1wiICsgY29sb3I7XG4gIH1cblxuICAvLyBDb252ZXJ0cyBodG1sIGNvbG9yICgjTk5OTk5OKSB0byBlbnRpdHkgaWRcbiAgcHVibGljIHN0YXRpYyBDb2xvclRvSWQoY29sb3I6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIChwYXJzZUludChjb2xvci5zdWJzdHIoMSksIDE2KSAmIDB4ZmZmZmZmKSAvIEVOVElUWV9DT0xPUl9NVUxUSVBMSUVSO1xuICB9XG5cbiAgLy8gRGF0YSBnaXZlbiBhczogW1IsRyxCLEFdXG4gIHB1YmxpYyBzdGF0aWMgUkdCVG9JZChkYXRhOiBVaW50OENsYW1wZWRBcnJheSk6IG51bWJlciB7XG4gICAgcmV0dXJuICgoZGF0YVswXSA8PCAxNikgKyAoZGF0YVsxXSA8PCA4KSArIGRhdGFbMl0pIC8gRU5USVRZX0NPTE9SX01VTFRJUExJRVI7XG4gIH1cbn1cbiIsIi8vIENvbXBvc2VyRnJhbWVcbi8vIFNoYXBlQ29tcG9zZXIgd2luZG93IGFuZCBmdW5jdGlvbmFsaXR5LlxuXG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuaW1wb3J0IHsgQUFCQiB9IGZyb20gXCIuL2FhYmJcIjtcbmltcG9ydCB7IElBcHBDYW52YXMgfSBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCB7IFBBTEVUVEUgfSBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCB7IENvbGxpc2lvbiB9IGZyb20gXCIuL2NvbGxpc2lvblwiO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xuaW1wb3J0IHsgRnJhbWUgfSBmcm9tIFwiLi9mcmFtZVwiO1xuaW1wb3J0IHsgUGVyc2lzdGVuY2UgfSBmcm9tIFwiLi9wZXJzaXN0ZW5jZVwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uQm94IH0gZnJvbSBcIi4vc2VsZWN0aW9uLWJveFwiO1xuaW1wb3J0IHsgRVNoYXBlLCBJU2hhcGUsIFNoYXBlIH0gZnJvbSBcIi4vc2hhcGVcIjtcbmltcG9ydCB7IFNoYXBlVG9vbHMgfSBmcm9tIFwiLi9zaGFwZS10b29sc1wiO1xuaW1wb3J0IHsgVmVjMiB9IGZyb20gXCIuL3ZlYzJcIjtcblxuZXhwb3J0IGNsYXNzIENvbXBvc2VyRnJhbWUgZXh0ZW5kcyBGcmFtZSB7XG4gIHByaXZhdGUgc2hhcGVzOiBTaGFwZVtdO1xuICBwcml2YXRlIG1vdXNlT3ZlclNoYXBlOiBTaGFwZTtcbiAgcHJpdmF0ZSBzZWxlY3Rpb25Cb3g6IFNlbGVjdGlvbkJveDtcblxuICBjb25zdHJ1Y3RvcihhcHBFdmVudHM6IGV2ZW50cy5BcHBFdmVudHMsIGFwcENhbnZhczogSUFwcENhbnZhcywgc3RhcnR4OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpIHtcbiAgICBzdXBlcihhcHBFdmVudHMsIGFwcENhbnZhcywgc3RhcnR4LCB3aWR0aCk7XG4gICAgdGhpcy5iZ0NvbG9yID0gXCIjZGRkXCI7XG4gICAgdGhpcy5sb2FkU2NlbmUoKTtcbiAgfVxuXG4gIC8vIERyYXcgZXZlcnl0aGluZ1xuXG4gIHB1YmxpYyBkcmF3KCk6IHZvaWQge1xuICAgIHN1cGVyLmRyYXcoKTtcbiAgICB0aGlzLmFwcENhbnZhcy5jb250ZXh0LmxpbmVXaWR0aCA9IDAuNTtcbiAgICB0aGlzLmFwcENhbnZhcy5jb250ZXh0LmZvbnQgPSBcIjEzcHggYXJpYWxcIjtcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHRoaXMuc2hhcGVzKSB7XG4gICAgICBzaGFwZS5kcmF3KHRoaXMuYXBwQ2FudmFzLCAwLjUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZWxlY3Rpb25Cb3gpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQm94LmRyYXcodGhpcy5hcHBDYW52YXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEV2ZW50c1xuXG4gIHB1YmxpYyBvbkV2ZW50KGV2ZW50OiBldmVudHMuSUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09IGV2ZW50cy5FdmVudHMuQ1JFQVRFKSB7XG4gICAgICBjb25zdCBkOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMjggKyAxMjgpO1xuICAgICAgdGhpcy5zaGFwZXMucHVzaChcbiAgICAgICAgdGhpcy50cmFuc2xhdGVTaGFwZShcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXBlKGV2ZW50LmRhdGEgYXMgRVNoYXBlLCBkLCBkLCB0aGlzLnJhbmRvbUNvbG9yKCkpLFxuICAgICAgICAgIDY0ICsgTWF0aC5yYW5kb20oKSAqICh0aGlzLndpZHRoIC0gMTI4KSxcbiAgICAgICAgICA2NCArIE1hdGgucmFuZG9tKCkgKiAodGhpcy5oZWlnaHQgLSAxMjgpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICB0aGlzLmFwcEV2ZW50cy5icm9hZGNhc3RFdmVudChldmVudHMuRXZlbnRzLlNUT1JFU0NFTkUpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gZXZlbnRzLkV2ZW50cy5ERUxFVEUpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbkJveCkge1xuICAgICAgICBjb25zdCBzaGFwZTogU2hhcGUgPSB0aGlzLnNlbGVjdGlvbkJveC5zZWxlY3RlZFNoYXBlO1xuICAgICAgICB0aGlzLnVuc2VsZWN0KCk7XG4gICAgICAgIGNvbnN0IGlkeDogbnVtYmVyID0gdGhpcy5zaGFwZXMuaW5kZXhPZihzaGFwZSk7XG4gICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgIHRoaXMuc2hhcGVzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmFwcEV2ZW50cy5icm9hZGNhc3RFdmVudChldmVudHMuRXZlbnRzLlNUT1JFU0NFTkUpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gZXZlbnRzLkV2ZW50cy5SRVNFVFNDRU5FKSB7XG4gICAgICB0aGlzLnVuc2VsZWN0KCk7XG4gICAgICB0aGlzLnJlc2V0U2NlbmUoKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09IGV2ZW50cy5FdmVudHMuU1RPUkVTQ0VORSkge1xuICAgICAgdGhpcy5zdG9yZVNjZW5lKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTW91c2UgaW50ZXJhY3Rpb25zXG5cbiAgcHVibGljIG9uTW91c2VPdmVyID0gKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIC8vIFJlc2V0IG1vdXNlIG92ZXIgaGlnaGxpZ2h0XG4gICAgaWYgKHRoaXMubW91c2VPdmVyU2hhcGUpIHtcbiAgICAgIHRoaXMubW91c2VPdmVyU2hhcGUubW91c2VPdmVyID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoYW5naW5nIG1vdXNlIGN1cnNvciBpZiBvdmVyIHNlbGVjdGlvbkJveFxuICAgIGlmICh0aGlzLnNlbGVjdGlvbkJveCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94LmlzSW5zaWRlVHJhbnNmb3JtKG1vdXNlWCwgbW91c2VZKSkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbkJveC5vbk1vdXNlT3Zlcih0aGlzLmFwcENhbnZhcywgbW91c2VYLCBtb3VzZVkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25Cb3gucmVzZXRNb3VzZUN1cnNvcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrIHBpeGVsIGF0IG1vdXNlIHBvc2l0aW9uIGZyb20gY29sbGlzaW9uIGNhbnZhcyBmb3Igc2hhcGUgaWRcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuZ2V0U2hhcGVDb2xsaXNpb24obW91c2VYLCBtb3VzZVkpO1xuICAgIGlmIChzaGFwZSkge1xuICAgICAgc2hhcGUubW91c2VPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMubW91c2VPdmVyU2hhcGUgPSBzaGFwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3VzZU92ZXJTaGFwZSA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBvbk1vdXNlTGVhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMubW91c2VPdmVyU2hhcGUpIHtcbiAgICAgIHRoaXMubW91c2VPdmVyU2hhcGUubW91c2VPdmVyID0gZmFsc2U7XG4gICAgICB0aGlzLm1vdXNlT3ZlclNoYXBlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkJveC5yZXNldE1vdXNlQ3Vyc29yKHRoaXMuYXBwQ2FudmFzKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG9uTW91c2VDbGljayA9IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuZ2V0U2hhcGVDb2xsaXNpb24obW91c2VYLCBtb3VzZVkpO1xuICAgIGlmIChzaGFwZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Cb3ggPSBuZXcgU2VsZWN0aW9uQm94KHNoYXBlLCB0aGlzLmFwcEV2ZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudW5zZWxlY3QoKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG9uTW91c2VEcmFnQmVnaW4gPSAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgbGV0IGRyYWdUYWtlbjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkJveCkge1xuICAgICAgZHJhZ1Rha2VuID0gdGhpcy5zZWxlY3Rpb25Cb3gub25Nb3VzZURyYWdCZWdpbihtb3VzZVgsIG1vdXNlWSk7XG4gICAgfVxuICAgIC8vIElmIGRyYWdnaW5nIG9uIG5vbi1zZWxlY3RlZCBzaGFwZSwgc2VsZWN0IGFuZCBkcmFnIHRoYXQgc2hhcGUhXG4gICAgaWYgKCFkcmFnVGFrZW4pIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5nZXRTaGFwZUNvbGxpc2lvbihtb3VzZVgsIG1vdXNlWSk7XG4gICAgICBpZiAoc2hhcGUpIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdCh0cnVlKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25Cb3ggPSBuZXcgU2VsZWN0aW9uQm94KHNoYXBlLCB0aGlzLmFwcEV2ZW50cyk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQm94Lm9uTW91c2VEcmFnQmVnaW4obW91c2VYLCBtb3VzZVkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgb25Nb3VzZURyYWdVcGRhdGUgPSAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkJveC5vbk1vdXNlRHJhZ1VwZGF0ZShtb3VzZVgsIG1vdXNlWSk7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBvbk1vdXNlRHJhZ0VuZCA9IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25Cb3gpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQm94Lm9uTW91c2VEcmFnRW5kKG1vdXNlWCwgbW91c2VZKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUHJpdmF0ZXNcblxuICBwcml2YXRlIHJlc2V0U2NlbmUoKTogdm9pZCB7XG4gICAgLy8gQ3JlYXRlIHN0YXJ0ZXIgc2hhcGVzXG4gICAgdGhpcy5zaGFwZXMgPSBbXTtcbiAgICB0aGlzLnNoYXBlcy5wdXNoKFxuICAgICAgdGhpcy50cmFuc2xhdGVTaGFwZShcbiAgICAgICAgdGhpcy5jcmVhdGVTaGFwZShFU2hhcGUucmVjdCwgMTI4LCAxMjgsIHRoaXMucmFuZG9tQ29sb3IoKSksXG4gICAgICAgIHRoaXMud2lkdGggLyAyIC0gMTI4LFxuICAgICAgICB0aGlzLmhlaWdodCAvIDIgLSA5MlxuICAgICAgKVxuICAgICk7XG4gICAgdGhpcy5zaGFwZXMucHVzaChcbiAgICAgIHRoaXMudHJhbnNsYXRlU2hhcGUoXG4gICAgICAgIHRoaXMuY3JlYXRlU2hhcGUoRVNoYXBlLmNpcmNsZSwgMTI4LCAxMjgsIHRoaXMucmFuZG9tQ29sb3IoKSksXG4gICAgICAgIHRoaXMud2lkdGggLyAyICsgMTI4LFxuICAgICAgICB0aGlzLmhlaWdodCAvIDIgLSA5MlxuICAgICAgKVxuICAgICk7XG4gICAgdGhpcy5zaGFwZXMucHVzaChcbiAgICAgIHRoaXMudHJhbnNsYXRlU2hhcGUoXG4gICAgICAgIHRoaXMuY3JlYXRlU2hhcGUoRVNoYXBlLnRyaWFuZ2xlLCAxMjgsIDEyOCwgdGhpcy5yYW5kb21Db2xvcigpKSxcbiAgICAgICAgdGhpcy53aWR0aCAvIDIgLSAxMjgsXG4gICAgICAgIHRoaXMuaGVpZ2h0IC8gMiArIDkyXG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLnNoYXBlcy5wdXNoKFxuICAgICAgdGhpcy50cmFuc2xhdGVTaGFwZShcbiAgICAgICAgdGhpcy5jcmVhdGVTaGFwZShFU2hhcGUuc3RhciwgMTI4LCAxMjgsIHRoaXMucmFuZG9tQ29sb3IoKSksXG4gICAgICAgIHRoaXMud2lkdGggLyAyICsgMTI4LFxuICAgICAgICB0aGlzLmhlaWdodCAvIDIgKyA5MlxuICAgICAgKVxuICAgICk7XG4gICAgdGhpcy5zdG9yZVNjZW5lKCk7XG4gIH1cblxuICBwcml2YXRlIHN0b3JlU2NlbmUoKTogdm9pZCB7XG4gICAgY29uc3Qgc2NlbmU6IElTaGFwZVtdID0gW107XG4gICAgZm9yIChjb25zdCBzaGFwZSBvZiB0aGlzLnNoYXBlcykge1xuICAgICAgc2NlbmUucHVzaChzaGFwZS5kYXRhKTtcbiAgICB9XG4gICAgUGVyc2lzdGVuY2Uuc3RvcmVEYXRhKEpTT04uc3RyaW5naWZ5KHNjZW5lKSk7XG4gIH1cblxuICBwcml2YXRlIGxvYWRTY2VuZSgpOiB2b2lkIHtcbiAgICBpZiAoUGVyc2lzdGVuY2UuaGFzUHJldmlvdXNTY2VuZSgpKSB7XG4gICAgICB0aGlzLnNoYXBlcyA9IFtdO1xuICAgICAgY29uc3Qgc2F2ZTogSVNoYXBlW10gPSBKU09OLnBhcnNlKFBlcnNpc3RlbmNlLmxvYWREYXRhKCkpIGFzIElTaGFwZVtdO1xuICAgICAgZm9yIChjb25zdCBzaGFwZSBvZiBzYXZlKSB7XG4gICAgICAgIGNvbnN0IHZlcnRzOiBWZWMyW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB2IG9mIHNoYXBlLnZlcnRzKSB7XG4gICAgICAgICAgdmVydHMucHVzaChuZXcgVmVjMih2LngsIHYueSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hhcGVzLnB1c2gobmV3IFNoYXBlKHZlcnRzLCBzaGFwZS5jb2xvcikpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2V0U2NlbmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVuc2VsZWN0KGRvbnRTZW5kRXZlbnQ6Ym9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkJveC5vblVuc2VsZWN0KGRvbnRTZW5kRXZlbnQpO1xuICAgICAgdGhpcy5zZWxlY3Rpb25Cb3ggPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmFuZG9tQ29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gUEFMRVRURVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBQQUxFVFRFLmxlbmd0aCldO1xuICB9XG5cbiAgLy8gR2V0cyBzaGFwZSBieSBJZCwgcmV0dXJucyBudWxsIGlmIG5vIHNoYXBlIG1hdGNoZXMgSWRcbiAgcHJpdmF0ZSBnZXRTaGFwZShpZDogbnVtYmVyKTogU2hhcGUge1xuICAgIGZvciAoY29uc3Qgc2hhcGUgb2YgdGhpcy5zaGFwZXMpIHtcbiAgICAgIGlmIChzaGFwZS5pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFJldHVybnM6IHNoYXBlIHVuZGVyIGdpdmVuIHgsIHkuIG51bGwgaWYgbm90aGluZyBpcyB0aGVyZS5cbiAgcHJpdmF0ZSBnZXRTaGFwZUNvbGxpc2lvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IFNoYXBlIHtcbiAgICBjb25zdCBjb2xsaXNpb25JZCA9IENvbGxpc2lvbi5SR0JUb0lkKHRoaXMuYXBwQ2FudmFzLmNvbGxDb250ZXh0LmdldEltYWdlRGF0YSh4LCB5LCAxLCAxKS5kYXRhKTtcbiAgICByZXR1cm4gY29sbGlzaW9uSWQgPiAwID8gdGhpcy5nZXRTaGFwZShjb2xsaXNpb25JZCkgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTaGFwZSh0eXBlOiBFU2hhcGUsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvcjogc3RyaW5nKTogU2hhcGUge1xuICAgIGxldCB2ZXJ0czogVmVjMltdID0gW107XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIEVTaGFwZS5yZWN0OlxuICAgICAgICB2ZXJ0cyA9IFNoYXBlVG9vbHMuUmVjdCh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVTaGFwZS5jaXJjbGU6XG4gICAgICAgIHZlcnRzID0gU2hhcGVUb29scy5DaXJjbGUod2lkdGggLyAyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVTaGFwZS50cmlhbmdsZTpcbiAgICAgICAgdmVydHMgPSBTaGFwZVRvb2xzLlRyaWFuZ2xlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRVNoYXBlLnN0YXI6XG4gICAgICAgIHZlcnRzID0gU2hhcGVUb29scy5TdGFyKHdpZHRoIC8gMik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNoYXBlKHZlcnRzLCBjb2xvcik7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZVNoYXBlKHNoYXBlOiBTaGFwZSwgZHg6IG51bWJlciwgZHk6IG51bWJlcik6IFNoYXBlIHtcbiAgICBzaGFwZS50cmFuc2xhdGUoZHgsIGR5KTtcbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cbn1cbiIsIi8vIEFwcEV2ZW50c1xuLy8gQ2xhc3NlcyBmb3IgZXZlbnQgbWFuYWdlbWVudCBhbmQgZGlzcGF0Y2guXG5cbmltcG9ydCB7IEZyYW1lIH0gZnJvbSBcIi4vZnJhbWVcIjtcblxuZXhwb3J0IGNvbnN0IEV2ZW50cyA9IHtcbiAgQ1JFQVRFOiBcImNyZWF0ZVwiLCAvLyBDcmVhdGUgbmV3IHNoYXBlXG4gIERFTEVURTogXCJkZWxldGVcIiwgLy8gRGVsZXRlIHNlbGVjdGVkIHNoYXBlXG4gIE5PU0VMRUNUSU9OOiBcIm5vc2VsZWN0aW9uXCIsIC8vIE5vdGhpbmcgaXMgc2VsZWN0ZWRcbiAgUkVTRVRTQ0VORTogXCJyZXNldFwiLCAvLyBSZXNldCBzY2VuZSB0byBkZWZhdWx0XG4gIFNFTEVDVElPTjogXCJzZWxlY3Rpb25cIiwgLy8gU29tZXRoaW5nIGlzIHNlbGVjdGVkXG4gIFNUT1JFU0NFTkU6IFwic3RvcmVcIiAvLyBTY2VuZSBjaGFuZ2VkLCBzdG9yZSBzY2VuZSBkYXRhIGZvciBwZXJzaXN0ZW5jeVxufTtcblxuZXhwb3J0IGludGVyZmFjZSBJRXZlbnQge1xuICB0eXBlOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcEV2ZW50cyB7XG4gIHByaXZhdGUgZXZlbnRzOiBJRXZlbnRbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICB9XG5cbiAgcHVibGljIGJyb2FkY2FzdEV2ZW50KHR5cGU6IHN0cmluZywgZGF0YTogYW55ID0gbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuZXZlbnRzLnB1c2goeyB0eXBlLCBkYXRhIH0pO1xuICB9XG5cbiAgcHVibGljIHJ1bkV2ZW50RGlzcGF0Y2hlcihmcmFtZXM6IEZyYW1lW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ldmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRXh0cmFjdCBjdXJyZW50IGV2ZW50cyBmb3IgaXRlcmF0aW9uIHNvIGFueSBldmVudHMgYWRkZWRcbiAgICAgIC8vIGR1cmluZyBhbnkgb25FdmVudCBjYWxsIHdpbGwgYmUgZGlzcGF0Y2hlZCBuZXh0IGZyYW1lOlxuICAgICAgY29uc3QgZXZzOiBJRXZlbnRbXSA9IHRoaXMuZXZlbnRzLnNwbGljZSgwLCB0aGlzLmV2ZW50cy5sZW5ndGgpO1xuICAgICAgd2hpbGUgKGV2cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGU6IElFdmVudCA9IGV2cy5wb3AoKTtcbiAgICAgICAgZm9yIChjb25zdCBmIG9mIGZyYW1lcykge1xuICAgICAgICAgIGYub25FdmVudChlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiLy8gRnJhbWVcbi8vIEJhc2UgY2xhc3MgZm9yIFVJIGFuZCBDb21wb3NlciBmcmFtZXNcbi8vIEhhbmRsZXMgYW55IHNoYXJlZCBmdW5jdGlvbmFsaXR5LlxuXG5pbXBvcnQgeyBBQUJCIH0gZnJvbSBcIi4vYWFiYlwiO1xuaW1wb3J0IHsgSUFwcENhbnZhcyB9IGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xuXG5leHBvcnQgY2xhc3MgRnJhbWUge1xuICBwdWJsaWMgb25Nb3VzZU92ZXI6IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpID0+IHZvaWQ7XG4gIHB1YmxpYyBvbk1vdXNlQ2xpY2s6IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpID0+IHZvaWQ7XG4gIHB1YmxpYyBvbk1vdXNlRHJhZ0JlZ2luOiAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSA9PiB2b2lkO1xuICBwdWJsaWMgb25Nb3VzZURyYWdVcGRhdGU6IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpID0+IHZvaWQ7XG4gIHB1YmxpYyBvbk1vdXNlRHJhZ0VuZDogKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikgPT4gdm9pZDtcbiAgcHVibGljIG9uTW91c2VMZWF2ZTogKCkgPT4gdm9pZDtcblxuICBwcm90ZWN0ZWQgYXBwRXZlbnRzOiBldmVudHMuQXBwRXZlbnRzO1xuICBwcm90ZWN0ZWQgYXBwQ2FudmFzOiBJQXBwQ2FudmFzO1xuICBwcm90ZWN0ZWQgc3RhcnR4OiBudW1iZXI7XG4gIHByb3RlY3RlZCB3aWR0aDogbnVtYmVyO1xuICBwcm90ZWN0ZWQgaGVpZ2h0OiBudW1iZXI7XG4gIHByb3RlY3RlZCBiZ0NvbG9yOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhYWJiOiBBQUJCO1xuXG4gIGNvbnN0cnVjdG9yKGFwcEV2ZW50czogZXZlbnRzLkFwcEV2ZW50cywgYXBwQ2FudmFzOiBJQXBwQ2FudmFzLCBzdGFydHg6IG51bWJlciwgd2lkdGg6IG51bWJlcikge1xuICAgIHRoaXMuYXBwRXZlbnRzID0gYXBwRXZlbnRzO1xuICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuICAgIHRoaXMuc3RhcnR4ID0gc3RhcnR4O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5oZWlnaHQ7XG4gICAgdGhpcy5iZ0NvbG9yID0gXCIjMDAwXCI7XG4gICAgdGhpcy5hYWJiID0gbmV3IEFBQkIoc3RhcnR4LCBzdGFydHggKyB3aWR0aCwgMCwgdGhpcy5oZWlnaHQpO1xuICB9XG5cbiAgcHVibGljIGRyYXcoKTogdm9pZCB7XG4gICAgdGhpcy5hcHBDYW52YXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmFwcENhbnZhcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuYmdDb2xvcjtcbiAgICB0aGlzLmFwcENhbnZhcy5jb250ZXh0LmZpbGxSZWN0KHRoaXMuc3RhcnR4LCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gIH1cblxuICBwdWJsaWMgb25FdmVudChldmVudDogZXZlbnRzLklFdmVudCk6IHZvaWQge1xuICAgIC8vIEZvciByZWNlaXZpbmcgZXZlbnRzXG4gIH1cblxuICAvLyBBY2Nlc3NvcnNcblxuICBwdWJsaWMgZ2V0IGJvdW5kaW5nQm94KCk6IEFBQkIge1xuICAgIHJldHVybiB0aGlzLmFhYmI7XG4gIH1cbn1cbiIsIi8vIFNoYXBlIENvbXBvc2VyIDJcbi8vIEFwcCBlbnRyeSBzY3JpcHRcblxuaW1wb3J0IHsgQXBwIH0gZnJvbSBcIi4vYXBwXCI7XG5cbmxldCBhcHA6IEFwcCA9IG51bGw7XG5cbmZ1bmN0aW9uIHZpZXdMb29wKCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodmlld0xvb3ApO1xuICBhcHAub25GcmFtZSgpO1xufVxuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICBjb25zdCBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmdNZXNzYWdlXCIpO1xuICBlbHQuaW5uZXJUZXh0ID0gXCJcIjtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY0NhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIC8vIGZpeCBmb3IgZG91YmxlLWNsaWNrIHRvIHNlbGVjdFxuICBjYW52YXMub25zZWxlY3RzdGFydCA9ICgpID0+IHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGFwcCA9IG5ldyBBcHAoY2FudmFzLCBjb250ZXh0KTtcbiAgYXBwLnN0YXJ0KCk7XG4gIHZpZXdMb29wKCk7XG59O1xuIiwiLy8gTW91c2VDdXJzb3Jcbi8vIFByb3ZpZGVzIGZ1bmN0aW9ucyBmb3Igc2V0dGluZyBtb3VzZSBjdXJzb3IuXG5cbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBJQXBwQ2FudmFzIH0gZnJvbSBcIi4vYXBwXCI7XG5cbmNvbnN0IGN1cnNvcnM6IHN0cmluZ1tdID0gW1xuICBcImF1dG9cIixcbiAgXCJudy1yZXNpemVcIixcbiAgXCJuLXJlc2l6ZVwiLFxuICBcIm5lLXJlc2l6ZVwiLFxuICBcInctcmVzaXplXCIsXG4gIFwibW92ZVwiLFxuICBcImUtcmVzaXplXCIsXG4gIFwic3ctcmVzaXplXCIsXG4gIFwicy1yZXNpemVcIixcbiAgXCJzZS1yZXNpemVcIixcbiAgXCJjb2wtcmVzaXplXCJcbl07XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNb3VzZUN1cnNvciB7XG4gIHB1YmxpYyBzdGF0aWMgUmVzZXRNb3VzZUN1cnNvcihhcHBDYW52YXM6IElBcHBDYW52YXMpOiB2b2lkIHtcbiAgICBhcHBDYW52YXMuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiO1xuICB9XG5cbiAgLy8gU2V0IGN1cnNvciB0byBtb3ZlbWVudCBjcm9zc1xuICBwdWJsaWMgc3RhdGljIFNldE1vdXNlQ3Vyc29yVG9Dcm9zcyhhcHBDYW52YXM6IElBcHBDYW52YXMpOiB2b2lkIHtcbiAgICBhcHBDYW52YXMuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwibW92ZVwiO1xuICB9XG5cbiAgLy8gU2V0IGN1cnNvciB0byBkaXJlY3Rpb25hbCBzY2FsaW5nIG9yIG1vdmVtZW50IGNyb3NzOlxuICAvLyAgIDggIDEgIDIgICBOVyBOIE5FXG4gIC8vICAgNyAgOSAgMyA9IFcgICsgIEVcbiAgLy8gICA2ICA1ICA0ICAgU1cgUyBTRVxuICBwdWJsaWMgc3RhdGljIFNldE1vdXNlQ3Vyc29yVHJhbnNmb3JtKGFwcENhbnZhczogSUFwcENhbnZhcywgbW9kZTogbnVtYmVyKTogdm9pZCB7XG4gICAgYXBwQ2FudmFzLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBjdXJzb3JzW21vZGVdO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTZXRNb3VzZUN1cnNvclJvdGF0b3IoYXBwQ2FudmFzOiBJQXBwQ2FudmFzKTogdm9pZCB7XG4gICAgYXBwQ2FudmFzLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImNvbC1yZXNpemVcIjtcbiAgfVxufVxuIiwiLy8gUGVyc2lzdGVuY2Vcbi8vIEhhbmRsZXMgZ2xvYmFsIHBlcnNpc3RlbmN5IG9wZXJhdGlvbnMuXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQZXJzaXN0ZW5jZSB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1RPUkFHRV9OQU1FOiBzdHJpbmcgPSBcIlZlcnNlMlwiO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERBVEFfTkFNRTogc3RyaW5nID0gXCJ2ZXJzZTJkYXRhXCI7XG5cbiAgcHVibGljIHN0YXRpYyBoYXNQcmV2aW91c1NjZW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5TVE9SQUdFX05BTUUpICE9PSBudWxsO1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbG9hZERhdGEoKTogYW55IHtcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuREFUQV9OQU1FKTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHN0b3JlRGF0YShkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuU1RPUkFHRV9OQU1FLCBcInRydWVcIik7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuREFUQV9OQU1FLCBkYXRhKTtcbiAgfVxufVxuIiwiLy8gUmVjdFxuLy8gU2ltcGxlIHJlY3QgY2xhc3NcblxuZXhwb3J0IGNsYXNzIFJlY3Qge1xuICBwdWJsaWMgeDogbnVtYmVyO1xuICBwdWJsaWMgeTogbnVtYmVyO1xuICBwdWJsaWMgd2lkdGg6IG51bWJlcjtcbiAgcHVibGljIGhlaWdodDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLndpZHRoID0gdztcbiAgICB0aGlzLmhlaWdodCA9IGg7XG4gIH1cbn1cbiIsIi8vIFNlbGVjdGlvbiBCb3hcbi8vIEhhbmRsZXMgc2VsZWN0aW9uIGJveCByZXByZXNlbnRhdGlvbiBhbmQgb3BlcmF0aW9ucy5cblxuaW1wb3J0IHsgQUFCQiB9IGZyb20gXCIuL2FhYmJcIjtcbmltcG9ydCB7IElBcHBDYW52YXMgfSBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCB7IENhbnZhc1Rvb2xzIH0gZnJvbSBcIi4vY2FudmFzLXRvb2xzXCI7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBNb3VzZUN1cnNvciB9IGZyb20gXCIuL21vdXNlLWN1cnNvclwiO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gXCIuL3JlY3RcIjtcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSBcIi4vc2hhcGVcIjtcbmltcG9ydCB7IFZlYzIgfSBmcm9tIFwiLi92ZWMyXCI7XG5cbmNvbnN0IFNDQUxFUl9USElDS05FU1M6IG51bWJlciA9IDEwO1xuY29uc3QgUk9UQVRPUl9ESVNUQU5DRTogbnVtYmVyID0gMjA7XG5jb25zdCBST1RBVE9SX1JBRElVUzogbnVtYmVyID0gNztcblxuZW51bSBFVHJhbnNmb3JtTW9kZSB7XG4gIE5vbmUsXG4gIE1vdmluZyxcbiAgUm90YXRpbmcsXG4gIFNjYWxpbmdcbn1cblxuLy8gU2VsZWN0aW9uIGJveCBicm9hZGNhc3RzIHR3byBldmVudHM6XG4vLyAxLiBFdmVudCBpbmRpY2F0aW5nIHNvbWV0aGluZyB3YXMgc2VsZWN0ZWQgKGRpc3BhdGNoZWQgb24gY29uc3RydWN0aW9uKVxuLy8gMi4gRXZlbnQgaW5kaWNhdGluZyBub3RoaW5nIGlzIHNlbGVjdGVkIChjYWxsZWQgYmVmb3JlIGRlc3RydWN0aW9uOiBvblVuc2VsZWN0KVxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbkJveCB7XG4gIHByaXZhdGUgc2hhcGU6IFNoYXBlO1xuICBwcml2YXRlIGFwcEV2ZW50czogZXZlbnRzLkFwcEV2ZW50cztcbiAgcHJpdmF0ZSBhYWJiOiBBQUJCOyAvLyBBQUJCIG9mIHRyYW5zZm9ybSBib3hcbiAgcHJpdmF0ZSBhYWJiUm90YXRvcjogQUFCQjsgLy8gQUFCQiBvZiByb3RhdGlvbiBjaXJjbGVcbiAgcHJpdmF0ZSB0cmFuc2Zvcm1Nb2RlOiBFVHJhbnNmb3JtTW9kZTtcbiAgcHJpdmF0ZSBsYXN0VHJhbnNmb3JtUG9zOiBWZWMyO1xuICBwcml2YXRlIHNjYWxlck11bHRpcGxpZXI6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihzaGFwZTogU2hhcGUsIGFwcEV2ZW50czogZXZlbnRzLkFwcEV2ZW50cykge1xuICAgIHRoaXMuc2hhcGUgPSBzaGFwZTtcbiAgICB0aGlzLmFwcEV2ZW50cyA9IGFwcEV2ZW50cztcbiAgICB0aGlzLmFwcEV2ZW50cy5icm9hZGNhc3RFdmVudChldmVudHMuRXZlbnRzLlNFTEVDVElPTik7XG4gICAgdGhpcy50cmFuc2Zvcm1Nb2RlID0gRVRyYW5zZm9ybU1vZGUuTm9uZTtcbiAgICB0aGlzLmxhc3RUcmFuc2Zvcm1Qb3MgPSBuZXcgVmVjMigwLCAwKTtcbiAgICB0aGlzLnNjYWxlck11bHRpcGxpZXIgPSAxLjA7XG5cbiAgICB0aGlzLnVwZGF0ZUFBQkJzKHRoaXMuc2hhcGUpO1xuICB9XG5cbiAgcHVibGljIGRyYXcoYXBwQ2FudmFzOiBJQXBwQ2FudmFzKTogdm9pZCB7XG4gICAgLy8gU2VsZWN0aW9uIGJveCBpcyBtYWRlIHVwIG9mOlxuICAgIC8vIC0gMyByZWN0YW5nbGVzIHRvIGluZGljYXRlIGJvdW5kc1xuICAgIC8vIC0gNCBjb3JuZXIgY2lyY2xlcyB0byBzaG93IGNvcm5lciBzY2FsaW5nIGFyZWFzXG4gICAgLy8gLSAxIGNpcmNsZSBhdCB0aGUgdG9wIHRvZSBzaG93IHJvdGF0aW9uXG4gICAgY29uc3QgY29ybmVycyA9IFtbLTEsIC0xXSwgWzEsIC0xXSwgWzEsIDFdLCBbLTEsIDFdXTtcbiAgICBjb25zdCBjb250ZXh0ID0gYXBwQ2FudmFzLmNvbnRleHQ7XG4gICAgY29uc3QgYWFiYiA9IHRoaXMuc2hhcGUuYm91bmRpbmdCb3g7XG5cbiAgICAvLyBCb3VuZGluZyBib3hlc1xuICAgIGxldCByYyA9IG5ldyBSZWN0KGFhYmIubWluWCArIDEsIGFhYmIubWluWSArIDEsIGFhYmIud2lkdGggLSAyLCBhYWJiLmhlaWdodCAtIDIpO1xuICAgIENhbnZhc1Rvb2xzLlN0cm9rZVJlY3QoY29udGV4dCwgcmMsIFwiIzBmMGYwZlwiLCAyLjApO1xuICAgIHJjID0gbmV3IFJlY3QoYWFiYi5taW5YICsgMywgYWFiYi5taW5ZICsgMywgYWFiYi53aWR0aCAtIDYsIGFhYmIuaGVpZ2h0IC0gNik7XG4gICAgQ2FudmFzVG9vbHMuU3Ryb2tlUmVjdChjb250ZXh0LCByYywgXCIjZmZmXCIsIDMuMCk7XG5cbiAgICAvLyBTY2FsZXIgY2lyY2xlc1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMyMjJcIjtcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDIuMDtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiI2VmZVwiO1xuICAgIGZvciAoY29uc3QgYyBvZiBjb3JuZXJzKSB7XG4gICAgICBDYW52YXNUb29scy5EcmF3Q2lyY2xlKFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICBhYWJiLmNlbnRlclswXSArIGNbMF0gKiBhYWJiLndpZHRoIC8gMiArIC1jWzBdICogNCxcbiAgICAgICAgYWFiYi5jZW50ZXJbMV0gKyBjWzFdICogYWFiYi5oZWlnaHQgLyAyIC0gY1sxXSAqIDQsXG4gICAgICAgIDQsXG4gICAgICAgIFwiI2VmZVwiLFxuICAgICAgICBcIiMyMjJcIixcbiAgICAgICAgMi4wXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIERhc2hlZCBib3JkZXIgbGluZVxuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzIsIDJdKTtcbiAgICByYyA9IG5ldyBSZWN0KGFhYmIubWluWCwgYWFiYi5taW5ZLCBhYWJiLndpZHRoLCBhYWJiLmhlaWdodCk7XG4gICAgQ2FudmFzVG9vbHMuU3Ryb2tlUmVjdChjb250ZXh0LCByYywgXCIjZmZmXCIsIDEuMCk7XG5cbiAgICAvLyBCb3VuZGFyeSB0byByb3RhdGlvbiBjaXJjbGUgZGFzaGVkIGxpbmVcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCAyXSk7XG4gICAgQ2FudmFzVG9vbHMuRHJhd0xpbmUoY29udGV4dCwgXCIjZmZmXCIsIFthYWJiLmNlbnRlclswXSwgYWFiYi5taW5ZXSwgWzAsIC1ST1RBVE9SX0RJU1RBTkNFXSk7XG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbXSk7XG5cbiAgICAvLyBSb3RhdGlvbiBjaXJjbGVcbiAgICBDYW52YXNUb29scy5EcmF3Q2lyY2xlKGNvbnRleHQsIGFhYmIuY2VudGVyWzBdLCBhYWJiLm1pblkgLSAyMCwgUk9UQVRPUl9SQURJVVMsIFwiI2ZmZlwiLCBcIiMyMjJcIik7XG5cbiAgICB0aGlzLnVwZGF0ZUFBQkJzKHRoaXMuc2hhcGUpO1xuICB9XG5cbiAgcHVibGljIGlzSW5zaWRlVHJhbnNmb3JtKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmFhYmIuaXNQb2ludEluc2lkZShtb3VzZVgsIG1vdXNlWSkgfHwgdGhpcy5hYWJiUm90YXRvci5pc1BvaW50SW5zaWRlKG1vdXNlWCwgbW91c2VZKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgb25VbnNlbGVjdChkb250U2VuZEV2ZW50OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAoIWRvbnRTZW5kRXZlbnQpIHtcbiAgICAgIHRoaXMuYXBwRXZlbnRzLmJyb2FkY2FzdEV2ZW50KGV2ZW50cy5FdmVudHMuTk9TRUxFQ1RJT04pO1xuICAgIH1cbiAgICAvLyBJZiB1bnNlbGVjdGVkIHdoaWxlIHRyYW5zZm9ybWluZywgc3RvcmUgc2NlbmUgZXZlbnRcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Nb2RlICE9PSBFVHJhbnNmb3JtTW9kZS5Ob25lKSB7XG4gICAgICB0aGlzLmFwcEV2ZW50cy5icm9hZGNhc3RFdmVudChldmVudHMuRXZlbnRzLlNUT1JFU0NFTkUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbk1vdXNlT3ZlcihhcHBDYW52YXM6IElBcHBDYW52YXMsIG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHRyYW5zZm9ybU1vZGUgPSB0aGlzLmRldGVybWluZVRyYW5zZm9ybU1vZGUobW91c2VYLCBtb3VzZVkpO1xuICAgIE1vdXNlQ3Vyc29yLlNldE1vdXNlQ3Vyc29yVHJhbnNmb3JtKGFwcENhbnZhcywgdHJhbnNmb3JtTW9kZSk7XG4gIH1cblxuICAvLyBSZXR1cm5zOiB0cnVlIGlmIGRyYWcgaXMgb24gc2VsZWN0aW9uIGJveCwgZmFsc2UgaWYgbm90XG4gIHB1YmxpYyBvbk1vdXNlRHJhZ0JlZ2luKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybVR5cGUgPSB0aGlzLmRldGVybWluZVRyYW5zZm9ybU1vZGUobW91c2VYLCBtb3VzZVkpO1xuICAgIHRoaXMubGFzdFRyYW5zZm9ybVBvcyA9IG5ldyBWZWMyKG1vdXNlWCwgbW91c2VZKTtcbiAgICBpZiAodHJhbnNmb3JtVHlwZSA9PT0gMTApIHtcbiAgICAgIC8vIFJvdGF0aW9uIGNpcmNsZVxuICAgICAgdGhpcy50cmFuc2Zvcm1Nb2RlID0gRVRyYW5zZm9ybU1vZGUuUm90YXRpbmc7XG4gICAgfSBlbHNlIGlmICh0cmFuc2Zvcm1UeXBlID09PSA1KSB7XG4gICAgICAvLyBNb3ZpbmcgKGNlbnRyYWwgYXJlYSlcbiAgICAgIHRoaXMudHJhbnNmb3JtTW9kZSA9IEVUcmFuc2Zvcm1Nb2RlLk1vdmluZztcbiAgICB9IGVsc2UgaWYgKHRyYW5zZm9ybVR5cGUgPiAwKSB7XG4gICAgICAvLyBTY2FsZXJzXG4gICAgICAvLyBmb3Igc2NhbGluZyB0byBtYXRjaCBzZWxlY3Rpb24gYm94OiBwcm9wZXJ0eSBzY2FsZXJNdWx0aXBsZXIgaXMgc2V0XG4gICAgICAvLyBieSBkZXRlcm1pbmVUcmFuc2Zvcm1Nb2RlIHRvIDEgZm9yIGVkZ2VzLCBhbmQgc3FydCgyKSBmb3IgY29ybmVyc1xuICAgICAgdGhpcy50cmFuc2Zvcm1Nb2RlID0gRVRyYW5zZm9ybU1vZGUuU2NhbGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmFuc2Zvcm1Nb2RlID0gRVRyYW5zZm9ybU1vZGUuTm9uZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwdWJsaWMgb25Nb3VzZURyYWdVcGRhdGUobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHJhbnNmb3JtTW9kZSAhPT0gRVRyYW5zZm9ybU1vZGUuTm9uZSkge1xuICAgICAgY29uc3QgY3VyclBvczogVmVjMiA9IG5ldyBWZWMyKG1vdXNlWCwgbW91c2VZKTtcbiAgICAgIC8vIFRyYW5zZm9ybWluZyBzaGFwZVxuICAgICAgaWYgKHRoaXMudHJhbnNmb3JtTW9kZSA9PT0gRVRyYW5zZm9ybU1vZGUuTW92aW5nKSB7XG4gICAgICAgIC8vIC0tLS0gVHJhbnNsYXRpb25cbiAgICAgICAgdGhpcy5zaGFwZS50cmFuc2xhdGUoXG4gICAgICAgICAgY3VyclBvcy54IC0gdGhpcy5sYXN0VHJhbnNmb3JtUG9zLngsXG4gICAgICAgICAgY3VyclBvcy55IC0gdGhpcy5sYXN0VHJhbnNmb3JtUG9zLnlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy50cmFuc2Zvcm1Nb2RlID09PSBFVHJhbnNmb3JtTW9kZS5Sb3RhdGluZykge1xuICAgICAgICAvLyAtLS0tIFJvdGF0aW9uXG4gICAgICAgIGNvbnN0IHJvdGF0ZUZhY3RvcjogbnVtYmVyID0gKGN1cnJQb3MueCAtIHRoaXMubGFzdFRyYW5zZm9ybVBvcy54KSAqIDAuNSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMuc2hhcGUucm90YXRlKHJvdGF0ZUZhY3Rvcik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudHJhbnNmb3JtTW9kZSA9PT0gRVRyYW5zZm9ybU1vZGUuU2NhbGluZykge1xuICAgICAgICAvLyAtLS0tIFNjYWxpbmdcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3I6IG51bWJlciA9XG4gICAgICAgICAgY3VyclBvcy5zdWIodGhpcy5zaGFwZS5jZW50ZXIpLmRpc3RhbmNlKCkgL1xuICAgICAgICAgICh0aGlzLnNoYXBlLmJvdW5kaW5nQm94LndpZHRoICogdGhpcy5zY2FsZXJNdWx0aXBsaWVyIC8gMik7XG4gICAgICAgIHRoaXMuc2hhcGUuc2NhbGUoc2NhbGVGYWN0b3IsIHNjYWxlRmFjdG9yKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubGFzdFRyYW5zZm9ybVBvcy54ID0gbW91c2VYO1xuICAgICAgdGhpcy5sYXN0VHJhbnNmb3JtUG9zLnkgPSBtb3VzZVk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uTW91c2VEcmFnRW5kKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFN0b3JlIHNjZW5lIGlmIHRyYW5zZm9ybWF0aW9uIHRvb2sgcGxhY2VcbiAgICBpZiAodGhpcy50cmFuc2Zvcm1Nb2RlICE9PSBFVHJhbnNmb3JtTW9kZS5Ob25lKSB7XG4gICAgICB0aGlzLmFwcEV2ZW50cy5icm9hZGNhc3RFdmVudChldmVudHMuRXZlbnRzLlNUT1JFU0NFTkUpO1xuICAgICAgdGhpcy50cmFuc2Zvcm1Nb2RlID0gRVRyYW5zZm9ybU1vZGUuTm9uZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVzZXRNb3VzZUN1cnNvcihhcHBDYW52YXM6IElBcHBDYW52YXMpOiB2b2lkIHtcbiAgICBNb3VzZUN1cnNvci5SZXNldE1vdXNlQ3Vyc29yKGFwcENhbnZhcyk7XG4gIH1cblxuICAvLyBBY2Nlc3NvcnNcblxuICBwdWJsaWMgZ2V0IHNlbGVjdGVkU2hhcGUoKTogU2hhcGUge1xuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgLy8gUHJpdmF0ZXNcblxuICAvLyBVcGRhdGVzIHRyYW5zZm9ybSBhbmQgcm90YXRvciBib3VuZGluZyBib3hlc1xuICBwcml2YXRlIHVwZGF0ZUFBQkJzKHNoYXBlOiBTaGFwZSk6IHZvaWQge1xuICAgIHRoaXMuYWFiYiA9IHRoaXMuc2hhcGUuYm91bmRpbmdCb3g7XG4gICAgLy8gQ2FsY3VsYXRlIHJvdGF0b3IgQUFCQiBiYXNlZCBvbiB0cmFuc2Zvcm0gQUFCQlxuICAgIGNvbnN0IGxlZnQ6IG51bWJlciA9IHRoaXMuYWFiYi5jZW50ZXJbMF0gLSBST1RBVE9SX1JBRElVUztcbiAgICBjb25zdCB0b3A6IG51bWJlciA9IHRoaXMuYWFiYi5taW5ZIC0gUk9UQVRPUl9ESVNUQU5DRSAtIFJPVEFUT1JfUkFESVVTO1xuICAgIHRoaXMuYWFiYlJvdGF0b3IgPSBBQUJCLkZyb21SZWN0KGxlZnQsIHRvcCwgUk9UQVRPUl9SQURJVVMgKiAyLCBST1RBVE9SX1JBRElVUyAqIDIpO1xuICB9XG5cbiAgLy8gMDogbm8gdHJhbnNmb3JtXG4gIC8vIDEsIDIsIDMsIDQsIDYsIDcsIDgsIDk6IHNjYWxlcnMgMT1OIDI9TkUgMz1FIDQ9U0UgNj1TIDc9U1cgOD1XIDk9TldcbiAgLy8gNTogbW92ZXJcbiAgLy8gMTA6IHJvdGF0aW9uXG4gIHByaXZhdGUgZGV0ZXJtaW5lVHJhbnNmb3JtTW9kZShtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLmFhYmIuaXNQb2ludEluc2lkZShtb3VzZVgsIG1vdXNlWSkpIHtcbiAgICAgIGxldCBteDogbnVtYmVyID0gMjtcbiAgICAgIGxldCBteTogbnVtYmVyID0gMjtcbiAgICAgIC8vIEhvcml6b250YWxcbiAgICAgIGlmIChtb3VzZVggPD0gdGhpcy5hYWJiLm1pblggKyBTQ0FMRVJfVEhJQ0tORVNTKSB7XG4gICAgICAgIC8vIC0tIExlZnQgc2lkZSBzY2FsZXJcbiAgICAgICAgbXggPSAwO1xuICAgICAgfSBlbHNlIGlmIChtb3VzZVggPD0gdGhpcy5hYWJiLm1heFggLSBTQ0FMRVJfVEhJQ0tORVNTKSB7XG4gICAgICAgIC8vIC0tIENlbnRlciBhcmVhXG4gICAgICAgIG14ID0gMTtcbiAgICAgIH0gLy8gRWxzZTogUmlnaHQgc2lkZSBzY2FsZXJcbiAgICAgIC8vIFZlcnRpY2FsXG4gICAgICBpZiAobW91c2VZIDw9IHRoaXMuYWFiYi5taW5ZICsgU0NBTEVSX1RISUNLTkVTUykge1xuICAgICAgICAvLyAtLSBUb3Agc2lkZSBzY2FsZXJcbiAgICAgICAgbXkgPSAwO1xuICAgICAgfSBlbHNlIGlmIChtb3VzZVkgPD0gdGhpcy5hYWJiLm1heFkgLSBTQ0FMRVJfVEhJQ0tORVNTKSB7XG4gICAgICAgIC8vIC0tIENlbnRlciBhcmVhXG4gICAgICAgIG15ID0gMTtcbiAgICAgIH0gLy8gRWxzZTogQm90dG9tIHNpZGUgc2NhbGVyXG4gICAgICB0aGlzLnNjYWxlck11bHRpcGxpZXIgPSBteCAhPT0gMSAmJiBteSAhPT0gMSA/IE1hdGguU1FSVDIgOiAxLjA7XG4gICAgICByZXR1cm4gbXkgKiAzICsgbXggKyAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hYWJiUm90YXRvci5pc1BvaW50SW5zaWRlKG1vdXNlWCwgbW91c2VZKSkge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFNoYXBlVG9vbHNcbi8vIFRyYW5zZm9ybWF0aW9uIGFuZCBjb252ZXJzaW9uIGZ1bmN0aW9ucyBmb3Igc2hhcGVzLlxuXG5pbXBvcnQgeyBWZWMyIH0gZnJvbSBcIi4vdmVjMlwiO1xuXG5leHBvcnQgY2xhc3MgU2hhcGVUb29scyB7XG4gIC8vIEdlbmVyYXRlcyBwYXRoMkQgZnJvbSBsaXN0IG9mIHZlcnRpY2VzLlxuICBwdWJsaWMgc3RhdGljIFRvUGF0aDJEKHZlcnRzOiBWZWMyW10pOiBQYXRoMkQge1xuICAgIGlmICh2ZXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoYXBlLlZlcnRpY2VzVG9QYXRoMkQoKSBnaXZlbiBlbXB0eSB2ZXJ0ZXggbGlzdC5cIik7XG4gICAgfVxuICAgIGNvbnN0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcbiAgICBwYXRoLm1vdmVUbyh2ZXJ0c1swXS54LCB2ZXJ0c1swXS55KTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmVydHMpIHtcbiAgICAgIHBhdGgubGluZVRvKHYueCwgdi55KTtcbiAgICB9XG4gICAgcGF0aC5jbG9zZVBhdGgoKTtcbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG4gIC8vIFNoYXBlIHRyYW5zZm9ybWF0aW9uXG4gIHB1YmxpYyBzdGF0aWMgVHJhbnNsYXRlKHZlcnRzOiBWZWMyW10sIGRlbHRheHk6IFtudW1iZXIsIG51bWJlcl0pOiBWZWMyW10ge1xuICAgIGNvbnN0IHR2ZXJ0czogVmVjMltdID0gW107XG4gICAgZm9yIChjb25zdCB2IG9mIHZlcnRzKSB7XG4gICAgICB0dmVydHMucHVzaCh2LmFkZChuZXcgVmVjMihkZWx0YXh5WzBdLCBkZWx0YXh5WzFdKSkpO1xuICAgIH1cbiAgICByZXR1cm4gdHZlcnRzO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBSb3RhdGUodmVydHM6IFZlYzJbXSwgY2VudGVyeHk6IFtudW1iZXIsIG51bWJlcl0sIGFuZ2xlUmFkaWFuczogbnVtYmVyKTogVmVjMltdIHtcbiAgICBjb25zdCB0dmVydHM6IFZlYzJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdiBvZiB2ZXJ0cykge1xuICAgICAgdHZlcnRzLnB1c2godi5yb3RhdGUoYW5nbGVSYWRpYW5zLCBuZXcgVmVjMihjZW50ZXJ4eVswXSwgY2VudGVyeHlbMV0pKSk7XG4gICAgfVxuICAgIHJldHVybiB0dmVydHM7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFNjYWxlKFxuICAgIHZlcnRzOiBWZWMyW10sXG4gICAgY2VudGVyeHk6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgc2NhbGV4eTogW251bWJlciwgbnVtYmVyXVxuICApOiBWZWMyW10ge1xuICAgIGNvbnN0IHR2ZXJ0czogVmVjMltdID0gW107XG4gICAgY29uc3QgY2VudGVyOiBWZWMyID0gbmV3IFZlYzIoY2VudGVyeHlbMF0sIGNlbnRlcnh5WzFdKTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmVydHMpIHtcbiAgICAgIHR2ZXJ0cy5wdXNoKFxuICAgICAgICB2XG4gICAgICAgICAgLnN1YihjZW50ZXIpXG4gICAgICAgICAgLnNjYWxleHkoc2NhbGV4eVswXSwgc2NhbGV4eVsxXSlcbiAgICAgICAgICAuYWRkKGNlbnRlcilcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0dmVydHM7XG4gIH1cblxuICAvLyBTaGFwZSBjcmVhdGlvblxuICBwdWJsaWMgc3RhdGljIFJlY3Qod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBWZWMyW10ge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgVmVjMigtd2lkdGggLyAyLCAtaGVpZ2h0IC8gMiksXG4gICAgICBuZXcgVmVjMigrd2lkdGggLyAyLCAtaGVpZ2h0IC8gMiksXG4gICAgICBuZXcgVmVjMigrd2lkdGggLyAyLCAraGVpZ2h0IC8gMiksXG4gICAgICBuZXcgVmVjMigtd2lkdGggLyAyLCAraGVpZ2h0IC8gMilcbiAgICBdO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBDaXJjbGUocmFkaXVzOiBudW1iZXIsIGNpcmNsZVNlZ21lbnRzOiBudW1iZXIgPSAzMik6IFZlYzJbXSB7XG4gICAgY29uc3QgdjogVmVjMltdID0gW107XG4gICAgZm9yIChsZXQgciA9IDAuMDsgciA8IDIgKiBNYXRoLlBJOyByICs9IDIgKiBNYXRoLlBJIC8gY2lyY2xlU2VnbWVudHMpIHtcbiAgICAgIHYucHVzaChuZXcgVmVjMihNYXRoLmNvcyhyKSAqIHJhZGl1cywgTWF0aC5zaW4ocikgKiByYWRpdXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFRyaWFuZ2xlKGJhc2VXaWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IFZlYzJbXSB7XG4gICAgY29uc3QgdjogVmVjMltdID0gW107XG4gICAgY29uc3QgeCA9IC1iYXNlV2lkdGggLyAyO1xuICAgIGNvbnN0IHkgPSAtaGVpZ2h0IC8gMjtcbiAgICB2LnB1c2gobmV3IFZlYzIoeCArIGJhc2VXaWR0aCAvIDIsIHkpKTtcbiAgICB2LnB1c2gobmV3IFZlYzIoeCArIGJhc2VXaWR0aCwgeSArIGhlaWdodCkpO1xuICAgIHYucHVzaChuZXcgVmVjMih4LCB5ICsgaGVpZ2h0KSk7XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFN0YXIocmFkaXVzOiBudW1iZXIpOiBWZWMyW10ge1xuICAgIGNvbnN0IHY6IFZlYzJbXSA9IFtdO1xuICAgIGNvbnN0IGlubmVyUmFkaXVzID0gMC41ICogcmFkaXVzO1xuICAgIGNvbnN0IHBvaW50cyA9IDUuMDtcbiAgICBjb25zdCBhbmdsZSA9IE1hdGguUEkgKiAyIC8gKHBvaW50cyAqIDIpO1xuICAgIGZvciAobGV0IGkgPSBwb2ludHMgKiAyICsgMTsgaSA+IDA7IC0taSkge1xuICAgICAgY29uc3QgciA9IGkgJSAyID09PSAxID8gcmFkaXVzIDogaW5uZXJSYWRpdXM7XG4gICAgICBjb25zdCBvbWVnYSA9IGFuZ2xlICogaTtcbiAgICAgIGNvbnN0IHR4ID0gciAqIE1hdGguc2luKG9tZWdhKTtcbiAgICAgIGNvbnN0IHR5ID0gciAqIE1hdGguY29zKG9tZWdhKTtcbiAgICAgIHYucHVzaChuZXcgVmVjMih0eCwgdHkgKyA3KSk7IC8vIHN0YXIgc2xpZ2h0bHkgb2Zmc2V0IHVwd2FyZHNcbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cbn1cbiIsIi8vIFNoYXBlXG4vLyBFYWNoIGluc3RhbmNlIHJlcHJlc2VudHMgYSBzaGFwZSBpbi1nYW1lLlxuXG5pbXBvcnQgeyBBQUJCIH0gZnJvbSBcIi4vYWFiYlwiO1xuaW1wb3J0IHsgSUFwcENhbnZhcyB9IGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IHsgQ29sbGlzaW9uIH0gZnJvbSBcIi4vY29sbGlzaW9uXCI7XG5pbXBvcnQgeyBTaGFwZVRvb2xzIH0gZnJvbSBcIi4vc2hhcGUtdG9vbHNcIjtcbmltcG9ydCB7IFZlYzIgfSBmcm9tIFwiLi92ZWMyXCI7XG5cbmNvbnN0IENJUkNMRV9TRUdNRU5UUzogbnVtYmVyID0gNDA7XG5cbmV4cG9ydCBlbnVtIEVTaGFwZSB7XG4gIHJlY3QsXG4gIGNpcmNsZSxcbiAgdHJpYW5nbGUsXG4gIHN0YXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU2hhcGUge1xuICBpZDogbnVtYmVyO1xuICB2ZXJ0czogVmVjMltdO1xuICBjb2xvcjogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU2hhcGUge1xuICBwcml2YXRlIHN0YXRpYyBjdXJyZW50SWQ6IG51bWJlciA9IDA7XG5cbiAgcHVibGljIG1vdXNlT3ZlcjogYm9vbGVhbjtcblxuICBwcml2YXRlIHNoYXBlOiBJU2hhcGU7XG4gIHByaXZhdGUgYWFiYjogQUFCQjtcblxuICBjb25zdHJ1Y3Rvcih2ZXJ0aWNlczogVmVjMltdLCBjb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5zaGFwZSA9IHt9IGFzIElTaGFwZTtcbiAgICB0aGlzLnNoYXBlLmlkID0gKytTaGFwZS5jdXJyZW50SWQ7XG4gICAgdGhpcy5zaGFwZS52ZXJ0cyA9IHZlcnRpY2VzO1xuICAgIHRoaXMuc2hhcGUuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLmFhYmIgPSB0aGlzLmNhbGN1bGF0ZUJvdW5kaW5nQm94KCk7XG4gIH1cblxuICAvLyBTaGFwZSBkcmF3aW5nXG4gIHB1YmxpYyBkcmF3KGFwcENhbnZhczogSUFwcENhbnZhcywgZGVmYXVsdExpbmVXaWR0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2hhcGUudmVydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNoYXBlICR7dGhpcy5zaGFwZS5pZH06IGhhcyBhbiBlbXB0eSB2ZXJ0ZXggbGlzdC5gKTtcbiAgICB9XG4gICAgYXBwQ2FudmFzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgYXBwQ2FudmFzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5zaGFwZS5jb2xvcjtcbiAgICBhcHBDYW52YXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMubW91c2VPdmVyXG4gICAgICA/IFwiI2ZmZlwiXG4gICAgICA6IFwiIzAwMFwiO1xuICAgIGNvbnN0IHBhdGg6IFBhdGgyRCA9IG5ldyBQYXRoMkQoKTtcbiAgICBwYXRoLm1vdmVUbyhcbiAgICAgIHRoaXMuc2hhcGUudmVydHNbdGhpcy5zaGFwZS52ZXJ0cy5sZW5ndGggLSAxXS54LFxuICAgICAgdGhpcy5zaGFwZS52ZXJ0c1t0aGlzLnNoYXBlLnZlcnRzLmxlbmd0aCAtIDFdLnlcbiAgICApO1xuICAgIGZvciAoY29uc3QgdiBvZiB0aGlzLnNoYXBlLnZlcnRzKSB7XG4gICAgICBwYXRoLmxpbmVUbyh2LngsIHYueSk7XG4gICAgfVxuICAgIGFwcENhbnZhcy5jb250ZXh0LmZpbGwocGF0aCk7XG4gICAgYXBwQ2FudmFzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5tb3VzZU92ZXIgPyAzIDogZGVmYXVsdExpbmVXaWR0aDtcbiAgICBhcHBDYW52YXMuY29udGV4dC5zdHJva2UocGF0aCk7XG5cbiAgICAvLyBTaGFwZSBjb2xsaXNpb25cbiAgICBhcHBDYW52YXMuY29sbENvbnRleHQuZmlsbFN0eWxlID0gQ29sbGlzaW9uLklkVG9Db2xvcih0aGlzLnNoYXBlLmlkKTtcbiAgICBhcHBDYW52YXMuY29sbENvbnRleHQuZmlsbChwYXRoKTtcblxuICAgIGFwcENhbnZhcy5jb250ZXh0LmxpbmVXaWR0aCA9IGRlZmF1bHRMaW5lV2lkdGg7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNsYXRlKGR4OiBudW1iZXIsIGR5OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNoYXBlLnZlcnRzID0gU2hhcGVUb29scy5UcmFuc2xhdGUodGhpcy5zaGFwZS52ZXJ0cywgW2R4LCBkeV0pO1xuICAgIHRoaXMuYWFiYiA9IHRoaXMuY2FsY3VsYXRlQm91bmRpbmdCb3goKTtcbiAgfVxuXG4gIHB1YmxpYyByb3RhdGUoYW5nbGVSYWRpYW5zOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNoYXBlLnZlcnRzID0gU2hhcGVUb29scy5Sb3RhdGUodGhpcy5zaGFwZS52ZXJ0cywgdGhpcy5hYWJiLmNlbnRlciwgYW5nbGVSYWRpYW5zKTtcbiAgICB0aGlzLmFhYmIgPSB0aGlzLmNhbGN1bGF0ZUJvdW5kaW5nQm94KCk7XG4gIH1cblxuICBwdWJsaWMgc2NhbGUoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2hhcGUudmVydHMgPSBTaGFwZVRvb2xzLlNjYWxlKHRoaXMuc2hhcGUudmVydHMsIHRoaXMuYWFiYi5jZW50ZXIsIFtzeCwgc3ldKTtcbiAgICB0aGlzLmFhYmIgPSB0aGlzLmNhbGN1bGF0ZUJvdW5kaW5nQm94KCk7XG4gIH1cblxuICAvLyBBY2Nlc3NvcnNcbiAgcHVibGljIGdldCBkYXRhKCk6IElTaGFwZSB7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlkKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGUuaWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGJvdW5kaW5nQm94KCk6IEFBQkIge1xuICAgIHJldHVybiB0aGlzLmFhYmI7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNlbnRlcigpOiBWZWMyIHtcbiAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5hYWJiLmNlbnRlclswXSwgdGhpcy5hYWJiLmNlbnRlclsxXSk7XG4gIH1cblxuICAvLyBTaGFwZSB0cmFuc2Zvcm1hdGlvblxuICBwcml2YXRlIGNhbGN1bGF0ZUJvdW5kaW5nQm94KCk6IEFBQkIge1xuICAgIGNvbnN0IGFhYmI6IEFBQkIgPSBuZXcgQUFCQigpO1xuICAgIGZvciAoY29uc3QgdiBvZiB0aGlzLnNoYXBlLnZlcnRzKSB7XG4gICAgICBhYWJiLm1pblggPSB2LnggPCBhYWJiLm1pblggPyB2LnggOiBhYWJiLm1pblg7XG4gICAgICBhYWJiLm1heFggPSB2LnggPiBhYWJiLm1heFggPyB2LnggOiBhYWJiLm1heFg7XG4gICAgICBhYWJiLm1pblkgPSB2LnkgPCBhYWJiLm1pblkgPyB2LnkgOiBhYWJiLm1pblk7XG4gICAgICBhYWJiLm1heFkgPSB2LnkgPiBhYWJiLm1heFkgPyB2LnkgOiBhYWJiLm1heFk7XG4gICAgfVxuICAgIHJldHVybiBhYWJiO1xuICB9XG59XG4iLCIvLyBVSUZyYW1lXG4vLyBJbi1hcHAgVUkgZnJhbWUuXG5cbmltcG9ydCB7IEFBQkIgfSBmcm9tIFwiLi9hYWJiXCI7XG5pbXBvcnQgeyBJQXBwQ2FudmFzIH0gZnJvbSBcIi4vYXBwXCI7XG5pbXBvcnQgeyBQQUxFVFRFIH0gZnJvbSBcIi4vYXBwXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi9idXR0b25cIjtcbmltcG9ydCB7IENhbnZhc1Rvb2xzIH0gZnJvbSBcIi4vY2FudmFzLXRvb2xzXCI7XG5pbXBvcnQgeyBBcHBFdmVudHMsIEV2ZW50cywgSUV2ZW50IH0gZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBGcmFtZSB9IGZyb20gXCIuL2ZyYW1lXCI7XG5pbXBvcnQgeyBFU2hhcGUgfSBmcm9tIFwiLi9zaGFwZVwiO1xuaW1wb3J0IHsgU2hhcGVUb29scyB9IGZyb20gXCIuL3NoYXBlLXRvb2xzXCI7XG5cbmV4cG9ydCBjbGFzcyBVSUZyYW1lIGV4dGVuZHMgRnJhbWUge1xuICBwcml2YXRlIHNlcGVyYXRvckxpbmU6IFBhdGgyRDtcbiAgcHJpdmF0ZSBidXR0b25zOiBCdXR0b25bXTtcbiAgcHJpdmF0ZSBkZWxldGVCdXR0b246IEJ1dHRvbjtcblxuICBjb25zdHJ1Y3RvcihhcHBFdmVudHM6IEFwcEV2ZW50cywgYXBwQ2FudmFzOiBJQXBwQ2FudmFzLCBzdGFydHg6IG51bWJlciwgd2lkdGg6IG51bWJlcikge1xuICAgIHN1cGVyKGFwcEV2ZW50cywgYXBwQ2FudmFzLCBzdGFydHgsIHdpZHRoKTtcbiAgICB0aGlzLmJnQ29sb3IgPSBcIiM0NDhcIjtcbiAgICB0aGlzLnNlcGVyYXRvckxpbmUgPSBuZXcgUGF0aDJEKCk7XG4gICAgdGhpcy5zZXBlcmF0b3JMaW5lLm1vdmVUbyh0aGlzLndpZHRoLCAwKTtcbiAgICB0aGlzLnNlcGVyYXRvckxpbmUubGluZVRvKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICB0aGlzLmJ1dHRvbnMgPSBbXTtcbiAgICB0aGlzLmluaXRBcHBCdXR0b25zKCk7XG4gIH1cblxuICBwdWJsaWMgZHJhdygpOiB2b2lkIHtcbiAgICBzdXBlci5kcmF3KCk7XG4gICAgdGhpcy5hcHBDYW52YXMuY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbnRleHQuZm9udCA9IFwiMTNweCBhcmlhbFwiO1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5hcHBDYW52YXMuY29udGV4dC5zdHJva2VTdHlsZSA9IFwiIzIyMlwiO1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbnRleHQuc3Ryb2tlKHRoaXMuc2VwZXJhdG9yTGluZSk7XG4gICAgdGhpcy5kcmF3U2VwZXJhdG9yKDIsIDI1NSwgNDYsIDApO1xuXG4gICAgLy8gQnV0dG9uc1xuICAgIGZvciAoY29uc3QgYnV0dG9uIG9mIHRoaXMuYnV0dG9ucykge1xuICAgICAgYnV0dG9uLmRyYXcodGhpcy5hcHBDYW52YXMuY29udGV4dCwgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gRXZlbnRzXG4gIHB1YmxpYyBvbkV2ZW50KGV2ZW50OiBJRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gRXZlbnRzLlNFTEVDVElPTikge1xuICAgICAgdGhpcy5kZWxldGVCdXR0b24uZW5hYmxlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBFdmVudHMuTk9TRUxFQ1RJT04gfHwgZXZlbnQudHlwZSA9PT0gRXZlbnRzLkRFTEVURSkge1xuICAgICAgdGhpcy5kZWxldGVCdXR0b24uZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1vdXNlIEV2ZW50c1xuICBwdWJsaWMgb25Nb3VzZU92ZXIgPSAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBidXR0b24gb2YgdGhpcy5idXR0b25zKSB7XG4gICAgICBpZiAoYnV0dG9uLmVuYWJsZWQgJiYgYnV0dG9uLmJvdW5kaW5nQm94LmlzUG9pbnRJbnNpZGUobW91c2VYLCBtb3VzZVkpKSB7XG4gICAgICAgIGJ1dHRvbi5tb3VzZU92ZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnV0dG9uLm1vdXNlT3ZlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcHVibGljIG9uTW91c2VMZWF2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICBmb3IgKGNvbnN0IGJ1dHRvbiBvZiB0aGlzLmJ1dHRvbnMpIHtcbiAgICAgIGJ1dHRvbi5tb3VzZU92ZXIgPSBmYWxzZTtcbiAgICB9XG4gIH07XG4gIHB1YmxpYyBvbk1vdXNlQ2xpY2sgPSAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgZm9yIChjb25zdCBidXR0b24gb2YgdGhpcy5idXR0b25zKSB7XG4gICAgICBpZiAoYnV0dG9uLmVuYWJsZWQgJiYgYnV0dG9uLmJvdW5kaW5nQm94LmlzUG9pbnRJbnNpZGUobW91c2VYLCBtb3VzZVkpKSB7XG4gICAgICAgIGJ1dHRvbi5jbGljayh0aGlzLmFwcEV2ZW50cyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBwdWJsaWMgb25Nb3VzZURyYWdCZWdpbiA9IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkID0+IHt9O1xuICBwdWJsaWMgb25Nb3VzZURyYWdVcGRhdGUgPSAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCA9PiB7fTtcbiAgcHVibGljIG9uTW91c2VEcmFnRW5kID0gKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQgPT4ge307XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcml2YXRlc1xuXG4gIHByaXZhdGUgaW5pdEFwcEJ1dHRvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgaWNvbiA9IFtcbiAgICAgIFNoYXBlVG9vbHMuVG9QYXRoMkQoU2hhcGVUb29scy5UcmFuc2xhdGUoU2hhcGVUb29scy5SZWN0KDMwLCAzMCksIFsyNSwgNzVdKSksXG4gICAgICBTaGFwZVRvb2xzLlRvUGF0aDJEKFNoYXBlVG9vbHMuVHJhbnNsYXRlKFNoYXBlVG9vbHMuQ2lyY2xlKDE1KSwgWzI1LCAxMjVdKSksXG4gICAgICBTaGFwZVRvb2xzLlRvUGF0aDJEKFNoYXBlVG9vbHMuVHJhbnNsYXRlKFNoYXBlVG9vbHMuVHJpYW5nbGUoMzAsIDMwKSwgWzI1LCAxNzVdKSksXG4gICAgICBTaGFwZVRvb2xzLlRvUGF0aDJEKFNoYXBlVG9vbHMuVHJhbnNsYXRlKFNoYXBlVG9vbHMuU3RhcigxNSksIFsyNSwgMjIwXSkpXG4gICAgXTtcbiAgICBjb25zdCB0aXAgPSBbXG4gICAgICBcIlJlc2V0IHNjZW5lIHRvIGRlZmF1bHRcIixcbiAgICAgIFwiQ3JlYXRlIG5ldyBSZWN0XCIsXG4gICAgICBcIkNyZWF0ZSBOZXcgQ2lyY2xlXCIsXG4gICAgICBcIkNyZWF0ZSBOZXcgVHJpYW5nbGVcIixcbiAgICAgIFwiQ3JlYXRlIG5ldyBTdGFyXCIsXG4gICAgICBcIkRlbGV0ZSBzZWxlY3RlZCBzaGFwZVwiXG4gICAgXTtcbiAgICB0aGlzLmJ1dHRvbnMgPSBbXG4gICAgICBuZXcgQnV0dG9uKFwiUmVzZXRcIiwgRXZlbnRzLlJFU0VUU0NFTkUsIG51bGwsIDUsIDUsIDQwLCA0MCwgdGlwWzBdLCBudWxsLCB0cnVlLCBcIiNhYWZcIiksXG4gICAgICBuZXcgQnV0dG9uKFwiY3JlYXRlUmVjdFwiLCBFdmVudHMuQ1JFQVRFLCBFU2hhcGUucmVjdCwgNSwgNTUsIDQwLCA0MCwgdGlwWzFdLCBpY29uWzBdKSxcbiAgICAgIG5ldyBCdXR0b24oXCJjcmVhdGVDaXJjbGVcIiwgRXZlbnRzLkNSRUFURSwgRVNoYXBlLmNpcmNsZSwgNSwgMTA1LCA0MCwgNDAsIHRpcFsyXSwgaWNvblsxXSksXG4gICAgICBuZXcgQnV0dG9uKFwiY3JlYXRlVHJpYW5nbGVcIiwgRXZlbnRzLkNSRUFURSwgRVNoYXBlLnRyaWFuZ2xlLCA1LCAxNTUsIDQwLCA0MCwgdGlwWzNdLCBpY29uWzJdKSxcbiAgICAgIG5ldyBCdXR0b24oXCJjcmVhdGVTdGFyXCIsIEV2ZW50cy5DUkVBVEUsIEVTaGFwZS5zdGFyLCA1LCAyMDUsIDQwLCA0MCwgdGlwWzRdLCBpY29uWzNdKVxuICAgIF07XG4gICAgdGhpcy5kZWxldGVCdXR0b24gPSBuZXcgQnV0dG9uKFxuICAgICAgXCJkZWxldGVTZWxlY3RlZFwiLFxuICAgICAgRXZlbnRzLkRFTEVURSxcbiAgICAgIG51bGwsXG4gICAgICA1LFxuICAgICAgMjY1LFxuICAgICAgNDAsXG4gICAgICA0MCxcbiAgICAgIHRpcFs1XSxcbiAgICAgIG51bGwsXG4gICAgICBmYWxzZSxcbiAgICAgIFwiI2MzM1wiXG4gICAgKTtcbiAgICB0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmRlbGV0ZUJ1dHRvbik7XG4gIH1cblxuICBwcml2YXRlIGRyYXdTZXBlcmF0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgQ2FudmFzVG9vbHMuRHJhd0xpbmUodGhpcy5hcHBDYW52YXMuY29udGV4dCwgXCIjMDAwXCIsIFt4ICsgMSwgeSArIDFdLCBbd2lkdGgsIGhlaWdodF0pO1xuICAgIENhbnZhc1Rvb2xzLkRyYXdMaW5lKHRoaXMuYXBwQ2FudmFzLmNvbnRleHQsIFwiI2ZmZlwiLCBbeCwgeV0sIFt3aWR0aCwgaGVpZ2h0XSk7XG4gIH1cbn1cbiIsIi8vIFZlYzJcbi8vIFZlY3RvciAyIGNvbnRhaW5lciBhbmQgbWF0aC4gTWF0aCBtZXRob2RzIGFyZSBub24tbXV0YXRpbmcuXG5cbmV4cG9ydCBjbGFzcyBWZWMyIHtcbiAgcHVibGljIHg6IG51bWJlcjtcbiAgcHVibGljIHk6IG51bWJlcjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyID0gMC4wLCB5OiBudW1iZXIgPSAwLjApIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cbiAgXG4gIC8vIFJldHVybnM6ICB2ZWN0b3IgKyBiIHZlY3RvclxuICBwdWJsaWMgYWRkKGI6IFZlYzIpOiBWZWMyIHtcbiAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgYi54LCB0aGlzLnkgKyBiLnkpO1xuICB9XG5cbiAgLy8gUmV0dXJuczogdmVjdG9yIC0gYiB2ZWN0b3JcbiAgcHVibGljIHN1YihiOiBWZWMyKTogVmVjMiB7XG4gICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIGIueCwgdGhpcy55IC0gYi55KTtcbiAgfVxuXG4gIC8vIFJldHVybnM6IGRpcmVjdGlvbiBvZiB0aGlzIHZlY3RvciBpbiByYWRpYW5zXG4gIHB1YmxpYyBkaXJlY3Rpb24oKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy54ICE9PSAwLjApIHtcbiAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMueSAhPT0gMC4wKSB7XG4gICAgICByZXR1cm4gdGhpcy55ID4gMC4wID8gOTAuMCAqIE1hdGguUEkgLyAxODAuMCA6IC05MC4wICogTWF0aC5QSSAvIDE4MC4wO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zaWRlcmVkIGRvbWFpbiBlcnJvclxuICAgICAgLy8gcmV0dXJuaW5nIHplcm8gZm9sbG93aW5nIHN0YW5kYXJkIElFQy02MDU1OS9JRUVFIDc1NFxuICAgICAgcmV0dXJuIDAuMDtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zOiBtYWduaXR1ZGUgb2YgdmVjMlxuICBwdWJsaWMgZGlzdGFuY2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gIH1cblxuICAvLyBSZXR1cm5zOiBjYWxjdWxhdGVkIG5vcm1hbCBmb3IgdmVjdG9yXG4gIHB1YmxpYyBub3JtYWwoKTogVmVjMiB7XG4gICAgY29uc3QgbTogbnVtYmVyID0gdGhpcy5kaXN0YW5jZSgpO1xuICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyBtLCB0aGlzLnkgLyBtKTtcbiAgfVxuXG4gIC8vIFJldHVybnM6IHJvdGF0ZWQgdmVjdG9yIGFyb3VuZCBhIGdpdmVuIHBvaW50IChvciBvcmlnaW4gaWYgbnVsbCkuXG4gIHB1YmxpYyByb3RhdGUocmFkaWFuczogbnVtYmVyLCBhcm91bmRQb2ludDogVmVjMiA9IG51bGwpOiBWZWMyIHtcbiAgICBjb25zdCBwOiBWZWMyID0gYXJvdW5kUG9pbnQgIT0gbnVsbCA/IGFyb3VuZFBvaW50IDogbmV3IFZlYzIoMCwgMCk7XG4gICAgY29uc3QgcnY6IFZlYzIgPSBuZXcgVmVjMih0aGlzLngsIHRoaXMueSk7XG4gICAgY29uc3QgeDIgPSBwLnggKyAocnYueCAtIHAueCkgKiBNYXRoLmNvcyhyYWRpYW5zKSAtIChydi55IC0gcC55KSAqIE1hdGguc2luKHJhZGlhbnMpO1xuICAgIGNvbnN0IHkyID0gcC55ICsgKHJ2LnggLSBwLngpICogTWF0aC5zaW4ocmFkaWFucykgKyAocnYueSAtIHAueSkgKiBNYXRoLmNvcyhyYWRpYW5zKTtcbiAgICBydi54ID0geDI7XG4gICAgcnYueSA9IHkyO1xuICAgIHJldHVybiBydjtcbiAgfVxuXG4gIHB1YmxpYyBzY2FsZXh5KHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBWZWMyIHtcbiAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICogc3gsIHRoaXMueSAqIHN5KTtcbiAgfVxufVxuIl19
