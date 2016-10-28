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

},{}]},{},[1])
//# sourceMappingURL=cache.js.map
