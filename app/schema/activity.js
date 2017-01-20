'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activitySchema = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.Types.ObjectId;

var activitySchema = exports.activitySchema = new Schema({
  name: String,
  products: [ObjectId]
});