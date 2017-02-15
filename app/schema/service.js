'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = exports.serviceSchema = new Schema({
  kf_account: String,
  nickname: String,
  password: String
});