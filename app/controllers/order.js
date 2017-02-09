'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getsign = exports.cancle = exports.receipt = exports.express_msg = exports.update = exports.getAll_paid = exports.paid = exports.order_list = exports.pay = exports.submit_order = exports.create_order = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _ShoppingCart = require('../models/ShoppingCart');

var _ShoppingCart2 = _interopRequireDefault(_ShoppingCart);

var _unique = require('../common/unique');

var _address = require('../models/address');

var _xto = require('xto');

var _xto2 = _interopRequireDefault(_xto);

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
      console.log(addrs);
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
        }
      }

      var default_addr = addrs.filter(function (addr) {
        if (addr.default) {
          return addr;
        }
      });
      console.log("default_addr::", default_addr);

      res.render('mobile/order/create_order', {
        products: _prodts,
        user_id: user_id,
        // count: count,
        // sum: sum,
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
      order_msg.status = "待付款";
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
    _address.Address.findOne({ _id: order.address }, { recipient: 1, tel: 1, address: 1 }, function (err, addr) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      delete order.address;
      order.address = addr;
      var _order = new _order3.default(order);
      _order.save(function (err, order) {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect('/order/pay?_id=' + order._id);
      });
    });
  });
};

var pay = exports.pay = function pay(req, res) {
  var orderid = req.query._id;
  _order3.default.findOne({ _id: orderid }, { _id: 1, total: 1, express: 1 }, function (err, order) {
    res.render('mobile/order/pay', {
      order: order
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

var paid = exports.paid = function paid(req, res) {
  res.render('mobile/order/pay_complete');
};

var getAll_paid = exports.getAll_paid = function getAll_paid(req, res) {
  // {status: '待发货'}
  _order3.default.find({}, function (err, orders) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('admin/delivery/', {
      orders: orders
    });
  });
};

var update = exports.update = function update(req, res) {
  var orderid = req.body.orderid;
  var express_msg = req.body.express_msg;

  _order3.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    order.express_msg = express_msg;
    order.save(function (err) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  });
};

var express_msg = exports.express_msg = function express_msg(req, res) {
  var orderid = req.query.orderid;
  var name = req.query.name;
  var number = req.query.number;

  _xto2.default.query(number, name, function (err, express) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    switch (name) {
      case 'ems':
        express.com = "EMS";
        break;
      case 'shunfeng':
        express.com = "顺丰速运";
        break;
      case 'shentong':
        express.com = '申通快递';
        break;
      case 'yunda':
        express.com = '韵达快递';
        break;
      case 'yuantong':
        express.com = '圆通快递';
        break;
      case 'zhongtong':
        express.com = '中通快递';
        break;
      case 'huitongkuaidi':
        express.com = '百世快递';
        break;
      case 'tiantian':
        express.com = '天天快递';
        break;
    }
    var _data = [];
    for (var i = express.data.length - 1; i >= 0; i--) {
      _data.push(express.data[i]);
    }
    res.render('mobile/express/', { express: express, orderid: orderid });
  });
};

var receipt = exports.receipt = function receipt(req, res) {
  var orderid = req.query._id;

  _order3.default.findOneAndUpdate({ _id: orderid }, { status: '交易完成' }, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/order/receipt', {
      _id: orderid
    });
  });
};

var cancle = exports.cancle = function cancle(req, res) {
  var orderid = req.query.orderid;
  console.log(req.cookie.openid);

  _order3.default.findOneAndUpdate({ _id: orderid }, { status: '交易关闭' }, function (err) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    res.json({ success: true });
  });
};

var getsign = exports.getsign = function getsign(req, res) {
  var data = req.body;
  console.log('openid::', req.cookie.openid);
  var openid = req.cookie.openid;
  console.log(openid);
  var wxpay = new WechatPay();
  data.spbill_create_ip = req.ip;
  data.openid = openid;
  wxpay.getOpenid(data, function (err, responseData) {
    res.json(responseData);
  });
};