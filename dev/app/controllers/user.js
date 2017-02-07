let User = require('../models/user');
let qs = require('querystring');
import {base_set,ANCHOR,base_url} from './weixin';

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
        res.redirect("/admin");
      });
    }
    else if(user.length>0){
      res.redirect('/login');
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
    console.log(user);
    if(!user){
      res.redirect('/');
      return;
    }
    user.comparePassword(_user.password,function(isMatch){
      console.log(isMatch);
      if(isMatch){
        req.session.user = user;
        res.redirect('/admin');
      }
      else{
        res.redirect('/login');
      }
    })
    // else if(user.name === _user.name && user.password === _user.password){
    //   req.session.user = user;
    //   res.redirect('/admin');
    // }else{
    //   console.log("password is not matched!");
    //   res.redirect('/login');
    // }
  })
}
// 手机登陆
module.exports.mlogin = function(req,res){
  res.render('mobile/login/')
}

//登录页面
module.exports.login = function(req,res){
  res.render('admin/login',{
    page: 'login'
  });
}
// 注册页面
module.exports.logup = function(req,res){
  res.render('admin/login',{
    page: 'logup'
  });
}

// 注销
module.exports.logout = function(req,res){
  req.session.user = null;

  res.redirect('/login');
}

// mobile端必须登录midware
module.exports.msigninRequire = (req,res,next) =>{
  if(req.session.user){
    next();
  }
  // else {
  //   res.redirect('/mobile/login');
  // }
  base_set.scope="snsapi_userinfo";
  base_set.redirect_uri = encodeURIComponent('http://bestyxie.cn/mobile/login');
  let snsapi_base = base_url+qs.stringify(base_set)+ANCHOR;
  console.log(snsapi_base)
  res.redirect(snsapi_base);
}

// 必须登录 midware
module.exports.signinRequire = function(req,res,next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/login');
  }
}

// administor require midware
module.exports.adminRequire = function(req,res,next){
  var user = req.session.user;
  if(user.role > 10){
    next();
  }
  else{
    res.redirect('/login');
  }
}

// user list page
module.exports.list = function(req,res){
  User.find({},function(err,users){
    if(err){
      console.log('查询用户出错');
      res.redirect('/');
    }
    res.render('admin/user_management/userlist',{
      users: users
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

// 用户主页
module.exports.homepage = function(req,res){
  let user_id = req.session.user._id;
  User.findOne({_id: user_id},(err,user) => {
    if(err){
      console.log(err);
      res.send(err);
    }

    res.render('mobile/user/',{
      user: user
    });
  })
}