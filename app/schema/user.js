var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: normal user
  // 1: verified user
  // 2: professional user

  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  }
});

module.exports = UserSchema;