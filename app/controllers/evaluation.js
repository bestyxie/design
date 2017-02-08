'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = exports.subimit = exports.evaluate = undefined;

var _evaluation2 = require('../models/evaluation');

var _evaluation3 = _interopRequireDefault(_evaluation2);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evaluate = exports.evaluate = function evaluate(req, res) {
  var orderid = req.query._id;

  _order2.default.findOne({ _id: orderid }, { user_id: 1, products: 1 }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/evaluation/evaluate', {
      order: order
    });
  });
};

var subimit = exports.subimit = function subimit(req, res) {
  var prodts = req.body.prod;
  var user_id = req.body.user_id;
  var orderid = req.body.order_id;
  var files = req.files;
  var comments = {};

  files = files.map(function (item) {
    return '/images/upload/' + item.filename;
  });

  function save_evl(prodt, index) {
    var prod_id = prodt.product_id;
    var msg = req.body[prod_id];
    comments.size = prodt.size;
    comments.color = prodt.color;
    comments.product_id = prod_id;
    comments.user_id = user_id;
    comments.content = msg.content;
    comments.grade = msg.grade;
    comments.imgs = req.files[0].path;
    var _evaluation = new _evaluation3.default(comments);
    _evaluation.save(function (err) {
      if (err) {
        console.log(err);
        res.send(err);
      }
    });
  }
  if (Array.isArray(prodts)) {
    for (var i = 0; i < prodts.length; i++) {
      (function (prodts, index) {
        save_evl(prodts, index);
      })(prodts[i], i);
    }
  } else {
    save_evl(prodts, 0);
  }
  _order2.default.findOneAndUpdate({ _id: orderid }, { evaluate: true });
  res.redirect('/order');
};

var list = exports.list = function list(req, res) {
  var product_id = req.query.id;

  _evaluation3.default.find({ product_id: product_id }, function (err, evls) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/evaluation/', {
      evls: evls
    });
  });
};