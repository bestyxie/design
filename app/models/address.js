'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Address = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _address = require('../schema/address');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Address = exports.Address = _mongoose2.default.model('Address', _address.addressSchema);