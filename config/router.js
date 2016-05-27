var User = require('../app/controllers/user');
var Admin = require('../app/controllers/admin');
var Product = require('../app/controllers/product');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/images/upload');
  },
  filename: function(req,file,cb){
    var fileFormat = (file.originalname).split('.');
    cb(null,file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length-1])
  }
})
var upload = multer({
  storage: storage
});


module.exports = function(app){

  // product
  app.get('/',Product.list);
  app.get('/details/:id',Product.detail);
  app.post('/product/addtocart',Product.addToCart);
  app.get('/cart',User.signinRequire, Product.shoppingCart);
  app.post('/cart/delete',Product.deleteCart);

  // user
  app.get('/login',User.login);
  app.get('/logup',User.logup);
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/logout',User.logout);

  // admin
  app.get('/admin',User.signinRequire, User.adminRequire, Admin.admin);
  app.post('/admin/new',upload.single('picture'),Admin.new);
  app.get('/admin/user/list',User.signinRequire, User.adminRequire, User.list);
  app.post('/user/delete',User.delete);
  app.post('/user/changerole',User.change);
}