"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var unique = exports.unique = function unique(arr) {
  arr.sort();
  var res = [arr[0]];
  for (var i = 1, len = arr.length; i < len; i++) {
    if (arr[i].toString() != res[res.length - 1].toString()) {
      res.push(arr[i]);
    }
  }
  return res;
};

var remove_item = exports.remove_item = function remove_item(arr, remv) {
  var res = [],
      save = [];
  for (var i = 0, len = remv.length; i < len; i++) {
    res.push(remv[i].toString());
  }
  for (var _i = 0, _len = arr.length; _i < _len; _i++) {
    if (res.indexOf(arr[_i].toString()) < 0) {
      save.push(arr[_i]);
    }
  }
  return save;
};