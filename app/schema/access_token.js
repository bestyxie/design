'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accessSchema = new Schema({
  access_token: String
});

module.exports = accessSchema;