'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subimit = exports.evaluate = undefined;

var _evaluation2 = require('../models/evaluation');

var _evaluation3 = _interopRequireDefault(_evaluation2);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evaluate = exports.evaluate = function evaluate(req, res) {
  var orderid = req.query._id;
  console.log(orderid);

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
  var prod_id = req.body.prod.product_id;
  var user_id = req.body.user_id;
  var files = req.files;
  var comments = {};

  function save_evl(prod_id, index) {
    console.log(index);
    var msg = req.body[prod_id];
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
  if (Array.isArray(prod_id)) {
    for (var i = 0; i < prod_id.length; i++) {
      (function (prod_id, index) {
        save_evl(prod_id, index);
      })(prod_id[i], i);
    }
  } else {
    save_evl(prod_id, 0);
  }
  res.redirect('/order');
};