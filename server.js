var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

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