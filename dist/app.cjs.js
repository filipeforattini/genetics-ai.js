'use strict';

const shuffle = (arr = []) => arr.sort(() => Math.random() - 0.5);

const intersection = (arrA = [], arrB = []) => arrA.filter(x => arrB.includes(x));

const removeArray = (arrA = [], arrB = []) => arrA.filter(x => !arrB.includes(x));

const chunkArray = (arr = [], perChunk = 1) => arr.reduce((all, one, i) => {
  const ch = Math.floor(i / perChunk);
  all[ch] = [].concat((all[ch] || []), one);
  return all
}, []);

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const toBin = x => parseInt(x).toString(2);
const fromBin = bin => parseInt(bin, 2);
const fromBinToBase32 = bin => parseInt(bin, 2).toString(32);

const toBase32 = x => parseInt(x).toString(32);
const fromBase32 = b32 => parseInt(b32, 32);
const fromBase32ToBin = b32 => parseInt(b32, 32).toString(2);

const chars = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
].join('');

const vowels = ['a', 'e', 'i', 'o', 'u'].join('');

const consonants = removeArray(chars.split(''), vowels.split('')).join('');

const alphanum = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ...chars.split(''),
].join('');

const shuffleStr = (unshuffled) => unshuffled
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

const randomChar = (size = 1) => {
  const str = new Array(size).fill(0).map(() => chars[randomInt(0, chars.length)]);
  return shuffleStr(str).join('')
};

const randomAlpha = (size = 1, base = alphanum.length) => {
  const str = new Array(size).fill(0).map(() => alphanum[randomInt(0, base)]);
  return shuffleStr(str).join('')
};

const chunk = (str, length) => {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
};

class MatingStrategy {
  constructor(generation) {
    this.generation = generation;
  }

  run () {
    console.log('implement me!');
  }
}

class Base {
  constructor({ from, to, weight }) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }

  static random({from, to, weight} = {}) {
    const base = this.fromBase32(randomAlpha(6, 31));
    
    if (from) base.from = from;
    if (to) base.to = to;
    if (weight) base.weight = weight;

    return base
  }

  static fromBase32(chain) {
    let data = chain.padStart(6, '0');

    let [from, to, weight] = chunk(data, 2)
      .map(fromBase32ToBin)
      .map(x => x.padStart(10, '0').split(''));

    let [fromType, ...fromId] = from;
    let [toType, ...toId] = to;
    let [signWeight, ...weightValue] = weight;

    fromId = fromBinToBase32(fromId.join('')).padStart(2, '0');
    toId = fromBinToBase32(toId.join('')).padStart(2, '0');
    const finalWeight = fromBin(weightValue.join('')) * (signWeight === '0' ? 1 : -1);

    const newBase = {
      from: `${fromType === '0' ? 's' : 'n'}#${fromId}`,
      to: `${toType === '0' ? 'n' : 'a'}#${toId}`,
      weight: finalWeight / 10,
    };

    return new this(newBase)
  }

  static fromBin(data) {
    const dataConvertedTo32 = chunk(data, 10).map(d => fromBinToBase32(d).padStart(2, '0')).join('');
    return this.fromBase32(dataConvertedTo32)
  }

  toBase32() {
    const [fromType, fromId] = this.from.split('#');
    const [toType, toId] = this.to.split('#');

    let finalFrom = [fromType === 's' ? '0' : '1', fromBase32ToBin(fromId).padStart(9, '0')].join('');
    finalFrom = fromBinToBase32(finalFrom).padStart(2, '0');

    let finalTo = [toType === 'n' ? '0' : '1', fromBase32ToBin(toId).padStart(9, '0')].join('');
    finalTo = fromBinToBase32(finalTo).padStart(2, '0');

    let weightStr = [this.weight >= 0 ? '0' : '1', toBin(Math.abs(this.weight * 10)).padStart(9, '0')].join('');
    weightStr = fromBinToBase32(weightStr).padStart(2, '0');

    return `${finalFrom}${finalTo}${weightStr}`
  }

  toBin() {
    return chunk(this.toBase32(), 2)
      .map(b32 => fromBase32ToBin(b32))
      .map(bin => bin.padStart(10, '0'))
      .join('')
  }

  toString() {
    return this.toBase32()
  }
}

class Genome {
  constructor({ bases = [], base32 = [], baseBin = [] } = {}) {
    this.bases = []
      .concat(baseBin.map(b => Base.fromBin(b)))
      .concat(base32.map(b => Base.fromBase32(b)))
      .concat(bases);

    this.nodes = this.getNodes();
    this.length = this.bases.length;
  }

  static copy(genome) {
    const bases = genome.bases.map(b => new Base({ ...b }));
    return new this({ bases })
  }

  static random(size = 1) {
    const bases = new Array(size).fill(0).map(() => Base.random());
    return new this({ bases })
  }

  static mutateMicro(genome, { count = 1 } = {}) {
    let newGen = [...genome.toArray()];
    const size = newGen.length;

    while (count-- > 0) {
      const i = randomInt(0, size - 1);
      let part = newGen[i].split('');
      part[randomInt(0, part.length - 1)] = randomAlpha(1, 31);
      newGen[i] = part.join('');
    }

    return new Genome({ base32: newGen })
  }

  static mutateBase(genome, { count = 1, brainConfig }) {
    let newGen = shuffle([...genome.toArray()]);

    while (count-- > 0) {
      newGen.pop();
      const newBase = Genome.randomWithinIds({ ...brainConfig, asArray: true });
      newGen = newGen.concat(newBase);
    }

    return new Genome({ base32: newGen })
  }

  static randomWithinIds({
    ids = [],
    size = 1,
    neuronsCount = 0,
    asArray = false,
  }) {
    let myids = [...ids].concat(new Array(neuronsCount).fill(0).map((v, i) => `n#${toBase32(i)}`));

    const idsFrom = shuffle(myids.filter(x => x.startsWith('s#') || x.startsWith('n#')));
    const idsTo = shuffle(myids.filter(x => x.startsWith('n#') || x.startsWith('a#')));

    const base32 = new Array(size).fill(0)
      .map(() => ([idsFrom[randomInt(0, idsFrom.length - 1)], idsTo[randomInt(0, idsTo.length - 1)]]))
      .map(([from, to]) => {
        const [fromType, fromId] = from.split('#');
        const [toType, toId] = to.split('#');

        let finalFrom = [fromType === 's' ? '0' : '1', fromBase32ToBin(fromId).padStart(9, '0')].join('');
        finalFrom = fromBinToBase32(finalFrom).padStart(2, '0');

        let finalTo = [toType === 'n' ? '0' : '1', fromBase32ToBin(toId).padStart(9, '0')].join('');
        finalTo = fromBinToBase32(finalTo).padStart(2, '0');

        let weight = randomInt(-40, 40);
        let weightStr = [weight >= 0 ? '0' : '1', toBin(Math.abs(weight)).padStart(9, '0')].join('');
        weightStr = fromBinToBase32(weightStr).padStart(2, '0');

        return `${finalFrom}${finalTo}${weightStr}`
      });

    return asArray ? base32 : new this({ base32 })
  }

  static sexualReproduction(genA, genB) {
    const middle = Math.floor(genA.length / 2);

    const meiosisA = [
      genA.bases.slice(0, middle).map(b => new Base({ ...b })),
      genA.bases.slice(middle, genA.size).map(b => new Base({ ...b })),
    ];

    const meiosisB = [
      genB.bases.slice(0, middle).map(b => new Base({ ...b })),
      genB.bases.slice(middle, genB.size).map(b => new Base({ ...b })),
    ];

    return [
      new Genome({ bases: [].concat(meiosisA[0].concat(meiosisB[0])) }),
      new Genome({ bases: [].concat(meiosisA[1].concat(meiosisB[1])) }),
    ]
  }

  toArray() {
    return this.bases.map(b => b.toString())
  }

  toString() {
    return this.toArray().join(' ')
  }

