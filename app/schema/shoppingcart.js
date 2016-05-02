var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ShoppingCartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  products: [{
    productId: { type:ObjectId, ref: 'Product' },
    name: { type: String, ref: 'Product' },
    url: { type: String, ref: 'Product'},
    price: { type: Number, ref: 'Product'},
    qty: Number
  }]
});

module.exports = ShoppingCartSchema;