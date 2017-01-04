let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var accessSchema = new Schema({
  access_token: String
});

module.exports = accessSchema;