  getNodes() {
    return [...new Set([]
      .concat(this.bases.map(x => x.from))
      .concat(this.bases.map(x => x.to)))
    ].sort()
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var graphology_umd_minExports = {};
var graphology_umd_min = {
  get exports(){ return graphology_umd_minExports; },
  set exports(v){ graphology_umd_minExports = v; },
};

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,r(t,e);}function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function r(t,e){return r=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},r(t,e)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function o(t,e,n){return o=i()?Reflect.construct.bind():function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&r(o,n.prototype),o},o.apply(null,arguments)}function a(t){var e="function"==typeof Map?new Map:void 0;return a=function(t){if(null===t||(i=t,-1===Function.toString.call(i).indexOf("[native code]")))return t;var i;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,a);}function a(){return o(t,arguments,n(this).constructor)}return a.prototype=Object.create(t.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r(a,t)},a(t)}function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var u=function(){for(var t=arguments[0],e=1,n=arguments.length;e<n;e++)if(arguments[e])for(var r in arguments[e])t[r]=arguments[e][r];return t};function d(t,e,n,r){var i=t._nodes.get(e),o=null;return i?o="mixed"===r?i.out&&i.out[n]||i.undirected&&i.undirected[n]:"directed"===r?i.out&&i.out[n]:i.undirected&&i.undirected[n]:o}function s(e){return "object"===t(e)&&null!==e&&e.constructor===Object}function h(t){var e;for(e in t)return !1;return !0}function p(t,e,n){Object.defineProperty(t,e,{enumerable:!1,configurable:!1,writable:!0,value:n});}function f(t,e,n){var r={enumerable:!0,configurable:!0};"function"==typeof n?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(t,e,r);}function l(t){return !!s(t)&&!(t.attributes&&!Array.isArray(t.attributes))}"function"==typeof Object.assign&&(u=Object.assign);var g,y={exports:{}},w="object"==typeof Reflect?Reflect:null,v=w&&"function"==typeof w.apply?w.apply:function(t,e,n){return Function.prototype.apply.call(t,e,n)};g=w&&"function"==typeof w.ownKeys?w.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var b=Number.isNaN||function(t){return t!=t};function m(){m.init.call(this);}y.exports=m,y.exports.once=function(t,e){return new Promise((function(n,r){function i(n){t.removeListener(e,o),r(n);}function o(){"function"==typeof t.removeListener&&t.removeListener("error",i),n([].slice.call(arguments));}U(t,e,o,{once:!0}),"error"!==e&&function(t,e,n){"function"==typeof t.on&&U(t,"error",e,n);}(t,i,{once:!0});}))},m.EventEmitter=m,m.prototype._events=void 0,m.prototype._eventsCount=0,m.prototype._maxListeners=void 0;var k=10;function _(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function G(t){return void 0===t._maxListeners?m.defaultMaxListeners:t._maxListeners}function x(t,e,n,r){var i,o,a,c;if(_(n),void 0===(o=t._events)?(o=t._events=Object.create(null),t._eventsCount=0):(void 0!==o.newListener&&(t.emit("newListener",e,n.listener?n.listener:n),o=t._events),a=o[e]),void 0===a)a=o[e]=n,++t._eventsCount;else if("function"==typeof a?a=o[e]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(i=G(t))>0&&a.length>i&&!a.warned){a.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");u.name="MaxListenersExceededWarning",u.emitter=t,u.type=e,u.count=a.length,c=u,console&&console.warn&&console.warn(c);}return t}function E(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function A(t,e,n){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:n},i=E.bind(r);return i.listener=n,r.wrapFn=i,i}function L(t,e,n){var r=t._events;if(void 0===r)return [];var i=r[e];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(t){for(var e=new Array(t.length),n=0;n<e.length;++n)e[n]=t[n].listener||t[n];return e}(i):D(i,i.length)}function S(t){var e=this._events;if(void 0!==e){var n=e[t];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function D(t,e){for(var n=new Array(e),r=0;r<e;++r)n[r]=t[r];return n}function U(t,e,n,r){if("function"==typeof t.on)r.once?t.once(e,n):t.on(e,n);else {if("function"!=typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function i(o){r.once&&t.removeEventListener(e,i),n(o);}));}}function N(t){if("function"!=typeof t)throw new Error("obliterator/iterator: expecting a function!");this.next=t;}Object.defineProperty(m,"defaultMaxListeners",{enumerable:!0,get:function(){return k},set:function(t){if("number"!=typeof t||t<0||b(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");k=t;}}),m.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0;},m.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||b(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},m.prototype.getMaxListeners=function(){return G(this)},m.prototype.emit=function(t){for(var e=[],n=1;n<arguments.length;n++)e.push(arguments[n]);var r="error"===t,i=this._events;if(void 0!==i)r=r&&void 0===i.error;else if(!r)return !1;if(r){var o;if(e.length>0&&(o=e[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var c=i[t];if(void 0===c)return !1;if("function"==typeof c)v(c,this,e);else {var u=c.length,d=D(c,u);for(n=0;n<u;++n)v(d[n],this,e);}return !0},m.prototype.addListener=function(t,e){return x(this,t,e,!1)},m.prototype.on=m.prototype.addListener,m.prototype.prependListener=function(t,e){return x(this,t,e,!0)},m.prototype.once=function(t,e){return _(e),this.on(t,A(this,t,e)),this},m.prototype.prependOnceListener=function(t,e){return _(e),this.prependListener(t,A(this,t,e)),this},m.prototype.removeListener=function(t,e){var n,r,i,o,a;if(_(e),void 0===(r=this._events))return this;if(void 0===(n=r[t]))return this;if(n===e||n.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||e));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===e||n[o].listener===e){a=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop();}(n,i),1===n.length&&(r[t]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",t,a||e);}return this},m.prototype.off=m.prototype.removeListener,m.prototype.removeAllListeners=function(t){var e,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[t]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=n[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},m.prototype.listeners=function(t){return L(this,t,!0)},m.prototype.rawListeners=function(t){return L(this,t,!1)},m.listenerCount=function(t,e){return "function"==typeof t.listenerCount?t.listenerCount(e):S.call(t,e)},m.prototype.listenerCount=S,m.prototype.eventNames=function(){return this._eventsCount>0?g(this._events):[]},"undefined"!=typeof Symbol&&(N.prototype[Symbol.iterator]=function(){return this}),N.of=function(){var t=arguments,e=t.length,n=0;return new N((function(){return n>=e?{done:!0}:{done:!1,value:t[n++]}}))},N.empty=function(){return new N((function(){return {done:!0}}))},N.fromSequence=function(t){var e=0,n=t.length;return new N((function(){return e>=n?{done:!0}:{done:!1,value:t[e++]}}))},N.is=function(t){return t instanceof N||"object"==typeof t&&null!==t&&"function"==typeof t.next};var O=N,j={};j.ARRAY_BUFFER_SUPPORT="undefined"!=typeof ArrayBuffer,j.SYMBOL_SUPPORT="undefined"!=typeof Symbol;var C=O,M=j,z=M.ARRAY_BUFFER_SUPPORT,W=M.SYMBOL_SUPPORT;var P=function(t){var e=function(t){return "string"==typeof t||Array.isArray(t)||z&&ArrayBuffer.isView(t)?C.fromSequence(t):"object"!=typeof t||null===t?null:W&&"function"==typeof t[Symbol.iterator]?t[Symbol.iterator]():"function"==typeof t.next?t:null}(t);if(!e)throw new Error("obliterator: target is not iterable nor a valid iterator.");return e},R=P,K=function(t,e){for(var n,r=arguments.length>1?e:1/0,i=r!==1/0?new Array(r):[],o=0,a=R(t);;){if(o===r)return i;if((n=a.next()).done)return o!==e&&(i.length=o),i;i[o++]=n.value;}},T=function(t){function n(e){var n;return (n=t.call(this)||this).name="GraphError",n.message=e,n}return e(n,t),n}(a(Error)),B=function(t){function n(e){var r;return (r=t.call(this,e)||this).name="InvalidArgumentsGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(r),n.prototype.constructor),r}return e(n,t),n}(T),F=function(t){function n(e){var r;return (r=t.call(this,e)||this).name="NotFoundGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(r),n.prototype.constructor),r}return e(n,t),n}(T),I=function(t){function n(e){var r;return (r=t.call(this,e)||this).name="UsageGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(r),n.prototype.constructor),r}return e(n,t),n}(T);function Y(t,e){this.key=t,this.attributes=e,this.clear();}function q(t,e){this.key=t,this.attributes=e,this.clear();}function J(t,e){this.key=t,this.attributes=e,this.clear();}function V(t,e,n,r,i){this.key=e,this.attributes=i,this.undirected=t,this.source=n,this.target=r;}Y.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={};},q.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={};},J.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={};},V.prototype.attach=function(){var t="out",e="in";this.undirected&&(t=e="undirected");var n=this.source.key,r=this.target.key;this.source[t][r]=this,this.undirected&&n===r||(this.target[e][n]=this);},V.prototype.attachMulti=function(){var t="out",e="in",n=this.source.key,r=this.target.key;this.undirected&&(t=e="undirected");var i=this.source[t],o=i[r];if(void 0===o)return i[r]=this,void(this.undirected&&n===r||(this.target[e][n]=this));o.previous=this,this.next=o,i[r]=this,this.target[e][n]=this;},V.prototype.detach=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),delete this.source[n][e],delete this.target[r][t];},V.prototype.detachMulti=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),void 0===this.previous?void 0===this.next?(delete this.source[n][e],delete this.target[r][t]):(this.next.previous=void 0,this.source[n][e]=this.next,this.target[r][t]=this.next):(this.previous.next=this.next,void 0!==this.next&&(this.next.previous=this.previous));};function H(t,e,n,r,i,o,a){var c,u,d,s;if(r=""+r,0===n){if(!(c=t._nodes.get(r)))throw new F("Graph.".concat(e,': could not find the "').concat(r,'" node in the graph.'));d=i,s=o;}else if(3===n){if(i=""+i,!(u=t._edges.get(i)))throw new F("Graph.".concat(e,': could not find the "').concat(i,'" edge in the graph.'));var h=u.source.key,p=u.target.key;if(r===h)c=u.target;else {if(r!==p)throw new F("Graph.".concat(e,': the "').concat(r,'" node is not attached to the "').concat(i,'" edge (').concat(h,", ").concat(p,")."));c=u.source;}d=o,s=a;}else {if(!(u=t._edges.get(r)))throw new F("Graph.".concat(e,': could not find the "').concat(r,'" edge in the graph.'));c=1===n?u.source:u.target,d=i,s=o;}return [c,d,s]}var Q=[{name:function(t){return "get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];return a.attributes[c]};}},{name:function(t){return "get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){return H(this,e,n,t,r)[0].attributes};}},{name:function(t){return "has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];return a.attributes.hasOwnProperty(c)};}},{name:function(t){return "set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=H(this,e,n,t,r,i,o),c=a[0],u=a[1],d=a[2];return c.attributes[u]=d,this.emit("nodeAttributesUpdated",{key:c.key,type:"set",attributes:c.attributes,name:u}),this};}},{name:function(t){return "update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=H(this,e,n,t,r,i,o),c=a[0],u=a[1],d=a[2];if("function"!=typeof d)throw new B("Graph.".concat(e,": updater should be a function."));var s=c.attributes,h=d(s[u]);return s[u]=h,this.emit("nodeAttributesUpdated",{key:c.key,type:"set",attributes:c.attributes,name:u}),this};}},{name:function(t){return "remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];return delete a.attributes[c],this.emit("nodeAttributesUpdated",{key:a.key,type:"remove",attributes:a.attributes,name:c}),this};}},{name:function(t){return "replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];if(!s(c))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return a.attributes=c,this.emit("nodeAttributesUpdated",{key:a.key,type:"replace",attributes:a.attributes}),this};}},{name:function(t){return "merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];if(!s(c))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return u(a.attributes,c),this.emit("nodeAttributesUpdated",{key:a.key,type:"merge",attributes:a.attributes,data:c}),this};}},{name:function(t){return "update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];if("function"!=typeof c)throw new B("Graph.".concat(e,": provided updater is not a function."));return a.attributes=c(a.attributes),this.emit("nodeAttributesUpdated",{key:a.key,type:"update",attributes:a.attributes}),this};}}];var X=[{name:function(t){return "get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes[r]};}},{name:function(t){return "get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t){var r;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>1){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var i=""+t,o=""+arguments[1];if(!(r=d(this,i,o,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(i,'" - "').concat(o,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(r=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return r.attributes};}},{name:function(t){return "has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes.hasOwnProperty(r)};}},{name:function(t){return "set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,c=""+r;if(r=arguments[2],i=arguments[3],!(o=d(this,a,c,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this};}},{name:function(t){return "update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,c=""+r;if(r=arguments[2],i=arguments[3],!(o=d(this,a,c,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof i)throw new B("Graph.".concat(e,": updater should be a function."));return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this};}},{name:function(t){return "remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this};}},{name:function(t){return "replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!s(r))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this};}},{name:function(t){return "merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!s(r))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return u(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this};}},{name:function(t){return "update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else {if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof r)throw new B("Graph.".concat(e,": provided updater is not a function."));return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this};}}];var Z=O,$=P,tt=function(){var t=arguments,e=null,n=-1;return new Z((function(){for(var r=null;;){if(null===e){if(++n>=t.length)return {done:!0};e=$(t[n]);}if(!0!==(r=e.next()).done)break;e=null;}return r}))},et=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function nt(t,e,n,r){var i=!1;for(var o in e)if(o!==r){var a=e[o];if(i=n(a.key,a.attributes,a.source.key,a.target.key,a.source.attributes,a.target.attributes,a.undirected),t&&i)return a.key}}function rt(t,e,n,r){var i,o,a,c=!1;for(var u in e)if(u!==r){i=e[u];do{if(o=i.source,a=i.target,c=n(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected),t&&c)return i.key;i=i.next;}while(void 0!==i)}}function it(t,e){var n,r=Object.keys(t),i=r.length,o=0;return new O((function(){do{if(n)n=n.next;else {if(o>=i)return {done:!0};var a=r[o++];if(a===e){n=void 0;continue}n=t[a];}}while(!n);return {done:!1,value:{edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected}}}))}function ot(t,e,n,r){var i=e[n];if(i){var o=i.source,a=i.target;return r(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected)&&t?i.key:void 0}}function at(t,e,n,r){var i=e[n];if(i){var o=!1;do{if(o=r(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected),t&&o)return i.key;i=i.next;}while(void 0!==i)}}function ct(t,e){var n=t[e];return void 0!==n.next?new O((function(){if(!n)return {done:!0};var t={edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected};return n=n.next,{done:!1,value:t}})):O.of({edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected})}function ut(t,e){if(0===t.size)return [];if("mixed"===e||e===t.type)return "function"==typeof Array.from?Array.from(t._edges.keys()):K(t._edges.keys(),t._edges.size);for(var n,r,i="undirected"===e?t.undirectedSize:t.directedSize,o=new Array(i),a="undirected"===e,c=t._edges.values(),u=0;!0!==(n=c.next()).done;)(r=n.value).undirected===a&&(o[u++]=r.key);return o}function dt(t,e,n,r){if(0!==e.size)for(var i,o,a="mixed"!==n&&n!==e.type,c="undirected"===n,u=!1,d=e._edges.values();!0!==(i=d.next()).done;)if(o=i.value,!a||o.undirected===c){var s=o,h=s.key,p=s.attributes,f=s.source,l=s.target;if(u=r(h,p,f.key,l.key,f.attributes,l.attributes,o.undirected),t&&u)return h}}function st(t,e){if(0===t.size)return O.empty();var n="mixed"!==e&&e!==t.type,r="undirected"===e,i=t._edges.values();return new O((function(){for(var t,e;;){if((t=i.next()).done)return t;if(e=t.value,!n||e.undirected===r)break}return {value:{edge:e.key,attributes:e.attributes,source:e.source.key,target:e.target.key,sourceAttributes:e.source.attributes,targetAttributes:e.target.attributes,undirected:e.undirected},done:!1}}))}function ht(t,e,n,r,i,o){var a,c=e?rt:nt;if("undirected"!==n){if("out"!==r&&(a=c(t,i.in,o),t&&a))return a;if("in"!==r&&(a=c(t,i.out,o,r?void 0:i.key),t&&a))return a}if("directed"!==n&&(a=c(t,i.undirected,o),t&&a))return a}function pt(t,e,n,r){var i=[];return ht(!1,t,e,n,r,(function(t){i.push(t);})),i}function ft(t,e,n){var r=O.empty();return "undirected"!==t&&("out"!==e&&void 0!==n.in&&(r=tt(r,it(n.in))),"in"!==e&&void 0!==n.out&&(r=tt(r,it(n.out,e?void 0:n.key)))),"directed"!==t&&void 0!==n.undirected&&(r=tt(r,it(n.undirected))),r}function lt(t,e,n,r,i,o,a){var c,u=n?at:ot;if("undirected"!==e){if(void 0!==i.in&&"out"!==r&&(c=u(t,i.in,o,a),t&&c))return c;if(void 0!==i.out&&"in"!==r&&(r||i.key!==o)&&(c=u(t,i.out,o,a),t&&c))return c}if("directed"!==e&&void 0!==i.undirected&&(c=u(t,i.undirected,o,a),t&&c))return c}function gt(t,e,n,r,i){var o=[];return lt(!1,t,e,n,r,i,(function(t){o.push(t);})),o}function yt(t,e,n,r){var i=O.empty();return "undirected"!==t&&(void 0!==n.in&&"out"!==e&&r in n.in&&(i=tt(i,ct(n.in,r))),void 0!==n.out&&"in"!==e&&r in n.out&&(e||n.key!==r)&&(i=tt(i,ct(n.out,r)))),"directed"!==t&&void 0!==n.undirected&&r in n.undirected&&(i=tt(i,ct(n.undirected,r))),i}var wt=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function vt(){this.A=null,this.B=null;}function bt(t,e,n,r,i){for(var o in r){var a=r[o],c=a.source,u=a.target,d=c===n?u:c;if(!e||!e.has(d.key)){var s=i(d.key,d.attributes);if(t&&s)return d.key}}}function mt(t,e,n,r,i){if("mixed"!==e){if("undirected"===e)return bt(t,null,r,r.undirected,i);if("string"==typeof n)return bt(t,null,r,r[n],i)}var o,a=new vt;if("undirected"!==e){if("out"!==n){if(o=bt(t,null,r,r.in,i),t&&o)return o;a.wrap(r.in);}if("in"!==n){if(o=bt(t,a,r,r.out,i),t&&o)return o;a.wrap(r.out);}}if("directed"!==e&&(o=bt(t,a,r,r.undirected,i),t&&o))return o}function kt(t,e,n){var r=Object.keys(n),i=r.length,o=0;return new O((function(){var a=null;do{if(o>=i)return t&&t.wrap(n),{done:!0};var c=n[r[o++]],u=c.source,d=c.target;a=u===e?d:u,t&&t.has(a.key)&&(a=null);}while(null===a);return {done:!1,value:{neighbor:a.key,attributes:a.attributes}}}))}function _t(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return [];t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new F("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return Object.keys(n.undirected);if("string"==typeof e)return Object.keys(n[e])}var r=[];return mt(!1,t,e,n,(function(t){r.push(t);})),r}("mixed"===r?this.type:r,i,e)};}function Gt(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return kt(null,n,n.undirected);if("string"==typeof e)return kt(null,n,n[e])}var r=O.empty(),i=new vt;return "undirected"!==t&&("out"!==e&&(r=tt(r,kt(i,n,n.in))),"in"!==e&&(r=tt(r,kt(i,n,n.out)))),"directed"!==t&&(r=tt(r,kt(i,n,n.undirected))),r}("mixed"===r?this.type:r,i,e)};}function xt(t,e,n,r,i){for(var o,a,c,u,d,s,h,p=r._nodes.values(),f=r.type;!0!==(o=p.next()).done;){var l=!1;if(a=o.value,"undirected"!==f)for(c in u=a.out){d=u[c];do{if(s=d.target,l=!0,h=i(a.key,s.key,a.attributes,s.attributes,d.key,d.attributes,d.undirected),t&&h)return d;d=d.next;}while(d)}if("directed"!==f)for(c in u=a.undirected)if(!(e&&a.key>c)){d=u[c];do{if((s=d.target).key!==c&&(s=d.source),l=!0,h=i(a.key,s.key,a.attributes,s.attributes,d.key,d.attributes,d.undirected),t&&h)return d;d=d.next;}while(d)}if(n&&!l&&(h=i(a.key,null,a.attributes,null,null,null,null),t&&h))return null}}function Et(t){if(!s(t))throw new B('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in t))throw new B("Graph.import: serialized node is missing its key.");if("attributes"in t&&(!s(t.attributes)||null===t.attributes))throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function At(t){if(!s(t))throw new B('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in t))throw new B("Graph.import: serialized edge is missing its source.");if(!("target"in t))throw new B("Graph.import: serialized edge is missing its target.");if("attributes"in t&&(!s(t.attributes)||null===t.attributes))throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in t&&"boolean"!=typeof t.undirected)throw new B("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}vt.prototype.wrap=function(t){null===this.A?this.A=t:null===this.B&&(this.B=t);},vt.prototype.has=function(t){return null!==this.A&&t in this.A||null!==this.B&&t in this.B};var Lt,St=(Lt=255&Math.floor(256*Math.random()),function(){return Lt++}),Dt=new Set(["directed","undirected","mixed"]),Ut=new Set(["domain","_events","_eventsCount","_maxListeners"]),Nt={allowSelfLoops:!0,multi:!1,type:"mixed"};function Ot(t,e,n){var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}function jt(t,e,n,r,i,o,a,c){if(!r&&"undirected"===t.type)throw new I("Graph.".concat(e,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new I("Graph.".concat(e,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(c&&!s(c))throw new B("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(c,'"'));if(o=""+o,a=""+a,c=c||{},!t.allowSelfLoops&&o===a)throw new I("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var u=t._nodes.get(o),d=t._nodes.get(a);if(!u)throw new F("Graph.".concat(e,': source node "').concat(o,'" not found.'));if(!d)throw new F("Graph.".concat(e,': target node "').concat(a,'" not found.'));var h={key:null,undirected:r,source:o,target:a,attributes:c};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new I("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));if(!t.multi&&(r?void 0!==u.undirected[a]:void 0!==u.out[a]))throw new I("Graph.".concat(e,': an edge linking "').concat(o,'" to "').concat(a,"\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));var p=new V(r,i,u,d,c);t._edges.set(i,p);var f=o===a;return r?(u.undirectedDegree++,d.undirectedDegree++,f&&(u.undirectedLoops++,t._undirectedSelfLoopCount++)):(u.outDegree++,d.inDegree++,f&&(u.directedLoops++,t._directedSelfLoopCount++)),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,h.key=i,t.emit("edgeAdded",h),i}function Ct(t,e,n,r,i,o,a,c,d){if(!r&&"undirected"===t.type)throw new I("Graph.".concat(e,": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new I("Graph.".concat(e,": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));if(c)if(d){if("function"!=typeof c)throw new B("Graph.".concat(e,': invalid updater function. Expecting a function but got "').concat(c,'"'))}else if(!s(c))throw new B("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(c,'"'));var h;if(o=""+o,a=""+a,d&&(h=c,c=void 0),!t.allowSelfLoops&&o===a)throw new I("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var p,f,l=t._nodes.get(o),g=t._nodes.get(a);if(!n&&(p=t._edges.get(i))){if(!(p.source.key===o&&p.target.key===a||r&&p.source.key===a&&p.target.key===o))throw new I("Graph.".concat(e,': inconsistency detected when attempting to merge the "').concat(i,'" edge with "').concat(o,'" source & "').concat(a,'" target vs. ("').concat(p.source.key,'", "').concat(p.target.key,'").'));f=p;}if(f||t.multi||!l||(f=r?l.undirected[a]:l.out[a]),f){var y=[f.key,!1,!1,!1];if(d?!h:!c)return y;if(d){var w=f.attributes;f.attributes=h(w),t.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes});}else u(f.attributes,c),t.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:c});return y}c=c||{},d&&h&&(c=h(c));var v={key:null,undirected:r,source:o,target:a,attributes:c};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new I("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));var b=!1,m=!1;l||(l=Ot(t,o,{}),b=!0,o===a&&(g=l,m=!0)),g||(g=Ot(t,a,{}),m=!0),p=new V(r,i,l,g,c),t._edges.set(i,p);var k=o===a;return r?(l.undirectedDegree++,g.undirectedDegree++,k&&(l.undirectedLoops++,t._undirectedSelfLoopCount++)):(l.outDegree++,g.inDegree++,k&&(l.directedLoops++,t._directedSelfLoopCount++)),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,v.key=i,t.emit("edgeAdded",v),[i,!0,b,m]}function Mt(t,e){t._edges.delete(e.key);var n=e.source,r=e.target,i=e.attributes,o=e.undirected,a=n===r;o?(n.undirectedDegree--,r.undirectedDegree--,a&&(n.undirectedLoops--,t._undirectedSelfLoopCount--)):(n.outDegree--,r.inDegree--,a&&(n.directedLoops--,t._directedSelfLoopCount--)),t.multi?e.detachMulti():e.detach(),o?t._undirectedSize--:t._directedSize--,t.emit("edgeDropped",{key:e.key,attributes:i,source:n.key,target:r.key,undirected:o});}var zt=function(n){function r(t){var e;if(e=n.call(this)||this,"boolean"!=typeof(t=u({},Nt,t)).multi)throw new B("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(t.multi,'".'));if(!Dt.has(t.type))throw new B('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "'.concat(t.type,'".'));if("boolean"!=typeof t.allowSelfLoops)throw new B("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(t.allowSelfLoops,'".'));var r="mixed"===t.type?Y:"directed"===t.type?q:J;p(c(e),"NodeDataClass",r);var i="geid_"+St()+"_",o=0;return p(c(e),"_attributes",{}),p(c(e),"_nodes",new Map),p(c(e),"_edges",new Map),p(c(e),"_directedSize",0),p(c(e),"_undirectedSize",0),p(c(e),"_directedSelfLoopCount",0),p(c(e),"_undirectedSelfLoopCount",0),p(c(e),"_edgeKeyGenerator",(function(){var t;do{t=i+o++;}while(e._edges.has(t));return t})),p(c(e),"_options",t),Ut.forEach((function(t){return p(c(e),t,e[t])})),f(c(e),"order",(function(){return e._nodes.size})),f(c(e),"size",(function(){return e._edges.size})),f(c(e),"directedSize",(function(){return e._directedSize})),f(c(e),"undirectedSize",(function(){return e._undirectedSize})),f(c(e),"selfLoopCount",(function(){return e._directedSelfLoopCount+e._undirectedSelfLoopCount})),f(c(e),"directedSelfLoopCount",(function(){return e._directedSelfLoopCount})),f(c(e),"undirectedSelfLoopCount",(function(){return e._undirectedSelfLoopCount})),f(c(e),"multi",e._options.multi),f(c(e),"type",e._options.type),f(c(e),"allowSelfLoops",e._options.allowSelfLoops),f(c(e),"implementation",(function(){return "graphology"})),e}e(r,n);var i=r.prototype;return i._resetInstanceCounters=function(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0;},i.hasNode=function(t){return this._nodes.has(""+t)},i.hasDirectedEdge=function(t,e){if("undirected"===this.type)return !1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return !!r&&!r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);return !!i&&i.out.hasOwnProperty(e)}throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasUndirectedEdge=function(t,e){if("directed"===this.type)return !1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return !!r&&r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);return !!i&&i.undirected.hasOwnProperty(e)}throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasEdge=function(t,e){if(1===arguments.length){var n=""+t;return this._edges.has(n)}if(2===arguments.length){t=""+t,e=""+e;var r=this._nodes.get(t);return !!r&&(void 0!==r.out&&r.out.hasOwnProperty(e)||void 0!==r.undirected&&r.undirected.hasOwnProperty(e))}throw new B("Graph.hasEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.directedEdge=function(t,e){if("undirected"!==this.type){if(t=""+t,e=""+e,this.multi)throw new I("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");var n=this._nodes.get(t);if(!n)throw new F('Graph.directedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F('Graph.directedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||void 0;return r?r.key:void 0}},i.undirectedEdge=function(t,e){if("directed"!==this.type){if(t=""+t,e=""+e,this.multi)throw new I("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");var n=this._nodes.get(t);if(!n)throw new F('Graph.undirectedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F('Graph.undirectedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.undirected&&n.undirected[e]||void 0;return r?r.key:void 0}},i.edge=function(t,e){if(this.multi)throw new I("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.edge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F('Graph.edge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||n.undirected&&n.undirected[e]||void 0;if(r)return r.key},i.areDirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areDirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "undirected"!==this.type&&(e in n.in||e in n.out)},i.areOutNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areOutNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "undirected"!==this.type&&e in n.out},i.areInNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areInNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "undirected"!==this.type&&e in n.in},i.areUndirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areUndirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "directed"!==this.type&&e in n.undirected},i.areNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "undirected"!==this.type&&(e in n.in||e in n.out)||"directed"!==this.type&&e in n.undirected},i.areInboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areInboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "undirected"!==this.type&&e in n.in||"directed"!==this.type&&e in n.undirected},i.areOutboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areOutboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return "undirected"!==this.type&&e in n.out||"directed"!==this.type&&e in n.undirected},i.inDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inDegree: could not find the "'.concat(t,'" node in the graph.'));return "undirected"===this.type?0:e.inDegree},i.outDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outDegree: could not find the "'.concat(t,'" node in the graph.'));return "undirected"===this.type?0:e.outDegree},i.directedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.directedDegree: could not find the "'.concat(t,'" node in the graph.'));return "undirected"===this.type?0:e.inDegree+e.outDegree},i.undirectedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.undirectedDegree: could not find the "'.concat(t,'" node in the graph.'));return "directed"===this.type?0:e.undirectedDegree},i.inboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return "directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree),n},i.outboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return "directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.outDegree),n},i.degree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.degree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return "directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree+e.outDegree),n},i.inDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return "undirected"===this.type?0:e.inDegree-e.directedLoops},i.outDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return "undirected"===this.type?0:e.outDegree-e.directedLoops},i.directedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return "undirected"===this.type?0:e.inDegree+e.outDegree-2*e.directedLoops},i.undirectedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return "directed"===this.type?0:e.undirectedDegree-2*e.undirectedLoops},i.inboundDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var n=0,r=0;return "directed"!==this.type&&(n+=e.undirectedDegree,r+=2*e.undirectedLoops),"undirected"!==this.type&&(n+=e.inDegree,r+=e.directedLoops),n-r},i.outboundDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var n=0,r=0;return "directed"!==this.type&&(n+=e.undirectedDegree,r+=2*e.undirectedLoops),"undirected"!==this.type&&(n+=e.outDegree,r+=e.directedLoops),n-r},i.degreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.degreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var n=0,r=0;return "directed"!==this.type&&(n+=e.undirectedDegree,r+=2*e.undirectedLoops),"undirected"!==this.type&&(n+=e.inDegree+e.outDegree,r+=2*e.directedLoops),n-r},i.source=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.source: could not find the "'.concat(t,'" edge in the graph.'));return e.source.key},i.target=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.target: could not find the "'.concat(t,'" edge in the graph.'));return e.target.key},i.extremities=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.extremities: could not find the "'.concat(t,'" edge in the graph.'));return [e.source.key,e.target.key]},i.opposite=function(t,e){t=""+t,e=""+e;var n=this._edges.get(e);if(!n)throw new F('Graph.opposite: could not find the "'.concat(e,'" edge in the graph.'));var r=n.source.key,i=n.target.key;if(t===r)return i;if(t===i)return r;throw new F('Graph.opposite: the "'.concat(t,'" node is not attached to the "').concat(e,'" edge (').concat(r,", ").concat(i,")."))},i.hasExtremity=function(t,e){t=""+t,e=""+e;var n=this._edges.get(t);if(!n)throw new F('Graph.hasExtremity: could not find the "'.concat(t,'" edge in the graph.'));return n.source.key===e||n.target.key===e},i.isUndirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.isUndirected: could not find the "'.concat(t,'" edge in the graph.'));return e.undirected},i.isDirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.isDirected: could not find the "'.concat(t,'" edge in the graph.'));return !e.undirected},i.isSelfLoop=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.isSelfLoop: could not find the "'.concat(t,'" edge in the graph.'));return e.source===e.target},i.addNode=function(t,e){var n=function(t,e,n){if(n&&!s(n))throw new B('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n,'"'));if(e=""+e,n=n||{},t._nodes.has(e))throw new I('Graph.addNode: the "'.concat(e,'" node already exist in the graph.'));var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}(this,t,e);return n.key},i.mergeNode=function(t,e){if(e&&!s(e))throw new B('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(e,'"'));t=""+t,e=e||{};var n=this._nodes.get(t);return n?(e&&(u(n.attributes,e),this.emit("nodeAttributesUpdated",{type:"merge",key:t,attributes:n.attributes,data:e})),[t,!1]):(n=new this.NodeDataClass(t,e),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:e}),[t,!0])},i.updateNode=function(t,e){if(e&&"function"!=typeof e)throw new B('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(e,'"'));t=""+t;var n=this._nodes.get(t);if(n){if(e){var r=n.attributes;n.attributes=e(r),this.emit("nodeAttributesUpdated",{type:"replace",key:t,attributes:n.attributes});}return [t,!1]}var i=e?e({}):{};return n=new this.NodeDataClass(t,i),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:i}),[t,!0]},i.dropNode=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new F('Graph.dropNode: could not find the "'.concat(t,'" node in the graph.'));if("undirected"!==this.type){for(var r in n.out){e=n.out[r];do{Mt(this,e),e=e.next;}while(e)}for(var i in n.in){e=n.in[i];do{Mt(this,e),e=e.next;}while(e)}}if("directed"!==this.type)for(var o in n.undirected){e=n.undirected[o];do{Mt(this,e),e=e.next;}while(e)}this._nodes.delete(t),this.emit("nodeDropped",{key:t,attributes:n.attributes});},i.dropEdge=function(t){var e;if(arguments.length>1){var n=""+arguments[0],r=""+arguments[1];if(!(e=d(this,n,r,this.type)))throw new F('Graph.dropEdge: could not find the "'.concat(n,'" -> "').concat(r,'" edge in the graph.'))}else if(t=""+t,!(e=this._edges.get(t)))throw new F('Graph.dropEdge: could not find the "'.concat(t,'" edge in the graph.'));return Mt(this,e),this},i.dropDirectedEdge=function(t,e){if(arguments.length<2)throw new I("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new I("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=d(this,t=""+t,e=""+e,"directed");if(!n)throw new F('Graph.dropDirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.dropUndirectedEdge=function(t,e){if(arguments.length<2)throw new I("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new I("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=d(this,t,e,"undirected");if(!n)throw new F('Graph.dropUndirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.clear=function(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared");},i.clearEdges=function(){for(var t,e=this._nodes.values();!0!==(t=e.next()).done;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared");},i.getAttribute=function(t){return this._attributes[t]},i.getAttributes=function(){return this._attributes},i.hasAttribute=function(t){return this._attributes.hasOwnProperty(t)},i.setAttribute=function(t,e){return this._attributes[t]=e,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.updateAttribute=function(t,e){if("function"!=typeof e)throw new B("Graph.updateAttribute: updater should be a function.");var n=this._attributes[t];return this._attributes[t]=e(n),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.removeAttribute=function(t){return delete this._attributes[t],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:t}),this},i.replaceAttributes=function(t){if(!s(t))throw new B("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=t,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this},i.mergeAttributes=function(t){if(!s(t))throw new B("Graph.mergeAttributes: provided attributes are not a plain object.");return u(this._attributes,t),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:t}),this},i.updateAttributes=function(t){if("function"!=typeof t)throw new B("Graph.updateAttributes: provided updater is not a function.");return this._attributes=t(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this},i.updateEachNodeAttributes=function(t,e){if("function"!=typeof t)throw new B("Graph.updateEachNodeAttributes: expecting an updater function.");if(e&&!l(e))throw new B("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i=this._nodes.values();!0!==(n=i.next()).done;)(r=n.value).attributes=t(r.key,r.attributes);this.emit("eachNodeAttributesUpdated",{hints:e||null});},i.updateEachEdgeAttributes=function(t,e){if("function"!=typeof t)throw new B("Graph.updateEachEdgeAttributes: expecting an updater function.");if(e&&!l(e))throw new B("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i,o,a=this._edges.values();!0!==(n=a.next()).done;)i=(r=n.value).source,o=r.target,r.attributes=t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected);this.emit("eachEdgeAttributesUpdated",{hints:e||null});},i.forEachAdjacencyEntry=function(t){if("function"!=typeof t)throw new B("Graph.forEachAdjacencyEntry: expecting a callback.");xt(!1,!1,!1,this,t);},i.forEachAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new B("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");xt(!1,!1,!0,this,t);},i.forEachAssymetricAdjacencyEntry=function(t){if("function"!=typeof t)throw new B("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");xt(!1,!0,!1,this,t);},i.forEachAssymetricAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new B("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");xt(!1,!0,!0,this,t);},i.nodes=function(){return "function"==typeof Array.from?Array.from(this._nodes.keys()):K(this._nodes.keys(),this._nodes.size)},i.forEachNode=function(t){if("function"!=typeof t)throw new B("Graph.forEachNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes);},i.findNode=function(t){if("function"!=typeof t)throw new B("Graph.findNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return n.key},i.mapNodes=function(t){if("function"!=typeof t)throw new B("Graph.mapNode: expecting a callback.");for(var e,n,r=this._nodes.values(),i=new Array(this.order),o=0;!0!==(e=r.next()).done;)n=e.value,i[o++]=t(n.key,n.attributes);return i},i.someNode=function(t){if("function"!=typeof t)throw new B("Graph.someNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return !0;return !1},i.everyNode=function(t){if("function"!=typeof t)throw new B("Graph.everyNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(!t((n=e.value).key,n.attributes))return !1;return !0},i.filterNodes=function(t){if("function"!=typeof t)throw new B("Graph.filterNodes: expecting a callback.");for(var e,n,r=this._nodes.values(),i=[];!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)&&i.push(n.key);return i},i.reduceNodes=function(t,e){if("function"!=typeof t)throw new B("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new B("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");for(var n,r,i=e,o=this._nodes.values();!0!==(n=o.next()).done;)i=t(i,(r=n.value).key,r.attributes);return i},i.nodeEntries=function(){var t=this._nodes.values();return new O((function(){var e=t.next();if(e.done)return e;var n=e.value;return {value:{node:n.key,attributes:n.attributes},done:!1}}))},i.export=function(){var t=this,e=new Array(this._nodes.size),n=0;this._nodes.forEach((function(t,r){e[n++]=function(t,e){var n={key:t};return h(e.attributes)||(n.attributes=u({},e.attributes)),n}(r,t);}));var r=new Array(this._edges.size);return n=0,this._edges.forEach((function(e,i){r[n++]=function(t,e,n){var r={key:e,source:n.source.key,target:n.target.key};return h(n.attributes)||(r.attributes=u({},n.attributes)),"mixed"===t&&n.undirected&&(r.undirected=!0),r}(t.type,i,e);})),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:e,edges:r}},i.import=function(t){var e,n,i,o,a,c=this,u=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(t instanceof r)return t.forEachNode((function(t,e){u?c.mergeNode(t,e):c.addNode(t,e);})),t.forEachEdge((function(t,e,n,r,i,o,a){u?a?c.mergeUndirectedEdgeWithKey(t,n,r,e):c.mergeDirectedEdgeWithKey(t,n,r,e):a?c.addUndirectedEdgeWithKey(t,n,r,e):c.addDirectedEdgeWithKey(t,n,r,e);})),this;if(!s(t))throw new B("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(t.attributes){if(!s(t.attributes))throw new B("Graph.import: invalid attributes. Expecting a plain object.");u?this.mergeAttributes(t.attributes):this.replaceAttributes(t.attributes);}if(t.nodes){if(i=t.nodes,!Array.isArray(i))throw new B("Graph.import: invalid nodes. Expecting an array.");for(e=0,n=i.length;e<n;e++){Et(o=i[e]);var d=o,h=d.key,p=d.attributes;u?this.mergeNode(h,p):this.addNode(h,p);}}if(t.edges){var f=!1;if("undirected"===this.type&&(f=!0),i=t.edges,!Array.isArray(i))throw new B("Graph.import: invalid edges. Expecting an array.");for(e=0,n=i.length;e<n;e++){At(a=i[e]);var l=a,g=l.source,y=l.target,w=l.attributes,v=l.undirected,b=void 0===v?f:v;"key"in a?(u?b?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:b?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey).call(this,a.key,g,y,w):(u?b?this.mergeUndirectedEdge:this.mergeDirectedEdge:b?this.addUndirectedEdge:this.addDirectedEdge).call(this,g,y,w);}}return this},i.nullCopy=function(t){var e=new r(u({},this._options,t));return e.replaceAttributes(u({},this.getAttributes())),e},i.emptyCopy=function(t){var e=this.nullCopy(t);return this._nodes.forEach((function(t,n){var r=u({},t.attributes);t=new e.NodeDataClass(n,r),e._nodes.set(n,t);})),e},i.copy=function(t){if("string"==typeof(t=t||{}).type&&t.type!==this.type&&"mixed"!==t.type)throw new I('Graph.copy: cannot create an incompatible copy from "'.concat(this.type,'" type to "').concat(t.type,'" because this would mean losing information about the current graph.'));if("boolean"==typeof t.multi&&t.multi!==this.multi&&!0!==t.multi)throw new I("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if("boolean"==typeof t.allowSelfLoops&&t.allowSelfLoops!==this.allowSelfLoops&&!0!==t.allowSelfLoops)throw new I("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");for(var e,n,r=this.emptyCopy(t),i=this._edges.values();!0!==(e=i.next()).done;)jt(r,"copy",!1,(n=e.value).undirected,n.key,n.source.key,n.target.key,u({},n.attributes));return r},i.toJSON=function(){return this.export()},i.toString=function(){return "[object Graph]"},i.inspect=function(){var e=this,n={};this._nodes.forEach((function(t,e){n[e]=t.attributes;}));var r={},i={};this._edges.forEach((function(t,n){var o,a=t.undirected?"--":"->",c="",u=t.source.key,d=t.target.key;t.undirected&&u>d&&(o=u,u=d,d=o);var s="(".concat(u,")").concat(a,"(").concat(d,")");n.startsWith("geid_")?e.multi&&(void 0===i[s]?i[s]=0:i[s]++,c+="".concat(i[s],". ")):c+="[".concat(n,"]: "),r[c+=s]=t.attributes;}));var o={};for(var a in this)this.hasOwnProperty(a)&&!Ut.has(a)&&"function"!=typeof this[a]&&"symbol"!==t(a)&&(o[a]=this[a]);return o.attributes=this._attributes,o.nodes=n,o.edges=r,p(o,"constructor",this.constructor),o},r}(y.exports.EventEmitter);"undefined"!=typeof Symbol&&(zt.prototype[Symbol.for("nodejs.util.inspect.custom")]=zt.prototype.inspect),[{name:function(t){return "".concat(t,"Edge")},generateKey:!0},{name:function(t){return "".concat(t,"DirectedEdge")},generateKey:!0,type:"directed"},{name:function(t){return "".concat(t,"UndirectedEdge")},generateKey:!0,type:"undirected"},{name:function(t){return "".concat(t,"EdgeWithKey")}},{name:function(t){return "".concat(t,"DirectedEdgeWithKey")},type:"directed"},{name:function(t){return "".concat(t,"UndirectedEdgeWithKey")},type:"undirected"}].forEach((function(t){["add","merge","update"].forEach((function(e){var n=t.name(e),r="add"===e?jt:Ct;t.generateKey?zt.prototype[n]=function(i,o,a){return r(this,n,!0,"undirected"===(t.type||this.type),null,i,o,a,"update"===e)}:zt.prototype[n]=function(i,o,a,c){return r(this,n,!1,"undirected"===(t.type||this.type),i,o,a,c,"update"===e)};}));})),function(t){Q.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Node"),0),r(t,n("Source"),1),r(t,n("Target"),2),r(t,n("Opposite"),3);}));}(zt),function(t){X.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Edge"),"mixed"),r(t,n("DirectedEdge"),"directed"),r(t,n("UndirectedEdge"),"undirected");}));}(zt),function(t){et.forEach((function(e){!function(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return [];if(!arguments.length)return ut(this,r);if(1===arguments.length){t=""+t;var o=this._nodes.get(t);if(void 0===o)throw new F("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return pt(this.multi,"mixed"===r?this.type:r,i,o)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new F("Graph.".concat(n,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(n,':  could not find the "').concat(e,'" target node in the graph.'));return gt(r,this.multi,i,a,e)}throw new B("Graph.".concat(n,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))};}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return dt(!1,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return ht(!1,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var c=this._nodes.get(t);if(!c)throw new F("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return lt(!1,r,this.multi,i,c,e,n)}throw new B("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(){var t,e=Array.prototype.slice.call(arguments),n=e.pop();if(0===e.length){var i=0;"directed"!==r&&(i+=this.undirectedSize),"undirected"!==r&&(i+=this.directedSize),t=new Array(i);var a=0;e.push((function(e,r,i,o,c,u,d){t[a++]=n(e,r,i,o,c,u,d);}));}else t=[],e.push((function(e,r,i,o,a,c,u){t.push(n(e,r,i,o,a,c,u));}));return this[o].apply(this,e),t};var c="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop(),n=[];return t.push((function(t,r,i,o,a,c,u){e(t,r,i,o,a,c,u)&&n.push(t);})),this[o].apply(this,t),n};var u="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(){var t,e,n=Array.prototype.slice.call(arguments);if(n.length<2||n.length>4)throw new B("Graph.".concat(u,": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(n.length,")."));if("function"==typeof n[n.length-1]&&"function"!=typeof n[n.length-2])throw new B("Graph.".concat(u,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));2===n.length?(t=n[0],e=n[1],n=[]):3===n.length?(t=n[1],e=n[2],n=[n[0]]):4===n.length&&(t=n[2],e=n[3],n=[n[0],n[1]]);var r=e;return n.push((function(e,n,i,o,a,c,u){r=t(r,e,n,i,o,a,c,u);})),this[o].apply(this,n),r};}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="find"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return !1;if(1===arguments.length)return dt(!0,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return ht(!0,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var c=this._nodes.get(t);if(!c)throw new F("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return lt(!0,r,this.multi,i,c,e,n)}throw new B("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))};var a="some"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[a]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,c){return e(t,n,r,i,o,a,c)})),!!this[o].apply(this,t)};var c="every"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[c]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,c){return !e(t,n,r,i,o,a,c)})),!this[o].apply(this,t)};}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();if(!arguments.length)return st(this,r);if(1===arguments.length){t=""+t;var n=this._nodes.get(t);if(!n)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return ft(r,i,n)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new F("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return yt(r,i,a,e)}throw new B("Graph.".concat(o,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))};}(t,e);}));}(zt),function(t){wt.forEach((function(e){_t(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));mt(!1,"mixed"===r?this.type:r,i,n,e);}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(t,e){var n=[];return this[o](t,(function(t,r){n.push(e(t,r));})),n};var c="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(t,e){var n=[];return this[o](t,(function(t,r){e(t,r)&&n.push(t);})),n};var u="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(t,e,n){if(arguments.length<3)throw new B("Graph.".concat(u,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));var r=n;return this[o](t,(function(t,n){r=e(r,t,n);})),r};}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n[0].toUpperCase()+n.slice(1,-1),a="find"+o;t.prototype[a]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new F("Graph.".concat(a,': could not find the "').concat(t,'" node in the graph.'));return mt(!0,"mixed"===r?this.type:r,i,n,e)}};var c="some"+o;t.prototype[c]=function(t,e){return !!this[a](t,e)};var u="every"+o;t.prototype[u]=function(t,e){return !this[a](t,(function(t,n){return !e(t,n)}))};}(t,e),Gt(t,e);}));}(zt);var Wt=function(t){function n(e){var n=u({type:"directed"},e);if("multi"in n&&!1!==n.multi)throw new B("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("directed"!==n.type)throw new B('DirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt),Pt=function(t){function n(e){var n=u({type:"undirected"},e);if("multi"in n&&!1!==n.multi)throw new B("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("undirected"!==n.type)throw new B('UndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt),Rt=function(t){function n(e){var n=u({multi:!0},e);if("multi"in n&&!0!==n.multi)throw new B("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");return t.call(this,n)||this}return e(n,t),n}(zt),Kt=function(t){function n(e){var n=u({type:"directed",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new B("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("directed"!==n.type)throw new B('MultiDirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt),Tt=function(t){function n(e){var n=u({type:"undirected",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new B("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("undirected"!==n.type)throw new B('MultiUndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt);function Bt(t){t.from=function(e,n){var r=u({},e.options,n),i=new t(r);return i.import(e),i};}return Bt(zt),Bt(Wt),Bt(Pt),Bt(Rt),Bt(Kt),Bt(Tt),zt.Graph=zt,zt.DirectedGraph=Wt,zt.UndirectedGraph=Pt,zt.MultiGraph=Rt,zt.MultiDirectedGraph=Kt,zt.MultiUndirectedGraph=Tt,zt.InvalidArgumentsGraphError=B,zt.NotFoundGraphError=F,zt.UsageGraphError=I,zt}));
	
} (graphology_umd_min));

const ResourcefulMixin = {
  createId (prefix = '', size = 2) {
    const id = prefix + randomAlpha(size, 31);
    this.id = id;
    return id
  },
};

const SerializableMixin = {
  toString() {
    return JSON.stringify({ ...this }, null, 2)
  },
  toJSON() {
    return { ...this }
  },
};

class Vertex {
  constructor({ 
    id, 
    tick, 
    bindTo, 
    params, 
    prefix = 'v#'
  }) {
    Object.assign(this, ResourcefulMixin);
    Object.assign(this, SerializableMixin);

    this.id = id || this.createId(prefix, 2);

    this.value = 0;
    this.params = params;
    this.bindTo = bindTo;

    this.tickFn = !tick
      ? data => data
      : tick;
  }
}

class Action extends Vertex {
  constructor({
    id,
    bindTo,
    params,
    tick
  } = {}) {
    super({
      id,
      tick,
      bindTo,
      prefix: 's#'
    });

    Object.assign(this, { params });
  }

  tick(d) {
    const fn = this.bindTo 
      ? this.tickFn.bind(this.bindTo) 
      : this.tickFn;

    this.value = fn(d || 0);
    
    return this.value
  }
}

class Neuron extends Vertex {
  constructor({ id } = {}) {
    super({ id, prefix: 'n#' });
  }
}

class Sensor extends Vertex {
  constructor({ 
    id, 
    tick, 
    bindTo, 
    config, 
    params 
  } = {}) {
    super({ 
      id, 
      tick, 
      bindTo, 
      params, 
      prefix: 's#'
    });

    if (config) this.config(params);
  }

  tick() {
    const fn = this.bindTo
      ? this.tickFn.bind(this.bindTo)
      : this.tickFn;

    this.value = fn(this.params || null);

    return this.value
  }
}

class Brain {
  constructor({
    id,
    genome,
    sensors = [],
    actions = [],
    neuronsCount = 0,
    graphOptions = {},
    verticesParams = {},
  }) {
    Object.assign(this, ResourcefulMixin);

    this.id = id || this.createId('b#', 4);

    this.ticks = [];
    this.genome = genome;
    this.sensors = sensors;
    this.actions = actions;
    this.neuronsCount = neuronsCount;
    this.graphOptions = graphOptions;
    this.verticesParams = verticesParams;

    this.setup();
  }

  setup() {
    const verticesParams = {
      brain: this,
      ...this.verticesParams,
    };

    this.sensors = this.sensors
      .map(s => ({ ...s, params: verticesParams }))
      .map(s => new Sensor(s));

    this.actions = this.actions
      .map(s => ({ ...s, params: verticesParams }))
      .map(a => new Action(a));

    this.neurons = new Array(this.neuronsCount).fill(0)
      .map((_, i) => new Neuron({ id: `n#${toBase32(i).padStart(2, '0')}` }));

    const nodes = [... new Set([]
      .concat(this.sensors || [])
      .concat(this.neurons || [])
      .concat(this.actions || [])
      .map(s => s.id))
    ];

    this.graph = new graphology_umd_minExports({
      multi: true,
      allowSelfLoops: false,
      ...this.graphOptions,
    });

    this.graph.import({
      attributes: { name: this.id },
      nodes: nodes.map(n => ({ key: n })),
    });

    const bases = this.genome.bases.filter(b => nodes.includes(b.from) && nodes.includes(b.to));

    for (const base of bases) {
      if (base.from !== base.to) {
        if (!this.graph.hasEdge(base.from, base.to)) {
          this.graph.addEdgeWithKey(
            `${base.from}>>${base.to}`,
            base.from,
            base.to,
            { weight: base.weight }
          );
        }
      }
    }
  }

  static random({ genome, genomeSize = 1, neuronsCount = 0, sensors = [], actions = [] } = {}) {
    let gen = genome || Genome.random(genomeSize);

    return new Brain({
      sensors,
      actions,
      genome: gen,
      neuronsCount,
    })
  }

  toJSON() {
    return {
      genome: this.genome.toArray(),
      brainOrder: this.graph.order,
      brainConnections: this.graph.size,
      ...this.graph.export(),
      ticks: this.ticks,
    }
  }

  getObject(id) {
    return id.startsWith('s#')
      ? this.sensors.find(s => s.id === id)
      : id.startsWith('a#')
        ? this.actions.find(a => a.id === id)
        : id.startsWith('#n')
          ? this.neurons.find(n => n.id === id)
          : null
  }

  getObjects(idList = []) {
    return idList
      .map(id => this.getObject(id))
      .filter(n => n)
  }

  tick() {
    const ticks = [... new Set([]
      .concat(this.sensors || [])
      .concat(this.neurons || [])
      .concat(this.actions || [])
      .map(s => s.id))
    ].reduce((acc, n) => {
      acc[n] = 0;
      return acc
    }, {});

    // calculate sensors
    this.sensors.forEach(x => { ticks[x.id] = x.tick(); });

    // calculate neurons
    let neurons = this.sensors.map(s => this.graph.neighbors(s.id))
      .flatMap(x => x)
      .filter(n => n.startsWith('n#'))
      .map(id => this.neurons.find(n => n.id === id));

    while (neurons.length > 0) {
      let next = neurons.shift();

      const thisEdges = this.graph.edges(next.id)
        .map(e => ({ name: e, extremities: this.graph.extremities(e) }));

      const neuronsReq = thisEdges
        .filter(e => e.extremities[1] === next.id)
        .filter(e => e.extremities[0] !== next.id);

      const deps = neuronsReq.filter(n => !ticks.hasOwnProperty(n.extremities[0])).length;

      if (deps > 0) {
        neurons = neurons
          .concat(neuronsReq.map(e => this.neurons.find(n => e === n.extremities[0])))
          .concat(next);

        continue
      }

      let edges = neuronsReq.map(e => ({ ...e, ...this.graph.getEdgeAttributes(e.name) }));
      const weightTotal = edges.map(e => e.weight).reduce((acc, x) => acc + x, 0);
      let values = edges.map(e => ({ ...e, value: ticks[e.extremities[0]] * e.weight }));

      ticks[next.id] = Math.tanh(values.reduce((acc, k) => acc + k.value, 0) / weightTotal);

      let nextTargets = thisEdges
        .filter(e => e.extremities[0] === next.id)
        .filter(n => n.extremities[1].startsWith('n#'))
        .map(e => this.neurons.find(n => n.id === e.extremities[1]))
        .filter(e => !ticks.hasOwnProperty(e.id));

      neurons = neurons.concat(nextTargets);
    }

    // calculate actions
    for (const action of this.actions) {
      let sources = this.graph.edges(action.id)
        .filter(x => x)
        .map(e => ({ name: e, id: this.graph.extremities(e)[0] }))
        .map(e => ({ ...e, ...this.graph.getEdgeAttributes(e.name) }));

      const weightTotal = sources.map(e => e.weight).reduce((acc, x) => acc + x, 0) || 1;

      ticks[action.id] = Math.tanh(sources.reduce((acc, e) => acc + ticks[e.id] * e.weight, 0) / weightTotal);
    }

    this.ticks.push(ticks);

    return Object.entries(ticks)
      .filter(([k]) => k.startsWith('a#'))
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc
      }, {})
  }

  run() {
    const tick = this.tick();

    for (const action of this.actions) {
      action.tick(tick[action.id]);
    }
  }
}

