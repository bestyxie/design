'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_express = exports.adopt = exports.admin_retlist = exports.reply = exports.goods = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _returns = require('../models/returns');

var _xto = require('xto');

var _xto2 = _interopRequireDefault(_xto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var goods = exports.goods = function goods(req, res) {
  var orderid = req.query.orderid;

  _order3.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (order.status == 3) {
      _xto2.default.query(number, name, function (err, express) {
        if (err) {
          console.log(err);
          res.send(err);
        }
      });
    }
    res.render('mobile/returnOrder/', {
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
    _order.status = '1';
    _order.products = order.products;
    _order.pics = file;

    var ret_order = new _returns.Returns(_order);
    ret_order.save(function (err) {
      if (err) {
        console.log(err);
        res.send(err);
      }
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

var get_express = exports.get_express = function get_express(req, res) {
  var name = req.query.name;
  var number = req.query.number;

  _xto2.default.query(number, name, function (err, express) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }

    res.json(express);
  });
};