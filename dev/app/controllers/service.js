import {Service} from '../models/service';
import AccessToken from '../models/access_token';
import request from 'request';
import config from '../../config/default.json';
import crypto from 'crypto';

export const list = (req,res) => {
  res.render('admin/service/');
}

export const _new = (req,res) => {
  let server = req.body;

  server.password = crypto.createHash('md5').update(server.password).digest('hex');

  let _server = new Service(server);

  AccessToken.findOne({},(err,token) => {
    if(err){
      console.log(err);
      return;
    }
    if(token && token.length>0){

      // if((new Date()) - token.create_at < 1000*60*60*2){
      //   new_server(token.access_token);
      // }else{
        request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wx.app_id+'&secret='+config.wx.app_secret,function(err,response,body){
          token.create_at = new Date();
          let _body = JSON.parse(body);
          let access_token = _body.access_token;
          token.access_token = access_token;
          token.save();
          new_server(access_token);
        })
      // }
    }else{
      request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wx.app_id+'&secret='+config.wx.app_secret,function(err,response,body){
        let _token = {}
        _token.create_at = new Date();
        let _body = JSON.parse(body);
        console.log(_body);
        let access_token = _body.access_token;
        _token.access_token = access_token;
        _token = new AccessToken(_token);
        _token.save();
        new_server(access_token);
      })
    }

    function new_server(access_token){
      request.post('https://api.weixin.qq.com/customservice/kfaccount/add?access_token='+access_token,server,function(result){
        console.log(result);
      });

    }
    
  })
  _server.save((err) => {
    if(err){
      console.log(err);
    }
    res.redirect('/service');
  });
}