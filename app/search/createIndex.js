'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _client = require('./client');

function create() {
  _client.esClient.indices.create({
    index: 'prod'
  }, function (err, res, status) {
    if (err) {
      console.log(err);
    } else {
      console.log('create', res);
    }
  });
}