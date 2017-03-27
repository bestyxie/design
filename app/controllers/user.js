'use strict';

var User = require('../models/user');
var qs = require('querystring');

// 注册
module.exports.signup = function (req, res) {
  var _user = req.body;
  User.findOne({ name: _user.name }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      var user = new User(_user);
      user.save(function (err, user) {
        if (err) {
          console.log(err);
        }
        req.session.user = user;
        res.json({
          errcode: 200,
          msg: '注册成功'
        });
      });
    } else if (user) {
      res.json({ errcode: 422, msg: '用户已经存在' });
    }
  });
};

// 登录
module.exports.signin = function (req, res) {
  var _user = req.body;
  User.findOne({ name: _user.name }, function (err, user) {
    if (err) {
      console.log(err);
      return;
    }
    if (!user) {
      res.json({
        errcode: 422,
        msg: '用户不存在'
      });
      return;
    }
    user.comparePassword(_user.password, function (isMatch) {
      if (isMatch) {
        req.session.user = user;
        res.json({
          errcode: 200,
          msg: '登录成功'
        });
      } else {
        res.json({
          errcode: 422,
          msg: '用户密码错误'
        });
      }
    });
  });
};
// 手机登陆
module.exports.mlogin = function (req, res) {
  res.render('mobile/login/');
};

//登录页面
module.exports.login = function (req, res) {
  res.render('admin/login', {
    page: 'login'
  });
};
// 注册页面
module.exports.logup = function (req, res) {
  res.render('admin/login', {
    page: 'logup'
  });
};

// 注销
module.exports.logout = function (req, res) {
  req.session.user = null;

  res.redirect('/login');
};

// 必须登录 midware
module.exports.signinRequire = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// administor require midware
module.exports.adminRequire = function (req, res, next) {
  var user = req.session.user;
  if (user.role > 10) {
    next();
  } else {
    res.redirect('/login');
  }
};

// user list page
module.exports.list = function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      console.log('查询用户出错');
      res.redirect('/');
    }
    res.render('admin/user_management/userlist', {
      users: users
    });
  });
};

// delete user
module.exports.delete = function (req, res) {
  var id = req.body.id;
  User.remove({ _id: id }, function (err) {
    if (err) {
      console.log(err);
      res.json({ success: 0 });
    }
    res.json({ success: 1 });
  });
};

// change user's role
module.exports.change = function (req, res) {
  var _user = req.body;
  var role = parseInt(_user.role);

  User.where({ _id: _user.id }).update({ role: role }, function (err) {
    if (err) {
      console.log(err);
      res.json({ success: 0 });
    }
    res.json({ success: 1, role: _user.role });
  });
};