'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Activity = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _activity = require('../schema/activity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Activity = exports.Activity = _mongoose2.default.model('Activity', _activity.activitySchema);