let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var accessSchema = new Schema({
  access_token: String,
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = accessSchema;