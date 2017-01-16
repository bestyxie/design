'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delete_doc = undefined;

var _client = require('./client');

var delete_doc = exports.delete_doc = function delete_doc(id) {
  _client.esClient.delete({
    index: 'prod',
    type: 'product',
    id: id
  });
};