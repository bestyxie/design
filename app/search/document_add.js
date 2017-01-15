'use strict';

var _client = require('./client');

_client.esClient.index({
  index: 'prod',
  id: '1',
  type: 'product',
  body: {}
});