class Individual {
  constructor({
    genome = null,
    genomeSize = 1,

    brain: {
      sensors = [],
      actions = [],
      neuronsCount = 0,
      graphOptions = {},
      verticesParams = {},
    }
  }) {
    Object.assign(this, ResourcefulMixin);

    this.id = this.createId('i#', 4);
    this.health = 1;

    const ids = [...new Set([]
      .concat(sensors)
      .concat(actions).map(x => x.id)
    )].sort();

    this.genome = genome || Genome.randomWithinIds({
      ids,
      neuronsCount,
      size: genomeSize,
    });

    this.brain = new Brain({
      genome: this.genome,
      neuronsCount,
      graphOptions,
      sensors: sensors.map(s => ({ bindTo: this, ...s })),
      actions: actions.map(a => ({ bindTo: this, ...a })),
      verticesParams: { ...verticesParams, individual: this },
    });

  }

  tick() {
    return this.brain.tick()
  }

  toJSON() {
    const brain = this.brain.toJSON();

    return {
      id: this.id,
      health: this.health,
      genome: this.genome.toString(),

      brain: {
        order: brain.brainOrder || 0,
        connections: brain.brainConnections || 0,
        nodes: this.genome.nodes.join(' '),
        edges: [].concat(brain.edges).map(k => k.key).join(' '),
        ticks: brain.ticks,
      }
    }
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}

class Generation {
  constructor({
    size,
    individualOptions = {},
    individualInterface = Individual,
    fitnessFunction = function (individual) { individual.health; },
    matingStrategy = [Pool],
  }) {
    this.iteration = 0;

    this.size = size;
    this.individualInterface = individualInterface;
    this.individualOptions = individualOptions;
    this.fitnessFunction = fitnessFunction;
    this.matingStrategies = matingStrategy;
    
    this.best = null;
    this.individuals = [];
    
    this.demographics = {
      total: 0,
      random: 0,
    };
  }

