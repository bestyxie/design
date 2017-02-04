'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subimit = exports.evaluate = undefined;

var _evaluation = require('../models/evaluation');

var _evaluation2 = _interopRequireDefault(_evaluation);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evaluate = exports.evaluate = function evaluate(req, res) {
  var orderid = req.query._id;

  _order2.default.findOne({ _id: orderid }, function (err, order) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/evaluation/evaluate', { user_id: 1, products: 1 }, {
      order: order
    });
  });
};

var subimit = exports.subimit = function subimit(req, res) {
  console.log(req.body.order);
  res.redirect('/order');
};