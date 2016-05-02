var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  url: String,
  price: Number
});

module.exports = ProductSchema;