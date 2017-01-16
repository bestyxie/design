'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = search;

var _client = require('./client');

function search(q, callback) {
  console.log(q);
  _client.esClient.search({
    index: 'prod',
    type: 'product',
    body: {
      query: {
        match: { "description": q }
      }
    }
  }, function (err, res, status) {
    if (err) {
      console.log('search error: ' + err);
      callback(err);
    } else {
      console.log("-- Response --");
      console.log(res);
      console.log("-- Hits --");
      res.hits.hits.forEach(function (hit) {
        console.log(hit);
      });
      callback(res.hits.hits);
    }
  });
}