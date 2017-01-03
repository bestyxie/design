let mongoose = require('mongoose');
let Product = require('../models/product');
let ShoppingCart = require('../models/shoppingcart');
let weixin  = require('./weixin');

// 加入购物车
module.exports.addToCart = (req,res) => {
  let product = req.body;
  let _user = req.session.user;
  let product_name = '',product_url='';
  let productMsg = {};

  function getNameUrl(_id){
    var promise = Product.findOne({_id: _id},function(err,one_product){
      if(err){
        console.log(err);
      }else{
        // console.log(one_product);
        productMsg = {
          productId: one_product._id,
          name: one_product.name,
          pics: one_product.pics,
          color: product.color,
          size: product.size,
          price: one_product.price,
          qty: product.qty
        }
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
        var new_user = {};
        new_user.userId = _user._id;
        new_user.products = [];
        new_user.products.push(productMsg);

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
          if(products[i].color == product.color && products[i].size == product.size){
            products[i].qty += parseInt(product.qty);
            updateCartProducts(product.userId,products);
          }
          break;
        }
      }
      if(i == products.length){ //购物车没有 productId 为 product.productId的商品
        promise = getNameUrl(product.productId);
        promise.then(function(){

          user.products.push(productMsg);
          updateCartProducts(product.userId,products);
        })
      }

    }
  })
}

// 购物车页面
module.exports.shoppingCart = (req,res) => {
  var user = req.session.user;
  var code = req.query.code;

  var promise = weixin.getAccesstoken(code);
  promise.then(function(openid){
    weixin.getUserinfo(openid);
  })

  ShoppingCart.findOne({userId: user._id},function(err,goods){
    var products = [];
    if(err){
      console.log(err);
    }
    if(goods){
      products = goods.products;
    }
    res.render('mobile/shoppingcart/',{
      products: products
    });
  });
}

// 删除购物车商品
module.exports.deleteCart = (req,res) => {
  var cartObj = req.body,
      productId = cartObj.id,
      userId = req.session.user._id;
  ShoppingCart.findOne({ userId: userId},function(err,cart){
    if(err){
      console.log(err);
      res.json({success: false});
    }
    var products = cart.products,i = 0;
    for( i; i<products.length; i++ ){
      if(products[i]._id == productId){
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
module.exports.buy = (req,res) => {
  res.redirect('/');
}