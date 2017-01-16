'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_doc = undefined;

var _client = require('./client');

var update_doc = exports.update_doc = function update_doc(product) {
  _client.esClient.update({
    index: 'prod',
    type: 'product',
    id: product._id,
    body: {
      params: {
        'name': product.name,
        'labels': product.labels.join(' '),
        'color': product.color.join(' '),
        'description': product.description
      }
    }
  });
};