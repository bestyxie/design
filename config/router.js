var User = require('../app/controllers/user');
var Admin = require('../app/controllers/admin');
var Product = require('../app/controllers/product');
var ShoppingCart = require('../app/controllers/shoppingCart');
var Category = require('../app/controllers/category');
var Token = require('../app/controllers/token');
// var UploadPic = require('../app/controllers/uploadPic');


var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/images/upload');
  },
  filename: function(req,file,cb){
    var fileFormat = (file.originalname).split('.');
    cb(null,file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + '.' + fileFormat[fileFormat.length-1])
  }
})
var upload = multer({ storage: storage });

module.exports = function(app){

  // pre handle user
  app.use(function(req,res,next){
    var _user = req.session.user;
    if(_user){
      app.locals.user = _user;
    }
    next();
  });

  // product
  app.get('/',Product.list);
  app.get('/details/:id',Product.detail);
  app.post('/product/delete',Product.delete);
  app.post('/admin/product/new',upload.array('pics',8),Product.new);
  app.post('/admin/product/update',upload.array('pics',8),Product.updateproduct);

  // shopping cart management
  app.post('/product/addtocart',ShoppingCart.addToCart);
  // app.get('/cart',User.signinRequire, ShoppingCart.shoppingCart);
  app.get('/cart',ShoppingCart.shoppingCart);
  app.post('/cart/delete',ShoppingCart.deleteCart);

  // user
  app.get('/login',User.login);
  app.get('/logup',User.logup);
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/logout',User.logout);
  app.get('/mobile/login',User.mlogin)

  // admin
  app.get('/admin',User.signinRequire, User.adminRequire, Admin.admin);
  app.get('/admin/user/list',User.signinRequire, User.adminRequire, User.list);
  app.post('/user/delete',User.delete);
  app.post('/user/changerole',User.change);
  app.get('/admin/product/:id',Product.editproduct);
  app.get('/admin/category',Category.category);
  app.post('/admin/category/new',Category.new);

  // wechat test token
  app.get('/token',Token.token);
}