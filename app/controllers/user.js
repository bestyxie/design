var User = require('../models/user');
// 注册
module.exports.signup = function(req,res){
  var _user = req.body.user;
  User.findOne({name: _user.name}, function(err,user){
    if(err){
      console.log(err);
    }
    console.log(typeof(user));
    if(!user){
      var user = new User(_user);
      user.save(function(err,user){
        if(err){
          console.log(err);
        }
        res.redirect("/");
        req.session.user = user;
      });
    }
    else if(user.length>0){
      res.redirect('/signin');
    }
  });
}
// 登录
module.exports.signin = function(req,res){
  var _user = req.body.user;

  User.findOne({name: _user.name},function(err,user){
    if(err){
      return console.log(err);
    }
    if(!user){
      res.redirect('/');
    }
    else if(user.name === _user.name && user.password === _user.password){
      req.session.user = user;
      res.redirect('/');
    }else{
      console.log("password is not matched!");
      res.redirect('/');
    }
  })
}
// 注销
module.exports.logout = function(req,res){
  req.session.user = null;

  res.redirect('/');
}