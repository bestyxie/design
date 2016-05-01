var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String
});

module.exports = UserSchema;