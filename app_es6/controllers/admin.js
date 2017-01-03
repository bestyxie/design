var Product = require('../models/product');

// admin page
module.exports.admin = function(req,res){
  Product.find({},function(err,products){
    res.render('admin/product_management/',{
      products: products
    });
  });
}