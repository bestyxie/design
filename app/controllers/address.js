'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.add = undefined;

var _address2 = require('../models/address');

var User = require('../models/user');

var add = exports.add = function add(req, res) {
  var addr = req.body.address;
  var userid = addr.user;

  var _address = new _address2.Address(addr);
  if (addr.default) {
    _address2.Address.findOne({ user: userid, default: true }, function (err, address) {
      if (err) {
        console.log(err);
        return;
      }
      if (address && address.length > 0) {
        address.default = false;
        console.log(address);
        address.update();
      }
    });
  }
  _address.save(function (err, address) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    res.json({ success: true, addr_id: address._id });
  });
};

var update = exports.update = function update(req, res) {
  var _id = req.body._id;
  var _addr = req.body._addr;
  console.log(_addr);

  _address2.Address.findOneAndUpdate({ _id: _id }, _addr, null, function (err, addr) {
    if (err) {
      console.log(err);
      res.json({ success: false });
      return;
    }
    res.json({ success: true });
  });
};