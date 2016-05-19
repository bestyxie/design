var User = require('../app/controllers/user');
var Admin = require('../app/controllers/admin');
var Product = require('../app/controllers/product');


module.exports = function(app){

  // product
  app.get('/',Product.list);
  app.get('/details/:id',Product.detail);
  app.post('/product/addtocart',Product.addToCart);
  app.get('/cart',User.signinRequire, Product.shoppingCart);
  app.post('/cart/delete',Product.deleteCart);

  // user
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/logout',User.logout);

  // admin
  app.get('/admin',User.signinRequire, User.adminRequire, Admin.admin);
  app.post('/admin/new',Admin.new);
  app.get('/admin/user/list',User.signinRequire, User.adminRequire, User.list);
  app.post('/user/delete',User.delete);
  app.post('/user/changerole',User.change);
}