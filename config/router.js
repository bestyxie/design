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

  // admin
  app.get('/admin',function(req,res){
    res.render('admin',{
      user: req.session.user
    });
  });
  app.post('/admin/new',Admin.new);
}