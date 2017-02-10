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

var _activity = require('../models/activity');

var _bulkIndex = require('../search/bulkIndex');

var _createIndex = require('../search/createIndex');

var _search = require('../search/search');

var _client = require('../search/client');

var _delete_document = require('../search/delete_document');

var _update_document = require('../search/update_document');

var _delete_file = require('../common/delete_file');

var _evaluation = require('../models/evaluation');

var _evaluation2 = _interopRequireDefault(_evaluation);

var _wcuser = require('../models/wcuser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// product list || home
module.exports.list = function (req, res) {
  var login = false;
  console.log(req.signedCookies);
  if (req.cookies && req.cookies.openid && !req.session.user) {
    login = true;
    _wcuser.Wcuser.findOne({ openid: req.cookie.openid }, { _id: 1, openid: 1 }, function (err, user) {
      if (err) {
        console.log(err);
        return;
      }
      res.session.user = user;
    });
  }
  var promise = new Promise(function (resolve, reject) {
    _activity.Activity.find({}, function (err, acts) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(acts);
    });
  });

  promise.then(function (acts) {
    _product3.default.find({}).sort({ 'meta.updateAt': -1 }).exec(function (err, products) {
      res.render('mobile/home/', {
        products: products,
        acts: acts,
        login: login
      });
    });
  }, function (err) {
    console.log(err);
  });
};

// 商品详情页
module.exports.detail = function (req, res) {
  var product_id = req.params.id;
  var promise = new Promise(function (resolve, reject) {
    _evaluation2.default.find({ product_id: product_id }).sort({ createAt: -1 }).limit(2).exec(function (err, evls) {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(evls);
      _evaluation2.default.count({ product_id: product_id }, function (err, count) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(evls, count);
      });
    });
  });
  promise.then(function (evls, count) {
    _product3.default.findOne({ _id: product_id }, function (err, product) {
      if (err) {
        console.log(err);
        res.redirect('/');
      }
      res.render('mobile/product_details/', {
        product: product,
        evls: evls,
        count: count
      });
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
        (0, _bulkIndex.create_doc)(_product, function (res) {
          // console.log(res);
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

  var promise = new Promise(function (resolve, reject) {
    _product3.default.find({ _id: product_id }, function (err, prod) {
      if (err) {
        console.log(err);
        reject();
      } else if (prod.length > 0) {
        var files = prod[0].pics;
        (0, _delete_file.deletePic)(files);
        resolve();
      } else {
        reject();
      }
    });
  });
  promise.then(function () {
    _product3.default.remove({ _id: product_id }, function (err) {
      if (err) {
        console.log(err);
        res.json({ success: 0 });
      }
      (0, _delete_document.delete_doc)(product_id);
      res.json({ success: 1 });
    });
  }, function () {
    console.log('oops!!! 出错啦');
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
    var pics = thispro.pics,
        deletepic_url = [];

    pic_list = thispro.pics.filter(function (img, index) {
      if (deletepic.indexOf(index + '') < 0) {
        return img;
      } else {
        deletepic_url.push(thispro.pics[index]);
      }
    });
    (0, _delete_file.deletePic)(deletepic_url);

    for (var i = 0; i < files.length; i++) {
      pic_list.push('/images/upload/' + files[i].filename);
    }

    product.pics = pic_list;
    try {
      for (var item in product) {
        thispro[item] = product[item];
      }
    } catch (err) {
      console.log(err);
    }

    thispro.save(function (err) {
      if (err) {
        console.log(err);
      }
      (0, _update_document.update_doc)(thispro);
      res.redirect('/admin/product/' + product._id);
    });
  }, function () {
    res.send('出错啦！！！');
  });
};

module.exports.query = function (req, res) {
  var q = req.query.q;
  var type = req.query.type;

  try {
    // let product = []
    var promise = new Promise(function (resolve, reject) {
      (0, _search.search)({ 'type': type, 'q': q }, function (result) {
        // product.concat(result);
        console.log(result);
        resolve(result);
      });
    });

    promise.then(function (pd) {
      console.log(pd);
      (0, _search.search)({ 'type': 'description', 'q': q }, function (result) {
        result = result.concat(pd);
        for (var i = 0, len = result.length; i < len; i++) {
          result._source._id = result._id;
          result._source.pics.split(' ');
        }
        res.render('mobile/search/', {
          products: result._source
        });
        // res.send(result);
      });
    });
  } catch (err) {
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
};

module.exports.getProduct = function (req, res) {
  var curr = req.body.curr;
  var limit = req.body.limit;

  _product3.default.find({}, { _id: 1, name: 1, labels: 1, pics: 1 }).skip((curr - 1) * limit).limit(limit).exec(function (err, products) {
    if (err) {
      console.log(err);
      return;
    }
    res.json({ prods: products });
  });
};

module.exports.act_prod = function (req, res) {
  var act_id = req.params.id;

  _product3.default.find({ activity: act_id }, function (err, prodts) {
    console.log(prodts);
    res.render('mobile/search/', {
      products: prodts
    });
  });
};