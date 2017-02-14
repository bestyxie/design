'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wechat = exports.getsign = exports.cancle = exports.receipt = exports.express_msg = exports.update = exports.getAll_paid = exports.paid = exports.complete = exports.order_list = exports.pay = exports.submit_order = exports.create_order = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _ShoppingCart = require('../models/ShoppingCart');

var _ShoppingCart2 = _interopRequireDefault(_ShoppingCart);

var _unique = require('../common/unique');

var _address = require('../models/address');

var _xto = require('xto');

var _xto2 = _interopRequireDefault(_xto);

var _wxpay = require('./wxpay');

var _wxpay2 = _interopRequireDefault(_wxpay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xml2jsparseString = require('xml2js').parseString;
var API = require('wechat-api');
var config = require('../../config/default.json').wx;
var api = new API(config.app_id, config.app_secret);

var create_order = exports.create_order = function create_order(req, res) {
  var prod_msg = req.body.products;
  var user_id = prod_msg.user_id;
  var count = 0,
      sum = 0;

  prod_msg.openid = req.session.user.openid;

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

var complete = exports.complete = function complete(req, res) {
  var body = req.body;
  var orderid = void 0;
  xml2jsparseString(body, { async: true }, function (error, result) {
    if (result.xml.result_code == 'SUCCESS') {
      orderid = result.xml.transaction_id;
      _order3.default.findOneAndUpdate({ _id: orderid }, { status: '待发货', transaction_id: req.query.transaction_id }, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
  res.render('mobile/order/pay_complete', {
    return_code: 'SUCCESS',
    return_msg: 'OK'
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
    order.status = '待收货';
    order.save(function (err) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      }
      /* 发货通知 start */
      var data = {
        appid: config.app_id,
        openid: order.openid,
        transid: order.transaction_id,
        out_trade_no: order._id,
        deliver_timestamp: Date.now() / 1000,
        deliver_status: "1",
        deliver_msg: "ok",
        sign_method: "sha1"
      };
      var wxpay = new _wxpay2.default();
      data.app_signature = wxpay.getSign({
        appid: config.app_id, //公众号名称，由商户传入
        appkey: config.wxpaykey,
        openid: order.openid,
        transid: order.transaction_id,
        out_trade_no: order._id,
        deliver_timestamp: data.deliver_timestamp, //时间戳，自1970年以来的秒数
        deliver_status: "1",
        deliver_msg: "ok"
      });
      api.deliverNotify(data, function (err, result) {});
      /* 发货通知 end */
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
  var wxpay = new _wxpay2.default();
  data.spbill_create_ip = req.ip;
  wxpay.getBrandWCPayParams(data, function (err, responseData) {
    console.log('err::', err);
    console.log('responseData::', responseData);
    res.json(responseData);
  });
};

var wechat = exports.wechat = function wechat(req, res) {
  var param = {
    debug: false,
    jsApiList: ['chooseWXPay', 'uploadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage'],
    url: req.body.url
  };
  console.log('url', req.body.url);
  api.getTicket(function (err, result) {
    param.ticket = result.ticket;
    api.getJsConfig(param, function (err, result) {
      console.log(result);
      res.send(result);
    });
  });
};