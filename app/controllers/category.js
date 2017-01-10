'use strict';

var Category = require('../models/category');

// Category list
module.exports.category = function (req, res) {
  Category.find({}, function (err, categories) {
    if (err) {
      console.log(err);
      res.redirect('/admin');
    }
    res.render('admin/category/category_list', {
      categories: categories
    });
  });
};

// new category
module.exports.new = function (req, res) {
  var new_label = req.body.category;

  Category.find({ name: new_label.name }, function (err, label) {
    if (err) {
      res.redirect('/admin/category');
      return;
    }
    if (label.length > 0) {
      res.redirect('/admin/category');
    } else {
      var _category = new Category(new_label);
      _category.save(function (err) {
        if (err) {
          res.redirect('/admin/category');
        } else {
          res.redirect('/admin/category');
        }
      });
    }
  });
};

// 分类商品列表，手机端
module.exports.list = function (req, res) {
  Category.find({}, function (err, cg) {
    if (err) {
      console.log(err);
      res.json(null);
    }
    res.json(cg);
  });
};