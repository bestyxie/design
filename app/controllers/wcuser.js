'use strict';

var _wcuser = require('../models/wcuser');

var _weixin = require('./weixin');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mobile端必须登录midware
module.exports.msigninRequire = function (req, res, next) {
  var code = req.query.code;
  var state = req.query.state;

  if (code && state == 'base' && !req.session.user) {
    var promise = (0, _weixin.getAccesstoken)(code);
    promise.then(function (result) {
      _wcuser.Wcuser.findOne({ openid: result.openid }, function (err, user) {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        if (user == null || user.length == 0) {
          authorize();
        } else {
          req.session.user = {};
          req.session.user._id = user._id;
          req.session.user.openid = user.openid;
          // cookie
          res.cookie('openid', user.openid, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), httpOnly: true });
          next();
        }
      });
    });
  } else if (state !== 'base' && !req.session.user) {
    var _promise = (0, _weixin.getAccesstoken)(code);
    _promise.then(function (result) {
      return (0, _weixin.getUserinfo)(result.openid, result.access_token);
    }).then(function (user) {
      var new_user = {};
      new_user.openid = user.openid;
      new_user.nickname = user.nickname;
      new_user.headimgurl = user.headimgurl;

      var _user = new _wcuser.Wcuser(new_user);
      _user.save(function (err, wc) {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        req.session.user = {};
        req.session.user._id = wc._id;
        req.session.user.openid = wc.openid;
        // cookie
        res.cookie('openid', wc.openid, { expires: new Date(Date.now() + 60 * 60 * 24 * 365), httpOnly: true });

        next();
      });
    });
  } else if (req.session.user) {
    next();
  } else if (!req.session.user) {
    authorize();
  }
  function authorize() {
    var path = req.path;
    _weixin.base_set.scope = "snsapi_userinfo";
    _weixin.base_set.redirect_uri = encodeURI('http://bestyxie.cn' + path);
    var snsapi_base = _weixin.base_url + _querystring2.default.stringify(_weixin.base_set) + _weixin.ANCHOR;

    res.redirect(snsapi_base);
  }
};

// 用户主页
module.exports.homepage = function (req, res) {
  var user_id = req.session.user._id;
  _wcuser.Wcuser.findOne({ _id: user_id }, function (err, user) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/user/', {
      user: user
    });
  });
};