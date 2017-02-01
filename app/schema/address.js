'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addressSchema = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.Types.ObjectId;

var addressSchema = exports.addressSchema = new Schema({
  user: ObjectId,
  recipient: String,
  tel: String,
  addr: String,
  default: Boolean
});