'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create_order = undefined;

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

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

    if (Array.isArray(prod_msg._id)) {
      _prod_msg = (0, _unique.toString)(prod_msg._id);
    } else {
      _prod_msg.push(prod_msg._id.toString());
    }

    for (var i = 0, len = prodts.products.length; i < len; i++) {
      if (_prod_msg.indexOf(prodts.products[i].productId.toString()) > -1) {
        _prodts.push(prodts.products[i]);
        count += prodts.products[i].qty;
        sum += prodts.products[i].qty * prodts.products[i].qty;
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