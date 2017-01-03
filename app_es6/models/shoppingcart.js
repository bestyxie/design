var mongoose = require('mongoose');
var ShoppingCartSchema = require('../schema//shoppingcart');

var ShoppingCart = mongoose.model('ShoppingCart',ShoppingCartSchema);

module.exports = ShoppingCart;