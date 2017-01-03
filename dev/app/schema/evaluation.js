var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var EvaluationSchema = new Schema({
  product_id: ObjectId,
  user_id: ObjectId,
  content: String,
  imgs: [String]
})