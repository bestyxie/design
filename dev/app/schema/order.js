var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var OrderSchema = new Schema({
  user_id: ObjectId,
  contact_info: String,
  express: Number,
  status: String,
  express_info: String
});

module.exports = OrderSchema;