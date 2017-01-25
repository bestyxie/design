'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePic = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deletePic = exports.deletePic = function deletePic(urls) {
  for (var i = 0, len = urls.length; i < len; i++) {
    var curURL = _path2.default.join(__dirname.replace('app\\common', 'public'), urls[i]);
    console.log(curURL);
    _fs2.default.unlinkSync(curURL);
  }
};