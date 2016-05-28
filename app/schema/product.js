var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  url: String,
  price: Number,
  discount: Number,
  size: String,
  sku: Number,
  meta:  {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

module.exports = ProductSchema;