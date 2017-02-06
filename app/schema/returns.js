'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReturnSchema = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.Types.ObjectId;

var ReturnSchema = exports.ReturnSchema = new Schema({
  user_id: ObjectId,
  orderid: ObjectId,
  status: String,
  // 1 申请阶段
  // 2 申请通过，买家发货并填写快递信息
  // 3 卖家收货
  // 4 退款完成
  reason: String,
  desc: String,
  contact: String,
  tel: String,
  pics: String,
  address: {
    recipient: String,
    tel: String,
    addr: String
  },
  express_msg: {
    name: String,
    number: String
  },
  products: [{
    productId: ObjectId,
    qty: Number,
    name: String,
    size: String,
    color: String,
    price: Number,
    pics: [String]
  }]
});