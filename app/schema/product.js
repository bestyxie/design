var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ProductSchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  category_id: {
    type: ObjectId,
    ref: 'Category'
  },
  price: Number,
  discount: Number,
  size: Array,
  color: Array,
  pics: Array,
  stock: Number,
  sale_num: {
    type:Number,
    default: 0
  },
  description: String,
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