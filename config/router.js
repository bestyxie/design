var User = require('../app/controllers/user');
var Admin = require('../app/controllers/admin');
var Product = require('../app/controllers/product');
var ShoppingCart = require('../app/controllers/shoppingCart');
var Category = require('../app/controllers/category');
var Token = require('../app/controllers/token');
var Activity = require('../app/controllers/activity');
var Order = require('../app/controllers/order');
var Address = require('../app/controllers/address');
var Evaluation = require('../app/controllers/evaluation');
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
  app.get('/product',Product.query);
  app.post('/admin/product/new',upload.array('pics',8),Product.new);
  app.post('/admin/product/update',upload.array('pics',8),Product.updateproduct);
  app.get('/admin/product',Product.getProduct);

  // shopping cart management
  app.post('/product/addtocart',ShoppingCart.addToCart);
  app.get('/cart',User.msigninRequire, ShoppingCart.shoppingCart);
  // app.get('/cart',ShoppingCart.shoppingCart);
  app.post('/cart/delete',ShoppingCart.deleteCart);

  // user
  app.get('/login',User.login);
  app.get('/logup',User.logup);
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/logout',User.logout);
  app.get('/mobile/login',User.mlogin);
  app.get('/user/home',User.signinRequire,User.homepage);

  // address
  app.post('/address/add',Address.add);
  app.post('/address/update',Address.update);
  app.get('/address/get',Address.getAddr);
  app.get('/address/delete',Address.remove);
  app.get('/order/list',Address.addr_list);

  // admin
  app.get('/admin',User.signinRequire, User.adminRequire, Admin.admin);
  app.get('/admin/user/list',User.signinRequire, User.adminRequire, User.list);
  app.post('/user/delete',User.delete);
  app.post('/user/changerole',User.change);
  app.get('/admin/product/:id',Product.editproduct);

  app.get('/admin/category',Category.category);
  app.post('/admin/category/new',Category.new);
  app.get('/categories',Category.list);

  // wechat test token
  app.get('/token',Token.token);

  // activity
  app.get('/admin/activity',Activity.list);
  app.get('/admin/activity/detail',Activity.new_act_page);
  app.post('/admon/activity/new',upload.array('pic',1),Activity.new_act);
  app.post('/admin/activity/delet',Activity.delet_act);
  app.post('/admin/activity/update',Activity.update_act);
  app.get('/admin/activity/product',Activity.get_act_products);
  app.get('/activity/:id',Product.act_prod);

  // order
  app.post('/order/create',Order.create_order);
  app.post('/order/submit',Order.submit_order);
  app.get('/order',Order.order_list);
  app.get('/admin/delivery',Order.getAll_paid);
  app.post('/admin/order/update',Order.update);

  // evaluation
  app.get('/evaluate/submit',Evaluation.submit);
}