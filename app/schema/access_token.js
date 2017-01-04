'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accessSchema = new Schema({
  refresh_token: String
});

module.exports = accessSchema;