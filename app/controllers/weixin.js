'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AccessToken = require('../models/access_token');
var fs = require('fs');
var path = require('path');
var request = require('request');
var config = require('../../config/default.json');

var wx = config.wx;
var APP_ID = wx.app_id,
    REDIRECT_URI = encodeURIComponent('http://bestyxie.cn/cart');
var ANCHOR = '#wechat_redirect';

var base_set = {
  appid: APP_ID,
  scope: 'snsapi_base',
  redirect_uri: '',
  response_type: 'code'
};

// let snsapi_userinfo = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APP_ID+"&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
// let snsapi_base = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect"

var base_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
var getAccesstoken = function getAccesstoken(code) {
  var APPID = config.wx.app_id,
      APP_SECRET = config.wx.app_secret;
  var tokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + APP_SECRET + "&code=" + code + "&grant_type=authorization_code ";

  return new Promise(function (resolve, reject) {
    AccessToken.find({}, function (err, access) {
      if (err) {
        console.log(err);
        return;
      }
      if (access.length > 0) {
        var refresh_token = access.refresh_token;
        tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + APPID + '&grant_type=refresh_token&refresh_token=' + refresh_token;
      }

      request.get(tokenUrl, req); //request
      function req(err, res, body) {
        if (!err && res.statusCode == 200) {
          if (!body.errcode) {
            (function () {
              var data = JSON.parse(body);
              var access_token = data.access_token;
              var refresh_token = data.refresh_token;
              var openid = data.openid;

              if (tokenUrl.indexOf('code') >= 0) {
                AccessToken.remove({}, function () {
                  var new_access = new AccessToken({
                    refresh_token: refresh_token
                  });
                  new_access.save(function (err) {});
                });
              }
              resolve(openid);
            })();
          } else {
            tokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + APP_SECRET + "&code=" + code + "&grant_type=authorization_code ";
            console.log('refresh_token 过期！！！');
            request.get(tokenUrl, req);
            // reject();
          }
        }
      }
    });
  });
};

var getUserinfo = function getUserinfo(openid) {
  var access_token = '';

  var promise = new Promise(function (resolve, reject) {
    AccessToken.find({}, function (err, access) {
      if (err) {
        reject();
      }
      access_token = access.access_token;
      var infoUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid;
      request.get(infoUrl, function (err, res, body) {
        resolve(body);
      });
    });
  });
  return promise;
};

exports.base_set = base_set;
exports.ANCHOR = ANCHOR;
exports.base_url = base_url;
exports.getAccesstoken = getAccesstoken;
exports.getUserinfo = getUserinfo;