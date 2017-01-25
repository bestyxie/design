'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove_act = exports.add_act = undefined;

var _product = require('../models/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var add_act = exports.add_act = function add_act(ids, act_id) {
  _product2.default.find({ _id: { '$in': ids } }, function (err, prods) {
    for (var i = 0, len = prods.length; i < len; i++) {
      prods[i].activity = act_id;
      prods[i].save();
    }
  });
};

var remove_act = exports.remove_act = function remove_act(ids) {
  _product2.default.find({ _id: { '$in': ids } }, function (err, prods) {
    for (var i = 0, len = prods.length; i < len; i++) {
      prods[i].activity = '';
      prods[i].save();
    }
  });
};