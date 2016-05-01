var mongoose = require('mongoose');
var ProductSchema = require('../schema/products');

var Product = mongoose.model('Product',ProductSchema);

module.exports = Product;