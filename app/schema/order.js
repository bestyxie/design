'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var OrderSchema = new Schema({
  user_id: ObjectId,
  address: ObjectId,
  express: Number,
  status: Boolean,
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