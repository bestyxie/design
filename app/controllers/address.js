'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = undefined;

var _address2 = require('../models/address');

var User = require('../models/user');

var add = exports.add = function add(req, res) {
  var addr = req.body.address;
  var userid = req.body.userid;

  var _address = new _address2.Address(addr);
  _address.save(function (err, address) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    res.json({ success: true, addr_id: address._id });
  });
};