'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paying = exports.order_list = exports.submit_order = exports.create_order = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _ShoppingCart = require('../models/ShoppingCart');

var _ShoppingCart2 = _interopRequireDefault(_ShoppingCart);

var _unique = require('../common/unique');

var _address = require('../models/address');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var create_order = exports.create_order = function create_order(req, res) {
  var prod_msg = req.body.products;
  var user_id = prod_msg.user_id;
  var count = 0,
      sum = 0;

  var promise = new Promise(function (resolve, reject) {
    _address.Address.find({ user: user_id }, function (err, addrs) {
      if (err) {
        console.log(err);
        reject();
      }
      resolve(addrs);
    });
  });
  promise.then(function (addrs) {
    _ShoppingCart2.default.findOne({ userId: user_id }, { products: 1 }, function (err, prodts) {
      var _prodts = [],
          _prod_msg = [];

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

      var default_addr = addrs.filter(function (addr) {
        if (addr.default) {
          return addr;
        }
      });

      res.render('mobile/order/create_order', {
        products: _prodts,
        user_id: user_id,
        count: count,
        sum: sum,
        addrs: addrs,
        default_addr: default_addr[0]
      });
    });
  }, function () {
    res.redirect('/cart');
  });
};

var submit_order = exports.submit_order = function submit_order(req, res) {
  var order_msg = req.body.order;
  var userId = order_msg.user_id;

  var promise = new Promise(function (resolve, reject) {
    _ShoppingCart2.default.findOne({ userId: userId }, function (err, carts) {
      if (err) {
        console.log(err);
        reject();
      }
      var prodts = carts.products;
      var _prodts = [],
          _prod_msg = [],
          rest = [];
      var count = 0,
          sum = 0;
      if (Array.isArray(order_msg.productId)) {
        _prod_msg = (0, _unique.toString)(order_msg.productId);
      } else {
        _prod_msg.push(order_msg.productId.toString());
      }

      for (var i = 0, len = prodts.length; i < len; i++) {
        if (_prod_msg.indexOf(prodts[i].productId.toString()) > -1) {
          _prodts.push(prodts[i]);
          count += prodts[i].qty;
          sum += prodts[i].qty * prodts[i].price;
        } else {
          rest.push(prodts[i]);
        }
      }
      delete carts.products;
      delete order_msg.prodts;
      carts.products = rest;
      order_msg.products = _prodts;
      order_msg.status = false;
      carts.save(function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
      });
      resolve(order_msg);
    });
  });
  promise.then(function (order) {
    var _order = new _order3.default(order);
    _order.save(function (err) {
      if (err) {
        console.log(err);
        return;
      }
      res.redirect('/');
    });
  });
};

var order_list = exports.order_list = function order_list(req, res) {
  var user_id = req.session.user._id;
  var status = req.query.status;
  var condiction = {};
  condiction.user_id = user_id;
  if (status) {
    condiction.status = status;
  }

  _order3.default.find(condiction, function (err, orders) {
    res.render('mobile/order/', {
      orders: orders
    });
  });
};

var paying = exports.paying = function paying(req, res) {};