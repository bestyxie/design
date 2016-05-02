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
  var new_user = {};

  ShoppingCart.findOne({userId: product.userId},function(err,user){
    if(err){
      console.log(err);
      res.json({success: 0});
    }
    if(!user || user.length<=0){
      new_user.userId = product.userId;
      new_user.products = [];
      new_user.products.push({
        productId: product.productId,
        name: '',
        url: '',
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
    }
    else{
      var products = user.products;
      var i = 0;

      for(i; i<products.length; i++){
        if(products[i].productId == product.productId){
          products[i].qty += parseInt(product.productId);
          break;
        }
      }
      if(i == products.length){
        user.products.push({
          productId: product.productId,
          name: '',
          url: '',
          price: product.price,
          qty: product.qty
        })
      }

      ShoppingCart.where({userId: product.userId}).update({products: products},function(err){
        if(err){
          console.log(err);
          res.json({success: 0})
        }
      });
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
              .populate()
  // if(err){
  //     console.log(err);
  //     res.render('shoppingCart',{
  //       carts: []
  //     });
  //   }
  //   for(var i = 0;i<products.length;i++){
  //     Product.find({_id: products[i].productId})
  //           .populate()
  //   }
  //   carts.push(product[0]);
  //   a = product[0];
  //   console.log(a);
  //   res.render('shoppingCart',{
  //     carts: carts,
  //     user: user
  //   });
}