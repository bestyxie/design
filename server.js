var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var API = require('wechat-api');

var port = process.env.PORT || 80;
var app = express();
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/shop';

mongoose.connect(dbUrl);

var config = require('./config/default.json').wx;
var api = new API(config.app_id,config.app_secret);

app.set('views','./app/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser());
app.use(cookieSession({
  secret: 'shop',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));
app.use(function(req,res,next){
  var param = {
    debug: false,
    jsApiList: ['chooseWXPay','uploadImage','onMenuShareTimeline', 'onMenuShareAppMessage'],
    url: req.body.url
  };
  // api.getTicket(function(err,result){
  //   console.log(err);
  //   console.log(result);
  // });
  api.getJsConfig(param,function(err,result){
    res.send(result);
  })
})

require('./config/router.js')(app);

app.listen(port);