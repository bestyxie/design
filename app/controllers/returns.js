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
      _order3.default.findOneAndUpdate({ _id: orderid }, { status: '退款退货' });
      res.render('mobile/returnOrder/success', {
        p: '申请成功！请耐心等待审核'
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
      console.log(order);
    });
    res.json({ success: true });
  });
};