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

  if (code && state == 'base') {
    var promise = (0, _weixin.getAccesstoken)(code);
    promise.then(function (openid) {
      _wcuser.Wcuser.find({ openid: openid }, function (err, user) {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        if (user.length == 0) {
          authorize();
        } else {
          req.session.user = {};
          req.session.user._id = user._id;
          next();
        }
      });
    });
  } else if (state !== 'base') {
    console.log('state !== base');
    var _promise = (0, _weixin.getAccesstoken)(code);
    _promise.then(function (openid) {
      return (0, _weixin.getUserinfo)(openid);
    }).then(function (user) {
      console.log('user::', user);
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
        next();
      });
    });
  } else if (req.session.user) {
    next();
  }
  function authorize() {
    _weixin.base_set.scope = "snsapi_userinfo";
    _weixin.base_set.redirect_uri = encodeURI('http://bestyxie.cn/cart');
    var snsapi_base = _weixin.base_url + _querystring2.default.stringify(_weixin.base_set) + _weixin.ANCHOR;

    res.redirect(snsapi_base);
  }
};