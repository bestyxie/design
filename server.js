var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

// wechat
// var API = require('wechat-api');
// var config = require('config');
// var menu_config = config.get('wx.wx_menu');
// var app_id = config.get('wx.app_id');
// var app_secret = config.get('wx.app_secret');

// // 配置
// var api = new API(app_id,app_secret);
// // 测试
// function apps(){
//   api.createMenu(menu_config,function(err,result){
//     console.log(result);
//   });
// }
// apps();

app.set('views','./app/views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser());
app.use(cookieSession({
  secret: 'shop'
}));

mongoose.connect('mongodb://localhost/shop');

require('./config/router.js')(app);

app.listen(port);