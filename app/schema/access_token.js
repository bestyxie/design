'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accessSchema = new Schema({
  access_token: String,
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = accessSchema;