  static first({
    size,
    individualOptions = {},
    individualInterface = Individual,
    fitnessFunction,
  }) {
    const gen = new Generation({
      size,
      individualInterface,
      individualOptions,
      fitnessFunction,
    });

    gen.fill();
    return gen
  }

  createIndividualFromGenome(genome) {
    const ind = new this.individualInterface({
      genome,
      ...this.individualOptions,
    });

    this.individuals.push(ind);
    return ind
  }

  fill() {
    if (!this.individuals) this.individuals = [];

    const count = Math.abs(this.size - this.individuals.length) % (this.size + 1);

    const individualsPack = new Array(count).fill(null)
      .map(() => new this.individualInterface({
        ...this.individualOptions,
      }));

    this.individuals = this.individuals.concat(individualsPack);
    this.fitness = new Array(this.individuals.length).fill(-1);

    this.demographics.total += count;
    this.demographics.random += count;
  }

  fit() {
    this.fitness = this.individuals.map(ind => {
      const fitness = this.fitnessFunction(ind);
      ind.fitness = fitness;
      return fitness
    });

    this.individuals = this.individuals
      .sort((a, b) => b.fitness - a.fitness);

    this.best = this.individuals[0];
    return this.fitness
  }

  next() {
    this.fit();

    let gen;
    for (const StrategyInterface of this.matingStrategies) {
      const strategy = new StrategyInterface(this);
      gen = strategy.run();
    }

    gen.iteration = this.iteration + 1;    
    const children = gen.individuals.length;
    
    gen.demographics.children = children;
    gen.demographics.total += children;
    
    gen.fill();
    return gen
  }

