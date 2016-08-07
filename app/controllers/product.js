var mongoose = require('mongoose');
var Product = require('../models/product');
var ShoppingCart = require('../models/shoppingcart');

// var OAuth = require('wechat-oauth');
// var config = require('config');
// var API = require('wechat-api');
// var menu_config = config.get('wx.wx_menu');
// var app_id = config.get('wx.app_id');
// var app_secret = config.get('wx.app_secret');
// // 配置
// var api = new API(app_id,app_secret);

// var client = new OAuth(app_id,app_secret);

// product list || home
module.exports.list = function(req,res){

  // var url = client.getAuthorizeURL('http://127.0.0.1:3000/weixin/callback','','snsapi_userinfo');
  // function apps(){
  // api.createMenu(menu_config,function(err,result){
  //     console.log(result);
  //   });
  // }
  // apps();
  // console.log(app_id+ ","+app_secret);
  // console.log(url);
  Product.find({}).sort({'meta.updateAt':-1}).exec(function(err,products){
    res.render('home',{
      products: products
    });
  })
}

// 商品详情页
module.exports.detail = function(req,res){
  var product_id = req.params.id;
  Product.findOne({_id: product_id},function(err,product){
    if(err){
      console.log(err);
      res.redirect('/');
    }
    res.render('details',{
      product: product,
    });
  });
}

// 删除商品
module.exports.delete = function(req,res){
  var product_id  = req.body._id;
  Product.remove({_id: product_id},function(err){
    if(err){
      console.log(err);
      res.json( {success: 0} );
    }

    res.json( {success: 1} );
  })
}

// 编辑商品
module.exports.editproduct = function(req,res){
  res.render('admin/product_edit');
}