var _excluded = ["attributes"];
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * BitBuffer - High-performance bit manipulation for genome encoding
 * Works directly with binary data instead of strings for maximum efficiency
 */
var BitBuffer = /*#__PURE__*/function () {
  function BitBuffer() {
    var sizeInBits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    _classCallCheck(this, BitBuffer);
    // Calculate bytes needed (round up)
    var bytesNeeded = Math.ceil(sizeInBits / 8);
    this.buffer = new Uint8Array(bytesNeeded);
    this.bitLength = sizeInBits;
    this.position = 0;
  }

  /**
   * Create from existing data
   */
  _createClass(BitBuffer, [{
    key: "writeBits",
    value:
    /**
     * Write bits at specific position
     * @param {number} value - Value to write
     * @param {number} bits - Number of bits to write
     * @param {number} position - Bit position (optional)
     */
    function writeBits(value, bits) {
      var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (bits <= 0) return;
      var pos = position !== null ? position : this.position;
      this._ensureCapacity(pos + bits);

      // Ensure value only contains the requested number of bits
      if (bits > 32) {
        for (var i = 0; i < bits; i++) {
          var shift = bits - 1 - i;
          var bit = Math.floor(value / Math.pow(2, shift)) % 2;
          this.writeBits(bit, 1, pos + i);
        }
        var newLengthFallback = pos + bits;
        if (newLengthFallback > this.bitLength) {
          this.bitLength = newLengthFallback;
        }
        if (position === null) {
          this.position = newLengthFallback;
        }
        return;
      }
      if (bits === 32) {
        value = value >>> 0;
      } else {
        var mask = (1 << bits) - 1;
        value &= mask;
      }
      var remaining = bits;
      var bitPos = pos;
      while (remaining > 0) {
        var byteIndex = bitPos >> 3;
        var bitOffset = bitPos & 7;
        var writable = Math.min(remaining, 8 - bitOffset);
        var _shift = remaining - writable;
        var chunkMask = (1 << writable) - 1;
        var _chunk = value >> _shift & chunkMask;
        var targetShift = 8 - bitOffset - writable;
        var _mask = chunkMask << targetShift;
        this.buffer[byteIndex] = this.buffer[byteIndex] & ~_mask | _chunk << targetShift;
        remaining -= writable;
        bitPos += writable;
      }
      var newLength = pos + bits;
      if (newLength > this.bitLength) {
        this.bitLength = newLength;
      } else if (position === null) {
        this.bitLength = newLength;
      }
      if (position === null) {
        this.position = newLength;
      }
    }

    /**
     * Read bits from specific position
     * @param {number} bits - Number of bits to read
     * @param {number} position - Bit position (optional)
     */
  }, {
    key: "readBits",
    value: function readBits(bits) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (bits <= 0) return 0;
      var pos = position !== null ? position : this.position;
      var value = 0;
      var remaining = bits;
      var bitPos = pos;
      while (remaining > 0) {
        var byteIndex = bitPos >> 3;
        if (byteIndex >= this.buffer.length) break;
        var bitOffset = bitPos & 7;
        var readable = Math.min(remaining, 8 - bitOffset);
        var targetShift = 8 - bitOffset - readable;
        var chunkMask = (1 << readable) - 1;
        var _chunk2 = this.buffer[byteIndex] >> targetShift & chunkMask;
        value = value * (1 << readable) + _chunk2;
        remaining -= readable;
        bitPos += readable;
      }
      if (position === null) {
        this.position = pos + bits;
      }
      return value;
    }

    /**
     * Set individual bit
     */
  }, {
    key: "setBit",
    value: function setBit(position, value) {
      var byteIndex = Math.floor(position / 8);
      var bitIndex = 7 - position % 8;
      if (byteIndex >= this.buffer.length) {
        // Expand buffer if needed
        var newBuffer = new Uint8Array(byteIndex + 1);
        newBuffer.set(this.buffer);
        this.buffer = newBuffer;
      }
      if (value) {
        this.buffer[byteIndex] |= 1 << bitIndex;
      } else {
        this.buffer[byteIndex] &= ~(1 << bitIndex);
      }
    }

    /**
     * Get individual bit
     */
  }, {
    key: "getBit",
    value: function getBit(position) {
      var byteIndex = Math.floor(position / 8);
      var bitIndex = 7 - position % 8;
      if (byteIndex >= this.buffer.length) return 0;
      return this.buffer[byteIndex] >> bitIndex & 1;
    }

    /**
     * Convert to base32 string
     */
  }, {
    key: "toBase32String",
    value: function toBase32String() {
      var str = '';
      var totalBits = this.bitLength || this.buffer.length * 8;
      for (var i = 0; i < totalBits; i += 5) {
        var remainingBits = Math.min(5, totalBits - i);
        var value = this.readBits(remainingBits, i);

        // Pad if less than 5 bits and mask to ensure valid base32
        var paddedValue = remainingBits < 5 ? value << 5 - remainingBits & 0x1F : value;
        str += paddedValue.toString(32).toUpperCase();
      }
      this.position = 0; // Reset position
      return str;
    }

    /**
     * Clone the buffer
     */
  }, {
    key: "clone",
    value: function clone() {
      var newBuffer = new BitBuffer(this.buffer.length * 8);
      newBuffer.buffer = new Uint8Array(this.buffer);
      newBuffer.position = this.position;
      newBuffer.bitLength = this.bitLength;
      return newBuffer;
    }

    /**
     * Get size in bytes
     */
  }, {
    key: "byteLength",
    get: function get() {
      return this.buffer.length;
    }

    /**
     * Append another BitBuffer
     */
  }, {
    key: "append",
    value: function append(other) {
      var otherBits = other.bitLength || other.buffer.length * 8;
      if (otherBits === 0) return;
      var startPosition = Math.max(this.position, this.bitLength);
      var requiredBits = startPosition + otherBits;
      this._ensureCapacity(requiredBits);
      var copiedBits = 0;
      if ((startPosition & 7) === 0) {
        var byteLength = Math.floor(otherBits / 8);
        if (byteLength > 0) {
          this.buffer.set(other.buffer.subarray(0, byteLength), startPosition >> 3);
          copiedBits = byteLength * 8;
        }
        var remaining = otherBits - copiedBits;
        if (remaining > 0) {
          var remainderValue = other.readBits(remaining, copiedBits);
          this.writeBits(remainderValue, remaining, startPosition + copiedBits);
          copiedBits = otherBits;
        }
      } else {
        var offset = 0;
        while (offset < otherBits) {
          var chunkSize = Math.min(32, otherBits - offset);
          var _chunk3 = other.readBits(chunkSize, offset);
          this.writeBits(_chunk3, chunkSize, startPosition + offset);
          offset += chunkSize;
        }
        copiedBits = otherBits;
      }
      var newLength = startPosition + copiedBits;
      this.bitLength = Math.max(this.bitLength, newLength);
      this.position = newLength;
    }

    /**
     * Slice bits from start to end
     */
  }, {
    key: "slice",
    value: function slice(start, end) {
      var length = end - start;
      var newBuffer = new BitBuffer(length);
      if (length <= 0) return newBuffer;
      newBuffer._ensureCapacity(length);
      var offset = 0;
      while (offset < length) {
        var chunkSize = Math.min(32, length - offset);
        var _chunk4 = this.readBits(chunkSize, start + offset);
        newBuffer.writeBits(_chunk4, chunkSize, offset);
        offset += chunkSize;
      }
      newBuffer.bitLength = length;
      newBuffer.position = length;
      return newBuffer;
    }

    /**
     * Ensure the internal buffer can accommodate the requested number of bits
     * @param {number} bitsNeeded
     * @private
     */
  }, {
    key: "_ensureCapacity",
    value: function _ensureCapacity(bitsNeeded) {
      if (bitsNeeded <= this.buffer.length * 8) return;
      var requiredBytes = Math.ceil(bitsNeeded / 8);
      var currentBytes = this.buffer.length;
      var newSize = Math.max(requiredBytes, currentBytes ? currentBytes * 2 : requiredBytes);
      var newBuffer = new Uint8Array(newSize);
      if (currentBytes > 0) {
        newBuffer.set(this.buffer);
      }
      this.buffer = newBuffer;
    }
  }], [{
    key: "from",
    value: function from(data) {
      if (data instanceof Uint8Array) {
        var buffer = new BitBuffer(data.length * 8);
        buffer.buffer = data;
        buffer.bitLength = data.length * 8;
        return buffer;
      }
      if (typeof data === 'string') {
        // Convert base32 string to bits
        return BitBuffer.fromBase32String(data);
      }
      if (data instanceof BitBuffer) {
        return data;
      }
      return new BitBuffer();
    }

    /**
     * Convert base32 string to BitBuffer
     */
  }, {
    key: "fromBase32String",
    value: function fromBase32String(str) {
      var buffer = new BitBuffer(str.length * 5);
      for (var i = 0; i < str.length; i++) {
        var value = parseInt(str[i], 32);
        buffer.writeBits(value, 5, i * 5);
      }
      buffer.bitLength = str.length * 5;
      buffer.position = buffer.bitLength;
      return buffer;
    }
  }]);
  return BitBuffer;
}();
/**
 * LearningRuleBase - Bit-level encoding for synaptic learning rules
 *
 * Format: [type:3='010'][ruleType:3][connId:10][rate:5][decay:2]
 *
 * - type: 010 (LearningRule identifier)
 * - ruleType:
 *   000 = Hebbian ("fire together, wire together")
 *   001 = Anti-Hebbian (decorrelation)
 *   010 = STDP (Spike-Timing-Dependent Plasticity)
 *   011 = BCM (Bienenstock-Cooper-Munro)
 *   100 = Oja's Rule (weight normalization)
 *   101-111 = Reserved
 * - connId: 0-1023 connection index to modify
 * - rate: 0-31 learning rate (scaled to 0.0-1.0)
 * - decay: 00=none, 01=slow, 10=medium, 11=fast
 *
 * Example: Hebbian learning on connection #42, rate 0.5
 * 010 000 0000101010 01111 10
 * │   │   │          │     │
 * │   │   │          │     └─ decay: medium
 * │   │   │          └─ rate: 15 (= 0.5)
 * │   │   └─ connection #42
 * │   └─ Hebbian
 * └─ type: LearningRule
 *
 * Total: 23 bits
 */
var LearningRuleBase = /*#__PURE__*/function () {
  function LearningRuleBase() {
    _classCallCheck(this, LearningRuleBase);
  }
  _createClass(LearningRuleBase, null, [{
    key: "fromBitBuffer",
    value:
    /**
     * Parse learning rule from BitBuffer
     * @param {BitBuffer} buffer - Source buffer
     * @param {number} position - Bit position to start reading
     * @returns {Object|null} Parsed base or null if invalid
     */
    function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;

      // Need exactly 23 bits
      if (position + LearningRuleBase.BIT_LENGTH > totalBits) return null;

      // Read type (3 bits) - should be 010
      var typeId = buffer.readBits(3, position);
      if (typeId !== 2) return null;

      // Read rule type (3 bits)
      var ruleType = buffer.readBits(3, position + 3);

      // Read connection ID (10 bits)
      var connId = buffer.readBits(10, position + 6);

      // Read learning rate (5 bits)
      var rate = buffer.readBits(5, position + 16);

      // Read decay (2 bits)
      var decay = buffer.readBits(2, position + 21);
      return {
        type: 'learning_rule',
        ruleType: ruleType,
        connId: connId,
        rate: rate,
        decay: decay,
        bitLength: LearningRuleBase.BIT_LENGTH,
        data: ruleType // Compatibility with Base class
      };
    }

    /**
     * Convert learning rule to BitBuffer
     * @param {Object} base - Base object
     * @returns {BitBuffer} Encoded buffer
     */
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      var buffer = new BitBuffer(LearningRuleBase.BIT_LENGTH);

      // Write type (3 bits): 010
      buffer.writeBits(2, 3);

      // Write rule type (3 bits)
      buffer.writeBits(base.ruleType & 7, 3);

      // Write connection ID (10 bits)
      buffer.writeBits(base.connId & 1023, 10);

      // Write learning rate (5 bits)
      buffer.writeBits(base.rate & 31, 5);

      // Write decay (2 bits)
      buffer.writeBits(base.decay & 3, 2);
      return buffer;
    }

    /**
     * Generate random learning rule
     * @param {Object} options - Configuration options
     * @returns {BitBuffer} Random learning rule buffer
     */
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$maxConnectio = options.maxConnections,
        maxConnections = _options$maxConnectio === void 0 ? 1024 : _options$maxConnectio,
        _options$ruleTypes = options.ruleTypes,
        ruleTypes = _options$ruleTypes === void 0 ? [LearningRuleBase.HEBBIAN, LearningRuleBase.ANTI_HEBBIAN, LearningRuleBase.STDP] : _options$ruleTypes;
      return LearningRuleBase.toBitBuffer({
        type: 'learning_rule',
        ruleType: ruleTypes[Math.floor(Math.random() * ruleTypes.length)],
        connId: Math.floor(Math.random() * maxConnections),
        rate: Math.floor(Math.random() * 32),
        // 0-31
        decay: Math.floor(Math.random() * 4) // 0-3
      });
    }

    /**
     * Get learning rate as float (0.0 - 1.0)
     * @param {number} rate - Integer rate (0-31)
     * @returns {number} Float rate
     */
  }, {
    key: "rateToFloat",
    value: function rateToFloat(rate) {
      return rate / 31.0;
    }

    /**
     * Convert float rate to integer
     * @param {number} floatRate - Float rate (0.0 - 1.0)
     * @returns {number} Integer rate (0-31)
     */
  }, {
    key: "floatToRate",
    value: function floatToRate(floatRate) {
      return Math.round(Math.max(0, Math.min(1, floatRate)) * 31);
    }

    /**
     * Get decay factor
     * @param {number} decay - Decay code (0-3)
     * @returns {number} Decay factor per tick
     */
  }, {
    key: "getDecayFactor",
    value: function getDecayFactor(decay) {
      var factors = [0, 0.001, 0.01, 0.05]; // none, slow, medium, fast
      return factors[decay] || 0;
    }

    /**
     * Get rule type name
     * @param {number} ruleType - Rule type code
     * @returns {string} Rule name
     */
  }, {
    key: "getRuleName",
    value: function getRuleName(ruleType) {
      var names = ['Hebbian', 'Anti-Hebbian', 'STDP', 'BCM', 'Oja'];
      return names[ruleType] || 'Unknown';
    }

    /**
     * Apply learning rule to connection weight
     * @param {Object} rule - Learning rule base
     * @param {number} weight - Current weight
     * @param {number} preValue - Pre-synaptic activation
     * @param {number} postValue - Post-synaptic activation
     * @returns {number} New weight
     */
  }, {
    key: "applyRule",
    value: function applyRule(rule, weight, preValue, postValue) {
      var rate = LearningRuleBase.rateToFloat(rule.rate);
      var decayFactor = LearningRuleBase.getDecayFactor(rule.decay);
      var delta = 0;
      switch (rule.ruleType) {
        case LearningRuleBase.HEBBIAN:
          // Δw = η × pre × post
          delta = rate * preValue * postValue;
          break;
        case LearningRuleBase.ANTI_HEBBIAN:
          // Δw = -η × pre × post
          delta = -rate * preValue * postValue;
          break;
        case LearningRuleBase.STDP:
          // Simplified STDP: strengthen if post follows pre
          // (Real STDP needs timing information)
          if (preValue > 0.5 && postValue > 0.5) {
            delta = rate * 0.1;
          } else if (postValue > 0.5 && preValue < 0.5) {
            delta = -rate * 0.1;
          }
          break;
        case LearningRuleBase.BCM:
          // BCM: Δw = η × post × (post - θ) × pre
          // Simplified θ = 0.5
          var theta = 0.5;
          delta = rate * postValue * (postValue - theta) * preValue;
          break;
        case LearningRuleBase.OJA:
          // Oja's Rule: Δw = η × post × (pre - post × w)
          delta = rate * postValue * (preValue - postValue * weight);
          break;
      }

      // Apply weight update
      var newWeight = weight + delta;

      // Apply decay
      if (decayFactor > 0) {
        newWeight *= 1 - decayFactor;
      }

      // Clamp weight to reasonable range
      return Math.max(-1, Math.min(1, newWeight));
    }

    /**
     * Mutate learning rule in-place
     * @param {BitBuffer} buffer - Buffer containing rule
     * @param {number} position - Rule position in buffer
     * @param {number} mutationRate - Mutation rate per bit
     */
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      // Bit-flip mutations
      for (var i = 0; i < LearningRuleBase.BIT_LENGTH; i++) {
        if (Math.random() < mutationRate) {
          var currentBit = buffer.getBit(position + i);
          buffer.setBit(position + i, currentBit ? 0 : 1);
        }
      }
    }

    /**
     * Compare two learning rules
     * @param {Object} base1 - First rule
     * @param {Object} base2 - Second rule
     * @returns {boolean} True if equal
     */
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== 'learning_rule' || base2.type !== 'learning_rule') {
        return false;
      }
      return base1.ruleType === base2.ruleType && base1.connId === base2.connId && base1.rate === base2.rate && base1.decay === base2.decay;
    }
  }]);
  return LearningRuleBase;
}();
/**
 * MemoryCellBase - Bit-level encoding for temporal memory storage
 *
 * Format: [type:3='011'][cellId:9][decay:5][persistence:3]
 *
 * - type: 011 (MemoryCell identifier)
 * - cellId: 0-511 unique memory cell identifier
 * - decay: 0-31 exponential decay rate per tick
 * - persistence: 0-7 (0=volatile, 7=permanent)
 *
 * Memory cells store floating-point values that decay over time,
 * allowing temporal information processing and short-term memory.
 *
 * Example: Memory cell #17 with medium decay
 * 011 000010001 10101 101
 * │   │         │     │
 * │   │         │     └─ persistence: 5 (high)
 * │   │         └─ decay: 21 (medium)
 * │   └─ cell #17
 * └─ type: MemoryCell
 *
 * Total: 20 bits
 */
// Learning rule type constants
_defineProperty(LearningRuleBase, "HEBBIAN", 0);
_defineProperty(LearningRuleBase, "ANTI_HEBBIAN", 1);
_defineProperty(LearningRuleBase, "STDP", 2);
_defineProperty(LearningRuleBase, "BCM", 3);
_defineProperty(LearningRuleBase, "OJA", 4);
// Decay constants
_defineProperty(LearningRuleBase, "DECAY_NONE", 0);
_defineProperty(LearningRuleBase, "DECAY_SLOW", 1);
_defineProperty(LearningRuleBase, "DECAY_MEDIUM", 2);
_defineProperty(LearningRuleBase, "DECAY_FAST", 3);
// Bit length constant
_defineProperty(LearningRuleBase, "BIT_LENGTH", 23);
var MemoryCellBase = /*#__PURE__*/function () {
  function MemoryCellBase() {
    _classCallCheck(this, MemoryCellBase);
  }
  _createClass(MemoryCellBase, null, [{
    key: "fromBitBuffer",
    value:
    /**
     * Parse memory cell from BitBuffer
     * @param {BitBuffer} buffer - Source buffer
     * @param {number} position - Bit position to start reading
     * @returns {Object|null} Parsed base or null if invalid
     */
    function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;

      // Need exactly 20 bits
      if (position + MemoryCellBase.BIT_LENGTH > totalBits) return null;

      // Read type (3 bits) - should be 011
      var typeId = buffer.readBits(3, position);
      if (typeId !== 3) return null;

      // Read cell ID (9 bits)
      var cellId = buffer.readBits(9, position + 3);

      // Read decay rate (5 bits)
      var decay = buffer.readBits(5, position + 12);

      // Read persistence (3 bits)
      var persistence = buffer.readBits(3, position + 17);
      return {
        type: 'memory_cell',
        cellId: cellId,
        decay: decay,
        persistence: persistence,
        bitLength: MemoryCellBase.BIT_LENGTH,
        data: cellId // Compatibility with Base class
      };
    }

    /**
     * Convert memory cell to BitBuffer
     * @param {Object} base - Base object
     * @returns {BitBuffer} Encoded buffer
     */
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      var buffer = new BitBuffer(MemoryCellBase.BIT_LENGTH);

      // Write type (3 bits): 011
      buffer.writeBits(3, 3);

      // Write cell ID (9 bits)
      buffer.writeBits(base.cellId & 511, 9);

      // Write decay rate (5 bits)
      buffer.writeBits(base.decay & 31, 5);

      // Write persistence (3 bits)
      buffer.writeBits(base.persistence & 7, 3);
      return buffer;
    }

    /**
     * Generate random memory cell
     * @param {Object} options - Configuration options
     * @returns {BitBuffer} Random memory cell buffer
     */
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$maxCells = options.maxCells,
        maxCells = _options$maxCells === void 0 ? 512 : _options$maxCells;
      return MemoryCellBase.toBitBuffer({
        type: 'memory_cell',
        cellId: Math.floor(Math.random() * maxCells),
        decay: Math.floor(Math.random() * 32),
        // 0-31
        persistence: Math.floor(Math.random() * 8) // 0-7
      });
    }

    /**
     * Get decay factor per tick
     * @param {number} decay - Decay code (0-31)
     * @returns {number} Decay factor (0.0 - 1.0)
     */
  }, {
    key: "getDecayFactor",
    value: function getDecayFactor(decay) {
      // Exponential decay: higher values = faster decay
      // decay=0 → 0% per tick (no decay)
      // decay=31 → 10% per tick (rapid decay)
      return decay / 31 * 0.1;
    }

    /**
     * Get persistence threshold
     * Cells with high persistence resist being cleared/reset
     * @param {number} persistence - Persistence code (0-7)
     * @returns {number} Threshold (0.0 - 1.0)
     */
  }, {
    key: "getPersistenceThreshold",
    value: function getPersistenceThreshold(persistence) {
      return persistence / 7.0;
    }

    /**
     * Update memory cell value with decay
     * @param {number} currentValue - Current cell value
     * @param {Object} cell - Memory cell base
     * @param {number} newInput - Optional new input to add
     * @returns {number} Updated value
     */
  }, {
    key: "updateValue",
    value: function updateValue(currentValue, cell) {
      var newInput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var decayFactor = MemoryCellBase.getDecayFactor(cell.decay);

      // Apply decay
      var value = currentValue * (1 - decayFactor);

      // Add new input
      value += newInput;

      // Clamp to reasonable range
      return Math.max(-1, Math.min(1, value));
    }

    /**
     * Check if cell should persist during reset
     * @param {Object} cell - Memory cell base
     * @param {number} resetProbability - Probability of reset (0-1)
     * @returns {boolean} True if cell persists
     */
  }, {
    key: "shouldPersist",
    value: function shouldPersist(cell) {
      var resetProbability = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
      var threshold = MemoryCellBase.getPersistenceThreshold(cell.persistence);
      return Math.random() > resetProbability * (1 - threshold);
    }

    /**
     * Get memory decay time constant (ticks until ~37% of original)
     * @param {Object} cell - Memory cell base
     * @returns {number} Time constant in ticks
     */
  }, {
    key: "getTimeConstant",
    value: function getTimeConstant(cell) {
      var decayFactor = MemoryCellBase.getDecayFactor(cell.decay);
      if (decayFactor === 0) return Infinity;

      // τ = 1 / decay_factor (exponential decay time constant)
      return Math.round(1 / decayFactor);
    }

    /**
     * Get half-life (ticks until value is 50% of original)
     * @param {Object} cell - Memory cell base
     * @returns {number} Half-life in ticks
     */
  }, {
    key: "getHalfLife",
    value: function getHalfLife(cell) {
      var decayFactor = MemoryCellBase.getDecayFactor(cell.decay);
      if (decayFactor === 0) return Infinity;

      // t_half = ln(2) / decay_factor
      return Math.round(Math.log(2) / decayFactor);
    }

    /**
     * Mutate memory cell in-place
     * @param {BitBuffer} buffer - Buffer containing cell
     * @param {number} position - Cell position in buffer
     * @param {number} mutationRate - Mutation rate per bit
     */
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      // Bit-flip mutations
      for (var i = 0; i < MemoryCellBase.BIT_LENGTH; i++) {
        if (Math.random() < mutationRate) {
          var currentBit = buffer.getBit(position + i);
          buffer.setBit(position + i, currentBit ? 0 : 1);
        }
      }
    }

    /**
     * Compare two memory cells
     * @param {Object} base1 - First cell
     * @param {Object} base2 - Second cell
     * @returns {boolean} True if equal
     */
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== 'memory_cell' || base2.type !== 'memory_cell') {
        return false;
      }
      return base1.cellId === base2.cellId && base1.decay === base2.decay && base1.persistence === base2.persistence;
    }

    /**
     * Get memory type description
     * @param {Object} cell - Memory cell base
     * @returns {string} Description
     */
  }, {
    key: "getTypeDescription",
    value: function getTypeDescription(cell) {
      var halfLife = MemoryCellBase.getHalfLife(cell);
      MemoryCellBase.getPersistenceThreshold(cell.persistence);
      if (halfLife > 1000) {
        return 'Long-term memory (persistent)';
      } else if (halfLife > 100) {
        return 'Medium-term memory';
      } else if (halfLife > 10) {
        return 'Short-term memory (working)';
      } else {
        return 'Ultra-short memory (sensory buffer)';
      }
    }
  }]);
  return MemoryCellBase;
}();
/**
 * ModuleBase - Bit-level encoding for hierarchical sub-networks
 *
 * Format: [type:3='100'][moduleId:8][length:8][moduleGenome:length*8bits]
 *
 * - type: 100 (Module identifier)
 * - moduleId: 0-255 module type identifier
 * - length: 0-255 bytes of encapsulated genome
 * - moduleGenome: Raw genome bytes (complete sub-network)
 *
 * Modules allow hierarchical networks - a module is a complete
 * sub-network encoded as a reusable component with its own
 * connections, biases, and other bases.
 *
 * Example: Module #3 with 10-byte genome
 * 100 00000011 00001010 [80 bits of genome...]
 * │   │        │        │
 * │   │        │        └─ Encapsulated genome
 * │   │        └─ 10 bytes length
 * │   └─ module #3
 * └─ type: Module
 *
 * Total: 3 + 8 + 8 + (length * 8) bits
 */
// Bit length constant
_defineProperty(MemoryCellBase, "BIT_LENGTH", 20);
var ModuleBase = /*#__PURE__*/function () {
  function ModuleBase() {
    _classCallCheck(this, ModuleBase);
  }
  _createClass(ModuleBase, null, [{
    key: "fromBitBuffer",
    value:
    /**
     * Parse module from BitBuffer
     * @param {BitBuffer} buffer - Source buffer
     * @param {number} position - Bit position to start reading
     * @returns {Object|null} Parsed base or null if invalid
     */
    function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;

      // Need at least 19 bits (type + moduleId + length)
      if (position + 19 > totalBits) return null;

      // Read type (3 bits) - should be 100
      var typeId = buffer.readBits(3, position);
      if (typeId !== 4) return null;

      // Read module ID (8 bits)
      var moduleId = buffer.readBits(8, position + 3);

      // Read length in bytes (8 bits)
      var length = buffer.readBits(8, position + 11);

      // Calculate total bit length
      var bitLength = 19 + length * 8;

      // Check if we have enough bits
      if (position + bitLength > totalBits) return null;

      // Read module genome (length * 8 bits)
      var moduleGenome = buffer.slice(position + 19, position + bitLength);
      return {
        type: 'module',
        moduleId: moduleId,
        length: length,
        moduleGenome: moduleGenome,
        bitLength: bitLength,
        data: moduleId // Compatibility with Base class
      };
    }

    /**
     * Convert module to BitBuffer
     * @param {Object} base - Base object with moduleGenome (BitBuffer)
     * @returns {BitBuffer} Encoded buffer
     */
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      var length = base.length || Math.ceil(base.moduleGenome.bitLength / 8);
      var bitLength = 19 + length * 8;
      var buffer = new BitBuffer(bitLength);

      // Write type (3 bits): 100
      buffer.writeBits(4, 3);

      // Write module ID (8 bits)
      buffer.writeBits(base.moduleId & 0xFF, 8);

      // Write length (8 bits)
      buffer.writeBits(length & 0xFF, 8);

      // Append module genome
      buffer.append(base.moduleGenome);
      return buffer;
    }

    /**
     * Generate random module
     * @param {Object} options - Configuration options
     * @returns {BitBuffer} Random module buffer
     */
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$maxModuleTyp = options.maxModuleTypes,
        maxModuleTypes = _options$maxModuleTyp === void 0 ? 256 : _options$maxModuleTyp,
        _options$minGenomeByt = options.minGenomeBytes,
        minGenomeBytes = _options$minGenomeByt === void 0 ? 10 : _options$minGenomeByt,
        _options$maxGenomeByt = options.maxGenomeBytes,
        maxGenomeBytes = _options$maxGenomeByt === void 0 ? 50 : _options$maxGenomeByt;

      // Random genome length
      var length = minGenomeBytes + Math.floor(Math.random() * (maxGenomeBytes - minGenomeBytes + 1));

      // Generate random genome
      var moduleGenome = new BitBuffer(length * 8);
      for (var i = 0; i < length; i++) {
        moduleGenome.writeBits(Math.floor(Math.random() * 256), 8);
      }
      return ModuleBase.toBitBuffer({
        type: 'module',
        moduleId: Math.floor(Math.random() * maxModuleTypes),
        length: length,
        moduleGenome: moduleGenome
      });
    }

    /**
     * Create module from existing genome
     * @param {number} moduleId - Module type ID
     * @param {BitBuffer} genome - Complete genome for the module
     * @returns {BitBuffer} Module buffer
     */
  }, {
    key: "fromGenome",
    value: function fromGenome(moduleId, genome) {
      var length = Math.ceil(genome.bitLength / 8);
      return ModuleBase.toBitBuffer({
        type: 'module',
        moduleId: moduleId,
        length: length,
        moduleGenome: genome
      });
    }

    /**
     * Extract module genome
     * @param {Object} base - Module base
     * @returns {BitBuffer} Module genome
     */
  }, {
    key: "extractGenome",
    value: function extractGenome(base) {
      return base.moduleGenome.clone();
    }

    /**
     * Calculate bit length for a module
     * @param {number} lengthBytes - Genome length in bytes
     * @returns {number} Total bit length
     */
  }, {
    key: "calculateBitLength",
    value: function calculateBitLength(lengthBytes) {
      return 19 + lengthBytes * 8;
    }

    /**
     * Mutate module in-place
     * @param {BitBuffer} buffer - Buffer containing module
     * @param {number} position - Module position in buffer
     * @param {number} mutationRate - Mutation rate per bit
     * @param {Object} options - Mutation options
     */
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var _options$canChangeMod = options.canChangeModuleId,
        canChangeModuleId = _options$canChangeMod === void 0 ? true : _options$canChangeMod,
        _options$canChangeLen = options.canChangeLength,
        canChangeLength = _options$canChangeLen === void 0 ? false : _options$canChangeLen;

      // Read current length
      var length = buffer.readBits(8, position + 11);
      ModuleBase.calculateBitLength(length);

      // Type 1: Module ID mutations
      if (canChangeModuleId && Math.random() < 0.05) {
        // 5% chance to change module ID
        var newModuleId = Math.floor(Math.random() * 256);
        buffer.writeBits(newModuleId, 8, position + 3);
      }

      // Type 2: Genome content mutations
      // Mutate encapsulated genome bits
      var genomeStart = position + 19;
      var genomeLength = length * 8;
      for (var i = 0; i < genomeLength; i++) {
        if (Math.random() < mutationRate) {
          var bitPos = genomeStart + i;
          var currentBit = buffer.getBit(bitPos);
          buffer.setBit(bitPos, currentBit ? 0 : 1);
        }
      }

      // Type 3: Length mutations (DANGEROUS - can corrupt)
      // Only enable if explicitly allowed
      if (canChangeLength && Math.random() < 0.01) {
        var delta = Math.random() < 0.5 ? -1 : 1;
        var newLength = Math.max(1, Math.min(255, length + delta));
        buffer.writeBits(newLength, 8, position + 11);
      }
    }

    /**
     * Compare two modules
     * @param {Object} base1 - First module
     * @param {Object} base2 - Second module
     * @returns {boolean} True if equal
     */
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== 'module' || base2.type !== 'module') {
        return false;
      }
      if (base1.moduleId !== base2.moduleId) return false;
      if (base1.length !== base2.length) return false;

      // Compare genomes byte by byte
      var genome1 = base1.moduleGenome.buffer;
      var genome2 = base2.moduleGenome.buffer;
      if (genome1.length !== genome2.length) return false;
      for (var i = 0; i < genome1.length; i++) {
        if (genome1[i] !== genome2[i]) return false;
      }
      return true;
    }

    /**
     * Get module complexity (number of bases in genome)
     * @param {Object} base - Module base
     * @returns {number} Estimated number of bases
     */
  }, {
    key: "getComplexity",
    value: function getComplexity(base) {
      // Rough estimate: average base is ~20 bits
      return Math.floor(base.moduleGenome.bitLength / 20);
    }

    /**
     * Check if module is empty/invalid
     * @param {Object} base - Module base
     * @returns {boolean} True if empty
     */
  }, {
    key: "isEmpty",
    value: function isEmpty(base) {
      return base.length === 0 || base.moduleGenome.bitLength === 0;
    }

    /**
     * Get module type name (if predefined)
     * @param {number} moduleId - Module ID
     * @returns {string} Module type name
     */
  }, {
    key: "getModuleTypeName",
    value: function getModuleTypeName(moduleId) {
      // Predefined module types (extensible)
      var types = {
        0: 'Generic',
        1: 'Sensory Processor',
        2: 'Motor Controller',
        3: 'Memory Unit',
        4: 'Decision Maker',
        5: 'Pattern Recognizer'
        // ... can be extended
      };
      return types[moduleId] || "Custom-".concat(moduleId);
    }
  }]);
  return ModuleBase;
}();
/**
 * PlasticityBase - Bit-level encoding for meta-learning plasticity
 *
 * Format: [type:3='101'][targetId:9][level:4]
 *
 * - type: 101 (Plasticity identifier)
 * - targetId: 0-511 neuron ID to make plastic
 * - level: 0-15 plasticity strength (how much weights can change)
 *
 * Plasticity controls meta-learning - how much a neuron's incoming
 * connections can adapt during the individual's lifetime. This is
 * separate from LearningRule which defines HOW weights change.
 * Plasticity defines HOW MUCH they can change.
 *
 * Example: Neuron #127 with high plasticity
 * 101 001111111 1010
 * │   │         │
 * │   │         └─ level: 10 (high)
 * │   └─ neuron #127
 * └─ type: Plasticity
 *
 * Total: 16 bits
 */
var PlasticityBase = /*#__PURE__*/function () {
  function PlasticityBase() {
    _classCallCheck(this, PlasticityBase);
  }
  _createClass(PlasticityBase, null, [{
    key: "fromBitBuffer",
    value:
    /**
     * Parse plasticity from BitBuffer
     * @param {BitBuffer} buffer - Source buffer
     * @param {number} position - Bit position to start reading
     * @returns {Object|null} Parsed base or null if invalid
     */
    function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;

      // Need exactly 16 bits
      if (position + PlasticityBase.BIT_LENGTH > totalBits) return null;

      // Read type (3 bits) - should be 101
      var typeId = buffer.readBits(3, position);
      if (typeId !== 5) return null;

      // Read target neuron ID (9 bits)
      var targetId = buffer.readBits(9, position + 3);

      // Read plasticity level (4 bits)
      var level = buffer.readBits(4, position + 12);
      return {
        type: 'plasticity',
        targetId: targetId,
        level: level,
        bitLength: PlasticityBase.BIT_LENGTH,
        data: targetId // Compatibility with Base class
      };
    }

    /**
     * Convert plasticity to BitBuffer
     * @param {Object} base - Base object
     * @returns {BitBuffer} Encoded buffer
     */
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      var buffer = new BitBuffer(PlasticityBase.BIT_LENGTH);

      // Write type (3 bits): 101
      buffer.writeBits(5, 3);

      // Write target neuron ID (9 bits)
      buffer.writeBits(base.targetId & 511, 9);

      // Write plasticity level (4 bits)
      buffer.writeBits(base.level & 15, 4);
      return buffer;
    }

    /**
     * Generate random plasticity
     * @param {Object} options - Configuration options
     * @returns {BitBuffer} Random plasticity buffer
     */
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$neurons = options.neurons,
        neurons = _options$neurons === void 0 ? 512 : _options$neurons,
        _options$minLevel = options.minLevel,
        minLevel = _options$minLevel === void 0 ? 0 : _options$minLevel,
        _options$maxLevel = options.maxLevel,
        maxLevel = _options$maxLevel === void 0 ? 15 : _options$maxLevel;
      return PlasticityBase.toBitBuffer({
        type: 'plasticity',
        targetId: Math.floor(Math.random() * neurons),
        level: minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1))
      });
    }

    /**
     * Get plasticity as float (0.0 - 1.0)
     * @param {number} level - Integer level (0-15)
     * @returns {number} Float level
     */
  }, {
    key: "levelToFloat",
    value: function levelToFloat(level) {
      return level / 15.0;
    }

    /**
     * Convert float level to integer
     * @param {number} floatLevel - Float level (0.0 - 1.0)
     * @returns {number} Integer level (0-15)
     */
  }, {
    key: "floatToLevel",
    value: function floatToLevel(floatLevel) {
      return Math.round(Math.max(0, Math.min(1, floatLevel)) * 15);
    }

    /**
     * Get plasticity category description
     * @param {number} level - Plasticity level (0-15)
     * @returns {string} Category name
     */
  }, {
    key: "getCategory",
    value: function getCategory(level) {
      if (level === 0) return 'Fixed (no plasticity)';
      if (level <= 3) return 'Low plasticity';
      if (level <= 7) return 'Moderate plasticity';
      if (level <= 11) return 'High plasticity';
      return 'Very high plasticity';
    }

    /**
     * Calculate maximum weight change per tick
     * Plasticity acts as a multiplier for learning rules
     * @param {number} level - Plasticity level (0-15)
     * @param {number} baseLearningRate - Base learning rate
     * @returns {number} Maximum delta weight
     */
  }, {
    key: "getMaxWeightChange",
    value: function getMaxWeightChange(level) {
      var baseLearningRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
      var plasticityFactor = PlasticityBase.levelToFloat(level);
      return baseLearningRate * plasticityFactor;
    }

    /**
     * Apply plasticity scaling to weight update
     * @param {number} level - Plasticity level
     * @param {number} weightDelta - Raw weight change from learning rule
     * @returns {number} Scaled weight change
     */
  }, {
    key: "scaleWeightDelta",
    value: function scaleWeightDelta(level, weightDelta) {
      var plasticityFactor = PlasticityBase.levelToFloat(level);
      return weightDelta * plasticityFactor;
    }

    /**
     * Check if neuron is plastic enough for learning
     * @param {number} level - Plasticity level
     * @param {number} threshold - Minimum level for plasticity
     * @returns {boolean} True if plastic enough
     */
  }, {
    key: "isPlastic",
    value: function isPlastic(level) {
      var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return level > threshold;
    }

    /**
     * Get critical period decay
     * Higher plasticity early in life, decreases over time
     * @param {number} level - Initial plasticity level
     * @param {number} age - Current age in ticks
     * @param {number} criticalPeriod - Critical period duration
     * @returns {number} Age-adjusted plasticity level
     */
  }, {
    key: "getCriticalPeriodLevel",
    value: function getCriticalPeriodLevel(level, age) {
      var criticalPeriod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
      if (age >= criticalPeriod) {
        // After critical period, reduce to 50%
        return Math.floor(level * 0.5);
      }

      // Linear decay during critical period
      var decayFactor = 1.0 - age / criticalPeriod * 0.5;
      return Math.floor(level * decayFactor);
    }

    /**
     * Mutate plasticity in-place
     * @param {BitBuffer} buffer - Buffer containing plasticity
     * @param {number} position - Plasticity position in buffer
     * @param {number} mutationRate - Mutation rate per bit
     */
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      // Bit-flip mutations
      for (var i = 0; i < PlasticityBase.BIT_LENGTH; i++) {
        if (Math.random() < mutationRate) {
          var currentBit = buffer.getBit(position + i);
          buffer.setBit(position + i, currentBit ? 0 : 1);
        }
      }
    }

    /**
     * Compare two plasticity bases
     * @param {Object} base1 - First plasticity
     * @param {Object} base2 - Second plasticity
     * @returns {boolean} True if equal
     */
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== 'plasticity' || base2.type !== 'plasticity') {
        return false;
      }
      return base1.targetId === base2.targetId && base1.level === base2.level;
    }

    /**
     * Calculate stability index
     * Inverse of plasticity - how stable/resistant to change
     * @param {number} level - Plasticity level
     * @returns {number} Stability (0.0 - 1.0)
     */
  }, {
    key: "getStability",
    value: function getStability(level) {
      return 1.0 - PlasticityBase.levelToFloat(level);
    }

    /**
     * Get recommended learning rules for plasticity level
     * Different plasticity levels work best with different rules
     * @param {number} level - Plasticity level
     * @returns {Array<string>} Recommended rule types
     */
  }, {
    key: "getRecommendedRules",
    value: function getRecommendedRules(level) {
      if (level === 0) {
        return []; // No learning
      } else if (level <= 3) {
        return ['Hebbian']; // Simple, stable learning
      } else if (level <= 7) {
        return ['Hebbian', 'Oja']; // Moderate learning with normalization
      } else if (level <= 11) {
        return ['Hebbian', 'Oja', 'BCM']; // Competitive learning
      } else {
        return ['Hebbian', 'Anti-Hebbian', 'STDP', 'BCM', 'Oja']; // All rules
      }
    }
  }]);
  return PlasticityBase;
}();
/**
 * AttributeBase - Bit-level encoding for custom attributes
 *
 * Format: [type:3='111'][attributeId:8][value:8][targetType:2][targetId:9]
 *
 * - type: 111 (Attribute identifier)
 * - attributeId: 0-255 attribute type identifier
 * - value: 0-255 attribute value
 * - targetType:
 *   00 = sensor (modifies sensor input)
 *   01 = neuron (modifies neuron activation)
 *   10 = action (modifies action output) ← NOVO! Influencia ações!
 *   11 = global (affects all of a type)
 * - targetId: 0-511 specific target ID
 *
 * Attributes allow users to experiment with custom properties that
 * influence behavior. Examples:
 * - "energy" attribute that reduces action outputs when low
 * - "fear" attribute that inhibits aggressive actions
 * - "curiosity" attribute that boosts exploration actions
 * - "hunger" attribute that amplifies food-seeking actions
 *
 * Example: Energy attribute (id=0, value=75) affecting action 3
 * 111 00000000 01001011 10 000000011
 * │   │        │        │  │
 * │   │        │        │  └─ action #3
 * │   │        │        └─ target type: action
 * │   │        └─ value: 75
 * │   └─ attribute: energy (0)
 * └─ type: Attribute
 *
 * Total: 30 bits
 */
// Bit length constant
_defineProperty(PlasticityBase, "BIT_LENGTH", 16);
var AttributeBase = /*#__PURE__*/function () {
  function AttributeBase() {
    _classCallCheck(this, AttributeBase);
  }
  _createClass(AttributeBase, null, [{
    key: "fromBitBuffer",
    value:
    /**
     * Parse attribute from BitBuffer
     * @param {BitBuffer} buffer - Source buffer
     * @param {number} position - Bit position to start reading
     * @returns {Object|null} Parsed base or null if invalid
     */
    function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;

      // Need exactly 30 bits
      if (position + AttributeBase.BIT_LENGTH > totalBits) return null;

      // Read type (3 bits) - should be 111
      var typeId = buffer.readBits(3, position);
      if (typeId !== 7) return null;

      // Read attribute ID (8 bits)
      var attributeId = buffer.readBits(8, position + 3);

      // Read value (8 bits)
      var value = buffer.readBits(8, position + 11);

      // Read target type (2 bits)
      var targetType = buffer.readBits(2, position + 19);

      // Read target ID (9 bits)
      var targetId = buffer.readBits(9, position + 21);
      return {
        type: 'attribute',
        attributeId: attributeId,
        value: value,
        targetType: targetType,
        targetId: targetId,
        bitLength: AttributeBase.BIT_LENGTH,
        data: attributeId // Compatibility with Base class
      };
    }

    /**
     * Convert attribute to BitBuffer
     * @param {Object} base - Base object
     * @returns {BitBuffer} Encoded buffer
     */
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      var buffer = new BitBuffer(AttributeBase.BIT_LENGTH);

      // Write type (3 bits): 111
      buffer.writeBits(7, 3);

      // Write attribute ID (8 bits)
      buffer.writeBits(base.attributeId & 0xFF, 8);

      // Write value (8 bits)
      buffer.writeBits(base.value & 0xFF, 8);

      // Write target type (2 bits)
      buffer.writeBits(base.targetType & 3, 2);

      // Write target ID (9 bits)
      buffer.writeBits(base.targetId & 511, 9);
      return buffer;
    }

    /**
     * Generate random attribute
     * @param {Object} options - Configuration options
     * @returns {BitBuffer} Random attribute buffer
     */
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$maxAttribute = options.maxAttributes,
        maxAttributes = _options$maxAttribute === void 0 ? 256 : _options$maxAttribute,
        _options$sensors = options.sensors,
        sensors = _options$sensors === void 0 ? 512 : _options$sensors,
        _options$neurons2 = options.neurons,
        neurons = _options$neurons2 === void 0 ? 512 : _options$neurons2,
        _options$actions = options.actions,
        actions = _options$actions === void 0 ? 512 : _options$actions;

      // Random target type
      var targetType = Math.floor(Math.random() * 4);

      // Random target ID based on type
      var maxTargetId;
      if (targetType === AttributeBase.TARGET_SENSOR) maxTargetId = sensors;else if (targetType === AttributeBase.TARGET_NEURON) maxTargetId = neurons;else if (targetType === AttributeBase.TARGET_ACTION) maxTargetId = actions;else maxTargetId = 1; // Global doesn't need specific ID

      return AttributeBase.toBitBuffer({
        type: 'attribute',
        attributeId: Math.floor(Math.random() * maxAttributes),
        value: Math.floor(Math.random() * 256),
        targetType: targetType,
        targetId: Math.floor(Math.random() * maxTargetId)
      });
    }

    /**
     * Get target type name
     * @param {number} targetType - Target type code
     * @returns {string} Type name
     */
  }, {
    key: "getTargetTypeName",
    value: function getTargetTypeName(targetType) {
      var names = ['sensor', 'neuron', 'action', 'global'];
      return names[targetType] || 'unknown';
    }

    /**
     * Get attribute name
     * @param {number} attributeId - Attribute ID
     * @returns {string} Attribute name
     */
  }, {
    key: "getAttributeName",
    value: function getAttributeName(attributeId) {
      var names = {
        0: 'energy',
        1: 'health',
        2: 'hunger',
        3: 'fear',
        4: 'curiosity',
        5: 'aggression',
        6: 'sociability',
        7: 'speed',
        8: 'strength',
        9: 'intelligence'
      };
      return names[attributeId] || "custom-".concat(attributeId);
    }

    /**
     * Get value as normalized float (0.0 - 1.0)
     * @param {number} value - Integer value (0-255)
     * @returns {number} Normalized value
     */
  }, {
    key: "valueToFloat",
    value: function valueToFloat(value) {
      return value / 255.0;
    }

    /**
     * Convert float to integer value
     * @param {number} floatValue - Float value (0.0 - 1.0)
     * @returns {number} Integer value (0-255)
     */
  }, {
    key: "floatToValue",
    value: function floatToValue(floatValue) {
      return Math.round(Math.max(0, Math.min(1, floatValue)) * 255);
    }

    /**
     * Apply attribute influence to action output
     * This is where attributes modify action behavior!
     * @param {Object} attribute - Attribute base
     * @param {number} actionOutput - Original action output value
     * @param {string} influenceMode - How to apply influence
     * @returns {number} Modified action output
     */
  }, {
    key: "applyActionInfluence",
    value: function applyActionInfluence(attribute, actionOutput) {
      var influenceMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'multiply';
      var normalizedValue = AttributeBase.valueToFloat(attribute.value);
      switch (influenceMode) {
        case 'multiply':
          // Attribute acts as multiplier
          // value=255 → 1.0x (no change)
          // value=128 → 0.5x (reduce by half)
          // value=0 → 0.0x (completely suppress)
          return actionOutput * normalizedValue;
        case 'add':
          // Attribute adds to output
          // value=128 → +0.0 (neutral, 128 is center)
          // value=255 → +0.5
          // value=0 → -0.5
          var delta = normalizedValue - 0.5;
          return Math.max(-1, Math.min(1, actionOutput + delta));
        case 'threshold':
          // Attribute acts as threshold gate
          // Only allow action if attribute > threshold
          var threshold = 0.5;
          var thresholdValue = AttributeBase.floatToValue(threshold);
          return attribute.value > thresholdValue ? actionOutput : 0;
        case 'boost':
          // Attribute boosts output
          // value=255 → 2.0x (double)
          // value=128 → 1.0x (no change)
          // value=0 → 0.0x (suppress)
          var boostFactor = normalizedValue * 2;
          return actionOutput * boostFactor;
        case 'sigmoid':
          // Attribute affects sigmoid curve
          // High value = easier to activate
          var shift = (normalizedValue - 0.5) * 2; // -1 to +1
          return 1 / (1 + Math.exp(-(actionOutput + shift)));
        default:
          return actionOutput;
      }
    }

    /**
     * Apply attribute influence to sensor input
     * @param {Object} attribute - Attribute base
     * @param {number} sensorInput - Original sensor input
     * @returns {number} Modified sensor input
     */
  }, {
    key: "applySensorInfluence",
    value: function applySensorInfluence(attribute, sensorInput) {
      var normalizedValue = AttributeBase.valueToFloat(attribute.value);
      // Sensor influence: scale input by attribute value
      return sensorInput * normalizedValue;
    }

    /**
     * Apply attribute influence to neuron activation
     * @param {Object} attribute - Attribute base
     * @param {number} neuronValue - Original neuron value
     * @returns {number} Modified neuron value
     */
  }, {
    key: "applyNeuronInfluence",
    value: function applyNeuronInfluence(attribute, neuronValue) {
      var normalizedValue = AttributeBase.valueToFloat(attribute.value);
      // Neuron influence: add bias based on attribute
      var bias = (normalizedValue - 0.5) * 0.5; // -0.25 to +0.25
      return Math.max(-1, Math.min(1, neuronValue + bias));
    }

    /**
     * Check if attribute affects a specific target
     * @param {Object} attribute - Attribute base
     * @param {string} targetType - 'sensor', 'neuron', or 'action'
     * @param {number} targetId - Target ID
     * @returns {boolean} True if attribute affects this target
     */
  }, {
    key: "affectsTarget",
    value: function affectsTarget(attribute, targetType, targetId) {
      // Global type affects everything of that kind
      if (attribute.targetType === AttributeBase.TARGET_GLOBAL) {
        // Global can affect all types (targetId is ignored)
        return true;
      }

      // Check specific target
      var expectedType = {
        'sensor': AttributeBase.TARGET_SENSOR,
        'neuron': AttributeBase.TARGET_NEURON,
        'action': AttributeBase.TARGET_ACTION
      }[targetType];
      return attribute.targetType === expectedType && attribute.targetId === targetId;
    }

    /**
     * Mutate attribute in-place
     * @param {BitBuffer} buffer - Buffer containing attribute
     * @param {number} position - Attribute position in buffer
     * @param {number} mutationRate - Mutation rate per bit
     */
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      // Bit-flip mutations
      for (var i = 0; i < AttributeBase.BIT_LENGTH; i++) {
        // Preserve type identifier bits (ensure attribute stays valid)
        if (i < 3) continue;
        if (Math.random() < mutationRate) {
          var currentBit = buffer.getBit(position + i);
          buffer.setBit(position + i, currentBit ? 0 : 1);
        }
      }

      // Re-enforce type bits in case mutation skipped due to rate
      buffer.writeBits(7, 3, position);
    }

    /**
     * Compare two attributes
     * @param {Object} base1 - First attribute
     * @param {Object} base2 - Second attribute
     * @returns {boolean} True if equal
     */
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== 'attribute' || base2.type !== 'attribute') {
        return false;
      }
      return base1.attributeId === base2.attributeId && base1.value === base2.value && base1.targetType === base2.targetType && base1.targetId === base2.targetId;
    }

    /**
     * Get attribute description
     * @param {Object} attribute - Attribute base
     * @returns {string} Human-readable description
     */
  }, {
    key: "getDescription",
    value: function getDescription(attribute) {
      var name = AttributeBase.getAttributeName(attribute.attributeId);
      var value = attribute.value;
      var targetTypeName = AttributeBase.getTargetTypeName(attribute.targetType);
      var targetId = attribute.targetType === AttributeBase.TARGET_GLOBAL ? 'all' : attribute.targetId;
      return "".concat(name, "=").concat(value, " \u2192 ").concat(targetTypeName, " #").concat(targetId);
    }
  }]);
  return AttributeBase;
}();
/**
 * Base - Binary implementation for maximum performance
 * Works directly with bits instead of string conversions
 * Supports connections, biases, attributes, and advanced base types
 */
// Bit length constant
_defineProperty(AttributeBase, "BIT_LENGTH", 30);
// Target type constants
_defineProperty(AttributeBase, "TARGET_SENSOR", 0);
_defineProperty(AttributeBase, "TARGET_NEURON", 1);
_defineProperty(AttributeBase, "TARGET_ACTION", 2);
_defineProperty(AttributeBase, "TARGET_GLOBAL", 3);
// Common attribute IDs (user-extensible)
_defineProperty(AttributeBase, "ATTR_ENERGY", 0);
_defineProperty(AttributeBase, "ATTR_HEALTH", 1);
_defineProperty(AttributeBase, "ATTR_HUNGER", 2);
_defineProperty(AttributeBase, "ATTR_FEAR", 3);
_defineProperty(AttributeBase, "ATTR_CURIOSITY", 4);
_defineProperty(AttributeBase, "ATTR_AGGRESSION", 5);
_defineProperty(AttributeBase, "ATTR_SOCIABILITY", 6);
_defineProperty(AttributeBase, "ATTR_SPEED", 7);
_defineProperty(AttributeBase, "ATTR_STRENGTH", 8);
_defineProperty(AttributeBase, "ATTR_INTELLIGENCE", 9);
var Base = /*#__PURE__*/function () {
  function Base() {
    _classCallCheck(this, Base);
  }
  _createClass(Base, null, [{
    key: "fromBitBuffer",
    value:
    /**
     * Parse base from BitBuffer
     * Much faster than string parsing
     * Supports all base types: connection, bias, attribute, evolved_neuron, learning_rule, etc.
     */
    function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Check if we have enough bits
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;
      if (position + 3 > totalBits) return null;

      // PARSING PRIORITY: Try basic bases first to avoid false positives!
      // Basic bases (connection/bias) are much more common than advanced bases
      // Trying advanced bases first causes false positives

      // Try basic parsing FIRST (connections and biases)
      // Read 5-bit config
      if (position + 5 > totalBits) return null;
      var configBits = buffer.readBits(5, position);
      var lastBit = configBits & 1;

      // Determine base type: connection (lastBit=0) or bias (lastBit=1)
      var type;
      var pattern = configBits & 31;

      // Special pattern for attribute: 11111 (all bits set)
      // BUT: We need to check if this is actually an attribute or a corrupted bias
      if (pattern === 31) {
        // Check the context: attributes are 20 bits, bias are 15 bits
        // If we have exactly 15 bits left or this looks like a bias, treat as bias
        var remainingBits = totalBits - position;
        if (remainingBits === 15) {
          // This is likely a corrupted bias (mutation created -7)
          type = 'bias';
        } else if (remainingBits >= 20) {
          // Check if next bits look like attribute pattern
          // Attributes have specific structure after the V marker
          type = 'attribute';
        } else {
          // Not enough bits for attribute, treat as corrupted bias
          type = 'bias';
        }
      } else if (lastBit === 0) {
        type = 'connection';
      } else {
        type = 'bias';
      }
      var base = {
        type: type,
        encoded: null
      };
      if (type === 'bias') {
        // Bias: 3 chars total = 15 bits
        // Check if we have enough bits
        if (position + 15 > totalBits) return null;

        // Extract data and sign from config
        var data = configBits >> 2 & 7; // 3 bits
        var sign = configBits >> 1 & 1; // 1 bit

        // If pattern was 11111 (V), this is a corrupted -7 bias
        if ((configBits & 31) === 31) {
          // This was a mutation that created -7, map it to -6
          base.data = -6;
        } else {
          // Normal bias processing
          base.data = sign ? -(data > 6 ? 6 : data) : data;
        }

        // Read target (10 bits)
        var targetBits = buffer.readBits(10, position + 5);
        var targetId = targetBits >> 2; // 8 bits
        var targetType = targetBits & 3; // 2 bits

        base.target = {
          id: targetId,
          type: ['sensor', 'neuron', 'action'][targetType] || 'neuron'
        };
        base.bitLength = 15;
      } else if (type === 'attribute') {
        // Attribute: 4 chars total = 20 bits
        // Check if we have enough bits
        if (position + 20 > totalBits) return null;

        // No data in config for attributes (all bits used for type identification)
        base.data = 0;

        // Read ID (8 bits)
        base.id = buffer.readBits(8, position + 5);

        // Read value (7 bits)
        base.value = buffer.readBits(7, position + 13);
        base.bitLength = 20;
      } else {
        // Connection: 5 chars total = 25 bits
        // Check if we have enough bits
        if (position + 25 > totalBits) return null;

        // Extract data from config
        base.data = configBits >> 1 & 15; // 4 bits

        // Read source (10 bits)
        var sourceBits = buffer.readBits(10, position + 5);
        var sourceId = sourceBits >> 1; // 9 bits
        var sourceType = sourceBits & 1; // 1 bit

        base.source = {
          id: sourceId,
          type: sourceType === 0 ? 'sensor' : 'neuron'
        };

        // Read target (10 bits)
        var _targetBits = buffer.readBits(10, position + 15);
        var _targetId = _targetBits >> 1; // 9 bits
        var _targetType = _targetBits & 1; // 1 bit

        base.target = {
          id: _targetId,
          type: _targetType === 0 ? 'neuron' : 'action'
        };
        base.bitLength = 25;
      }
      return base;
    }

    /**
     * Convert base to BitBuffer
     * Much faster than string conversion
     */
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      // Validate base has required type field
      if (!base || !base.type) {
        throw new Error('Base must have a type property');
      }
      if (base.type === 'attribute') {
        var buffer = new BitBuffer(20);

        // Config byte (5 bits): use special pattern 11111 for attribute
        var config = 31; // All bits set indicates attribute
        buffer.writeBits(config, 5);

        // ID (8 bits) - default to 0 if missing
        var id = base.id !== undefined ? base.id : 0;
        buffer.writeBits(id & 0xFF, 8);

        // Value (7 bits) - default to 0 if missing
        var value = base.value !== undefined ? base.value : 0;
        buffer.writeBits(value & 0x7F, 7);
        return buffer;
      } else if (base.type === 'bias') {
        var _buffer = new BitBuffer(15);

        // Validate target exists
        if (!base.target || base.target.id === undefined) {
          throw new Error('Bias base must have a valid target with id');
        }

        // Limit -7 to -6 to avoid 'V' conflict
        var data = base.data !== undefined ? base.data : 0;
        var limitedData = data === -7 ? -6 : data;

        // Config byte (5 bits)
        var absData = Math.abs(limitedData) & 7; // 3 bits
        var sign = limitedData < 0 ? 1 : 0; // 1 bit
        var typeBit = 1; // bias type
        var _config = absData << 2 | sign << 1 | typeBit;
        _buffer.writeBits(_config, 5);

        // Target (10 bits)
        var targetId = base.target.id & 0xFF; // 8 bits
        var targetType = 0;
        if (base.target.type === 'neuron') targetType = 1;else if (base.target.type === 'action') targetType = 2;
        var targetBits = targetId << 2 | targetType;
        _buffer.writeBits(targetBits, 10);
        return _buffer;
      } else {
        // Connection type (default)
        var _buffer2 = new BitBuffer(25);

        // Validate source and target exist
        if (!base.source || base.source.id === undefined) {
          throw new Error('Connection base must have a valid source with id');
        }
        if (!base.target || base.target.id === undefined) {
          throw new Error('Connection base must have a valid target with id');
        }

        // Config byte (5 bits)
        var _data = base.data !== undefined ? base.data : 0;
        var _typeBit = 0; // connection type
        var _config2 = (_data & 15) << 1 | _typeBit;
        _buffer2.writeBits(_config2, 5);

        // Source (10 bits)
        var sourceId = base.source.id & 0x1FF; // 9 bits
        var sourceType = base.source.type === 'neuron' ? 1 : 0;
        var sourceBits = sourceId << 1 | sourceType;
        _buffer2.writeBits(sourceBits, 10);

        // Target (10 bits)
        var _targetId2 = base.target.id & 0x1FF; // 9 bits
        var _targetType2 = base.target.type === 'action' ? 1 : 0;
        var _targetBits2 = _targetId2 << 1 | _targetType2;
        _buffer2.writeBits(_targetBits2, 10);
        return _buffer2;
      }
    }

    /**
     * Generate random base as BitBuffer
     * No string conversion needed
     */
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$neurons3 = options.neurons,
        neurons = _options$neurons3 === void 0 ? 10 : _options$neurons3,
        _options$sensors2 = options.sensors,
        sensors = _options$sensors2 === void 0 ? 10 : _options$sensors2,
        _options$actions2 = options.actions,
        actions = _options$actions2 === void 0 ? 10 : _options$actions2,
        _options$attributes = options.attributes,
        attributes = _options$attributes === void 0 ? 0 : _options$attributes,
        _options$attributeIds = options.attributeIds,
        attributeIds = _options$attributeIds === void 0 ? 0 : _options$attributeIds,
        _options$type = options.type,
        type = _options$type === void 0 ? null : _options$type;

      // If type is specified, generate that type
      if (type === 'attribute') {
        var maxIds = Math.min(16, attributeIds || attributes || 1); // Max 16 IDs (0-15)
        return Base.toBitBuffer({
          type: 'attribute',
          data: 0,
          // Not used in attribute
          id: Math.floor(Math.random() * maxIds),
          value: Math.floor(Math.random() * 128) // 7 bits max (0-127)
        });
      } else if (type === 'bias') {
        // Select target type first, then generate appropriate ID
        var targetType = ['sensor', 'neuron', 'action'][Math.floor(Math.random() * 3)];
        var maxId;
        if (targetType === 'sensor') maxId = sensors;else if (targetType === 'neuron') maxId = neurons;else maxId = actions;
        return Base.toBitBuffer({
          type: 'bias',
          data: Math.floor(Math.random() * 14) - 6,
          // -6 to 7 (avoiding -7 which conflicts with 'V')
          target: {
            id: Math.floor(Math.random() * maxId),
            type: targetType
          }
        });
      } else if (type === 'connection') {
        var useNeuronSource = Math.random() < 0.5;
        var useActionTarget = Math.random() < 0.5;
        return Base.toBitBuffer({
          type: 'connection',
          data: Math.floor(Math.random() * 16),
          // 0 to 15
          source: {
            id: Math.floor(Math.random() * (useNeuronSource ? neurons : sensors)),
            type: useNeuronSource ? 'neuron' : 'sensor'
          },
          target: {
            id: Math.floor(Math.random() * (useActionTarget ? actions : neurons)),
            type: useActionTarget ? 'action' : 'neuron'
          }
        });
      }

      // Random selection based on enabled features
      var rand = Math.random();

      // If attributes are enabled and no type specified
      var hasAttributes = attributeIds > 0;
      if (hasAttributes && rand < 0.15) {
        // 15% chance for attribute if enabled
        var _maxIds = Math.min(16, attributeIds || attributes || 1);
        return Base.toBitBuffer({
          type: 'attribute',
          data: 0,
          id: Math.floor(Math.random() * _maxIds),
          value: Math.floor(Math.random() * 128)
        });
      } else if (rand < 0.40) {
        // 25% chance for bias (or 40% if no attributes)
        // Select target type first, then generate appropriate ID
        var _targetType3 = ['sensor', 'neuron', 'action'][Math.floor(Math.random() * 3)];
        var _maxId;
        if (_targetType3 === 'sensor') _maxId = sensors;else if (_targetType3 === 'neuron') _maxId = neurons;else _maxId = actions;
        return Base.toBitBuffer({
          type: 'bias',
          data: Math.floor(Math.random() * 14) - 6,
          // -6 to 7 (avoiding -7)
          target: {
            id: Math.floor(Math.random() * _maxId),
            type: _targetType3
          }
        });
      } else {
        // Connection (remaining probability)
        var _useNeuronSource = Math.random() < 0.5;
        var _useActionTarget = Math.random() < 0.5;
        return Base.toBitBuffer({
          type: 'connection',
          data: Math.floor(Math.random() * 16),
          source: {
            id: Math.floor(Math.random() * (_useNeuronSource ? neurons : sensors)),
            type: _useNeuronSource ? 'neuron' : 'sensor'
          },
          target: {
            id: Math.floor(Math.random() * (_useActionTarget ? actions : neurons)),
            type: _useActionTarget ? 'action' : 'neuron'
          }
        });
      }
    }

    /**
     * Fast comparison without string conversion
     */
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== base2.type) return false;
      if (base1.data !== base2.data) return false;
      if (base1.type === 'bias') {
        return base1.target.id === base2.target.id && base1.target.type === base2.target.type;
      } else {
        return base1.source.id === base2.source.id && base1.source.type === base2.source.type && base1.target.id === base2.target.id && base1.target.type === base2.target.type;
      }
    }

    /**
     * Mutate base in-place (very fast)
     */
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      var baseBits = buffer.getBit(position + 4) === 0 ? 25 : 15;
      for (var i = 0; i < baseBits; i++) {
        if (Math.random() < mutationRate) {
          // Flip bit
          var currentBit = buffer.getBit(position + i);
          buffer.setBit(position + i, currentBit ? 0 : 1);
        }
      }
    }

    /**
     * String-based API compatibility methods
     */
  }, {
    key: "charToBin",
    value: function charToBin(_char) {
      return parseInt(_char, 32).toString(2).padStart(5, '0');
    }
  }, {
    key: "targetTypes",
    value: function targetTypes(_char2) {
      var typesArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return (typesArray || ['sensor', 'neuron', 'action'])[_char2] || 'neuron';
    }
  }, {
    key: "getTarget",
    value: function getTarget() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var typeSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var targetTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      // Optimize string operations - avoid split/join/split
      var binStr = '';
      for (var i = 0; i < str.length; i++) {
        binStr += this.charToBin(str[i]);
      }
      var idLen = binStr.length - typeSize;
      var idBits = binStr.substring(0, idLen);
      var typeBits = binStr.substring(idLen);
      return {
        id: parseInt(idBits, 2),
        type: this.targetTypes(parseInt(typeBits, 2), targetTypes)
      };
    }

    /**
     * Create base from string (compatibility)
     */
  }, {
    key: "fromString",
    value: function fromString() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (!str || str.length === 0) return null;
      var base = {
        encoded: str
      };
      var config = this.getConfig(base.encoded[0]);

      // Special handling for 'V' - could be attribute or corrupted bias
      if (base.encoded[0] === 'V') {
        // Check length to determine if it's attribute (4 chars) or bias (3 chars)
        if (str.length === 3 || str.length > 3 && str.length < 4) {
          // This is a corrupted bias (-7 that became V through mutation)
          base.type = 'bias';
          base.data = -6; // Map -7 to -6
          base.encoded = base.encoded.padEnd(3, '0');
          base.target = this.getTarget(base.encoded[1] + base.encoded[2], 2);
        } else {
          // This is an attribute
          base.type = 'attribute';
          base.data = 0;
          base.encoded = base.encoded.padEnd(4, '0');
          // Parse attribute ID and value
          var binStr = '';
          for (var i = 1; i < 4; i++) {
            binStr += this.charToBin(base.encoded[i] || '0');
          }
          base.id = parseInt(binStr.substring(0, 8), 2);
          base.value = parseInt(binStr.substring(8, 15), 2);
        }
      } else {
        base.type = config.type;
        base.data = config.data;
        if (base.type === 'bias') {
          base.encoded = base.encoded.padEnd(3, '0');
          base.target = this.getTarget(base.encoded[1] + base.encoded[2], 2);
        } else if (base.type === 'connection') {
          base.encoded = base.encoded.padEnd(5, '0');
          base.source = this.getTarget(base.encoded[1] + base.encoded[2], 1, ['sensor', 'neuron']);
          base.target = this.getTarget(base.encoded[3] + base.encoded[4], 1, ['neuron', 'action']);
        }
      }
      delete base.config;
      return base;
    }

    /**
     * Convert base to string (compatibility)
     */
  }, {
    key: "toString",
    value: function toString(base) {
      var str = '';
      if (base.type === 'bias') {
        // Limit -7 to -6 to avoid 'V' conflict
        var limitedData = base.data === -7 ? -6 : base.data;
        // config
        str += Math.abs(limitedData).toString(2).padStart(3, '0');
        if (limitedData >= 0) str += '0';else str += '1';
        str += '1';

        // target
        str += base.target.id.toString(2).padStart(8, '0');
        if (base.target.type === 'sensor') str += '00';else if (base.target.type === 'neuron') str += '01';else if (base.target.type === 'action') str += '10';else str += '01';
      } else if (base.type === 'connection') {
        // config
        str += Math.abs(base.data).toString(2).padStart(4, '0');
        str += '0';

        // source
        str += base.source.id.toString(2).padStart(9, '0');
        if (base.source.type === 'sensor') str += '0';else if (base.source.type === 'neuron') str += '1';else str += '1';

        // target
        str += base.target.id.toString(2).padStart(9, '0');
        if (base.target.type === 'neuron') str += '0';else if (base.target.type === 'action') str += '1';else str += '0';
      } else if (base.type === 'attribute') {
        // Special pattern for attribute
        str += '11111'; // All bits set for attribute type

        // attribute ID (8 bits)
        str += base.id.toString(2).padStart(8, '0');

        // attribute value (7 bits)
        str += base.value.toString(2).padStart(7, '0');
      }

      // Convert binary string to base32
      var chunks = [];
      for (var i = 0; i < str.length; i += 5) {
        chunks.push(str.substring(i, i + 5));
      }
      return chunks.map(function (chunk) {
        var padded = chunk.padEnd(5, '0');
        return parseInt(padded, 2).toString(32);
      }).join('').toUpperCase();
    }

    /**
     * Generate random base (compatibility)
     */
  }, {
    key: "random",
    value: function random() {
      var buffer = Base.randomBinary({
        neurons: 10,
        sensors: 10,
        actions: 10,
        attributes: 0
      });
      return Base.fromBitBuffer(buffer, 0);
    }

    /**
     * Generate random base with constraints (compatibility)
     */
  }, {
    key: "randomWith",
    value: function randomWith() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // Ensure options includes attributeIds if attributes is specified
      var enhancedOptions = _objectSpread({}, options);
      if (options.attributes && !options.attributeIds) {
        enhancedOptions.attributeIds = options.attributes;
      }
      var buffer = Base.randomBinary(enhancedOptions);
      return Base.fromBitBuffer(buffer, 0);
    }

    /**
     * Get config from char (compatibility)
     */
  }, {
    key: "getConfig",
    value: function getConfig(_char3) {
      // Take only first character if multiple provided
      var firstChar = (_char3 || '0')[0];
      var bits = parseInt(firstChar, 32).toString(2).padStart(5, '0');
      var binValue = parseInt(bits, 2);
      var type, data;

      // Check for attribute pattern (all bits set = 31 in decimal = 'V' in base32)
      if (binValue === 31) {
        type = 'attribute';
        data = 0;
      } else if ((binValue & 1) === 0) {
        type = 'connection';
        data = binValue >> 1 & 15;
      } else {
        type = 'bias';
        var absData = binValue >> 2 & 7;
        var sign = binValue >> 1 & 1;
        // Note: -7 would conflict with attribute marker 'V', so we limit to -6
        data = sign ? -(absData > 6 ? 6 : absData) : absData;
      }
      return {
        type: type,
        data: data
      };
    }
  }]);
  return Base;
}();
var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = _typeof(global$1) == 'object' && global$1 && global$1.Object === Object && global$1;

/** Detect free variable `self`. */
var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var _Symbol = root.Symbol;

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$e.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$b.call(value, symToStringTag$1),
    tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$d.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && _typeof(value) == 'object';
}

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return _typeof(value) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length,
    result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
  symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$2 ? '-0' : result;
}

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0,
  MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$1 || value === -INFINITY$1) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
    remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity$1(value) {
  return value;
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
  funcTag$1 = '[object Function]',
  genTag = '[object GeneratorFunction]',
  proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
  objectProto$c = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$c.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$a).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');
var WeakMap$1 = WeakMap;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = function () {
  function object() {}
  return function (proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
    length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
  HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
    lastCalled = 0;
  return function () {
    var stamp = nativeNow(),
      remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function () {
    return value;
  };
}
var defineProperty = function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity$1 : function (func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};
var baseSetToString$1 = baseSetToString;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString$1);

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = _typeof(value);
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$9.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
    length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax$1(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
      index = -1,
      length = nativeMax$1(args.length - start, 0),
      array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity$1), func + '');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = _typeof(index);
  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function (object, sources) {
    var index = -1,
      length = sources.length,
      customizer = length > 1 ? sources[length - 1] : undefined,
      guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$a;
  return value === proto;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
    result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$2;
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty$8.call(value, 'callee') && !propertyIsEnumerable$1.call(value, 'callee');
};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports$2 = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && (typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
  arrayTag$1 = '[object Array]',
  boolTag$1 = '[object Boolean]',
  dateTag$1 = '[object Date]',
  errorTag$1 = '[object Error]',
  funcTag = '[object Function]',
  mapTag$2 = '[object Map]',
  numberTag$1 = '[object Number]',
  objectTag$3 = '[object Object]',
  regexpTag$1 = '[object RegExp]',
  setTag$2 = '[object Set]',
  stringTag$1 = '[object String]',
  weakMapTag$1 = '[object WeakMap]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
  dataViewTag$2 = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && (typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;
    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
    isArg = !isArr && isArguments(value),
    isBuff = !isArr && !isArg && isBuffer(value),
    isType = !isArr && !isArg && !isBuff && isTypedArray(value),
    skipIndexes = isArr || isArg || isBuff || isType,
    result = skipIndexes ? baseTimes(value.length, String) : [],
    length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
    result = [];
  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$5.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = _typeof(value);
  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$4.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
    index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map$1 || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = _typeof(value);
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
    size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
    length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function memoized() {
    var args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function (string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0,
    length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
    length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/** `Object#toString` result references. */
var objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
  objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject$1(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$2) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
    length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
  nativeMax = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
    resIndex = 0,
    result = Array(nativeCeil(length / size));
  while (index < length) {
    result[resIndex++] = baseSlice(array, index, index += size);
  }
  return result;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
    result = data['delete'](key);
  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/** Detect free variable `exports`. */
var freeExports = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && (typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
  allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
    result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length,
    resIndex = 0,
    result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
var getSymbols$1 = getSymbols;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols$1);
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');
var DataView$1 = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root, 'Promise');
var Promise$2 = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = getNative(root, 'Set');
var Set$2 = Set$1;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
  objectTag$1 = '[object Object]',
  promiseTag = '[object Promise]',
  setTag$1 = '[object Set]',
  weakMapTag = '[object WeakMap]';
var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView$1),
  mapCtorString = toSource(Map$1),
  promiseCtorString = toSource(Promise$2),
  setCtorString = toSource(Set$2),
  weakMapCtorString = toSource(WeakMap$1);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1 || Map$1 && getTag(new Map$1()) != mapTag$1 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$1 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = baseGetTag(value),
      Ctor = result == objectTag$1 ? value.constructor : undefined,
      ctorString = Ctor ? toSource(Ctor) : '';
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$1;
        case mapCtorString:
          return mapTag$1;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$1;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}
var getTag$1 = getTag;

/** Built-in value references. */
var Uint8Array$1 = root.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
    length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
    length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
  COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
    arrLength = array.length,
    othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
    result = true,
    seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : undefined;
  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
      othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
    result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
    result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
  COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]';
var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);
    case errorTag:
      return object.name == other.name && object.message == other.message;
    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';
    case mapTag:
      var convert = mapToArray;
    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
    objProps = getAllKeys(object),
    objLength = objProps.length,
    othProps = getAllKeys(other),
    othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
      othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
      othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
    othIsArr = isArray(other),
    objTag = objIsArr ? arrayTag : getTag$1(object),
    othTag = othIsArr ? arrayTag : getTag$1(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag,
    othIsObj = othTag == objectTag,
    isSameTag = objTag == othTag;
  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
      othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
        othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
  COMPARE_UNORDERED_FLAG$1 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
    length = index,
    noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
      objValue = object[key],
      srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
    length = result.length;
  while (length--) {
    var key = result[length],
      value = object[key];
    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);
  var index = -1,
    length = path.length,
    result = false;
  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function (object) {
    var objValue = get(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity$1;
  }
  if (_typeof(value) == 'object') {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
      iterable = Object(object),
      props = keysFunc(object),
      length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
      index = fromRight ? length : -1,
      iterable = Object(collection);
    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }
  if (key == '__proto__') {
    return;
  }
  return object[key];
}

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
    srcValue = safeGet(source, key),
    stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
  var isCommon = newValue === undefined;
  if (isCommon) {
    var isArr = isArray(srcValue),
      isBuff = !isArr && isBuffer(srcValue),
      isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject$1(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function (srcValue, key) {
    stack || (stack = new Stack());
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined;
      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
    result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function (object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;
  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
      valIsNull = value === null,
      valIsReflexive = value === value,
      valIsSymbol = isSymbol(value);
    var othIsDefined = other !== undefined,
      othIsNull = other === null,
      othIsReflexive = other === other,
      othIsSymbol = isSymbol(other);
    if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
      return 1;
    }
    if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
    objCriteria = object.criteria,
    othCriteria = other.criteria,
    length = objCriteria.length,
    ordersLength = orders.length;
  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  if (iteratees.length) {
    iteratees = arrayMap(iteratees, function (iteratee) {
      if (isArray(iteratee)) {
        return function (value) {
          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
        };
      }
      return iteratee;
    });
  } else {
    iteratees = [identity$1];
  }
  var index = -1;
  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
  var result = baseMap(collection, function (value, key, collection) {
    var criteria = arrayMap(iteratees, function (iteratee) {
      return iteratee(value);
    });
    return {
      'criteria': criteria,
      'index': ++index,
      'value': value
    };
  });
  return baseSortBy(result, function (object, other) {
    return compareMultiple(object, other, orders);
  });
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
  nativeRandom$1 = Math.random;

/**
 * The base implementation of `_.random` without support for returning
 * floating-point numbers.
 *
 * @private
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the random number.
 */
function baseRandom(lower, upper) {
  return lower + nativeFloor(nativeRandom$1() * (upper - lower + 1));
}

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min,
  nativeRandom = Math.random;

/**
 * Produces a random number between the inclusive `lower` and `upper` bounds.
 * If only one argument is provided a number between `0` and the given number
 * is returned. If `floating` is `true`, or either `lower` or `upper` are
 * floats, a floating-point number is returned instead of an integer.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Number
 * @param {number} [lower=0] The lower bound.
 * @param {number} [upper=1] The upper bound.
 * @param {boolean} [floating] Specify returning a floating-point number.
 * @returns {number} Returns the random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(lower, upper, floating) {
  if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
    upper = floating = undefined;
  }
  if (floating === undefined) {
    if (typeof upper == 'boolean') {
      floating = upper;
      upper = undefined;
    } else if (typeof lower == 'boolean') {
      floating = lower;
      lower = undefined;
    }
  }
  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  } else {
    lower = toFinite(lower);
    if (upper === undefined) {
      upper = lower;
      lower = 0;
    } else {
      upper = toFinite(upper);
    }
  }
  if (lower > upper) {
    var temp = lower;
    lower = upper;
    upper = temp;
  }
  if (floating || lower % 1 || upper % 1) {
    var rand = nativeRandom();
    return nativeMin(lower + rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1))), upper);
  }
  return baseRandom(lower, upper);
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 30 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
 */
var sortBy = baseRest(function (collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

/**
 * EvolvedNeuronBase - Bit-level encoding for programmable neurons
 *
 * Layout:
 * [type:3=0b101][sentinel:4=0b1110][targetId:10][mode:2][numOps:5][op1:6]...[opN:6]
 *
 * - type identifies programmable neurons within the genome stream
 * - sentinel prevents false positives when scanning mixed base types
 * - targetId marks the neuron that will receive the custom tick
 * - mode defines how opcode output combines with the classical input
 * - numOps is the number of primitive opcodes encoded (1-32)
 */

var TYPE_ID = 5;
var SENTINEL = 14;
var HEADER_BITS = 24;
var MAX_OPS = 32;
var EvolvedNeuronModes = {
  REPLACE: 0,
  ADD: 1,
  PASS_THROUGH: 2
};
var clamp = function clamp(value) {
  if (!Number.isFinite(value)) return 0;
  if (Number.isNaN(value)) return 0;
  if (value === Infinity) return 1;
  if (value === -Infinity) return -1;
  return value;
};
var distance = function distance(a, b) {
  if (!a || !b) return 0;
  var dx = (a.x || 0) - (b.x || 0);
  var dy = (a.y || 0) - (b.y || 0);
  return Math.sqrt(dx * dx + dy * dy);
};
var toBinary = function toBinary(condition) {
  return condition ? 1 : 0;
};
var PRIMITIVES = [{
  name: 'NEURON_INPUT',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.rawInput;
  }
}, {
  name: 'NEURON_BIASED',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.biasedInput;
  }
}, {
  name: 'NEURON_BIAS',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.bias;
  }
}, {
  name: 'INPUT_COUNT',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.inputs.length;
  }
}, {
  name: 'IN_0',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(0);
  }
}, {
  name: 'IN_1',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(1);
  }
}, {
  name: 'IN_2',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(2);
  }
}, {
  name: 'IN_3',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(3);
  }
}, {
  name: 'IN_4',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(4);
  }
}, {
  name: 'IN_5',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(5);
  }
}, {
  name: 'IN_6',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(6);
  }
}, {
  name: 'IN_7',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getInputValue(7);
  }
}, {
  name: 'INPUT_MAX',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.inputs.length ? Math.max.apply(Math, _toConsumableArray(ctx.inputs)) : 0;
  }
}, {
  name: 'INPUT_MIN',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.inputs.length ? Math.min.apply(Math, _toConsumableArray(ctx.inputs)) : 0;
  }
}, {
  name: 'INPUT_SUM_ABS',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.inputs.reduce(function (acc, v) {
      return acc + Math.abs(v);
    }, 0);
  }
}, {
  name: 'INPUT_AVG',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.inputs.length ? ctx.inputs.reduce(function (acc, v) {
      return acc + v;
    }, 0) / ctx.inputs.length : 0;
  }
}, {
  name: 'INPUT_RMS',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.inputs.length ? Math.sqrt(ctx.inputs.reduce(function (acc, v) {
      return acc + v * v;
    }, 0) / ctx.inputs.length) : 0;
  }
}, {
  name: 'MEMORY_SELF',
  arity: 0,
  fn: function fn(ctx) {
    return ctx.getMemoryCellValue ? ctx.getMemoryCellValue(ctx.neuron.metadata.id) : 0;
  }
}, {
  name: 'ME_X',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$individual;
    return ((_ctx$individual = ctx.individual) === null || _ctx$individual === void 0 ? void 0 : _ctx$individual.x) || 0;
  }
}, {
  name: 'ME_Y',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$individual2;
    return ((_ctx$individual2 = ctx.individual) === null || _ctx$individual2 === void 0 ? void 0 : _ctx$individual2.y) || 0;
  }
}, {
  name: 'ME_ENERGY',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$individual3;
    return ((_ctx$individual3 = ctx.individual) === null || _ctx$individual3 === void 0 ? void 0 : _ctx$individual3.energy) || 0;
  }
}, {
  name: 'TARGET_X',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$target;
    return ((_ctx$target = ctx.target) === null || _ctx$target === void 0 ? void 0 : _ctx$target.x) || 0;
  }
}, {
  name: 'TARGET_Y',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$target2;
    return ((_ctx$target2 = ctx.target) === null || _ctx$target2 === void 0 ? void 0 : _ctx$target2.y) || 0;
  }
}, {
  name: 'DISTANCE_TO_TARGET',
  arity: 0,
  fn: function fn(ctx) {
    return distance(ctx.individual, ctx.target);
  }
}, {
  name: 'DISTANCE_TO_CENTER',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$world, _ctx$individual4, _ctx$individual5;
    var center = (((_ctx$world = ctx.world) === null || _ctx$world === void 0 ? void 0 : _ctx$world.size) || 0) / 2;
    var dx = (((_ctx$individual4 = ctx.individual) === null || _ctx$individual4 === void 0 ? void 0 : _ctx$individual4.x) || 0) - center;
    var dy = (((_ctx$individual5 = ctx.individual) === null || _ctx$individual5 === void 0 ? void 0 : _ctx$individual5.y) || 0) - center;
    return Math.sqrt(dx * dx + dy * dy);
  }
}, {
  name: 'WORLD_SIZE',
  arity: 0,
  fn: function fn(ctx) {
    var _ctx$world2;
    return ((_ctx$world2 = ctx.world) === null || _ctx$world2 === void 0 ? void 0 : _ctx$world2.size) || 0;
  }
}, {
  name: 'ADD',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return a + b;
  }
}, {
  name: 'SUB',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return a - b;
  }
}, {
  name: 'MUL',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return a * b;
  }
}, {
  name: 'DIV',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return b !== 0 ? a / b : 0;
  }
}, {
  name: 'MOD',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return b !== 0 ? a % b : 0;
  }
}, {
  name: 'MAX',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return Math.max(a, b);
  }
}, {
  name: 'MIN',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return Math.min(a, b);
  }
}, {
  name: 'AVG2',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return (a + b) / 2;
  }
}, {
  name: 'GT',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a > b);
  }
}, {
  name: 'LT',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a < b);
  }
}, {
  name: 'GTE',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a >= b);
  }
}, {
  name: 'LTE',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a <= b);
  }
}, {
  name: 'EQ',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a === b);
  }
}, {
  name: 'NEQ',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a !== b);
  }
}, {
  name: 'AND',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a && b);
  }
}, {
  name: 'OR',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(a || b);
  }
}, {
  name: 'XOR',
  arity: 2,
  fn: function fn(_ctx, a, b) {
    return toBinary(Boolean(a) !== Boolean(b));
  }
}, {
  name: 'NOT',
  arity: 1,
  fn: function fn(_ctx, a) {
    return toBinary(!a);
  }
}, {
  name: 'ABS',
  arity: 1,
  fn: function fn(_ctx, a) {
    return Math.abs(a);
  }
}, {
  name: 'NEG',
  arity: 1,
  fn: function fn(_ctx, a) {
    return -a;
  }
}, {
  name: 'SIGN',
  arity: 1,
  fn: function fn(_ctx, a) {
    return Math.sign(a);
  }
}, {
  name: 'SQRT',
  arity: 1,
  fn: function fn(_ctx, a) {
    return a >= 0 ? Math.sqrt(a) : 0;
  }
}, {
  name: 'CLAMP_NEG1_1',
  arity: 1,
  fn: function fn(_ctx, a) {
    return Math.max(-1, Math.min(1, a));
  }
}, {
  name: 'CLAMP_0_1',
  arity: 1,
  fn: function fn(_ctx, a) {
    return Math.max(0, Math.min(1, a));
  }
}, {
  name: 'TANH',
  arity: 1,
  fn: function fn(_ctx, a) {
    return Math.tanh(a);
  }
}, {
  name: 'SIGMOID',
  arity: 1,
  fn: function fn(_ctx, a) {
    return 1 / (1 + Math.exp(-a));
  }
}, {
  name: 'STEP_POSITIVE',
  arity: 1,
  fn: function fn(_ctx, a) {
    return toBinary(a > 0);
  }
}, {
  name: 'SELECT',
  arity: 3,
  fn: function fn(_ctx, condition, whenTrue, whenFalse) {
    return condition ? whenTrue : whenFalse;
  }
}, {
  name: 'CONST_NEG1',
  arity: 0,
  fn: function fn() {
    return -1;
  }
}, {
  name: 'CONST_NEG0_5',
  arity: 0,
  fn: function fn() {
    return -0.5;
  }
}, {
  name: 'CONST_0',
  arity: 0,
  fn: function fn() {
    return 0;
  }
}, {
  name: 'CONST_0_5',
  arity: 0,
  fn: function fn() {
    return 0.5;
  }
}, {
  name: 'CONST_1',
  arity: 0,
  fn: function fn() {
    return 1;
  }
}, {
  name: 'CONST_2',
  arity: 0,
  fn: function fn() {
    return 2;
  }
}, {
  name: 'CONST_5',
  arity: 0,
  fn: function fn() {
    return 5;
  }
}, {
  name: 'CONST_10',
  arity: 0,
  fn: function fn() {
    return 10;
  }
}, {
  name: 'CONST_50',
  arity: 0,
  fn: function fn() {
    return 50;
  }
}, {
  name: 'CONST_100',
  arity: 0,
  fn: function fn() {
    return 100;
  }
}];
var PRIMITIVE_NAMES = PRIMITIVES.map(function (p) {
  return p.name;
});
var EvolvedNeuronBase = /*#__PURE__*/function () {
  function EvolvedNeuronBase() {
    _classCallCheck(this, EvolvedNeuronBase);
  }
  _createClass(EvolvedNeuronBase, null, [{
    key: "modeCount",
    get: function get() {
      return Object.keys(EvolvedNeuronModes).length;
    }
  }, {
    key: "primitivesList",
    get: function get() {
      return PRIMITIVE_NAMES;
    }
  }, {
    key: "resolveMode",
    value: function resolveMode(mode) {
      if (mode === undefined || mode === null) return EvolvedNeuronModes.REPLACE;
      if (mode < 0) return EvolvedNeuronModes.REPLACE;
      if (mode >= this.modeCount) return EvolvedNeuronModes.REPLACE;
      return mode;
    }
  }, {
    key: "fromBitBuffer",
    value: function fromBitBuffer(buffer) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var totalBits = buffer.bitLength || buffer.buffer.length * 8;
      if (position + HEADER_BITS > totalBits) return null;
      var typeId = buffer.readBits(3, position);
      if (typeId !== TYPE_ID) return null;
      var sentinel = buffer.readBits(4, position + 3);
      if (sentinel !== SENTINEL) return null;
      var targetId = buffer.readBits(10, position + 7);
      var mode = this.resolveMode(buffer.readBits(2, position + 17));
      var numOps = buffer.readBits(5, position + 19);
      var bitLength = HEADER_BITS + numOps * 6;
      if (position + bitLength > totalBits) return null;
      var operationIds = [];
      for (var i = 0; i < numOps; i++) {
        var opId = buffer.readBits(6, position + HEADER_BITS + i * 6);
        operationIds.push(opId);
      }
      return {
        type: 'evolved_neuron',
        targetId: targetId,
        mode: mode,
        numOps: numOps,
        operationIds: operationIds,
        bitLength: bitLength,
        data: null
      };
    }
  }, {
    key: "toBitBuffer",
    value: function toBitBuffer(base) {
      var operationIds = base.operationIds || [];
      var numOps = Math.min(operationIds.length, MAX_OPS);
      var bitLength = HEADER_BITS + numOps * 6;
      var buffer = new BitBuffer(bitLength);
      buffer.writeBits(TYPE_ID, 3);
      buffer.writeBits(SENTINEL, 4, 3);
      buffer.writeBits(base.targetId & 1023, 10, 7);
      buffer.writeBits(this.resolveMode(base.mode), 2, 17);
      buffer.writeBits(numOps & 31, 5, 19);
      for (var i = 0; i < numOps; i++) {
        var opId = operationIds[i] & 63;
        buffer.writeBits(opId, 6, HEADER_BITS + i * 6);
      }
      return buffer;
    }
  }, {
    key: "randomBinary",
    value: function randomBinary() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$minOps = options.minOps,
        minOps = _options$minOps === void 0 ? 3 : _options$minOps,
        _options$maxOps = options.maxOps,
        maxOps = _options$maxOps === void 0 ? 8 : _options$maxOps,
        _options$numPrimitive = options.numPrimitives,
        numPrimitives = _options$numPrimitive === void 0 ? PRIMITIVES.length : _options$numPrimitive,
        _options$maxNeuronId = options.maxNeuronId,
        maxNeuronId = _options$maxNeuronId === void 0 ? 1023 : _options$maxNeuronId,
        _options$mode = options.mode,
        mode = _options$mode === void 0 ? null : _options$mode;
      var numOps = Math.max(minOps, Math.min(maxOps, minOps + Math.floor(Math.random() * (maxOps - minOps + 1))));
      var operationIds = [];
      for (var i = 0; i < numOps; i++) {
        operationIds.push(Math.floor(Math.random() * numPrimitives));
      }
      return EvolvedNeuronBase.toBitBuffer({
        type: 'evolved_neuron',
        targetId: Math.floor(Math.random() * (maxNeuronId + 1)),
        mode: mode === null ? Math.floor(Math.random() * this.modeCount) : this.resolveMode(mode),
        operationIds: operationIds
      });
    }
  }, {
    key: "getOperationNames",
    value: function getOperationNames(operationIds) {
      return operationIds.map(function (id) {
        return PRIMITIVE_NAMES[id] || 'UNKNOWN';
      });
    }
  }, {
    key: "fromOperations",
    value: function fromOperations(operations) {
      var operationIds = operations.map(function (opName) {
        var id = PRIMITIVE_NAMES.indexOf(opName);
        if (id === -1) {
          throw new Error("Unknown operation: ".concat(opName));
        }
        return id;
      });
      return EvolvedNeuronBase.toBitBuffer({
        type: 'evolved_neuron',
        targetId: 0,
        mode: EvolvedNeuronModes.REPLACE,
        operationIds: operationIds
      });
    }
  }, {
    key: "calculateBitLength",
    value: function calculateBitLength(numOps) {
      return HEADER_BITS + numOps * 6;
    }
  }, {
    key: "mutateBinary",
    value: function mutateBinary(buffer, position) {
      var mutationRate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var _options$maxNeuronId2 = options.maxNeuronId,
        maxNeuronId = _options$maxNeuronId2 === void 0 ? 255 : _options$maxNeuronId2,
        _options$numPrimitive2 = options.numPrimitives,
        numPrimitives = _options$numPrimitive2 === void 0 ? PRIMITIVES.length : _options$numPrimitive2;
      var currentOps = buffer.readBits(5, position + 19);
      if (Math.random() < mutationRate * 4) {
        var target = buffer.readBits(10, position + 7);
        var delta = (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 4);
        var nextTarget = Math.max(0, Math.min(maxNeuronId, target + delta));
        buffer.writeBits(nextTarget, 10, position + 7);
      }
      if (Math.random() < mutationRate * 4) {
        var newMode = Math.floor(Math.random() * this.modeCount);
        buffer.writeBits(newMode, 2, position + 17);
      }
      for (var i = 0; i < currentOps; i++) {
        if (Math.random() < mutationRate) {
          var opPos = position + HEADER_BITS + i * 6;
          buffer.writeBits(Math.floor(Math.random() * numPrimitives) & 63, 6, opPos);
        }
      }
      if (currentOps < MAX_OPS && Math.random() < mutationRate * 0.5) {
        var newOp = Math.floor(Math.random() * numPrimitives) & 63;
        buffer.writeBits(newOp, 6, position + HEADER_BITS + currentOps * 6);
        buffer.writeBits(currentOps + 1, 5, position + 19);
      }
    }
  }, {
    key: "equals",
    value: function equals(base1, base2) {
      if (base1.type !== 'evolved_neuron' || base2.type !== 'evolved_neuron') return false;
      if (base1.targetId !== base2.targetId) return false;
      if (this.resolveMode(base1.mode) !== this.resolveMode(base2.mode)) return false;
      if (base1.numOps !== base2.numOps) return false;
      for (var i = 0; i < base1.numOps; i++) {
        if (base1.operationIds[i] !== base2.operationIds[i]) return false;
      }
      return true;
    }
  }, {
    key: "execute",
    value: function execute(base, context) {
      var _context$rawInput, _context$biasedInput, _context$bias, _context$environment, _context$environment2, _context$environment3;
      if (!base || !Array.isArray(base.operationIds)) return 0;
      var maxOps = Math.min(base.operationIds.length, MAX_OPS);
      var stack = [];
      var safeContext = _objectSpread(_objectSpread({}, context), {}, {
        rawInput: (_context$rawInput = context.rawInput) !== null && _context$rawInput !== void 0 ? _context$rawInput : 0,
        biasedInput: (_context$biasedInput = context.biasedInput) !== null && _context$biasedInput !== void 0 ? _context$biasedInput : 0,
        bias: (_context$bias = context.bias) !== null && _context$bias !== void 0 ? _context$bias : 0,
        inputs: context.inputs || [],
        individual: context.individual || ((_context$environment = context.environment) === null || _context$environment === void 0 ? void 0 : _context$environment.me) || null,
        target: ((_context$environment2 = context.environment) === null || _context$environment2 === void 0 ? void 0 : _context$environment2.target) || null,
        world: ((_context$environment3 = context.environment) === null || _context$environment3 === void 0 ? void 0 : _context$environment3.world) || null,
        getInputValue: function getInputValue(index) {
          if (!context.inputs || index < 0 || index >= context.inputs.length) return 0;
          return context.inputs[index];
        }
      });
      for (var i = 0; i < maxOps; i++) {
        var opId = base.operationIds[i];
        var primitive = PRIMITIVES[opId];
        if (!primitive) continue;
        try {
          if (primitive.arity === 0) {
            stack.push(clamp(primitive.fn(safeContext)));
          } else if (primitive.arity === 1) {
            var _stack$pop;
            var a = (_stack$pop = stack.pop()) !== null && _stack$pop !== void 0 ? _stack$pop : 0;
            stack.push(clamp(primitive.fn(safeContext, a)));
          } else if (primitive.arity === 2) {
            var _stack$pop2, _stack$pop3;
            var b = (_stack$pop2 = stack.pop()) !== null && _stack$pop2 !== void 0 ? _stack$pop2 : 0;
            var _a = (_stack$pop3 = stack.pop()) !== null && _stack$pop3 !== void 0 ? _stack$pop3 : 0;
            stack.push(clamp(primitive.fn(safeContext, _a, b)));
          } else if (primitive.arity === 3) {
            var _stack$pop4, _stack$pop5, _stack$pop6;
            var c = (_stack$pop4 = stack.pop()) !== null && _stack$pop4 !== void 0 ? _stack$pop4 : 0;
            var _b = (_stack$pop5 = stack.pop()) !== null && _stack$pop5 !== void 0 ? _stack$pop5 : 0;
            var _a2 = (_stack$pop6 = stack.pop()) !== null && _stack$pop6 !== void 0 ? _stack$pop6 : 0;
            stack.push(clamp(primitive.fn(safeContext, _a2, _b, c)));
          }
        } catch (_err) {
          return stack.length ? clamp(stack[stack.length - 1]) : 0;
        }
      }
      return stack.length ? clamp(stack[stack.length - 1]) : 0;
    }
  }]);
  return EvolvedNeuronBase;
}();
function md5(_x) {
  return _md.apply(this, arguments);
}
/**
 * Genome - High-performance binary genome implementation
 * 10-100x faster than string-based implementation
 * Optimized for memory efficiency and parsing speed
 */
function _md() {
  _md = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(str) {
    var crypto, encoder, data, hashBuffer, hashArray;
    return _regeneratorRuntime().wrap(function _callee7$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (!(typeof window === 'undefined')) {
            _context12.next = 4;
            break;
          }
          _context12.next = 3;
          return Promise.resolve().then(function () {
            return empty$1;
          });
        case 3:
          crypto = _context12.sent;
        case 4:
          if (!(typeof window !== 'undefined' && window.crypto)) {
            _context12.next = 14;
            break;
          }
          encoder = new TextEncoder();
          data = encoder.encode(str);
          _context12.next = 9;
          return window.crypto.subtle.digest('MD5', data);
        case 9:
          hashBuffer = _context12.sent;
          hashArray = Array.from(new Uint8Array(hashBuffer));
          return _context12.abrupt("return", hashArray.map(function (_byte) {
            return _byte.toString(16).padStart(2, '0');
          }).join(''));
        case 14:
          if (!crypto) {
            _context12.next = 16;
            break;
          }
          return _context12.abrupt("return", crypto.createHash('md5').update(str).digest('hex'));
        case 16:
          throw new Error('Unsupported environment for MD5 hashing');
        case 17:
        case "end":
          return _context12.stop();
      }
    }, _callee7);
  }));
  return _md.apply(this, arguments);
}
var Genome = /*#__PURE__*/function () {
  function Genome() {
    var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _classCallCheck(this, Genome);
    this.buffer = buffer || new BitBuffer();
    this._basesCache = null; // Lazy load cache
  }

  /**
   * Create from various sources
   */
  _createClass(Genome, [{
    key: "getBases",
    value:
    /**
     * Get bases (lazy parsing with cache)
     * Use this when you need ALL bases
     */
    function getBases() {
      if (this._basesCache) return this._basesCache;
      var bases = [];
      var _iterator = _createForOfIteratorHelper(this.iterBases()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var base = _step.value;
          bases.push(base);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this._basesCache = bases;
      return bases;
    }

    /**
     * Iterate over bases lazily (generator)
     * Use this for memory-efficient iteration
     * Much faster than getBases() when you only need a subset
     *
     * @generator
    * @yields {Object} Base object
    */
  }, {
    key: "iterBases",
    value:
    /*#__PURE__*/
    _regeneratorRuntime().mark(function iterBases() {
      var position, totalBits, advancedParsers, parsed, _iterator2, _step2, Parser, base;
      return _regeneratorRuntime().wrap(function iterBases$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            position = 0;
            totalBits = this.buffer.bitLength || this.buffer.buffer.length * 8;
            advancedParsers = [EvolvedNeuronBase, ModuleBase, MemoryCellBase, PlasticityBase, LearningRuleBase];
          case 3:
            if (!(position < totalBits - 3)) {
              _context.next = 36;
              break;
            }
            // Need at least 3 bits for type
            parsed = null;
            _iterator2 = _createForOfIteratorHelper(advancedParsers);
            _context.prev = 6;
            _iterator2.s();
          case 8:
            if ((_step2 = _iterator2.n()).done) {
              _context.next = 15;
              break;
            }
            Parser = _step2.value;
            parsed = Parser.fromBitBuffer(this.buffer, position);
            if (!parsed) {
              _context.next = 13;
              break;
            }
            return _context.abrupt("break", 15);
          case 13:
            _context.next = 8;
            break;
          case 15:
            _context.next = 20;
            break;
          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](6);
            _iterator2.e(_context.t0);
          case 20:
            _context.prev = 20;
            _iterator2.f();
            return _context.finish(20);
          case 23:
            if (!parsed) {
              _context.next = 28;
              break;
            }
            _context.next = 26;
            return parsed;
          case 26:
            position += parsed.bitLength;
            return _context.abrupt("continue", 3);
          case 28:
            base = Base.fromBitBuffer(this.buffer, position);
            if (base) {
              _context.next = 31;
              break;
            }
            return _context.abrupt("break", 36);
          case 31:
            _context.next = 33;
            return base;
          case 33:
            position += base.bitLength;
            _context.next = 3;
            break;
          case 36:
          case "end":
            return _context.stop();
        }
      }, iterBases, this, [[6, 17, 20, 23]]);
    })
    /**
     * Get only bases of specific type (selective parsing)
     * 10x faster than getBases().filter()
     *
     * @param {string} type - Base type: 'connection', 'bias', 'evolved_neuron',
     *                        'learning_rule', 'memory_cell', 'module', 'plasticity', 'attribute'
     * @returns {Array<Object>} Bases of specified type
     */
  }, {
    key: "getBasesByType",
    value: function getBasesByType(type) {
      var bases = [];
      var _iterator3 = _createForOfIteratorHelper(this.iterBases()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var base = _step3.value;
          if (base.type === type) {
            bases.push(base);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return bases;
    }

    /**
     * Get only connections (sensors/neurons → neurons/actions)
     * @returns {Array<Object>} Connection bases
     */
  }, {
    key: "getConnections",
    value: function getConnections() {
      return this.getBasesByType('connection');
    }

    /**
     * Get only biases
     * @returns {Array<Object>} Bias bases
     */
  }, {
    key: "getBiases",
    value: function getBiases() {
      return this.getBasesByType('bias');
    }

    /**
     * Get only evolved neurons
     * @returns {Array<Object>} Evolved neuron bases
     */
  }, {
    key: "getEvolvedNeurons",
    value: function getEvolvedNeurons() {
      return this.getBasesByType('evolved_neuron');
    }

    /**
     * Get only learning rules
     * @returns {Array<Object>} Learning rule bases
     */
  }, {
    key: "getLearningRules",
    value: function getLearningRules() {
      return this.getBasesByType('learning_rule');
    }

    /**
     * Get only memory cells
     * @returns {Array<Object>} Memory cell bases
     */
  }, {
    key: "getMemoryCells",
    value: function getMemoryCells() {
      return this.getBasesByType('memory_cell');
    }

    /**
     * Get only modules
     * @returns {Array<Object>} Module bases
     */
  }, {
    key: "getModules",
    value: function getModules() {
      return this.getBasesByType('module');
    }

    /**
     * Get only plasticity bases
     * @returns {Array<Object>} Plasticity bases
     */
  }, {
    key: "getPlasticities",
    value: function getPlasticities() {
      return this.getBasesByType('plasticity');
    }

    /**
     * Get only attributes
     * @returns {Array<Object>} Attribute bases
     */
  }, {
    key: "getAttributes",
    value: function getAttributes() {
      return this.getBasesByType('attribute');
    }

    /**
     * Get statistics about genome composition
     * Useful for debugging and analysis
     * @returns {Object} Statistics object
     */
  }, {
    key: "getStats",
    value: function getStats() {
      var stats = {
        totalBases: 0,
        connections: 0,
        biases: 0,
        evolvedNeurons: 0,
        learningRules: 0,
        memoryCells: 0,
        modules: 0,
        plasticities: 0,
        attributes: 0,
        unknown: 0,
        bitSize: this.bitSize,
        byteSize: this.byteSize
      };
      var _iterator4 = _createForOfIteratorHelper(this.iterBases()),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var base = _step4.value;
          stats.totalBases++;
          switch (base.type) {
            case 'connection':
              stats.connections++;
              break;
            case 'bias':
              stats.biases++;
              break;
            case 'evolved_neuron':
              stats.evolvedNeurons++;
              break;
            case 'learning_rule':
              stats.learningRules++;
              break;
            case 'memory_cell':
              stats.memoryCells++;
              break;
            case 'module':
              stats.modules++;
              break;
            case 'plasticity':
              stats.plasticities++;
              break;
            case 'attribute':
              stats.attributes++;
              break;
            default:
              stats.unknown++;
              break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      return stats;
    }

    /**
     * Count bases by type without allocating array
     * Fastest way to get count
     * @param {string} type - Base type
     * @returns {number} Count
     */
  }, {
    key: "countBasesByType",
    value: function countBasesByType(type) {
      var count = 0;
      var _iterator5 = _createForOfIteratorHelper(this.iterBases()),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var base = _step5.value;
          if (base.type === type) count++;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      return count;
    }

    /**
     * Check if genome contains any bases of specified type
     * @param {string} type - Base type
     * @returns {boolean} True if at least one base of type exists
     */
  }, {
    key: "hasBasesOfType",
    value: function hasBasesOfType(type) {
      var _iterator6 = _createForOfIteratorHelper(this.iterBases()),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var base = _step6.value;
          if (base.type === type) return true;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      return false;
    }

    /**
     * Find first base matching predicate
     * @param {Function} predicate - Function(base) => boolean
     * @returns {Object|null} First matching base or null
     */
  }, {
    key: "findBase",
    value: function findBase(predicate) {
      var _iterator7 = _createForOfIteratorHelper(this.iterBases()),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var base = _step7.value;
          if (predicate(base)) return base;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      return null;
    }

    /**
     * Filter bases with predicate (lazy)
     * @generator
     * @param {Function} predicate - Function(base) => boolean
     * @yields {Object} Matching bases
     */
  }, {
    key: "filterBases",
    value:
    /*#__PURE__*/
    _regeneratorRuntime().mark(function filterBases(predicate) {
      var _iterator8, _step8, base;
      return _regeneratorRuntime().wrap(function filterBases$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _iterator8 = _createForOfIteratorHelper(this.iterBases());
            _context2.prev = 1;
            _iterator8.s();
          case 3:
            if ((_step8 = _iterator8.n()).done) {
              _context2.next = 10;
              break;
            }
            base = _step8.value;
            if (!predicate(base)) {
              _context2.next = 8;
              break;
            }
            _context2.next = 8;
            return base;
          case 8:
            _context2.next = 3;
            break;
          case 10:
            _context2.next = 15;
            break;
          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](1);
            _iterator8.e(_context2.t0);
          case 15:
            _context2.prev = 15;
            _iterator8.f();
            return _context2.finish(15);
          case 18:
          case "end":
            return _context2.stop();
        }
      }, filterBases, this, [[1, 12, 15, 18]]);
    })
    /**
     * Generate random genome
     */
  }, {
    key: "mutate",
    value:
    /**
     * Mutate genome in-place with various mutation strategies
     * Based on genetic algorithm best practices
     */
    function mutate() {
      var _this = this;
      var mutationRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.001;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var totalBits = this.buffer.bitLength || this.buffer.buffer.length * 8;
      var mutations = 0;

      // Extract mutation options with defaults
      var _options$bitFlipRate = options.bitFlipRate,
        bitFlipRate = _options$bitFlipRate === void 0 ? mutationRate : _options$bitFlipRate,
        _options$creepRate = options.creepRate,
        creepRate = _options$creepRate === void 0 ? mutationRate * 2 : _options$creepRate,
        _options$structuralRa = options.structuralRate,
        structuralRate = _options$structuralRa === void 0 ? mutationRate * 10 : _options$structuralRa,
        _options$maxCreep = options.maxCreep,
        maxCreep = _options$maxCreep === void 0 ? 2 : _options$maxCreep,
        _options$adaptiveRate = options.adaptiveRate,
        adaptiveRate = _options$adaptiveRate === void 0 ? false : _options$adaptiveRate,
        _options$generation = options.generation,
        generation = _options$generation === void 0 ? 0 : _options$generation,
        _options$maxActionId = options.maxActionId,
        maxActionId = _options$maxActionId === void 0 ? 511 : _options$maxActionId,
        _options$maxNeuronId3 = options.maxNeuronId,
        maxNeuronId = _options$maxNeuronId3 === void 0 ? 511 : _options$maxNeuronId3,
        _options$maxSensorId = options.maxSensorId,
        maxSensorId = _options$maxSensorId === void 0 ? 511 : _options$maxSensorId;

      // Calculate effective mutation rate (adaptive or fixed)
      var effectiveRate = adaptiveRate ? bitFlipRate * Math.exp(-generation / 500) // Decay over time
      : bitFlipRate;

      // 1. BIT-FLIP MUTATIONS (most common)
      for (var i = 0; i < totalBits; i++) {
        if (Math.random() < effectiveRate) {
          var bit = this.buffer.getBit(i);
          this.buffer.setBit(i, bit ? 0 : 1);
          mutations++;
        }
      }

      // 2. CREEP MUTATIONS (small weight adjustments)
      // Only apply to weight bits in connections
      if (Math.random() < creepRate) {
        var position = 0;
        var _totalBits = this.buffer.bitLength || this.buffer.buffer.length * 8;
        while (position < _totalBits - 3) {
          var base = Base.fromBitBuffer(this.buffer, position);
          if (!base) break;
          if (base.type === 'connection' && Math.random() < creepRate) {
            var oldWeight = base.data || 0;
            var creep = Math.floor((Math.random() - 0.5) * 2 * maxCreep);
            var newWeight = Math.max(0, Math.min(15, oldWeight + creep));
            if (newWeight !== oldWeight) {
              for (var b = 0; b < 4; b++) {
                var bitValue = newWeight >> b & 1;
                this.buffer.setBit(position + 1 + b, bitValue);
              }
              mutations++;
            }
          }
          position += base.bitLength;
        }
        this._basesCache = null; // Clear cache after modifications
        this._basePositions = null;
      }

      // 3. STRUCTURAL MUTATIONS (add/remove connections)
      // Can add/remove multiple bases for stronger effect
      var _options$addRate = options.addRate,
        addRate = _options$addRate === void 0 ? structuralRate : _options$addRate,
        _options$removeRate = options.removeRate,
        removeRate = _options$removeRate === void 0 ? structuralRate : _options$removeRate,
        _options$maxGrowth = options.maxGrowth,
        maxGrowth = _options$maxGrowth === void 0 ? 1 : _options$maxGrowth,
        _options$maxShrink = options.maxShrink,
        maxShrink = _options$maxShrink === void 0 ? 1 : _options$maxShrink,
        _options$minSize = options.minSize,
        minSize = _options$minSize === void 0 ? 100 : _options$minSize,
        _options$maxSize = options.maxSize,
        maxSize = _options$maxSize === void 0 ? 10000 : _options$maxSize;

      // ADD NEW BASES (grow genome) - but respect size limits!
      var getCurrentBaseCount = function getCurrentBaseCount() {
        if (_this._basesCache) return _this._basesCache.length;
        var count = 0;
        var _iterator9 = _createForOfIteratorHelper(_this.iterBases()),
          _step9;
        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _ = _step9.value;
            count++;
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
        return count;
      };
      var currentBases = getCurrentBaseCount();
      var maxBasesAllowed = maxSize / 20; // Approximate bits per base

      if (Math.random() < addRate && currentBases < maxBasesAllowed && totalBits < maxSize) {
        var toAdd = Math.min(Math.ceil(Math.random() * maxGrowth), maxBasesAllowed - currentBases // Don't exceed limit
        );
        for (var _i = 0; _i < toAdd; _i++) {
          var baseType = Math.random() < 0.85 ? 'connection' : 'bias';
          var newBase = Base.randomBinary({
            type: baseType,
            weightRange: [0, 3] // Start with small weights
          });
          this.buffer.append(newBase);
          mutations++;
        }
      }

      // REMOVE BASES (shrink genome)
      if (Math.random() < removeRate && totalBits > minSize) {
        var toRemove = Math.ceil(Math.random() * maxShrink);
        for (var _i2 = 0; _i2 < toRemove && totalBits > minSize; _i2++) {
          // Remove approximately one base worth of bits
          var bitsToRemove = 25; // Average base size
          var newBitLength = Math.max(minSize, this.buffer.bitLength - bitsToRemove);

          // Resize buffer
          var newByteLength = Math.ceil(newBitLength / 8);
          var newBuffer = new Uint8Array(newByteLength);
          newBuffer.set(this.buffer.buffer.subarray(0, newByteLength));
          this.buffer.buffer = newBuffer;
          this.buffer.bitLength = newBitLength;
          mutations++;
        }
      }

      // Clear cache and sanitize if mutated
      if (mutations > 0) {
        this._basesCache = null;
        this._basePositions = null;
        this.sanitizeVConflicts();
        this.sanitizeActionIds(maxActionId, maxNeuronId, maxSensorId);
      }
      return this;
    }

    /**
     * Sanitize genome to fix V conflicts after mutation
     * If a bias accidentally becomes -7 (creates 'V'), change it to -6
     */
  }, {
    key: "sanitizeVConflicts",
    value: function sanitizeVConflicts() {
      var position = 0;
      var totalBits = this.buffer.bitLength || this.buffer.buffer.length * 8;
      while (position < totalBits - 4) {
        // Read first 5 bits
        var configBits = this.buffer.readBits(5, position);

        // Check if this is 11111 (V pattern)
        if (configBits === 31) {
          // Determine what this should be based on context
          var remainingBits = totalBits - position;
          if (remainingBits === 15 || remainingBits > 15 && remainingBits < 20) {
            // This looks like a bias that mutated to -7
            // Change it to -6 by flipping one bit
            // Change from 11111 to 11011 (flip bit 2)
            this.buffer.writeBits(27, 5, position);
            position += 15; // Skip the rest of the bias
          } else if (remainingBits >= 20) {
            // This is likely a valid attribute
            position += 20;
          } else {
            // Not enough bits, treat as corrupted bias
            this.buffer.writeBits(27, 5, position);
            position += 15;
          }
        } else {
          // Determine base type and skip appropriate bits
          var lastBit = configBits & 1;
          if (lastBit === 0) {
            position += 25; // Connection
          } else {
            position += 15; // Bias
          }
        }
      }
    }

    /**
     * Crossover with another genome using various strategies
     *
     * Methods:
     * - 'base-aware': Preserves complete bases (connections/biases) - BEST for GAs
     * - 'uniform': 50/50 bit-level mixing
     * - 'single': Single-point crossover
     * - 'two-point': Two-point crossover
     */
  }, {
    key: "crossover",
    value: function crossover(other) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base-aware';
      var genome1 = new Genome();
      var genome2 = new Genome();
      var bits1 = this.buffer.bitLength || this.buffer.buffer.length * 8;
      var bits2 = other.buffer.bitLength || other.buffer.buffer.length * 8;
      var minBits = Math.min(bits1, bits2);
      var maxBits = Math.max(bits1, bits2);
      genome1.buffer = new BitBuffer();
      genome2.buffer = new BitBuffer();
      switch (method) {
        case 'base-aware':
          {
            // Crossover at BASE level (preserves building blocks)
            var bases1 = this.getBases();
            var bases2 = other.getBases();
            var child1Bases = [];
            var child2Bases = [];
            var maxLength = Math.max(bases1.length, bases2.length);
            for (var i = 0; i < maxLength; i++) {
              // Randomly select from which parent each base comes
              // 50/50 chance per base
              if (Math.random() < 0.5) {
                if (bases1[i]) child1Bases.push(bases1[i]);
                if (bases2[i]) child2Bases.push(bases2[i]);
              } else {
                if (bases2[i]) child1Bases.push(bases2[i]);
                if (bases1[i]) child2Bases.push(bases1[i]);
              }
            }

            // Rebuild genomes from bases
            return [Genome.fromBases(child1Bases), Genome.fromBases(child2Bases)];
          }
        case 'single':
          {
            // Single-point crossover (traditional)
            var crossPoint = Math.floor(minBits / 2);

            // Child 1: first half of parent1, second half of parent2
            for (var _i3 = 0; _i3 < crossPoint; _i3++) {
              genome1.buffer.writeBits(this.buffer.getBit(_i3), 1);
            }
            for (var _i4 = crossPoint; _i4 < bits2; _i4++) {
              genome1.buffer.writeBits(other.buffer.getBit(_i4), 1);
            }

            // Child 2: first half of parent2, second half of parent1
            for (var _i5 = 0; _i5 < crossPoint; _i5++) {
              genome2.buffer.writeBits(other.buffer.getBit(_i5), 1);
            }
            for (var _i6 = crossPoint; _i6 < bits1; _i6++) {
              genome2.buffer.writeBits(this.buffer.getBit(_i6), 1);
            }
            break;
          }
        case 'two-point':
          {
            // Two-point crossover
            var point1 = Math.floor(minBits * 0.33);
            var point2 = Math.floor(minBits * 0.67);
            for (var _i7 = 0; _i7 < maxBits; _i7++) {
              var bit1 = _i7 < bits1 ? this.buffer.getBit(_i7) : 0;
              var bit2 = _i7 < bits2 ? other.buffer.getBit(_i7) : 0;
              if (_i7 < point1 || _i7 >= point2) {
                genome1.buffer.writeBits(bit1, 1);
                genome2.buffer.writeBits(bit2, 1);
              } else {
                genome1.buffer.writeBits(bit2, 1);
                genome2.buffer.writeBits(bit1, 1);
              }
            }
            break;
          }
        case 'uniform':
        default:
          {
            // Uniform crossover (50% chance from each parent)
            // Best for maintaining diversity
            for (var _i8 = 0; _i8 < maxBits; _i8++) {
              var _bit = _i8 < bits1 ? this.buffer.getBit(_i8) : 0;
              var _bit2 = _i8 < bits2 ? other.buffer.getBit(_i8) : 0;
              if (Math.random() < 0.5) {
                genome1.buffer.writeBits(_bit, 1);
                genome2.buffer.writeBits(_bit2, 1);
              } else {
                genome1.buffer.writeBits(_bit2, 1);
                genome2.buffer.writeBits(_bit, 1);
              }
            }
            break;
          }
      }
      return [genome1, genome2];
    }

    /**
     * Convert to base32 string representation
     */
  }, {
    key: "toString",
    value: function toString() {
      return this.buffer.toBase32String();
    }

    /**
     * Get encoded string representation
     */
  }, {
    key: "encoded",
    get: function get() {
      return this.toString();
    }

    /**
     * Get all bases as array
     */
  }, {
    key: "bases",
    get: function get() {
      return this.getBases();
    }

    /**
     * Clone genome
     */
  }, {
    key: "clone",
    value: function clone() {
      return new Genome(this.buffer.clone());
    }

    /**
     * Get base at specific index (O(1) with position cache)
     */
  }, {
    key: "getBase",
    value: function getBase(index) {
      if (!this._basePositions) this.getBases();
      if (index < 0 || index >= this._basePositions.length) return null;
      var position = this._basePositions[index];
      return Base.fromBitBuffer(this.buffer, position);
    }

    /**
     * Get size in bytes
     */
  }, {
    key: "byteSize",
    get: function get() {
      return this.buffer.byteLength;
    }

    /**
     * Generate color from genome hash
     */
  }, {
    key: "toJSON",
    value:
    /**
     * Export to JSON with both string and binary
     */
    function toJSON() {
      return {
        encoded: this.encoded,
        bases: this.bases,
        binary: Array.from(this.buffer.buffer) // Convert Uint8Array to regular array for JSON
      };
    }

    /**
     * Export as binary Uint8Array
     */
  }, {
    key: "toBinary",
    value: function toBinary() {
      return this.buffer.buffer;
    }

    /**
     * Import from binary Uint8Array
     */
  }, {
    key: "bitSize",
    get:
    /**
     * Get size in bits
     */
    function get() {
      return this.buffer.bitLength || this.buffer.buffer.length * 8;
    }

    /**
     * Compare genomes
     */
  }, {
    key: "equals",
    value: function equals(other) {
      var bits1 = this.bitSize;
      var bits2 = other.bitSize;
      if (bits1 !== bits2) return false;
      for (var i = 0; i < bits1; i++) {
        if (this.buffer.getBit(i) !== other.buffer.getBit(i)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Calculate hamming distance
     */
  }, {
    key: "hammingDistance",
    value: function hammingDistance(other) {
      var bits1 = this.bitSize;
      var bits2 = other.bitSize;
      var maxBits = Math.max(bits1, bits2);
      var distance = 0;
      for (var i = 0; i < maxBits; i++) {
        var bit1 = i < bits1 ? this.buffer.getBit(i) : 0;
        var bit2 = i < bits2 ? other.buffer.getBit(i) : 0;
        if (bit1 !== bit2) distance++;
      }
      return distance;
    }

    /**
     * Sanitize action, neuron and sensor IDs after mutation
     * Ensures they don't exceed the maximum allowed values
     */
  }, {
    key: "sanitizeActionIds",
    value: function sanitizeActionIds() {
      var maxActionId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 511;
      var maxNeuronId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 511;
      var maxSensorId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 511;
      var position = 0;
      var totalBits = this.buffer.bitLength || this.buffer.buffer.length * 8;
      while (position < totalBits - 4) {
        // Read first 5 bits to determine base type
        var configBits = this.buffer.readBits(5, position);

        // Check if it's a connection (last bit is 0)
        if ((configBits & 1) === 0 && position + 25 <= totalBits) {
          // This is a connection base

          // Check target ID (bits 15-24)
          var targetBits = this.buffer.readBits(10, position + 15);
          var targetId = targetBits >> 1; // 9 bits
          var targetType = targetBits & 1; // 1 bit (0=neuron, 1=action)

          // If it's an action and ID exceeds max, wrap it around
          if (targetType === 1 && targetId > maxActionId) {
            var newId = targetId % (maxActionId + 1);
            var newTargetBits = newId << 1 | 1; // Reconstruct with action type
            this.buffer.writeBits(newTargetBits, 10, position + 15);
          }
          // If it's a neuron and ID exceeds max, wrap it around
          else if (targetType === 0 && targetId > maxNeuronId) {
            var _newId = targetId % (maxNeuronId + 1);
            var _newTargetBits = _newId << 1 | 0; // Reconstruct with neuron type
            this.buffer.writeBits(_newTargetBits, 10, position + 15);
          }

          // Check source ID (bits 5-14)
          var sourceBits = this.buffer.readBits(10, position + 5);
          var sourceId = sourceBits >> 1; // 9 bits
          var sourceType = sourceBits & 1; // 1 bit (0=sensor, 1=neuron)

          // If it's a sensor and ID exceeds max, wrap it around
          if (sourceType === 0 && sourceId > maxSensorId) {
            var _newId2 = sourceId % (maxSensorId + 1);
            var newSourceBits = _newId2 << 1 | 0; // Reconstruct with sensor type
            this.buffer.writeBits(newSourceBits, 10, position + 5);
          }
          // If it's a neuron and ID exceeds max, wrap it around
          else if (sourceType === 1 && sourceId > maxNeuronId) {
            var _newId3 = sourceId % (maxNeuronId + 1);
            var _newSourceBits = _newId3 << 1 | 1; // Reconstruct with neuron type
            this.buffer.writeBits(_newSourceBits, 10, position + 5);
          }
          position += 25; // Move to next base
        }
        // Check if it's a bias (last bit is 1, not all bits are 1)
        else if ((configBits & 1) === 1 && configBits !== 31 && position + 15 <= totalBits) {
          // This is a bias base

          // Check target ID (bits 5-14)
          var _targetBits3 = this.buffer.readBits(10, position + 5);
          var _targetId3 = _targetBits3 >> 2; // 8 bits
          var _targetType4 = _targetBits3 & 3; // 2 bits (0=sensor, 1=neuron, 2=action)

          // Sanitize based on target type
          if (_targetType4 === 2 && _targetId3 > maxActionId) {
            var _newId4 = _targetId3 % (maxActionId + 1);
            var _newTargetBits2 = _newId4 << 2 | 2;
            this.buffer.writeBits(_newTargetBits2, 10, position + 5);
          } else if (_targetType4 === 1 && _targetId3 > maxNeuronId) {
            var _newId5 = _targetId3 % (maxNeuronId + 1);
            var _newTargetBits3 = _newId5 << 2 | 1;
            this.buffer.writeBits(_newTargetBits3, 10, position + 5);
          } else if (_targetType4 === 0 && _targetId3 > maxSensorId) {
            var _newId6 = _targetId3 % (maxSensorId + 1);
            var _newTargetBits4 = _newId6 << 2 | 0;
            this.buffer.writeBits(_newTargetBits4, 10, position + 5);
          }
          position += 15; // Move to next base
        }
        // Check if it's an attribute (all 5 config bits are 1)
        else if (configBits === 31 && position + 20 <= totalBits) {
          position += 20; // Skip attribute
        } else {
          // Unknown or corrupted base, skip a bit and try again
          position += 1;
        }
      }
    }
  }], [{
    key: "from",
    value: function from(data) {
      if (data instanceof Genome) {
        return data;
      }
      if (data instanceof BitBuffer) {
        return new Genome(data);
      }
      if (data instanceof Uint8Array) {
        return new Genome(BitBuffer.from(data));
      }
      if (typeof data === 'string') {
        return Genome.fromString(data);
      }
      if (data && data.bases) {
        return Genome.fromBases(data.bases);
      }
      return new Genome();
    }

    /**
     * Create from base32 string
     */
  }, {
    key: "fromString",
    value: function fromString(str) {
      var genome = new Genome();
      genome.buffer = BitBuffer.fromBase32String(str);
      return genome;
    }

    /**
     * Create from bases array
     */
  }, {
    key: "fromBases",
    value: function fromBases(bases) {
      var genome = new Genome();
      genome.buffer = new BitBuffer(); // Start with empty buffer
      genome.buffer.bitLength = 0; // Ensure bitLength starts at 0
      var _iterator10 = _createForOfIteratorHelper(bases),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var base = _step10.value;
          // Validate base before converting
          if (!base || !base.type) continue;

          // Skip connections without source/target
          if (base.type === 'connection') {
            if (!base.source || base.source.id === undefined) continue;
            if (!base.target || base.target.id === undefined) continue;
          }

          // Skip biases without target
          if (base.type === 'bias') {
            if (!base.target || base.target.id === undefined) continue;
          }
          try {
            var baseBuffer = Base.toBitBuffer(base);
            genome.buffer.append(baseBuffer);
          } catch (err) {
            // Skip invalid bases silently
            continue;
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
      return genome;
    }
  }, {
    key: "random",
    value: function random() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var genome = new Genome();
      genome.buffer = new BitBuffer();

      // Extract attributes from options
      var _options$attributes2 = options.attributes,
        attributes = _options$attributes2 === void 0 ? 0 : _options$attributes2,
        baseOptions = _objectWithoutProperties(options, _excluded);

      // Determine base type distribution (85% connections, 15% biases by default)
      var attributeCount = attributes > 0 ? Math.floor(count * 0.1) : 0;
      var biasCount = Math.floor((count - attributeCount) * 0.15); // 15% biases
      var connectionCount = count - attributeCount - biasCount; // ~85% connections

      // Generate connections
      for (var i = 0; i < connectionCount; i++) {
        var baseBuffer = Base.randomBinary(_objectSpread(_objectSpread({}, baseOptions), {}, {
          type: 'connection'
        }));
        genome.buffer.append(baseBuffer);
      }

      // Generate biases
      for (var _i9 = 0; _i9 < biasCount; _i9++) {
        var _baseBuffer = Base.randomBinary(_objectSpread(_objectSpread({}, baseOptions), {}, {
          type: 'bias'
        }));
        genome.buffer.append(_baseBuffer);
      }

      // Generate attributes
      for (var _i10 = 0; _i10 < attributeCount; _i10++) {
        var _baseBuffer2 = Base.randomBinary(_objectSpread(_objectSpread({}, baseOptions), {}, {
          type: 'attribute',
          attributeIds: attributes // Pass number of different attribute IDs
        }));
        genome.buffer.append(_baseBuffer2);
      }
      return genome;
    }

    /**
     * Generate random genome with specific parameters
     * Alias for random() method
     */
  }, {
    key: "randomWith",
    value: function randomWith() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.random(count, options);
    }
  }, {
    key: "color",
    value: (function () {
      var _color = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(genome) {
        var color, genomeStr, hash, _i11, _Object$entries, _Object$entries$_i, i, str, _iterator11, _step11, _char4;
        return _regeneratorRuntime().wrap(function _callee$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              color = [0, 0, 0, 0];
              genomeStr = typeof genome === 'string' ? genome : genome.encoded;
              _context3.next = 4;
              return md5(genomeStr);
            case 4:
              hash = _context3.sent.toUpperCase();
              for (_i11 = 0, _Object$entries = Object.entries(chunk(hash.split(''), 8)); _i11 < _Object$entries.length; _i11++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i11], 2), i = _Object$entries$_i[0], str = _Object$entries$_i[1];
                _iterator11 = _createForOfIteratorHelper(str);
                try {
                  for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                    _char4 = _step11.value;
                    color[i] += Math.floor(Math.max(0, parseInt(_char4, 16) - 1) / 15 * 32);
                  }
                } catch (err) {
                  _iterator11.e(err);
                } finally {
                  _iterator11.f();
                }
                color[i] = parseInt(color[i] / 255 * 200 + 35);
              }
              return _context3.abrupt("return", color);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee);
      }));
      function color(_x2) {
        return _color.apply(this, arguments);
      }
      return color;
    }())
  }, {
    key: "fromBinary",
    value: function fromBinary(binary) {
      return new Genome(BitBuffer.from(binary));
    }
  }]);
  return Genome;
}(); // Removed - no longer needed with inline implementation
var Vertex = /*#__PURE__*/function () {
  function Vertex(name) {
    var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Vertex);
    this.name = name;
    this.metadata = _objectSpread({}, metadata);
    this["in"] = [];
    this.inMap = {};
    this.out = [];
    this.outMap = {};

    // Pre-allocated arrays for performance
    this._inputArrays = {
      values: null,
      weights: null,
      size: 0
    };

    // Cache system with generation tracking
    this.cache = {
      generation: -1,
      // Last generation when calculated
      value: 0 // Cached value
    };
  }
  _createClass(Vertex, [{
    key: "addIn",
    value: function addIn(vertex, weight) {
      if (!this.inMap[vertex.name]) {
        this.inMap[vertex.name] = {
          weight: weight,
          index: this["in"].push({
            vertex: vertex,
            weight: weight
          }) - 1
        };
      } else {
        this.inMap[vertex.name].weight += weight;
        this["in"][this.inMap[vertex.name].index].weight += weight;
      }
    }
  }, {
    key: "addOut",
    value: function addOut(vertex, weight) {
      if (!this.outMap[vertex.name]) {
        this.outMap[vertex.name] = {
          weight: weight,
          index: this.out.push({
            vertex: vertex,
            weight: weight
          }) - 1
        };
      } else {
        this.outMap[vertex.name].weight += weight;
        this.out[this.outMap[vertex.name].index].weight += weight;
      }
    }
  }, {
    key: "neighbors",
    value: function neighbors() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return fn ? this["in"].filter(fn).concat(this.out.filter(fn)) : this["in"].concat(this.out);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        metadata: this.metadata,
        "in": this["in"].map(function (v) {
          return v.vertex.name;
        }),
        out: this.out.map(function (v) {
          return v.vertex.name;
        })
      };
    }
  }, {
    key: "toString",
    value: function toString() {
      return JSON.stringify(this.toJSON(), null, 2);
    }
  }, {
    key: "inputsTree",
    value: function inputsTree() {
      var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var visited = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Prevent infinite recursion with cycle detection and depth limit
      if (visited[this.name] || depth > 100) return [];
      var pile = [];
      visited[this.name] = true;
      pile.push({
        depth: depth,
        vertex: this
      });
      var _iterator12 = _createForOfIteratorHelper(this["in"]),
        _step12;
      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var input = _step12.value;
          var subPile = input.vertex.inputsTree(depth + 1, visited);
          // Concat without filter since visited check is done at the start
          pile = pile.concat(subPile);
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }
      return sortBy(pile, ['depth']);
    }
  }, {
    key: "getCachedOrCalculate",
    value: function getCachedOrCalculate(currentGeneration) {
      // Return cached value if already calculated this generation
      if (this.cache.generation === currentGeneration) {
        return this.cache.value;
      }

      // Mark as being calculated to prevent recursion
      this.cache.generation = currentGeneration;

      // Calculate new value
      var value = this.tick ? this.tick() : 0;

      // Update cache with the calculated value
      this.cache.value = value;
      return value;
    }
  }, {
    key: "calculateInput",
    value: function calculateInput(currentGeneration) {
      var len = this["in"].length;

      // Early return for no inputs
      if (len === 0) return 0;

      // Check if TypedArrays are available (browser and Node.js support)
      var hasTypedArrays = typeof Float32Array !== 'undefined';
      if (hasTypedArrays) {
        // Allocate or resize TypedArrays only when needed
        if (!this._inputArrays.values || this._inputArrays.size < len) {
          this._inputArrays.values = new Float32Array(len);
          this._inputArrays.weights = new Float32Array(len);
          this._inputArrays.size = len;
        }
        var values = this._inputArrays.values;
        var weights = this._inputArrays.weights;

        // Fill arrays - use cached values if available
        for (var i = 0; i < len; i++) {
          var input = this["in"][i];
          // Use cached value from current generation if available
          if (currentGeneration !== undefined && input.vertex.getCachedOrCalculate) {
            values[i] = input.vertex.getCachedOrCalculate(currentGeneration);
          } else {
            values[i] = input.vertex.metadata.lastTick || 0;
          }
          weights[i] = input.weight;
        }

        // Optimized dot product
        var sum = 0;
        for (var _i12 = 0; _i12 < len; _i12++) {
          sum += values[_i12] * weights[_i12];
        }
        return sum;
      } else {
        // Fallback for environments without TypedArrays
        var _sum = 0;
        for (var _i13 = 0; _i13 < len; _i13++) {
          var _input = this["in"][_i13];
          // Use cached value from current generation if available
          var value = void 0;
          if (currentGeneration !== undefined && _input.vertex.getCachedOrCalculate) {
            value = _input.vertex.getCachedOrCalculate(currentGeneration);
          } else {
            value = _input.vertex.metadata.lastTick || 0;
          }
          _sum += value * _input.weight;
        }
        return _sum;
      }
    }
  }]);
  return Vertex;
}();
/**
 * SparseConnectionMatrix - Memory-efficient connection storage
 *
 * Uses CSR (Compressed Sparse Row) format for maximum efficiency:
 * - Memory: 8 bytes/connection vs 40+ bytes (object)
 * - Speed: Sequential access for forward propagation
 * - Cache-friendly: Contiguous arrays
 *
 * Format:
 * - sourceIds: Uint16Array - source vertex IDs
 * - targetIds: Uint16Array - target vertex IDs
 * - weights: Float32Array - connection weights
 * - count: number - active connections
 *
 * Memory savings: 80% reduction vs object-based
 *
 * Usage:
 * ```javascript
 * const matrix = new SparseConnectionMatrix(1000)
 * matrix.add(sourceId, targetId, weight)
 *
 * // Forward propagation
 * for (let i = 0; i < matrix.count; i++) {
 *   const target = matrix.targetIds[i]
 *   const source = matrix.sourceIds[i]
 *   const weight = matrix.weights[i]
 *   // Process connection
 * }
 * ```
 */
var SparseConnectionMatrix = /*#__PURE__*/function () {
  function SparseConnectionMatrix() {
    var maxConnections = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
    _classCallCheck(this, SparseConnectionMatrix);
    this.maxConnections = maxConnections;

    // CSR format arrays (TypedArrays for performance)
    this.sourceIds = new Uint16Array(maxConnections);
    this.targetIds = new Uint16Array(maxConnections);
    this.weights = new Float32Array(maxConnections);

    // Connection metadata (optional, can be removed for even more savings)
    this.sourceTypes = new Uint8Array(maxConnections); // 0=sensor, 1=neuron
    this.targetTypes = new Uint8Array(maxConnections); // 0=neuron, 1=action

    this.count = 0;

    // Statistics
    this.stats = {
      added: 0,
      removed: 0,
      compacted: 0
    };
  }

  /**
   * Add a connection
   * @param {number} sourceId - Source vertex ID
   * @param {number} targetId - Target vertex ID
   * @param {number} weight - Connection weight
   * @param {number} sourceType - Source type (0=sensor, 1=neuron)
   * @param {number} targetType - Target type (0=neuron, 1=action)
   * @returns {number} Index of added connection
   */
  _createClass(SparseConnectionMatrix, [{
    key: "add",
    value: function add(sourceId, targetId, weight) {
      var sourceType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var targetType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      if (this.count >= this.maxConnections) {
        throw new Error("Connection matrix full (max ".concat(this.maxConnections, ")"));
      }
      var idx = this.count;
      this.sourceIds[idx] = sourceId;
      this.targetIds[idx] = targetId;
      this.weights[idx] = weight;
      this.sourceTypes[idx] = sourceType;
      this.targetTypes[idx] = targetType;
      this.count++;
      this.stats.added++;
      return idx;
    }

    /**
     * Get connection at index
     * @param {number} index - Connection index
     * @returns {Object} Connection object
     */
  }, {
    key: "get",
    value: function get(index) {
      if (index < 0 || index >= this.count) return null;
      return {
        sourceId: this.sourceIds[index],
        targetId: this.targetIds[index],
        weight: this.weights[index],
        sourceType: this.sourceTypes[index],
        targetType: this.targetTypes[index]
      };
    }

    /**
     * Update weight at index
     * @param {number} index - Connection index
     * @param {number} newWeight - New weight value
     */
  }, {
    key: "updateWeight",
    value: function updateWeight(index, newWeight) {
      if (index >= 0 && index < this.count) {
        this.weights[index] = newWeight;
      }
    }

    /**
     * Remove connection at index (swap with last, then reduce count)
     * O(1) removal but doesn't preserve order
     * @param {number} index - Connection index to remove
     */
  }, {
    key: "remove",
    value: function remove(index) {
      if (index < 0 || index >= this.count) return;

      // Swap with last element
      var lastIdx = this.count - 1;
      this.sourceIds[index] = this.sourceIds[lastIdx];
      this.targetIds[index] = this.targetIds[lastIdx];
      this.weights[index] = this.weights[lastIdx];
      this.sourceTypes[index] = this.sourceTypes[lastIdx];
      this.targetTypes[index] = this.targetTypes[lastIdx];
      this.count--;
      this.stats.removed++;
    }

    /**
     * Find all connections with specific source
     * @param {number} sourceId - Source vertex ID
     * @returns {Array<number>} Indices of connections
     */
  }, {
    key: "findBySource",
    value: function findBySource(sourceId) {
      var indices = [];
      for (var i = 0; i < this.count; i++) {
        if (this.sourceIds[i] === sourceId) {
          indices.push(i);
        }
      }
      return indices;
    }

    /**
     * Find all connections with specific target
     * @param {number} targetId - Target vertex ID
     * @returns {Array<number>} Indices of connections
     */
  }, {
    key: "findByTarget",
    value: function findByTarget(targetId) {
      var indices = [];
      for (var i = 0; i < this.count; i++) {
        if (this.targetIds[i] === targetId) {
          indices.push(i);
        }
      }
      return indices;
    }

    /**
     * Find connection with specific source and target
     * @param {number} sourceId - Source vertex ID
     * @param {number} targetId - Target vertex ID
     * @returns {number} Index or -1 if not found
     */
  }, {
    key: "find",
    value: function find(sourceId, targetId) {
      for (var i = 0; i < this.count; i++) {
        if (this.sourceIds[i] === sourceId && this.targetIds[i] === targetId) {
          return i;
        }
      }
      return -1;
    }

    /**
     * Check if connection exists
     * @param {number} sourceId - Source vertex ID
     * @param {number} targetId - Target vertex ID
     * @returns {boolean} True if connection exists
     */
  }, {
    key: "has",
    value: function has(sourceId, targetId) {
      return this.find(sourceId, targetId) !== -1;
    }

    /**
     * Clear all connections
     */
  }, {
    key: "clear",
    value: function clear() {
      this.count = 0;
    }

    /**
     * Compact matrix - sort by source for better cache locality
     * This improves forward propagation performance
     */
  }, {
    key: "compact",
    value: function compact() {
      var _this2 = this;
      if (this.count === 0) return;

      // Create index array for sorting
      var indices = new Array(this.count);
      for (var i = 0; i < this.count; i++) {
        indices[i] = i;
      }

      // Sort indices by source ID
      indices.sort(function (a, b) {
        var sourceDiff = _this2.sourceIds[a] - _this2.sourceIds[b];
        if (sourceDiff !== 0) return sourceDiff;
        // Secondary sort by target for even better locality
        return _this2.targetIds[a] - _this2.targetIds[b];
      });

      // Create temporary arrays
      var newSourceIds = new Uint16Array(this.maxConnections);
      var newTargetIds = new Uint16Array(this.maxConnections);
      var newWeights = new Float32Array(this.maxConnections);
      var newSourceTypes = new Uint8Array(this.maxConnections);
      var newTargetTypes = new Uint8Array(this.maxConnections);

      // Copy in sorted order
      for (var _i14 = 0; _i14 < this.count; _i14++) {
        var oldIdx = indices[_i14];
        newSourceIds[_i14] = this.sourceIds[oldIdx];
        newTargetIds[_i14] = this.targetIds[oldIdx];
        newWeights[_i14] = this.weights[oldIdx];
        newSourceTypes[_i14] = this.sourceTypes[oldIdx];
        newTargetTypes[_i14] = this.targetTypes[oldIdx];
      }

      // Replace arrays
      this.sourceIds = newSourceIds;
      this.targetIds = newTargetIds;
      this.weights = newWeights;
      this.sourceTypes = newSourceTypes;
      this.targetTypes = newTargetTypes;
      this.stats.compacted++;
    }

    /**
     * Get memory usage estimate
     * @returns {Object} Memory usage in bytes
     */
  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      var uint16Bytes = this.maxConnections * 2 * 2; // sourceIds + targetIds
      var float32Bytes = this.maxConnections * 4; // weights
      var uint8Bytes = this.maxConnections * 2; // sourceTypes + targetTypes

      var total = uint16Bytes + float32Bytes + uint8Bytes;
      return {
        sourceIds: this.maxConnections * 2,
        targetIds: this.maxConnections * 2,
        weights: this.maxConnections * 4,
        sourceTypes: this.maxConnections,
        targetTypes: this.maxConnections,
        total: total,
        totalKB: (total / 1024).toFixed(2),
        totalMB: (total / (1024 * 1024)).toFixed(2),
        perConnection: (total / this.maxConnections).toFixed(2),
        utilizationPercent: (this.count / this.maxConnections * 100).toFixed(2)
      };
    }

    /**
     * Get statistics
     * @returns {Object} Statistics object
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return _objectSpread(_objectSpread({}, this.stats), {}, {
        count: this.count,
        maxConnections: this.maxConnections,
        utilizationPercent: (this.count / this.maxConnections * 100).toFixed(2)
      });
    }

    /**
     * Iterate over all connections (forward)
     * Most efficient for neural network propagation
     * @generator
     * @yields {Object} Connection object
     */
  }, {
    key: "iterConnections",
    value:
    /*#__PURE__*/
    _regeneratorRuntime().mark(function iterConnections() {
      var i;
      return _regeneratorRuntime().wrap(function iterConnections$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            i = 0;
          case 1:
            if (!(i < this.count)) {
              _context4.next = 7;
              break;
            }
            _context4.next = 4;
            return {
              index: i,
              sourceId: this.sourceIds[i],
              targetId: this.targetIds[i],
              weight: this.weights[i],
              sourceType: this.sourceTypes[i],
              targetType: this.targetTypes[i]
            };
          case 4:
            i++;
            _context4.next = 1;
            break;
          case 7:
          case "end":
            return _context4.stop();
        }
      }, iterConnections, this);
    })
    /**
     * Iterate over connections from specific source
     * @generator
     * @param {number} sourceId - Source vertex ID
     * @yields {Object} Connection object
     */
  }, {
    key: "iterConnectionsFrom",
    value:
    /*#__PURE__*/
    _regeneratorRuntime().mark(function iterConnectionsFrom(sourceId) {
      var i;
      return _regeneratorRuntime().wrap(function iterConnectionsFrom$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            i = 0;
          case 1:
            if (!(i < this.count)) {
              _context5.next = 8;
              break;
            }
            if (!(this.sourceIds[i] === sourceId)) {
              _context5.next = 5;
              break;
            }
            _context5.next = 5;
            return {
              index: i,
              targetId: this.targetIds[i],
              weight: this.weights[i],
              targetType: this.targetTypes[i]
            };
          case 5:
            i++;
            _context5.next = 1;
            break;
          case 8:
          case "end":
            return _context5.stop();
        }
      }, iterConnectionsFrom, this);
    })
    /**
     * Iterate over connections to specific target
     * @generator
     * @param {number} targetId - Target vertex ID
     * @yields {Object} Connection object
     */
  }, {
    key: "iterConnectionsTo",
    value:
    /*#__PURE__*/
    _regeneratorRuntime().mark(function iterConnectionsTo(targetId) {
      var i;
      return _regeneratorRuntime().wrap(function iterConnectionsTo$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            i = 0;
          case 1:
            if (!(i < this.count)) {
              _context6.next = 8;
              break;
            }
            if (!(this.targetIds[i] === targetId)) {
              _context6.next = 5;
              break;
            }
            _context6.next = 5;
            return {
              index: i,
              sourceId: this.sourceIds[i],
              weight: this.weights[i],
              sourceType: this.sourceTypes[i]
            };
          case 5:
            i++;
            _context6.next = 1;
            break;
          case 8:
          case "end":
            return _context6.stop();
        }
      }, iterConnectionsTo, this);
    })
    /**
     * Export to JSON for debugging
     * @returns {Object} JSON representation
     */
  }, {
    key: "toJSON",
    value: function toJSON() {
      var connections = [];
      var _iterator13 = _createForOfIteratorHelper(this.iterConnections()),
        _step13;
      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var conn = _step13.value;
          connections.push(conn);
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
      return {
        count: this.count,
        maxConnections: this.maxConnections,
        connections: connections
      };
    }

    /**
     * Clone matrix
     * @returns {SparseConnectionMatrix} Cloned matrix
     */
  }, {
    key: "clone",
    value: function clone() {
      var matrix = new SparseConnectionMatrix(this.maxConnections);
      matrix.sourceIds.set(this.sourceIds);
      matrix.targetIds.set(this.targetIds);
      matrix.weights.set(this.weights);
      matrix.sourceTypes.set(this.sourceTypes);
      matrix.targetTypes.set(this.targetTypes);
      matrix.count = this.count;
      return matrix;
    }

    /**
     * Resize matrix (expand capacity)
     * @param {number} newMaxConnections - New maximum connections
     */
  }, {
    key: "resize",
    value: function resize(newMaxConnections) {
      if (newMaxConnections <= this.maxConnections) return;
      var newSourceIds = new Uint16Array(newMaxConnections);
      var newTargetIds = new Uint16Array(newMaxConnections);
      var newWeights = new Float32Array(newMaxConnections);
      var newSourceTypes = new Uint8Array(newMaxConnections);
      var newTargetTypes = new Uint8Array(newMaxConnections);

      // Copy existing data
      newSourceIds.set(this.sourceIds.subarray(0, this.count));
      newTargetIds.set(this.targetIds.subarray(0, this.count));
      newWeights.set(this.weights.subarray(0, this.count));
      newSourceTypes.set(this.sourceTypes.subarray(0, this.count));
      newTargetTypes.set(this.targetTypes.subarray(0, this.count));
      this.sourceIds = newSourceIds;
      this.targetIds = newTargetIds;
      this.weights = newWeights;
      this.sourceTypes = newSourceTypes;
      this.targetTypes = newTargetTypes;
      this.maxConnections = newMaxConnections;
    }
  }]);
  return SparseConnectionMatrix;
}();
/**
 * TypedArrayPool - Object pooling for TypedArrays
 *
 * Dramatically reduces memory allocations by reusing TypedArray instances.
 * Critical for performance in hot paths like brain ticking and genome operations.
 *
 * Memory savings: ~90% reduction in allocations during population evaluation
 * CPU savings: ~15% faster due to reduced garbage collection pressure
 *
 * Usage:
 * ```javascript
 * const pool = new TypedArrayPool()
 * const array = pool.allocFloat32(100)  // Get or create
 * // ... use array ...
 * pool.free(array)  // Return to pool
 * ```
 */
var TypedArrayPool = /*#__PURE__*/function () {
  function TypedArrayPool() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, TypedArrayPool);
    var _options$initialFloat = options.initialFloat32,
      initialFloat32 = _options$initialFloat === void 0 ? 10 : _options$initialFloat,
      _options$initialUint = options.initialUint8,
      initialUint8 = _options$initialUint === void 0 ? 10 : _options$initialUint,
      _options$initialUint2 = options.initialUint16,
      initialUint16 = _options$initialUint2 === void 0 ? 10 : _options$initialUint2,
      _options$maxPoolSize = options.maxPoolSize,
      maxPoolSize = _options$maxPoolSize === void 0 ? 100 : _options$maxPoolSize;

    // Separate pools for each TypedArray type
    this.float32Pool = [];
    this.uint8Pool = [];
    this.uint16Pool = [];
    this.maxPoolSize = maxPoolSize;

    // Statistics for debugging/optimization
    this.stats = {
      float32Allocated: 0,
      float32Reused: 0,
      uint8Allocated: 0,
      uint8Reused: 0,
      uint16Allocated: 0,
      uint16Reused: 0,
      totalAllocated: 0,
      totalReused: 0
    };

    // Pre-allocate some arrays
    this._preallocate(initialFloat32, initialUint8, initialUint16);
  }

  /**
   * Pre-allocate arrays to reduce initial allocation cost
   * @private
   */
  _createClass(TypedArrayPool, [{
    key: "_preallocate",
    value: function _preallocate(numFloat32, numUint8, numUint16) {
      // Common sizes for each type
      var float32Sizes = [10, 50, 100, 500, 1024];
      var uint8Sizes = [64, 128, 256, 512];
      var uint16Sizes = [64, 128, 256, 512];

      // Pre-allocate Float32Arrays
      for (var i = 0; i < numFloat32; i++) {
        var size = float32Sizes[i % float32Sizes.length];
        this.float32Pool.push({
          size: size,
          array: new Float32Array(size)
        });
      }

      // Pre-allocate Uint8Arrays
      for (var _i15 = 0; _i15 < numUint8; _i15++) {
        var _size = uint8Sizes[_i15 % uint8Sizes.length];
        this.uint8Pool.push({
          size: _size,
          array: new Uint8Array(_size)
        });
      }

      // Pre-allocate Uint16Arrays
      for (var _i16 = 0; _i16 < numUint16; _i16++) {
        var _size2 = uint16Sizes[_i16 % uint16Sizes.length];
        this.uint16Pool.push({
          size: _size2,
          array: new Uint16Array(_size2)
        });
      }
    }

    /**
     * Allocate or reuse Float32Array
     * @param {number} size - Required size
     * @returns {Float32Array} Array instance
     */
  }, {
    key: "allocFloat32",
    value: function allocFloat32(size) {
      // Try to find matching size in pool
      for (var i = 0; i < this.float32Pool.length; i++) {
        if (this.float32Pool[i].size === size) {
          var entry = this.float32Pool.splice(i, 1)[0];
          this.stats.float32Reused++;
          this.stats.totalReused++;
          return entry.array;
        }
      }

      // Not found - allocate new
      this.stats.float32Allocated++;
      this.stats.totalAllocated++;
      return new Float32Array(size);
    }

    /**
     * Allocate or reuse Uint8Array
     * @param {number} size - Required size
     * @returns {Uint8Array} Array instance
     */
  }, {
    key: "allocUint8",
    value: function allocUint8(size) {
      // Try to find matching size in pool
      for (var i = 0; i < this.uint8Pool.length; i++) {
        if (this.uint8Pool[i].size === size) {
          var entry = this.uint8Pool.splice(i, 1)[0];
          this.stats.uint8Reused++;
          this.stats.totalReused++;
          return entry.array;
        }
      }

      // Not found - allocate new
      this.stats.uint8Allocated++;
      this.stats.totalAllocated++;
      return new Uint8Array(size);
    }

    /**
     * Allocate or reuse Uint16Array
     * @param {number} size - Required size
     * @returns {Uint16Array} Array instance
     */
  }, {
    key: "allocUint16",
    value: function allocUint16(size) {
      // Try to find matching size in pool
      for (var i = 0; i < this.uint16Pool.length; i++) {
        if (this.uint16Pool[i].size === size) {
          var entry = this.uint16Pool.splice(i, 1)[0];
          this.stats.uint16Reused++;
          this.stats.totalReused++;
          return entry.array;
        }
      }

      // Not found - allocate new
      this.stats.uint16Allocated++;
      this.stats.totalAllocated++;
      return new Uint16Array(size);
    }

    /**
     * Return array to pool for reuse
     * @param {TypedArray} array - Array to return
     */
  }, {
    key: "free",
    value: function free(array) {
      if (!array) return;

      // Detect type and pool
      var pool, maxSize;
      if (array instanceof Float32Array) {
        pool = this.float32Pool;
        maxSize = this.maxPoolSize;
      } else if (array instanceof Uint8Array) {
        pool = this.uint8Pool;
        maxSize = this.maxPoolSize;
      } else if (array instanceof Uint16Array) {
        pool = this.uint16Pool;
        maxSize = this.maxPoolSize;
      } else {
        // Unknown type - ignore
        return;
      }

      // Clear array for security (prevent data leakage)
      array.fill(0);

      // Check pool size limit
      if (pool.length >= maxSize) {
        // Pool is full - discard (will be garbage collected)
        return;
      }

      // Return to pool
      pool.push({
        size: array.length,
        array: array
      });
    }

    /**
     * Get pool statistics
     * @returns {Object} Statistics object
     */
  }, {
    key: "getStats",
    value: function getStats() {
      var reuseRate = this.stats.totalReused / (this.stats.totalAllocated + this.stats.totalReused);
      return _objectSpread(_objectSpread({}, this.stats), {}, {
        reuseRate: reuseRate || 0,
        poolSizes: {
          float32: this.float32Pool.length,
          uint8: this.uint8Pool.length,
          uint16: this.uint16Pool.length
        }
      });
    }

    /**
     * Clear all pools (for testing or cleanup)
     */
  }, {
    key: "clear",
    value: function clear() {
      this.float32Pool = [];
      this.uint8Pool = [];
      this.uint16Pool = [];

      // Reset stats
      this.stats = {
        float32Allocated: 0,
        float32Reused: 0,
        uint8Allocated: 0,
        uint8Reused: 0,
        uint16Allocated: 0,
        uint16Reused: 0,
        totalAllocated: 0,
        totalReused: 0
      };
    }

    /**
     * Get memory usage estimate
     * @returns {Object} Memory usage in bytes
     */
  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      var float32Bytes = 0;
      var uint8Bytes = 0;
      var uint16Bytes = 0;
      this.float32Pool.forEach(function (entry) {
        float32Bytes += entry.size * 4; // 4 bytes per float
      });
      this.uint8Pool.forEach(function (entry) {
        uint8Bytes += entry.size * 1; // 1 byte per uint8
      });
      this.uint16Pool.forEach(function (entry) {
        uint16Bytes += entry.size * 2; // 2 bytes per uint16
      });
      var total = float32Bytes + uint8Bytes + uint16Bytes;
      return {
        float32: float32Bytes,
        uint8: uint8Bytes,
        uint16: uint16Bytes,
        total: total,
        totalMB: (total / (1024 * 1024)).toFixed(2)
      };
    }

    /**
     * Compact pools - remove duplicate sizes, keep only largest
     * Call periodically to prevent pool fragmentation
     */
  }, {
    key: "compact",
    value: function compact() {
      this._compactPool(this.float32Pool);
      this._compactPool(this.uint8Pool);
      this._compactPool(this.uint16Pool);
    }

    /**
     * Compact a single pool
     * @private
     */
  }, {
    key: "_compactPool",
    value: function _compactPool(pool) {
      // Group by size
      var sizeMap = new Map();
      pool.forEach(function (entry) {
        if (!sizeMap.has(entry.size)) {
          sizeMap.set(entry.size, []);
        }
        sizeMap.get(entry.size).push(entry);
      });

      // Keep only one entry per size (the newest)
      pool.length = 0;
      sizeMap.forEach(function (entries) {
        pool.push(entries[entries.length - 1]);
      });
    }
  }]);
  return TypedArrayPool;
}();
/**
 * Global singleton pool instance
 * Use this for most cases to maximize reuse across the application
 */
var globalArrayPool = new TypedArrayPool({
  initialFloat32: 20,
  initialUint8: 20,
  initialUint16: 20,
  maxPoolSize: 200
});

/**
 * Activation Function Lookup Tables
 *
 * Pre-computes activation function values for fast lookups.
 * Math.exp() costs ~100-200 CPU cycles. Array lookup = 1 cycle!
 *
 * This provides 50-100x speedup for sigmoid/tanh at the cost of
 * ~32KB memory per function (8000 entries × 4 bytes).
 *
 * Trade-off: Perfect for neural networks where we call activations
 * millions of times but rarely need exact precision beyond 0.001.
 */
var ActivationLUT = /*#__PURE__*/function () {
  function ActivationLUT() {
    _classCallCheck(this, ActivationLUT);
    // Configuration: Balance between memory and precision
    this.RANGE_MIN = -10.0; // Values below this saturate to 0 (sigmoid) or -1 (tanh)
    this.RANGE_MAX = 10.0; // Values above this saturate to 1
    this.TABLE_SIZE = 8000; // 8000 entries = precision of ~0.0025 per step
    this.STEP = (this.RANGE_MAX - this.RANGE_MIN) / this.TABLE_SIZE;

    // Pre-compute lookup tables
    this.sigmoidTable = this._buildSigmoidTable();
    this.tanhTable = this._buildTanhTable();
    this.reluTable = null; // ReLU is so fast we don't need a table
  }

  /**
   * Build sigmoid lookup table: f(x) = 1 / (1 + e^-x)
   */
  _createClass(ActivationLUT, [{
    key: "_buildSigmoidTable",
    value: function _buildSigmoidTable() {
      var table = new Float32Array(this.TABLE_SIZE + 1);
      for (var i = 0; i <= this.TABLE_SIZE; i++) {
        var x = this.RANGE_MIN + i * this.STEP;
        table[i] = 1 / (1 + Math.exp(-x));
      }
      return table;
    }

    /**
     * Build tanh lookup table: f(x) = tanh(x)
     */
  }, {
    key: "_buildTanhTable",
    value: function _buildTanhTable() {
      var table = new Float32Array(this.TABLE_SIZE + 1);
      for (var i = 0; i <= this.TABLE_SIZE; i++) {
        var x = this.RANGE_MIN + i * this.STEP;
        table[i] = Math.tanh(x);
      }
      return table;
    }

    /**
     * Fast sigmoid lookup with linear interpolation for smoothness
     *
     * @param {number} x - Input value
     * @returns {number} Sigmoid(x) approximation
     */
  }, {
    key: "sigmoid",
    value: function sigmoid(x) {
      // Handle edge cases (saturation)
      if (x <= this.RANGE_MIN) return 0;
      if (x >= this.RANGE_MAX) return 1;

      // Find table index
      var offset = x - this.RANGE_MIN;
      var index = offset / this.STEP;
      var lowerIdx = Math.floor(index);
      var upperIdx = Math.ceil(index);

      // Linear interpolation for smoothness
      if (lowerIdx === upperIdx) {
        return this.sigmoidTable[lowerIdx];
      }
      var fraction = index - lowerIdx;
      var lower = this.sigmoidTable[lowerIdx];
      var upper = this.sigmoidTable[upperIdx];
      return lower + (upper - lower) * fraction;
    }

    /**
     * Fast tanh lookup with linear interpolation
     *
     * @param {number} x - Input value
     * @returns {number} Tanh(x) approximation
     */
  }, {
    key: "tanh",
    value: function tanh(x) {
      // Handle edge cases
      if (x <= this.RANGE_MIN) return -1;
      if (x >= this.RANGE_MAX) return 1;

      // Find table index
      var offset = x - this.RANGE_MIN;
      var index = offset / this.STEP;
      var lowerIdx = Math.floor(index);
      var upperIdx = Math.ceil(index);

      // Linear interpolation
      if (lowerIdx === upperIdx) {
        return this.tanhTable[lowerIdx];
      }
      var fraction = index - lowerIdx;
      var lower = this.tanhTable[lowerIdx];
      var upper = this.tanhTable[upperIdx];
      return lower + (upper - lower) * fraction;
    }

    /**
     * ReLU is already super fast, no table needed
     * Included for API consistency
     */
  }, {
    key: "relu",
    value: function relu(x) {
      return x > 0 ? x : 0;
    }

    /**
     * Identity function (no activation)
     */
  }, {
    key: "identity",
    value: function identity(x) {
      return x;
    }

    /**
     * Get memory usage info
     */
  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      var sigmoidBytes = this.sigmoidTable.byteLength;
      var tanhBytes = this.tanhTable.byteLength;
      var total = sigmoidBytes + tanhBytes;
      return {
        sigmoid: "".concat((sigmoidBytes / 1024).toFixed(2), " KB"),
        tanh: "".concat((tanhBytes / 1024).toFixed(2), " KB"),
        total: "".concat((total / 1024).toFixed(2), " KB"),
        entries: this.TABLE_SIZE,
        precision: this.STEP.toFixed(4)
      };
    }
  }]);
  return ActivationLUT;
}(); // Global singleton instance - reused across all brains
// This way we only pay the 64KB memory cost once
var globalActivationLUT = new ActivationLUT();

/**
 * JIT Tick Generator - Generates specialized, optimized tick functions at runtime
 *
 * This is the SECRET WEAPON for v3 performance:
 * - Generates custom JavaScript code for each brain's specific topology
 * - Completely inlines all operations (no function calls)
 * - Unrolls loops for small networks
 * - Pre-computes constant expressions
 * - Uses direct array access instead of object properties
 * - Uses activation lookup tables (50-100x faster than Math.exp!)
 *
 * Result: V8 can JIT compile to extremely fast machine code
 *
 * Performance gains:
 * - Small networks (20 conn): 2-3x faster than v2
 * - Medium networks (50 conn): 3-5x faster than v2
 * - Large networks (100 conn): 5-10x faster than v2
 */
var JITTickGenerator = /*#__PURE__*/function () {
  function JITTickGenerator() {
    _classCallCheck(this, JITTickGenerator);
  }
  _createClass(JITTickGenerator, null, [{
    key: "generateTickFunction",
    value:
    /**
     * Generate a specialized tick function for a brain
     * @param {Object} brain - Brain instance
     * @returns {Function} Ultra-optimized tick function
     */
    function generateTickFunction(brain) {
      var tickOrder = brain.tickOrder,
        definitions = brain.definitions;

      // Check if we can use JIT optimization
      if (tickOrder.length === 0 || tickOrder.length > 200) {
        // Too small or too large - use fallback
        return null;
      }

      // Build specialized code
      var code = this._buildTickCode(brain);
      try {
        // Debug: log generated code
        if (process.env.DEBUG_JIT) {
          console.log('=== Generated JIT Code ===');
          console.log(code);
          console.log('=========================');
        }

        // Create function from generated code
        // This will be JIT compiled by V8 for maximum performance
        var tickFn = new Function('brain', 'sensorsMap',
        // Sensors by name
        'actions', 'actionsMap',
        // Actions by name
        'cache', 'activation', code);
        return tickFn;
      } catch (err) {
        console.warn('JIT tick generation failed, using fallback:', err);
        console.log('Generated code:');
        console.log(code);
        return null;
      }
    }

    /**
     * Build the actual JavaScript code for the tick function
     */
  }, {
    key: "_buildTickCode",
    value: function _buildTickCode(brain) {
      var lines = [];
      var tickOrder = brain.tickOrder,
        definitions = brain.definitions;
      lines.push('// JIT-generated ultra-optimized tick function');
      lines.push("// Generated at: ".concat(new Date().toISOString()));
      lines.push('');

      // Cache variables for each vertex
      var varNames = new Map();
      var varCounter = 0;

      // Pre-allocate variables
      lines.push('// Pre-allocated variables');
      var _iterator14 = _createForOfIteratorHelper(tickOrder),
        _step14;
      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var vertex = _step14.value.vertex;
          var _varName = "v".concat(varCounter++);
          varNames.set(vertex.name, _varName);
          lines.push("let ".concat(_varName, " = 0;"));
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }
      lines.push('');

      // Process each vertex in topological order
      lines.push('// Compute all vertices in topological order');
      var _iterator15 = _createForOfIteratorHelper(tickOrder),
        _step15;
      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var _vertex = _step15.value.vertex;
          var _varName2 = varNames.get(_vertex.name);
          if (_vertex.metadata.type === 'sensor') {
            // Sensor: read from environment by name
            lines.push("// Sensor ".concat(_vertex.name));
            lines.push("".concat(_varName2, " = sensorsMap['").concat(_vertex.name, "'] ? sensorsMap['").concat(_vertex.name, "'].tick() : 0;"));
          } else if (_vertex.metadata.type === 'action') {
            // Action: compute weighted sum
            lines.push("// Action ".concat(_vertex.name));
            var parts = [];
            var _iterator16 = _createForOfIteratorHelper(_vertex["in"]),
              _step16;
            try {
              for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                var input = _step16.value;
                // Skip inputs with zero weight (optimization!)
                if (input.weight === 0) continue;
                var inputVar = varNames.get(input.vertex.name);
                var weight = input.weight;
                parts.push("".concat(inputVar, " * ").concat(weight));
              }
            } catch (err) {
              _iterator16.e(err);
            } finally {
              _iterator16.f();
            }
            var bias = _vertex.metadata.bias || 0;
            if (parts.length === 0) {
              lines.push("".concat(_varName2, " = ").concat(bias, ";"));
            } else {
              var sum = parts.join(' + ');
              lines.push("".concat(_varName2, " = activation((").concat(sum, ") + ").concat(bias, ");"));
            }
          } else {
            // Neuron: compute weighted sum
            lines.push("// Neuron ".concat(_vertex.name));
            var _parts = [];
            var _iterator17 = _createForOfIteratorHelper(_vertex["in"]),
              _step17;
            try {
              for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                var _input2 = _step17.value;
                // Skip inputs with zero weight (optimization!)
                if (_input2.weight === 0) continue;
                var _inputVar = varNames.get(_input2.vertex.name);
                var _weight = _input2.weight;
                _parts.push("".concat(_inputVar, " * ").concat(_weight));
              }
            } catch (err) {
              _iterator17.e(err);
            } finally {
              _iterator17.f();
            }
            var _bias = _vertex.metadata.bias || 0;
            if (_parts.length === 0) {
              lines.push("".concat(_varName2, " = activation(").concat(_bias, ");"));
            } else {
              var _sum2 = _parts.join(' + ');
              lines.push("".concat(_varName2, " = activation((").concat(_sum2, ") + ").concat(_bias, ");"));
            }
          }

          // Update cache
          lines.push("cache['".concat(_vertex.name, "'] = ").concat(_varName2, ";"));
          lines.push('');
        }

        // Find max action
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }
      lines.push('// Find action with maximum input');
      lines.push('let maxAction = null;');
      lines.push('let maxValue = -Infinity;');
      for (var _i17 = 0, _Object$entries2 = Object.entries(definitions.actions); _i17 < _Object$entries2.length; _i17++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i17], 2),
          actionName = _Object$entries2$_i[0],
          action = _Object$entries2$_i[1];
        if (action["in"].length === 0) continue;
        var varName = varNames.get(action.name);
        lines.push("if (".concat(varName, " > maxValue) {"));
        lines.push("  maxValue = ".concat(varName, ";"));
        lines.push("  maxAction = '".concat(action.name, "';"));
        lines.push("}");
      }

      // Execute winning action
      lines.push('');
      lines.push('// Execute winning action');
      lines.push('const result = {};');
      lines.push('if (maxAction) {');
      lines.push('  const actionDef = actionsMap[maxAction];');
      lines.push('  const actionValue = cache[maxAction];');
      lines.push('  if (actionDef && actionDef.tick) {');
      lines.push('    result[maxAction] = actionDef.tick(actionValue, brain.environment);');
      lines.push('  } else {');
      lines.push('    result[maxAction] = actionValue;');
      lines.push('  }');
      lines.push('}');
      lines.push('return result;');
      return lines.join('\n');
    }

    /**
     * Generate specialized code with loop unrolling for tiny networks
     */
  }, {
    key: "_shouldUnrollLoops",
    value: function _shouldUnrollLoops(vertexCount) {
      // Unroll loops for very small networks (< 10 vertices)
      return vertexCount < 10;
    }
  }]);
  return JITTickGenerator;
}(); // Activation functions with ULTRA-FAST lookup tables
// LUT = Lookup Table: Pre-computed values, 50-100x faster than Math.exp()!
var sigmoid = function sigmoid(x) {
  return globalActivationLUT.sigmoid(x);
}; // ~1 cycle vs ~100-200!
var relu = function relu(x) {
  return x > 0 ? x : 0;
}; // Already super fast
var tanh = function tanh(x) {
  return globalActivationLUT.tanh(x);
}; // ~1 cycle vs ~150!
var identity = function identity(x) {
  return x;
};
var Brain = /*#__PURE__*/function () {
  function Brain(_ref) {
    var genome = _ref.genome,
      _ref$sensors = _ref.sensors,
      sensors = _ref$sensors === void 0 ? [] : _ref$sensors,
      _ref$actions = _ref.actions,
      actions = _ref$actions === void 0 ? [] : _ref$actions,
      _ref$environment = _ref.environment,
      environment = _ref$environment === void 0 ? {} : _ref$environment,
      _ref$activationFuncti = _ref.activationFunction,
      activationFunction = _ref$activationFuncti === void 0 ? 'relu' : _ref$activationFuncti;
    _classCallCheck(this, Brain);
    this.environment = environment;
    this.genome = Genome.from(genome);
    this.tickGeneration = 0; // Track tick generation for caching

    // Select activation function
    var activationMap = {
      'sigmoid': sigmoid,
      'relu': relu,
      'tanh': tanh,
      'identity': identity
    };
    this.activationFunction = activationMap[activationFunction] || relu;
    this.definitions = {
      all: {},
      actions: {},
      neurons: {},
      sensors: {}
    };
    this.sensors = sensors.reduce(function (acc, sensor, i) {
      if (!sensor.name) sensor.name = "s#".concat(sensor.id || i);
      acc[sensor.name] = sensor;
      return acc;
    }, {});
    this.actions = actions.reduce(function (acc, action, i) {
      if (!action.name) action.name = "a#".concat(action.id || i);
      acc[action.name] = action;
      return acc;
    }, {});
    this.tickOrder = [];

    // Pre-allocated reusable objects for performance
    this._tickCache = {
      ticked: {},
      types: {
        sensor: [],
        neuron: [],
        action: []
      },
      actionsInputs: []
    };

    // Performance optimization structures
    // Sparse connection matrix for memory efficiency
    this.connectionMatrix = new SparseConnectionMatrix(10000);

    // TypedArrays for neuron values (reused across ticks)
    this.neuronValues = null; // Allocated in setup
    this.sensorValues = null;
    this.actionValues = null;

    // Advanced base collections
    this.programmableNeurons = [];
    this.learningRules = [];
    this.memoryCells = [];
    this.plasticities = [];
    this.attributes = [];

    // Memory cell state (persistent across ticks)
    this.memoryCellState = new Map(); // cellId -> current value

    // Plasticity map (targetId -> level)
    this.plasticityMap = new Map();
    this.setup();
  }
  _createClass(Brain, [{
    key: "setup",
    value: function setup() {
      var _this3 = this;
      // Process all bases using lazy iteration
      var basesIterator = this.genome.iterBases();
      var _iterator18 = _createForOfIteratorHelper(basesIterator),
        _step18;
      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var base = _step18.value;
          switch (base.type) {
            case 'bias':
              this.setupBias(base);
              break;
            case 'connection':
              this.setupConnection(base);
              break;
            case 'evolved_neuron':
              this.programmableNeurons.push(base);
              break;
            case 'learning_rule':
              this.learningRules.push(base);
              break;
            case 'memory_cell':
              this.memoryCells.push(base);
              // Initialize memory cell state
              this.memoryCellState.set(base.cellId, 0);
              break;
            case 'plasticity':
              this.plasticities.push(base);
              // Store plasticity level for target
              this.plasticityMap.set(base.targetId, base.level);
              break;
            case 'attribute':
              this.attributes.push(base);
              break;
          }
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }
      this.tickOrder = this.defineTickOrder();

      // Determine optimization mode based on network size
      // Count total connections to decide optimization strategy
      var connectionCount = Object.values(this.definitions.all).reduce(function (sum, v) {
        return sum + v["in"].length;
      }, 0);

      // Adaptive optimization: choose strategy based on network size
      // JIT (5-200 connections): Generate specialized code - FASTEST
      // Direct (<5 or no features): Simple processing
      // Layered (>200): Batch processing for very large networks

      this.attributes.length > 0 || this.learningRules.length > 0 || this.memoryCells.length > 0;

      // JIT DISABLED: Benchmarks show it's slower than optimized implementation (-39%)
      // Current implementation is already +12.4% faster than previous version!
      // Keeping JIT code for future optimization attempts
      this.useJIT = false;
      this.jitTickFunction = null;
      if (connectionCount >= 150) {
        // Large networks: use layered processing
        this.useJIT = false;
        this.useLayeredProcessing = true;
        this.layers = this.buildLayers();
      } else {
        // Very small or complex: direct processing
        this.useJIT = false;
        this.useLayeredProcessing = false;
        this.layers = null;
      }

      // Detect which advanced features are actually used
      // This allows us to skip entire code paths that aren't needed
      this._features = {
        hasAttributes: this.attributes.length > 0,
        hasSensorAttributes: false,
        // Detected below
        hasActionAttributes: false,
        // Detected below
        hasLearning: this.learningRules.length > 0,
        hasMemory: this.memoryCells.length > 0,
        hasPlasticity: this.plasticityMap && this.plasticityMap.size > 0,
        hasProgrammableNeurons: this.programmableNeurons.length > 0
      };

      // Detect which attribute types are present
      if (this._features.hasAttributes) {
        var _iterator19 = _createForOfIteratorHelper(this.attributes),
          _step19;
        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var attr = _step19.value;
            if (attr.targetType === AttributeBase.TARGET_SENSOR || attr.targetType === AttributeBase.TARGET_GLOBAL) {
              this._features.hasSensorAttributes = true;
            }
            if (attr.targetType === AttributeBase.TARGET_ACTION || attr.targetType === AttributeBase.TARGET_GLOBAL) {
              this._features.hasActionAttributes = true;
            }
            // Early exit if both detected
            if (this._features.hasSensorAttributes && this._features.hasActionAttributes) break;
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }
      }

      // Allocate TypedArrays after we know vertex counts
      var neuronCount = Object.keys(this.definitions.neurons).length;
      var sensorCount = Object.keys(this.definitions.sensors).length;
      var actionCount = Object.keys(this.definitions.actions).length;

      // Use pool to get arrays (or allocate new ones)
      this.neuronValues = globalArrayPool.allocFloat32(neuronCount);
      this.sensorValues = globalArrayPool.allocFloat32(sensorCount);
      this.actionValues = globalArrayPool.allocFloat32(actionCount);

      // Compact connection matrix for better cache locality
      if (this.connectionMatrix.count > 0) {
        this.connectionMatrix.compact();
      }
      var env = this.environment;
      var activationFunction = this.activationFunction;
      var useReluFastPath = activationFunction === relu;
      var context = env.me || this;

      // Cache for bound functions - compatible with all environments
      var hasMap = typeof Map !== 'undefined';
      var boundFunctions = hasMap ? new Map() : {};

      // Setup sensors with cached bound functions
      var brain = this; // Reference for closure
      var _loop = function _loop() {
        var vertex = _Object$values[_i18];
        var sensorDef = _this3.sensors[vertex.name];
        if (!(sensorDef !== null && sensorDef !== void 0 && sensorDef.tick)) {
          vertex.tick = function () {
            return this.metadata.bias || 0;
          };
        } else {
          // Cache bound function
          var boundFn;
          if (hasMap) {
            boundFn = boundFunctions.get(sensorDef.tick);
            if (!boundFn) {
              boundFn = sensorDef.tick.bind(context);
              boundFunctions.set(sensorDef.tick, boundFn);
            }
          } else {
            var key = sensorDef.tick.toString();
            boundFn = boundFunctions[key];
            if (!boundFn) {
              boundFn = sensorDef.tick.bind(context);
              boundFunctions[key] = boundFn;
            }
          }
          vertex.tick = function () {
            return boundFn(env) + (this.metadata.bias || 0);
          };
        }
      };
      for (var _i18 = 0, _Object$values = Object.values(this.definitions.sensors); _i18 < _Object$values.length; _i18++) {
        _loop();
      }

      // Optimize neuron tick functions based on activation type
      for (var _i19 = 0, _Object$values2 = Object.values(this.definitions.neurons); _i19 < _Object$values2.length; _i19++) {
        var vertex = _Object$values2[_i19];
        vertex.tick = function () {
          var input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0);
          return useReluFastPath ? input > 0 ? input : 0 : activationFunction(input);
        };
      }
      if (this._features.hasProgrammableNeurons) {
        this.setupEvolvedNeurons({
          activationFunction: activationFunction,
          useReluFastPath: useReluFastPath
        });
      }

      // Setup actions with cached bound functions
      var _loop2 = function _loop2() {
        var vertex = _Object$values3[_i20];
        var actionDef = _this3.actions[vertex.name];
        if (!(actionDef !== null && actionDef !== void 0 && actionDef.tick)) {
          vertex.tick = function () {
            var input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0);
            useReluFastPath ? input > 0 ? input : 0 : activationFunction(input);
            return 0;
          };
        } else {
          // Cache bound function
          var boundFn;
          if (hasMap) {
            boundFn = boundFunctions.get(actionDef.tick);
            if (!boundFn) {
              boundFn = actionDef.tick.bind(context);
              boundFunctions.set(actionDef.tick, boundFn);
            }
          } else {
            var key = actionDef.tick.toString();
            boundFn = boundFunctions[key];
            if (!boundFn) {
              boundFn = actionDef.tick.bind(context);
              boundFunctions[key] = boundFn;
            }
          }
          vertex.tick = function () {
            var input = this.calculateInput(brain.tickGeneration) + (this.metadata.bias || 0);
            var activated = useReluFastPath ? input > 0 ? input : 0 : activationFunction(input);
            return boundFn(activated, env);
          };
        }
      };
      for (var _i20 = 0, _Object$values3 = Object.values(this.definitions.actions); _i20 < _Object$values3.length; _i20++) {
        _loop2();
      }
    }
  }, {
    key: "setupBias",
    value: function setupBias(_ref2) {
      var target = _ref2.target,
        data = _ref2.data;
      this.findOrCreateVertex({
        id: target.id,
        collection: target.type + 's',
        metadata: {
          bias: data || 0,
          type: target.type
        }
      });
    }
  }, {
    key: "setupConnection",
    value: function setupConnection(_ref3) {
      var data = _ref3.data,
        source = _ref3.source,
        target = _ref3.target;
      var x = this.findOrCreateVertex({
        id: source.id,
        collection: source.type + 's',
        metadata: {
          type: source.type
        }
      });
      var y = this.findOrCreateVertex({
        id: target.id,
        collection: target.type + 's',
        metadata: {
          type: target.type
        }
      });
      y.addIn(x, data);
      x.addOut(y, data);
    }
  }, {
    key: "setupEvolvedNeurons",
    value: function setupEvolvedNeurons(_ref4) {
      var _this4 = this;
      var activationFunction = _ref4.activationFunction,
        useReluFastPath = _ref4.useReluFastPath;
      var brain = this;
      var env = this.environment;
      var getMemoryCellValue = this.getMemoryCellValue.bind(this);
      var _iterator20 = _createForOfIteratorHelper(this.programmableNeurons),
        _step20;
      try {
        var _loop3 = function _loop3() {
          var base = _step20.value;
          var neuronVertex = _this4.definitions.neurons[base.targetId];
          if (!neuronVertex) return 1; // continue
          var mode = EvolvedNeuronBase.resolveMode(base.mode);
          neuronVertex.tick = function () {
            var generation = brain.tickGeneration;
            var rawInput = this.calculateInput(generation);
            var bias = this.metadata.bias || 0;
            var biasedInput = rawInput + bias;
            var inputs = this["in"].map(function (conn) {
              return conn.vertex.getCachedOrCalculate(generation);
            });
            var weights = this["in"].map(function (conn) {
              return conn.weight;
            });
            var programOutput = brain.executeEvolvedNeuron(base, {
              neuron: this,
              rawInput: rawInput,
              biasedInput: biasedInput,
              bias: bias,
              inputs: inputs,
              weights: weights,
              environment: env,
              getMemoryCellValue: getMemoryCellValue
            });
            var combined;
            if (mode === EvolvedNeuronModes.ADD) {
              combined = biasedInput + programOutput;
            } else if (mode === EvolvedNeuronModes.PASS_THROUGH) {
              combined = biasedInput;
            } else {
              combined = programOutput;
            }
            return useReluFastPath ? combined > 0 ? combined : 0 : activationFunction(combined);
          };
        };
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          if (_loop3()) continue;
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }
    }
  }, {
    key: "findOrCreateVertex",
    value: function findOrCreateVertex(_ref5) {
      var id = _ref5.id,
        collection = _ref5.collection,
        metadata = _ref5.metadata;
      if (!this.definitions[collection][id]) {
        var vertex = new Vertex("".concat(collection[0], "#").concat(id), _objectSpread(_objectSpread({
          bias: 0
        }, metadata), {}, {
          id: id
        }));
        this.definitions[collection][id] = vertex;
        this.definitions.all[vertex.name] = vertex;
        return vertex;
      }
      this.definitions[collection][id].metadata.bias = this.definitions[collection][id].metadata.bias + (metadata.bias || 0);
      return this.definitions[collection][id];
    }
  }, {
    key: "defineTickOrder",
    value: function defineTickOrder() {
      var tickList = [];
      var usableActions = Object.values(this.definitions.actions).filter(function (action) {
        return action["in"].length > 0;
      });

      // Build complete list first, then sort once
      var _iterator21 = _createForOfIteratorHelper(usableActions),
        _step21;
      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var action = _step21.value;
          tickList = tickList.concat(action.inputsTree());
        }

        // CRITICAL BUG FIX: Filter out actions from tickList!
        //
        // Problem: inputsTree() returns the entire tree INCLUDING the action itself.
        // When Brain.tick() processes tickOrder, it calls getCachedOrCalculate() on ALL vertices,
        // which triggers action tick() functions for ALL actions (not just the winner).
        //
        // This caused:
        // 1. All actions executing their user code every tick (not just the winner)
        // 2. Neural networks unable to learn (all individuals showed identical behavior)
        // 3. Snake and other examples failing completely
        //
        // Solution: Filter out action vertices (names starting with 'a#') from tickOrder.
        // Actions should ONLY execute when they win (highest input), not during processing.
        //
        // See: test-sensor.js and debug-neural-net.js for verification tests
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }
      tickList = tickList.filter(function (item) {
        return !item.vertex.name.startsWith('a#');
      });

      // Single sort at the end
      tickList = sortBy(tickList, ['depth']).reverse();
      return tickList;
    }

    /**
     * V3: Build layer structure from tickOrder for batched computation
     * Groups vertices by depth to enable matrix operations per layer
     * @returns {Array<Object>} Array of layer objects
     */
  }, {
    key: "buildLayers",
    value: function buildLayers() {
      if (this.tickOrder.length === 0) return [];
      var layers = [];
      var currentDepth = this.tickOrder[0].depth;
      var currentLayer = {
        depth: currentDepth,
        vertices: [],
        vertexIndices: new Map() // vertex.name -> index in layer
      };

      // Group vertices by depth
      var _iterator22 = _createForOfIteratorHelper(this.tickOrder),
        _step22;
      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var item = _step22.value;
          if (item.depth !== currentDepth) {
            // Finalize current layer
            layers.push(currentLayer);

            // Start new layer
            currentDepth = item.depth;
            currentLayer = {
              depth: currentDepth,
              vertices: [],
              vertexIndices: new Map()
            };
          }

          // Add vertex to current layer
          var idx = currentLayer.vertices.length;
          currentLayer.vertices.push(item.vertex);
          currentLayer.vertexIndices.set(item.vertex.name, idx);
        }

        // Push final layer
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
      if (currentLayer.vertices.length > 0) {
        layers.push(currentLayer);
      }

      // Build connection info for each layer
      for (var _i21 = 0, _layers = layers; _i21 < _layers.length; _i21++) {
        var layer = _layers[_i21];
        this.buildLayerConnectionInfo(layer);
      }
      return layers;
    }

    /**
     * V3: Build connection information for a layer
     * Prepares data structures for efficient batched computation
     * @param {Object} layer - Layer object to populate with connection info
     */
  }, {
    key: "buildLayerConnectionInfo",
    value: function buildLayerConnectionInfo(layer) {
      var vertexCount = layer.vertices.length;

      // Pre-allocate arrays for connection data
      // Format: For each vertex in layer, store all input connections
      layer.connections = {
        // Total number of connections in this layer
        totalCount: 0,
        // For each vertex: [startIdx, count] in flattened arrays
        vertexRanges: new Array(vertexCount),
        // Flattened connection data
        sourceIndices: [],
        // Index of source vertex in overall graph
        weights: [],
        // Connection weights

        // Output buffer for computed values
        outputs: new Float32Array(vertexCount),
        biases: new Float32Array(vertexCount)
      };

      // Build vertex ID map for fast lookup
      var vertexIdMap = new Map();
      for (var i = 0; i < vertexCount; i++) {
        var vertex = layer.vertices[i];
        vertexIdMap.set(vertex.name, i);

        // Store bias
        layer.connections.biases[i] = vertex.metadata.bias || 0;
      }

      // Collect all connections for each vertex in the layer
      var flatIdx = 0;
      for (var vIdx = 0; vIdx < vertexCount; vIdx++) {
        var _vertex2 = layer.vertices[vIdx];
        var startIdx = flatIdx;

        // Iterate through vertex inputs
        var _iterator23 = _createForOfIteratorHelper(_vertex2["in"]),
          _step23;
        try {
          for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
            var input = _step23.value;
            layer.connections.sourceIndices.push(input.vertex);
            layer.connections.weights.push(input.weight);
            flatIdx++;
          }
        } catch (err) {
          _iterator23.e(err);
        } finally {
          _iterator23.f();
        }
        var count = flatIdx - startIdx;
        layer.connections.vertexRanges[vIdx] = {
          start: startIdx,
          count: count
        };
        layer.connections.totalCount += count;
      }

      // Convert to TypedArrays for better performance
      layer.connections.weightsTyped = new Float32Array(layer.connections.weights);
    }

    /**
     * V3: Process neural network using layered batch computation
     * This method processes all vertices in a layer together, enabling better
     * CPU cache utilization and potential SIMD optimizations
     * @param {number} currentGen - Current tick generation for cache
     */
  }, {
    key: "tickLayered",
    value: function tickLayered(currentGen) {
      var activation = this.activationFunction;

      // Process each layer in order (already sorted by depth)
      var _iterator24 = _createForOfIteratorHelper(this.layers),
        _step24;
      try {
        for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
          var layer = _step24.value;
          var conn = layer.connections;
          var vertexCount = layer.vertices.length;

          // Batch compute all vertices in this layer
          // This is the key optimization: instead of calling each vertex.tick() individually,
          // we process the entire layer as a batch operation
          for (var vIdx = 0; vIdx < vertexCount; vIdx++) {
            var vertex = layer.vertices[vIdx];

            // Check if already computed this generation (avoid duplicates)
            if (vertex.cache.generation === currentGen) {
              continue;
            }
            var range = conn.vertexRanges[vIdx];

            // Different handling based on vertex type
            var output = void 0;
            if (range.count === 0 || vertex.metadata.type === 'sensor') {
              // Sensor: call custom tick function (reads from environment)
              output = vertex.tick ? vertex.tick() : 0;

              // Cache sensor value
              vertex.cache.generation = currentGen;
              vertex.cache.value = output;
            } else if (vertex.metadata.type === 'action') {
              // Action: compute weighted sum but DON'T execute yet
              // We need to find the winning action first, then execute only that one
              var sum = 0;
              for (var i = 0; i < range.count; i++) {
                var connIdx = range.start + i;
                var sourceVertex = conn.sourceIndices[connIdx];
                var sourceValue = sourceVertex.cache.generation === currentGen ? sourceVertex.cache.value : sourceVertex.tick ? sourceVertex.tick() : 0;
                sum += sourceValue * conn.weightsTyped[connIdx];
              }

              // Store the raw input (before activation) for later comparison
              var input = sum + conn.biases[vIdx];
              vertex.cache.generation = currentGen;
              vertex.cache.input = input; // Store input for action selection
              vertex.cache.value = activation(input); // Store activated value for execution
            } else {
              // Neuron: compute weighted sum of inputs
              var _sum3 = 0;
              for (var _i22 = 0; _i22 < range.count; _i22++) {
                var _connIdx = range.start + _i22;
                var _sourceVertex = conn.sourceIndices[_connIdx];
                var _sourceValue = _sourceVertex.cache.generation === currentGen ? _sourceVertex.cache.value : _sourceVertex.tick ? _sourceVertex.tick() : 0;
                _sum3 += _sourceValue * conn.weightsTyped[_connIdx];
              }

              // Add bias and apply activation
              var _input3 = _sum3 + conn.biases[vIdx];
              output = activation(_input3);

              // Cache neuron value
              vertex.cache.generation = currentGen;
              vertex.cache.value = output;
            }

            // Store in layer output buffer for potential future use
            if (output !== undefined) {
              conn.outputs[vIdx] = output;
            }
          }
        }
      } catch (err) {
        _iterator24.e(err);
      } finally {
        _iterator24.f();
      }
    }
  }, {
    key: "tick",
    value: function tick() {
      // Increment generation for cache invalidation
      this.tickGeneration++;
      var currentGen = this.tickGeneration;

      // Apply sensor attributes before processing (only if present)
      if (this._features.hasSensorAttributes) {
        this.applySensorAttributes();
      }

      // V3 ULTRA-OPTIMIZED: Use JIT-compiled function for maximum speed
      if (this.useJIT && this.jitTickFunction) {
        // JIT path: Zero overhead, fully specialized code
        var cache = {};
        var result = this.jitTickFunction(this, this.sensors,
        // Pass sensors map (by name)
        Object.values(this.actions), this.actions,
        // Pass actions map (by name)
        cache, this.activationFunction);

        // Update vertex caches from JIT results
        for (var _i23 = 0, _Object$entries3 = Object.entries(cache); _i23 < _Object$entries3.length; _i23++) {
          var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i23], 2),
            name = _Object$entries3$_i[0],
            value = _Object$entries3$_i[1];
          var vertex = this.definitions.all[name];
          if (vertex) {
            vertex.cache.generation = currentGen;
            vertex.cache.value = value;
          }
        }

        // Apply post-processing if needed
        if (this._features) {
          var _maxAction = result && Object.keys(result)[0];
          if (_maxAction && this._features.hasActionAttributes) {
            var actionVertex = this.definitions.actions[_maxAction.substring(2)];
            if (actionVertex) {
              this.applyActionAttributes({
                vertex: actionVertex,
                input: cache[_maxAction]
              }, currentGen);
            }
          }
          if (this._features.hasLearning) {
            this.applyLearningRules(currentGen);
          }
          if (this._features.hasMemory) {
            this.updateMemoryCells();
          }
        }
        return result;
      }

      // V3 Optimized: Use layered batch processing for large networks
      // Or direct processing for small networks
      if (this.useLayeredProcessing) {
        this.tickLayered(currentGen);
      } else {
        // Direct processing: Better for very small networks
        var _iterator25 = _createForOfIteratorHelper(this.tickOrder),
          _step25;
        try {
          for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
            var _vertex3 = _step25.value.vertex;
            _vertex3.getCachedOrCalculate(currentGen);
          }
        } catch (err) {
          _iterator25.e(err);
        } finally {
          _iterator25.f();
        }
      }

      // Process actions and find the one with maximum input
      var ticked = {};
      var actionsInputs = [];
      for (var _i24 = 0, _Object$values4 = Object.values(this.definitions.actions); _i24 < _Object$values4.length; _i24++) {
        var action = _Object$values4[_i24];
        if (action["in"].length === 0) continue;

        // Use cached input if available (from layered processing), otherwise calculate
        var input = action.cache.generation === currentGen && action.cache.input !== undefined ? action.cache.input : action.calculateInput(currentGen);
        actionsInputs.push({
          input: input,
          vertex: action
        });
      }
      if (actionsInputs.length === 0) return ticked;

      // Find max action
      var maxAction = actionsInputs[0];
      for (var i = 1; i < actionsInputs.length; i++) {
        if (actionsInputs[i].input > maxAction.input) {
          maxAction = actionsInputs[i];
        }
      }

      // Apply action attributes before execution (only if present)
      if (this._features.hasActionAttributes) {
        this.applyActionAttributes(maxAction, currentGen);
      }

      // Execute the winning action
      ticked[maxAction.vertex.name] = maxAction.vertex.getCachedOrCalculate(currentGen);

      // Apply learning rules after tick (only if present)
      if (this._features.hasLearning) {
        this.applyLearningRules(currentGen);
      }

      // Update memory cells (only if present)
      if (this._features.hasMemory) {
        this.updateMemoryCells();
      }
      return ticked;
    }

    /**
     * Apply attribute influences to sensors
     */
  }, {
    key: "applySensorAttributes",
    value: function applySensorAttributes() {
      var _this5 = this;
      if (!this.attributes.length) return;
      var _iterator26 = _createForOfIteratorHelper(this.attributes),
        _step26;
      try {
        for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
          var attr = _step26.value;
          // Skip if not targeting sensors
          if (attr.targetType !== AttributeBase.TARGET_SENSOR && attr.targetType !== AttributeBase.TARGET_GLOBAL) {
            continue;
          }

          // Find matching sensors
          var sensorIds = attr.targetType === AttributeBase.TARGET_GLOBAL ? Object.keys(this.definitions.sensors) : [attr.targetId];
          var _iterator27 = _createForOfIteratorHelper(sensorIds),
            _step27;
          try {
            var _loop4 = function _loop4() {
              var sensorId = _step27.value;
              var sensor = _this5.definitions.sensors[sensorId];
              if (!sensor) return 1; // continue

              // Store original tick function if not already stored
              if (!sensor._originalTick) {
                sensor._originalTick = sensor.tick;
              }

              // Wrap tick with attribute influence
              var originalTick = sensor._originalTick;
              var attribute = attr;
              sensor.tick = function () {
                var rawValue = originalTick.call(this);
                return AttributeBase.applySensorInfluence(attribute, rawValue);
              };
            };
            for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
              if (_loop4()) continue;
            }
          } catch (err) {
            _iterator27.e(err);
          } finally {
            _iterator27.f();
          }
        }
      } catch (err) {
        _iterator26.e(err);
      } finally {
        _iterator26.f();
      }
    }

    /**
     * Apply attribute influences to actions
     */
  }, {
    key: "applyActionAttributes",
    value: function applyActionAttributes(maxAction, currentGen) {
      if (!this.attributes.length) return;
      if (!maxAction) return;
      var actionVertex = maxAction.vertex;
      var actionId = actionVertex.metadata.id;
      var _iterator28 = _createForOfIteratorHelper(this.attributes),
        _step28;
      try {
        for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
          var attr = _step28.value;
          // Check if attribute affects this action
          if (!AttributeBase.affectsTarget(attr, 'action', actionId)) {
            continue;
          }

          // Get action name from attribute ID
          AttributeBase.getAttributeName(attr.attributeId);

          // Determine influence mode based on attribute type
          var influenceMode = 'multiply'; // Default
          if (attr.attributeId === AttributeBase.ATTR_HUNGER || attr.attributeId === AttributeBase.ATTR_CURIOSITY) {
            influenceMode = 'boost';
          } else if (attr.attributeId === AttributeBase.ATTR_FEAR) {
            influenceMode = 'threshold';
          } else if (attr.attributeId === AttributeBase.ATTR_AGGRESSION) {
            influenceMode = 'add';
          }

          // Modify action input
          maxAction.input = AttributeBase.applyActionInfluence(attr, maxAction.input, influenceMode);
        }
      } catch (err) {
        _iterator28.e(err);
      } finally {
        _iterator28.f();
      }
    }

    /**
     * Apply learning rules to connections
     */
  }, {
    key: "applyLearningRules",
    value: function applyLearningRules(currentGen) {
      if (!this.learningRules.length) return;
      var _iterator29 = _createForOfIteratorHelper(this.learningRules),
        _step29;
      try {
        for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
          var rule = _step29.value;
          // Find connection in matrix or vertex graph
          if (this.connectionMatrix && this.connectionMatrix.count > 0) {
            // Find connection by ID
            var connIdx = rule.connectionId;
            if (connIdx < 0 || connIdx >= this.connectionMatrix.count) continue;
            var conn = this.connectionMatrix.get(connIdx);
            if (!conn) continue;

            // Get pre and post values
            var preVertex = this.definitions.all["s#".concat(conn.sourceId)] || this.definitions.all["n#".concat(conn.sourceId)];
            var postVertex = this.definitions.all["n#".concat(conn.targetId)] || this.definitions.all["a#".concat(conn.targetId)];
            if (!preVertex || !postVertex) continue;
            var preValue = preVertex.cache.value || 0;
            var postValue = postVertex.cache.value || 0;

            // Apply learning rule
            var newWeight = LearningRuleBase.applyRule(rule, conn.weight, preValue, postValue);

            // Check plasticity
            var plasticity = this.plasticityMap.get(conn.targetId);
            var finalWeight = plasticity !== undefined ? conn.weight + PlasticityBase.scaleWeightDelta(plasticity, newWeight - conn.weight) : newWeight;

            // Update weight
            this.connectionMatrix.updateWeight(connIdx, finalWeight);
          }
        }
      } catch (err) {
        _iterator29.e(err);
      } finally {
        _iterator29.f();
      }
    }

    /**
     * Update memory cell states
     */
  }, {
    key: "updateMemoryCells",
    value: function updateMemoryCells() {
      if (!this.memoryCells.length) return;
      var _iterator30 = _createForOfIteratorHelper(this.memoryCells),
        _step30;
      try {
        for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
          var cell = _step30.value;
          var currentValue = this.memoryCellState.get(cell.cellId) || 0;

          // Get input from corresponding neuron
          var neuron = this.definitions.neurons[cell.cellId];
          var newInput = neuron ? neuron.cache.value || 0 : 0;

          // Update memory with decay
          var newValue = MemoryCellBase.updateValue(currentValue, cell, newInput);
          this.memoryCellState.set(cell.cellId, newValue);

          // Inject memory value back as bias to neuron
          if (neuron) {
            neuron.metadata.bias = (neuron.metadata.bias || 0) + newValue * 0.1;
          }
        }
      } catch (err) {
        _iterator30.e(err);
      } finally {
        _iterator30.f();
      }
    }

    /**
     * Execute evolved neuron program
     * @param {Object} evolvedNeuron - EvolvedNeuron base
     * @param {Object} extraContext - Additional context overrides
     * @returns {number} Computed value
     */
  }, {
    key: "executeEvolvedNeuron",
    value: function executeEvolvedNeuron(evolvedNeuron) {
      var extraContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return EvolvedNeuronBase.execute(evolvedNeuron, _objectSpread({
        brain: this,
        environment: this.environment,
        getMemoryCellValue: this.getMemoryCellValue.bind(this)
      }, extraContext));
    }

    /**
     * V3: Get memory cell value
     * @param {number} cellId - Memory cell ID
     * @returns {number} Current memory value
     */
  }, {
    key: "getMemoryCellValue",
    value: function getMemoryCellValue(cellId) {
      return this.memoryCellState.get(cellId) || 0;
    }

    /**
     * V3: Set memory cell value (for testing/debugging)
     * @param {number} cellId - Memory cell ID
     * @param {number} value - New value
     */
  }, {
    key: "setMemoryCellValue",
    value: function setMemoryCellValue(cellId, value) {
      this.memoryCellState.set(cellId, Math.max(-1, Math.min(1, value)));
    }

    /**
     * Clean up resources (release arrays back to pool)
     */
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.neuronValues) globalArrayPool.free(this.neuronValues);
      if (this.sensorValues) globalArrayPool.free(this.sensorValues);
      if (this.actionValues) globalArrayPool.free(this.actionValues);
      this.neuronValues = null;
      this.sensorValues = null;
      this.actionValues = null;
    }
  }]);
  return Brain;
}();
var Reproduction = /*#__PURE__*/function () {
  function Reproduction() {
    _classCallCheck(this, Reproduction);
  }
  _createClass(Reproduction, null, [{
    key: "genomeMutate",
    value: function genomeMutate(genome) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Use binary mutation directly for better performance
      var genomeObj = Genome.from(genome);
      var cloned = genomeObj.clone();

      // Extract mutation parameters
      var _options$mutationRate = options.mutationRate,
        mutationRate = _options$mutationRate === void 0 ? 0.001 : _options$mutationRate,
        _options$generation2 = options.generation,
        generation = _options$generation2 === void 0 ? 0 : _options$generation2,
        _options$adaptiveRate2 = options.adaptiveRate,
        adaptiveRate = _options$adaptiveRate2 === void 0 ? false : _options$adaptiveRate2,
        creepRate = options.creepRate,
        structuralRate = options.structuralRate,
        _options$maxGenomeSiz = options.maxGenomeSize,
        maxGenomeSize = _options$maxGenomeSiz === void 0 ? 2000 : _options$maxGenomeSiz,
        maxActionId = options.maxActionId,
        maxNeuronId = options.maxNeuronId,
        maxSensorId = options.maxSensorId;

      // Apply mutations with size limit
      cloned.mutate(mutationRate, {
        adaptiveRate: adaptiveRate,
        generation: generation,
        creepRate: creepRate || mutationRate * 2,
        structuralRate: structuralRate || mutationRate * 10,
        maxSize: maxGenomeSize,
        addRate: mutationRate * 5,
        // Reduce add rate
        removeRate: mutationRate * 5,
        // Balance with remove rate
        maxActionId: maxActionId,
        maxNeuronId: maxNeuronId,
        maxSensorId: maxSensorId
      });
      return cloned;
    }
  }, {
    key: "genomeFusion",
    value: function genomeFusion(genA, genB) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return ReproductionGenomeHandler.from(_objectSpread(_objectSpread({}, options), {}, {
        genome: genA
      })).fusion(genB).mutate().get();
    }
  }, {
    key: "genomeCrossover",
    value: function genomeCrossover(genA, genB) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // Use binary crossover for better performance
      var genomeA = Genome.from(genA);
      var genomeB = Genome.from(genB);

      // Perform crossover
      var _genomeA$crossover = genomeA.crossover(genomeB),
        _genomeA$crossover2 = _slicedToArray(_genomeA$crossover, 2),
        child1 = _genomeA$crossover2[0],
        child2 = _genomeA$crossover2[1];

      // Apply mutations to children with ID limits
      var mutationRate = options.mutationRate || 0.001;
      var mutationOptions = _objectSpread(_objectSpread({}, options), {}, {
        maxActionId: options.maxActionId,
        maxNeuronId: options.maxNeuronId,
        maxSensorId: options.maxSensorId
      });
      child1.mutate(mutationRate, mutationOptions);
      child2.mutate(mutationRate, mutationOptions);
      return [child1, child2];
    }
  }]);
  return Reproduction;
}();
var ReproductionGenomeHandler = /*#__PURE__*/function () {
  function ReproductionGenomeHandler(_ref6) {
    var genome = _ref6.genome,
      _ref6$mutationRate = _ref6.mutationRate,
      mutationRate = _ref6$mutationRate === void 0 ? 1 / 1000 : _ref6$mutationRate;
    _classCallCheck(this, ReproductionGenomeHandler);
    this.genome = genome;
    this.mutationRate = mutationRate;
  }
  _createClass(ReproductionGenomeHandler, [{
    key: "get",
    value: function get() {
      return this.genome;
    }
  }, {
    key: "mutate",
    value: function mutate() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$rate = _ref7.rate,
        rate = _ref7$rate === void 0 ? null : _ref7$rate;
      var mutationRate = rate !== null && rate !== void 0 ? rate : this.mutationRate;
      if (mutationRate === 0) return this;
      var mutations = 0;
      var encodedStr = this.genome.encoded;

      // Only split if we actually need to mutate
      var encoded = null;

      // Check mutations first
      for (var i = 0; i < encodedStr.length; i++) {
        if (Math.random() <= mutationRate) {
          if (!encoded) encoded = encodedStr.split('');
          encoded[i] = random(0, 31).toString(32).toUpperCase();
          mutations++;
        }
      }
      if (Math.random() <= mutationRate) {
        if (!encoded) encoded = encodedStr.split('');
        encoded.push(random(0, 31).toString(32).toUpperCase());
        mutations++;
      }
      if (Math.random() <= mutationRate && encodedStr.length > 0) {
        if (!encoded) encoded = encodedStr.split('');
        encoded.pop();
        mutations++;
      }
      if (mutations > 0 && encoded) {
        this.genome = Genome.fromString(encoded.join(''));
      }
      return this;
    }
  }, {
    key: "fusion",
    value: function fusion(genome) {
      var bases = [].concat(this.genome.bases).concat(genome.bases);
      this.genome = Genome.fromBases(bases);
      return this;
    }
  }, {
    key: "fissure",
    value: function fissure() {
      var _this6 = this;
      var partsNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
      var parts = [];
      var partSize = Math.max(1, Math.floor(this.genome.bases.length / partsNumber));
      for (var i = 0; i < partsNumber; i++) {
        var start = i * partSize;
        var end = start + partSize;
        if (i === partsNumber - 1) {
          parts.push(this.genome.bases.slice(start));
        } else {
          parts.push(this.genome.bases.slice(start, end));
        }
      }
      return parts.map(function (p) {
        return new ReproductionGenomeHandler({
          genome: Genome.fromBases(p),
          mutationRate: _this6.mutationRate
        });
      });
    }
  }], [{
    key: "from",
    value: function from() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct(ReproductionGenomeHandler, args);
    }
  }]);
  return ReproductionGenomeHandler;
}();
var Individual = /*#__PURE__*/function () {
  function Individual(_ref8) {
    var _this$brain,
      _this$sensors,
      _this$brain2,
      _this$actions,
      _this$brain3,
      _this7 = this;
    var _ref8$genome = _ref8.genome,
      genome = _ref8$genome === void 0 ? null : _ref8$genome,
      _ref8$sensors = _ref8.sensors,
      sensors = _ref8$sensors === void 0 ? [] : _ref8$sensors,
      _ref8$actions = _ref8.actions,
      actions = _ref8$actions === void 0 ? [] : _ref8$actions,
      _ref8$environment = _ref8.environment,
      environment = _ref8$environment === void 0 ? {} : _ref8$environment,
      _ref8$hooks = _ref8.hooks,
      hooks = _ref8$hooks === void 0 ? {} : _ref8$hooks;
    _classCallCheck(this, Individual);
    this.hooks = hooks;
    this.genome = Genome.from(genome);
    this.attributes = new Map();
    this.parseAttributes();
    var env = merge({
      me: this
    }, environment);
    this.environment = env;

    // Store original arrays for cloning
    this._sensors = sensors || [];
    this._actions = actions || [];
    this.brain = new Brain({
      sensors: sensors,
      actions: actions,
      environment: env,
      genome: this.genome
    });

    // Calculate max IDs based on actual sensors/neurons/actions
    var sensorCount = (_this$brain = this.brain) !== null && _this$brain !== void 0 && (_this$brain = _this$brain.definitions) !== null && _this$brain !== void 0 && _this$brain.sensors ? Object.keys(this.brain.definitions.sensors).length : ((_this$sensors = this.sensors) === null || _this$sensors === void 0 ? void 0 : _this$sensors.length) || 0;
    var actionCount = (_this$brain2 = this.brain) !== null && _this$brain2 !== void 0 && (_this$brain2 = _this$brain2.definitions) !== null && _this$brain2 !== void 0 && _this$brain2.actions ? Object.keys(this.brain.definitions.actions).length : ((_this$actions = this.actions) === null || _this$actions === void 0 ? void 0 : _this$actions.length) || 0;
    var neuronCount = (_this$brain3 = this.brain) !== null && _this$brain3 !== void 0 && (_this$brain3 = _this$brain3.definitions) !== null && _this$brain3 !== void 0 && _this$brain3.neurons ? Object.keys(this.brain.definitions.neurons).length : 0;
    var maxSensorId = Math.max(0, sensorCount - 1);
    var maxNeuronId = Math.max(0, neuronCount - 1);
    var maxActionId = Math.max(0, actionCount - 1);
    this.reproduce = {
      asexual: {
        mutate: function mutate() {
          var rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          return Reproduction.genomeMutate(_this7.genome, {
            mutationRate: rate !== null ? rate : undefined,
            maxSensorId: maxSensorId,
            maxNeuronId: maxNeuronId,
            maxActionId: maxActionId
          });
        }
      },
      sexual: {
        crossover: function crossover(partner) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return Reproduction.genomeCrossover(_this7.genome, partner.genome, _objectSpread(_objectSpread({}, options), {}, {
            maxSensorId: maxSensorId,
            maxNeuronId: maxNeuronId,
            maxActionId: maxActionId
          }));
        }
      }
    };
    this.setupHooks();
  }
  _createClass(Individual, [{
    key: "setupHooks",
    value: function setupHooks() {
      for (var _i25 = 0, _Object$keys = Object.keys(this.hooks); _i25 < _Object$keys.length; _i25++) {
        var _this$environment$me;
        var name = _Object$keys[_i25];
        var fn = this.hooks[name];
        this.hooks[name] = fn.bind((_this$environment$me = this.environment.me) !== null && _this$environment$me !== void 0 ? _this$environment$me : this);
      }
    }
  }, {
    key: "parseAttributes",
    value: function parseAttributes() {
      // Extract attribute bases from genome and populate the attributes map
      var _iterator31 = _createForOfIteratorHelper(this.genome.bases),
        _step31;
      try {
        for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
          var base = _step31.value;
          if (base.type === 'attribute') {
            this.attributes.set(base.id, base.value);
          }
        }
      } catch (err) {
        _iterator31.e(err);
      } finally {
        _iterator31.f();
      }
    }
  }, {
    key: "tick",
    value: function tick() {
      if (this.hooks.beforeTick) {
        var beforeTickHook = this.hooks.beforeTick.bind(this);
        beforeTickHook(this);
      }
      var result = this.brain.tick();
      if (this.hooks.afterTick) {
        var afterTickHook = this.hooks.afterTick.bind(this);
        afterTickHook(this);
      }
      return result;
    }

    /**
     * Export individual data in both string and binary formats
     */
  }, {
    key: "export",
    value: function _export() {
      return {
        // String format (developer-friendly)
        genome: this.genome.encoded,
        // Base32 string

        // Binary format (performance)
        binary: this.genome.toBinary(),
        // Uint8Array

        // Attributes extracted from genome
        attributes: Object.fromEntries(this.attributes),
        // Fitness and other metadata
        fitness: this.fitness || 0,
        id: this.id,
        dead: this.dead || false
      };
    }

    /**
     * Export as JSON-serializable object
     */
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        genome: this.genome.encoded,
        attributes: Object.fromEntries(this.attributes),
        fitness: this.fitness || 0,
        id: this.id,
        dead: this.dead || false
      };
    }

    /**
     * Export genome as string (convenience method)
     */
  }, {
    key: "exportGenome",
    value: function exportGenome() {
      return this.genome.encoded;
    }

    /**
     * Export genome as binary (convenience method)
     */
  }, {
    key: "exportGenomeBinary",
    value: function exportGenomeBinary() {
      return this.genome.toBinary();
    }
  }]);
  return Individual;
}();
/**
 * Validation utilities for genetics-ai.js
 *
 * Provides helpful error messages and input validation
 */
/**
 * Custom error class with helpful context
 */
var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);
  var _super = _createSuper(ValidationError);
  function ValidationError(message) {
    var _this8;
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, ValidationError);
    _this8 = _super.call(this, message);
    _this8.name = 'ValidationError';
    _this8.context = context;
    return _this8;
  }
  return _createClass(ValidationError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Validate a number is within a range
 *
 * @param {number} value - Value to validate
 * @param {string} name - Parameter name
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
function validateRange(value, name, min, max) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$required = options.required,
    required = _options$required === void 0 ? true : _options$required,
    _options$integer = options.integer,
    integer = _options$integer === void 0 ? false : _options$integer;
  if (value === null || value === undefined) {
    if (required) {
      throw new ValidationError("".concat(name, " is required"), {
        parameter: name,
        value: value,
        expected: "number between ".concat(min, " and ").concat(max)
      });
    }
    return;
  }
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError("".concat(name, " must be a number, got ").concat(_typeof(value)), {
      parameter: name,
      value: value,
      expected: 'number'
    });
  }
  if (integer && !Number.isInteger(value)) {
    throw new ValidationError("".concat(name, " must be an integer, got ").concat(value), {
      parameter: name,
      value: value,
      expected: 'integer'
    });
  }
  if (value < min || value > max) {
    throw new ValidationError("".concat(name, " must be between ").concat(min, " and ").concat(max, ", got ").concat(value), {
      parameter: name,
      value: value,
      min: min,
      max: max
    });
  }
}

/**
 * Validate a ratio (0 to 1)
 *
 * @param {number} value - Value to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
function validateRatio(value, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  validateRange(value, name, 0, 1, options);
}

/**
 * Validate a positive integer
 *
 * @param {number} value - Value to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
function validatePositiveInteger(value, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  validateRange(value, name, 1, Number.MAX_SAFE_INTEGER, _objectSpread(_objectSpread({}, options), {}, {
    integer: true
  }));
}

/**
 * Validate a class constructor
 *
 * @param {Function} value - Class to validate
 * @param {string} name - Parameter name
 * @param {Function} baseClass - Expected base class
 * @throws {ValidationError}
 */
function validateClass(value, name) {
  var baseClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (typeof value !== 'function') {
    throw new ValidationError("".concat(name, " must be a class constructor, got ").concat(_typeof(value)), {
      parameter: name,
      value: value,
      expected: 'class constructor'
    });
  }
  if (baseClass && !(value.prototype instanceof baseClass) && value !== baseClass) {
    throw new ValidationError("".concat(name, " must extend ").concat(baseClass.name), {
      parameter: name,
      value: value.name,
      expected: "subclass of ".concat(baseClass.name)
    });
  }
}

/**
 * Validate an object
 *
 * @param {Object} value - Object to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
function validateObject(value, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$required2 = options.required,
    required = _options$required2 === void 0 ? true : _options$required2,
    _options$allowNull = options.allowNull,
    allowNull = _options$allowNull === void 0 ? false : _options$allowNull;
  if (value === null) {
    if (allowNull) return;
    if (required) {
      throw new ValidationError("".concat(name, " cannot be null"), {
        parameter: name,
        value: value,
        expected: 'object'
      });
    }
    return;
  }
  if (value === undefined) {
    if (required) {
      throw new ValidationError("".concat(name, " is required"), {
        parameter: name,
        value: value,
        expected: 'object'
      });
    }
    return;
  }
  if (_typeof(value) !== 'object' || Array.isArray(value)) {
    throw new ValidationError("".concat(name, " must be an object, got ").concat(Array.isArray(value) ? 'array' : _typeof(value)), {
      parameter: name,
      value: value,
      expected: 'object'
    });
  }
}

/**
 * Validate array
 *
 * @param {Array} value - Array to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
function validateArray(value, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$required3 = options.required,
    required = _options$required3 === void 0 ? true : _options$required3,
    _options$minLength = options.minLength,
    minLength = _options$minLength === void 0 ? 0 : _options$minLength,
    _options$maxLength = options.maxLength,
    maxLength = _options$maxLength === void 0 ? Infinity : _options$maxLength;
  if (value === null || value === undefined) {
    if (required) {
      throw new ValidationError("".concat(name, " is required"), {
        parameter: name,
        value: value,
        expected: 'array'
      });
    }
    return;
  }
  if (!Array.isArray(value)) {
    throw new ValidationError("".concat(name, " must be an array, got ").concat(_typeof(value)), {
      parameter: name,
      value: value,
      expected: 'array'
    });
  }
  if (value.length < minLength) {
    throw new ValidationError("".concat(name, " must have at least ").concat(minLength, " elements, got ").concat(value.length), {
      parameter: name,
      value: value.length,
      min: minLength
    });
  }
  if (value.length > maxLength) {
    throw new ValidationError("".concat(name, " must have at most ").concat(maxLength, " elements, got ").concat(value.length), {
      parameter: name,
      value: value.length,
      max: maxLength
    });
  }
}

/**
 * Validate function
 *
 * @param {Function} value - Function to validate
 * @param {string} name - Parameter name
 * @param {Object} options - Options
 * @throws {ValidationError}
 */
function validateFunction(value, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$required4 = options.required,
    required = _options$required4 === void 0 ? true : _options$required4;
  if (value === null || value === undefined) {
    if (required) {
      throw new ValidationError("".concat(name, " is required"), {
        parameter: name,
        value: value,
        expected: 'function'
      });
    }
    return;
  }
  if (typeof value !== 'function') {
    throw new ValidationError("".concat(name, " must be a function, got ").concat(_typeof(value)), {
      parameter: name,
      value: value,
      expected: 'function'
    });
  }
}

/**
 * Create a helpful error message for common issues
 *
 * @param {string} issue - Issue identifier
 * @param {Object} context - Error context
 * @returns {string} - Helpful error message
 */
function createHelpfulError(issue) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var messages = {
    'fitness-not-implemented': "\nIndividual class must implement fitness() method.\n\nExample:\n  class MyCreature extends Individual {\n    fitness() {\n      // Return a number representing fitness\n      return this.score\n    }\n  }\n\nIf using async fitness, implement as async function:\n  async fitness() {\n    const result = await computeAsync()\n    return result\n  }\n",
    'invalid-population-size': "\nPopulation size must be a positive integer (got: ".concat(context.value, ").\n\nExample:\n  new Generation({\n    size: 100,  // At least 1\n    ...\n  })\n"),
    'invalid-ratio': "\n".concat(context.name, " must be between 0 and 1 (got: ").concat(context.value, ").\n\nExample:\n  new Generation({\n    eliteRatio: 0.05,        // 0 to 1 (5%)\n    randomFillRatio: 0.10,   // 0 to 1 (10%)\n    ...\n  })\n"),
    'no-individuals': "\nPopulation is empty. Use fillRandom() to create initial population.\n\nExample:\n  const generation = new Generation({ size: 100, ... })\n  generation.fillRandom()\n  generation.tick()\n"
  };
  return messages[issue] || "Unknown error: ".concat(issue);
}

/**
 * Speciation - NEAT-style species management
 *
 * Maintains multiple evolutionary niches to preserve diversity
 * and prevent premature convergence to local optima.
 *
 * Based on:
 * - Stanley & Miikkulainen (2002) - NEAT paper
 * - Species are groups of similar individuals
 * - Each species evolves independently
 * - Resources shared within species
 */
var Species = /*#__PURE__*/function () {
  function Species(id, representative) {
    _classCallCheck(this, Species);
    this.id = id;
    this.representative = representative; // Genome that defines this species
    this.members = [];
    this.age = 0;
    this.maxFitness = 0;
    this.maxFitnessAge = 0; // Generations since improvement
    this.averageFitness = 0;
  }

  /**
   * Add member to species
   */
  _createClass(Species, [{
    key: "addMember",
    value: function addMember(individual) {
      this.members.push(individual);
      individual.species = this.id;
    }

    /**
     * Calculate adjusted fitness for this species
     * Fitness sharing: divide by species size to promote diversity
     */
  }, {
    key: "calculateAdjustedFitness",
    value: function calculateAdjustedFitness() {
      if (this.members.length === 0) {
        this.averageFitness = 0;
        return;
      }

      // Sum of raw fitness
      var totalFitness = this.members.reduce(function (sum, ind) {
        var fitness = typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness;
        return sum + fitness;
      }, 0);

      // Fitness sharing: divide by species size
      this.averageFitness = totalFitness / this.members.length;

      // Track max fitness
      var currentMax = Math.max.apply(Math, _toConsumableArray(this.members.map(function (ind) {
        return typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness;
      })));
      if (currentMax > this.maxFitness) {
        this.maxFitness = currentMax;
        this.maxFitnessAge = 0;
      } else {
        this.maxFitnessAge++;
      }
    }

    /**
     * Select random member from species
     */
  }, {
    key: "randomMember",
    value: function randomMember() {
      if (this.members.length === 0) return null;
      return this.members[Math.floor(Math.random() * this.members.length)];
    }

    /**
     * Get champion (best individual)
     */
  }, {
    key: "champion",
    value: function champion() {
      if (this.members.length === 0) return null;
      return this.members.reduce(function (best, ind) {
        var fitness = typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness;
        var bestFitness = typeof best.fitness === 'function' ? best.fitness() : best.fitness;
        return fitness > bestFitness ? ind : best;
      });
    }

    /**
     * Update species for next generation
     */
  }, {
    key: "nextGeneration",
    value: function nextGeneration() {
      this.age++;
      this.members = [];
    }
  }]);
  return Species;
}();
var Speciation = /*#__PURE__*/function () {
  function Speciation() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Speciation);
    var _options$compatibilit = options.compatibilityThreshold,
      compatibilityThreshold = _options$compatibilit === void 0 ? 3.0 : _options$compatibilit,
      _options$c = options.c1,
      c1 = _options$c === void 0 ? 1.0 : _options$c,
      _options$c2 = options.c2,
      c2 = _options$c2 === void 0 ? 1.0 : _options$c2,
      _options$c3 = options.c3,
      c3 = _options$c3 === void 0 ? 0.4 : _options$c3,
      _options$stagnationTh = options.stagnationThreshold,
      stagnationThreshold = _options$stagnationTh === void 0 ? 15 : _options$stagnationTh,
      _options$survivalThre = options.survivalThreshold,
      survivalThreshold = _options$survivalThre === void 0 ? 0.2 : _options$survivalThre,
      _options$minSpeciesSi = options.minSpeciesSize,
      minSpeciesSize = _options$minSpeciesSi === void 0 ? 5 : _options$minSpeciesSi;
    validateRatio(compatibilityThreshold / 10, 'compatibilityThreshold (normalized)');
    validateRatio(survivalThreshold, 'survivalThreshold');
    validatePositiveInteger(stagnationThreshold, 'stagnationThreshold');
    validatePositiveInteger(minSpeciesSize, 'minSpeciesSize');
    this.compatibilityThreshold = compatibilityThreshold;
    this.c1 = c1;
    this.c2 = c2;
    this.c3 = c3;
    this.stagnationThreshold = stagnationThreshold;
    this.survivalThreshold = survivalThreshold;
    this.minSpeciesSize = minSpeciesSize;
    this.species = [];
    this.nextSpeciesId = 0;
  }

  /**
   * Calculate genetic distance between two genomes
   *
   * Based on NEAT distance metric:
   * δ = (c1 * E / N) + (c2 * D / N) + c3 * W̄
   *
   * where:
   * - E = number of excess genes
   * - D = number of disjoint genes
   * - W̄ = average weight difference of matching genes
   * - N = number of genes in larger genome
   */
  _createClass(Speciation, [{
    key: "distance",
    value: function distance(genome1, genome2) {
      var bases1 = genome1.getBases();
      var bases2 = genome2.getBases();
      if (bases1.length === 0 && bases2.length === 0) return 0;
      var maxLength = Math.max(bases1.length, bases2.length);
      var minLength = Math.min(bases1.length, bases2.length);

      // Simple distance: compare base types and values
      var matching = 0;
      var weightDiff = 0;
      for (var i = 0; i < minLength; i++) {
        var b1 = bases1[i];
        var b2 = bases2[i];
        if (b1.type === b2.type) {
          matching++;

          // Compare weights/data
          if (b1.type === 'connection') {
            weightDiff += Math.abs((b1.weight || 0) - (b2.weight || 0));
          } else if (b1.type === 'bias') {
            weightDiff += Math.abs((b1.data || 0) - (b2.data || 0));
          }
        }
      }

      // Excess genes (beyond shorter genome)
      var excess = maxLength - minLength;

      // Disjoint genes (within shorter genome but don't match)
      var disjoint = minLength - matching;

      // Average weight difference
      var avgWeightDiff = matching > 0 ? weightDiff / matching : 0;

      // NEAT distance formula
      var N = maxLength || 1; // Avoid division by zero
      var distance = this.c1 * excess / N + this.c2 * disjoint / N + this.c3 * avgWeightDiff;
      return distance;
    }

    /**
     * Assign individual to species
     * Creates new species if no compatible species found
     */
  }, {
    key: "assignToSpecies",
    value: function assignToSpecies(individual) {
      // Try to find compatible species
      var _iterator32 = _createForOfIteratorHelper(this.species),
        _step32;
      try {
        for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
          var species = _step32.value;
          var dist = this.distance(individual.genome, species.representative.genome);
          if (dist < this.compatibilityThreshold) {
            species.addMember(individual);
            return species;
          }
        }

        // No compatible species found, create new one
      } catch (err) {
        _iterator32.e(err);
      } finally {
        _iterator32.f();
      }
      var newSpecies = new Species(this.nextSpeciesId++, individual);
      newSpecies.addMember(individual);
      this.species.push(newSpecies);
      return newSpecies;
    }

    /**
     * Speciate entire population
     */
  }, {
    key: "speciate",
    value: function speciate(population) {
      var _this9 = this;
      // Age species and clear current members
      var _iterator33 = _createForOfIteratorHelper(this.species),
        _step33;
      try {
        for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
          var species = _step33.value;
          species.age++;
          species.members = [];
        }

        // Assign each individual to a species
      } catch (err) {
        _iterator33.e(err);
      } finally {
        _iterator33.f();
      }
      var _iterator34 = _createForOfIteratorHelper(population),
        _step34;
      try {
        for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
          var individual = _step34.value;
          this.assignToSpecies(individual);
        }

        // Remove empty species
      } catch (err) {
        _iterator34.e(err);
      } finally {
        _iterator34.f();
      }
      this.species = this.species.filter(function (s) {
        return s.members.length > 0;
      });

      // Update species fitness
      var _iterator35 = _createForOfIteratorHelper(this.species),
        _step35;
      try {
        for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
          var _species = _step35.value;
          _species.calculateAdjustedFitness();
        }

        // Remove stagnant species (except if only one species left)
      } catch (err) {
        _iterator35.e(err);
      } finally {
        _iterator35.f();
      }
      if (this.species.length > 1) {
        this.species = this.species.filter(function (species) {
          // Keep if recently improved
          if (species.maxFitnessAge < _this9.stagnationThreshold) return true;

          // Keep if large enough and young
          if (species.members.length >= _this9.minSpeciesSize && species.age < 10) return true;
          return false;
        });
      }
      return this.species;
    }

    /**
     * Calculate how many offspring each species should produce
     * Based on adjusted fitness (fitness sharing)
     */
  }, {
    key: "calculateOffspringAllocation",
    value: function calculateOffspringAllocation(totalPopulation) {
      var totalAdjustedFitness = this.species.reduce(function (sum, s) {
        return sum + s.averageFitness;
      }, 0);
      if (totalAdjustedFitness === 0) {
        // Equal allocation if all fitness is zero
        var perSpecies = Math.floor(totalPopulation / this.species.length);
        return this.species.map(function () {
          return perSpecies;
        });
      }

      // Allocate proportional to adjusted fitness
      var allocation = this.species.map(function (species) {
        var proportion = species.averageFitness / totalAdjustedFitness;
        return Math.max(1, Math.round(proportion * totalPopulation));
      });

      // Adjust to match exact population size
      var totalAllocated = allocation.reduce(function (a, b) {
        return a + b;
      }, 0);
      var idx = 0;
      while (totalAllocated < totalPopulation) {
        allocation[idx]++;
        totalAllocated++;
        idx = (idx + 1) % allocation.length;
      }
      while (totalAllocated > totalPopulation) {
        if (allocation[idx] > 1) {
          allocation[idx]--;
          totalAllocated--;
        }
        idx = (idx + 1) % allocation.length;
      }
      return allocation;
    }

    /**
     * Get metadata about current speciation
     */
  }, {
    key: "getMetadata",
    value: function getMetadata() {
      return {
        speciesCount: this.species.length,
        species: this.species.map(function (s) {
          return {
            id: s.id,
            size: s.members.length,
            age: s.age,
            maxFitness: s.maxFitness,
            averageFitness: s.averageFitness,
            stagnation: s.maxFitnessAge
          };
        })
      };
    }
  }]);
  return Speciation;
}();
/**
 * Utility for handling both callbacks and promises (ml5.js style)
 *
 * Usage:
 *
 * async function myAsyncFunction(callback) {
 *   return callCallback(callback, async () => {
 *     // Do async work
 *     const result = await someAsyncOp()
 *     return result
 *   })
 * }
 *
 * // Then users can use:
 * await myAsyncFunction()           // Promise
 * myAsyncFunction(callback)         // Callback
 * myAsyncFunction().then(...)       // Promise chain
 */
/**
 * Execute an async function and handle both callback and promise patterns
 * @param {Function} callback - Optional callback(error, result)
 * @param {Function} asyncFn - Async function to execute
 * @returns {Promise|undefined} - Returns promise if no callback, undefined otherwise
 */
function callCallback(callback, asyncFn) {
  // If callback provided, use callback pattern
  if (typeof callback === 'function') {
    asyncFn().then(function (result) {
      return callback(null, result);
    })["catch"](function (error) {
      return callback(error);
    });
    return undefined;
  }

  // Otherwise return promise
  return asyncFn();
}

/**
 * Check if a value is a promise
 * @param {*} value
 * @returns {boolean}
 */
function isPromise(value) {
  return value && typeof value.then === 'function';
}

/**
 * Ensure a value is a promise
 * @param {*} value
 * @returns {Promise}
 */
function toPromise(value) {
  if (isPromise(value)) return value;
  return Promise.resolve(value);
}

/**
 * Execute function and handle both sync and async results
 * @param {Function} fn
 * @returns {Promise}
 */
function executeAsync(_x3) {
  return _executeAsync.apply(this, arguments);
}
/**
 * Flexible argument parser (ml5.js style)
 *
 * Supports multiple calling patterns:
 * - fn()
 * - fn(callback)
 * - fn(options)
 * - fn(options, callback)
 *
 * Usage:
 *   const { options, callback } = parseArgs(arguments, {
 *     defaults: { maxIterations: 100 },
 *     optionsKey: 0  // optional, which arg position can be options
 *   })
 */
/**
 * Check if value is a plain object (not array, not function, not null)
 */
function _executeAsync() {
  _executeAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(fn) {
    var result;
    return _regeneratorRuntime().wrap(function _callee8$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          result = fn();
          return _context13.abrupt("return", toPromise(result));
        case 2:
        case "end":
          return _context13.stop();
      }
    }, _callee8);
  }));
  return _executeAsync.apply(this, arguments);
}
function isPlainObject(value) {
  return value !== null && _typeof(value) === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Parse flexible function arguments
 *
 * @param {IArguments|Array} args - Function arguments
 * @param {Object} config - Configuration
 * @param {Object} config.defaults - Default options
 * @param {number[]} config.optionsPositions - Valid positions for options object (default: [0])
 * @param {number[]} config.callbackPositions - Valid positions for callback (default: [0, 1])
 * @returns {Object} - { options, callback }
 */
function parseArgs(args) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _config$defaults = config.defaults,
    defaults = _config$defaults === void 0 ? {} : _config$defaults,
    _config$optionsPositi = config.optionsPositions,
    optionsPositions = _config$optionsPositi === void 0 ? [0] : _config$optionsPositi,
    _config$callbackPosit = config.callbackPositions,
    callbackPositions = _config$callbackPosit === void 0 ? [0, 1] : _config$callbackPosit;

  // Convert arguments to array
  var argsArray = Array.from(args);
  var options = _objectSpread({}, defaults);
  var callback = null;

  // Check for callback at valid positions
  var _iterator36 = _createForOfIteratorHelper(callbackPositions),
    _step36;
  try {
    for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
      var pos = _step36.value;
      if (pos < argsArray.length && typeof argsArray[pos] === 'function') {
        callback = argsArray[pos];
        break;
      }
    }

    // Check for options object at valid positions
  } catch (err) {
    _iterator36.e(err);
  } finally {
    _iterator36.f();
  }
  var _iterator37 = _createForOfIteratorHelper(optionsPositions),
    _step37;
  try {
    for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
      var _pos = _step37.value;
      if (_pos < argsArray.length) {
        var arg = argsArray[_pos];
        // If it's a plain object and not the callback
        if (isPlainObject(arg) && arg !== callback) {
          options = _objectSpread(_objectSpread({}, defaults), arg);
          break;
        }
      }
    }
  } catch (err) {
    _iterator37.e(err);
  } finally {
    _iterator37.f();
  }
  return {
    options: options,
    callback: callback
  };
}

/**
 * Parse arguments specifically for tick/next methods
 *
 * Supports:
 * - method()
 * - method(callback)
 * - method(options)
 * - method(options, callback)
 *
 * @param {IArguments|Array} args
 * @param {Object} defaults
 * @returns {Object} - { options, callback }
 */
function parseMethodArgs(args) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return parseArgs(args, {
    defaults: defaults,
    optionsPositions: [0],
    callbackPositions: [0, 1]
  });
}

/**
 * Parse constructor arguments
 *
 * Supports:
 * - new Class()
 * - new Class(options)
 * - new Class(size, options)
 * - new Class(size, class, options)
 *
 * @param {IArguments|Array} args
 * @param {Object} config
 * @returns {Object} - Parsed arguments
 */
function parseConstructorArgs(args) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var argsArray = Array.from(args);

  // If only one argument and it's an object, treat as options
  if (argsArray.length === 1 && isPlainObject(argsArray[0])) {
    return argsArray[0];
  }

  // Otherwise, handle positional arguments
  return config.positionalParser ? config.positionalParser(argsArray) : argsArray[0];
}

/**
 * Progress tracking utilities
 *
 * Provides progress callbacks for long-running operations
 */

/**
 * Create a progress tracker
 *
 * @param {Object} options
 * @param {number} options.total - Total steps
 * @param {Function} options.onProgress - Progress callback
 * @param {number} options.throttle - Minimum ms between progress updates (default: 100)
 * @returns {Object} - Progress tracker
 */
function createProgressTracker() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$total = options.total,
    total = _options$total === void 0 ? 100 : _options$total,
    _options$onProgress = options.onProgress,
    onProgress = _options$onProgress === void 0 ? null : _options$onProgress,
    _options$throttle = options.throttle,
    throttle = _options$throttle === void 0 ? 100 : _options$throttle;
  var current = 0;
  var lastUpdateTime = 0;
  var startTime = Date.now();
  var tracker = {
    total: total,
    current: 0,
    /**
     * Update progress
     *
     * @param {number} value - New current value
     * @param {Object} metadata - Additional metadata
     */
    update: function update(value) {
      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      current = value;
      tracker.current = current;

      // Throttle updates
      var now = Date.now();
      if (now - lastUpdateTime < throttle && current < total) {
        return;
      }
      lastUpdateTime = now;
      if (onProgress && typeof onProgress === 'function') {
        var elapsed = now - startTime;
        var percentage = total > 0 ? current / total * 100 : 0;
        var eta = current > 0 ? elapsed / current * (total - current) : 0;
        onProgress(_objectSpread({
          current: current,
          total: total,
          percentage: Math.min(100, percentage),
          elapsed: elapsed,
          eta: Math.max(0, eta)
        }, metadata));
      }
    },
    /**
     * Increment progress by 1
     *
     * @param {Object} metadata - Additional metadata
     */
    increment: function increment() {
      var metadata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      tracker.update(current + 1, metadata);
    },
    /**
     * Complete the progress (set to 100%)
     *
     * @param {Object} metadata - Additional metadata
     */
    complete: function complete() {
      var metadata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      tracker.update(total, _objectSpread(_objectSpread({}, metadata), {}, {
        completed: true
      }));
    }
  };
  return tracker;
}

/**
 * Run async tasks with progress tracking
 *
 * @param {Array} tasks - Array of async functions
 * @param {Object} options - Options
 * @param {Function} options.onProgress - Progress callback
 * @param {number} options.concurrency - Max concurrent tasks (default: Infinity)
 * @returns {Promise<Array>} - Results
 */
function runWithProgress(_x4) {
  return _runWithProgress.apply(this, arguments);
}
/**
 * Format time duration
 *
 * @param {number} ms - Milliseconds
 * @returns {string} - Formatted duration
 */
function _runWithProgress() {
  _runWithProgress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(tasks) {
    var options,
      _options$onProgress2,
      onProgress,
      _options$concurrency,
      concurrency,
      tracker,
      results,
      index,
      runNext,
      initialBatch,
      promises,
      i,
      _args15 = arguments;
    return _regeneratorRuntime().wrap(function _callee10$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          options = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : {};
          _options$onProgress2 = options.onProgress, onProgress = _options$onProgress2 === void 0 ? null : _options$onProgress2, _options$concurrency = options.concurrency, concurrency = _options$concurrency === void 0 ? Infinity : _options$concurrency;
          tracker = createProgressTracker({
            total: tasks.length,
            onProgress: onProgress
          });
          results = new Array(tasks.length);
          index = 0;
          runNext = /*#__PURE__*/function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
              var currentIndex, task;
              return _regeneratorRuntime().wrap(function _callee9$(_context14) {
                while (1) switch (_context14.prev = _context14.next) {
                  case 0:
                    if (!(index >= tasks.length)) {
                      _context14.next = 2;
                      break;
                    }
                    return _context14.abrupt("return");
                  case 2:
                    currentIndex = index++;
                    task = tasks[currentIndex];
                    _context14.prev = 4;
                    _context14.next = 7;
                    return task();
                  case 7:
                    results[currentIndex] = _context14.sent;
                    tracker.increment({
                      index: currentIndex
                    });
                    _context14.next = 14;
                    break;
                  case 11:
                    _context14.prev = 11;
                    _context14.t0 = _context14["catch"](4);
                    results[currentIndex] = {
                      error: _context14.t0
                    };
                  case 14:
                    if (!(index < tasks.length)) {
                      _context14.next = 17;
                      break;
                    }
                    _context14.next = 17;
                    return runNext();
                  case 17:
                  case "end":
                    return _context14.stop();
                }
              }, _callee9, null, [[4, 11]]);
            }));
            return function runNext() {
              return _ref14.apply(this, arguments);
            };
          }(); // Start initial batch
          initialBatch = Math.min(concurrency, tasks.length);
          promises = [];
          for (i = 0; i < initialBatch; i++) {
            promises.push(runNext());
          }
          _context15.next = 11;
          return Promise.all(promises);
        case 11:
          tracker.complete();
          return _context15.abrupt("return", results);
        case 13:
        case "end":
          return _context15.stop();
      }
    }, _callee10);
  }));
  return _runWithProgress.apply(this, arguments);
}
function formatDuration(ms) {
  if (ms < 1000) {
    return "".concat(Math.round(ms), "ms");
  } else if (ms < 60000) {
    return "".concat((ms / 1000).toFixed(1), "s");
  } else if (ms < 3600000) {
    var minutes = Math.floor(ms / 60000);
    var seconds = Math.round(ms % 60000 / 1000);
    return "".concat(minutes, "m ").concat(seconds, "s");
  } else {
    var hours = Math.floor(ms / 3600000);
    var _minutes = Math.round(ms % 3600000 / 60000);
    return "".concat(hours, "h ").concat(_minutes, "m");
  }
}

/**
 * Format progress bar
 *
 * @param {number} percentage - Progress percentage (0-100)
 * @param {number} width - Bar width (default: 20)
 * @returns {string} - Progress bar string
 */
function formatProgressBar(percentage) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
  var filled = Math.round(percentage / 100 * width);
  var empty = width - filled;
  return "[".concat('█'.repeat(filled)).concat('░'.repeat(empty), "]");
}
var Generation = /*#__PURE__*/function () {
  function Generation() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Generation);
    // Validate options object
    validateObject(options, 'options', {
      required: false
    });
    this.meta = {};
    this.options = options;
    var _options$size = options.size,
      size = _options$size === void 0 ? 1 : _options$size,
      _options$hooks = options.hooks,
      hooks = _options$hooks === void 0 ? {} : _options$hooks,
      _options$individualAr = options.individualArgs,
      individualArgs = _options$individualAr === void 0 ? {} : _options$individualAr,
      _options$individualNe = options.individualNeurons,
      individualNeurons = _options$individualNe === void 0 ? 0 : _options$individualNe,
      _options$individualGe = options.individualGenomeSize,
      individualGenomeSize = _options$individualGe === void 0 ? 1 : _options$individualGe,
      _options$individualCl = options.individualClass,
      individualClass = _options$individualCl === void 0 ? Individual : _options$individualCl,
      _options$eliteRatio = options.eliteRatio,
      eliteRatio = _options$eliteRatio === void 0 ? 0.05 : _options$eliteRatio,
      _options$randomFillRa = options.randomFillRatio,
      randomFillRatio = _options$randomFillRa === void 0 ? 0.10 : _options$randomFillRa,
      _options$tournamentSi = options.tournamentSize,
      tournamentSize = _options$tournamentSi === void 0 ? 3 : _options$tournamentSi,
      _options$baseMutation = options.baseMutationRate,
      baseMutationRate = _options$baseMutation === void 0 ? 0.01 : _options$baseMutation,
      _options$adaptiveMuta = options.adaptiveMutation,
      adaptiveMutation = _options$adaptiveMuta === void 0 ? true : _options$adaptiveMuta,
      _options$mutationDeca = options.mutationDecayRate,
      mutationDecayRate = _options$mutationDeca === void 0 ? 500 : _options$mutationDeca,
      _options$useSpeciatio = options.useSpeciation,
      useSpeciation = _options$useSpeciatio === void 0 ? false : _options$useSpeciatio,
      _options$speciationOp = options.speciationOptions,
      speciationOptions = _options$speciationOp === void 0 ? {} : _options$speciationOp;

    // Validate parameters
    try {
      validatePositiveInteger(size, 'size');
      validateObject(hooks, 'hooks', {
        required: false
      });
      validateObject(individualArgs, 'individualArgs', {
        required: false
      });
      validateRange(individualNeurons, 'individualNeurons', 0, 512, {
        integer: true
      });
      validatePositiveInteger(individualGenomeSize, 'individualGenomeSize');
      validateClass(individualClass, 'individualClass', Individual);
      validateRatio(eliteRatio, 'eliteRatio');
      validateRatio(randomFillRatio, 'randomFillRatio');
      validatePositiveInteger(tournamentSize, 'tournamentSize');
      validateRatio(baseMutationRate, 'baseMutationRate');
      validatePositiveInteger(mutationDecayRate, 'mutationDecayRate');
    } catch (err) {
      if (err instanceof ValidationError) {
        // Add helpful context
        if (err.context.parameter === 'size') {
          throw new ValidationError(createHelpfulError('invalid-population-size', err.context), err.context);
        } else if (['eliteRatio', 'randomFillRatio', 'baseMutationRate'].includes(err.context.parameter)) {
          throw new ValidationError(createHelpfulError('invalid-ratio', err.context), err.context);
        }
      }
      throw err;
    }
    this.size = size;
    this.hooks = hooks;
    this.population = [];
    this.individualClass = individualClass;
    this.individualNeurons = individualNeurons;
    this.individualGenomeSize = individualGenomeSize;
    this.eliteRatio = eliteRatio;
    this.randomFillRatio = randomFillRatio;
    this.tournamentSize = tournamentSize;
    this.baseMutationRate = baseMutationRate;
    this.adaptiveMutation = adaptiveMutation;
    this.mutationDecayRate = mutationDecayRate;
    this.generationNumber = 0; // Track current generation
    this.useSpeciation = useSpeciation;
    this.speciation = useSpeciation ? new Speciation(speciationOptions) : null;
    this.individualArgs = _objectSpread({
      hooks: {},
      sensors: [],
      actions: [],
      environment: {}
    }, individualArgs);
  }
  _createClass(Generation, [{
    key: "_getIdLimits",
    value: function _getIdLimits() {
      var sensorCount = Array.isArray(this.individualArgs.sensors) ? this.individualArgs.sensors.length : 0;
      var actionCount = Array.isArray(this.individualArgs.actions) ? this.individualArgs.actions.length : 0;
      var neuronCount = Number.isFinite(this.individualNeurons) ? this.individualNeurons : 0;
      return {
        sensorCount: sensorCount,
        actionCount: actionCount,
        neuronCount: neuronCount,
        maxSensorId: sensorCount > 0 ? sensorCount - 1 : 0,
        maxActionId: actionCount > 0 ? actionCount - 1 : 0,
        maxNeuronId: neuronCount > 0 ? neuronCount - 1 : 0
      };
    }
  }, {
    key: "add",
    value: function add(genome) {
      if (!genome) throw new Error('Genome is required');
      var IndClass = this.individualClass;
      this.population.push(new IndClass(_objectSpread(_objectSpread({}, this.individualArgs), {}, {
        genome: genome
      })));
    }
  }, {
    key: "fillRandom",
    value: function fillRandom() {
      this.meta.randoms = 0;
      while (this.population.length < this.size) {
        var _this$individualArgs$, _this$individualArgs$2;
        // Use sensible defaults if not provided
        var neurons = this.individualNeurons || 30;
        var sensors = ((_this$individualArgs$ = this.individualArgs.sensors) === null || _this$individualArgs$ === void 0 ? void 0 : _this$individualArgs$.length) || 10;
        var actions = ((_this$individualArgs$2 = this.individualArgs.actions) === null || _this$individualArgs$2 === void 0 ? void 0 : _this$individualArgs$2.length) || 5;
        var genomeSize = this.individualGenomeSize || Math.max(100, (sensors + actions + neurons) * 2);
        this.add(Genome.randomWith(genomeSize, {
          neurons: neurons,
          sensors: sensors,
          actions: actions
        }));
        this.meta.randoms += 1;
      }
    }

    /**
     * Tick all individuals (synchronous version)
     * For async version, use tickAsync()
     */
  }, {
    key: "tick",
    value: function tick() {
      // Validate population
      if (this.population.length === 0) {
        throw new ValidationError(createHelpfulError('no-individuals'), {
          method: 'tick',
          population: this.population.length
        });
      }
      if (this.hooks.beforeTick) {
        this.hooks.beforeTick.call(this, this);
      }

      // Pre-allocate results array
      var results = new Array(this.population.length);

      // Use for loop instead of reduce for better performance
      for (var i = 0; i < this.population.length; i++) {
        var ind = this.population[i];
        try {
          var res = ind.tick();
          results[i] = [ind.id, ind.fitness, res];
        } catch (error) {
          console.error("Individual ".concat(ind.id, " tick failed:"), error);
          results[i] = [ind.id, ind.fitness, {}];
        }
      }
      if (this.hooks.afterTick) {
        this.hooks.afterTick.call(this, results, this);
      }
      return results;
    }

    /**
     * Tick all individuals (async version)
     * Supports async fitness functions and batch evaluation
     *
     * @param {Object|Function} optionsOrCallback - Options or callback
     * @param {Function} callback - Optional callback(error, results)
     * @returns {Promise<Array>|undefined} - Results array or undefined if callback provided
     *
     * @example
     * // Promise
     * const results = await generation.tickAsync()
     *
     * // Callback
     * generation.tickAsync((err, results) => {
     *   if (err) return console.error(err)
     *   console.log(results)
     * })
     *
     * // With options
     * const results = await generation.tickAsync({ parallel: true })
     *
     * // With options and callback
     * generation.tickAsync({ parallel: true }, (err, results) => {
     *   console.log(results)
     * })
     */
  }, {
    key: "tickAsync",
    value: function tickAsync(optionsOrCallback, callback) {
      var _this10 = this;
      // Parse flexible arguments
      var parsed = parseMethodArgs(arguments, {
        parallel: true,
        // default: evaluate fitness in parallel
        onProgress: null // optional progress callback
      });
      return callCallback(parsed.callback, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var hookResult, progressTracker, results, promises, _hookResult;
        return _regeneratorRuntime().wrap(function _callee3$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (!(_this10.population.length === 0)) {
                _context8.next = 2;
                break;
              }
              throw new ValidationError(createHelpfulError('no-individuals'), {
                method: 'tickAsync',
                population: _this10.population.length
              });
            case 2:
              if (!_this10.hooks.beforeTick) {
                _context8.next = 7;
                break;
              }
              hookResult = _this10.hooks.beforeTick.call(_this10, _this10);
              if (!isPromise(hookResult)) {
                _context8.next = 7;
                break;
              }
              _context8.next = 7;
              return hookResult;
            case 7:
              // Create progress tracker if onProgress callback provided
              progressTracker = parsed.options.onProgress ? createProgressTracker({
                total: _this10.population.length,
                onProgress: parsed.options.onProgress,
                throttle: 50 // Update at most every 50ms
              }) : null; // Pre-allocate results array
              results = new Array(_this10.population.length); // Evaluate all individuals (supports async fitness)
              promises = _this10.population.map( /*#__PURE__*/function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ind, i) {
                  var res, fitness;
                  return _regeneratorRuntime().wrap(function _callee2$(_context7) {
                    while (1) switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.prev = 0;
                        res = ind.tick(); // If fitness() is async, await it
                        fitness = ind.fitness;
                        if (typeof fitness === 'function') {
                          fitness = fitness.call(ind);
                        }
                        if (!isPromise(fitness)) {
                          _context7.next = 8;
                          break;
                        }
                        _context7.next = 7;
                        return fitness;
                      case 7:
                        fitness = _context7.sent;
                      case 8:
                        results[i] = [ind.id, fitness, res];

                        // Update progress
                        if (progressTracker) {
                          progressTracker.increment({
                            step: 'fitness-evaluation',
                            individual: i
                          });
                        }
                        _context7.next = 17;
                        break;
                      case 12:
                        _context7.prev = 12;
                        _context7.t0 = _context7["catch"](0);
                        console.error("Individual ".concat(ind.id, " tick failed:"), _context7.t0);
                        results[i] = [ind.id, 0, {}];

                        // Update progress even on error
                        if (progressTracker) {
                          progressTracker.increment({
                            step: 'fitness-evaluation',
                            individual: i,
                            error: true
                          });
                        }
                      case 17:
                      case "end":
                        return _context7.stop();
                    }
                  }, _callee2, null, [[0, 12]]);
                }));
                return function (_x5, _x6) {
                  return _ref10.apply(this, arguments);
                };
              }());
              _context8.next = 12;
              return Promise.all(promises);
            case 12:
              // Mark progress as complete
              if (progressTracker) {
                progressTracker.complete({
                  step: 'fitness-evaluation'
                });
              }
              if (!_this10.hooks.afterTick) {
                _context8.next = 18;
                break;
              }
              _hookResult = _this10.hooks.afterTick.call(_this10, results, _this10);
              if (!isPromise(_hookResult)) {
                _context8.next = 18;
                break;
              }
              _context8.next = 18;
              return _hookResult;
            case 18:
              return _context8.abrupt("return", results);
            case 19:
            case "end":
              return _context8.stop();
          }
        }, _callee3);
      })));
    }

    /**
     * Tournament selection - picks best from k random individuals
     * Uses normalized fitness if available for consistent selection pressure
     */
  }, {
    key: "tournamentSelect",
    value: function tournamentSelect(population) {
      var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var tournamentSize = k || this.tournamentSize;
      var contestants = [];
      for (var i = 0; i < tournamentSize; i++) {
        var idx = Math.floor(Math.random() * population.length);
        contestants.push(population[idx]);
      }

      // Helper to get fitness value
      var getFitness = function getFitness(ind) {
        if (ind._normalizedFitness !== undefined) return ind._normalizedFitness;
        if (typeof ind.fitness === 'function') return ind.fitness();
        if (typeof ind.fitness === 'number') return ind.fitness;
        return 0;
      };

      // Sort by normalized fitness if available, otherwise use raw fitness
      return contestants.sort(function (a, b) {
        var fitA = getFitness(a);
        var fitB = getFitness(b);
        return fitB - fitA;
      })[0];
    }

    /**
     * Calculate current mutation rate based on generation number
     */
  }, {
    key: "getCurrentMutationRate",
    value: function getCurrentMutationRate() {
      if (!this.adaptiveMutation) {
        return this.baseMutationRate;
      }

      // Exponential decay: rate = baseRate * exp(-generation / decayRate)
      // Gen 0: 1.00x base
      // Gen 100: 0.82x base
      // Gen 500: 0.37x base
      // Gen 1000: 0.14x base
      var rate = this.baseMutationRate * Math.exp(-this.generationNumber / this.mutationDecayRate);
      return Math.max(rate, this.baseMutationRate * 0.1); // Never go below 10% of base
    }

    /**
     * Calculate diversity (ratio of unique genomes)
     */
  }, {
    key: "calculateDiversity",
    value: function calculateDiversity() {
      var uniqueGenomes = new Set(this.population.map(function (i) {
        return i.genome.encoded;
      }));
      return uniqueGenomes.size / this.size;
    }

    /**
     * Normalize fitness scores to [0, 1] range
     * This ensures consistent selection pressure regardless of fitness scale
     */
  }, {
    key: "normalizeFitness",
    value: function normalizeFitness(population) {
      var fitnesses = population.map(function (i) {
        // Handle both fitness as method and as property
        if (typeof i.fitness === 'function') {
          return i.fitness();
        } else if (typeof i.fitness === 'number') {
          return i.fitness;
        }
        return 0;
      });
      var min = Math.min.apply(Math, _toConsumableArray(fitnesses));
      var max = Math.max.apply(Math, _toConsumableArray(fitnesses));
      var range = max - min;

      // If all fitnesses are the same, return uniform distribution
      if (range === 0) {
        return population.map(function () {
          return 1 / population.length;
        });
      }

      // Normalize to [0, 1]
      var normalized = fitnesses.map(function (f) {
        return (f - min) / range;
      });

      // Store normalized fitness on individuals for selection
      population.forEach(function (ind, i) {
        ind._normalizedFitness = normalized[i];
      });
      return normalized;
    }

    /**
     * Create next generation (synchronous version)
     * For async version, use nextAsync()
     */
  }, {
    key: "next",
    value: function next() {
      if (this.hooks.beforeNext) {
        this.hooks.beforeNext.call(this, this);
      }

      // Increment generation counter
      this.generationNumber++;
      var nextGen = Generation.from(_objectSpread({}, this.options));
      nextGen.generationNumber = this.generationNumber;

      // === STEP 0: Normalize fitness for consistent selection pressure ===
      this.normalizeFitness(this.population);

      // === SPECIATION: If enabled, use NEAT-style species-based reproduction ===
      if (this.useSpeciation && this.speciation) {
        return this._nextWithSpeciation(nextGen);
      }

      // === STEP 1: ELITISM - Always preserve the best ===
      var eliteCount = Math.ceil(this.size * this.eliteRatio);

      // Helper to get fitness value (handles both method and property)
      var getFitness = function getFitness(ind) {
        if (typeof ind.fitness === 'function') return ind.fitness();
        if (typeof ind.fitness === 'number') return ind.fitness;
        return 0;
      };

      // Sort by fitness (descending) and get elite
      var sortedByFitness = _toConsumableArray(this.population).sort(function (a, b) {
        return getFitness(b) - getFitness(a);
      });
      var elite = sortedByFitness.slice(0, eliteCount);

      // Record survivor count before elitism forces revival
      var survivorsBeforeElitism = this.population.reduce(function (count, ind) {
        return count + (ind.dead ? 0 : 1);
      }, 0);

      // Force elite to survive (they can't be marked dead)
      elite.forEach(function (e) {
        return e.dead = false;
      });

      // Add elite to next generation (clone their genomes)
      var _iterator38 = _createForOfIteratorHelper(elite),
        _step38;
      try {
        for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
          var individual = _step38.value;
          nextGen.add(individual.genome.clone());
        }
      } catch (err) {
        _iterator38.e(err);
      } finally {
        _iterator38.f();
      }
      nextGen.meta.elite = eliteCount;

      // === STEP 2: Collect survivors (non-dead individuals) ===
      var alives = [];
      for (var i = 0; i < this.population.length; i++) {
        var ind = this.population[i];
        if (!ind.dead) {
          alives.push(ind);
        }
      }
      this.meta.survivalRate = survivorsBeforeElitism / this.population.length;
      nextGen.meta.survivors = survivorsBeforeElitism;

      // === STEP 3: REPRODUCTION via Tournament Selection ===
      // Fill remaining slots with offspring
      var offspringCount = 0;

      // Get current mutation rate (adaptive or fixed)
      var currentMutationRate = this.getCurrentMutationRate();
      var _this$_getIdLimits = this._getIdLimits(),
        maxActionId = _this$_getIdLimits.maxActionId,
        maxNeuronId = _this$_getIdLimits.maxNeuronId,
        maxSensorId = _this$_getIdLimits.maxSensorId;
      while (nextGen.population.length < this.size) {
        // Ensure we have enough individuals for selection
        var breedingPool = alives.length > 0 ? alives : this.population;
        if (breedingPool.length === 0) break; // Safety check

        // Tournament selection for parents
        var parent1 = this.tournamentSelect(breedingPool);
        var parent2 = this.tournamentSelect(breedingPool);

        // Sexual reproduction (crossover) with adaptive mutation
        var _Reproduction$genomeC = Reproduction.genomeCrossover(parent1.genome, parent2.genome, {
            mutationRate: currentMutationRate,
            adaptiveRate: this.adaptiveMutation,
            generation: this.generationNumber,
            maxActionId: maxActionId,
            maxNeuronId: maxNeuronId,
            maxSensorId: maxSensorId
          }),
          _Reproduction$genomeC2 = _slicedToArray(_Reproduction$genomeC, 2),
          child1 = _Reproduction$genomeC2[0],
          child2 = _Reproduction$genomeC2[1];

        // Add children
        nextGen.add(child1);
        offspringCount++;
        if (nextGen.population.length < this.size) {
          nextGen.add(child2);
          offspringCount++;
        }
      }
      nextGen.meta.offspring = offspringCount;
      nextGen.meta.mutationRate = currentMutationRate;

      // === STEP 4: RANDOM FILL (limited to randomFillRatio) ===
      var maxRandoms = Math.ceil(this.size * this.randomFillRatio);
      var randomsAdded = 0;
      while (nextGen.population.length < this.size && randomsAdded < maxRandoms) {
        var _this$individualArgs$3, _this$individualArgs$4;
        var neurons = this.individualNeurons || 30;
        var sensors = ((_this$individualArgs$3 = this.individualArgs.sensors) === null || _this$individualArgs$3 === void 0 ? void 0 : _this$individualArgs$3.length) || 10;
        var actions = ((_this$individualArgs$4 = this.individualArgs.actions) === null || _this$individualArgs$4 === void 0 ? void 0 : _this$individualArgs$4.length) || 5;
        var genomeSize = this.individualGenomeSize || Math.max(100, (sensors + actions + neurons) * 2);
        nextGen.add(Genome.randomWith(genomeSize, {
          neurons: neurons,
          sensors: sensors,
          actions: actions
        }));
        randomsAdded++;
      }
      nextGen.meta.randoms = randomsAdded;

      // === STEP 5: Fill any remaining slots with mutations of best ===
      // If we still haven't filled the population and hit random limit,
      // fill with mutations of elite individuals
      while (nextGen.population.length < this.size) {
        // Safety: if elite is empty, generate random individual
        if (elite.length === 0) {
          nextGen.fillRandom();
          break;
        }
        var parent = elite[Math.floor(Math.random() * elite.length)];
        var mutant = Reproduction.genomeMutate(parent.genome, {
          mutationRate: currentMutationRate,
          adaptiveRate: this.adaptiveMutation,
          generation: this.generationNumber,
          maxActionId: maxActionId,
          maxNeuronId: maxNeuronId,
          maxSensorId: maxSensorId
        });
        nextGen.add(mutant);
      }

      // === STEP 6: Diversity monitoring and injection ===
      var diversity = this.calculateDiversity();
      nextGen.meta.diversity = diversity;

      // If diversity is too low, add mutation burst to prevent premature convergence
      var diversityThreshold = 0.2;
      if (diversity < diversityThreshold && this.adaptiveMutation) {
        var burstRate = currentMutationRate * 50; // 50x current rate for burst
        var burstCount = Math.floor(nextGen.size * 0.3); // 30% of population

        for (var _i26 = 0; _i26 < burstCount; _i26++) {
          var idx = Math.floor(Math.random() * nextGen.population.length);
          nextGen.population[idx].genome.mutate(burstRate, {
            adaptiveRate: false,
            // Disable adaptive for burst
            generation: this.generationNumber,
            maxActionId: maxActionId,
            maxNeuronId: maxNeuronId,
            maxSensorId: maxSensorId
          });
        }
        nextGen.meta.diversityBurst = true;
        nextGen.meta.burstCount = burstCount;
      }

      // Clear population more efficiently
      this.population.length = 0;
      if (this.hooks.afterNext) {
        this.hooks.afterNext.call(this, nextGen, this);
      }
      return nextGen;
    }

    /**
     * Create next generation with NEAT-style speciation
     * @private
     */
  }, {
    key: "_nextWithSpeciation",
    value: function _nextWithSpeciation(nextGen) {
      var _this11 = this;
      var currentMutationRate = this.getCurrentMutationRate();

      // Speciate the population
      var species = this.speciation.speciate(this.population);

      // Store speciation info in metadata
      nextGen.meta.speciation = this.speciation.getMetadata();
      nextGen.meta.mutationRate = currentMutationRate;

      // Calculate offspring allocation per species
      var offspringAllocation = this.speciation.calculateOffspringAllocation(this.size);

      // Reproduce within each species
      var _loop5 = function _loop5() {
        var spec = species[s];
        var targetOffspring = offspringAllocation[s];

        // Always preserve champion of each species (species elitism)
        var champion = spec.champion();
        if (champion) {
          nextGen.add(champion.genome.clone());
        }

        // Helper to get fitness value
        var getFitness = function getFitness(ind) {
          if (typeof ind.fitness === 'function') return ind.fitness();
          if (typeof ind.fitness === 'number') return ind.fitness;
          return 0;
        };

        // Sort species members by fitness
        var sorted = _toConsumableArray(spec.members).sort(function (a, b) {
          return getFitness(b) - getFitness(a);
        });

        // Only top performers reproduce (survivalThreshold)
        var survivorCount = Math.max(1, Math.ceil(sorted.length * _this11.speciation.survivalThreshold));
        var parents = sorted.slice(0, survivorCount);

        // Skip if no parents available
        if (parents.length === 0) return 1; // continue

        // Generate offspring for this species
        var offspring = 1; // Already added champion
        while (offspring < targetOffspring && nextGen.population.length < _this11.size) {
          // Select two random parents from survivors
          var parent1 = parents[Math.floor(Math.random() * parents.length)];
          var parent2 = parents[Math.floor(Math.random() * parents.length)];

          // Safety check
          if (!parent1 || !parent2) break;
          if (Math.random() < 0.75) {
            // 75% chance of crossover
            var _Reproduction$genomeC3 = Reproduction.genomeCrossover(parent1.genome, parent2.genome, {
                method: 'base-aware',
                mutationRate: currentMutationRate,
                maxActionId: maxActionId,
                maxNeuronId: maxNeuronId,
                maxSensorId: maxSensorId
              }),
              _Reproduction$genomeC4 = _slicedToArray(_Reproduction$genomeC3, 2),
              child1 = _Reproduction$genomeC4[0],
              child2 = _Reproduction$genomeC4[1];
            nextGen.add(child1);
            offspring++;
            if (offspring < targetOffspring && nextGen.population.length < _this11.size) {
              nextGen.add(child2);
              offspring++;
            }
          } else {
            // 25% chance of mutation only
            var _mutant = Reproduction.genomeMutate(parent1.genome, {
              mutationRate: currentMutationRate,
              maxActionId: maxActionId,
              maxNeuronId: maxNeuronId,
              maxSensorId: maxSensorId
            });
            nextGen.add(_mutant);
            offspring++;
          }
        }
      };
      for (var s = 0; s < species.length; s++) {
        if (_loop5()) continue;
      }

      // Fill remaining slots if needed (shouldn't happen normally)
      while (nextGen.population.length < this.size) {
        var randomSpecies = species[Math.floor(Math.random() * species.length)];
        var randomMember = randomSpecies.randomMember();
        if (randomMember) {
          var mutant = Reproduction.genomeMutate(randomMember.genome, {
            mutationRate: currentMutationRate * 2,
            // Higher mutation for fill
            maxActionId: maxActionId,
            maxNeuronId: maxNeuronId,
            maxSensorId: maxSensorId
          });
          nextGen.add(mutant);
        } else {
          var _this$individualArgs$5, _this$individualArgs$6;
          // Fallback: create random
          nextGen.add(Genome.randomWith(this.individualGenomeSize, {
            neurons: this.individualNeurons,
            sensors: ((_this$individualArgs$5 = this.individualArgs.sensors) === null || _this$individualArgs$5 === void 0 ? void 0 : _this$individualArgs$5.length) || 10,
            actions: ((_this$individualArgs$6 = this.individualArgs.actions) === null || _this$individualArgs$6 === void 0 ? void 0 : _this$individualArgs$6.length) || 5
          }));
        }
      }

      // Transfer speciation state to next generation
      nextGen.speciation = this.speciation;
      if (this.hooks.afterNext) {
        this.hooks.afterNext.call(this, nextGen, this);
      }
      return nextGen;
    }

    /**
     * Create next generation (async version)
     * Supports async hooks
     *
     * @param {Object|Function} optionsOrCallback - Options or callback
     * @param {Function} callback - Optional callback(error, nextGeneration)
     * @returns {Promise<Generation>|undefined} - Next generation or undefined if callback provided
     *
     * @example
     * // Promise
     * const nextGen = await generation.nextAsync()
     *
     * // Callback
     * generation.nextAsync((err, nextGen) => {
     *   if (err) return console.error(err)
     *   // Use nextGen
     * })
     *
     * // With options (future expansion)
     * const nextGen = await generation.nextAsync({ preserveMetadata: true })
     *
     * // With options and callback
     * generation.nextAsync({ preserveMetadata: true }, (err, nextGen) => {
     *   console.log(nextGen)
     * })
     */
  }, {
    key: "nextAsync",
    value: function nextAsync(optionsOrCallback, callback) {
      var _this12 = this;
      // Parse flexible arguments
      var parsed = parseMethodArgs(arguments, {
        preserveMetadata: false // future expansion
      });
      return callCallback(parsed.callback, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var hookResult, nextGen, eliteCount, getFitness, sortedByFitness, elite, _iterator39, _step39, individual, alives, i, ind, offspringCount, currentMutationRate, _this12$_getIdLimits, maxActionId, maxNeuronId, maxSensorId, breedingPool, parent1, parent2, _Reproduction$genomeC5, _Reproduction$genomeC6, child1, child2, maxRandoms, randomsAdded, _this12$individualArg, _this12$individualArg2, neurons, sensors, actions, genomeSize, parent, mutant, diversity, diversityThreshold, burstRate, burstCount, _i27, idx, _hookResult2;
        return _regeneratorRuntime().wrap(function _callee4$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              if (!_this12.hooks.beforeNext) {
                _context9.next = 5;
                break;
              }
              hookResult = _this12.hooks.beforeNext.call(_this12, _this12);
              if (!isPromise(hookResult)) {
                _context9.next = 5;
                break;
              }
              _context9.next = 5;
              return hookResult;
            case 5:
              // Increment generation counter
              _this12.generationNumber++;
              nextGen = Generation.from(_objectSpread({}, _this12.options));
              nextGen.generationNumber = _this12.generationNumber;

              // === STEP 0: Normalize fitness (supports async fitness) ===
              _context9.next = 10;
              return _this12.normalizeFitnessAsync(_this12.population);
            case 10:
              // === STEP 1: ELITISM - Always preserve the best ===
              eliteCount = Math.ceil(_this12.size * _this12.eliteRatio); // Helper to get fitness value
              getFitness = function getFitness(ind) {
                if (typeof ind.fitness === 'function') return ind.fitness();
                if (typeof ind.fitness === 'number') return ind.fitness;
                return 0;
              }; // Sort by fitness (descending) and get elite
              sortedByFitness = _toConsumableArray(_this12.population).sort(function (a, b) {
                return getFitness(b) - getFitness(a);
              });
              elite = sortedByFitness.slice(0, eliteCount); // Force elite to survive (they can't be marked dead)
              elite.forEach(function (e) {
                return e.dead = false;
              });

              // Add elite to next generation (clone their genomes)
              _iterator39 = _createForOfIteratorHelper(elite);
              try {
                for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
                  individual = _step39.value;
                  nextGen.add(individual.genome.clone());
                }
              } catch (err) {
                _iterator39.e(err);
              } finally {
                _iterator39.f();
              }
              nextGen.meta.elite = eliteCount;

              // === STEP 2: Collect survivors (non-dead individuals) ===
              alives = [];
              for (i = 0; i < _this12.population.length; i++) {
                ind = _this12.population[i];
                if (!ind.dead) {
                  alives.push(ind);
                }
              }
              _this12.meta.survivalRate = alives.length / _this12.population.length;
              nextGen.meta.survivors = alives.length;

              // === STEP 3: REPRODUCTION via Tournament Selection ===
              offspringCount = 0;
              currentMutationRate = _this12.getCurrentMutationRate();
              _this12$_getIdLimits = _this12._getIdLimits(), maxActionId = _this12$_getIdLimits.maxActionId, maxNeuronId = _this12$_getIdLimits.maxNeuronId, maxSensorId = _this12$_getIdLimits.maxSensorId;
            case 25:
              if (!(nextGen.population.length < _this12.size)) {
                _context9.next = 37;
                break;
              }
              breedingPool = alives.length > 0 ? alives : _this12.population;
              if (!(breedingPool.length === 0)) {
                _context9.next = 29;
                break;
              }
              return _context9.abrupt("break", 37);
            case 29:
              // Tournament selection for parents
              parent1 = _this12.tournamentSelect(breedingPool);
              parent2 = _this12.tournamentSelect(breedingPool); // Sexual reproduction (crossover) with adaptive mutation
              _Reproduction$genomeC5 = Reproduction.genomeCrossover(parent1.genome, parent2.genome, {
                mutationRate: currentMutationRate,
                adaptiveRate: _this12.adaptiveMutation,
                generation: _this12.generationNumber,
                maxActionId: maxActionId,
                maxNeuronId: maxNeuronId,
                maxSensorId: maxSensorId
              }), _Reproduction$genomeC6 = _slicedToArray(_Reproduction$genomeC5, 2), child1 = _Reproduction$genomeC6[0], child2 = _Reproduction$genomeC6[1];
              nextGen.add(child1);
              offspringCount++;
              if (nextGen.population.length < _this12.size) {
                nextGen.add(child2);
                offspringCount++;
              }
              _context9.next = 25;
              break;
            case 37:
              nextGen.meta.offspring = offspringCount;
              nextGen.meta.mutationRate = currentMutationRate;

              // === STEP 4: RANDOM FILL (limited to randomFillRatio) ===
              maxRandoms = Math.ceil(_this12.size * _this12.randomFillRatio);
              randomsAdded = 0;
              while (nextGen.population.length < _this12.size && randomsAdded < maxRandoms) {
                neurons = _this12.individualNeurons || 30;
                sensors = ((_this12$individualArg = _this12.individualArgs.sensors) === null || _this12$individualArg === void 0 ? void 0 : _this12$individualArg.length) || 10;
                actions = ((_this12$individualArg2 = _this12.individualArgs.actions) === null || _this12$individualArg2 === void 0 ? void 0 : _this12$individualArg2.length) || 5;
                genomeSize = _this12.individualGenomeSize || Math.max(100, (sensors + actions + neurons) * 2);
                nextGen.add(Genome.randomWith(genomeSize, {
                  neurons: neurons,
                  sensors: sensors,
                  actions: actions
                }));
                randomsAdded++;
              }
              nextGen.meta.randoms = randomsAdded;

              // === STEP 5: Fill any remaining slots with mutations of best ===
              while (nextGen.population.length < _this12.size) {
                parent = elite[Math.floor(Math.random() * elite.length)];
                mutant = Reproduction.genomeMutate(parent.genome, {
                  mutationRate: currentMutationRate,
                  adaptiveRate: _this12.adaptiveMutation,
                  generation: _this12.generationNumber,
                  maxActionId: maxActionId,
                  maxNeuronId: maxNeuronId,
                  maxSensorId: maxSensorId
                });
                nextGen.add(mutant);
              }

              // === STEP 6: Diversity monitoring and injection ===
              diversity = _this12.calculateDiversity();
              nextGen.meta.diversity = diversity;
              diversityThreshold = 0.2;
              if (diversity < diversityThreshold && _this12.adaptiveMutation) {
                burstRate = currentMutationRate * 50;
                burstCount = Math.floor(nextGen.size * 0.3);
                for (_i27 = 0; _i27 < burstCount; _i27++) {
                  idx = Math.floor(Math.random() * nextGen.population.length);
                  nextGen.population[idx].genome.mutate(burstRate, {
                    adaptiveRate: false,
                    generation: _this12.generationNumber,
                    maxActionId: maxActionId,
                    maxNeuronId: maxNeuronId,
                    maxSensorId: maxSensorId
                  });
                }
                nextGen.meta.diversityBurst = true;
                nextGen.meta.burstCount = burstCount;
              }

              // Clear population more efficiently
              _this12.population.length = 0;
              if (!_this12.hooks.afterNext) {
                _context9.next = 54;
                break;
              }
              _hookResult2 = _this12.hooks.afterNext.call(_this12, nextGen, _this12);
              if (!isPromise(_hookResult2)) {
                _context9.next = 54;
                break;
              }
              _context9.next = 54;
              return _hookResult2;
            case 54:
              return _context9.abrupt("return", nextGen);
            case 55:
            case "end":
              return _context9.stop();
          }
        }, _callee4);
      })));
    }

    /**
     * Async version of normalizeFitness (supports async fitness functions)
     */
  }, {
    key: "normalizeFitnessAsync",
    value: (function () {
      var _normalizeFitnessAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(population) {
        var fitnessPromises, fitnesses, min, max, range, normalized;
        return _regeneratorRuntime().wrap(function _callee6$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              // Evaluate all fitness values (supports async)
              fitnessPromises = population.map( /*#__PURE__*/function () {
                var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(i) {
                  var fitness;
                  return _regeneratorRuntime().wrap(function _callee5$(_context10) {
                    while (1) switch (_context10.prev = _context10.next) {
                      case 0:
                        fitness = i.fitness;
                        if (typeof fitness === 'function') {
                          fitness = fitness.call(i);
                        }
                        if (!isPromise(fitness)) {
                          _context10.next = 6;
                          break;
                        }
                        _context10.next = 5;
                        return fitness;
                      case 5:
                        return _context10.abrupt("return", _context10.sent);
                      case 6:
                        return _context10.abrupt("return", fitness);
                      case 7:
                      case "end":
                        return _context10.stop();
                    }
                  }, _callee5);
                }));
                return function (_x8) {
                  return _ref12.apply(this, arguments);
                };
              }());
              _context11.next = 3;
              return Promise.all(fitnessPromises);
            case 3:
              fitnesses = _context11.sent;
              min = Math.min.apply(Math, _toConsumableArray(fitnesses));
              max = Math.max.apply(Math, _toConsumableArray(fitnesses));
              range = max - min;
              if (!(range === 0)) {
                _context11.next = 10;
                break;
              }
              population.forEach(function (ind) {
                ind._normalizedFitness = 1 / population.length;
              });
              return _context11.abrupt("return", population.map(function () {
                return 1 / population.length;
              }));
            case 10:
              normalized = fitnesses.map(function (f) {
                return (f - min) / range;
              });
              population.forEach(function (ind, i) {
                ind._normalizedFitness = normalized[i];
              });
              return _context11.abrupt("return", normalized);
            case 13:
            case "end":
              return _context11.stop();
          }
        }, _callee6);
      }));
      function normalizeFitnessAsync(_x7) {
        return _normalizeFitnessAsync.apply(this, arguments);
      }
      return normalizeFitnessAsync;
    }())
  }, {
    key: "export",
    value: function _export() {
      return _objectSpread({
        id: this.id
      }, this.meta);
    }
  }], [{
    key: "from",
    value: function from() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return _construct(Generation, args);
    }
  }]);
  return Generation;
}();
/**
 * Novelty Search - Reward novel behaviors instead of optimizing fitness
 *
 * Instead of selecting for high fitness, select for behavioral novelty.
 * This encourages exploration and can discover solutions that
 * gradient-based search would miss.
 *
 * Based on:
 * - Lehman & Stanley (2011) - "Abandoning Objectives"
 * - Behavior characterization via descriptor vectors
 * - k-nearest neighbors novelty metric
 */
var NoveltySearch = /*#__PURE__*/function () {
  function NoveltySearch() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, NoveltySearch);
    var _options$k = options.k,
      k = _options$k === void 0 ? 15 : _options$k,
      _options$archiveThres = options.archiveThreshold,
      archiveThreshold = _options$archiveThres === void 0 ? 0.9 : _options$archiveThres,
      _options$maxArchiveSi = options.maxArchiveSize,
      maxArchiveSize = _options$maxArchiveSi === void 0 ? 1000 : _options$maxArchiveSi,
      _options$behaviorDist = options.behaviorDistance,
      behaviorDistance = _options$behaviorDist === void 0 ? null : _options$behaviorDist;
    validatePositiveInteger(k, 'k');
    validateRatio(archiveThreshold, 'archiveThreshold');
    validatePositiveInteger(maxArchiveSize, 'maxArchiveSize');
    this.k = k;
    this.archiveThreshold = archiveThreshold;
    this.maxArchiveSize = maxArchiveSize;
    this.behaviorDistance = behaviorDistance || this.defaultBehaviorDistance;
    this.archive = []; // Archive of novel behaviors
    this.currentGeneration = []; // Current generation behaviors
  }

  /**
   * Default behavior distance function (Euclidean distance)
   * Override with custom function for domain-specific behaviors
   *
   * @param {Array} behavior1 - Behavior descriptor vector
   * @param {Array} behavior2 - Behavior descriptor vector
   * @returns {number} - Distance between behaviors
   */
  _createClass(NoveltySearch, [{
    key: "defaultBehaviorDistance",
    value: function defaultBehaviorDistance(behavior1, behavior2) {
      if (!Array.isArray(behavior1) || !Array.isArray(behavior2)) {
        throw new Error('Behaviors must be arrays');
      }
      if (behavior1.length !== behavior2.length) {
        throw new Error('Behavior vectors must have same length');
      }

      // Euclidean distance
      var sum = 0;
      for (var i = 0; i < behavior1.length; i++) {
        var diff = behavior1[i] - behavior2[i];
        sum += diff * diff;
      }
      return Math.sqrt(sum);
    }

    /**
     * Calculate novelty score for a behavior
     *
     * Novelty = average distance to k-nearest neighbors
     * Higher score = more novel behavior
     *
     * @param {Array} behavior - Behavior descriptor
     * @param {Array} population - Population to compare against
     * @returns {number} - Novelty score
     */
  }, {
    key: "calculateNovelty",
    value: function calculateNovelty(behavior) {
      var _this13 = this;
      var population = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var compareSet = population || [].concat(_toConsumableArray(this.archive), _toConsumableArray(this.currentGeneration));
      if (compareSet.length === 0) {
        return 1.0; // First behavior is maximally novel
      }

      // Calculate distances to all behaviors
      var distances = compareSet.map(function (other) {
        return {
          distance: _this13.behaviorDistance(behavior, other.behavior || other)
        };
      });

      // Sort by distance
      distances.sort(function (a, b) {
        return a.distance - b.distance;
      });

      // Average distance to k-nearest neighbors
      var kNearest = Math.min(this.k, distances.length);
      var sum = distances.slice(0, kNearest).reduce(function (acc, d) {
        return acc + d.distance;
      }, 0);
      return sum / kNearest;
    }

    /**
     * Evaluate population and assign novelty scores
     *
     * @param {Array} population - Population of individuals
     * @param {Function} behaviorExtractor - Function to extract behavior from individual
     * @returns {Array} - Novelty scores for each individual
     */
  }, {
    key: "evaluatePopulation",
    value: function evaluatePopulation(population, behaviorExtractor) {
      var _this14 = this;
      // Extract behaviors
      this.currentGeneration = population.map(function (ind) {
        return {
          individual: ind,
          behavior: behaviorExtractor(ind)
        };
      });

      // Calculate novelty for each individual
      var noveltyScores = this.currentGeneration.map(function (_ref13) {
        var behavior = _ref13.behavior;
        return _this14.calculateNovelty(behavior, _this14.currentGeneration);
      });

      // Store novelty scores on individuals
      population.forEach(function (ind, i) {
        ind._noveltyScore = noveltyScores[i];
      });

      // Update archive with novel behaviors
      this.updateArchive();
      return noveltyScores;
    }

    /**
     * Update archive with sufficiently novel behaviors
     */
  }, {
    key: "updateArchive",
    value: function updateArchive() {
      var _this15 = this,
        _withScores$threshold;
      if (this.currentGeneration.length === 0) return;

      // Calculate all novelty scores
      var withScores = this.currentGeneration.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          novelty: _this15.calculateNovelty(item.behavior)
        });
      });

      // Sort by novelty (descending)
      withScores.sort(function (a, b) {
        return b.novelty - a.novelty;
      });

      // Determine threshold (top archiveThreshold percentile)
      var thresholdIndex = Math.floor(withScores.length * (1 - this.archiveThreshold));
      var thresholdScore = ((_withScores$threshold = withScores[thresholdIndex]) === null || _withScores$threshold === void 0 ? void 0 : _withScores$threshold.novelty) || 0;

      // Add behaviors above threshold to archive
      var _iterator40 = _createForOfIteratorHelper(withScores),
        _step40;
      try {
        for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
          var item = _step40.value;
          if (item.novelty >= thresholdScore) {
            this.archive.push({
              behavior: item.behavior,
              novelty: item.novelty,
              generation: this.generation
            });
          }
        }

        // Limit archive size (keep most novel)
      } catch (err) {
        _iterator40.e(err);
      } finally {
        _iterator40.f();
      }
      if (this.archive.length > this.maxArchiveSize) {
        this.archive.sort(function (a, b) {
          return b.novelty - a.novelty;
        });
        this.archive = this.archive.slice(0, this.maxArchiveSize);
      }
    }

    /**
     * Get individuals sorted by novelty
     *
     * @param {Array} population - Population
     * @returns {Array} - Sorted population (most novel first)
     */
  }, {
    key: "sortByNovelty",
    value: function sortByNovelty(population) {
      return _toConsumableArray(population).sort(function (a, b) {
        var noveltyA = a._noveltyScore !== undefined ? a._noveltyScore : 0;
        var noveltyB = b._noveltyScore !== undefined ? b._noveltyScore : 0;
        return noveltyB - noveltyA;
      });
    }

    /**
     * Get archive statistics
     *
     * @returns {Object} - Archive metadata
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        archiveSize: this.archive.length,
        maxArchiveSize: this.maxArchiveSize,
        currentGenerationSize: this.currentGeneration.length,
        averageNovelty: this.archive.length > 0 ? this.archive.reduce(function (sum, item) {
          return sum + item.novelty;
        }, 0) / this.archive.length : 0
      };
    }

    /**
     * Clear current generation (call between generations)
     */
  }, {
    key: "nextGeneration",
    value: function nextGeneration() {
      this.currentGeneration = [];
      this.generation = (this.generation || 0) + 1;
    }
  }]);
  return NoveltySearch;
}();
/**
 * Hybrid Fitness + Novelty selection
 *
 * Combines traditional fitness with novelty search
 * Useful for maintaining both quality and diversity
 */
var HybridNoveltyFitness = /*#__PURE__*/function () {
  function HybridNoveltyFitness(noveltySearch) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, HybridNoveltyFitness);
    var _options$noveltyWeigh = options.noveltyWeight,
      noveltyWeight = _options$noveltyWeigh === void 0 ? 0.5 : _options$noveltyWeigh,
      _options$fitnessWeigh = options.fitnessWeight,
      fitnessWeight = _options$fitnessWeigh === void 0 ? 0.5 : _options$fitnessWeigh;
    validateRatio(noveltyWeight, 'noveltyWeight');
    validateRatio(fitnessWeight, 'fitnessWeight');
    this.noveltySearch = noveltySearch;
    this.noveltyWeight = noveltyWeight;
    this.fitnessWeight = fitnessWeight;
  }

  /**
   * Calculate combined score
   *
   * @param {Individual} individual - Individual to score
   * @returns {number} - Combined score
   */
  _createClass(HybridNoveltyFitness, [{
    key: "calculateScore",
    value: function calculateScore(individual) {
      var fitness = typeof individual.fitness === 'function' ? individual.fitness() : individual.fitness;
      var novelty = individual._noveltyScore || 0;

      // Normalize both to [0, 1] if needed
      // (assumes fitness and novelty are already on similar scales)

      return this.fitnessWeight * fitness + this.noveltyWeight * novelty;
    }

    /**
     * Evaluate population with hybrid scoring
     *
     * @param {Array} population - Population
     * @param {Function} behaviorExtractor - Function to extract behavior
     * @returns {Array} - Combined scores
     */
  }, {
    key: "evaluatePopulation",
    value: function evaluatePopulation(population, behaviorExtractor) {
      var _this16 = this;
      // Calculate novelty scores
      this.noveltySearch.evaluatePopulation(population, behaviorExtractor);

      // Calculate combined scores
      var scores = population.map(function (ind) {
        return _this16.calculateScore(ind);
      });

      // Store on individuals
      population.forEach(function (ind, i) {
        ind._hybridScore = scores[i];
      });
      return scores;
    }

    /**
     * Sort by hybrid score
     */
  }, {
    key: "sortByScore",
    value: function sortByScore(population) {
      return _toConsumableArray(population).sort(function (a, b) {
        var scoreA = a._hybridScore !== undefined ? a._hybridScore : 0;
        var scoreB = b._hybridScore !== undefined ? b._hybridScore : 0;
        return scoreB - scoreA;
      });
    }
  }]);
  return HybridNoveltyFitness;
}();
/**
 * Multi-Objective Optimization using Pareto dominance and crowding distance
 *
 * Based on NSGA-II (Deb et al., 2002)
 * - Non-dominated sorting
 * - Crowding distance
 * - Elitism
 *
 * Use when optimizing multiple conflicting objectives simultaneously
 * (e.g., speed vs accuracy, cost vs quality)
 */
var MultiObjective = /*#__PURE__*/function () {
  function MultiObjective() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, MultiObjective);
    var _options$objectives = options.objectives,
      objectives = _options$objectives === void 0 ? [] : _options$objectives;
    this.objectives = objectives;
  }

  /**
   * Check if solution A dominates solution B
   *
   * A dominates B if:
   * - A is better or equal in ALL objectives
   * - A is strictly better in AT LEAST ONE objective
   *
   * @param {Object} solutionA - First solution with objectives
   * @param {Object} solutionB - Second solution with objectives
   * @returns {boolean} - True if A dominates B
   */
  _createClass(MultiObjective, [{
    key: "dominates",
    value: function dominates(solutionA, solutionB) {
      var betterInAtLeastOne = false;
      var worseInAny = false;
      var _iterator41 = _createForOfIteratorHelper(this.objectives),
        _step41;
      try {
        for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {
          var obj = _step41.value;
          var valueA = solutionA[obj];
          var valueB = solutionB[obj];
          if (valueA > valueB) {
            betterInAtLeastOne = true;
          } else if (valueA < valueB) {
            worseInAny = true;
          }
        }
      } catch (err) {
        _iterator41.e(err);
      } finally {
        _iterator41.f();
      }
      return betterInAtLeastOne && !worseInAny;
    }

    /**
     * Fast non-dominated sorting (NSGA-II)
     *
     * Ranks population into Pareto fronts:
     * - Front 0: Non-dominated solutions (Pareto front)
     * - Front 1: Dominated only by front 0
     * - Front 2: Dominated only by fronts 0 and 1
     * - etc.
     *
     * @param {Array} population - Population with objective values
     * @returns {Array} - Array of fronts, each front is an array of solutions
     */
  }, {
    key: "fastNonDominatedSort",
    value: function fastNonDominatedSort(population) {
      var fronts = [[]];

      // For each solution, track:
      // - dominatedBy: count of solutions that dominate it
      // - dominates: set of solutions it dominates
      population.forEach(function (p) {
        p._dominatedBy = 0;
        p._dominates = [];
      });

      // Calculate domination relationships
      for (var _i28 = 0; _i28 < population.length; _i28++) {
        for (var j = _i28 + 1; j < population.length; j++) {
          var p = population[_i28];
          var q = population[j];
          if (this.dominates(p, q)) {
            p._dominates.push(q);
            q._dominatedBy++;
          } else if (this.dominates(q, p)) {
            q._dominates.push(p);
            p._dominatedBy++;
          }
        }
      }

      // Front 0: non-dominated solutions
      population.forEach(function (p) {
        if (p._dominatedBy === 0) {
          p._rank = 0;
          fronts[0].push(p);
        }
      });

      // Generate subsequent fronts
      var i = 0;
      while (i < fronts.length && fronts[i].length > 0) {
        var nextFront = [];
        var _iterator42 = _createForOfIteratorHelper(fronts[i]),
          _step42;
        try {
          for (_iterator42.s(); !(_step42 = _iterator42.n()).done;) {
            var _p = _step42.value;
            var _iterator43 = _createForOfIteratorHelper(_p._dominates),
              _step43;
            try {
              for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {
                var _q = _step43.value;
                _q._dominatedBy--;
                if (_q._dominatedBy === 0) {
                  _q._rank = i + 1;
                  nextFront.push(_q);
                }
              }
            } catch (err) {
              _iterator43.e(err);
            } finally {
              _iterator43.f();
            }
          }
        } catch (err) {
          _iterator42.e(err);
        } finally {
          _iterator42.f();
        }
        if (nextFront.length > 0) {
          fronts.push(nextFront);
        }
        i++;
      }
      return fronts.filter(function (f) {
        return f.length > 0;
      });
    }

    /**
     * Calculate crowding distance for solutions in a front
     *
     * Crowding distance = sum of distances to nearest neighbors for each objective
     * Higher distance = more isolated = more valuable for diversity
     *
     * @param {Array} front - Solutions in the same Pareto front
     */
  }, {
    key: "calculateCrowdingDistance",
    value: function calculateCrowdingDistance(front) {
      if (front.length === 0) return;

      // Initialize distances
      front.forEach(function (p) {
        return p._crowdingDistance = 0;
      });

      // For each objective
      var _iterator44 = _createForOfIteratorHelper(this.objectives),
        _step44;
      try {
        var _loop6 = function _loop6() {
          var obj = _step44.value;
          // Sort by objective value
          front.sort(function (a, b) {
            return a[obj] - b[obj];
          });

          // Boundary solutions get infinite distance
          front[0]._crowdingDistance = Infinity;
          front[front.length - 1]._crowdingDistance = Infinity;

          // Normalize objective range
          var minValue = front[0][obj];
          var maxValue = front[front.length - 1][obj];
          var range = maxValue - minValue;
          if (range === 0) return 1; // continue

          // Calculate crowding distance for middle solutions
          for (var i = 1; i < front.length - 1; i++) {
            var _distance = (front[i + 1][obj] - front[i - 1][obj]) / range;
            front[i]._crowdingDistance += _distance;
          }
        };
        for (_iterator44.s(); !(_step44 = _iterator44.n()).done;) {
          if (_loop6()) continue;
        }
      } catch (err) {
        _iterator44.e(err);
      } finally {
        _iterator44.f();
      }
    }

    /**
     * Evaluate population with multiple objectives
     *
     * @param {Array} population - Population of individuals
     * @param {Object} objectiveFunctions - Map of objective name to function
     * @returns {Object} - { fronts, rankings }
     */
  }, {
    key: "evaluatePopulation",
    value: function evaluatePopulation(population, objectiveFunctions) {
      var _this17 = this;
      // Evaluate all objectives for each individual
      population.forEach(function (ind) {
        var _iterator45 = _createForOfIteratorHelper(_this17.objectives),
          _step45;
        try {
          for (_iterator45.s(); !(_step45 = _iterator45.n()).done;) {
            var objName = _step45.value;
            var objFunc = objectiveFunctions[objName];
            if (!objFunc) {
              throw new Error("Objective function '".concat(objName, "' not provided"));
            }
            ind[objName] = objFunc(ind);
          }
        } catch (err) {
          _iterator45.e(err);
        } finally {
          _iterator45.f();
        }
      });

      // Non-dominated sorting
      var fronts = this.fastNonDominatedSort(population);

      // Calculate crowding distance for each front
      fronts.forEach(function (front) {
        return _this17.calculateCrowdingDistance(front);
      });
      return {
        fronts: fronts,
        paretoFront: fronts[0] // Best solutions
      };
    }

    /**
     * Select best individuals using Pareto ranking and crowding distance
     *
     * @param {Array} population - Population
     * @param {number} count - Number to select
     * @returns {Array} - Selected individuals
     */
  }, {
    key: "select",
    value: function select(population, count) {
      // Sort by rank, then by crowding distance
      var sorted = _toConsumableArray(population).sort(function (a, b) {
        // First compare rank (lower is better)
        if (a._rank !== b._rank) {
          return a._rank - b._rank;
        }

        // Same rank: prefer higher crowding distance (more diverse)
        return b._crowdingDistance - a._crowdingDistance;
      });
      return sorted.slice(0, count);
    }

    /**
     * Get Pareto front (non-dominated solutions)
     *
     * @param {Array} population - Population
     * @returns {Array} - Pareto front
     */
  }, {
    key: "getParetoFront",
    value: function getParetoFront(population) {
      var fronts = this.fastNonDominatedSort(population);
      return fronts[0] || [];
    }
  }]);
  return MultiObjective;
}();
/**
 * Hill Climbing - Local search optimization
 *
 * Combines with GA for hybrid approach:
 * - GA provides global exploration
 * - Hill Climbing provides local exploitation
 *
 * Apply hill climbing to elite individuals for refinement
 */
var HillClimbing = /*#__PURE__*/function () {
  function HillClimbing() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, HillClimbing);
    var _options$maxIteration = options.maxIterations,
      maxIterations = _options$maxIteration === void 0 ? 10 : _options$maxIteration,
      _options$mutationStre = options.mutationStrength,
      mutationStrength = _options$mutationStre === void 0 ? 0.001 : _options$mutationStre,
      _options$patience = options.patience,
      patience = _options$patience === void 0 ? 3 : _options$patience;
    validatePositiveInteger(maxIterations, 'maxIterations');
    validateRatio(mutationStrength, 'mutationStrength');
    validatePositiveInteger(patience, 'patience');
    this.maxIterations = maxIterations;
    this.mutationStrength = mutationStrength;
    this.patience = patience;
  }

  /**
   * Apply hill climbing to a single individual
   *
   * @param {Individual} individual - Individual to optimize
   * @param {Function} fitnessFunc - Fitness evaluation function
   * @returns {Individual} - Improved individual
   */
  _createClass(HillClimbing, [{
    key: "climb",
    value: function climb(individual) {
      var fitnessFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var evaluate = fitnessFunc || function (ind) {
        return typeof ind.fitness === 'function' ? ind.fitness() : ind.fitness;
      };
      var current = individual;
      var currentFitness = evaluate(current);
      var bestFitness = currentFitness;
      var noImprovementCount = 0;
      for (var i = 0; i < this.maxIterations; i++) {
        // Create neighbor by small mutation
        var neighbor = this._createNeighbor(current);
        var neighborFitness = evaluate(neighbor);

        // If neighbor is better, move to it
        if (neighborFitness > currentFitness) {
          current = neighbor;
          currentFitness = neighborFitness;
          if (currentFitness > bestFitness) {
            bestFitness = currentFitness;
            noImprovementCount = 0;
          }
        } else {
          noImprovementCount++;
        }

        // Early stopping if no improvement
        if (noImprovementCount >= this.patience) {
          break;
        }
      }
      return current;
    }

    /**
     * Apply hill climbing to multiple individuals in parallel
     *
     * @param {Array} individuals - Individuals to optimize
     * @param {Function} fitnessFunc - Fitness evaluation function
     * @returns {Array} - Improved individuals
     */
  }, {
    key: "climbPopulation",
    value: function climbPopulation(individuals) {
      var _this18 = this;
      var fitnessFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return individuals.map(function (ind) {
        return _this18.climb(ind, fitnessFunc);
      });
    }

    /**
     * Create a neighbor by small mutation
     * @private
     */
  }, {
    key: "_createNeighbor",
    value: function _createNeighbor(individual) {
      var _individual$brain;
      // Clone the individual
      var IndClass = individual.constructor;
      var sensors = individual._sensors || [];
      var actions = individual._actions || [];
      var neuronCount = (_individual$brain = individual.brain) !== null && _individual$brain !== void 0 && (_individual$brain = _individual$brain.definitions) !== null && _individual$brain !== void 0 && _individual$brain.neurons ? Object.keys(individual.brain.definitions.neurons).length : 0;
      var neighborGenome = Reproduction.genomeMutate(individual.genome, {
        mutationRate: this.mutationStrength,
        maxSensorId: Math.max(0, sensors.length - 1),
        maxActionId: Math.max(0, actions.length - 1),
        maxNeuronId: Math.max(0, neuronCount - 1)
      });

      // Create new individual with mutated genome
      var neighbor = new IndClass({
        genome: neighborGenome,
        sensors: sensors,
        actions: actions,
        environment: individual.environment || {}
      });
      return neighbor;
    }
  }]);
  return HillClimbing;
}();
/**
 * Hybrid GA + Hill Climbing optimizer
 *
 * Applies hill climbing to elite individuals after each generation
 */
var HybridGAHC = /*#__PURE__*/function () {
  function HybridGAHC(hillClimbing) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, HybridGAHC);
    var _options$applyToElite = options.applyToEliteRatio,
      applyToEliteRatio = _options$applyToElite === void 0 ? 0.10 : _options$applyToElite;
    validateRatio(applyToEliteRatio, 'applyToEliteRatio');
    this.hillClimbing = hillClimbing;
    this.applyToEliteRatio = applyToEliteRatio;
  }

  /**
   * Refine elite individuals using hill climbing
   *
   * @param {Array} population - Population
   * @param {Function} fitnessFunc - Fitness function
   * @returns {Array} - Population with refined elite
   */
  _createClass(HybridGAHC, [{
    key: "refineElite",
    value: function refineElite(population) {
      var fitnessFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      // Sort by fitness
      var sorted = _toConsumableArray(population).sort(function (a, b) {
        var fitA = typeof a.fitness === 'function' ? a.fitness() : a.fitness;
        var fitB = typeof b.fitness === 'function' ? b.fitness() : b.fitness;
        return fitB - fitA;
      });

      // Select elite
      var eliteCount = Math.ceil(population.length * this.applyToEliteRatio);
      var elite = sorted.slice(0, eliteCount);

      // Apply hill climbing to elite
      var refined = this.hillClimbing.climbPopulation(elite, fitnessFunc);

      // Replace elite in population
      for (var i = 0; i < eliteCount; i++) {
        var idx = population.indexOf(sorted[i]);
        if (idx !== -1) {
          population[idx] = refined[i];
        }
      }
      return population;
    }
  }]);
  return HybridGAHC;
}();
/**
 * VertexPool - Object pooling for neural network vertices
 *
 * Pre-allocates all vertex objects to achieve zero-allocation brain ticking.
 * This is critical for performance when evaluating large populations.
 *
 * Memory savings: Predictable, no runtime allocations
 * CPU savings: ~20% faster brain ticking (no GC during tick)
 *
 * Usage:
 * ```javascript
 * const pool = new VertexPool(10000)
 * const vertex = pool.acquire()
 * vertex.id = 42
 * vertex.type = 'neuron'
 * // ... use vertex ...
 * pool.release(vertex)  // Return to pool
 * ```
 */
var VertexPool = /*#__PURE__*/function () {
  function VertexPool() {
    var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
    _classCallCheck(this, VertexPool);
    this.maxSize = maxSize;

    // Pre-allocate all vertex objects
    this.vertices = new Array(maxSize);
    for (var i = 0; i < maxSize; i++) {
      this.vertices[i] = this._createVertex(i);
    }

    // Free list - indices of available vertices
    this.available = new Uint16Array(maxSize);
    this.nextIndex = 0;

    // Initialize free list (all vertices available initially)
    for (var _i29 = 0; _i29 < maxSize; _i29++) {
      this.available[_i29] = _i29;
    }

    // Statistics
    this.stats = {
      acquired: 0,
      released: 0,
      peakUsage: 0,
      currentUsage: 0
    };
  }

  /**
   * Create a vertex object
   * @private
   * @param {number} poolId - Pool index
   * @returns {Object} Vertex object
   */
  _createClass(VertexPool, [{
    key: "_createVertex",
    value: function _createVertex(poolId) {
      return {
        // Pool metadata
        _poolId: poolId,
        _inUse: false,
        // Vertex data
        id: 0,
        type: '',
        // 'sensor', 'neuron', 'action'
        value: 0,
        bias: 0,
        activation: null,
        // Function reference

        // Metadata
        lastTick: -1,
        depth: 0,
        // For evolved neurons (legacy compatibility)
        operations: null,
        // Array of operation names
        primitives: null,
        // Primitive functions map

        // For memory cells
        decay: 0,
        persistence: 0
      };
    }

    /**
     * Acquire a vertex from the pool
     * @returns {Object} Vertex object
     * @throws {Error} If pool is exhausted
     */
  }, {
    key: "acquire",
    value: function acquire() {
      if (this.nextIndex >= this.maxSize) {
        throw new Error("VertexPool exhausted (max ".concat(this.maxSize, " vertices)"));
      }

      // Get next available vertex
      var idx = this.available[this.nextIndex++];
      var vertex = this.vertices[idx];

      // Mark as in use
      vertex._inUse = true;

      // Update statistics
      this.stats.acquired++;
      this.stats.currentUsage++;
      if (this.stats.currentUsage > this.stats.peakUsage) {
        this.stats.peakUsage = this.stats.currentUsage;
      }
      return vertex;
    }

    /**
     * Release a vertex back to the pool
     * @param {Object} vertex - Vertex to release
     */
  }, {
    key: "release",
    value: function release(vertex) {
      if (!vertex || !vertex._inUse) {
        // Already released or invalid
        return;
      }

      // Clear vertex data for reuse
      vertex.id = 0;
      vertex.type = '';
      vertex.value = 0;
      vertex.bias = 0;
      vertex.activation = null;
      vertex.lastTick = -1;
      vertex.depth = 0;
      vertex.operations = null;
      vertex.primitives = null;
      vertex.decay = 0;
      vertex.persistence = 0;

      // Mark as not in use
      vertex._inUse = false;

      // Return to free list
      this.available[--this.nextIndex] = vertex._poolId;

      // Update statistics
      this.stats.released++;
      this.stats.currentUsage--;
    }

    /**
     * Release multiple vertices at once
     * @param {Array<Object>} vertices - Vertices to release
     */
  }, {
    key: "releaseAll",
    value: function releaseAll(vertices) {
      var _iterator46 = _createForOfIteratorHelper(vertices),
        _step46;
      try {
        for (_iterator46.s(); !(_step46 = _iterator46.n()).done;) {
          var vertex = _step46.value;
          this.release(vertex);
        }
      } catch (err) {
        _iterator46.e(err);
      } finally {
        _iterator46.f();
      }
    }

    /**
     * Reset pool - release all vertices
     */
  }, {
    key: "reset",
    value: function reset() {
      // Release all in-use vertices
      for (var i = 0; i < this.maxSize; i++) {
        var vertex = this.vertices[i];
        if (vertex._inUse) {
          this.release(vertex);
        }
      }

      // Reset free list
      this.nextIndex = 0;
      for (var _i30 = 0; _i30 < this.maxSize; _i30++) {
        this.available[_i30] = _i30;
      }
    }

    /**
     * Get pool statistics
     * @returns {Object} Statistics
     */
  }, {
    key: "getStats",
    value: function getStats() {
      var utilizationRate = this.stats.currentUsage / this.maxSize;
      return _objectSpread(_objectSpread({}, this.stats), {}, {
        utilizationRate: utilizationRate,
        available: this.maxSize - this.nextIndex,
        utilizationPercent: (utilizationRate * 100).toFixed(2)
      });
    }

    /**
     * Get memory usage estimate
     * @returns {Object} Memory usage in bytes
     */
  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      // Rough estimate: each vertex ~150 bytes
      var bytesPerVertex = 150;
      var total = this.maxSize * bytesPerVertex;
      return {
        vertices: this.maxSize,
        bytesPerVertex: bytesPerVertex,
        total: total,
        totalKB: (total / 1024).toFixed(2),
        totalMB: (total / (1024 * 1024)).toFixed(2)
      };
    }

    /**
     * Check if pool has capacity
     * @param {number} count - Number of vertices needed
     * @returns {boolean} True if capacity available
     */
  }, {
    key: "hasCapacity",
    value: function hasCapacity() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.nextIndex + count <= this.maxSize;
    }

    /**
     * Get current utilization percentage
     * @returns {number} Utilization (0-100)
     */
  }, {
    key: "getUtilization",
    value: function getUtilization() {
      return this.stats.currentUsage / this.maxSize * 100;
    }

    /**
     * Expand pool size (expensive - pre-allocates more vertices)
     * @param {number} additionalSize - Number of vertices to add
     */
  }, {
    key: "expand",
    value: function expand(additionalSize) {
      var oldSize = this.maxSize;
      var newSize = oldSize + additionalSize;

      // Expand vertices array
      this.vertices.length = newSize;
      for (var i = oldSize; i < newSize; i++) {
        this.vertices[i] = this._createVertex(i);
      }

      // Expand available list
      var newAvailable = new Uint16Array(newSize);
      newAvailable.set(this.available);
      for (var _i31 = oldSize; _i31 < newSize; _i31++) {
        newAvailable[_i31] = _i31;
      }
      this.available = newAvailable;
      this.maxSize = newSize;
    }

    /**
     * Compact pool - remove released vertices from memory
     * WARNING: This is expensive and should only be done during idle periods
     */
  }, {
    key: "compact",
    value: function compact() {
      // Find all in-use vertices
      var inUse = [];
      for (var i = 0; i < this.maxSize; i++) {
        if (this.vertices[i]._inUse) {
          inUse.push(this.vertices[i]);
        }
      }

      // Recreate pool with only needed size
      var newSize = Math.max(inUse.length * 2, 100); // 2x current usage, min 100
      this.maxSize = newSize;

      // Recreate arrays
      this.vertices = new Array(newSize);
      for (var _i32 = 0; _i32 < newSize; _i32++) {
        if (_i32 < inUse.length) {
          this.vertices[_i32] = inUse[_i32];
          this.vertices[_i32]._poolId = _i32;
        } else {
          this.vertices[_i32] = this._createVertex(_i32);
        }
      }

      // Recreate free list
      this.available = new Uint16Array(newSize);
      this.nextIndex = inUse.length;
      for (var _i33 = inUse.length; _i33 < newSize; _i33++) {
        this.available[_i33] = _i33;
      }
    }
  }]);
  return VertexPool;
}();
/**
 * Global singleton vertex pool
 * Use this for most cases to maximize reuse across the application
 */
var globalVertexPool = new VertexPool(10000);

/**
 * Experience Buffer for Reinforcement Learning
 * Stores and samples experiences for training
 */
var ExperienceBuffer = /*#__PURE__*/function () {
  function ExperienceBuffer() {
    var capacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
    _classCallCheck(this, ExperienceBuffer);
    this.capacity = capacity;
    this.buffer = [];
    this.position = 0;
    this.priorities = [];
    this.epsilon = 0.01;
    this.alpha = 0.6;
    this.beta = 0.4;
    this.betaIncrement = 0.001;
  }

  /**
   * Add experience to buffer
   * @param {Object} experience - {state, action, reward, nextState, done}
   * @param {Number} priority - Optional priority for prioritized replay
   */
  _createClass(ExperienceBuffer, [{
    key: "add",
    value: function add(experience) {
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (priority === null) {
        priority = this.priorities.length > 0 ? Math.max.apply(Math, _toConsumableArray(this.priorities)) : 1;
      }
      if (this.buffer.length < this.capacity) {
        this.buffer.push(experience);
        this.priorities.push(priority);
      } else {
        this.buffer[this.position] = experience;
        this.priorities[this.position] = priority;
      }
      this.position = (this.position + 1) % this.capacity;
    }

    /**
     * Sample batch of experiences
     * @param {Number} batchSize - Number of experiences to sample
     * @param {Boolean} prioritized - Use prioritized experience replay
     */
  }, {
    key: "sample",
    value: function sample(batchSize) {
      var prioritized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var n = this.buffer.length;
      if (n < batchSize) {
        return this.buffer.slice();
      }
      if (!prioritized) {
        // Uniform random sampling
        var _indices = [];
        var _samples = [];
        while (_indices.length < batchSize) {
          var idx = Math.floor(Math.random() * n);
          if (!_indices.includes(idx)) {
            _indices.push(idx);
            _samples.push(this.buffer[idx]);
          }
        }
        return _samples;
      }

      // Prioritized sampling
      var samples = [];
      var indices = [];
      var weights = [];

      // Calculate sampling probabilities
      var priorities = this.priorities.slice(0, n);
      var probs = this._calculateProbabilities(priorities);

      // Sample according to priorities
      for (var i = 0; i < batchSize; i++) {
        var _idx = this._sampleIndex(probs);
        indices.push(_idx);
        samples.push(this.buffer[_idx]);

        // Calculate importance sampling weight
        var prob = probs[_idx];
        var weight = Math.pow(n * prob, -this.beta);
        weights.push(weight);
      }

      // Normalize weights
      var maxWeight = Math.max.apply(Math, weights);
      var normalizedWeights = weights.map(function (w) {
        return w / maxWeight;
      });

      // Increase beta
      this.beta = Math.min(1, this.beta + this.betaIncrement);
      return samples.map(function (exp, i) {
        return _objectSpread(_objectSpread({}, exp), {}, {
          weight: normalizedWeights[i],
          index: indices[i]
        });
      });
    }

    /**
     * Update priorities for sampled experiences
     * @param {Array} indices - Indices of experiences
     * @param {Array} tdErrors - TD errors for priority update
     */
  }, {
    key: "updatePriorities",
    value: function updatePriorities(indices, tdErrors) {
      for (var i = 0; i < indices.length; i++) {
        var priority = Math.pow(Math.abs(tdErrors[i]) + this.epsilon, this.alpha);
        this.priorities[indices[i]] = priority;
      }
    }

    /**
     * Calculate sampling probabilities from priorities
     */
  }, {
    key: "_calculateProbabilities",
    value: function _calculateProbabilities(priorities) {
      var _this19 = this;
      var sum = priorities.reduce(function (a, b) {
        return a + Math.pow(b, _this19.alpha);
      }, 0);
      return priorities.map(function (p) {
        return Math.pow(p, _this19.alpha) / sum;
      });
    }

    /**
     * Sample index according to probabilities
     */
  }, {
    key: "_sampleIndex",
    value: function _sampleIndex(probs) {
      var r = Math.random();
      var cumSum = 0;
      for (var i = 0; i < probs.length; i++) {
        cumSum += probs[i];
        if (r <= cumSum) {
          return i;
        }
      }
      return probs.length - 1;
    }

    /**
     * Get current buffer size
     */
  }, {
    key: "size",
    value: function size() {
      return this.buffer.length;
    }

    /**
     * Clear the buffer
     */
  }, {
    key: "clear",
    value: function clear() {
      this.buffer = [];
      this.priorities = [];
      this.position = 0;
    }

    /**
     * Get statistics about the buffer
     */
  }, {
    key: "getStats",
    value: function getStats() {
      if (this.buffer.length === 0) {
        return {
          size: 0,
          avgReward: 0,
          avgPriority: 0
        };
      }
      var rewards = this.buffer.map(function (exp) {
        return exp.reward;
      });
      var avgReward = rewards.reduce(function (a, b) {
        return a + b;
      }, 0) / rewards.length;
      var avgPriority = this.priorities.slice(0, this.buffer.length).reduce(function (a, b) {
        return a + b;
      }, 0) / this.buffer.length;
      return {
        size: this.buffer.length,
        avgReward: avgReward,
        avgPriority: avgPriority,
        minReward: Math.min.apply(Math, _toConsumableArray(rewards)),
        maxReward: Math.max.apply(Math, _toConsumableArray(rewards))
      };
    }

    /**
     * Save buffer to JSON
     */
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        buffer: this.buffer,
        priorities: this.priorities,
        position: this.position,
        capacity: this.capacity,
        alpha: this.alpha,
        beta: this.beta
      };
    }

    /**
     * Load buffer from JSON
     */
  }], [{
    key: "fromJSON",
    value: function fromJSON(json) {
      var buffer = new ExperienceBuffer(json.capacity);
      buffer.buffer = json.buffer;
      buffer.priorities = json.priorities;
      buffer.position = json.position;
      buffer.alpha = json.alpha;
      buffer.beta = json.beta;
      return buffer;
    }
  }]);
  return ExperienceBuffer;
}();
/**
 * Q-Learning Individual
 * Extends Individual with Q-Learning capabilities
 */
var QLearningIndividual = /*#__PURE__*/function (_Individual) {
  _inherits(QLearningIndividual, _Individual);
  var _super2 = _createSuper(QLearningIndividual);
  function QLearningIndividual() {
    var _this20;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, QLearningIndividual);
    _this20 = _super2.call(this, options);
    var _options$rlConfig = options.rlConfig,
      rlConfig = _options$rlConfig === void 0 ? {} : _options$rlConfig;

    // Q-Learning parameters
    _this20.learningRate = rlConfig.learningRate || 0.1;
    _this20.discountFactor = rlConfig.discountFactor || 0.95;
    _this20.epsilon = rlConfig.epsilon || 0.1;
    _this20.epsilonDecay = rlConfig.epsilonDecay || 0.995;
    _this20.epsilonMin = rlConfig.epsilonMin || 0.01;
    _this20.useSoftmax = rlConfig.useSoftmax || false;
    _this20.temperature = rlConfig.temperature || 1.0;

    // Q-table or Q-network
    _this20.qTable = new Map();
    _this20.useNeuralQ = rlConfig.useNeuralQ || false;

    // Experience replay
    _this20.experienceBuffer = new ExperienceBuffer(rlConfig.bufferSize || 10000);
    _this20.batchSize = rlConfig.batchSize || 32;
    _this20.updateFrequency = rlConfig.updateFrequency || 4;
    _this20.stepCounter = 0;

    // State and action tracking
    _this20.lastState = null;
    _this20.lastAction = null;
    _this20.episodeRewards = [];
    _this20.totalReward = 0;

    // Learning mode
    _this20.learningEnabled = true;
    _this20.explorationEnabled = true;
    return _this20;
  }

  /**
   * Get Q-value for state-action pair
   */
  _createClass(QLearningIndividual, [{
    key: "getQValue",
    value: function getQValue(state, action) {
      if (this.useNeuralQ) {
        return this._getNeuralQValue(state, action);
      }
      var key = this._getStateKey(state);
      if (!this.qTable.has(key)) {
        this.qTable.set(key, new Map());
      }
      var actionValues = this.qTable.get(key);
      if (!actionValues.has(action)) {
        actionValues.set(action, 0);
      }
      return actionValues.get(action);
    }

    /**
     * Set Q-value for state-action pair
     */
  }, {
    key: "setQValue",
    value: function setQValue(state, action, value) {
      if (this.useNeuralQ) {
        return this._updateNeuralQ(state, action, value);
      }
      var key = this._getStateKey(state);
      if (!this.qTable.has(key)) {
        this.qTable.set(key, new Map());
      }
      this.qTable.get(key).set(action, value);
    }

    /**
     * Choose action using epsilon-greedy or softmax policy
     */
  }, {
    key: "chooseAction",
    value: function chooseAction(state, availableActions) {
      if (!availableActions || availableActions.length === 0) {
        return null;
      }

      // Exploration vs Exploitation
      if (this.explorationEnabled) {
        if (this.useSoftmax) {
          return this._chooseSoftmaxAction(state, availableActions);
        } else if (Math.random() < this.epsilon) {
          // Random exploration
          return availableActions[Math.floor(Math.random() * availableActions.length)];
        }
      }

      // Exploitation: choose best action
      var bestAction = availableActions[0];
      var bestValue = this.getQValue(state, bestAction);
      var _iterator47 = _createForOfIteratorHelper(availableActions),
        _step47;
      try {
        for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {
          var action = _step47.value;
          var value = this.getQValue(state, action);
          if (value > bestValue) {
            bestValue = value;
            bestAction = action;
          }
        }
      } catch (err) {
        _iterator47.e(err);
      } finally {
        _iterator47.f();
      }
      return bestAction;
    }

    /**
     * Choose action using softmax probability distribution
     */
  }, {
    key: "_chooseSoftmaxAction",
    value: function _chooseSoftmaxAction(state, availableActions) {
      var _this21 = this;
      var values = availableActions.map(function (a) {
        return _this21.getQValue(state, a);
      });
      var expValues = values.map(function (v) {
        return Math.exp(v / _this21.temperature);
      });
      var sumExp = expValues.reduce(function (a, b) {
        return a + b;
      }, 0);
      var probs = expValues.map(function (v) {
        return v / sumExp;
      });
      var r = Math.random();
      var cumSum = 0;
      for (var i = 0; i < probs.length; i++) {
        cumSum += probs[i];
        if (r <= cumSum) {
          return availableActions[i];
        }
      }
      return availableActions[availableActions.length - 1];
    }

    /**
     * Update Q-values based on experience
     */
  }, {
    key: "learn",
    value: function learn(state, action, reward, nextState) {
      var done = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      if (!this.learningEnabled) return;

      // Store experience
      this.experienceBuffer.add({
        state: state,
        action: action,
        reward: reward,
        nextState: nextState,
        done: done
      });

      // Update total reward
      this.totalReward += reward;
      this.episodeRewards.push(reward);

      // Direct Q-learning update
      if (!this.useNeuralQ || this.stepCounter % this.updateFrequency === 0) {
        this._updateQValue(state, action, reward, nextState, done);
      }

      // Batch learning from experience replay
      if (this.experienceBuffer.size() >= this.batchSize) {
        this._learnFromBatch();
      }

      // Decay epsilon
      if (this.epsilon > this.epsilonMin) {
        this.epsilon *= this.epsilonDecay;
      }
      this.stepCounter++;
    }

    /**
     * Update Q-value using Q-learning formula
     */
  }, {
    key: "_updateQValue",
    value: function _updateQValue(state, action, reward, nextState, done) {
      var currentQ = this.getQValue(state, action);
      var targetQ;
      if (done) {
        targetQ = reward;
      } else {
        var maxNextQ = this._getMaxQValue(nextState);
        targetQ = reward + this.discountFactor * maxNextQ;
      }
      var newQ = currentQ + this.learningRate * (targetQ - currentQ);
      this.setQValue(state, action, newQ);
      return Math.abs(targetQ - currentQ); // TD error for prioritized replay
    }

    /**
     * Get maximum Q-value for a state
     */
  }, {
    key: "_getMaxQValue",
    value: function _getMaxQValue(state) {
      var key = this._getStateKey(state);
      if (!this.qTable.has(key)) {
        return 0;
      }
      var actionValues = this.qTable.get(key);
      if (actionValues.size === 0) {
        return 0;
      }
      return Math.max.apply(Math, _toConsumableArray(actionValues.values()));
    }

    /**
     * Learn from batch of experiences
     */
  }, {
    key: "_learnFromBatch",
    value: function _learnFromBatch() {
      var batch = this.experienceBuffer.sample(this.batchSize, false);
      var _iterator48 = _createForOfIteratorHelper(batch),
        _step48;
      try {
        for (_iterator48.s(); !(_step48 = _iterator48.n()).done;) {
          var exp = _step48.value;
          this._updateQValue(exp.state, exp.action, exp.reward, exp.nextState, exp.done);
        }
      } catch (err) {
        _iterator48.e(err);
      } finally {
        _iterator48.f();
      }
    }

    /**
     * Override tick to integrate Q-learning
     */
  }, {
    key: "tick",
    value: function tick() {
      // Get current state from sensors
      var currentState = this._getCurrentState();

      // Choose action based on Q-values
      var availableActions = this._getAvailableActions();
      var action = this.chooseAction(currentState, availableActions);

      // Execute action through parent tick
      var result = _get(_getPrototypeOf(QLearningIndividual.prototype), "tick", this).call(this);

      // Learn from previous experience
      if (this.lastState !== null && this.lastAction !== null) {
        var reward = this.getReward ? this.getReward(this.lastAction, result) : 0;
        this.learn(this.lastState, this.lastAction, reward, currentState);
      }

      // Update last state and action
      this.lastState = currentState;
      this.lastAction = action;
      return result;
    }

    /**
     * Get current state from sensors
     * Override this in subclass
     */
  }, {
    key: "_getCurrentState",
    value: function _getCurrentState() {
      // Default: concatenate all sensor values
      var sensors = this.brain.vertices.filter(function (v) {
        return v.type === 'sensor';
      });
      return sensors.map(function (s) {
        return s.fn ? s.fn() : 0;
      });
    }

    /**
     * Get available actions
     * Override this in subclass
     */
  }, {
    key: "_getAvailableActions",
    value: function _getAvailableActions() {
      // Default: all action indices
      var actions = this.brain.vertices.filter(function (v) {
        return v.type === 'action';
      });
      return Array.from({
        length: actions.length
      }, function (_, i) {
        return i;
      });
    }

    /**
     * Convert state to string key for Q-table
     */
  }, {
    key: "_getStateKey",
    value: function _getStateKey(state) {
      if (typeof state === 'string') {
        return state;
      }
      if (Array.isArray(state)) {
        return JSON.stringify(state);
      }
      return String(state);
    }

    /**
     * Get Q-value using neural network
     * Uses the existing brain as function approximator
     */
  }, {
    key: "_getNeuralQValue",
    value: function _getNeuralQValue(state, action) {
      var _actions$;
      // Set sensor values to state
      var sensors = this.brain.vertices.filter(function (v) {
        return v.type === 'sensor';
      });
      state.forEach(function (value, i) {
        if (sensors[i]) {
          sensors[i].value = value;
        }
      });

      // Add action as additional input
      if (sensors.length > state.length) {
        sensors[state.length].value = action;
      }

      // Forward pass through network
      this.brain.tick();

      // Use first action output as Q-value
      var actions = this.brain.vertices.filter(function (v) {
        return v.type === 'action';
      });
      return ((_actions$ = actions[0]) === null || _actions$ === void 0 ? void 0 : _actions$.value) || 0;
    }

    /**
     * Update neural Q-network
     */
  }, {
    key: "_updateNeuralQ",
    value: function _updateNeuralQ(state, action, targetValue) {
      // This would require backpropagation
      // For now, we'll store in table as fallback
      var key = this._getStateKey(state);
      if (!this.qTable.has(key)) {
        this.qTable.set(key, new Map());
      }
      this.qTable.get(key).set(action, targetValue);
    }

    /**
     * Reset for new episode
     */
  }, {
    key: "resetEpisode",
    value: function resetEpisode() {
      this.lastState = null;
      this.lastAction = null;
      this.episodeRewards = [];
      this.totalReward = 0;
    }

    /**
     * Get learning statistics
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        epsilon: this.epsilon,
        qTableSize: this.qTable.size,
        bufferSize: this.experienceBuffer.size(),
        totalReward: this.totalReward,
        avgReward: this.episodeRewards.length > 0 ? this.episodeRewards.reduce(function (a, b) {
          return a + b;
        }, 0) / this.episodeRewards.length : 0,
        steps: this.stepCounter
      };
    }

    /**
     * Save Q-table to JSON
     */
  }, {
    key: "exportQTable",
    value: function exportQTable() {
      var table = {};
      var _iterator49 = _createForOfIteratorHelper(this.qTable),
        _step49;
      try {
        for (_iterator49.s(); !(_step49 = _iterator49.n()).done;) {
          var _step49$value = _slicedToArray(_step49.value, 2),
            state = _step49$value[0],
            actions = _step49$value[1];
          table[state] = Object.fromEntries(actions);
        }
      } catch (err) {
        _iterator49.e(err);
      } finally {
        _iterator49.f();
      }
      return table;
    }

    /**
     * Load Q-table from JSON
     */
  }, {
    key: "importQTable",
    value: function importQTable(table) {
      this.qTable.clear();
      for (var _i34 = 0, _Object$entries4 = Object.entries(table); _i34 < _Object$entries4.length; _i34++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i34], 2),
          state = _Object$entries4$_i[0],
          actions = _Object$entries4$_i[1];
        var actionMap = new Map();
        for (var _i35 = 0, _Object$entries5 = Object.entries(actions); _i35 < _Object$entries5.length; _i35++) {
          var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i35], 2),
            action = _Object$entries5$_i[0],
            value = _Object$entries5$_i[1];
          // Convert numeric values
          var numValue = typeof value === 'string' ? parseFloat(value) : value;
          actionMap.set(action, numValue);
        }
        this.qTable.set(state, actionMap);
      }
    }

    /**
     * Enable/disable learning
     */
  }, {
    key: "setLearning",
    value: function setLearning(enabled) {
      this.learningEnabled = enabled;
    }

    /**
     * Enable/disable exploration
     */
  }, {
    key: "setExploration",
    value: function setExploration(enabled) {
      this.explorationEnabled = enabled;
    }
  }]);
  return QLearningIndividual;
}(Individual);
/**
 * Policy Gradient Individual (REINFORCE algorithm)
 * Extends Individual with policy gradient learning
 */
var PolicyGradientIndividual = /*#__PURE__*/function (_Individual2) {
  _inherits(PolicyGradientIndividual, _Individual2);
  var _super3 = _createSuper(PolicyGradientIndividual);
  function PolicyGradientIndividual() {
    var _this22;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PolicyGradientIndividual);
    _this22 = _super3.call(this, options);
    var _options$rlConfig2 = options.rlConfig,
      rlConfig = _options$rlConfig2 === void 0 ? {} : _options$rlConfig2;

    // Policy gradient parameters
    _this22.learningRate = rlConfig.learningRate || 0.01;
    _this22.discountFactor = rlConfig.discountFactor || 0.99;
    _this22.baselineAlpha = rlConfig.baselineAlpha || 0.01;
    _this22.entropyCoeff = rlConfig.entropyCoeff || 0.01;

    // Episode buffers
    _this22.states = [];
    _this22.actions = [];
    _this22.rewards = [];
    _this22.logProbs = [];

    // Baseline for variance reduction
    _this22.baseline = 0;
    _this22.useBaseline = rlConfig.useBaseline !== false;

    // Policy parameters (if not using neural network)
    _this22.policyParams = new Map();

    // Statistics
    _this22.episodeCount = 0;
    _this22.totalReward = 0;
    _this22.avgReward = 0;

    // Learning mode
    _this22.learningEnabled = true;
    return _this22;
  }

  /**
   * Get action probabilities for a state
   */
  _createClass(PolicyGradientIndividual, [{
    key: "getActionProbabilities",
    value: function getActionProbabilities(state) {
      if (this.brain) {
        return this._getNeuralPolicy(state);
      }

      // Tabular policy
      var key = this._getStateKey(state);
      if (!this.policyParams.has(key)) {
        var numActions = this._getNumActions();
        var _params = new Array(numActions).fill(0);
        this.policyParams.set(key, _params);
      }
      var params = this.policyParams.get(key);
      return this._softmax(params);
    }

    /**
     * Sample action from policy
     */
  }, {
    key: "sampleAction",
    value: function sampleAction(state) {
      var availableActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var probs = this.getActionProbabilities(state);
      if (availableActions) {
        // Mask unavailable actions
        var maskedProbs = probs.map(function (p, i) {
          return availableActions.includes(i) ? p : 0;
        });
        var sum = maskedProbs.reduce(function (a, b) {
          return a + b;
        }, 0);
        if (sum > 0) {
          maskedProbs.forEach(function (_, i) {
            return maskedProbs[i] /= sum;
          });
        }
        return this._sampleFromDistribution(maskedProbs);
      }
      return this._sampleFromDistribution(probs);
    }

    /**
     * Store transition for learning
     */
  }, {
    key: "storeTransition",
    value: function storeTransition(state, action, reward) {
      var logProb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.states.push(state);
      this.actions.push(action);
      this.rewards.push(reward);
      if (logProb === null) {
        var probs = this.getActionProbabilities(state);
        logProb = Math.log(probs[action] + 1e-10);
      }
      this.logProbs.push(logProb);
      this.totalReward += reward;
    }

    /**
     * Update policy at end of episode
     */
  }, {
    key: "updatePolicy",
    value: function updatePolicy() {
      var _this23 = this;
      if (!this.learningEnabled || this.rewards.length === 0) {
        return;
      }

      // Calculate discounted returns
      var returns = this._calculateReturns();

      // Calculate advantages (returns - baseline)
      var advantages = returns.map(function (r) {
        return r - _this23.baseline;
      });

      // Update baseline
      if (this.useBaseline) {
        var avgReturn = returns.reduce(function (a, b) {
          return a + b;
        }, 0) / returns.length;
        this.baseline = this.baseline + this.baselineAlpha * (avgReturn - this.baseline);
      }

      // Policy gradient update
      if (this.brain) {
        this._updateNeuralPolicy(advantages);
      } else {
        this._updateTabularPolicy(advantages);
      }

      // Update statistics
      this.episodeCount++;
      var episodeReward = this.rewards.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.avgReward = this.avgReward + (episodeReward - this.avgReward) / this.episodeCount;

      // Clear episode buffers
      this.clearEpisode();
    }

    /**
     * Calculate discounted returns
     */
  }, {
    key: "_calculateReturns",
    value: function _calculateReturns() {
      var returns = new Array(this.rewards.length);
      var runningReturn = 0;
      for (var t = this.rewards.length - 1; t >= 0; t--) {
        runningReturn = this.rewards[t] + this.discountFactor * runningReturn;
        returns[t] = runningReturn;
      }
      return returns;
    }

    /**
     * Update tabular policy parameters
     */
  }, {
    key: "_updateTabularPolicy",
    value: function _updateTabularPolicy(advantages) {
      for (var t = 0; t < this.states.length; t++) {
        var state = this.states[t];
        var action = this.actions[t];
        var advantage = advantages[t];
        var key = this._getStateKey(state);
        if (!this.policyParams.has(key)) {
          continue;
        }
        var params = this.policyParams.get(key);
        var probs = this._softmax(params);

        // Policy gradient for softmax policy
        for (var a = 0; a < params.length; a++) {
          var gradient = (a === action ? 1 : 0) - probs[a];
          params[a] += this.learningRate * advantage * gradient;

          // Entropy regularization
          if (this.entropyCoeff > 0) {
            var entropyGrad = -Math.log(probs[a] + 1e-10) - 1;
            params[a] += this.learningRate * this.entropyCoeff * entropyGrad * probs[a];
          }
        }
      }
    }

    /**
     * Update neural policy (requires backpropagation)
     */
  }, {
    key: "_updateNeuralPolicy",
    value: function _updateNeuralPolicy(advantages) {
      // Check if brain has vertices array
      if (!this.brain || !Array.isArray(this.brain.vertices)) {
        // Fall back to tabular update
        return this._updateTabularPolicy(advantages);
      }

      // Simplified update using finite differences
      // In practice, would need proper backpropagation

      for (var t = 0; t < this.states.length; t++) {
        var state = this.states[t];
        var action = this.actions[t];
        var advantage = advantages[t];

        // Set sensors to state
        this._setState(state);

        // Forward pass
        this.brain.tick();

        // Approximate gradient update for action neurons
        var actions = this.brain.vertices.filter(function (v) {
          return v.type === 'action';
        });
        if (actions[action]) {
          // Reinforce the selected action based on advantage
          actions[action].bias += this.learningRate * advantage * 0.1;
        }
      }
    }

    /**
     * Get neural network policy
     */
  }, {
    key: "_getNeuralPolicy",
    value: function _getNeuralPolicy(state) {
      // Check if brain has vertices array
      if (!this.brain || !Array.isArray(this.brain.vertices)) {
        // Fall back to tabular policy
        var key = this._getStateKey(state);
        if (!this.policyParams.has(key)) {
          var numActions = this._getNumActions();
          var params = new Array(numActions).fill(0);
          this.policyParams.set(key, params);
        }
        return this._softmax(this.policyParams.get(key));
      }

      // Set sensors to state
      this._setState(state);

      // Forward pass
      this.brain.tick();

      // Get action values and apply softmax
      var actions = this.brain.vertices.filter(function (v) {
        return v.type === 'action';
      });
      var values = actions.map(function (a) {
        return a.value || 0;
      });
      return this._softmax(values);
    }

    /**
     * Set brain sensors to state values
     */
  }, {
    key: "_setState",
    value: function _setState(state) {
      if (!this.brain || !Array.isArray(this.brain.vertices)) return;
      var sensors = this.brain.vertices.filter(function (v) {
        return v.type === 'sensor';
      });
      if (Array.isArray(state)) {
        state.forEach(function (value, i) {
          if (sensors[i] && sensors[i].fn) {
            // Override sensor function temporarily
            sensors[i]._originalFn = sensors[i].fn;
            sensors[i].fn = function () {
              return value;
            };
          }
        });
      }
    }

    /**
     * Restore original sensor functions
     */
  }, {
    key: "_restoreSensors",
    value: function _restoreSensors() {
      var sensors = this.brain.vertices.filter(function (v) {
        return v.type === 'sensor';
      });
      sensors.forEach(function (s) {
        if (s._originalFn) {
          s.fn = s._originalFn;
          delete s._originalFn;
        }
      });
    }

    /**
     * Softmax function
     */
  }, {
    key: "_softmax",
    value: function _softmax(values) {
      var max = Math.max.apply(Math, _toConsumableArray(values));
      var exp = values.map(function (v) {
        return Math.exp(v - max);
      });
      var sum = exp.reduce(function (a, b) {
        return a + b;
      }, 0);
      return exp.map(function (e) {
        return e / sum;
      });
    }

    /**
     * Sample from probability distribution
     */
  }, {
    key: "_sampleFromDistribution",
    value: function _sampleFromDistribution(probs) {
      var r = Math.random();
      var cumSum = 0;
      for (var i = 0; i < probs.length; i++) {
        cumSum += probs[i];
        if (r <= cumSum) {
          return i;
        }
      }
      return probs.length - 1;
    }

    /**
     * Calculate entropy of policy
     */
  }, {
    key: "calculateEntropy",
    value: function calculateEntropy(state) {
      var probs = this.getActionProbabilities(state);
      return -probs.reduce(function (sum, p) {
        return sum + (p > 0 ? p * Math.log(p) : 0);
      }, 0);
    }

    /**
     * Override tick to integrate policy gradient
     */
  }, {
    key: "tick",
    value: function tick() {
      // Get current state
      var state = this._getCurrentState();

      // Sample action from policy
      var availableActions = this._getAvailableActions();
      var action = this.sampleAction(state, availableActions);

      // Execute action
      if (action !== null) {
        this._executeAction(action);
      }

      // Parent tick
      var result = _get(_getPrototypeOf(PolicyGradientIndividual.prototype), "tick", this).call(this);

      // Store transition if learning
      if (this.learningEnabled && this.getReward) {
        var reward = this.getReward(action, result);
        this.storeTransition(state, action, reward);
      }
      return result;
    }

    /**
     * Execute selected action
     */
  }, {
    key: "_executeAction",
    value: function _executeAction(actionIndex) {
      var actions = this.brain.vertices.filter(function (v) {
        return v.type === 'action';
      });
      // Set all actions to 0
      actions.forEach(function (a) {
        return a.value = 0;
      });
      // Activate selected action
      if (actions[actionIndex]) {
        actions[actionIndex].value = 1;
      }
    }

    /**
     * Get current state from sensors
     */
  }, {
    key: "_getCurrentState",
    value: function _getCurrentState() {
      if (!this.brain || !Array.isArray(this.brain.vertices)) {
        return [];
      }
      var sensors = this.brain.vertices.filter(function (v) {
        return v.type === 'sensor';
      });
      return sensors.map(function (s) {
        return s.fn ? s.fn() : 0;
      });
    }

    /**
     * Get available actions
     */
  }, {
    key: "_getAvailableActions",
    value: function _getAvailableActions() {
      var numActions = this._getNumActions();
      return Array.from({
        length: numActions
      }, function (_, i) {
        return i;
      });
    }

    /**
     * Get number of actions
     */
  }, {
    key: "_getNumActions",
    value: function _getNumActions() {
      if (this.brain && Array.isArray(this.brain.vertices)) {
        return this.brain.vertices.filter(function (v) {
          return v.type === 'action';
        }).length;
      }
      return 3; // Default to 3 actions for tests
    }

    /**
     * Convert state to string key
     */
  }, {
    key: "_getStateKey",
    value: function _getStateKey(state) {
      if (typeof state === 'string') {
        return state;
      }
      if (Array.isArray(state)) {
        return JSON.stringify(state);
      }
      return String(state);
    }

    /**
     * Clear episode buffers
     */
  }, {
    key: "clearEpisode",
    value: function clearEpisode() {
      this.states = [];
      this.actions = [];
      this.rewards = [];
      this.logProbs = [];
    }

    /**
     * Get statistics
     */
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        episodeCount: this.episodeCount,
        totalReward: this.totalReward,
        avgReward: this.avgReward,
        baseline: this.baseline,
        policySize: this.policyParams.size,
        episodeLength: this.rewards.length
      };
    }

    /**
     * Export policy parameters
     */
  }, {
    key: "exportPolicy",
    value: function exportPolicy() {
      var policy = {};
      var _iterator50 = _createForOfIteratorHelper(this.policyParams),
        _step50;
      try {
        for (_iterator50.s(); !(_step50 = _iterator50.n()).done;) {
          var _step50$value = _slicedToArray(_step50.value, 2),
            state = _step50$value[0],
            params = _step50$value[1];
          policy[state] = params;
        }
      } catch (err) {
        _iterator50.e(err);
      } finally {
        _iterator50.f();
      }
      return {
        policy: policy,
        baseline: this.baseline,
        stats: this.getStats()
      };
    }

    /**
     * Import policy parameters
     */
  }, {
    key: "importPolicy",
    value: function importPolicy(data) {
      this.policyParams.clear();
      for (var _i36 = 0, _Object$entries6 = Object.entries(data.policy); _i36 < _Object$entries6.length; _i36++) {
        var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i36], 2),
          state = _Object$entries6$_i[0],
          params = _Object$entries6$_i[1];
        this.policyParams.set(state, params);
      }
      if (data.baseline !== undefined) {
        this.baseline = data.baseline;
      }
    }

    /**
     * Enable/disable learning
     */
  }, {
    key: "setLearning",
    value: function setLearning(enabled) {
      this.learningEnabled = enabled;
    }
  }]);
  return PolicyGradientIndividual;
}(Individual);
/**
 * Performance Profiler - Built-in profiling for Brain performance
 *
 * Makes it EASY to understand where time is spent and optimize your networks!
 *
 * Usage:
 * ```javascript
 * const brain = new Brain({ genome, sensors, actions })
 * const profiler = new PerformanceProfiler(brain)
 *
 * // Run your simulation
 * for (let i = 0; i < 1000; i++) {
 *   brain.tick()
 * }
 *
 * // Get beautiful report
 * console.log(profiler.getReport())
 * ```
 */
var PerformanceProfiler = /*#__PURE__*/function () {
  function PerformanceProfiler(brain) {
    _classCallCheck(this, PerformanceProfiler);
    this.brain = brain;
    this.stats = {
      ticks: 0,
      totalTime: 0,
      setupTime: 0,
      sensorTime: 0,
      neuronTime: 0,
      actionTime: 0,
      jitTime: 0,
      layeredTime: 0,
      directTime: 0
    };
    this.timestamps = [];
    this.enabled = false;
  }

  /**
   * Start profiling
   */
  _createClass(PerformanceProfiler, [{
    key: "start",
    value: function start() {
      var _this24 = this;
      this.enabled = true;
      this.stats = {
        ticks: 0,
        totalTime: 0,
        setupTime: 0,
        sensorTime: 0,
        neuronTime: 0,
        actionTime: 0,
        jitTime: 0,
        layeredTime: 0,
        directTime: 0
      };
      this.timestamps = [];

      // Wrap brain.tick() to measure time
      var originalTick = this.brain.tick.bind(this.brain);
      this.brain.tick = function () {
        var start = performance.now();
        var result = originalTick();
        var time = performance.now() - start;
        _this24.stats.ticks++;
        _this24.stats.totalTime += time;
        _this24.timestamps.push(time);

        // Track which mode was used
        if (_this24.brain.useJIT) {
          _this24.stats.jitTime += time;
        } else if (_this24.brain.useLayeredProcessing) {
          _this24.stats.layeredTime += time;
        } else {
          _this24.stats.directTime += time;
        }
        return result;
      };
    }

    /**
     * Stop profiling
     */
  }, {
    key: "stop",
    value: function stop() {
      this.enabled = false;
    }

    /**
     * Get statistics
     */
  }, {
    key: "getStats",
    value: function getStats() {
      var avgTime = this.stats.ticks > 0 ? this.stats.totalTime / this.stats.ticks : 0;

      // Calculate percentiles
      var sorted = _toConsumableArray(this.timestamps).sort(function (a, b) {
        return a - b;
      });
      var p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
      var p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
      var p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
      return {
        ticks: this.stats.ticks,
        totalTime: this.stats.totalTime.toFixed(2) + 'ms',
        avgTime: avgTime.toFixed(4) + 'ms',
        ticksPerSecond: this.stats.ticks > 0 ? Math.floor(1000 / avgTime) : 0,
        percentiles: {
          p50: p50.toFixed(4) + 'ms',
          p95: p95.toFixed(4) + 'ms',
          p99: p99.toFixed(4) + 'ms'
        },
        modes: {
          jit: (this.stats.jitTime / this.stats.totalTime * 100).toFixed(1) + '%',
          layered: (this.stats.layeredTime / this.stats.totalTime * 100).toFixed(1) + '%',
          direct: (this.stats.directTime / this.stats.totalTime * 100).toFixed(1) + '%'
        }
      };
    }

    /**
     * Get a beautiful formatted report
     */
  }, {
    key: "getReport",
    value: function getReport() {
      var stats = this.getStats();
      var brain = this.brain;
      var lines = [];
      lines.push('═══════════════════════════════════════════');
      lines.push('  🔬 Brain Performance Profile');
      lines.push('═══════════════════════════════════════════');
      lines.push('');
      lines.push('📊 Network Info:');
      lines.push("  Vertices:    ".concat(Object.keys(brain.definitions.all).length));
      lines.push("  Sensors:     ".concat(Object.keys(brain.definitions.sensors).length));
      lines.push("  Neurons:     ".concat(Object.keys(brain.definitions.neurons).length));
      lines.push("  Actions:     ".concat(Object.keys(brain.definitions.actions).length));
      lines.push("  Connections: ".concat(Object.values(brain.definitions.all).reduce(function (sum, v) {
        return sum + v["in"].length;
      }, 0)));
      lines.push('');
      lines.push('⚡ Optimization Mode:');
      if (brain.useJIT) {
        lines.push("  \uD83D\uDE80 JIT (Just-In-Time compilation) - FASTEST!");
      } else if (brain.useLayeredProcessing) {
        lines.push("  \uD83D\uDCE6 Layered (Batch processing)");
      } else {
        lines.push("  \uD83D\uDCCD Direct (Simple processing)");
      }
      lines.push('');
      lines.push('⏱️  Performance Stats:');
      lines.push("  Total ticks:     ".concat(stats.ticks.toLocaleString()));
      lines.push("  Total time:      ".concat(stats.totalTime));
      lines.push("  Avg per tick:    ".concat(stats.avgTime));
      lines.push("  Ticks/second:    ".concat(stats.ticksPerSecond.toLocaleString()));
      lines.push('');
      lines.push('📈 Percentiles:');
      lines.push("  50th (median):   ".concat(stats.percentiles.p50));
      lines.push("  95th:            ".concat(stats.percentiles.p95));
      lines.push("  99th:            ".concat(stats.percentiles.p99));
      lines.push('');
      lines.push('🎯 Mode Usage:');
      lines.push("  JIT:             ".concat(stats.modes.jit));
      lines.push("  Layered:         ".concat(stats.modes.layered));
      lines.push("  Direct:          ".concat(stats.modes.direct));
      lines.push('');
      lines.push('💡 Recommendations:');
      var connections = Object.values(brain.definitions.all).reduce(function (sum, v) {
        return sum + v["in"].length;
      }, 0);
      if (!brain.useJIT && connections >= 5 && connections <= 200) {
        lines.push("  \u26A0\uFE0F  Network size (".concat(connections, " conn) is suitable for JIT!"));
        lines.push("  \uD83D\uDCA1 Remove advanced features to enable JIT for max speed");
      } else if (brain.useJIT) {
        lines.push("  \u2705 JIT is active - you're getting maximum performance!");
      } else if (connections < 5) {
        lines.push("  \u2139\uFE0F  Network is very small (".concat(connections, " conn)"));
        lines.push("  \uD83D\uDCA1 Direct mode is optimal for tiny networks");
      } else if (connections > 200) {
        lines.push("  \u2139\uFE0F  Network is large (".concat(connections, " conn)"));
        lines.push("  \uD83D\uDCA1 Layered mode is optimal for large networks");
      }
      lines.push('');
      lines.push('═══════════════════════════════════════════');
      return lines.join('\n');
    }
  }]);
  return PerformanceProfiler;
}();
/**
 * Brain Visualizer - ASCII art visualization of neural networks
 *
 * Makes it SUPER EASY to understand your network's structure!
 *
 * Usage:
 * ```javascript
 * const brain = new Brain({ genome, sensors, actions })
 * const visualizer = new BrainVisualizer(brain)
 *
 * console.log(visualizer.draw())
 * console.log(visualizer.drawTopology())
 * console.log(visualizer.drawActivations())
 * ```
 */
var BrainVisualizer = /*#__PURE__*/function () {
  function BrainVisualizer(brain) {
    _classCallCheck(this, BrainVisualizer);
    this.brain = brain;
  }

  /**
   * Draw a complete ASCII visualization of the brain
   */
  _createClass(BrainVisualizer, [{
    key: "draw",
    value: function draw() {
      var lines = [];
      lines.push('╔═══════════════════════════════════════════╗');
      lines.push('║         🧠 Brain Visualization            ║');
      lines.push('╚═══════════════════════════════════════════╝');
      lines.push('');

      // Network structure
      lines.push(this.drawTopology());
      lines.push('');

      // Connection details
      lines.push(this.drawConnections());
      lines.push('');
      return lines.join('\n');
    }

    /**
     * Draw network topology (layers)
     */
  }, {
    key: "drawTopology",
    value: function drawTopology() {
      var _this$brain$definitio = this.brain.definitions,
        sensors = _this$brain$definitio.sensors,
        neurons = _this$brain$definitio.neurons,
        actions = _this$brain$definitio.actions;
      var lines = [];
      lines.push('📐 Network Topology:');
      lines.push('');
      var sensorCount = Object.keys(sensors).length;
      var neuronCount = Object.keys(neurons).length;
      var actionCount = Object.keys(actions).length;

      // Draw layers
      var maxWidth = Math.max(sensorCount, neuronCount, actionCount);

      // Sensors layer
      lines.push("  Sensors (".concat(sensorCount, "):"));
      lines.push("    ".concat(this._drawNodes(sensorCount, '🔵', maxWidth)));
      lines.push("    ".concat(this._drawConnectionLines(maxWidth)));

      // Neurons layer (if any)
      if (neuronCount > 0) {
        lines.push("  Neurons (".concat(neuronCount, "):"));
        lines.push("    ".concat(this._drawNodes(neuronCount, '⚫', maxWidth)));
        lines.push("    ".concat(this._drawConnectionLines(maxWidth)));
      }

      // Actions layer
      lines.push("  Actions (".concat(actionCount, "):"));
      lines.push("    ".concat(this._drawNodes(actionCount, '🔴', maxWidth)));
      lines.push('');
      lines.push("  Total connections: ".concat(this._countConnections()));
      return lines.join('\n');
    }

    /**
     * Draw connection details
     */
  }, {
    key: "drawConnections",
    value: function drawConnections() {
      var lines = [];
      lines.push('🔗 Strong Connections (weight > 1.0):');
      lines.push('');
      var strongConnections = [];
      for (var _i37 = 0, _Object$entries7 = Object.entries(this.brain.definitions.all); _i37 < _Object$entries7.length; _i37++) {
        var _Object$entries7$_i = _slicedToArray(_Object$entries7[_i37], 2),
          name = _Object$entries7$_i[0],
          vertex = _Object$entries7$_i[1];
        var _iterator51 = _createForOfIteratorHelper(vertex["in"]),
          _step51;
        try {
          for (_iterator51.s(); !(_step51 = _iterator51.n()).done;) {
            var conn = _step51.value;
            if (Math.abs(conn.weight) > 1.0) {
              strongConnections.push({
                from: conn.vertex.name,
                to: name,
                weight: conn.weight
              });
            }
          }
        } catch (err) {
          _iterator51.e(err);
        } finally {
          _iterator51.f();
        }
      }
      if (strongConnections.length === 0) {
        lines.push('  (No strong connections found)');
      } else {
        // Sort by weight
        strongConnections.sort(function (a, b) {
          return Math.abs(b.weight) - Math.abs(a.weight);
        });
        var _iterator52 = _createForOfIteratorHelper(strongConnections.slice(0, 10)),
          _step52;
        try {
          for (_iterator52.s(); !(_step52 = _iterator52.n()).done;) {
            var _conn = _step52.value;
            // Top 10
            var arrow = _conn.weight > 0 ? '→' : '⤍';
            var weight = _conn.weight.toFixed(2).padStart(5);
            lines.push("  ".concat(_conn.from, " ").concat(arrow, " ").concat(_conn.to, "  [").concat(weight, "]"));
          }
        } catch (err) {
          _iterator52.e(err);
        } finally {
          _iterator52.f();
        }
        if (strongConnections.length > 10) {
          lines.push("  ... and ".concat(strongConnections.length - 10, " more"));
        }
      }
      return lines.join('\n');
    }

    /**
     * Draw current activation values (requires tick first)
     */
  }, {
    key: "drawActivations",
    value: function drawActivations() {
      var lines = [];
      lines.push('⚡ Current Activations:');
      lines.push('');
      var _this$brain$definitio2 = this.brain.definitions,
        sensors = _this$brain$definitio2.sensors,
        neurons = _this$brain$definitio2.neurons,
        actions = _this$brain$definitio2.actions;

      // Sensors
      lines.push('  Sensors:');
      for (var _i38 = 0, _Object$entries8 = Object.entries(sensors); _i38 < _Object$entries8.length; _i38++) {
        var _Object$entries8$_i = _slicedToArray(_Object$entries8[_i38], 2),
          id = _Object$entries8$_i[0],
          vertex = _Object$entries8$_i[1];
        var rawValue = vertex.cache.value || 0;
        var value = typeof rawValue === 'number' ? rawValue : 0;
        var bar = this._drawBar(value);
        lines.push("    ".concat(vertex.name.padEnd(8), " ").concat(bar, " ").concat(value.toFixed(3)));
      }

      // Neurons
      if (Object.keys(neurons).length > 0) {
        lines.push('');
        lines.push('  Neurons:');
        for (var _i39 = 0, _Object$entries9 = Object.entries(neurons); _i39 < _Object$entries9.length; _i39++) {
          var _Object$entries9$_i = _slicedToArray(_Object$entries9[_i39], 2),
            _id = _Object$entries9$_i[0],
            _vertex4 = _Object$entries9$_i[1];
          var _rawValue = _vertex4.cache.value || 0;
          var _value = typeof _rawValue === 'number' ? _rawValue : 0;
          var _bar = this._drawBar(_value);
          lines.push("    ".concat(_vertex4.name.padEnd(8), " ").concat(_bar, " ").concat(_value.toFixed(3)));
        }
      }

      // Actions
      lines.push('');
      lines.push('  Actions:');
      for (var _i40 = 0, _Object$entries10 = Object.entries(actions); _i40 < _Object$entries10.length; _i40++) {
        var _Object$entries10$_i = _slicedToArray(_Object$entries10[_i40], 2),
          _id2 = _Object$entries10$_i[0],
          _vertex5 = _Object$entries10$_i[1];
        var _rawValue2 = _vertex5.cache.value || 0;
        var _value2 = typeof _rawValue2 === 'number' ? _rawValue2 : 0;
        var _bar2 = this._drawBar(_value2);
        lines.push("    ".concat(_vertex5.name.padEnd(8), " ").concat(_bar2, " ").concat(_value2.toFixed(3)));
      }
      return lines.join('\n');
    }

    /**
     * Helper: Draw nodes as ASCII art
     */
  }, {
    key: "_drawNodes",
    value: function _drawNodes(count, symbol, maxWidth) {
      if (count === 0) return '(none)';
      var spacing = maxWidth > 10 ? 1 : 2;
      var nodes = Array(Math.min(count, 20)).fill(symbol);
      if (count > 20) {
        nodes.push('...');
      }
      return nodes.join(' '.repeat(spacing));
    }

    /**
     * Helper: Draw connection lines
     */
  }, {
    key: "_drawConnectionLines",
    value: function _drawConnectionLines(width) {
      return '    ' + '|'.padStart(width * 2, ' ');
    }

    /**
     * Helper: Draw a value as a bar chart
     */
  }, {
    key: "_drawBar",
    value: function _drawBar(value) {
      var maxWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
      var normalized = Math.max(-1, Math.min(1, value));
      var filled = Math.floor(Math.abs(normalized) * maxWidth);
      var empty = maxWidth - filled;
      var bar = normalized >= 0 ? '░'.repeat(empty) + '█'.repeat(filled) : '█'.repeat(filled) + '░'.repeat(empty);
      return "[".concat(bar, "]");
    }

    /**
     * Helper: Count total connections
     */
  }, {
    key: "_countConnections",
    value: function _countConnections() {
      return Object.values(this.brain.definitions.all).reduce(function (sum, v) {
        return sum + v["in"].length;
      }, 0);
    }

    /**
     * Export network as JSON for external visualization
     */
  }, {
    key: "toJSON",
    value: function toJSON() {
      var nodes = [];
      var edges = [];
      for (var _i41 = 0, _Object$entries11 = Object.entries(this.brain.definitions.all); _i41 < _Object$entries11.length; _i41++) {
        var _Object$entries11$_i = _slicedToArray(_Object$entries11[_i41], 2),
          name = _Object$entries11$_i[0],
          vertex = _Object$entries11$_i[1];
        nodes.push({
          id: name,
          type: vertex.metadata.type,
          bias: vertex.metadata.bias || 0
        });
        var _iterator53 = _createForOfIteratorHelper(vertex["in"]),
          _step53;
        try {
          for (_iterator53.s(); !(_step53 = _iterator53.n()).done;) {
            var conn = _step53.value;
            edges.push({
              from: conn.vertex.name,
              to: name,
              weight: conn.weight
            });
          }
        } catch (err) {
          _iterator53.e(err);
        } finally {
          _iterator53.f();
        }
      }
      return {
        nodes: nodes,
        edges: edges,
        stats: {
          sensors: Object.keys(this.brain.definitions.sensors).length,
          neurons: Object.keys(this.brain.definitions.neurons).length,
          actions: Object.keys(this.brain.definitions.actions).length,
          connections: this._countConnections()
        }
      };
    }
  }]);
  return BrainVisualizer;
}();
var empty = {};
var empty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  "default": empty
});
export { ActivationLUT, AttributeBase, Base, BitBuffer, Brain, BrainVisualizer, EvolvedNeuronBase, EvolvedNeuronModes, EvolvedNeuronBase as EvolvedSensorBase, ExperienceBuffer, Generation, Genome, HillClimbing, HybridGAHC, HybridNoveltyFitness, Individual, JITTickGenerator, LearningRuleBase, MemoryCellBase, ModuleBase, MultiObjective, NoveltySearch, PerformanceProfiler, PlasticityBase, PolicyGradientIndividual, QLearningIndividual, Reproduction, ReproductionGenomeHandler, SparseConnectionMatrix, Speciation, Species, TypedArrayPool, ValidationError, Vertex, VertexPool, callCallback, createHelpfulError, createProgressTracker, executeAsync, formatDuration, formatProgressBar, globalActivationLUT, globalArrayPool, globalVertexPool, isPlainObject, isPromise, md5, parseArgs, parseConstructorArgs, parseMethodArgs, runWithProgress, toPromise, validateArray, validateClass, validateFunction, validateObject, validatePositiveInteger, validateRange, validateRatio };
