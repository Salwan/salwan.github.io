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
var shape_1 = require("./shape");
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
                _this.mouseDragFrame = _this.composerFrame;
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
                var overFrame = _this.composerFrame;
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
                _this.composerFrame.onMouseClick(pos.x, pos.y);
                _this.mouseDown = false;
            }
        };
        // Button events
        this.onButtonReset = function (event) {
            _this.appEvents.broadcastEvent(events_1.Events.RESETSCENE);
        };
        this.onButtonRect = function (event) {
            _this.appEvents.broadcastEvent(events_1.Events.CREATE, shape_1.EShape.rect);
        };
        this.onButtonCircle = function (event) {
            _this.appEvents.broadcastEvent(events_1.Events.CREATE, shape_1.EShape.circle);
        };
        this.onButtonTriangle = function (event) {
            _this.appEvents.broadcastEvent(events_1.Events.CREATE, shape_1.EShape.triangle);
        };
        this.onButtonStar = function (event) {
            _this.appEvents.broadcastEvent(events_1.Events.CREATE, shape_1.EShape.star);
        };
        this.onButtonDelete = function (event) {
            _this.appEvents.broadcastEvent(events_1.Events.DELETE);
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
        this.composerFrame = new composer_1.ComposerFrame(this.appEvents, this.appCanvas, 0, canvas.width);
        // Init button events
        document.getElementById("reset").addEventListener("click", this.onButtonReset, false);
        document.getElementById("rect").addEventListener("click", this.onButtonRect, false);
        document.getElementById("circle").addEventListener("click", this.onButtonCircle, false);
        document.getElementById("triangle").addEventListener("click", this.onButtonTriangle, false);
        document.getElementById("star").addEventListener("click", this.onButtonStar, false);
        this.deleteButton = document.getElementById("delete");
        this.deleteButton.addEventListener("click", this.onButtonDelete, false);
        // Init mouse events
        canvas.addEventListener("mousedown", this.onMouseDown, false);
        canvas.addEventListener("mouseup", this.onMouseUp, false);
        canvas.addEventListener("mousemove", this.onMouseMove, false);
    };
    App.prototype.onFrame = function () {
        var collCtx = this.appCanvas.collContext;
        var collCanvas = this.appCanvas.collCanvas;
        // Run events dispatch
        this.appEvents.runEventDispatcher([this, this.composerFrame]);
        // Clear collision frame
        collCtx.clearRect(0, 0, collCanvas.width, collCanvas.height);
        this.composerFrame.draw();
    };
    App.prototype.onEvent = function (event) {
        if (event.type === events_1.Events.SELECTION) {
            this.deleteButton.disabled = false;
        }
        else if (event.type === events_1.Events.NOSELECTION || event.type === events_1.Events.DELETE) {
            this.deleteButton.disabled = true;
        }
    };
    return App;
}());
exports.App = App;

},{"./composer":10,"./events":11,"./shape":19,"./vec2":20}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"assert":1}],10:[function(require,module,exports){
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

},{"./app":7,"./collision":9,"./events":11,"./frame":12,"./persistence":15,"./selection-box":17,"./shape":19,"./shape-tools":18,"./vec2":20}],11:[function(require,module,exports){
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
    // Receiver is any object that has a public onEvent(e:IEvent) method
    AppEvents.prototype.runEventDispatcher = function (receivers) {
        if (this.events.length > 0) {
            // Extract current events for iteration so any events added
            // during any onEvent call will be dispatched next frame:
            var evs = this.events.splice(0, this.events.length);
            while (evs.length > 0) {
                var e = evs.pop();
                for (var _i = 0, receivers_1 = receivers; _i < receivers_1.length; _i++) {
                    var r = receivers_1[_i];
                    r.onEvent(e);
                }
            }
        }
    };
    return AppEvents;
}());
exports.AppEvents = AppEvents;

},{}],12:[function(require,module,exports){
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

},{"./aabb":6}],13:[function(require,module,exports){
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

},{"./app":7}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"./aabb":6,"./canvas-tools":8,"./events":11,"./mouse-cursor":14,"./rect":16,"./vec2":20}],18:[function(require,module,exports){
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

},{"./vec2":20}],19:[function(require,module,exports){
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
        appCanvas.context.strokeStyle = this.mouseOver ? "#fff" : "#000";
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

},{"./aabb":6,"./collision":9,"./shape-tools":18,"./vec2":20}],20:[function(require,module,exports){
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

},{}]},{},[13,7,12,10,19,18,20,6,11,9,17,14,15,8,16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9hYWJiLnRzIiwic3JjL2FwcC50cyIsInNyYy9jYW52YXMtdG9vbHMudHMiLCJzcmMvY29sbGlzaW9uLnRzIiwic3JjL2NvbXBvc2VyLnRzIiwic3JjL2V2ZW50cy50cyIsInNyYy9mcmFtZS50cyIsInNyYy9tYWluLnRzIiwic3JjL21vdXNlLWN1cnNvci50cyIsInNyYy9wZXJzaXN0ZW5jZS50cyIsInNyYy9yZWN0LnRzIiwic3JjL3NlbGVjdGlvbi1ib3gudHMiLCJzcmMvc2hhcGUtdG9vbHMudHMiLCJzcmMvc2hhcGUudHMiLCJzcmMvdmVjMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckYsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVixFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNWLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVNLHNCQUFPLEdBQWQsVUFBZSxFQUFVLEVBQUUsRUFBVTtRQUNuQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNILFdBQUM7QUFBRCxDQXpEQSxBQXlEQyxJQUFBO0FBekRZLG9CQUFJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wYXJlIGFuZCBpc0J1ZmZlciB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2Jsb2IvNjgwZTllNWU0ODhmMjJhYWMyNzU5OWE1N2RjODQ0YTYzMTU5MjhkZC9pbmRleC5qc1xuLy8gb3JpZ2luYWwgbm90aWNlOlxuXG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciB4ID0gYS5sZW5ndGg7XG4gIHZhciB5ID0gYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV07XG4gICAgICB5ID0gYltpXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoeSA8IHgpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgaWYgKGdsb2JhbC5CdWZmZXIgJiYgdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKTtcbiAgfVxuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKTtcbn1cblxuLy8gYmFzZWQgb24gbm9kZSBhc3NlcnQsIG9yaWdpbmFsIG5vdGljZTpcblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBmdW5jdGlvbnNIYXZlTmFtZXMgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9vKCkge30ubmFtZSA9PT0gJ2Zvbyc7XG59KCkpO1xuZnVuY3Rpb24gcFRvU3RyaW5nIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zikge1xuICBpZiAoaXNCdWZmZXIoYXJyYnVmKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKTtcbiAgfVxuICBpZiAoIWFycmJ1Zikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyYnVmLmJ1ZmZlciAmJiBhcnJidWYuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG52YXIgcmVnZXggPSAvXFxzKmZ1bmN0aW9uXFxzKyhbXlxcKFxcc10qKVxccyovO1xuLy8gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9mdW5jdGlvbi5wcm90b3R5cGUubmFtZS9ibG9iL2FkZWVlZWM4YmZjYzYwNjhiMTg3ZDdkOWZiM2Q1YmIxZDNhMzA4OTkvaW1wbGVtZW50YXRpb24uanNcbmZ1bmN0aW9uIGdldE5hbWUoZnVuYykge1xuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmMubmFtZTtcbiAgfVxuICB2YXIgc3RyID0gZnVuYy50b1N0cmluZygpO1xuICB2YXIgbWF0Y2ggPSBzdHIubWF0Y2gocmVnZXgpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gZ2V0TmFtZShzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZykge1xuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzIHx8ICF1dGlsLmlzRnVuY3Rpb24oc29tZXRoaW5nKSkge1xuICAgIHJldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKTtcbiAgfVxuICB2YXIgcmF3bmFtZSA9IGdldE5hbWUoc29tZXRoaW5nKTtcbiAgdmFyIG5hbWUgPSByYXduYW1lID8gJzogJyArIHJhd25hbWUgOiAnJztcbiAgcmV0dXJuICdbRnVuY3Rpb24nICsgIG5hbWUgKyAnXSc7XG59XG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5hY3R1YWwpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5kZWVwU3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBkZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwU3RyaWN0RXF1YWwnLCBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgJiYgaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKChhY3R1YWwgPT09IG51bGwgfHwgdHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgKGV4cGVjdGVkID09PSBudWxsIHx8IHR5cGVvZiBleHBlY3RlZCAhPT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIHN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIGluc3RhbmNlcyBvZiB0eXBlZCBhcnJheXMsIHdyYXAgdGhlaXIgdW5kZXJseWluZ1xuICAvLyBBcnJheUJ1ZmZlcnMgaW4gYSBCdWZmZXIgZWFjaCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZVxuICAvLyBUaGlzIG9wdGltaXphdGlvbiByZXF1aXJlcyB0aGUgYXJyYXlzIHRvIGhhdmUgdGhlIHNhbWUgdHlwZSBhcyBjaGVja2VkIGJ5XG4gIC8vIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgKGFrYSBwVG9TdHJpbmcpLiBOZXZlciBwZXJmb3JtIGJpbmFyeVxuICAvLyBjb21wYXJpc29ucyBmb3IgRmxvYXQqQXJyYXlzLCB0aG91Z2gsIHNpbmNlIGUuZy4gKzAgPT09IC0wIGJ1dCB0aGVpclxuICAvLyBiaXQgcGF0dGVybnMgYXJlIG5vdCBpZGVudGljYWwuXG4gIH0gZWxzZSBpZiAoaXNWaWV3KGFjdHVhbCkgJiYgaXNWaWV3KGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgIHBUb1N0cmluZyhhY3R1YWwpID09PSBwVG9TdHJpbmcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgIShhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHxcbiAgICAgICAgICAgICAgIGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkpIHtcbiAgICByZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxcbiAgICAgICAgICAgICAgICAgICBuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKSA9PT0gMDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgIT09IGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBtZW1vcyA9IG1lbW9zIHx8IHthY3R1YWw6IFtdLCBleHBlY3RlZDogW119O1xuXG4gICAgdmFyIGFjdHVhbEluZGV4ID0gbWVtb3MuYWN0dWFsLmluZGV4T2YoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsSW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAoYWN0dWFsSW5kZXggPT09IG1lbW9zLmV4cGVjdGVkLmluZGV4T2YoZXhwZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7XG4gICAgbWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG5cbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYiwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykge1xuICBpZiAoYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSlcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgaWYgKHN0cmljdCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgIT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSk7XG4gIHZhciBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIsIHN0cmljdCk7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKTtcbiAgdmFyIGtiID0gb2JqZWN0S2V5cyhiKTtcbiAgdmFyIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT09IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQubm90RGVlcFN0cmljdEVxdWFsID0gbm90RGVlcFN0cmljdEVxdWFsO1xuZnVuY3Rpb24gbm90RGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwU3RyaWN0RXF1YWwnLCBub3REZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59XG5cblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElnbm9yZS4gIFRoZSBpbnN0YW5jZW9mIGNoZWNrIGRvZXNuJ3Qgd29yayBmb3IgYXJyb3cgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIF90cnlCbG9jayhibG9jaykge1xuICB2YXIgZXJyb3I7XG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgYmxvY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJsb2NrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICBhY3R1YWwgPSBfdHJ5QmxvY2soYmxvY2spO1xuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIHVzZXJQcm92aWRlZE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZyc7XG4gIHZhciBpc1Vud2FudGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIHV0aWwuaXNFcnJvcihhY3R1YWwpO1xuICB2YXIgaXNVbmV4cGVjdGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIGFjdHVhbCAmJiAhZXhwZWN0ZWQ7XG5cbiAgaWYgKChpc1Vud2FudGVkRXhjZXB0aW9uICYmXG4gICAgICB1c2VyUHJvdmlkZWRNZXNzYWdlICYmXG4gICAgICBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHxcbiAgICAgIGlzVW5leHBlY3RlZEV4Y2VwdGlvbikge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyh0cnVlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MoZmFsc2UsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB0aHJvdyBlcnI7IH07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIi8vIEFBQkJcbi8vIFNpbXBsZSBib3VuZGluZyBib3hlc1xuXG5leHBvcnQgY2xhc3MgQUFCQiB7XG4gIHB1YmxpYyBzdGF0aWMgRnJvbVJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogQUFCQiB7XG4gICAgY29uc3QgYWFiYjogQUFCQiA9IG5ldyBBQUJCKHgsIHggKyB3aWR0aCwgeSwgeSArIGhlaWdodCk7XG4gICAgcmV0dXJuIGFhYmI7XG4gIH1cblxuICBwdWJsaWMgbWluWDogbnVtYmVyO1xuICBwdWJsaWMgbWF4WDogbnVtYmVyO1xuICBwdWJsaWMgbWluWTogbnVtYmVyO1xuICBwdWJsaWMgbWF4WTogbnVtYmVyO1xuXG4gIC8vIENvbnN0cnVjdG9yIHVzZXMgTUFYIGFuZCBNSU4gTnVtYmVyIHZhbHVlcyB0byBhbGxvdyBlYXNpZXIgQUFCQiBjYWxjdWxhdGlvblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgbWluWDogbnVtYmVyID0gTnVtYmVyLk1BWF9WQUxVRSxcbiAgICBtYXhYOiBudW1iZXIgPSBOdW1iZXIuTUlOX1ZBTFVFLFxuICAgIG1pblk6IG51bWJlciA9IE51bWJlci5NQVhfVkFMVUUsXG4gICAgbWF4WTogbnVtYmVyID0gTnVtYmVyLk1JTl9WQUxVRVxuICApIHtcbiAgICB0aGlzLm1pblggPSBtaW5YO1xuICAgIHRoaXMubWF4WCA9IG1heFg7XG4gICAgdGhpcy5taW5ZID0gbWluWTtcbiAgICB0aGlzLm1heFkgPSBtYXhZO1xuICB9XG5cbiAgcHVibGljIGlzUG9pbnRJbnNpZGUocHg6IG51bWJlciwgcHk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmIChweCA8IHRoaXMubWluWCB8fCBweCA+IHRoaXMubWF4WCB8fCBweSA8IHRoaXMubWluWSB8fCBweSA+IHRoaXMubWF4WSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5hYnModGhpcy5tYXhYIC0gdGhpcy5taW5YKTtcbiAgfVxuXG4gIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5hYnModGhpcy5tYXhZIC0gdGhpcy5taW5ZKTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgcmV0dXJuIFt0aGlzLm1pblggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy5taW5ZICsgdGhpcy5oZWlnaHQgLyAyXTtcbiAgfVxufVxuIiwiLy8gQXBwXG4vLyBFbnRyeSBwb2ludCBmb3IgYXBwbGljYXRpb25cbi8vIE1hbmFnZXMgYXBwL2Jyb3dzZXIgbGV2ZWwgZnVuY3Rpb25hbGl0eVxuXG5pbXBvcnQgeyBDb21wb3NlckZyYW1lIH0gZnJvbSBcIi4vY29tcG9zZXJcIjtcbmltcG9ydCB7IEFwcEV2ZW50cywgRXZlbnRzLCBJRXZlbnQgfSBmcm9tIFwiLi9ldmVudHNcIjtcbmltcG9ydCB7IEZyYW1lIH0gZnJvbSBcIi4vZnJhbWVcIjtcbmltcG9ydCB7IEVTaGFwZSB9IGZyb20gXCIuL3NoYXBlXCI7XG5pbXBvcnQgeyBWZWMyIH0gZnJvbSBcIi4vdmVjMlwiO1xuXG5leHBvcnQgY29uc3QgUEFMRVRURTogc3RyaW5nW10gPSBbXCIjODgwMDAwXCIsIFwiI0NDNDRDQ1wiLCBcIiMwMENDNTVcIiwgXCIjMDAwMEFBXCIsIFwiI0VFRUU3N1wiLCBcIiNERDg4NTVcIl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcENhbnZhcyB7XG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgY29sbENhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNvbGxDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG59XG5cbmV4cG9ydCBjbGFzcyBBcHAge1xuICBwcml2YXRlIGNvbXBvc2VyRnJhbWU6IENvbXBvc2VyRnJhbWU7XG4gIHByaXZhdGUgYXBwQ2FudmFzOiBJQXBwQ2FudmFzO1xuICBwcml2YXRlIGFwcEV2ZW50czogQXBwRXZlbnRzO1xuICBwcml2YXRlIGRlbGV0ZUJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgLy8gTW91c2UgZXZlbnRzXG4gIHByaXZhdGUgbW91c2VEb3duUG9zOiBWZWMyO1xuICBwcml2YXRlIG1vdXNlRG93bjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBtb3VzZURyYWc6IGJvb2xlYW47XG4gIHByaXZhdGUgbW91c2VPdmVyRnJhbWU6IEZyYW1lO1xuICBwcml2YXRlIG1vdXNlRHJhZ0ZyYW1lOiBGcmFtZTtcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICAvLyBBcHAgQ2FudmFzXG4gICAgdGhpcy5hcHBDYW52YXMgPSB7IGNhbnZhcywgY29udGV4dCB9IGFzIElBcHBDYW52YXM7XG5cbiAgICAvLyBDcmVhdGUgY29sbGlzaW9uIGNhbnZhc1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbGxDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbGxDYW52YXMud2lkdGggPSB0aGlzLmFwcENhbnZhcy5jYW52YXMud2lkdGg7XG4gICAgdGhpcy5hcHBDYW52YXMuY29sbENhbnZhcy5oZWlnaHQgPSB0aGlzLmFwcENhbnZhcy5jYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbGxDb250ZXh0ID0gdGhpcy5hcHBDYW52YXMuY29sbENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAvLyBNb3VzZSBldmVudHMgZGF0YSBpbml0XG4gICAgdGhpcy5tb3VzZURvd25Qb3MgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURyYWcgPSBmYWxzZTtcbiAgICB0aGlzLm1vdXNlT3ZlckZyYW1lID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRHJhZ0ZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmFwcENhbnZhcy5jb250ZXh0O1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuYXBwQ2FudmFzLmNhbnZhcztcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5hcHBFdmVudHMgPSBuZXcgQXBwRXZlbnRzKCk7XG5cbiAgICAvLyBJbml0IEZyYW1lc1xuICAgIHRoaXMuY29tcG9zZXJGcmFtZSA9IG5ldyBDb21wb3NlckZyYW1lKHRoaXMuYXBwRXZlbnRzLCB0aGlzLmFwcENhbnZhcywgMCwgY2FudmFzLndpZHRoKTtcblxuICAgIC8vIEluaXQgYnV0dG9uIGV2ZW50c1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzZXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25CdXR0b25SZXNldCwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkJ1dHRvblJlY3QsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpcmNsZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkJ1dHRvbkNpcmNsZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpYW5nbGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25CdXR0b25UcmlhbmdsZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkJ1dHRvblN0YXIsIGZhbHNlKTtcbiAgICB0aGlzLmRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHRoaXMuZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQnV0dG9uRGVsZXRlLCBmYWxzZSk7XG5cbiAgICAvLyBJbml0IG1vdXNlIGV2ZW50c1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5vbk1vdXNlVXAsIGZhbHNlKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gIH1cblxuICBwdWJsaWMgb25GcmFtZSgpOiB2b2lkIHtcbiAgICBjb25zdCBjb2xsQ3R4ID0gdGhpcy5hcHBDYW52YXMuY29sbENvbnRleHQ7XG4gICAgY29uc3QgY29sbENhbnZhcyA9IHRoaXMuYXBwQ2FudmFzLmNvbGxDYW52YXM7XG4gICAgLy8gUnVuIGV2ZW50cyBkaXNwYXRjaFxuICAgIHRoaXMuYXBwRXZlbnRzLnJ1bkV2ZW50RGlzcGF0Y2hlcihbdGhpcywgdGhpcy5jb21wb3NlckZyYW1lXSk7XG4gICAgLy8gQ2xlYXIgY29sbGlzaW9uIGZyYW1lXG4gICAgY29sbEN0eC5jbGVhclJlY3QoMCwgMCwgY29sbENhbnZhcy53aWR0aCwgY29sbENhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuY29tcG9zZXJGcmFtZS5kcmF3KCk7XG4gIH1cblxuICBwdWJsaWMgb25FdmVudChldmVudDogSUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09IEV2ZW50cy5TRUxFQ1RJT04pIHtcbiAgICAgIHRoaXMuZGVsZXRlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBFdmVudHMuTk9TRUxFQ1RJT04gfHwgZXZlbnQudHlwZSA9PT0gRXZlbnRzLkRFTEVURSkge1xuICAgICAgdGhpcy5kZWxldGVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRyYW5zbGF0ZSBsb3cgbGV2ZWwgaW5wdXQgZXZlbnRzIHRvIGhpZ2hlciBsZXZlbCBldmVudHM6XG4gIC8vIC0gb25Nb3VzZUNsaWNrOiBpbmRpY2F0ZXMgYSBkb3duIHRoZW4gdXAgd2l0aCBubyBtb3ZlbWVudCBpbi1iZXR3ZWVuXG4gIC8vIC0gb25Nb3VzZU92ZXI6IGluZGljYXRlcyBtb3VzZSBtb3ZlbWVudCBvdmVyIGZyYW1lXG4gIC8vIC0gb25Nb3VzZUxlYXZlOiBpbmRpY2F0ZXMgbW91c2UgbW92ZWQgb3V0IG9mIHRoZSBmcmFtZVxuICAvLyBNb3VzZSBkcmFnIGFwcGxpZXMgdG8gdGhlIHNhbWUgZnJhbWUgdW50aWwgZHJhZyBlbmRzIChldmVuIGlmIGN1cnNvciBsZWZ0IGZyYW1lKTpcbiAgLy8gLSBvbk1vdXNlRHJhZ0JlZ2luOiBpbmRpY2F0ZXMgYSBidXR0b24gZG93biBhbmQgbW92ZSBhY3Rpb24gc3RhcnRcbiAgLy8gLSBvbk1vdXNlRHJhZ1VwZGF0ZTogaW5kaWNhdGVzIGEgY29udGludWVkIGRyYWcgZXZlbnRcbiAgLy8gLSBvbk1vdXNlRHJhZ0VuZDogaW5kaWNhdGVzIGEgYnV0dG9uIHVwIGFmdGVyIGRyYWdnaW5nXG4gIHB1YmxpYyBvbk1vdXNlRG93biA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIHRoaXMubW91c2VEb3duUG9zID0gbmV3IFZlYzIoXG4gICAgICBldmVudC54IC0gdGhpcy5hcHBDYW52YXMuY2FudmFzLm9mZnNldExlZnQsXG4gICAgICBldmVudC55IC0gdGhpcy5hcHBDYW52YXMuY2FudmFzLm9mZnNldFRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICk7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICB9O1xuXG4gIHB1YmxpYyBvbk1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHBvcyA9IG5ldyBWZWMyKFxuICAgICAgZXZlbnQueCAtIHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5vZmZzZXRMZWZ0LFxuICAgICAgZXZlbnQueSAtIHRoaXMuYXBwQ2FudmFzLmNhbnZhcy5vZmZzZXRUb3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICApO1xuICAgIGlmICh0aGlzLm1vdXNlRG93bikge1xuICAgICAgLy8gYmVnaW4gb2YgZHJhZ1xuICAgICAgdGhpcy5tb3VzZURyYWdGcmFtZSA9IHRoaXMuY29tcG9zZXJGcmFtZTtcbiAgICAgIHRoaXMubW91c2VEcmFnRnJhbWUub25Nb3VzZURyYWdCZWdpbih0aGlzLm1vdXNlRG93blBvcy54LCB0aGlzLm1vdXNlRG93blBvcy55KTtcbiAgICAgIHRoaXMubW91c2VEcmFnID0gdHJ1ZTtcbiAgICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1vdXNlRHJhZykge1xuICAgICAgLy8gZHJhZyB1cGRhdGVcbiAgICAgIHRoaXMubW91c2VEcmFnRnJhbWUub25Nb3VzZURyYWdVcGRhdGUocG9zLngsIHBvcy55KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbW91c2Ugb3ZlclxuICAgICAgY29uc3Qgb3ZlckZyYW1lID0gdGhpcy5jb21wb3NlckZyYW1lO1xuICAgICAgb3ZlckZyYW1lLm9uTW91c2VPdmVyKHBvcy54LCBwb3MueSk7XG4gICAgICBpZiAodGhpcy5tb3VzZU92ZXJGcmFtZSAhPT0gbnVsbCAmJiB0aGlzLm1vdXNlT3ZlckZyYW1lICE9PSBvdmVyRnJhbWUpIHtcbiAgICAgICAgLy8gTW91c2UgbW92ZWQgb3V0IG9mIGEgZnJhbWVcbiAgICAgICAgdGhpcy5tb3VzZU92ZXJGcmFtZS5vbk1vdXNlTGVhdmUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubW91c2VPdmVyRnJhbWUgPSBvdmVyRnJhbWU7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBvbk1vdXNlVXAgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBwb3MgPSBuZXcgVmVjMihcbiAgICAgIGV2ZW50LnggLSB0aGlzLmFwcENhbnZhcy5jYW52YXMub2Zmc2V0TGVmdCxcbiAgICAgIGV2ZW50LnkgLSB0aGlzLmFwcENhbnZhcy5jYW52YXMub2Zmc2V0VG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgKTtcbiAgICBpZiAodGhpcy5tb3VzZURyYWcpIHtcbiAgICAgIC8vIGRyYWcgb3ZlclxuICAgICAgdGhpcy5tb3VzZURyYWdGcmFtZS5vbk1vdXNlRHJhZ0VuZChwb3MueCwgcG9zLnkpO1xuICAgICAgdGhpcy5tb3VzZURyYWcgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubW91c2VEb3duKSB7XG4gICAgICAvLyBjbGlja1xuICAgICAgdGhpcy5jb21wb3NlckZyYW1lLm9uTW91c2VDbGljayhwb3MueCwgcG9zLnkpO1xuICAgICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQnV0dG9uIGV2ZW50c1xuICBwdWJsaWMgb25CdXR0b25SZXNldCA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuYXBwRXZlbnRzLmJyb2FkY2FzdEV2ZW50KEV2ZW50cy5SRVNFVFNDRU5FKTtcbiAgfTtcblxuICBwdWJsaWMgb25CdXR0b25SZWN0ID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgdGhpcy5hcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQoRXZlbnRzLkNSRUFURSwgRVNoYXBlLnJlY3QpO1xuICB9O1xuXG4gIHB1YmxpYyBvbkJ1dHRvbkNpcmNsZSA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuYXBwRXZlbnRzLmJyb2FkY2FzdEV2ZW50KEV2ZW50cy5DUkVBVEUsIEVTaGFwZS5jaXJjbGUpO1xuICB9O1xuXG4gIHB1YmxpYyBvbkJ1dHRvblRyaWFuZ2xlID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgdGhpcy5hcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQoRXZlbnRzLkNSRUFURSwgRVNoYXBlLnRyaWFuZ2xlKTtcbiAgfTtcblxuICBwdWJsaWMgb25CdXR0b25TdGFyID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgdGhpcy5hcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQoRXZlbnRzLkNSRUFURSwgRVNoYXBlLnN0YXIpO1xuICB9O1xuXG4gIHB1YmxpYyBvbkJ1dHRvbkRlbGV0ZSA9IChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuYXBwRXZlbnRzLmJyb2FkY2FzdEV2ZW50KEV2ZW50cy5ERUxFVEUpO1xuICB9O1xufVxuIiwiLy8gQ2FudmFzVG9vbHNcbi8vIFNob3J0Y3V0cyB0byBzb21lIGZyZXF1ZW50bHkgdXNlZCBjYW52YXMgcm91dGluZXMuXG5cbmltcG9ydCB7IFJlY3QgfSBmcm9tIFwiLi9yZWN0XCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDYW52YXNUb29scyB7XG4gIHB1YmxpYyBzdGF0aWMgRHJhd0xpbmUoXG4gICAgY3R4OiBhbnksXG4gICAgY29sb3I6IHN0cmluZyxcbiAgICBzdGFydDogW251bWJlciwgbnVtYmVyXSxcbiAgICBkZWx0YTogW251bWJlciwgbnVtYmVyXVxuICApOiB2b2lkIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4Lm1vdmVUbyhzdGFydFswXSwgc3RhcnRbMV0pO1xuICAgIGN0eC5saW5lVG8oc3RhcnRbMF0gKyBkZWx0YVswXSwgc3RhcnRbMV0gKyBkZWx0YVsxXSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBEcmF3UGF0aChjdHg6IGFueSwgcGF0aDogUGF0aDJELCBmaWxsQ29sb3I6IHN0cmluZywgc3Ryb2tlQ29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIEJ1dHRvbiBiYWNrZ3JvdW5kXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3I7XG4gICAgY3R4LmZpbGwocGF0aCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3I7XG4gICAgY3R4LnN0cm9rZShwYXRoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgRHJhd0NpcmNsZShcbiAgICBjdHg6IGFueSxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHJhZGl1czogbnVtYmVyLFxuICAgIGZpbGxDb2xvcjogc3RyaW5nLFxuICAgIHN0cm9rZUNvbG9yOiBzdHJpbmcsXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSAxLjBcbiAgKSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGxDb2xvciA9IGZpbGxDb2xvcjtcbiAgICBjdHguc3Ryb2tlQ29sb3IgPSBzdHJva2VDb2xvcjtcbiAgICBjdHguYXJjKHgsIHksIHJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIEZpbGxQYXRoKGN0eDogYW55LCBwYXRoOiBQYXRoMkQsIGZpbGxDb2xvcjogc3RyaW5nKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmZpbGwocGF0aCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIFN0cm9rZVBhdGgoY3R4OiBhbnksIHBhdGg6IFBhdGgyRCwgc3Ryb2tlQ29sb3I6IHN0cmluZywgbGluZVdpZHRoOiBudW1iZXIgPSAxLjApIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yO1xuICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5zdHJva2UocGF0aCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU3Ryb2tlUmVjdChjdHg6IGFueSwgcmVjdDogUmVjdCwgc3Ryb2tlQ29sb3I6IHN0cmluZywgbGluZVdpZHRoOiBudW1iZXIgPSAxLjApIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgIGN0eC5zdHJva2VSZWN0KHJlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiLy8gQ29sbGlzaW9uXG4vLyBDb2xsaXNpb24gb3BlcmF0aW9ucyBmb3Igc2hhcGVzLlxuXG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG5jb25zdCBFTlRJVFlfQ09MT1JfTVVMVElQTElFUjogbnVtYmVyID0gMHgyMDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbGxpc2lvbiB7XG4gIC8vIENvbnZlcnRzIGVudGl0eSBpZCB0byBodG1sIGNvbG9yIGFzIGEgc3RyaW5nOiAjTk5OTk5OXG4gIHB1YmxpYyBzdGF0aWMgSWRUb0NvbG9yKGlkOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGxldCBjb2xvciA9IChpZCAqIEVOVElUWV9DT0xPUl9NVUxUSVBMSUVSKS50b1N0cmluZygxNik7XG4gICAgYXNzZXJ0KGNvbG9yLmxlbmd0aCA8PSA2KTtcbiAgICB3aGlsZSAoY29sb3IubGVuZ3RoIDwgNikge1xuICAgICAgY29sb3IgPSBcIjBcIiArIGNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gXCIjXCIgKyBjb2xvcjtcbiAgfVxuXG4gIC8vIENvbnZlcnRzIGh0bWwgY29sb3IgKCNOTk5OTk4pIHRvIGVudGl0eSBpZFxuICBwdWJsaWMgc3RhdGljIENvbG9yVG9JZChjb2xvcjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHBhcnNlSW50KGNvbG9yLnN1YnN0cigxKSwgMTYpICYgMHhmZmZmZmYpIC8gRU5USVRZX0NPTE9SX01VTFRJUExJRVI7XG4gIH1cblxuICAvLyBEYXRhIGdpdmVuIGFzOiBbUixHLEIsQV1cbiAgcHVibGljIHN0YXRpYyBSR0JUb0lkKGRhdGE6IFVpbnQ4Q2xhbXBlZEFycmF5KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKChkYXRhWzBdIDw8IDE2KSArIChkYXRhWzFdIDw8IDgpICsgZGF0YVsyXSkgLyBFTlRJVFlfQ09MT1JfTVVMVElQTElFUjtcbiAgfVxufVxuIiwiLy8gQ29tcG9zZXJGcmFtZVxuLy8gU2hhcGVDb21wb3NlciB3aW5kb3cgYW5kIGZ1bmN0aW9uYWxpdHkuXG5cbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBBQUJCIH0gZnJvbSBcIi4vYWFiYlwiO1xuaW1wb3J0IHsgSUFwcENhbnZhcyB9IGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IHsgUEFMRVRURSB9IGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IHsgQ29sbGlzaW9uIH0gZnJvbSBcIi4vY29sbGlzaW9uXCI7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBGcmFtZSB9IGZyb20gXCIuL2ZyYW1lXCI7XG5pbXBvcnQgeyBQZXJzaXN0ZW5jZSB9IGZyb20gXCIuL3BlcnNpc3RlbmNlXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25Cb3ggfSBmcm9tIFwiLi9zZWxlY3Rpb24tYm94XCI7XG5pbXBvcnQgeyBFU2hhcGUsIElTaGFwZSwgU2hhcGUgfSBmcm9tIFwiLi9zaGFwZVwiO1xuaW1wb3J0IHsgU2hhcGVUb29scyB9IGZyb20gXCIuL3NoYXBlLXRvb2xzXCI7XG5pbXBvcnQgeyBWZWMyIH0gZnJvbSBcIi4vdmVjMlwiO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9zZXJGcmFtZSBleHRlbmRzIEZyYW1lIHtcbiAgcHJpdmF0ZSBzaGFwZXM6IFNoYXBlW107XG4gIHByaXZhdGUgbW91c2VPdmVyU2hhcGU6IFNoYXBlO1xuICBwcml2YXRlIHNlbGVjdGlvbkJveDogU2VsZWN0aW9uQm94O1xuXG4gIGNvbnN0cnVjdG9yKGFwcEV2ZW50czogZXZlbnRzLkFwcEV2ZW50cywgYXBwQ2FudmFzOiBJQXBwQ2FudmFzLCBzdGFydHg6IG51bWJlciwgd2lkdGg6IG51bWJlcikge1xuICAgIHN1cGVyKGFwcEV2ZW50cywgYXBwQ2FudmFzLCBzdGFydHgsIHdpZHRoKTtcbiAgICB0aGlzLmJnQ29sb3IgPSBcIiNkZGRcIjtcbiAgICB0aGlzLmxvYWRTY2VuZSgpO1xuICB9XG5cbiAgLy8gRHJhdyBldmVyeXRoaW5nXG5cbiAgcHVibGljIGRyYXcoKTogdm9pZCB7XG4gICAgc3VwZXIuZHJhdygpO1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbnRleHQubGluZVdpZHRoID0gMC41O1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbnRleHQuZm9udCA9IFwiMTNweCBhcmlhbFwiO1xuICAgIGZvciAoY29uc3Qgc2hhcGUgb2YgdGhpcy5zaGFwZXMpIHtcbiAgICAgIHNoYXBlLmRyYXcodGhpcy5hcHBDYW52YXMsIDAuNSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGlvbkJveCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Cb3guZHJhdyh0aGlzLmFwcENhbnZhcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gRXZlbnRzXG5cbiAgcHVibGljIG9uRXZlbnQoZXZlbnQ6IGV2ZW50cy5JRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gZXZlbnRzLkV2ZW50cy5DUkVBVEUpIHtcbiAgICAgIGNvbnN0IGQ6IG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyOCArIDEyOCk7XG4gICAgICB0aGlzLnNoYXBlcy5wdXNoKFxuICAgICAgICB0aGlzLnRyYW5zbGF0ZVNoYXBlKFxuICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGUoZXZlbnQuZGF0YSBhcyBFU2hhcGUsIGQsIGQsIHRoaXMucmFuZG9tQ29sb3IoKSksXG4gICAgICAgICAgNjQgKyBNYXRoLnJhbmRvbSgpICogKHRoaXMud2lkdGggLSAxMjgpLFxuICAgICAgICAgIDY0ICsgTWF0aC5yYW5kb20oKSAqICh0aGlzLmhlaWdodCAtIDEyOClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHRoaXMuYXBwRXZlbnRzLmJyb2FkY2FzdEV2ZW50KGV2ZW50cy5FdmVudHMuU1RPUkVTQ0VORSk7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBldmVudHMuRXZlbnRzLkRFTEVURSkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICAgIGNvbnN0IHNoYXBlOiBTaGFwZSA9IHRoaXMuc2VsZWN0aW9uQm94LnNlbGVjdGVkU2hhcGU7XG4gICAgICAgIHRoaXMudW5zZWxlY3QoKTtcbiAgICAgICAgY29uc3QgaWR4OiBudW1iZXIgPSB0aGlzLnNoYXBlcy5pbmRleE9mKHNoYXBlKTtcbiAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgdGhpcy5zaGFwZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYXBwRXZlbnRzLmJyb2FkY2FzdEV2ZW50KGV2ZW50cy5FdmVudHMuU1RPUkVTQ0VORSk7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSBldmVudHMuRXZlbnRzLlJFU0VUU0NFTkUpIHtcbiAgICAgIHRoaXMudW5zZWxlY3QoKTtcbiAgICAgIHRoaXMucmVzZXRTY2VuZSgpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gZXZlbnRzLkV2ZW50cy5TVE9SRVNDRU5FKSB7XG4gICAgICB0aGlzLnN0b3JlU2NlbmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBNb3VzZSBpbnRlcmFjdGlvbnNcblxuICBwdWJsaWMgb25Nb3VzZU92ZXIgPSAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgLy8gUmVzZXQgbW91c2Ugb3ZlciBoaWdobGlnaHRcbiAgICBpZiAodGhpcy5tb3VzZU92ZXJTaGFwZSkge1xuICAgICAgdGhpcy5tb3VzZU92ZXJTaGFwZS5tb3VzZU92ZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hhbmdpbmcgbW91c2UgY3Vyc29yIGlmIG92ZXIgc2VsZWN0aW9uQm94XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Cb3guaXNJbnNpZGVUcmFuc2Zvcm0obW91c2VYLCBtb3VzZVkpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQm94Lm9uTW91c2VPdmVyKHRoaXMuYXBwQ2FudmFzLCBtb3VzZVgsIG1vdXNlWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbkJveC5yZXNldE1vdXNlQ3Vyc29yKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgcGl4ZWwgYXQgbW91c2UgcG9zaXRpb24gZnJvbSBjb2xsaXNpb24gY2FudmFzIGZvciBzaGFwZSBpZFxuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5nZXRTaGFwZUNvbGxpc2lvbihtb3VzZVgsIG1vdXNlWSk7XG4gICAgaWYgKHNoYXBlKSB7XG4gICAgICBzaGFwZS5tb3VzZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5tb3VzZU92ZXJTaGFwZSA9IHNoYXBlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdXNlT3ZlclNoYXBlID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG9uTW91c2VMZWF2ZSA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy5tb3VzZU92ZXJTaGFwZSkge1xuICAgICAgdGhpcy5tb3VzZU92ZXJTaGFwZS5tb3VzZU92ZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2VPdmVyU2hhcGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZWxlY3Rpb25Cb3gpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQm94LnJlc2V0TW91c2VDdXJzb3IodGhpcy5hcHBDYW52YXMpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgb25Nb3VzZUNsaWNrID0gKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5nZXRTaGFwZUNvbGxpc2lvbihtb3VzZVgsIG1vdXNlWSk7XG4gICAgaWYgKHNoYXBlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkJveCA9IG5ldyBTZWxlY3Rpb25Cb3goc2hhcGUsIHRoaXMuYXBwRXZlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bnNlbGVjdCgpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgb25Nb3VzZURyYWdCZWdpbiA9IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBsZXQgZHJhZ1Rha2VuOiBib29sZWFuID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICBkcmFnVGFrZW4gPSB0aGlzLnNlbGVjdGlvbkJveC5vbk1vdXNlRHJhZ0JlZ2luKG1vdXNlWCwgbW91c2VZKTtcbiAgICB9XG4gICAgLy8gSWYgZHJhZ2dpbmcgb24gbm9uLXNlbGVjdGVkIHNoYXBlLCBzZWxlY3QgYW5kIGRyYWcgdGhhdCBzaGFwZSFcbiAgICBpZiAoIWRyYWdUYWtlbikge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmdldFNoYXBlQ29sbGlzaW9uKG1vdXNlWCwgbW91c2VZKTtcbiAgICAgIGlmIChzaGFwZSkge1xuICAgICAgICB0aGlzLnVuc2VsZWN0KHRydWUpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbkJveCA9IG5ldyBTZWxlY3Rpb25Cb3goc2hhcGUsIHRoaXMuYXBwRXZlbnRzKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25Cb3gub25Nb3VzZURyYWdCZWdpbihtb3VzZVgsIG1vdXNlWSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBvbk1vdXNlRHJhZ1VwZGF0ZSA9IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25Cb3gpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQm94Lm9uTW91c2VEcmFnVXBkYXRlKG1vdXNlWCwgbW91c2VZKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIG9uTW91c2VEcmFnRW5kID0gKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbkJveCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Cb3gub25Nb3VzZURyYWdFbmQobW91c2VYLCBtb3VzZVkpO1xuICAgIH1cbiAgfTtcblxuICAvLyBQcml2YXRlc1xuXG4gIHByaXZhdGUgcmVzZXRTY2VuZSgpOiB2b2lkIHtcbiAgICAvLyBDcmVhdGUgc3RhcnRlciBzaGFwZXNcbiAgICB0aGlzLnNoYXBlcyA9IFtdO1xuICAgIHRoaXMuc2hhcGVzLnB1c2goXG4gICAgICB0aGlzLnRyYW5zbGF0ZVNoYXBlKFxuICAgICAgICB0aGlzLmNyZWF0ZVNoYXBlKEVTaGFwZS5yZWN0LCAxMjgsIDEyOCwgdGhpcy5yYW5kb21Db2xvcigpKSxcbiAgICAgICAgdGhpcy53aWR0aCAvIDIgLSAxMjgsXG4gICAgICAgIHRoaXMuaGVpZ2h0IC8gMiAtIDkyXG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLnNoYXBlcy5wdXNoKFxuICAgICAgdGhpcy50cmFuc2xhdGVTaGFwZShcbiAgICAgICAgdGhpcy5jcmVhdGVTaGFwZShFU2hhcGUuY2lyY2xlLCAxMjgsIDEyOCwgdGhpcy5yYW5kb21Db2xvcigpKSxcbiAgICAgICAgdGhpcy53aWR0aCAvIDIgKyAxMjgsXG4gICAgICAgIHRoaXMuaGVpZ2h0IC8gMiAtIDkyXG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLnNoYXBlcy5wdXNoKFxuICAgICAgdGhpcy50cmFuc2xhdGVTaGFwZShcbiAgICAgICAgdGhpcy5jcmVhdGVTaGFwZShFU2hhcGUudHJpYW5nbGUsIDEyOCwgMTI4LCB0aGlzLnJhbmRvbUNvbG9yKCkpLFxuICAgICAgICB0aGlzLndpZHRoIC8gMiAtIDEyOCxcbiAgICAgICAgdGhpcy5oZWlnaHQgLyAyICsgOTJcbiAgICAgIClcbiAgICApO1xuICAgIHRoaXMuc2hhcGVzLnB1c2goXG4gICAgICB0aGlzLnRyYW5zbGF0ZVNoYXBlKFxuICAgICAgICB0aGlzLmNyZWF0ZVNoYXBlKEVTaGFwZS5zdGFyLCAxMjgsIDEyOCwgdGhpcy5yYW5kb21Db2xvcigpKSxcbiAgICAgICAgdGhpcy53aWR0aCAvIDIgKyAxMjgsXG4gICAgICAgIHRoaXMuaGVpZ2h0IC8gMiArIDkyXG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLnN0b3JlU2NlbmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RvcmVTY2VuZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzY2VuZTogSVNoYXBlW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHRoaXMuc2hhcGVzKSB7XG4gICAgICBzY2VuZS5wdXNoKHNoYXBlLmRhdGEpO1xuICAgIH1cbiAgICBQZXJzaXN0ZW5jZS5zdG9yZURhdGEoSlNPTi5zdHJpbmdpZnkoc2NlbmUpKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZFNjZW5lKCk6IHZvaWQge1xuICAgIGlmIChQZXJzaXN0ZW5jZS5oYXNQcmV2aW91c1NjZW5lKCkpIHtcbiAgICAgIHRoaXMuc2hhcGVzID0gW107XG4gICAgICBjb25zdCBzYXZlOiBJU2hhcGVbXSA9IEpTT04ucGFyc2UoUGVyc2lzdGVuY2UubG9hZERhdGEoKSkgYXMgSVNoYXBlW107XG4gICAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNhdmUpIHtcbiAgICAgICAgY29uc3QgdmVydHM6IFZlYzJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHYgb2Ygc2hhcGUudmVydHMpIHtcbiAgICAgICAgICB2ZXJ0cy5wdXNoKG5ldyBWZWMyKHYueCwgdi55KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGFwZXMucHVzaChuZXcgU2hhcGUodmVydHMsIHNoYXBlLmNvbG9yKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzZXRTY2VuZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdW5zZWxlY3QoZG9udFNlbmRFdmVudDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQm94KSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkJveC5vblVuc2VsZWN0KGRvbnRTZW5kRXZlbnQpO1xuICAgICAgdGhpcy5zZWxlY3Rpb25Cb3ggPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmFuZG9tQ29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gUEFMRVRURVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBQQUxFVFRFLmxlbmd0aCldO1xuICB9XG5cbiAgLy8gR2V0cyBzaGFwZSBieSBJZCwgcmV0dXJucyBudWxsIGlmIG5vIHNoYXBlIG1hdGNoZXMgSWRcbiAgcHJpdmF0ZSBnZXRTaGFwZShpZDogbnVtYmVyKTogU2hhcGUge1xuICAgIGZvciAoY29uc3Qgc2hhcGUgb2YgdGhpcy5zaGFwZXMpIHtcbiAgICAgIGlmIChzaGFwZS5pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFJldHVybnM6IHNoYXBlIHVuZGVyIGdpdmVuIHgsIHkuIG51bGwgaWYgbm90aGluZyBpcyB0aGVyZS5cbiAgcHJpdmF0ZSBnZXRTaGFwZUNvbGxpc2lvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IFNoYXBlIHtcbiAgICBjb25zdCBjb2xsaXNpb25JZCA9IENvbGxpc2lvbi5SR0JUb0lkKHRoaXMuYXBwQ2FudmFzLmNvbGxDb250ZXh0LmdldEltYWdlRGF0YSh4LCB5LCAxLCAxKS5kYXRhKTtcbiAgICByZXR1cm4gY29sbGlzaW9uSWQgPiAwID8gdGhpcy5nZXRTaGFwZShjb2xsaXNpb25JZCkgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTaGFwZSh0eXBlOiBFU2hhcGUsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjb2xvcjogc3RyaW5nKTogU2hhcGUge1xuICAgIGxldCB2ZXJ0czogVmVjMltdID0gW107XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIEVTaGFwZS5yZWN0OlxuICAgICAgICB2ZXJ0cyA9IFNoYXBlVG9vbHMuUmVjdCh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVTaGFwZS5jaXJjbGU6XG4gICAgICAgIHZlcnRzID0gU2hhcGVUb29scy5DaXJjbGUod2lkdGggLyAyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVTaGFwZS50cmlhbmdsZTpcbiAgICAgICAgdmVydHMgPSBTaGFwZVRvb2xzLlRyaWFuZ2xlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRVNoYXBlLnN0YXI6XG4gICAgICAgIHZlcnRzID0gU2hhcGVUb29scy5TdGFyKHdpZHRoIC8gMik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNoYXBlKHZlcnRzLCBjb2xvcik7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZVNoYXBlKHNoYXBlOiBTaGFwZSwgZHg6IG51bWJlciwgZHk6IG51bWJlcik6IFNoYXBlIHtcbiAgICBzaGFwZS50cmFuc2xhdGUoZHgsIGR5KTtcbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cbn1cbiIsIi8vIEFwcEV2ZW50c1xuLy8gQ2xhc3NlcyBmb3IgZXZlbnQgbWFuYWdlbWVudCBhbmQgZGlzcGF0Y2guXG5cbmltcG9ydCB7IEZyYW1lIH0gZnJvbSBcIi4vZnJhbWVcIjtcblxuZXhwb3J0IGNvbnN0IEV2ZW50cyA9IHtcbiAgQ1JFQVRFOiBcImNyZWF0ZVwiLCAvLyBDcmVhdGUgbmV3IHNoYXBlXG4gIERFTEVURTogXCJkZWxldGVcIiwgLy8gRGVsZXRlIHNlbGVjdGVkIHNoYXBlXG4gIE5PU0VMRUNUSU9OOiBcIm5vc2VsZWN0aW9uXCIsIC8vIE5vdGhpbmcgaXMgc2VsZWN0ZWRcbiAgUkVTRVRTQ0VORTogXCJyZXNldFwiLCAvLyBSZXNldCBzY2VuZSB0byBkZWZhdWx0XG4gIFNFTEVDVElPTjogXCJzZWxlY3Rpb25cIiwgLy8gU29tZXRoaW5nIGlzIHNlbGVjdGVkXG4gIFNUT1JFU0NFTkU6IFwic3RvcmVcIiAvLyBTY2VuZSBjaGFuZ2VkLCBzdG9yZSBzY2VuZSBkYXRhIGZvciBwZXJzaXN0ZW5jeVxufTtcblxuZXhwb3J0IGludGVyZmFjZSBJRXZlbnQge1xuICB0eXBlOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcEV2ZW50cyB7XG4gIHByaXZhdGUgZXZlbnRzOiBJRXZlbnRbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICB9XG5cbiAgcHVibGljIGJyb2FkY2FzdEV2ZW50KHR5cGU6IHN0cmluZywgZGF0YTogYW55ID0gbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuZXZlbnRzLnB1c2goeyB0eXBlLCBkYXRhIH0pO1xuICB9XG5cbiAgLy8gUmVjZWl2ZXIgaXMgYW55IG9iamVjdCB0aGF0IGhhcyBhIHB1YmxpYyBvbkV2ZW50KGU6SUV2ZW50KSBtZXRob2RcbiAgcHVibGljIHJ1bkV2ZW50RGlzcGF0Y2hlcihyZWNlaXZlcnM6IGFueVtdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIEV4dHJhY3QgY3VycmVudCBldmVudHMgZm9yIGl0ZXJhdGlvbiBzbyBhbnkgZXZlbnRzIGFkZGVkXG4gICAgICAvLyBkdXJpbmcgYW55IG9uRXZlbnQgY2FsbCB3aWxsIGJlIGRpc3BhdGNoZWQgbmV4dCBmcmFtZTpcbiAgICAgIGNvbnN0IGV2czogSUV2ZW50W10gPSB0aGlzLmV2ZW50cy5zcGxpY2UoMCwgdGhpcy5ldmVudHMubGVuZ3RoKTtcbiAgICAgIHdoaWxlIChldnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBlOiBJRXZlbnQgPSBldnMucG9wKCk7XG4gICAgICAgIGZvciAoY29uc3QgciBvZiByZWNlaXZlcnMpIHtcbiAgICAgICAgICByLm9uRXZlbnQoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIEZyYW1lXG4vLyBCYXNlIGNsYXNzIGZvciBVSSBhbmQgQ29tcG9zZXIgZnJhbWVzXG4vLyBIYW5kbGVzIGFueSBzaGFyZWQgZnVuY3Rpb25hbGl0eS5cblxuaW1wb3J0IHsgQUFCQiB9IGZyb20gXCIuL2FhYmJcIjtcbmltcG9ydCB7IElBcHBDYW52YXMgfSBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tIFwiLi9ldmVudHNcIjtcblxuZXhwb3J0IGNsYXNzIEZyYW1lIHtcbiAgcHVibGljIG9uTW91c2VPdmVyOiAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSA9PiB2b2lkO1xuICBwdWJsaWMgb25Nb3VzZUNsaWNrOiAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSA9PiB2b2lkO1xuICBwdWJsaWMgb25Nb3VzZURyYWdCZWdpbjogKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikgPT4gdm9pZDtcbiAgcHVibGljIG9uTW91c2VEcmFnVXBkYXRlOiAobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKSA9PiB2b2lkO1xuICBwdWJsaWMgb25Nb3VzZURyYWdFbmQ6IChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpID0+IHZvaWQ7XG4gIHB1YmxpYyBvbk1vdXNlTGVhdmU6ICgpID0+IHZvaWQ7XG5cbiAgcHJvdGVjdGVkIGFwcEV2ZW50czogZXZlbnRzLkFwcEV2ZW50cztcbiAgcHJvdGVjdGVkIGFwcENhbnZhczogSUFwcENhbnZhcztcbiAgcHJvdGVjdGVkIHN0YXJ0eDogbnVtYmVyO1xuICBwcm90ZWN0ZWQgd2lkdGg6IG51bWJlcjtcbiAgcHJvdGVjdGVkIGhlaWdodDogbnVtYmVyO1xuICBwcm90ZWN0ZWQgYmdDb2xvcjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgYWFiYjogQUFCQjtcblxuICBjb25zdHJ1Y3RvcihhcHBFdmVudHM6IGV2ZW50cy5BcHBFdmVudHMsIGFwcENhbnZhczogSUFwcENhbnZhcywgc3RhcnR4OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpIHtcbiAgICB0aGlzLmFwcEV2ZW50cyA9IGFwcEV2ZW50cztcbiAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB0aGlzLnN0YXJ0eCA9IHN0YXJ0eDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmFwcENhbnZhcy5jYW52YXMuaGVpZ2h0O1xuICAgIHRoaXMuYmdDb2xvciA9IFwiIzAwMFwiO1xuICAgIHRoaXMuYWFiYiA9IG5ldyBBQUJCKHN0YXJ0eCwgc3RhcnR4ICsgd2lkdGgsIDAsIHRoaXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3KCk6IHZvaWQge1xuICAgIHRoaXMuYXBwQ2FudmFzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5hcHBDYW52YXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmJnQ29sb3I7XG4gICAgdGhpcy5hcHBDYW52YXMuY29udGV4dC5maWxsUmVjdCh0aGlzLnN0YXJ0eCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9XG5cbiAgcHVibGljIG9uRXZlbnQoZXZlbnQ6IGV2ZW50cy5JRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBGb3IgcmVjZWl2aW5nIGV2ZW50c1xuICB9XG5cbiAgLy8gQWNjZXNzb3JzXG5cbiAgcHVibGljIGdldCBib3VuZGluZ0JveCgpOiBBQUJCIHtcbiAgICByZXR1cm4gdGhpcy5hYWJiO1xuICB9XG59XG4iLCIvLyBTaGFwZSBDb21wb3NlciAyXG4vLyBBcHAgZW50cnkgc2NyaXB0XG5cbmltcG9ydCB7IEFwcCB9IGZyb20gXCIuL2FwcFwiO1xuXG5sZXQgYXBwOiBBcHAgPSBudWxsO1xuXG5mdW5jdGlvbiB2aWV3TG9vcCgpIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHZpZXdMb29wKTtcbiAgYXBwLm9uRnJhbWUoKTtcbn1cblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgY29uc3QgZWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nTWVzc2FnZVwiKTtcbiAgZWx0LmlubmVyVGV4dCA9IFwiXCI7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAvLyBmaXggZm9yIGRvdWJsZS1jbGljayB0byBzZWxlY3RcbiAgY2FudmFzLm9uc2VsZWN0c3RhcnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBhcHAgPSBuZXcgQXBwKGNhbnZhcywgY29udGV4dCk7XG4gIGFwcC5zdGFydCgpO1xuICB2aWV3TG9vcCgpO1xufTtcbiIsIi8vIE1vdXNlQ3Vyc29yXG4vLyBQcm92aWRlcyBmdW5jdGlvbnMgZm9yIHNldHRpbmcgbW91c2UgY3Vyc29yLlxuXG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuaW1wb3J0IHsgSUFwcENhbnZhcyB9IGZyb20gXCIuL2FwcFwiO1xuXG5jb25zdCBjdXJzb3JzOiBzdHJpbmdbXSA9IFtcbiAgXCJhdXRvXCIsXG4gIFwibnctcmVzaXplXCIsXG4gIFwibi1yZXNpemVcIixcbiAgXCJuZS1yZXNpemVcIixcbiAgXCJ3LXJlc2l6ZVwiLFxuICBcIm1vdmVcIixcbiAgXCJlLXJlc2l6ZVwiLFxuICBcInN3LXJlc2l6ZVwiLFxuICBcInMtcmVzaXplXCIsXG4gIFwic2UtcmVzaXplXCIsXG4gIFwiY29sLXJlc2l6ZVwiXG5dO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW91c2VDdXJzb3Ige1xuICBwdWJsaWMgc3RhdGljIFJlc2V0TW91c2VDdXJzb3IoYXBwQ2FudmFzOiBJQXBwQ2FudmFzKTogdm9pZCB7XG4gICAgYXBwQ2FudmFzLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImF1dG9cIjtcbiAgfVxuXG4gIC8vIFNldCBjdXJzb3IgdG8gbW92ZW1lbnQgY3Jvc3NcbiAgcHVibGljIHN0YXRpYyBTZXRNb3VzZUN1cnNvclRvQ3Jvc3MoYXBwQ2FudmFzOiBJQXBwQ2FudmFzKTogdm9pZCB7XG4gICAgYXBwQ2FudmFzLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcIm1vdmVcIjtcbiAgfVxuXG4gIC8vIFNldCBjdXJzb3IgdG8gZGlyZWN0aW9uYWwgc2NhbGluZyBvciBtb3ZlbWVudCBjcm9zczpcbiAgLy8gICA4ICAxICAyICAgTlcgTiBORVxuICAvLyAgIDcgIDkgIDMgPSBXICArICBFXG4gIC8vICAgNiAgNSAgNCAgIFNXIFMgU0VcbiAgcHVibGljIHN0YXRpYyBTZXRNb3VzZUN1cnNvclRyYW5zZm9ybShhcHBDYW52YXM6IElBcHBDYW52YXMsIG1vZGU6IG51bWJlcik6IHZvaWQge1xuICAgIGFwcENhbnZhcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gY3Vyc29yc1ttb2RlXTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgU2V0TW91c2VDdXJzb3JSb3RhdG9yKGFwcENhbnZhczogSUFwcENhbnZhcyk6IHZvaWQge1xuICAgIGFwcENhbnZhcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJjb2wtcmVzaXplXCI7XG4gIH1cbn1cbiIsIi8vIFBlcnNpc3RlbmNlXG4vLyBIYW5kbGVzIGdsb2JhbCBwZXJzaXN0ZW5jeSBvcGVyYXRpb25zLlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGVyc2lzdGVuY2Uge1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNUT1JBR0VfTkFNRTogc3RyaW5nID0gXCJWZXJzZTJcIjtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBEQVRBX05BTUU6IHN0cmluZyA9IFwidmVyc2UyZGF0YVwiO1xuXG4gIHB1YmxpYyBzdGF0aWMgaGFzUHJldmlvdXNTY2VuZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuU1RPUkFHRV9OQU1FKSAhPT0gbnVsbDtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGxvYWREYXRhKCk6IGFueSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLkRBVEFfTkFNRSk7XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzdG9yZURhdGEoZGF0YTogYW55KTogdm9pZCB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLlNUT1JBR0VfTkFNRSwgXCJ0cnVlXCIpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLkRBVEFfTkFNRSwgZGF0YSk7XG4gIH1cbn1cbiIsIi8vIFJlY3Rcbi8vIFNpbXBsZSByZWN0IGNsYXNzXG5cbmV4cG9ydCBjbGFzcyBSZWN0IHtcbiAgcHVibGljIHg6IG51bWJlcjtcbiAgcHVibGljIHk6IG51bWJlcjtcbiAgcHVibGljIHdpZHRoOiBudW1iZXI7XG4gIHB1YmxpYyBoZWlnaHQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy53aWR0aCA9IHc7XG4gICAgdGhpcy5oZWlnaHQgPSBoO1xuICB9XG59XG4iLCIvLyBTZWxlY3Rpb24gQm94XG4vLyBIYW5kbGVzIHNlbGVjdGlvbiBib3ggcmVwcmVzZW50YXRpb24gYW5kIG9wZXJhdGlvbnMuXG5cbmltcG9ydCB7IEFBQkIgfSBmcm9tIFwiLi9hYWJiXCI7XG5pbXBvcnQgeyBJQXBwQ2FudmFzIH0gZnJvbSBcIi4vYXBwXCI7XG5pbXBvcnQgeyBDYW52YXNUb29scyB9IGZyb20gXCIuL2NhbnZhcy10b29sc1wiO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xuaW1wb3J0IHsgTW91c2VDdXJzb3IgfSBmcm9tIFwiLi9tb3VzZS1jdXJzb3JcIjtcbmltcG9ydCB7IFJlY3QgfSBmcm9tIFwiLi9yZWN0XCI7XG5pbXBvcnQgeyBTaGFwZSB9IGZyb20gXCIuL3NoYXBlXCI7XG5pbXBvcnQgeyBWZWMyIH0gZnJvbSBcIi4vdmVjMlwiO1xuXG5jb25zdCBTQ0FMRVJfVEhJQ0tORVNTOiBudW1iZXIgPSAxMDtcbmNvbnN0IFJPVEFUT1JfRElTVEFOQ0U6IG51bWJlciA9IDIwO1xuY29uc3QgUk9UQVRPUl9SQURJVVM6IG51bWJlciA9IDc7XG5cbmVudW0gRVRyYW5zZm9ybU1vZGUge1xuICBOb25lLFxuICBNb3ZpbmcsXG4gIFJvdGF0aW5nLFxuICBTY2FsaW5nXG59XG5cbi8vIFNlbGVjdGlvbiBib3ggYnJvYWRjYXN0cyB0d28gZXZlbnRzOlxuLy8gMS4gRXZlbnQgaW5kaWNhdGluZyBzb21ldGhpbmcgd2FzIHNlbGVjdGVkIChkaXNwYXRjaGVkIG9uIGNvbnN0cnVjdGlvbilcbi8vIDIuIEV2ZW50IGluZGljYXRpbmcgbm90aGluZyBpcyBzZWxlY3RlZCAoY2FsbGVkIGJlZm9yZSBkZXN0cnVjdGlvbjogb25VbnNlbGVjdClcbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25Cb3gge1xuICBwcml2YXRlIHNoYXBlOiBTaGFwZTtcbiAgcHJpdmF0ZSBhcHBFdmVudHM6IGV2ZW50cy5BcHBFdmVudHM7XG4gIHByaXZhdGUgYWFiYjogQUFCQjsgLy8gQUFCQiBvZiB0cmFuc2Zvcm0gYm94XG4gIHByaXZhdGUgYWFiYlJvdGF0b3I6IEFBQkI7IC8vIEFBQkIgb2Ygcm90YXRpb24gY2lyY2xlXG4gIHByaXZhdGUgdHJhbnNmb3JtTW9kZTogRVRyYW5zZm9ybU1vZGU7XG4gIHByaXZhdGUgbGFzdFRyYW5zZm9ybVBvczogVmVjMjtcbiAgcHJpdmF0ZSBzY2FsZXJNdWx0aXBsaWVyOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Ioc2hhcGU6IFNoYXBlLCBhcHBFdmVudHM6IGV2ZW50cy5BcHBFdmVudHMpIHtcbiAgICB0aGlzLnNoYXBlID0gc2hhcGU7XG4gICAgdGhpcy5hcHBFdmVudHMgPSBhcHBFdmVudHM7XG4gICAgdGhpcy5hcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQoZXZlbnRzLkV2ZW50cy5TRUxFQ1RJT04pO1xuICAgIHRoaXMudHJhbnNmb3JtTW9kZSA9IEVUcmFuc2Zvcm1Nb2RlLk5vbmU7XG4gICAgdGhpcy5sYXN0VHJhbnNmb3JtUG9zID0gbmV3IFZlYzIoMCwgMCk7XG4gICAgdGhpcy5zY2FsZXJNdWx0aXBsaWVyID0gMS4wO1xuXG4gICAgdGhpcy51cGRhdGVBQUJCcyh0aGlzLnNoYXBlKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3KGFwcENhbnZhczogSUFwcENhbnZhcyk6IHZvaWQge1xuICAgIC8vIFNlbGVjdGlvbiBib3ggaXMgbWFkZSB1cCBvZjpcbiAgICAvLyAtIDMgcmVjdGFuZ2xlcyB0byBpbmRpY2F0ZSBib3VuZHNcbiAgICAvLyAtIDQgY29ybmVyIGNpcmNsZXMgdG8gc2hvdyBjb3JuZXIgc2NhbGluZyBhcmVhc1xuICAgIC8vIC0gMSBjaXJjbGUgYXQgdGhlIHRvcCB0b2Ugc2hvdyByb3RhdGlvblxuICAgIGNvbnN0IGNvcm5lcnMgPSBbWy0xLCAtMV0sIFsxLCAtMV0sIFsxLCAxXSwgWy0xLCAxXV07XG4gICAgY29uc3QgY29udGV4dCA9IGFwcENhbnZhcy5jb250ZXh0O1xuICAgIGNvbnN0IGFhYmIgPSB0aGlzLnNoYXBlLmJvdW5kaW5nQm94O1xuXG4gICAgLy8gQm91bmRpbmcgYm94ZXNcbiAgICBsZXQgcmMgPSBuZXcgUmVjdChhYWJiLm1pblggKyAxLCBhYWJiLm1pblkgKyAxLCBhYWJiLndpZHRoIC0gMiwgYWFiYi5oZWlnaHQgLSAyKTtcbiAgICBDYW52YXNUb29scy5TdHJva2VSZWN0KGNvbnRleHQsIHJjLCBcIiMwZjBmMGZcIiwgMi4wKTtcbiAgICByYyA9IG5ldyBSZWN0KGFhYmIubWluWCArIDMsIGFhYmIubWluWSArIDMsIGFhYmIud2lkdGggLSA2LCBhYWJiLmhlaWdodCAtIDYpO1xuICAgIENhbnZhc1Rvb2xzLlN0cm9rZVJlY3QoY29udGV4dCwgcmMsIFwiI2ZmZlwiLCAzLjApO1xuXG4gICAgLy8gU2NhbGVyIGNpcmNsZXNcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMjIyXCI7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAyLjA7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNlZmVcIjtcbiAgICBmb3IgKGNvbnN0IGMgb2YgY29ybmVycykge1xuICAgICAgQ2FudmFzVG9vbHMuRHJhd0NpcmNsZShcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgYWFiYi5jZW50ZXJbMF0gKyBjWzBdICogYWFiYi53aWR0aCAvIDIgKyAtY1swXSAqIDQsXG4gICAgICAgIGFhYmIuY2VudGVyWzFdICsgY1sxXSAqIGFhYmIuaGVpZ2h0IC8gMiAtIGNbMV0gKiA0LFxuICAgICAgICA0LFxuICAgICAgICBcIiNlZmVcIixcbiAgICAgICAgXCIjMjIyXCIsXG4gICAgICAgIDIuMFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBEYXNoZWQgYm9yZGVyIGxpbmVcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCAyXSk7XG4gICAgcmMgPSBuZXcgUmVjdChhYWJiLm1pblgsIGFhYmIubWluWSwgYWFiYi53aWR0aCwgYWFiYi5oZWlnaHQpO1xuICAgIENhbnZhc1Rvb2xzLlN0cm9rZVJlY3QoY29udGV4dCwgcmMsIFwiI2ZmZlwiLCAxLjApO1xuXG4gICAgLy8gQm91bmRhcnkgdG8gcm90YXRpb24gY2lyY2xlIGRhc2hlZCBsaW5lXG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbMiwgMl0pO1xuICAgIENhbnZhc1Rvb2xzLkRyYXdMaW5lKGNvbnRleHQsIFwiI2ZmZlwiLCBbYWFiYi5jZW50ZXJbMF0sIGFhYmIubWluWV0sIFswLCAtUk9UQVRPUl9ESVNUQU5DRV0pO1xuICAgIGNvbnRleHQuc2V0TGluZURhc2goW10pO1xuXG4gICAgLy8gUm90YXRpb24gY2lyY2xlXG4gICAgQ2FudmFzVG9vbHMuRHJhd0NpcmNsZShjb250ZXh0LCBhYWJiLmNlbnRlclswXSwgYWFiYi5taW5ZIC0gMjAsIFJPVEFUT1JfUkFESVVTLCBcIiNmZmZcIiwgXCIjMjIyXCIpO1xuXG4gICAgdGhpcy51cGRhdGVBQUJCcyh0aGlzLnNoYXBlKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0luc2lkZVRyYW5zZm9ybShtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5hYWJiLmlzUG9pbnRJbnNpZGUobW91c2VYLCBtb3VzZVkpIHx8IHRoaXMuYWFiYlJvdGF0b3IuaXNQb2ludEluc2lkZShtb3VzZVgsIG1vdXNlWSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG9uVW5zZWxlY3QoZG9udFNlbmRFdmVudDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKCFkb250U2VuZEV2ZW50KSB7XG4gICAgICB0aGlzLmFwcEV2ZW50cy5icm9hZGNhc3RFdmVudChldmVudHMuRXZlbnRzLk5PU0VMRUNUSU9OKTtcbiAgICB9XG4gICAgLy8gSWYgdW5zZWxlY3RlZCB3aGlsZSB0cmFuc2Zvcm1pbmcsIHN0b3JlIHNjZW5lIGV2ZW50XG4gICAgaWYgKHRoaXMudHJhbnNmb3JtTW9kZSAhPT0gRVRyYW5zZm9ybU1vZGUuTm9uZSkge1xuICAgICAgdGhpcy5hcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQoZXZlbnRzLkV2ZW50cy5TVE9SRVNDRU5FKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25Nb3VzZU92ZXIoYXBwQ2FudmFzOiBJQXBwQ2FudmFzLCBtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCB0cmFuc2Zvcm1Nb2RlID0gdGhpcy5kZXRlcm1pbmVUcmFuc2Zvcm1Nb2RlKG1vdXNlWCwgbW91c2VZKTtcbiAgICBNb3VzZUN1cnNvci5TZXRNb3VzZUN1cnNvclRyYW5zZm9ybShhcHBDYW52YXMsIHRyYW5zZm9ybU1vZGUpO1xuICB9XG5cbiAgLy8gUmV0dXJuczogdHJ1ZSBpZiBkcmFnIGlzIG9uIHNlbGVjdGlvbiBib3gsIGZhbHNlIGlmIG5vdFxuICBwdWJsaWMgb25Nb3VzZURyYWdCZWdpbihtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCB0cmFuc2Zvcm1UeXBlID0gdGhpcy5kZXRlcm1pbmVUcmFuc2Zvcm1Nb2RlKG1vdXNlWCwgbW91c2VZKTtcbiAgICB0aGlzLmxhc3RUcmFuc2Zvcm1Qb3MgPSBuZXcgVmVjMihtb3VzZVgsIG1vdXNlWSk7XG4gICAgaWYgKHRyYW5zZm9ybVR5cGUgPT09IDEwKSB7XG4gICAgICAvLyBSb3RhdGlvbiBjaXJjbGVcbiAgICAgIHRoaXMudHJhbnNmb3JtTW9kZSA9IEVUcmFuc2Zvcm1Nb2RlLlJvdGF0aW5nO1xuICAgIH0gZWxzZSBpZiAodHJhbnNmb3JtVHlwZSA9PT0gNSkge1xuICAgICAgLy8gTW92aW5nIChjZW50cmFsIGFyZWEpXG4gICAgICB0aGlzLnRyYW5zZm9ybU1vZGUgPSBFVHJhbnNmb3JtTW9kZS5Nb3Zpbmc7XG4gICAgfSBlbHNlIGlmICh0cmFuc2Zvcm1UeXBlID4gMCkge1xuICAgICAgLy8gU2NhbGVyc1xuICAgICAgLy8gZm9yIHNjYWxpbmcgdG8gbWF0Y2ggc2VsZWN0aW9uIGJveDogcHJvcGVydHkgc2NhbGVyTXVsdGlwbGVyIGlzIHNldFxuICAgICAgLy8gYnkgZGV0ZXJtaW5lVHJhbnNmb3JtTW9kZSB0byAxIGZvciBlZGdlcywgYW5kIHNxcnQoMikgZm9yIGNvcm5lcnNcbiAgICAgIHRoaXMudHJhbnNmb3JtTW9kZSA9IEVUcmFuc2Zvcm1Nb2RlLlNjYWxpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJhbnNmb3JtTW9kZSA9IEVUcmFuc2Zvcm1Nb2RlLk5vbmU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHVibGljIG9uTW91c2VEcmFnVXBkYXRlKG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnRyYW5zZm9ybU1vZGUgIT09IEVUcmFuc2Zvcm1Nb2RlLk5vbmUpIHtcbiAgICAgIGNvbnN0IGN1cnJQb3M6IFZlYzIgPSBuZXcgVmVjMihtb3VzZVgsIG1vdXNlWSk7XG4gICAgICAvLyBUcmFuc2Zvcm1pbmcgc2hhcGVcbiAgICAgIGlmICh0aGlzLnRyYW5zZm9ybU1vZGUgPT09IEVUcmFuc2Zvcm1Nb2RlLk1vdmluZykge1xuICAgICAgICAvLyAtLS0tIFRyYW5zbGF0aW9uXG4gICAgICAgIHRoaXMuc2hhcGUudHJhbnNsYXRlKFxuICAgICAgICAgIGN1cnJQb3MueCAtIHRoaXMubGFzdFRyYW5zZm9ybVBvcy54LFxuICAgICAgICAgIGN1cnJQb3MueSAtIHRoaXMubGFzdFRyYW5zZm9ybVBvcy55XG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudHJhbnNmb3JtTW9kZSA9PT0gRVRyYW5zZm9ybU1vZGUuUm90YXRpbmcpIHtcbiAgICAgICAgLy8gLS0tLSBSb3RhdGlvblxuICAgICAgICBjb25zdCByb3RhdGVGYWN0b3I6IG51bWJlciA9IChjdXJyUG9zLnggLSB0aGlzLmxhc3RUcmFuc2Zvcm1Qb3MueCkgKiAwLjUgKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgICB0aGlzLnNoYXBlLnJvdGF0ZShyb3RhdGVGYWN0b3IpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnRyYW5zZm9ybU1vZGUgPT09IEVUcmFuc2Zvcm1Nb2RlLlNjYWxpbmcpIHtcbiAgICAgICAgLy8gLS0tLSBTY2FsaW5nXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yOiBudW1iZXIgPVxuICAgICAgICAgIGN1cnJQb3Muc3ViKHRoaXMuc2hhcGUuY2VudGVyKS5kaXN0YW5jZSgpIC9cbiAgICAgICAgICAodGhpcy5zaGFwZS5ib3VuZGluZ0JveC53aWR0aCAqIHRoaXMuc2NhbGVyTXVsdGlwbGllciAvIDIpO1xuICAgICAgICB0aGlzLnNoYXBlLnNjYWxlKHNjYWxlRmFjdG9yLCBzY2FsZUZhY3Rvcik7XG4gICAgICB9XG4gICAgICB0aGlzLmxhc3RUcmFuc2Zvcm1Qb3MueCA9IG1vdXNlWDtcbiAgICAgIHRoaXMubGFzdFRyYW5zZm9ybVBvcy55ID0gbW91c2VZO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbk1vdXNlRHJhZ0VuZChtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBTdG9yZSBzY2VuZSBpZiB0cmFuc2Zvcm1hdGlvbiB0b29rIHBsYWNlXG4gICAgaWYgKHRoaXMudHJhbnNmb3JtTW9kZSAhPT0gRVRyYW5zZm9ybU1vZGUuTm9uZSkge1xuICAgICAgdGhpcy5hcHBFdmVudHMuYnJvYWRjYXN0RXZlbnQoZXZlbnRzLkV2ZW50cy5TVE9SRVNDRU5FKTtcbiAgICAgIHRoaXMudHJhbnNmb3JtTW9kZSA9IEVUcmFuc2Zvcm1Nb2RlLk5vbmU7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc2V0TW91c2VDdXJzb3IoYXBwQ2FudmFzOiBJQXBwQ2FudmFzKTogdm9pZCB7XG4gICAgTW91c2VDdXJzb3IuUmVzZXRNb3VzZUN1cnNvcihhcHBDYW52YXMpO1xuICB9XG5cbiAgLy8gQWNjZXNzb3JzXG5cbiAgcHVibGljIGdldCBzZWxlY3RlZFNoYXBlKCk6IFNoYXBlIHtcbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIC8vIFByaXZhdGVzXG5cbiAgLy8gVXBkYXRlcyB0cmFuc2Zvcm0gYW5kIHJvdGF0b3IgYm91bmRpbmcgYm94ZXNcbiAgcHJpdmF0ZSB1cGRhdGVBQUJCcyhzaGFwZTogU2hhcGUpOiB2b2lkIHtcbiAgICB0aGlzLmFhYmIgPSB0aGlzLnNoYXBlLmJvdW5kaW5nQm94O1xuICAgIC8vIENhbGN1bGF0ZSByb3RhdG9yIEFBQkIgYmFzZWQgb24gdHJhbnNmb3JtIEFBQkJcbiAgICBjb25zdCBsZWZ0OiBudW1iZXIgPSB0aGlzLmFhYmIuY2VudGVyWzBdIC0gUk9UQVRPUl9SQURJVVM7XG4gICAgY29uc3QgdG9wOiBudW1iZXIgPSB0aGlzLmFhYmIubWluWSAtIFJPVEFUT1JfRElTVEFOQ0UgLSBST1RBVE9SX1JBRElVUztcbiAgICB0aGlzLmFhYmJSb3RhdG9yID0gQUFCQi5Gcm9tUmVjdChsZWZ0LCB0b3AsIFJPVEFUT1JfUkFESVVTICogMiwgUk9UQVRPUl9SQURJVVMgKiAyKTtcbiAgfVxuXG4gIC8vIDA6IG5vIHRyYW5zZm9ybVxuICAvLyAxLCAyLCAzLCA0LCA2LCA3LCA4LCA5OiBzY2FsZXJzIDE9TiAyPU5FIDM9RSA0PVNFIDY9UyA3PVNXIDg9VyA5PU5XXG4gIC8vIDU6IG1vdmVyXG4gIC8vIDEwOiByb3RhdGlvblxuICBwcml2YXRlIGRldGVybWluZVRyYW5zZm9ybU1vZGUobW91c2VYOiBudW1iZXIsIG1vdXNlWTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5hYWJiLmlzUG9pbnRJbnNpZGUobW91c2VYLCBtb3VzZVkpKSB7XG4gICAgICBsZXQgbXg6IG51bWJlciA9IDI7XG4gICAgICBsZXQgbXk6IG51bWJlciA9IDI7XG4gICAgICAvLyBIb3Jpem9udGFsXG4gICAgICBpZiAobW91c2VYIDw9IHRoaXMuYWFiYi5taW5YICsgU0NBTEVSX1RISUNLTkVTUykge1xuICAgICAgICAvLyAtLSBMZWZ0IHNpZGUgc2NhbGVyXG4gICAgICAgIG14ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAobW91c2VYIDw9IHRoaXMuYWFiYi5tYXhYIC0gU0NBTEVSX1RISUNLTkVTUykge1xuICAgICAgICAvLyAtLSBDZW50ZXIgYXJlYVxuICAgICAgICBteCA9IDE7XG4gICAgICB9IC8vIEVsc2U6IFJpZ2h0IHNpZGUgc2NhbGVyXG4gICAgICAvLyBWZXJ0aWNhbFxuICAgICAgaWYgKG1vdXNlWSA8PSB0aGlzLmFhYmIubWluWSArIFNDQUxFUl9USElDS05FU1MpIHtcbiAgICAgICAgLy8gLS0gVG9wIHNpZGUgc2NhbGVyXG4gICAgICAgIG15ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAobW91c2VZIDw9IHRoaXMuYWFiYi5tYXhZIC0gU0NBTEVSX1RISUNLTkVTUykge1xuICAgICAgICAvLyAtLSBDZW50ZXIgYXJlYVxuICAgICAgICBteSA9IDE7XG4gICAgICB9IC8vIEVsc2U6IEJvdHRvbSBzaWRlIHNjYWxlclxuICAgICAgdGhpcy5zY2FsZXJNdWx0aXBsaWVyID0gbXggIT09IDEgJiYgbXkgIT09IDEgPyBNYXRoLlNRUlQyIDogMS4wO1xuICAgICAgcmV0dXJuIG15ICogMyArIG14ICsgMTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWFiYlJvdGF0b3IuaXNQb2ludEluc2lkZShtb3VzZVgsIG1vdXNlWSkpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59XG4iLCIvLyBTaGFwZVRvb2xzXG4vLyBUcmFuc2Zvcm1hdGlvbiBhbmQgY29udmVyc2lvbiBmdW5jdGlvbnMgZm9yIHNoYXBlcy5cblxuaW1wb3J0IHsgVmVjMiB9IGZyb20gXCIuL3ZlYzJcIjtcblxuZXhwb3J0IGNsYXNzIFNoYXBlVG9vbHMge1xuICAvLyBHZW5lcmF0ZXMgcGF0aDJEIGZyb20gbGlzdCBvZiB2ZXJ0aWNlcy5cbiAgcHVibGljIHN0YXRpYyBUb1BhdGgyRCh2ZXJ0czogVmVjMltdKTogUGF0aDJEIHtcbiAgICBpZiAodmVydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaGFwZS5WZXJ0aWNlc1RvUGF0aDJEKCkgZ2l2ZW4gZW1wdHkgdmVydGV4IGxpc3QuXCIpO1xuICAgIH1cbiAgICBjb25zdCBwYXRoOiBQYXRoMkQgPSBuZXcgUGF0aDJEKCk7XG4gICAgcGF0aC5tb3ZlVG8odmVydHNbMF0ueCwgdmVydHNbMF0ueSk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZlcnRzKSB7XG4gICAgICBwYXRoLmxpbmVUbyh2LngsIHYueSk7XG4gICAgfVxuICAgIHBhdGguY2xvc2VQYXRoKCk7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICAvLyBTaGFwZSB0cmFuc2Zvcm1hdGlvblxuICBwdWJsaWMgc3RhdGljIFRyYW5zbGF0ZSh2ZXJ0czogVmVjMltdLCBkZWx0YXh5OiBbbnVtYmVyLCBudW1iZXJdKTogVmVjMltdIHtcbiAgICBjb25zdCB0dmVydHM6IFZlYzJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdiBvZiB2ZXJ0cykge1xuICAgICAgdHZlcnRzLnB1c2godi5hZGQobmV3IFZlYzIoZGVsdGF4eVswXSwgZGVsdGF4eVsxXSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHR2ZXJ0cztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgUm90YXRlKHZlcnRzOiBWZWMyW10sIGNlbnRlcnh5OiBbbnVtYmVyLCBudW1iZXJdLCBhbmdsZVJhZGlhbnM6IG51bWJlcik6IFZlYzJbXSB7XG4gICAgY29uc3QgdHZlcnRzOiBWZWMyW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHYgb2YgdmVydHMpIHtcbiAgICAgIHR2ZXJ0cy5wdXNoKHYucm90YXRlKGFuZ2xlUmFkaWFucywgbmV3IFZlYzIoY2VudGVyeHlbMF0sIGNlbnRlcnh5WzFdKSkpO1xuICAgIH1cbiAgICByZXR1cm4gdHZlcnRzO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTY2FsZShcbiAgICB2ZXJ0czogVmVjMltdLFxuICAgIGNlbnRlcnh5OiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIHNjYWxleHk6IFtudW1iZXIsIG51bWJlcl1cbiAgKTogVmVjMltdIHtcbiAgICBjb25zdCB0dmVydHM6IFZlYzJbXSA9IFtdO1xuICAgIGNvbnN0IGNlbnRlcjogVmVjMiA9IG5ldyBWZWMyKGNlbnRlcnh5WzBdLCBjZW50ZXJ4eVsxXSk7XG4gICAgZm9yIChjb25zdCB2IG9mIHZlcnRzKSB7XG4gICAgICB0dmVydHMucHVzaChcbiAgICAgICAgdlxuICAgICAgICAgIC5zdWIoY2VudGVyKVxuICAgICAgICAgIC5zY2FsZXh5KHNjYWxleHlbMF0sIHNjYWxleHlbMV0pXG4gICAgICAgICAgLmFkZChjZW50ZXIpXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdHZlcnRzO1xuICB9XG5cbiAgLy8gU2hhcGUgY3JlYXRpb25cbiAgcHVibGljIHN0YXRpYyBSZWN0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogVmVjMltdIHtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IFZlYzIoLXdpZHRoIC8gMiwgLWhlaWdodCAvIDIpLFxuICAgICAgbmV3IFZlYzIoK3dpZHRoIC8gMiwgLWhlaWdodCAvIDIpLFxuICAgICAgbmV3IFZlYzIoK3dpZHRoIC8gMiwgK2hlaWdodCAvIDIpLFxuICAgICAgbmV3IFZlYzIoLXdpZHRoIC8gMiwgK2hlaWdodCAvIDIpXG4gICAgXTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgQ2lyY2xlKHJhZGl1czogbnVtYmVyLCBjaXJjbGVTZWdtZW50czogbnVtYmVyID0gMzIpOiBWZWMyW10ge1xuICAgIGNvbnN0IHY6IFZlYzJbXSA9IFtdO1xuICAgIGZvciAobGV0IHIgPSAwLjA7IHIgPCAyICogTWF0aC5QSTsgciArPSAyICogTWF0aC5QSSAvIGNpcmNsZVNlZ21lbnRzKSB7XG4gICAgICB2LnB1c2gobmV3IFZlYzIoTWF0aC5jb3MocikgKiByYWRpdXMsIE1hdGguc2luKHIpICogcmFkaXVzKSk7XG4gICAgfVxuICAgIHJldHVybiB2O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBUcmlhbmdsZShiYXNlV2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBWZWMyW10ge1xuICAgIGNvbnN0IHY6IFZlYzJbXSA9IFtdO1xuICAgIGNvbnN0IHggPSAtYmFzZVdpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gLWhlaWdodCAvIDI7XG4gICAgdi5wdXNoKG5ldyBWZWMyKHggKyBiYXNlV2lkdGggLyAyLCB5KSk7XG4gICAgdi5wdXNoKG5ldyBWZWMyKHggKyBiYXNlV2lkdGgsIHkgKyBoZWlnaHQpKTtcbiAgICB2LnB1c2gobmV3IFZlYzIoeCwgeSArIGhlaWdodCkpO1xuICAgIHJldHVybiB2O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBTdGFyKHJhZGl1czogbnVtYmVyKTogVmVjMltdIHtcbiAgICBjb25zdCB2OiBWZWMyW10gPSBbXTtcbiAgICBjb25zdCBpbm5lclJhZGl1cyA9IDAuNSAqIHJhZGl1cztcbiAgICBjb25zdCBwb2ludHMgPSA1LjA7XG4gICAgY29uc3QgYW5nbGUgPSBNYXRoLlBJICogMiAvIChwb2ludHMgKiAyKTtcbiAgICBmb3IgKGxldCBpID0gcG9pbnRzICogMiArIDE7IGkgPiAwOyAtLWkpIHtcbiAgICAgIGNvbnN0IHIgPSBpICUgMiA9PT0gMSA/IHJhZGl1cyA6IGlubmVyUmFkaXVzO1xuICAgICAgY29uc3Qgb21lZ2EgPSBhbmdsZSAqIGk7XG4gICAgICBjb25zdCB0eCA9IHIgKiBNYXRoLnNpbihvbWVnYSk7XG4gICAgICBjb25zdCB0eSA9IHIgKiBNYXRoLmNvcyhvbWVnYSk7XG4gICAgICB2LnB1c2gobmV3IFZlYzIodHgsIHR5ICsgNykpOyAvLyBzdGFyIHNsaWdodGx5IG9mZnNldCB1cHdhcmRzXG4gICAgfVxuICAgIHJldHVybiB2O1xuICB9XG59XG4iLCIvLyBTaGFwZVxuLy8gRWFjaCBpbnN0YW5jZSByZXByZXNlbnRzIGEgc2hhcGUgaW4tZ2FtZS5cblxuaW1wb3J0IHsgQUFCQiB9IGZyb20gXCIuL2FhYmJcIjtcbmltcG9ydCB7IElBcHBDYW52YXMgfSBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCB7IENvbGxpc2lvbiB9IGZyb20gXCIuL2NvbGxpc2lvblwiO1xuaW1wb3J0IHsgU2hhcGVUb29scyB9IGZyb20gXCIuL3NoYXBlLXRvb2xzXCI7XG5pbXBvcnQgeyBWZWMyIH0gZnJvbSBcIi4vdmVjMlwiO1xuXG5jb25zdCBDSVJDTEVfU0VHTUVOVFM6IG51bWJlciA9IDQwO1xuXG5leHBvcnQgZW51bSBFU2hhcGUge1xuICByZWN0LFxuICBjaXJjbGUsXG4gIHRyaWFuZ2xlLFxuICBzdGFyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNoYXBlIHtcbiAgaWQ6IG51bWJlcjtcbiAgdmVydHM6IFZlYzJbXTtcbiAgY29sb3I6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFNoYXBlIHtcbiAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudElkOiBudW1iZXIgPSAwO1xuXG4gIHB1YmxpYyBtb3VzZU92ZXI6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBzaGFwZTogSVNoYXBlO1xuICBwcml2YXRlIGFhYmI6IEFBQkI7XG5cbiAgY29uc3RydWN0b3IodmVydGljZXM6IFZlYzJbXSwgY29sb3I6IHN0cmluZykge1xuICAgIHRoaXMuc2hhcGUgPSB7fSBhcyBJU2hhcGU7XG4gICAgdGhpcy5zaGFwZS5pZCA9ICsrU2hhcGUuY3VycmVudElkO1xuICAgIHRoaXMuc2hhcGUudmVydHMgPSB2ZXJ0aWNlcztcbiAgICB0aGlzLnNoYXBlLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy5hYWJiID0gdGhpcy5jYWxjdWxhdGVCb3VuZGluZ0JveCgpO1xuICB9XG5cbiAgLy8gU2hhcGUgZHJhd2luZ1xuICBwdWJsaWMgZHJhdyhhcHBDYW52YXM6IElBcHBDYW52YXMsIGRlZmF1bHRMaW5lV2lkdGg6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnNoYXBlLnZlcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaGFwZSAke3RoaXMuc2hhcGUuaWR9OiBoYXMgYW4gZW1wdHkgdmVydGV4IGxpc3QuYCk7XG4gICAgfVxuICAgIGFwcENhbnZhcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGFwcENhbnZhcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuc2hhcGUuY29sb3I7XG4gICAgYXBwQ2FudmFzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLm1vdXNlT3ZlciA/IFwiI2ZmZlwiIDogXCIjMDAwXCI7XG4gICAgY29uc3QgcGF0aDogUGF0aDJEID0gbmV3IFBhdGgyRCgpO1xuICAgIHBhdGgubW92ZVRvKFxuICAgICAgdGhpcy5zaGFwZS52ZXJ0c1t0aGlzLnNoYXBlLnZlcnRzLmxlbmd0aCAtIDFdLngsXG4gICAgICB0aGlzLnNoYXBlLnZlcnRzW3RoaXMuc2hhcGUudmVydHMubGVuZ3RoIC0gMV0ueVxuICAgICk7XG4gICAgZm9yIChjb25zdCB2IG9mIHRoaXMuc2hhcGUudmVydHMpIHtcbiAgICAgIHBhdGgubGluZVRvKHYueCwgdi55KTtcbiAgICB9XG4gICAgYXBwQ2FudmFzLmNvbnRleHQuZmlsbChwYXRoKTtcbiAgICBhcHBDYW52YXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLm1vdXNlT3ZlciA/IDMgOiBkZWZhdWx0TGluZVdpZHRoO1xuICAgIGFwcENhbnZhcy5jb250ZXh0LnN0cm9rZShwYXRoKTtcblxuICAgIC8vIFNoYXBlIGNvbGxpc2lvblxuICAgIGFwcENhbnZhcy5jb2xsQ29udGV4dC5maWxsU3R5bGUgPSBDb2xsaXNpb24uSWRUb0NvbG9yKHRoaXMuc2hhcGUuaWQpO1xuICAgIGFwcENhbnZhcy5jb2xsQ29udGV4dC5maWxsKHBhdGgpO1xuXG4gICAgYXBwQ2FudmFzLmNvbnRleHQubGluZVdpZHRoID0gZGVmYXVsdExpbmVXaWR0aDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc2xhdGUoZHg6IG51bWJlciwgZHk6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2hhcGUudmVydHMgPSBTaGFwZVRvb2xzLlRyYW5zbGF0ZSh0aGlzLnNoYXBlLnZlcnRzLCBbZHgsIGR5XSk7XG4gICAgdGhpcy5hYWJiID0gdGhpcy5jYWxjdWxhdGVCb3VuZGluZ0JveCgpO1xuICB9XG5cbiAgcHVibGljIHJvdGF0ZShhbmdsZVJhZGlhbnM6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2hhcGUudmVydHMgPSBTaGFwZVRvb2xzLlJvdGF0ZSh0aGlzLnNoYXBlLnZlcnRzLCB0aGlzLmFhYmIuY2VudGVyLCBhbmdsZVJhZGlhbnMpO1xuICAgIHRoaXMuYWFiYiA9IHRoaXMuY2FsY3VsYXRlQm91bmRpbmdCb3goKTtcbiAgfVxuXG4gIHB1YmxpYyBzY2FsZShzeDogbnVtYmVyLCBzeTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zaGFwZS52ZXJ0cyA9IFNoYXBlVG9vbHMuU2NhbGUodGhpcy5zaGFwZS52ZXJ0cywgdGhpcy5hYWJiLmNlbnRlciwgW3N4LCBzeV0pO1xuICAgIHRoaXMuYWFiYiA9IHRoaXMuY2FsY3VsYXRlQm91bmRpbmdCb3goKTtcbiAgfVxuXG4gIC8vIEFjY2Vzc29yc1xuICBwdWJsaWMgZ2V0IGRhdGEoKTogSVNoYXBlIHtcbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaWQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zaGFwZS5pZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYm91bmRpbmdCb3goKTogQUFCQiB7XG4gICAgcmV0dXJuIHRoaXMuYWFiYjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgY2VudGVyKCk6IFZlYzIge1xuICAgIHJldHVybiBuZXcgVmVjMih0aGlzLmFhYmIuY2VudGVyWzBdLCB0aGlzLmFhYmIuY2VudGVyWzFdKTtcbiAgfVxuXG4gIC8vIFNoYXBlIHRyYW5zZm9ybWF0aW9uXG4gIHByaXZhdGUgY2FsY3VsYXRlQm91bmRpbmdCb3goKTogQUFCQiB7XG4gICAgY29uc3QgYWFiYjogQUFCQiA9IG5ldyBBQUJCKCk7XG4gICAgZm9yIChjb25zdCB2IG9mIHRoaXMuc2hhcGUudmVydHMpIHtcbiAgICAgIGFhYmIubWluWCA9IHYueCA8IGFhYmIubWluWCA/IHYueCA6IGFhYmIubWluWDtcbiAgICAgIGFhYmIubWF4WCA9IHYueCA+IGFhYmIubWF4WCA/IHYueCA6IGFhYmIubWF4WDtcbiAgICAgIGFhYmIubWluWSA9IHYueSA8IGFhYmIubWluWSA/IHYueSA6IGFhYmIubWluWTtcbiAgICAgIGFhYmIubWF4WSA9IHYueSA+IGFhYmIubWF4WSA/IHYueSA6IGFhYmIubWF4WTtcbiAgICB9XG4gICAgcmV0dXJuIGFhYmI7XG4gIH1cbn1cbiIsIi8vIFZlYzJcbi8vIFZlY3RvciAyIGNvbnRhaW5lciBhbmQgbWF0aC4gTWF0aCBtZXRob2RzIGFyZSBub24tbXV0YXRpbmcuXG5cbmV4cG9ydCBjbGFzcyBWZWMyIHtcbiAgcHVibGljIHg6IG51bWJlcjtcbiAgcHVibGljIHk6IG51bWJlcjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyID0gMC4wLCB5OiBudW1iZXIgPSAwLjApIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICAvLyBSZXR1cm5zOiAgdmVjdG9yICsgYiB2ZWN0b3JcbiAgcHVibGljIGFkZChiOiBWZWMyKTogVmVjMiB7XG4gICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIGIueCwgdGhpcy55ICsgYi55KTtcbiAgfVxuXG4gIC8vIFJldHVybnM6IHZlY3RvciAtIGIgdmVjdG9yXG4gIHB1YmxpYyBzdWIoYjogVmVjMik6IFZlYzIge1xuICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLSBiLngsIHRoaXMueSAtIGIueSk7XG4gIH1cblxuICAvLyBSZXR1cm5zOiBkaXJlY3Rpb24gb2YgdGhpcyB2ZWN0b3IgaW4gcmFkaWFuc1xuICBwdWJsaWMgZGlyZWN0aW9uKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMueCAhPT0gMC4wKSB7XG4gICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnkgIT09IDAuMCkge1xuICAgICAgcmV0dXJuIHRoaXMueSA+IDAuMCA/IDkwLjAgKiBNYXRoLlBJIC8gMTgwLjAgOiAtOTAuMCAqIE1hdGguUEkgLyAxODAuMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc2lkZXJlZCBkb21haW4gZXJyb3JcbiAgICAgIC8vIHJldHVybmluZyB6ZXJvIGZvbGxvd2luZyBzdGFuZGFyZCBJRUMtNjA1NTkvSUVFRSA3NTRcbiAgICAgIHJldHVybiAwLjA7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuczogbWFnbml0dWRlIG9mIHZlYzJcbiAgcHVibGljIGRpc3RhbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xuICB9XG5cbiAgLy8gUmV0dXJuczogY2FsY3VsYXRlZCBub3JtYWwgZm9yIHZlY3RvclxuICBwdWJsaWMgbm9ybWFsKCk6IFZlYzIge1xuICAgIGNvbnN0IG06IG51bWJlciA9IHRoaXMuZGlzdGFuY2UoKTtcbiAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC8gbSwgdGhpcy55IC8gbSk7XG4gIH1cblxuICAvLyBSZXR1cm5zOiByb3RhdGVkIHZlY3RvciBhcm91bmQgYSBnaXZlbiBwb2ludCAob3Igb3JpZ2luIGlmIG51bGwpLlxuICBwdWJsaWMgcm90YXRlKHJhZGlhbnM6IG51bWJlciwgYXJvdW5kUG9pbnQ6IFZlYzIgPSBudWxsKTogVmVjMiB7XG4gICAgY29uc3QgcDogVmVjMiA9IGFyb3VuZFBvaW50ICE9IG51bGwgPyBhcm91bmRQb2ludCA6IG5ldyBWZWMyKDAsIDApO1xuICAgIGNvbnN0IHJ2OiBWZWMyID0gbmV3IFZlYzIodGhpcy54LCB0aGlzLnkpO1xuICAgIGNvbnN0IHgyID0gcC54ICsgKHJ2LnggLSBwLngpICogTWF0aC5jb3MocmFkaWFucykgLSAocnYueSAtIHAueSkgKiBNYXRoLnNpbihyYWRpYW5zKTtcbiAgICBjb25zdCB5MiA9IHAueSArIChydi54IC0gcC54KSAqIE1hdGguc2luKHJhZGlhbnMpICsgKHJ2LnkgLSBwLnkpICogTWF0aC5jb3MocmFkaWFucyk7XG4gICAgcnYueCA9IHgyO1xuICAgIHJ2LnkgPSB5MjtcbiAgICByZXR1cm4gcnY7XG4gIH1cblxuICBwdWJsaWMgc2NhbGV4eShzeDogbnVtYmVyLCBzeTogbnVtYmVyKTogVmVjMiB7XG4gICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIHN4LCB0aGlzLnkgKiBzeSk7XG4gIH1cbn1cbiJdfQ==
