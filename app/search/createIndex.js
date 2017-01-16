'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _client = require('./client');

var _bulkIndex = require('./bulkIndex');

function create(products) {
  _client.esClient.indices.create({
    index: 'prod'
  }, function (err, res, status) {
    if (err) {
      console.log(err);
    } else {
      console.log('create', res);
      (0, _bulkIndex.makebulk)(products, function (response) {
        console.log("Bulk content prepared");
        (0, _bulkIndex.indexall)(response, function (response) {
          console.log(response);
        });
      });
    }
  });
}