  toArray() {
    return this.individuals.map(i => i.toString())
  }

  toJSON() {
    return this.individuals.map(i => i.toJSON())
  }

  exportParams() {
    return {
      size: this.size,
      individualInterface: this.individualInterface,
      individualOptions: this.individualOptions,
      fitnessFunction: this.fitnessFunction,
      matingStrategy: this.matingStrategies,
    }
  }
}

class Pool extends MatingStrategy {
  run() {

    const pool = {
      top: {
        checkIn: (score) => score >= 0.95,
        pool: [],
      },
      mid: {
        checkIn: (score) => score >= 0.85,
        pool: [],
      },
      low: {
        checkIn: (score) => score >= 0.60,
        pool: [],
      },
    };

    for (let i = 0; i < this.generation.individuals.length - 1; i++) {
      const score = this.generation.fitness[i];
      const individual = this.generation.individuals[i];

      if (pool.top.checkIn(score)) pool.top.pool.push(individual.genome);
      else if (pool.mid.checkIn(score)) pool.mid.pool.push(individual.genome);
      else if (pool.low.checkIn(score)) pool.low.pool.push(individual.genome);
    }

    let genomes = [];
    for (const pair of chunkArray(pool.top.pool, 2)) {
      if (genomes.length >= this.generation.size) break

      let [genA, genB] = pair;
      if (!genB) genB = Genome.copy(genA);

      genomes = genomes
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB));
    }

