import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const ReturnSchema = new Schema({
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
})