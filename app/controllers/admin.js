var Product = require('../models/product');

// admin page
module.exports.admin = function(req,res){
  res.render('admin/product_management',{
    // user: req.session.user
  });
}
// 新增商品
module.exports.new = function(req,res){
  var new_product = req.body.product;
  var files = req.files;
  
  new_product.url = "";
  console.log(files);
  // files.forEach(function(file){
  //   new_product.url = new_product + ','+file.filename;
  // });
  console.log(new_product.url);

  Product.findOne({name: new_product.name},function(err,product){
    if(err){
      return console.log(err);
    }
    if(!product || product.length<=0){
      var _product = new Product(new_product);
      _product.save(function(err){
        if(err){
          console.log(err);
          res.redirect('/admin');
        }
        res.redirect('/admin');
      });
    }
    else{
      console.log("product existed!");
      res.redirect('/admin');
    }
  })
}