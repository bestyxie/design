'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wcuserSchema = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var wcuserSchema = exports.wcuserSchema = new Schema({
  openid: String,
  headimgurl: String,
  nickname: String
});