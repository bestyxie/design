var mongoose = require('mongoose');

var ManagerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  pwd: String,
  role: {
    type: Number,
    default: 10
  }
}) 