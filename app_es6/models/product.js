var mongoose = require('mongoose');
var ProductSchema = require('../schema/product');

var Product = mongoose.model('Product',ProductSchema);

module.exports = Product;