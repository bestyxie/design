'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create_doc = exports.indexall = exports.makebulk = undefined;

var _client = require('./client');

var bulk = [];
var makebulk = exports.makebulk = function makebulk(products, callback) {
  for (var i = 0, len = products.length; i < len; i++) {
    bulk.push({ index: { _index: 'prod', _type: 'product', _id: products[i]._id } }, {
      'name': products[i].name,
      'labels': products[i].labels.join(" "),
      'color': products[i].color.join(" "),
      'description': products[i].description,
      'pics': products[i].pics.join(' '),
      'price': products[i].price,
      'discount': products[i].discount
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

var create_doc = exports.create_doc = function create_doc(product, callback) {
  console.log(product._id.toString());
  _client.esClient.create({
    index: 'prod',
    type: 'product',
    id: product._id.toString(),
    body: {
      'name': product.name,
      'labels': product.labels.join(" "),
      'color': product.color.join(" "),
      'description': product.description,
      'pics': product.pics.join(' '),
      'price': product.price,
      'discount': product.discount
    }
  }, function (err, res, status) {
    if (err) {
      console.log(err);
    }
    callback(res);
  });
};