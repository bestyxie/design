// 暂时无用

var request = require('request');
var config = require('../../config/default.json');

function getUser(code){
  var app_id = config.wx.app_id,
      app_secret = config.wx.app_secret;
  var tokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+app_id+"&secret="+app_secret;
  request.get(tokenUrl,function(err,res,body){
    if(!err && res.statusCode == 200) {
      var access_token = JSON.parse(body).access_token;
      var infoUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid='+
    }
  })
}