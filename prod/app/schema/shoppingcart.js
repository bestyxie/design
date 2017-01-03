var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ShoppingCartSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User'
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

module.exports = ShoppingCartSchema;