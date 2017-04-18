var Product = require('../models/product');

// admin page
module.exports.admin = function(req,res){
  Product.find({}).sort({'meta.updateAt': -1}).exec(function(err,products){
    res.render('admin/product_management/',{
      products: products
    });
  });
}