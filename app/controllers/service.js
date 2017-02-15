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

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API = require('wechat-api');
var api = new API(_default2.default.app_id, _default2.default.app_secret);

var list = exports.list = function list(req, res) {
  // AccessToken.findOne({},(err,token) => {
  //   if(err){
  //     console.log(err);
  //     return;
  //   }
  //   if(token && token.length>0){

  //     if((new Date()) - token.create_at < 1000*60*60*2){
  //       request.get('https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token='+token.access_token,function(err,response,body){
  //         let _body = JSON.parse(body);
  //         console.log('body::',body);
  //       })
  //     }
  //   }
  // })
  api.getCustomServiceList(function (err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.render('admin/service/', {
      kf_list: result.kf_list
    });
  });
};

var _new = exports._new = function _new(req, res) {
  var service = req.body.service;
  service.password = _crypto2.default.createHash('md5').update(service.password).digest('hex');

  var _server = new _service.Service(service);

  // AccessToken.findOne({},(err,token) => {
  //   if(err){
  //     console.log(err);
  //     return;
  //   }
  //   if(token && token.length>0){

  //     if((new Date()) - token.create_at < 1000*60*60*2){
  //       new_server(token.access_token);
  //     }else{
  //       request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wx.app_id+'&secret='+config.wx.app_secret,function(err,response,body){
  //         token.create_at = new Date();
  //         let _body = JSON.parse(body);
  //         let access_token = _body.access_token;
  //         token.access_token = access_token;
  //         token.save();
  //         new_server(access_token);
  //       })
  //     }
  //   }else{
  //     request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wx.app_id+'&secret='+config.wx.app_secret,function(err,response,body){
  //       let _token = {}
  //       _token.create_at = new Date();
  //       let _body = JSON.parse(body);
  //       console.log(_body);
  //       let access_token = _body.access_token;
  //       _token.access_token = access_token;
  //       _token = new AccessToken(_token);
  //       _token.save();
  //       new_server(access_token);
  //     })
  //   }

  //   function new_server(access_token){
  //     request.post('https://api.weixin.qq.com/customservice/kfaccount/add?access_token='+access_token,service,function(result){
  //       console.log(result);
  //     });

  //   }

  // })
  api.addKfAccount(service.kf_account + "@gh_c2f1e87fd5ab", service.nickname, service.password, function (err, result) {});
  _server.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/service');
  });
};