var mongoose = require('mongoose');

var LabelSchema = new mongoose.Schema({
  name:{
    type: String,
    unique: true
  }
});

module.exports = LabelSchema;