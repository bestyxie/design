var mongoose = require('mongoose');
var Product = require('../models/product');
var ShoppingCart = require('../models/shoppingcart');

// 加入购物车
module.exports.addToCart = function(req,res){
  var product = req.body;
  var _user = req.session.user;
  var product_name = '',product_url='';

  function getNameUrl(_id){
    var promise = Product.findOne({_id: _id},function(err,one_product){
      if(err){
        console.log(err);
      }else{
        // console.log(one_product);
        product_name = one_product.name;
        product_pics = one_product.pics;
      }
    });
    return promise;
  }

  function updateCartProducts(userId,products){
    ShoppingCart.where({userId: _user._id}).update({products: products},function(err){
      if(err){
        console.log(err);
        res_status(0)
      }else{
        res_status(1);
      }
    });
  }
  function res_status(status){
    res.json({success: status});
    return;
  }

  ShoppingCart.findOne({userId: _user._id},function(err,user){
    if(err){
      console.log(err);
      res_status(0);
      return;
    }
    var promise;
    if(!user){

      promise = getNameUrl(product.productId);

      promise.then(function(){
        var new_user = {}
        new_user.userId = _user._id;
        new_user.products = [];
        new_user.products.push({
          productId: product.productId,
          name: product_name,
          pics: product_url,
          price: product.price,
          qty: product.qty
        });

        var new_product = new ShoppingCart(new_user);
        new_product.save(function(err){
          if(err){
            console.log(err);
            res_status(0)
            return;
          }else{
            res_status(1)
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
        updateCartProducts(product.userId,products);
      }
      if(i == products.length){ //购物车没有 productId 为 product.productId的商品
        promise = getNameUrl(product.productId);
        promise.then(function(){

          user.products.push({
            productId: product.productId,
            name: product_name,
            pics: product_url,
            price: product.price,
            qty: product.qty
          });
          updateCartProducts(product.userId,products);
        })
      }

    }

  })
}

// 购物车页面
module.exports.shoppingCart = function(req,res){
  ShoppingCart.findOne({userId: user._id},function(err,goods){
    if(err){
      console.log(err);
      res.render('mobile/shoppingcart/',{
        products: []
      })
    }
    if(goods){
      res.render('shoppingcart',{
        products: goods.products
      });
    }else{
      res.render('shoppingcart',{
        products: []
      });
    }
  });
}

// 删除购物车商品
module.exports.deleteCart = function(req,res){
  var cartObj = req.body,
      productId = cartObj.productId,
      userId = cartObj.userId;
  ShoppingCart.findOne({ userId: userId},function(err,cart){
    if(err){
      console.log(err);
      res.json({success: false});
    }
    var products = cart.products,i = 0;
    for( i; i<products.length; i++ ){
      if(products[i].productId == productId){
        products.splice(i,1);
        break;
      }
    }
    if(products.length == 0){
      ShoppingCart.remove({userId: userId},function(err){
        if(err){
          console.log(err);
          res.json({success: false});
        }
        res.json({success: true})
        return;
      });
    }else{
      ShoppingCart.where({ userId: userId }).update({products: products},function(err){
        if(err){
          console.log(err);
          res.json({success: false});
        }
        res.json({success: true});
      });
    }
    
  });
}

// 立即购买
module.exports.buy = function(req,res){
  res.redirect('/');
}