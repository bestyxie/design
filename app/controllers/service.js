'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._new = exports.list = undefined;

var _service = require('../models/service');

var _access_token = require('../models/access_token');

var _access_token2 = _interopRequireDefault(_access_token);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _default = require('../../config/default.json');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var list = exports.list = function list(req, res) {
  res.render('admin/service/');
};

var _new = exports._new = function _new(req, res) {
  var server = req.body;

  var _server = new _service.Service(server);

  _access_token2.default.findOne({}, function (err, token) {
    if (err) {
      console.log(err);
      return;
    }
    if (token && token.length > 0) {

      // if((new Date()) - token.create_at < 1000*60*60*2){
      //   new_server(token.access_token);
      // }else{
      _request2.default.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + _default2.default.wx.app_id + '&secret=' + _default2.default.wx.app_secret, function (err, response, body) {
        token.create_at = new Date();
        var _body = JSON.parse(body);
        var access_token = _body.access_token;
        token.access_token = access_token;
        token.save();
        new_server(access_token);
      });
      // }
    } else {
      _request2.default.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + _default2.default.wx.app_id + '&secret=' + _default2.default.wx.app_secret, function (err, response, body) {
        var _token = {};
        _token.create_at = new Date();
        var _body = JSON.parse(body);
        console.log(_body);
        var access_token = _body.access_token;
        _token.access_token = access_token;
        _token.save();
        new_server(access_token);
      });
    }

    function new_server(access_token) {
      _request2.default.post('https://api.weixin.qq.com/customservice/kfaccount/add?access_token=' + token.access_token, server, function (result) {
        console.log(result);
      });
    }
  });
  _server.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/service');
  });
};