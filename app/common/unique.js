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
  var save = [];
  var _arr = toString(arr);
  var _remv = toString(remv);

  for (var i = 0, len = _arr.length; i < len; i++) {
    if (_remv.indexOf(_arr) < 0) {
      save.push(arr[i]);
    }
  }

  return save;
};

var toString = exports.toString = function toString(arr) {
  var _arr = arr.map(function (item) {
    return item.toString();
  });

  return _arr;
};