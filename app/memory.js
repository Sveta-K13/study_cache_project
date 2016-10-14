(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Memory = function () {
  function Memory() {
    _classCallCheck(this, Memory);

    this.memory = [];
    for (var i = 0; i < 20 * 1024; i++) {
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

exports.default = new Memory();

},{}]},{},[1])
//# sourceMappingURL=memory.js.map
