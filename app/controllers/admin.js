var Product = require('../models/product');

// admin page
module.exports.admin = function(req,res){
  Product.find({},function(err,products){
    res.render('admin/product_management',{
      products: products
    });
  });
}
// 新增商品
module.exports.new = function(req,res){
  var new_product = req.body.product;
  var files = req.files;
  
  new_product.url = "";

  files.forEach(function(file){
    var filename = (file.filename).toString();
    new_product.url = new_product.url+'/images/upload/'+filename+',';
  });
  new_product.url = new_product.url.substring(0,new_product.url.lastIndexOf(','));

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