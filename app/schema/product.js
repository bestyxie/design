var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  img: Array,
  price: Number,
  discount: Number,
  size: Array,
  color: Array,
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