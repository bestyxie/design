'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');

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

UserSchema.pre('save', function (next) {
  var user = this;
  var md5 = crypto.createHash('md5');

  md5.update(this.password);
  user.password = md5.digest('hex');
  next();
});

UserSchema.methods = {
  comparePassword: function comparePassword(_password, cb) {
    var password,
        isMatch = false;
    var md5 = crypto.createHash('md5');
    md5.update(_password);
    _password = md5.digest('hex');
    console.log(_password);
    if (this.password === _password) {
      isMatch = true;
    }
    cb(isMatch);
  }
};

module.exports = UserSchema;