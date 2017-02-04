'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submit = undefined;

var _evaluation = require('../models/evaluation');

var _evaluation2 = _interopRequireDefault(_evaluation);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var submit = exports.submit = function submit(req, res) {
  res.render('mobile/evaluation/evaluate');
};