'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.complete = exports.get_return = exports.adopt = exports.admin_retlist = exports.reply = exports._return = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _returns = require('../models/returns');

var _xto = require('xto');

var _xto2 = _interopRequireDefault(_xto);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _wxpay = require('./wxpay');

var _wxpay2 = _interopRequireDefault(_wxpay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API = require('wechat-api');
var config = require('../../config/default.json').wx;
var api = new API(config.app_id, config.app_secret);

var _return = exports._return = function _return(req, res) {
  var orderid = req.query.orderid;

  _order3.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }

    res.render('mobile/returnOrder/reply', {
      order: order
    });
  });
};

var reply = exports.reply = function reply(req, res) {
  var _order = req.body.ret;
  var orderid = _order.orderid;
  var file = req.files[0];
  file = '/images/upload/' + file.filename;

  _order3.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    _order.status = 1;
    _order.products = order.products;
    _order.pics = file;
    _order.user_id = req.session.user._id;

    var ret_order = new _returns.Returns(_order);
    ret_order.save(function (err) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      _order3.default.findOneAndUpdate({ _id: orderid }, { status: '退款退货' }, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.render('mobile/returnOrder/success', {
          p: '申请成功！请耐心等待审核'
        });
      });
    });
  });
};

var admin_retlist = exports.admin_retlist = function admin_retlist(req, res) {

  _returns.Returns.find({}, function (err, orders) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('admin/returns/', {
      orders: orders
    });
  });
};

var adopt = exports.adopt = function adopt(req, res) {
  var retid = req.body.returnid;
  var address = req.body.address;
  var status = req.body.status;
  var data = {
    address: address,
    status: status
  };

  _returns.Returns.findOneAndUpdate({ _id: retid }, data, function (err) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }

    res.json({ success: false });
  });
};

var get_return = exports.get_return = function get_return(req, res) {
  var userid = req.session.user._id;

  _returns.Returns.find({ user_id: userid, status: { '$lte': 2 } }, function (err, returns) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/returnOrder/', {
      orders: returns
    });
  });
};

var complete = exports.complete = function complete(req, res) {
  var _id = req.query._id;

  _returns.Returns.findOneAndUpdate({ _id: _id }, { status: 3 }, function (err, ret) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }

    _order3.default.findOneAndUpdate({ _id: ret.orderid }, { status: '交易关闭' }, function (err, order) {
      if (err) {
        console.log(err);
        return;
      }
      var pay = new _wxpay2.default();
      var data = {
        appid: config.app_id,
        mch_id: config.partner,
        nonce_str: pay.createNonceStr,
        sign: 'xxx',
        transaction_id: order.transaction_id,
        total_fee: order.total * 100,
        refund_fee: order.total * 100,
        op_user_id: req.session.user._id,
        out_refund_no: ret._id
      };
      data.sign = pay.getSign({
        appid: config.app_id,
        mch_id: config.partner,
        nonce_str: pay.createNonceStr,
        timestamp: Date.now()
      });
      _request2.default.post('https://api.mch.weixin.qq.com/secapi/pay/refund', data, function (err, res, body) {
        var result = body && JSON.parse(body);
        if (result.return_code == 'SUCCESS') {
          // do something
        }
      });
      console.log(order);
    });
    res.json({ success: true });
  });
};