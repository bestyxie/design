'use strict';

var User = require('../models/user');

module.exports.add = function (req, res) {
  var addr = req.body.address;
  var userid = req.body.userid;

  User.findOne({ _id: userid }, function (err, user) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }
    user.address = addr;
    user.save(function (err) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  });
};