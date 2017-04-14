import {Wcuser} from '../models/wcuser';
import {base_set,ANCHOR,base_url,getAccesstoken,getUserinfo} from './weixin';
import Order from '../models/order';
import qs from 'querystring';
import request from 'request';


// mobile端必须登录midware
module.exports.msigninRequire = (req,res,next) =>{
  let code = req.query.code;
  let state = req.query.state;
  
  if(code && state == 'base'&& !req.session.user) {
    let promise = getAccesstoken(code);
    promise.then(result => {
      Wcuser.findOne({openid: result.openid},(err,user) => {
        if(err){
          console.log(err);
          res.redirect('/');
        }
        if(user == null || user.length == 0){
          authorize();
        }else{
          req.session.user = {};
          req.session.user._id = user._id;
          req.session.user.openid = user.openid;
          // cookie
          res.cookie('openid',user.openid,{ expires: new Date(Date.now()+1000*60*60*24*365),httpOnly: true});
          next();
        }
      });
    })
  }
  else if(state !== 'base'&& !req.session.user){
    let promise = getAccesstoken(code);
    promise.then((result) => {
      return getUserinfo(result.openid,result.access_token);
    }).then(user => {
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
        req.session.user.openid = wc.openid;
        // cookie
        res.cookie('openid',wc.openid,{ expires: new Date(Date.now()+60*60*24*365),httpOnly: true});

        next();
      })
    })
  }
  else if(req.session.user){
    next();
  }else if(!req.session.user){
    authorize();
  }
  function authorize(){
    let path = req.path;
    base_set.scope="snsapi_userinfo";
    base_set.redirect_uri = encodeURI('http://bestyxie.cn'+path);
    let snsapi_base = base_url+qs.stringify(base_set)+ANCHOR;

    res.redirect(snsapi_base);
  }
}

// 用户主页
module.exports.homepage = function(req,res){
  let user_id = req.session.user._id;
  new Promise((resolve,reject) => {
    Order.find({user_id: user_id},function(err,orders){
      if(err){
        reject(err);
      }
      var result = {
        wait_delive: 0,
        wait_pay: 0,
        wait_reciept: 0,
        wait_comm: 0,
        ret: 0
      }
      for(var i=0,len=orders.length;i<len;i++){
        switch(orders[i].status){
          case "待付款":
            result.wait_pay++; break;
          case "待发货":
            result.wait_delive++; break;
          case "待收货":
            result.wait_reciept++; break;
          case "待评价":
            result.wait_comm++; break;
          case "待退款":
            result.ret++; break;
          default: ;
        }
      }
      resolve(result);
    })
  }).then(result => {
    Wcuser.findOne({_id: user_id},(err,user) => {
      if(err){
        console.log(err);
        res.send(err);
      }
      if(!user){
        res.send('请登录')
      }
      result.user = user;
      res.render('mobile/user/',result);
    })
    
  })
}

module.exports.list = function(req,res){
  Wcuser.find({},function(err,users){
    if(err){
      res.send(err);
    }

    res.render('admin/wcuser/',{
      users: users
    })
  })
}

module.exports.delete_wc = function(req,res){
  var _id = req.body._id;

  Wcuser.findOneAndRemove({_id: _id},function(err,result){
    if(err){
      console.log(err);
      res.json({err: err});
    }
    res.json({success: true});
    console.log(result);
  })
}