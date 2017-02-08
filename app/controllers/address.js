'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addr_list = exports.remove = exports.getAddr = exports.update = exports.add = undefined;

var _address2 = require('../models/address');

var add = exports.add = function add(req, res) {
  var addr = req.body.address;
  var userid = addr.user;
  console.log(addr);

  var _address = new _address2.Address(addr);

  if (addr.default) {
    _address2.Address.findOneAndUpdate({ user: userid, default: true }, { default: false }, function (err, address) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('update address::', address);
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
  var _addr = req.body.address;
  var userid = req.body.userid;
  console.log(_addr);

  var promise = new Promise(function (resolve, reject) {
    if (_addr.default) {
      _address2.Address.findOneAndUpdate({ user: userid, default: true }, { default: false }, null, function (err, addr) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      });
    } else {
      resolve();
    }
  });

  promise.then(function () {
    _address2.Address.findOneAndUpdate({ _id: _id }, _addr, null, function (err, addr) {
      if (err) {
        console.log(err);
        res.json({ success: false });
        return;
      }
      res.json({ success: true });
    });
  }, function (err) {
    console.log(err);
  });
};

var getAddr = exports.getAddr = function getAddr(req, res) {
  var condiction = {};
  condiction._id = req.query._id;
  var isdefault = req.query.default;
  if (isdefault != undefined) {
    condiction.default = isdefault;
  }

  _address2.Address.findOne(condiction, function (err, addr) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    res.json({ success: true, address: addr });
  });
};

var remove = exports.remove = function remove(req, res) {
  var _id = req.query._id;

  _address2.Address.findOneAndRemove({ _id: _id }, function (err) {
    if (err) {
      console.log(err);
      res.json({ success: false });
      return;
    }
    res.json({ success: true });
  });
};

var addr_list = exports.addr_list = function addr_list(req, res) {
  var userid = req.session.user._id;
  console.log(userid);

  _address2.Address.find({ user: userid }, function (err, addrs) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('mobile/order/order_list', {
      addrs: addrs
    });
  });
};