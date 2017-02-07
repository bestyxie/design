import {Wcuser} from '../models/wcuser';
import {base_set,ANCHOR,base_url,getAccesstoken,getUserinfo} from './weixin';
import qs from 'querystring';
import request from 'request';


// mobile端必须登录midware
module.exports.msigninRequire = (req,res,next) =>{
  let code = req.query.code;
  let state = req.query.state;
  console.log('code::',code);
  console.log('session::',req.session);
  if(code && state == 'base') {
    let promise = getAccesstoken(code);
    promise.then(openid => {
      console.log(openid);
      Wcuser.find({openid: openid},(err,user) => {
        if(err){
          console.log(err);
          res.redirect('/');
        }
        if(user.length == 0){
          authorize();
        }else{
          req.session.user = {};
          req.session.user._id = user._id;
          next();
        }
      });
    })
  }
  else if(state !== 'base'){
    let promise = getAccesstoken(code);
    promise.then(user => {
      let new_user = {};
      new_user.openid = user.openid;
      new_user.nickname = user.nickname;
      new_user.headimgurl = user.headimgurl;

      let _user = new Wcuser(new_user);
      _user.save((err,wc) => {
        if(err){
          console.log(err);
          res.redirect('/')
        }
        req.session.user = {};
        req.session.user._id = wc._id;
        next();
      })
    })
  }
  else if(req.session.user){
    next();
  }
  function authorize(){
    base_set.scope="snsapi_userinfo";
    base_set.redirect_uri = encodeURI('http://bestyxie.cn/cart');
    console.log('1::',qs.stringify(base_set));
    let snsapi_base = base_url+qs.stringify(base_set)+ANCHOR;
    console.log('2::',snsapi_base)
    res.redirect(snsapi_base);
  }
}