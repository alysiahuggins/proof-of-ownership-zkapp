/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3158:
/***/ (function(module) {

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


/***/ }),

/***/ 4604:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// UNUSED EXPORTS: Answer, NFTHolder, NFTHolderWitness, createNFTHoldersMerkleTree

;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

// EXTERNAL MODULE: ./node_modules/snarkyjs/dist/web/index.js
var web = __webpack_require__(6400);
;// CONCATENATED MODULE: ../nft_holders/nft_holders.js


let nft_holders = [
      "0x00bd58530a64b04f552f2f6a8319e91d70f6b12b",
      "0x01b4fae0b350af95d1bd8fb1341d9dce1a87a453",
      "0x01cd1418b4ccad800239cdd0e6fe1b9dc93be09d",
      "0x0241dfb8165dac08d3f78cb931cf46d110f16733",
      "0x028758d7af0826fdf0396c16f00fbddf6b22618d",
      "0x041526c8dce0d36e04d4668c1f3d425cb9548729",
      "0x052a42fcfd87f2790796ccf948dc2721d4694439",
      "0x06246c2444aa68187f198ad4c640e367f6b4a779",
      "0x06f48f7346d54ebc66f3d03b7cb9aefc94f1b859",
      "0x070e21db655405a681088bfcfce96fcca76965e6",
      "0x07cff6218249a2351a174bdc1e5b1632e8e4e673",
      "0x089036a0835c6cf82e7fc42e9e95dfe05e110c81",
      "0x0b53cbbcdb8e714a494422a70d74551bfb603b00",
      "0x0bb602f88bf886282ff69d4cec937cc2a7d9e19a",
      "0x0da9fd084dcabb4a7a2762ccfa2ecef747c5c36a",
      "0x0f1af0576ea168db8b1d4775589b762124ec3c4a",
      "0x0f3aa33ffc74e032c67e39276f546caaffc4f489",
      "0x0f8a536e4ccc16864d1da5d64390ffa88873e146",
      "0x0fef92a34ecf1f742b01c9e3cb2732a83c6067b6",
      "0x10ea167893cb51500ec829222e3d17a968feb650",
      "0x111f530216fbb0377b4bdd4d303a465a1090d09d",
      "0x11b4e83bc3e9605f03e2a4c34bd09567be5aebbe",
      "0x12579783fbe8c2645d7a634b238da748405975a2",
      "0x1318d3420b0169522eb8f3ef0830acee700a2eda",
      "0x14e5d778c77574106f8241303c9ec5f418a82085",
      "0x1542cf9427876a8fffefc22646cbf33a82047ae2",
      "0x16bbaa4a5412e851862a9db54de9482aaebf0e2a",
      "0x17bf808a5edce4f27bb7579e3a4335ee57dba88b",
      "0x17cd072cbd45031efc21da538c783e0ed3b25dcc",
      "0x18ec5566ad26e2ac609822395d6d9e98a39c90ef",
      "0x198f7e5f79b6efe3d67591ee62b527e99a6f2f38",
      "0x1a1c37c145a1eab58c43f003ebb55c18083b5987",
      "0x1b1597b7fea77ecf92080c8600baccd1976a9176",
      "0x1b9706227704f49e412abc9da7dd7d35afa60c22",
      "0x1f913d26cfa05285926a9fc75741c1ff9a295938",
      "0x215a0a9948af67b867dcaef173dc1dfee64d18ea",
      "0x21b1dd5eebfe87a74a3525507022663eb28c179a",
      "0x231724a7bb0dbeab1996bf787c82472b4e6008e7",
      "0x236f71c33926ca6fafd5dab6df279a4cd8585cd8",
      "0x2450bbd3577f17c0e2f7359e5369260bf32c4a46",
      "0x249ef6143458126e0e3dfb1d95f7e60f4b0c76f6",
      "0x2630a8f80fbfe517b2534ddbe4fd8cd2a96260d1",
      "0x27b431b0ebd7df82182bb4413f8dbc8dfad17c17",
      "0x28efaf6cab2b5b848778647c95bf256ce3ba3b8d",
      "0x2a9ebd1f365cbc0f00ae13d94ad7c37fb30c549e",
      "0x2aab747822b72b9e749252899f19f92e107454dc",
      "0x2b1d2d290268cb4c4862d4a658f1c2a663c0f79a",
      "0x2b705dfe2d95d0c57aa69f607c87366d436c21e3",
      "0x2c87f119163951f0d3346a05f7820fcbda2884d4",
      "0x2d49aa8442172996633c1b6119b1ec421ed026cf",
      "0x2d5d08d4359c4005aa3326b49c96fba32dbbbc4e",
      "0x2f2581c49a79880561032094887f59bd6d777f75",
      "0x2f2967f82c24da4490a3c9b7ceb9b7c4d20f9786",
      "0x2fe9ec0c2ada80b61fd07fc5c35004b9e5c83a3b",
      "0x324a77ffee86a7ec082f8395f060bc4e94e60198",
      "0x32ec773ed7b5a54d1f0ac77944caf76ed30e6b86",
      "0x33fc2be5563e3c02a3e127f01bbd71db472aa613",
      "0x3508a15bb5ec98e654448a74d36c40b5071b54c7",
      "0x35224c95aa3e53a30cc3f6f64540618892a568d7",
      "0x3839acf1ee7699d1f46b1be840d8ad8317fdf757",
      "0x384a0c62af2c59f7ca6e554c11071cc02afb1d7f",
      "0x38e1cc4b084a8668ecb2c3c0e2e7d706c8659790",
      "0x40630b4fd61523450b3dbc4d9fd672aae0a9c31c",
      "0x4149f044998bac5407ff1a194dc568af905bc480",
      "0x433485b5951f250cefdcbf197cb0f60fdbe55513",
      "0x46dac7412752e7567c941e8233f9bd647a0e46be",
      "0x471817544c1aa78a99bb3ed17123818352946868",
      "0x4718ce007293bce1e514887e6f55ea71d9a992d6",
      "0x471ebc0196dbf515a568fbb9a3b0f177d7142c68",
      "0x474d96355cee5d56759fb3ca01ed0abf4660748d",
      "0x486843ad8adb101584fcce56e88a09e6f25d16d1",
      "0x4964884f6d2ff9169fb166c0ef6e344451a2fec4",
      "0x4985d5b558fab2604d026b4c09a4752ebd1bd17e",
      "0x4a5c27fc6d10e8a0fec4f2d504ed5bd05b4a4c4f",
      "0x4a67c63109c81effe117d3e0f62894b696419be2",
      "0x4a78aa295bd5ae1f1216fc2afbc9c5d7eb4b3e04",
      "0x4bba44f8a68e1667a46de229667c20e2c6028497",
      "0x4bf99cd1ad81b11abea6c660194d71e1cabd5993",
      "0x4c55c41bd839b3552fb2abecacfdf4a5d2879cb9",
      "0x4d09c128a448cafa28996c504e09d57aed661f2e",
      "0x4ef2f12110e49f8bc8d998aa1da6156af3cc74eb",
      "0x4fb47f0b9c37bf9293c384e6727e1feed8f3fce5",
      "0x505e20c0fb8252ca7ac21d54d5432eccd4f2d076",
      "0x5097f85f9312d5e2ffd16c3668a63a623221f16e",
      "0x51019957e06c9e8737c935058d3a2c69f40479df",
      "0x51869683791f9950b19145fdc0be0fedf743dd78",
      "0x54307a0744c24bfd5899d4c6b19934736b39349c",
      "0x54b356f6eb2bc6cec1defcad29fc582419b1cb14",
      "0x54c3283577c40eaa637d35106b7c5c6b387c5ab0",
      "0x5561974f0d35d8c355241a5568894df7b691bb28",
      "0x55ba34d4f0283d1ad0d09502a5b8c1b8886ee724",
      "0x56061b43123bca1fd940b87e56be7e159f2484bd",
      "0x564cf743b5b41b64b125fe8b5f2851c46082a0ba",
      "0x59c3a7788f830638ea5f12333e9c4f7c280bc21f",
      "0x5aeb11d65bc5c7fe6ad821623f1cc1fd632c30aa",
      "0x5af01636ccb06f4c91fce3de0530fe26bf320c20",
      "0x5b13ee6244961f354fef83698d76d2cd2bfd4860",
      "0x5b93ff82faaf241c15997ea3975419dddd8362c5",
      "0x5e05040f52861f1c0f2d5ae3629ce334725bb13f",
      "0x5eef752bef07705474c7a600e190956af05a187b",
      "0x5f5c6f24239b2631e4cc5798c7ab42072f9908be",
      "0x60ceb822f5fb39d837886ed17039811254337540",
      "0x61340dbd0c0fde478f1152b1f991f630596caea1",
      "0x625307de45bd25ad6bf6cc7391a308fc84067cf7",
      "0x62df9ebbd7cb14e3061524656df8e075bf82cd66",
      "0x64e3ddf498fc1f5c661ecd64984c03fcedbdd7e1",
      "0x66da63b03feca7dd44a5bb023bb3645d3252fa32",
      "0x6749b7a786c6a975fca2b6405fac2b50548bca07",
      "0x674efaf9eaf016a7033e699a79fbdaf5b3f0c0d9",
      "0x68bc8d5a1222f8eb75b9dd8f4340bd05c47cf352",
      "0x68d36dcbdd7bbf206e27134f28103abe7cf972df",
      "0x69be38384e08ea8f69cf581a9de4cd697ee68422",
      "0x6b5918d8ef9094679f4b4e1bf397a66ea411b118",
      "0x6cd68e8f04490cd1a5a21cc97cc8bc15b47dc9eb",
      "0x6cefd36b34332b9e9c193825b4c6f1d788e54eb0",
      "0x6d3f06ba08676561b550dcff49540b0652a55348",
      "0x6d5969f4472e2a1ef14fe5326933f1cf88c015e6",
      "0x6dc43be93a8b5fd37dc16f24872babc6da5e5e3e",
      "0x6e59c993b3127ed983fc6a2a7a39ee9db9799641",
      "0x6fd1a75d7362552ac96024c053e5f872b4d626d9",
      "0x703f87c50d915775228e40a0f562552e291e5540",
      "0x70d375d9a05918fe4ecb1d65ea9fdc1c3f5db0dd",
      "0x72e8088772be332a95a289f3ac47f83a39675ddd",
      "0x742f7634f5f7befcb60a9c6290d5af5e27d55a2e",
      "0x74667801993b457b8ccf19d03bbbaa52b7fff43b",
      "0x74f306bf8b559c1fbb25151b7a4642a70a4e86e2",
      "0x756fed0c19d0c1179e54e4931f2d0f05f4dc0172",
      "0x772f840d9011b7a4f6e8e684d4bd4ee0ddeb2a50",
      "0x786f0558ba618f56478b01d163248246ca94b29c",
      "0x7930f27518fd37c36dc77ce08b5eb38c3e4c9c4b",
      "0x7933231775dec3f3c80039debd7e3afd8a81f674",
      "0x7a6d7c67b3e11ca468d2b0e89eb5bb51baea4d8e",
      "0x7bd1aa28873adfa9548a861fe067886fdd2f0e4c",
      "0x7bda037dfdf9cd9ad261d27f489924aebbce71ac",
      "0x7c1555a3cae07da85488e941949dfea2122c727f",
      "0x7e28bbdcc4d3c3c8df646c37ac0ee66ad1c9c04d",
      "0x7e5ce10826ee167de897d262fcc9976f609ecd2b",
      "0x7e8608f5893a6a57602a014ab190f7af8069d1e1",
      "0x8023dccc72d5ffd7dc224518ddca72b7be1cb8df",
      "0x80e60f52e999f97f0975ffb1549cffe53970e22b",
      "0x80efd0863c9e55ad41e397aa7a420bb0df338aa5",
      "0x82ce5258aa5925bb5c9da07fa7996e73687a440e",
      "0x82fe8c393d063cb23631dbc8216d4adf941adc9e",
      "0x83917409a8501cbf62cb8c8614b2737d10fa76ac",
      "0x83cb6fdc4a241cbd03c814372358bca31e25e121",
      "0x83e4142225ecc3ce1a8061465d219c01b250e33a",
      "0x854eb8f450edecfda345c40d0baf93073db7a6ee",
      "0x859a8e0ae06b4912da619938c5469c01d2a2b7da",
      "0x864b262035f940f8f54712cbda2efab606037d20",
      "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88",
      "0x87ba155a86cf63be05445babb184e327551810f8",
      "0x87c53ff5fbf2d9c942aaf8f085cf415e5d4fa64b",
      "0x89d1a663b53d5d7831f67719f2fe4932f8251f9c",
      "0x89e5778d56c4bd65bc88d6dd06afd36829ca29c3",
      "0x8a1de594607937b430808b64a3ca683cd3835248",
      "0x8ecd3fce6a1bd1372a0e731d15ecea500d35cb3a",
      "0x9143aa81feddda4e7528863ae062908c3add016b",
      "0x91fa8e84392c455633ac566e54ee4bd78b0979ab",
      "0x921fc6cf9334a6248d6b9f460aa32c5914778f82",
      "0x9266f125fb2ecb730d9953b46de9c32e2fa83e4a",
      "0x935436897b50bee53f84f11bcccc8da91ae22f74",
      "0x9437fe6385f3551850fd892d471ffbc818cf3116",
      "0x96acf191c0112806f9709366bad77642b99b21a9",
      "0x9798a181e731ee9d3abffc5ae15c93ca3d95a8e3",
      "0x98397a068d413d3c92a506f98c5f25d33a9dac14",
      "0x98c48fcfcc3c4d2a0c8c74d9e604941d629a1ddb",
      "0x9c6f3006085575d711a2b37f639047e9232c1759",
      "0x9c9867afd24e3bcfe9195c3ebf649683f3e64b81",
      "0x9cfad4326eb84396b7610987eee45fd8236ddb30",
      "0x9f06d091df460183414dc64a32c7b4a4b07d8044",
      "0x9fc3b33884e1d056a8ca979833d686abd267f9f8",
      "0xa19ebb6a024a7d86a3a595cc7d2c7934dc2837d1",
      "0xa2214a395dcdbfca36cfa720565f48940090ef13",
      "0xa3288b2bbf311a7fb68c7f07c326217b0b0dbcb9",
      "0xa3b6e1577b003c8b176ba321432920e6072abd5e",
      "0xa3e591c0f75799a103c4bbee0803ec1e57e8149d",
      "0xa45f48727a8bfdf1adb63ff69fe69ec07426a8b8",
      "0xa49958fa14309f3720159c83cd92c5f38b1e3306",
      "0xa4bc8e08f7ba01043b2088040255036b57edaf91",
      "0xa6d675ea14628e4021916dca7dbb4b3134c336cc",
      "0xa7d53695af1fd11e0b75d37695290c102d59d743",
      "0xa81c5303fdc675aaf79674bee58c56cd2428a85c",
      "0xa8c37c36eebae030a0c4122ae8a2eb926b55ad0c",
      "0xa98f3dc7d87a2163d8945714af61d37100eb7065",
      "0xabf0db54c8bbcc074025c3dfb1f4c9d391ff5acf",
      "0xac771f4902a584e01e0f0b0dc3685389a803e9b1",
      "0xac97325d525e83f4e12735211223290555ad7834",
      "0xade9129fbc578c8f09a7205ffa061c7f6b70216c",
      "0xb00a93ff31217e49c3674e05b525f239a85bb78f",
      "0xb13869305bb56f79db4d1d1e2463f89dedf9cca1",
      "0xb25e1b7d4a5b0486285a60501b05a45a6a6cb6ba",
      "0xb2ea3889506327db2defb9554752d211f8e2a366",
      "0xb3913390d4f2f7b8b891fd424afbcc559307232a",
      "0xb4cb0bc7344b2346cd6bb14b404ffae81a675eb2",
      "0xb6c7e03ede87692deb1de7e40723b952e0fd3773",
      "0xb81541fea9417facf0e86f521393301c871bbe49",
      "0xb8898a05ebeb20e8654a3c4659de620211be25a3",
      "0xb9e4d4771a55f3ce08b67de37fffdcb9dc4a4958",
      "0xba4586c75fb3e4e9a4e77c5b721280b203f5ef93",
      "0xbb1ba98306cbf13e6dff6e0435c07218130760aa",
      "0xbcefc4906b443e4db64e2b00b9af2c39e76c785c",
      "0xbd43988d8d4ee1a48b8c2e5f8780a38150981226",
      "0xbd5de08152cd8f8f91d3b3570a231c66f299475e",
      "0xbe8cb7a21556b94f20ae0f4583f8b427b7b3f37d",
      "0xbec2635b44d26acf54dda59644ddb71fb0e0268d",
      "0xbed374a89820386b5a38da49922e5c19e1273024",
      "0xbf07de1c95731066f57511c026dffab7a02871ac",
      "0xbf46d2161045251cb97d0b41929bc1d36044e1a0",
      "0xbfdb50dc66c8df9fd9688d8fe5a0c34126427645",
      "0xc028f0f776e921aa62ebf83c1baeb3bc006abb29",
      "0xc37e67148ed61006074554ed00691f5183206020",
      "0xc9e094deb826b00d10af0ab3d2a62d712e89f67a",
      "0xca885aae29124b05c8736587248a4cffcda8e446",
      "0xce68b1394ed29ecaa6974536244d1d2aad4a2745",
      "0xcf8e7573894cb97d2589efdaf04cf65b8ad94cd9",
      "0xcfc37f12927291641525847ba152d40df295a7e7",
      "0xcfd0abd0e9ad5c18346568110a05a8bdc5092f6f",
      "0xd0020e7b2b1f451d8cb14feadd4230b24e1dcb51",
      "0xd01f31684999d2d5e3925bfb0fae32f6e359f0fa",
      "0xd04ad853bf6aaa597d0f644152a8112d03cf73b3",
      "0xd08924607d051ab304a319bcfba040c8f3e75b11",
      "0xd0f7fbf89106ab6eda8b3cbca65c085fccb87209",
      "0xd35d60b1746caec2289c892eac7351d66d63455b",
      "0xd3c45a5b9aea1cd78c7a2527012bc4acec9c8050",
      "0xd3d70a4aae822f1fe2f240d15f5bf95cd42df6ec",
      "0xd3f8a83dd0f5c873be0973dbd67bf0d441ae49d0",
      "0xd4b0ce635f39a9087d63cb699a9e3d2288677426",
      "0xd4e52ea3f4ee7ce425980ae02c002e5f74cee2bc",
      "0xd57931dbb5d6b4ec1286cdd899bd3dc977b84fe1",
      "0xd59a5a8fbea37bd268b013b1f72f94f35d8f9288",
      "0xd5b2099684555be3804bfa8a2814169d8d24f777",
      "0xd6f0e68666eda7f8ed06d52311e9398155b61753",
      "0xd72cb55fd6e7d94808b27b15f6132cdfcf5a0461",
      "0xd78d0be77a51d6bcb5d144934b0f33ad68f39952",
      "0xd7ddee93bbd141863d9e2c2746f210e0887c8c9b",
      "0xd9fa5272e6c521cb06e1b9449986625b91ebfe43",
      "0xdbf14da8949d157b57acb79f6eee62412b210900",
      "0xdc7689a5b31583d375350eb7c73bfa536cae9e11",
      "0xde0cbd5df89bb67ab804db21e9b931bad4200392",
      "0xde6ab026bb29136523ec81c0673738c166ecc8f5",
      "0xdf63a38cb40941ff2ec1512884e5cbaf24fd4d81",
      "0xe04885c3f1419c6e8495c33bdcf5f8387cd88846",
      "0xe055721b972d58f0bcf6370c357879fb3a37d2f3",
      "0xe1da9e3ea9efc074ebffd4d2bed209b370705188",
      "0xe24fbe2f6e587b8220e7b91474057df1806fffa5",
      "0xe2a26a4df24f65e790b108e4f62322333000bbef",
      "0xe3752757a22538fbe0c4409655afd0fc0eaaeb3d",
      "0xe3f3bc22382e0edfdedacb5e4a89a5418432fd07",
      "0xe3f952fc4e698c1d0c89ac754b903f101a9b0a14",
      "0xe43c5133f66f58fe5ac8f9000aae020fbb9b0f85",
      "0xe43e7ac0a3593cab2859c56670463c8d6979f21d",
      "0xe4bd0c9af13f4426fb487b19977b2690130a969a",
      "0xe4c80780cc7fc7047bccb30e2cbcb67400752a88",
      "0xe4e8d6650a8dc5ebf91f9ee563d71378483d90c3",
      "0xe5f467f84bf554e5a8770ec1ef9d0f5fefc36e0c",
      "0xe67f1db2d703b40bccc5f422e375be648673f37a",
      "0xe75906b48ed2c33e06bf6673340e0fdf20aabb82",
      "0xe8743b76d1aaa0c259b5b91f10dc594770b6a08c",
      "0xeb489011b8890005cc8c3424cf2a93ab06322fa9",
      "0xec6d36a487d85cf562b7b8464ce8dc60637362ac",
      "0xed22bb0106c24c7f6b4d8aae33639e1467061f64",
      "0xeec76b015dad397ff8455d4533a26bea6866d188",
      "0xef42cf85be6adf3081ada73af87e27996046fe63",
      "0xf0af5cda1f6d7555d31699c6064b164808ad0237",
      "0xf110c5826e7f8c48dac16fcadf87bcb47151d8cc",
      "0xf180f7c066c9af638b73ceef139d5adde0d4265f",
      "0xf1897835a24ed166bdfb8db16b56e72e21a413be",
      "0xf421ebf5efafb495ca4bae9ec600b18e805c3f72",
      "0xf49882c2e8860bb86355cb62cf3eb203ab779bb3",
      "0xf5a60683da6877359381b88aaa7be345c3ba7d8a",
      "0xf6e3e84aa3227e97d5c3e93a94bcc7ffc4156d78",
      "0xf7ab8434c06fce3029278d629c2c990c633b1d99",
      "0xf7b18e107eb36797f4ce36de756630b9c30969ad",
      "0xf949513f889c04b00fd1d48abf3dc71ae02ce89a",
      "0xf9bcc24f2d79aa6fffdbd024192c1e19cfdeca2c",
      "0xf9ed62486776df9c6f0f9bf3fcad2aaa5716c888",
      "0xfcbbe3f69f26a482b19e533439779046994df355",
      "0xfd46c092ed3adf846631ee169fcf8c977cbbce3a"
    ];
