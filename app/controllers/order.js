'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submit_order = exports.create_order = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _ShoppingCart = require('../models/ShoppingCart');

var _ShoppingCart2 = _interopRequireDefault(_ShoppingCart);

var _unique = require('../common/unique');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var create_order = exports.create_order = function create_order(req, res) {
  var prod_msg = req.body.products;
  var user_id = prod_msg.user_id;
  var count = 0,
      sum = 0;

  _ShoppingCart2.default.findOne({ userId: user_id }, { products: 1 }, function (err, prodts) {
    var _prodts = [],
        _prod_msg = [];
    console.log(prodts);

    if (Array.isArray(prod_msg._id)) {
      _prod_msg = (0, _unique.toString)(prod_msg._id);
    } else {
      _prod_msg.push(prod_msg._id.toString());
    }

    for (var i = 0, len = prodts.products.length; i < len; i++) {
      if (_prod_msg.indexOf(prodts.products[i].productId.toString()) > -1) {
        _prodts.push(prodts.products[i]);
        count += prodts.products[i].qty;
        sum += prodts.products[i].qty * prodts.products[i].price;
      }
    }

    res.render('mobile/order/create_order', {
      products: _prodts,
      user_id: user_id,
      count: count,
      sum: sum
    });
  });
};

var submit_order = exports.submit_order = function submit_order(req, res) {
  var order_msg = req.body.order;
  var userId = order_msg.user;

  var promise = new Promise(function (resolve, reject) {
    _ShoppingCart2.default.findOne({ userId: userId }, { products: 1 }, function (err, prodts) {
      var _prodts = [],
          _prod_msg = [];
      console.log(prodts);

      if (Array.isArray(order_msg._id)) {
        _prod_msg = (0, _unique.toString)(order_msg._id);
      } else {
        _prod_msg.push(order_msg._id.toString());
      }

      for (var i = 0, len = prodts.products.length; i < len; i++) {
        if (_prod_msg.indexOf(prodts.products[i].productId.toString()) > -1) {
          _prodts.push(prodts.products[i]);
          count += prodts.products[i].qty;
          sum += prodts.products[i].qty * prodts.products[i].price;
        }
      }
      delete order_msg.prodts;
      order_msg.products = _prodts;
      order_msg.status = false;
      console.log(order_msg);
      resolve(order_msg);
    });
  });
  promise.then(function (order) {
    var _order = new _order3.default(order);
    _order.save(function () {
      res.redirect('/');
    });
  });
};