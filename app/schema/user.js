var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

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

  if(this.isNew){
  }
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err){
      return next(err)
    }
    bcrypt.hash(user.password,salt,function(err,hash){
      if(err) return next(err);

      user.password = hash;
      next();
    })
  })
})

module.exports = UserSchema;