'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _product2 = require('../models/product');

var _product3 = _interopRequireDefault(_product2);

var _shoppingcart = require('../models/shoppingcart');

var _shoppingcart2 = _interopRequireDefault(_shoppingcart);

var _category = require('../models/category');

var _category2 = _interopRequireDefault(_category);

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _bulkIndex = require('../search/bulkIndex');

var _createIndex = require('../search/createIndex');

var _search = require('../search/search');

var _client = require('../search/client');

var _delete_document = require('../search/delete_document');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let qs = require('querystring');
// import {base_set,ANCHOR,base_url} from './weixin';


// product list || home
module.exports.list = function (req, res) {
  // base_set.scope="snsapi_base";
  // base_set.redirect_uri = encodeURIComponent('http://bestyxie.cn');
  // let snsapi_base = base_url+qs.stringify(base_set)+ANCHOR;
  // console.log(snsapi_base)

  // if(req.session.user){
  //   snsapi_base = false;
  // }
  // console.log(weixin.auth_url);
  _product3.default.find({}).sort({ 'meta.updateAt': -1 }).exec(function (err, products) {
    res.render('mobile/home/', {
      products: products
    });
  });
};

// 商品详情页
module.exports.detail = function (req, res) {
  var product_id = req.params.id;
  _product3.default.findOne({ _id: product_id }, function (err, product) {
    if (err) {
      console.log(err);
      res.redirect('/');
    }
    res.render('mobile/product_details/', {
      product: product
    });
  });
};

// 新增商品
module.exports.new = function (req, res) {
  var new_product = req.body.product;
  var files = req.files;

  new_product.pics = files.map(function (item) {
    return '/images/upload/' + item.filename;
  });

  _product3.default.findOne({ name: new_product.name }, function (err, product) {
    if (err) {
      return console.log(err);
    }
    if (!product || product.length <= 0) {
      var _product = new _product3.default(new_product);
      _product.save(function (err) {
        if (err) {
          console.log(err);
          res.redirect('/admin');
        }
        (0, _bulkIndex.makebulk)(_product, function (response) {
          console.log("Bulk content prepared");
          (0, _bulkIndex.indexall)(response, function (response) {
            console.log(response);
          });
        });
        res.redirect('/admin');
      });
    } else {
      console.log("product existed!");
      res.redirect('/admin');
    }
  });
};

// 删除商品
module.exports.delete = function (req, res) {
  var product_id = req.body._id;
  _product3.default.remove({ _id: product_id }, function (err) {
    if (err) {
      console.log(err);
      res.json({ success: 0 });
    }
    (0, _delete_document.delete_doc)(product_id);
    res.json({ success: 1 });
  });
};

// 编辑商品
module.exports.editproduct = function (req, res) {
  var product_id = req.params.id,
      pd;
  var promise = _product3.default.find({ _id: product_id }).exec();
  promise.then(function (product) {
    pd = product[0];
    return _category2.default.find({}, { name: 1, _id: 0 }).exec();
  }).then(function (categories) {
    res.render('admin/product_management/product_edit', {
      product: pd,
      categories: categories
    });
  });
};

// 更新商品
module.exports.updateproduct = function (req, res) {
  var product = req.body.product;
  var files = req.files;
  var deletepic = product.deletepic.split(' ').slice(0, -1);
  product.labels = product.labels.split(' ');
  if (product.labels.length == 1 && product.labels[0] == '') {
    product.labels = [];
  } else if (product.labels[0] == '') {
    product.labels.splice(0, 1);
    console.log(product.labels);
  }

  var pic_list = [];
  // console.log(product.labels);
  var promise = new Promise(function (resolve, reject) {
    _product3.default.find({ _id: product._id }, function (err, prod) {
      if (err) {
        console.log(err);
        reject();
      }
      resolve(prod);
    });
  });
  promise.then(function (thispro) {
    thispro = thispro[0];
    var pics = thispro.pics;

    pic_list = thispro.pics.filter(function (img, index) {
      if (deletepic.indexOf(index + '') < 0) {
        return img;
      }
    });

    for (var i = 0; i < files.length; i++) {
      pic_list.push('/images/upload/' + files[i].filename);
    }

    product.pics = pic_list;
    try {
      for (var item in product) {
        console.log(item);
        thispro[item] = product[item];
      }
    } catch (err) {
      console.log(err);
    }
    console.log('after copy!!');

    thispro.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/admin/product/' + product._id);
    });
  }, function () {
    res.send('出错啦！！！');
  });
};

module.exports.query = function (req, res) {
  var q = req.query.q;
  var type = req.query.type;

  _product3.default.find({}, function (err, products) {
    if (err) {
      console.log(err);
      res.send('err');
    }

    var product = [];
    var promise = new Promise(function (resolve, reject) {
      (0, _search.search)({ 'type': type, 'q': q }, function (result) {
        product.concat(result);
        resolve(product);
      });
    });

    promise.then(function (product) {
      (0, _search.search)({ 'type': 'description', 'q': q }, function (result) {
        result.concat(product);
        console.log('product::\n', result);
        res.render('mobile/search/', {
          result: result
        });
        // res.send(result);
      });
    });

    // create(products);

    // res.send(products);
  });
};