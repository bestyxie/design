'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delet_act = exports.update_act = exports.new_act = exports.list = undefined;

var _activity = require('../models/activity');

var list = exports.list = function list(req, res) {
  _activity.Activity.find({}, function (err, acts) {
    if (err) {
      res.send(err);
    }
    res.render('admin/activity/', {
      activities: acts
    });
  });
};

var new_act = exports.new_act = function new_act(req, res) {};

var update_act = exports.update_act = function update_act(req, res) {};

var delet_act = exports.delet_act = function delet_act(req, res) {};