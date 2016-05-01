var Product = require('../models/product');

module.exports.new = function(req,res){
  var new_product = req.body.product;

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
        res.redirect('/');
      });
    }
    else{
      console.log("product existed!");
      res.redirect('/admin');
    }
  })
}