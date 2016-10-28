(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cacheSize = 1024;
var resetInterval = 1000; // reset requested bit
var blockedInterval = 10;

var Cache = function () {
  function Cache(memory) {
    _classCallCheck(this, Cache);

    this.memory = memory;
    this.info = {
      hit: 0,
      miss: 0,
      blocked: 0
    };
    this.isBlocked = false;
    this.cache = [];
    for (var i = 0; i < cacheSize; i++) {
      this.cache[i] = {
        address: i,
        value: this.memory.get(i),
        requested: 0
      };
    } // first init
  }

  _createClass(Cache, [{
    key: "isExist",
    value: function isExist(pos) {
      var _this = this;

      var i = void 0;
      for (i = 0; i < this.cache.length; i++) {
        if (this.cache[i].address === pos) {
          this.cache[i].requested = 1;
          setTimeout(function () {
            _this.cache[i].requested = 0;
          }, resetInterval);
          return true;
        }
      }
      return false;
    }
  }, {
    key: "findOldIndex",
    value: function findOldIndex() {
      for (var i = 0; i < cacheSize + 1; i++) {
        if (!this.cache[i].requested) return i;
        this.cache[i].requested = 0;
      }
      return 0;
    }
  }, {
    key: "read",
    value: function read(pos) {
      var _this2 = this;

      if (this.isExist(pos)) {
        this.info.hit += 1;
      } else {
        (function () {
          _this2.info.miss += 1;
          var replaced = _this2.findOldIndex();
          _this2.cache[replaced] = {
            address: pos,
            value: _this2.memory.get(pos),
            requested: 1
          };
          setTimeout(function () {
            _this2.cache[replaced].requested = 0;
          }, resetInterval);
        })();
      }
    }
  }, {
    key: "write",
    value: function write(pos) {
      var _this3 = this;

      if (this.isBlocked) {
        this.info.blocked += 1;
        setTimeout(function () {
          _this3.write(pos);
        }, blockedInterval / 2); // ждем когда можно записать
      } else {
        this.isBlocked = true;
        this.memory.set(pos, 1);
        this.read(pos); // считаем, что тут перезаписывается значение в кэше, даже если оно уже там есть
        setTimeout(function () {
          _this3.isBlocked = false;
        }, blockedInterval);
      }
    }
  }]);

  return Cache;
}();

exports.default = Cache;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _memory = require('./memory');

var _memory2 = _interopRequireDefault(_memory);

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var varsCount = 100;
var arraysCount = 10;
var arraysLength = 50; // для рандома от x до 2x
var functionSizeL = 20;
var functionSizeC = 10;

var p_var = 30; // %
var p_arr = 20;
var p_func = 50;

var p_funcL = 65;
var p_funcC = 35;

var memory = new _memory2.default();

var Program = function () {
  function Program() {
    _classCallCheck(this, Program);

    this.vars = [];
    this.arrays = [];
    this.functionsL = [];
    this.functionsC = [];
    this.memory = memory;
    this.codeString = 0;
    this.cache = null;
  }

  _createClass(Program, [{
    key: 'init',
    value: function init() {
      this.codeString = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
      this.placeVars(); // compiles
      this.placeArrays();
      this.placeFunction();
      this.workTime = 0;
      this.cache = new _cache2.default(this.memory); // init fill cache
    }
  }, {
    key: 'run',
    value: function run() {
      var start = new Date();
      for (var i = this.codeString; i > 0; i--) {
        var code = Math.floor(Math.random() * 100);
        if (code < p_var) {
          this.handleVar();
        } else {
          if (code < p_var + p_arr) {
            this.handleArray();
          } else {
            if (code < p_var + p_arr + p_func) {
              this.executeFunction();
            }
          }
        }
      }
      /**  result info **/
      var allOperation = this.cache.info.hit + this.cache.info.miss;
      var hitted = this.cache.info.hit / allOperation;
      var missed = this.cache.info.miss / allOperation;
      console.log('hit: ' + hitted.toFixed(7) + '%', 'miss: ' + missed.toFixed(7) + '%');
      var now = new Date();
      console.log('blocked: ' + this.cache.info.blocked, ' WorkTime: ms', now.getTime() - start.getTime(), '\n');
      /*  result info */
    }
  }, {
    key: 'executeFunction',
    value: function executeFunction() {
      if (Math.random() < p_funcL / 100) {
        var index = Math.floor(Math.random() * this.functionsL.length);
        for (var i = 0; i < this.functionsL[index].size; i++) {
          this.cache.read(this.functionsL[index].start + i);
        }
      } else {
        var _index = Math.floor(Math.random() * this.functionsC.length);
        var cicles = Math.floor(Math.random() * 11) + 5;
        for (var j = 0; j < cicles; j++) {
          for (var _i = 0; _i < this.functionsL[_index].size; _i++) {
            this.cache.read(this.functionsL[_index].start + _i);
          }
        }
      }
    }
  }, {
    key: 'handleArray',
    value: function handleArray() {
      var index = Math.floor(Math.random() * this.arrays.length);
      for (var i = 0; i < this.arrays[index].size; i++) {
        this.cache.read(this.arrays[index].start + i);
      }
    }
  }, {
    key: 'handleVar',
    value: function handleVar() {
      var index = Math.floor(Math.random() * this.vars.length);
      if (Math.random() < 0.5) {
        this.cache.read(this.vars[index].start);
      } else {
        this.cache.write(this.vars[index].start);
      }
    }
  }, {
    key: 'placeVars',
    value: function placeVars() {
      for (var i = 0; i < varsCount; i++) {
        this.vars.push({
          start: this.memory.reserve(1),
          size: 1
        });
      }
    }
  }, {
    key: 'placeArrays',
    value: function placeArrays() {
      var arraySize = 0;
      for (var i = 0; i < arraysCount; i++) {
        arraySize = Math.floor(Math.random() * (arraysLength + 1)) + arraysLength;
        this.arrays.push({
          start: this.memory.reserve(arraySize),
          size: arraySize
        });
      }
    }
  }, {
    key: 'placeFunction',
    value: function placeFunction() {
      var funcSize = void 0;
      for (var i = 0; i < Math.floor(this.codeString * (p_funcL / 100)); i++) {
        funcSize = Math.floor(Math.random() * (functionSizeL + 1)) + functionSizeL;
        this.functionsL.push({
          start: this.memory.reserve(funcSize),
          size: funcSize
        });
      }
      for (var _i2 = 0; _i2 < Math.floor(this.codeString * (p_funcC / 100)); _i2++) {
        funcSize = Math.floor(Math.random() * (functionSizeC + 1)) + functionSizeC;
        this.functionsC.push({
          start: this.memory.reserve(funcSize),
          size: funcSize
        });
      }
    }
  }]);

  return Program;
}();

exports.default = Program;

},{"./cache":1,"./memory":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var memorySize = 20 * 1024;

var Memory = function () {
  function Memory() {
    _classCallCheck(this, Memory);

    this.memory = [];
    for (var i = 0; i < memorySize; i++) {
      this.memory[i] = 0; // выделена под программу
    }
  }

  _createClass(Memory, [{
    key: "get",
    value: function get(offset) {
      return this.memory[offset];
    }
  }, {
    key: "set",
    value: function set(offset, value) {
      this.memory[offset] = value;
    }
  }, {
    key: "reserve",
    value: function reserve(size) {
      for (var i = 0; i < this.memory.length; i++) {
        var placed = 0;
        if (this.memory[i] === 0) {
          // свободно
          for (var j = i; j < i + size; j++) {
            if (this.memory[j] > 0) {
              // не влезает, занято
              placed = 0;
              i += size;
              j = i; // for end
            }
            placed += 1;
          }
          if (placed === size) {
            for (var _j = i; _j < i + size; _j++) {
              this.memory[_j] = 1; // действительно заняли
            }
            return i;
          }
        }
      }
      return -1;
    }
  }]);

  return Memory;
}();

exports.default = Memory;

},{}]},{},[2])
//# sourceMappingURL=program.js.map
