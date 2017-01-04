var mongoose = require('mongoose');
var accessSchema = require('../schema/access_token');

var AccessToken = mongoose.model('AccessToken',accessSchema);

module.exports = AccessToken;