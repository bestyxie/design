'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esClient = undefined;

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var esClient = exports.esClient = new _elasticsearch2.default.Client({
  host: '127.0.0.1:9200'
});