    for (const pair of chunkArray(pool.mid.pool, 2)) {
      if (genomes.length >= this.generation.size) break

      let [genA, genB] = pair;
      if (!genB) genB = Genome.copy(genA);

      genomes = genomes
        .concat(Genome.sexualReproduction(genA, genB))
        .concat(Genome.sexualReproduction(genA, genB));
    }

    for (const pair of chunkArray(pool.low.pool, 2)) {
      if (genomes.length >= this.generation.size) break

      let [genA, genB] = pair;
      if (!genB) genB = Genome.copy(genA);

      genomes = genomes.concat(Genome.sexualReproduction(genA, genB));
    }

    const gen = new Generation({ ...this.generation.exportParams() });
    for (const genome of genomes) {
      gen.createIndividualFromGenome(genome);
    }

    return gen
  }
}

exports.Action = Action;
exports.Base = Base;
exports.Brain = Brain;
exports.Generation = Generation;
exports.Genome = Genome;
exports.Individual = Individual;
exports.MatingStrategy = MatingStrategy;
exports.Neuron = Neuron;
exports.Pool = Pool;
exports.ResourcefulMixin = ResourcefulMixin;
exports.Sensor = Sensor;
exports.SerializableMixin = SerializableMixin;
exports.Vertex = Vertex;
exports.alphanum = alphanum;
exports.chars = chars;
exports.chunk = chunk;
exports.chunkArray = chunkArray;
exports.consonants = consonants;
exports.fromBase32 = fromBase32;
exports.fromBase32ToBin = fromBase32ToBin;
exports.fromBin = fromBin;
exports.fromBinToBase32 = fromBinToBase32;
exports.intersection = intersection;
exports.randomAlpha = randomAlpha;
exports.randomChar = randomChar;
exports.randomInt = randomInt;
exports.removeArray = removeArray;
exports.shuffle = shuffle;
exports.shuffleStr = shuffleStr;
exports.toBase32 = toBase32;
exports.toBin = toBin;
exports.vowels = vowels;
