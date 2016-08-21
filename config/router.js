var User = require('../app/controllers/user');
var Admin = require('../app/controllers/admin');
var Product = require('../app/controllers/product');
var ShoppingCart = require('../app/controllers/shoppingCart');
var UploadPic = require('../app/controllers/uploadPic');
var Category = require('../app/controllers/category');


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
  app.post('/admin/product/new',UploadPic.upload.array('picture',8),Product.new);

  // shopping cart management
  app.post('/product/addtocart',ShoppingCart.addToCart);
  app.get('/cart',User.signinRequire, ShoppingCart.shoppingCart);
  app.post('/cart/delete',ShoppingCart.deleteCart);

  // user
  app.get('/login',User.login);
  app.get('/logup',User.logup);
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/logout',User.logout);

  // admin
  app.get('/admin',User.signinRequire, User.adminRequire, Admin.admin);
  app.get('/admin/user/list',User.signinRequire, User.adminRequire, User.list);
  app.post('/user/delete',User.delete);
  app.post('/user/changerole',User.change);
  app.get('/admin/product',Product.editproduct);
  app.get('/admin/category',Category.category);
  app.post('/admin/category/new',Category.new);
}