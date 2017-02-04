'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var EvaluationSchema = new Schema({
  product_id: ObjectId,
  user_id: ObjectId,
  content: String,
  grade: String,
  // 好评，中评，差评
  imgs: String,
  createAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = EvaluationSchema;