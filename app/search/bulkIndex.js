'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexall = exports.makebulk = undefined;

var _client = require('./client');

// export const bulkIndex = function(index,type,data) {
//   let bulkBody = [];
//   data.forEach(item => {
//     bulkBody.push(
//       { index: {_index: index, _type: type, _id: item._id } },
//       item
//     );

//     bulkBody.push(item);
//   });

//   esClient.bulk({
//     maxRetries: 5,
//     index: 'prod',
//     type: 'product',
//     body: bulkBody
//   },(err,res,status) => {
//     if(err){
//       console.log('err:',err);
//     }
//     else {
//       console.log('normal:',res);
//     }
//   });
// }

var bulk = [];
var makebulk = exports.makebulk = function makebulk(products, callback) {
  for (var product in products) {
    bulk.push({ index: { _index: 'prod', _type: 'product', _id: product._id } }, {
      'name': product.name,
      'labels': product.labels,
      'color': product.color,
      'description': product.description
    });
  }
  callback(bulk);
};

var indexall = exports.indexall = function indexall(madebulk, callback) {
  _client.esClient.bulk({
    maxRetries: 5,
    index: 'prod',
    type: 'product',
    body: madebulk
  }, function (err, res, status) {
    if (err) {
      console.log(err);
    } else {
      callback(res.items);
    }
  });
};