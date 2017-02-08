let AccessToken = require('../models/access_token');
let fs = require('fs');
let path = require('path');
let request = require('request');
let config = require('../../config/default.json');

let wx = config.wx;
const APP_ID = wx.app_id,
    REDIRECT_URI = encodeURI('http://bestyxie.cn/cart');
const ANCHOR = '#wechat_redirect';

let base_set = {
  appid: APP_ID,
  redirect_uri: '',
  response_type: 'code',
  scope: 'snsapi_base',
  state: '123'
}

// let snsapi_userinfo = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+APP_ID+"&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
// let snsapi_base = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect"

let base_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
let getAccesstoken = (code) =>{
  const APPID = config.wx.app_id,
        APP_SECRET = config.wx.app_secret;
  let tokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+APPID+"&secret="+APP_SECRET+"&code="+code+"&grant_type=authorization_code ";

  return new Promise((resolve,reject)=> {
    request.get(tokenUrl,req);//request
    function req(err,res,body){
      if(!err && res.statusCode == 200) {
        if(!body.errcode){
          let data = JSON.parse(body);
          let access_token = data.access_token;
          let refresh_token = data.refresh_token;
          let openid = data.openid;

          resolve({openid: openid,access_token: access_token});
        }else{
          tokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+APPID+"&secret="+APP_SECRET+"&code="+code+"&grant_type=authorization_code ";
          console.log('access_token 过期！！！');
          request.get(tokenUrl,req);
          // reject();
        }
      }
    }
  });
}

let getUserinfo = (openid,access_token) => {
  let promise = new Promise((resolve,reject) => {
    let infoUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid;
    request.get(infoUrl,function(err,res,body){
      resolve(JSON.parse(body));
    });
  });
  return promise;
}

export {base_set,ANCHOR,base_url,getAccesstoken,getUserinfo};
