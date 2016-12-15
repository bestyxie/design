var mongoose = require('mongoose');
var Product = require('../models/product');
var ShoppingCart = require('../models/shoppingcart');
var Category = require('../models/category');

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
    res.render('mobile/home/',{
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
    res.render('mobile/product_details/',{
      product: product
    });
  });
}

// 新增商品
module.exports.new = function(req,res){
  var new_product = req.body.product;
  var files = req.files;

  new_product.pics = files.map(function(item){
    return '/images/upload/'+item.filename
  });

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
  var product_id = req.params.id,pd;
  var promise = Product.find({_id: product_id}).exec();
  promise.then(function(product){
    pd = product[0];
    return Category.find({},{name: 1,_id: 0}).exec()
  }).then(function(categories){
    res.render('admin/product_management/product_edit',{
      product: pd,
      categories: categories
    });
  })
}

// 更新商品
module.exports.updateproduct = function(req,res){
  var product = req.body.product;
  var files = req.files;
  var deletepic = product.deletepic.split(' ').slice(0,-1);

  var pic_list = [];
  var promise = Product.find({_id: product._id}).exec();
  promise.then(function(thispro){
    thispro = thispro[0]
    var pics = thispro.pics;

    pic_list = thispro.pics.map(function(img,index){
      if(deletepic.indexOf(index+'')<0){
        return img;
      }
    });

    for(var i = 0;i<files.length;i++){
      pic_list.push('/images/upload/'+files[i].filename);
    }

    product.pics = pic_list;
    for(item in product){
      thispro[item] = product[item];
      console.log(thispro[item],product[item])
    }

    console.log(product);
    thispro.save(function(err){
      if(err){
        console.log(err);
        res.redirect('/admin/product/'+product._id);
      }
      res.redirect('/admin/product/'+product._id);
    })

  })
}