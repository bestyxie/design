var Category = require('../models/category');

// Category list
module.exports.category = function(req,res){
  Category.find({},function(err,categories){
    if(err){
      console.log(err);
      res.redirect('/admin');
    }
    res.render('admin/category/category_list',{
      categories: categories
    });
  })
}

// new category
module.exports.new = function(req,res){
  console.log(req.body.category);
}
