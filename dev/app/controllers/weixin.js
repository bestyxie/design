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
    // AccessToken.find({},(err,access)=>{
    //   if(err){
    //     console.log(err);
    //     return;
    //   }
    //   if(access.length>0){
    //     let refresh_token = access.refresh_token;
    //     tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid='+APPID+'&grant_type=refresh_token&refresh_token='+refresh_token;
    //   }

    //   // console.log(tokenUrl);
    // });
    request.get(tokenUrl,req);//request
    function req(err,res,body){
      console.log("body::",body);
      if(!err && res.statusCode == 200) {
        if(!body.errcode){
          let data = JSON.parse(body);
          let access_token = data.access_token;
          let refresh_token = data.refresh_token;
          let openid = data.openid;

          if(tokenUrl.indexOf('code')>=0){
            AccessToken.remove({},() =>{
              var new_access = new AccessToken({
                refresh_token: refresh_token
              });
              new_access.save((err) => {})
            });
          }
          resolve(openid,access_token);
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

let getUserinfo = (openid) => {
  let access_token = '';

  let promise = new Promise((resolve,reject) => {
    AccessToken.find({},(err,access) => {
      if(err){
        reject();
      }
      access_token = access.access_token;
      let infoUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid='+openid;
      request.get(infoUrl,function(err,res,body){
        resolve(body);
      })
    });
  });
  return promise;
}

export {base_set,ANCHOR,base_url,getAccesstoken,getUserinfo};
