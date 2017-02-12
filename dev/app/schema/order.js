var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var OrderSchema = new Schema({
  user_id: ObjectId,
  openid: String,
  express: Number,
  status: String,
  // 待付款
  // 待发货
  // 待收货
  // 退款退货
  // 交易完成
  // 交易关闭
  transaction_id: String,
  evaluate: {type:Boolean,default: false}, //fasle 为待评价
  total: Number,
  address: {
    recipient: String,
    tel: String,
    address: String
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

module.exports = OrderSchema;