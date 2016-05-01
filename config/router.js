var User = require('../app/controllers/user');
var Admin = require('../app/controllers/admin');
var Product = require('../app/models/product');

module.exports = function(app){
  app.get('/',function(req,res,next){
    Product.find({},function(err,products){
      console.log(products.length);
      res.render('home',{
        user: req.session.user,
        products: products
      });
    });
  });

  // user
  app.post('/user/signup',User.signup);
  app.post('/user/signin',User.signin);
  app.get('/logout',User.logout);
  app.get('/user/list',User.list);
  app.post('/user/delete',User.delete);
  app.post('/user/changerole',User.change);

  // admin
  app.get('/admin',User.signinRequire, Admin.admin);
  app.post('/admin/new',Admin.new);
}