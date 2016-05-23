var mongoose = require('mongoose');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

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

UserSchema.pre('save',function(next){
  var user = this;
  
  md5.update(this.password);
  // console.log(md5.digest('hex'));
  user.password = md5.digest('hex');
  next();
})

module.exports = UserSchema;