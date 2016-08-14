var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ShoppingCartSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  products: [{
    productId: { type:ObjectId, ref: 'Product' },
    qty: Number,
    name: { type: String, ref: 'Product' },
    size: String,
    color: String,
    price: { type: Number, ref: 'Product'},
    pics: { type: String, ref: 'Product'}
  }]
});

module.exports = ShoppingCartSchema;