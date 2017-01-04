let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var accessSchema = new Schema({
  refresh_token: String
});

module.exports = accessSchema;