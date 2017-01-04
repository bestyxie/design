'use strict';

// 暂时无用

var fs = require('fs');
var path = require('path');
var request = require('request');
var config = require('../../config/default.json');

module.exports.getAccesstoken = function (code) {
  var app_id = config.wx.app_id,
      app_secret = config.wx.app_secret;
  var tokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + app_id + "&secret=" + app_secret + "&code=" + code + "&grant_type=authorization_code ";
  console.log(code);
  return new Promise(function (resolve) {
    request.get(tokenUrl, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        var data = JSON.parse(body);
        var access_token = data.access_token;
        var openid = data.openid;

        fs.writeFile(path.join(__dirname, "access_token.txt"), access_token, function (err) {
          if (err) {
            console.log('save access_token err!!!');
            throw err;
          }
        });

        return openid;
      }
    });
  });
};

module.exports.getUserinfo = function (openid) {
  var access_token = '';
  fs.readFile(path.join(__dirname, 'access_token.txt'), { encoding: 'utf-8' }, function (err, data) {
    if (err) throw err;
    access_token = data;
    var infoUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid;
    request.get(infoUrl, function (err, res, body) {
      console.log(res, "::", body);
    });
  });
};

var wx = config.wx;
var APP_ID = wx.app_id,
    APP_SECRET = wx.app_secret,
    SCOPE = 'snsapi_userinfo',
    REDIRECT_URI = encodeURIComponent('http://bestyxie.cn/cart');

var auth_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APP_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=" + SCOPE + "&state=123#wechat_redirect";

module.exports.auth_url = auth_url;