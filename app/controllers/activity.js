'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_act_products = exports.delet_act = exports.update_act = exports.new_act = exports.new_act_page = exports.list = undefined;

var _activity2 = require('../models/activity');

var _product = require('../models/product');

var _product2 = _interopRequireDefault(_product);

var _delete_file = require('../common/delete_file');

var _unique = require('../common/unique');

var _add_activity_product = require('../common/add_activity_product');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list = exports.list = function list(req, res) {
  var promise = new Promise(function (resolve, reject) {
    _product2.default.find({}, { _id: 1, name: 1, labels: 1, pics: 1, activity: 1 }).limit(20).exec(function (err, products) {
      if (err) {
        console.log(err);
        reject(err);
      }
      _product2.default.count({}, function (err, count) {
        if (err) {
          reject(err);
        }
        resolve({ products: products, count: count });
      });
    });
  });
  promise.then(function (result) {
    _activity2.Activity.find({}, function (err, acts) {
      // console.log(result.count);
      if (err) {
        res.send(err);
      }
      res.render('admin/activity/', {
        activities: acts,
        products: result.products,
        count: result.count
      });
    });
  }, function (err) {
    console.log(err);
    res.send(err);
  });
};

var new_act_page = exports.new_act_page = function new_act_page(req, res) {
  _product2.default.find({}, { _id: 1, name: 1, pics: 1, labels: 1 }).limit(10).exec(function (err, prods) {
    if (err) {
      res.send(err);
    }
    _product2.default.count({}, function (err, count) {
      res.render('admin/activity/new_activity', {
        products: prods,
        count: count
      });
    });
  });
};

var new_act = exports.new_act = function new_act(req, res) {
  var activity = req.body.act;
  var pic = '/images/upload/' + req.files[0].filename;
  activity.pic = pic;
  console.log(activity);
  var _activity = new _activity2.Activity(activity);
  _activity.save(function (err, act) {
    if (err) {
      res.send(err);
    }
    _product2.default.where({ _id: { '$in': activity.products } }).update({ discount: activity.discount, activity: act._id });
    res.redirect('/admin/activity');
  });
};

var update_act = exports.update_act = function update_act(req, res) {
  var products = req.body.vals;
  var _id = req.body._id;
  var type = req.body.type;

  _activity2.Activity.findOne({ _id: _id }, function (err, act) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    try {
      if (type == 'delete') {
        act.products = (0, _unique.remove_item)(act.products, products);
        (0, _add_activity_product.remove_act)(products);
      } else {
        act.products = (0, _unique.unique)(act.products.concat(products));
        (0, _add_activity_product.add_act)(act.products, _id);
      }
    } catch (err) {
      console.log(err);
    }
    act.save(function (err) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  });
};

var delet_act = exports.delet_act = function delet_act(req, res) {
  var _id = req.body._id;

  _activity2.Activity.findOneAndRemove({ _id: _id }, function (err, act) {
    if (err) {
      res.json({ success: false });
    }
    (0, _delete_file.deletePic)([act.pic]);
    res.json({ success: true });
  });
};

var get_act_products = exports.get_act_products = function get_act_products(req, res) {
  var _id = req.query._id;

  _activity2.Activity.findOne({ _id: _id }, { products: 1 }, function (err, act) {

    _product2.default.find({ _id: { '$in': act.products } }, { _id: 1, name: 1, pics: 1, labels: 1 }, function (err, prods) {
      var data = {};
      data.prods = prods;
      data.count = prods.length;
      res.json(data);
    });
  });
};