;// CONCATENATED MODULE: ./pages/zkappWorker.ts



// import  { createNFTHoldersMerkleTree, NFTHolderWitness, NFTHolder } from '../../../build/src/Own.js';

// import { MyMerkleWitness } from '../../contracts/src/Classes';
let proofsEnabled = false;
let initialBalance = 100000000000;
class NFTHolderWitness extends (0,web/* MerkleWitness */.Pj)(10) {
}
function createNFTHoldersMerkleTree() {
    //generates the merkle tree from the list of nft holders
    let nftHoldersTree = new web/* MerkleTree */.MV(10);
    for(let i in nft_holders){
        let thisHolder = new NFTHolder(web/* CircuitString.fromString */._G.fromString(nft_holders[i]));
        nftHoldersTree.setLeaf(BigInt(i), thisHolder.hash());
    }
    // now that we got our accounts set up, we need the commitment to deploy our contract!
    return nftHoldersTree;
}
class NFTHolder extends web/* CircuitValue */.wA {
    hash() {
        return web/* Poseidon.hash */.jm.hash(this.toFields());
    }
    constructor(address){
        super(address);
        this.address = address;
    }
}
__decorate([
    web/* prop */.vg,
    __metadata("design:type", typeof web/* CircuitString */._G === "undefined" ? Object : web/* CircuitString */._G)
], NFTHolder.prototype, "address", void 0);
class Answer extends web/* CircuitValue */.wA {
    hash() {
        return web/* Poseidon.hash */.jm.hash(this.toFields());
    }
    constructor(answer){
        super(answer);
        this.answer = answer;
    }
}
__decorate([
    web/* prop */.vg,
    __metadata("design:type", typeof web/* UInt32 */.xH === "undefined" ? Object : web/* UInt32 */.xH)
], Answer.prototype, "answer", void 0);
const state = {
    zkapp: null,
    transaction: null,
    Own: null,
    nftHoldersTree: null,
    deployerAccount: null,
    zkappPublicKey: null,
    zkappPrivateKey: null
};
// ---------------------------------------------------------------------------------------
const functions = {
    loadSnarkyJS: async (args)=>{
        await web/* isReady */.DK;
    },
    setActiveInstanceToBerkeley: async (args)=>{
        const Berkeley = web/* Mina.BerkeleyQANet */.No.BerkeleyQANet("https://proxy.berkeley.minaexplorer.com/graphql");
        web/* Mina.setActiveInstance */.No.setActiveInstance(Berkeley);
    },
    setActiveInstanceToLocal: async (args)=>{
        const Local = web/* Mina.LocalBlockchain */.No.LocalBlockchain({
            proofsEnabled
        });
        web/* Mina.setActiveInstance */.No.setActiveInstance(Local);
        state.deployerAccount = Local.testAccounts[0].privateKey;
        state.zkappPrivateKey = web/* PrivateKey.random */._q.random();
        state.zkappPublicKey = state.zkappPrivateKey.toPublicKey();
    },
    loadContract: async (args)=>{
        const { Own  } = await __webpack_require__.e(/* import() */ 213).then(__webpack_require__.bind(__webpack_require__, 5213));
        state.Own = Own;
        state.zkapp = new state.Own(state.zkappPublicKey);
    // console.log("verificationKey");
    // const verificationKey = await YKProof.compile();
    // // console.log(verificationKey);
    // console.log(verificationKey.verificationKey.hash);
    },
    compileContract: async (args)=>{
        console.log("verificationKey");
        const verificationKey = await state.Own.compile();
        console.log(verificationKey.verificationKey.hash);
    },
    deployContract: async (args)=>{
        const txn = await web/* Mina.transaction */.No.transaction(state.deployerAccount, ()=>{
            web/* AccountUpdate.fundNewAccount */.nx.fundNewAccount(state.deployerAccount, {
                initialBalance
            });
            state.zkapp.deploy({
                zkappKey: state.zkappPrivateKey
            });
        });
        // await txn.prove();
        // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
        await txn.sign([
            state.zkappPrivateKey
        ]).send();
    },
    initContract: async (args)=>{
        let initTx = await web/* Mina.transaction */.No.transaction(state.deployerAccount, ()=>{
            state.zkapp.init();
            state.zkapp.sign(state.zkappPrivateKey);
        });
        // await initTx.prove();
        await initTx.send();
        let nftHoldersTree = new web/* MerkleTree */.MV(10);
        nftHoldersTree = createNFTHoldersMerkleTree();
        state.nftHoldersTree = nftHoldersTree;
    },
    fetchAccount: async (args)=>{
        const publicKey = web/* PublicKey.fromBase58 */.nh.fromBase58(args.publicKey58);
        const account = await (0,web/* fetchAccount */.$G)({
            publicKey
        });
        return account;
    },
    initZkappInstance: async (args)=>{
        const publicKey = web/* PublicKey.fromBase58 */.nh.fromBase58(args.publicKey58);
        state.zkapp = new state.Own(publicKey);
        state.zkappPublicKey = publicKey;
        let nftHoldersTree = new web/* MerkleTree */.MV(10);
        nftHoldersTree = createNFTHoldersMerkleTree();
        state.nftHoldersTree = nftHoldersTree;
    },
    getCommitmentNFTHolders: async (args)=>{
        const currentNum = await state.zkapp.commitmentNFTHolders.get();
        return JSON.stringify(currentNum);
    },
    createValidateNFTHolderTransaction: async (args)=>{
        try {
            console.log(args.response);
            console.log(args.holderPosition);
            let w = state.nftHoldersTree.getWitness(BigInt(args.holderPosition));
            let witness = new NFTHolderWitness(w);
            const transaction = await web/* Mina.transaction */.No.transaction(()=>{
                state.zkapp.validateNFTHolder(new NFTHolder(web/* CircuitString.fromString */._G.fromString(args.response)), witness);
            });
            state.transaction = transaction;
            return true;
        } catch (e) {
            console.log("error from create tx");
            console.log(e);
            return false;
        }
    },
    createValidateAndStoreNFTHolderTransaction: async (args)=>{
        try {
            console.log(args.response);
            console.log(args.holderPosition);
            console.log(args.minaAddress);
            let w = state.nftHoldersTree.getWitness(BigInt(args.holderPosition));
            let witness = new NFTHolderWitness(w);
            let minaHolder = new NFTHolder(web/* CircuitString.fromString */._G.fromString(args.minaAddress));
            const transaction = await web/* Mina.transaction */.No.transaction(()=>{
                state.zkapp.validateAndStoreNFTHolder(new NFTHolder(web/* CircuitString.fromString */._G.fromString(args.response)), witness, minaHolder);
            });
            state.transaction = transaction;
            return true;
        } catch (e) {
            console.log("error from create tx");
            console.log(e);
            return false;
        }
    },
    sendValidateNFTHolderTransactionLocal: async (args)=>{
        try {
            console.log(args.response);
            console.log(args.holderPosition);
            let w = state.nftHoldersTree.getWitness(BigInt(args.holderPosition));
            let witness = new NFTHolderWitness(w);
            const transaction = await web/* Mina.transaction */.No.transaction(state.deployerAccount, ()=>{
                state.zkapp.validateNFTHolder(new NFTHolder(web/* CircuitString.fromString */._G.fromString(args.response)), witness);
                state.zkapp.sign(state.zkappPrivateKey);
            });
            state.transaction = transaction;
            state.transaction.prove();
            state.transaction.send();
            console.log("successfully");
            return true;
        } catch (e) {
            console.log("error from create tx");
            console.log(e);
            return false;
        }
    },
    proveUpdateTransaction: async (args)=>{
        try {
            await state.transaction.prove();
            return true;
        } catch (e) {
            console.log("error from proof");
            console.log(e);
            return false;
        }
    },
    getTransactionJSON: async (args)=>{
        return state.transaction.toJSON();
    },
    getNumValidatedNFTHolders: async (args)=>{
        const currentNum = await state.zkapp.validatedNFTHoldersTotal.get();
        return JSON.stringify(currentNum);
    }
};
if (true) {
    addEventListener("message", async (event)=>{
        const returnData = await functions[event.data.fn](event.data.args);
        const message = {
            id: event.data.id,
            data: returnData
        };
        postMessage(message);
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = function() {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [829], function() { return __webpack_require__(4604); })
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	!function() {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = function(queue) {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach(function(fn) { fn.r--; });
/******/ 				queue.forEach(function(fn) { fn.r-- ? fn.r++ : fn(); });
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = function(deps) { return deps.map(function(dep) {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then(function(r) {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, function(e) {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = function(fn) { fn(queue); };
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = function() {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}); };
/******/ 		__webpack_require__.a = function(module, body, hasAwait) {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise(function(resolve, rej) {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = function(fn) { queue && fn(queue), depQueues.forEach(fn), promise["catch"](function() {}); };
/******/ 			module.exports = promise;
/******/ 			body(function(deps) {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = function() { return currentDeps.map(function(d) {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}); }
/******/ 				var promise = new Promise(function(resolve) {
/******/ 					fn = function() { resolve(getResult); };
/******/ 					fn.r = 0;
/******/ 					var fnQueue = function(q) { q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))); };
/******/ 					currentDeps.map(function(dep) { dep[webpackQueues](fnQueue); });
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, function(err) { (err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue); });
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/chunks/" + (chunkId === 829 ? "cc8f0cfa" : chunkId) + "." + {"213":"12c6975137ef240d","829":"918385ecec117703"}[chunkId] + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	!function() {
/******/ 		__webpack_require__.tu = function(url) { return __webpack_require__.tt().createScriptURL(url); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/code-on-chain-with-mina//_next/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			21: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = function(data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = function(chunkId, promises) {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.u(chunkId)));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	!function() {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = function() {
/******/ 			return __webpack_require__.e(829).then(next);
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;