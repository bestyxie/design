'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reply = exports.goods = undefined;

var _order2 = require('../models/order');

var _order3 = _interopRequireDefault(_order2);

var _returns = require('../models/returns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var goods = exports.goods = function goods(req, res) {
  var orderid = req.query.orderid;

  _order3.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/returnOrder/', {
      order: order
    });
  });
};

var reply = exports.reply = function reply(req, res) {
  var _order = req.body.ret;
  var orderid = req.body.orderid;
  var file = req.files[0];
  console.log(file);
  file = '/images/upload/' + file.filename;

  _order3.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    _order.status = '1';
    _order.products = order.products;
    _order.pics = file;
    console.log(_order);
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