var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var port = process.env.PORT || 80;
var app = express();
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/shop';

mongoose.connect(dbUrl);

app.set('views','./app/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser());
app.use(cookieParser());
app.use(cookieSession({
  secret: 'shop',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

require('./config/router.js')(app);

app.listen(port);