var User = require('../models/user');

// 注册
module.exports.signup = function(req,res){
  var _user = req.body.user;
  User.findOne({name: _user.name}, function(err,user){
    if(err){
      console.log(err);
    }
    if(!user){
      var user = new User(_user);
      user.save(function(err,user){
        if(err){
          console.log(err);
        }
        req.session.user = user;
        res.redirect("/");
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

// 必须登录
module.exports.signinRequire = function(req,res,next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/');
  }
}

// administor require
module.exports.adminRequire = function(req,res,next){
  var user = req.session.user;
  if(user.role > 10){
    next();
  }
  else{
    res.redirect('/');
  }
}

// user list page
module.exports.list = function(req,res){
  User.find({},function(err,users){
    if(err){
      console.log('查询用户出错');
      res.redirect('/');
    }
    res.render('userlist',{
      users: users,
      user: req.session.user
    });
  });
}

// delete user
module.exports.delete = function(req,res){
  var id = req.body.id;
  User.remove({_id: id},function(err){
    if(err){
      console.log(err);
      res.json({success: 0});
    }
    res.json({success: 1});
  });
}

// change user's role
module.exports.change = function(req,res){
  var _user = req.body;
  var role = parseInt(_user.role);

  User.where({_id: _user.id}).update({role: role},function(err){
    if(err){
      console.log(err);
      res.json({success: 0});
    }
    res.json({success: 1,role: _user.role});
  });
}