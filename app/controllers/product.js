var mongoose = require('mongoose');
var Product = require('../models/product');
var ShoppingCart = require('../models/shoppingcart');

// product list || home
module.exports.list = function(req,res){
  Product.find({},function(err,products){
    res.render('home',{
      user: req.session.user,
      products: products
    });
  });
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
      user: req.session.user
    });
  });
}

// 加入购物车
module.exports.addToCart = function(req,res){
  var product = req.body;
  var new_user = {},name = '',url='';

  function getNameUrl(_id){
    var promise = Product.findOne({_id: _id},function(err,one_product){
      if(err){
        console.log(err);
        return;
      }
      name = one_product.name;
      url = one_product.url;
    });
    return promise;
  }

  function updateCartProducts(userId,products){
    ShoppingCart.where({userId: product.userId}).update({products: products},function(err){
      if(err){
        console.log(err);
        res.json({success: 0})
      }
    });
  }

  ShoppingCart.findOne({userId: product.userId},function(err,user){
    if(err){
      console.log(err);
      res.json({success: 0});
    }
    var promise;
    if(!user){

      promise = getNameUrl(product.productId);

      promise.then(function(){

        new_user.userId = product.userId;
        new_user.products = [];
        new_user.products.push({
          productId: product.productId,
          name: name,
          url: url,
          price: product.price,
          qty: product.qty
        })

        var new_product = new ShoppingCart(new_user);
        new_product.save(function(err){
          if(err){
            console.log(err);
            res.json({success: 0})
          }
        });
        
      })
    }
    else{
      var products = user.products;
      var i = 0;

      for(i; i<products.length; i++){
        if(products[i].productId == product.productId){
          products[i].qty += parseInt(product.qty);
          break;
        }
      }
      if(i == products.length){ //购物车没有 productId 为 product.productId的商品
        promise = getNameUrl(product.productId);
        promise.then(function(){
          user.products.push({
            productId: product.productId,
            name: name,
            url: url,
            price: product.price,
            qty: product.qty
          })
          console.log(name +' '+ url);
          updateCartProducts(product.userId,products);
        })
      }
      
      updateCartProducts(product.userId,products);
    }
    res.json({success: 1});
  })
}

// 购物车页面
module.exports.shoppingCart = function(req,res){
  var user = req.session.user;
  var carts = [];
  var a;
  ShoppingCart.find({userId: user._id})
              .populate('products[0].name','name')
              .populate('products[0].url','url')
              .exec(function(err,carts){
                if(err){
                  console.log(err);
                  res.render('shoppingcart',{
                    carts: [],
                    user: user
                  })
                }
                console.log(carts);
                res.render('shoppingcart',{
                  carts: carts,
                  user: user
                });
              });
}