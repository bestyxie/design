import mongoose from 'mongoose';
import Product from '../models/product';
import ShoppingCart from '../models/shoppingcart';
import Category from '../models/category';
import elasticsearch from 'elasticsearch';
import {makebulk, indexall, create_doc} from '../search/bulkIndex';
import {create} from '../search/createIndex';
import {search} from '../search/search';
import {esClient} from '../search/client';
import {delete_doc} from '../search/delete_document';
import {update_doc} from '../search/update_document';
// let qs = require('querystring');
// import {base_set,ANCHOR,base_url} from './weixin';


// product list || home
module.exports.list = function(req,res){
  // base_set.scope="snsapi_base";
  // base_set.redirect_uri = encodeURIComponent('http://bestyxie.cn');
  // let snsapi_base = base_url+qs.stringify(base_set)+ANCHOR;
  // console.log(snsapi_base)

  // if(req.session.user){
  //   snsapi_base = false;
  // }
  // console.log(weixin.auth_url);
  Product.find({}).sort({'meta.updateAt':-1}).exec(function(err,products){
    res.render('mobile/home/',{
      products: products,
      // auth_url: snsapi_base
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
        create_doc(_product,res => {
          console.log(res);
        })
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
    delete_doc(product_id);
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
  product.labels = product.labels.split(' ');
  if(product.labels.length == 1 && product.labels[0] == ''){
    product.labels = [];
  }
  else if(product.labels[0] == ''){
    product.labels.splice(0,1);
    console.log(product.labels);
  }

  var pic_list = [];
  var promise = new Promise((resolve,reject) => {
    Product.find({_id: product._id},(err,prod) => {
      if(err){
        console.log(err);
        reject();
      }
      resolve(prod);
    });
  })
  promise.then((thispro) => {
    thispro = thispro[0]
    var pics = thispro.pics;

    pic_list = thispro.pics.filter(function(img,index){
      if(deletepic.indexOf(index+'')<0){
        return img;
      }
    });

    for(var i = 0;i<files.length;i++){
      pic_list.push('/images/upload/'+files[i].filename);
    }

    product.pics = pic_list;
    try{
      for(let item in product){
        thispro[item] = product[item];
      }
    } catch (err){
      console.log(err);
    }
    console.log(thispro.labels);

    thispro.save(function(err){
      if(err){
        console.log(err);
      }
      update_doc(thispro);
      res.redirect('/admin/product/'+product._id);
    })

  },() => {
    res.send('出错啦！！！');
  })
}

module.exports.query = function(req,res){
  var q = req.query.q;
  var type = req.query.type;

  try{
    // let product = []
    let promise = new Promise((resolve,reject) => {
      search({'type':type,'q':q},(result) => {
        // product.concat(result);
        console.log(result);
        resolve(result);
      });
    });

    promise.then((pd)=>{
      console.log(pd);
      search({'type': 'description','q':q},result => {
        result = result.concat(pd);
        console.log('product::\n',result);
        res.render('mobile/search/',{
          result: result
        });
        // res.send(result);
      });
    });
  } catch(err){
    console.log(err);
  }
  // Product.find({},function(err,products){
  //   if(err){
  //     console.log(err);
  //     res.send('err');
  //   }


  //   // create(products);

  //   // res.send(products);
  // })
}