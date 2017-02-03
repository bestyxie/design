var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var OrderSchema = new Schema({
  user_id: ObjectId,
  address: ObjectId,
  express: Number,
  status: String,
  // 待付款
  // 待发货
  // 待收货
  // 待评价
  // 交易完成
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