'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = search;

var _client = require('./client');

function search(data, callback) {
  var match = {};
  switch (data.type) {
    case 'labels':
      match.labels = data.q;
      break;
    case 'color':
      match.color = data.q;
      break;
    case 'description':
      match.description = data.q;
      break;
    default:
      match.name = data.q;
  }

  // console.log(match);
  _client.esClient.search({
    index: 'prod',
    type: 'product',
    body: {
      query: {
        match: match
      }
    }
  }, function (err, res, status) {
    if (err) {
      console.log('search error: ' + err);
      callback(err);
    } else {
      console.log("-- Response -- " + data.type + " --");
      console.log(res);
      // console.log("-- Hits --");
      // res.hits.hits.forEach((hit) => {
      //   console.log(hit);
      // });
      callback(res.hits.hits);
    }
  });
}