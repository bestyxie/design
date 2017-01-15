'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
// import client from './client';

function create(client) {
  client.indices.create({
    index: 'prod'
  }, function (err, res, status) {
    if (err) {
      console.log(err);
    } else {
      console.log('create', res);
    }
  });
}