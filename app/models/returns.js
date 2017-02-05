'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Returns = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _returns = require('../schema/returns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Returns = exports.Returns = _mongoose2.default.model('Returns', _returns.ReturnSchema);