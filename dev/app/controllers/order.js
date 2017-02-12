import Order from '../models/order';
import ShoppingCart from '../models/ShoppingCart';
import { toString } from '../common/unique';
import { Address } from '../models/address';
import xto from 'xto';
import WechatPay from './wxpay';
var xml2jsparseString = require('xml2js').parseString;
const API = require('wechat-api');
const config = require('../../config/default.json').wx;
const api = new API(config.app_id,config.app_secret);

export const create_order = (req,res) => {
  let prod_msg = req.body.products;
  let user_id = prod_msg.user_id;
  let count = 0, sum = 0;

  prod_msg.openid = req.session.user.openid;

  let promise = new Promise((resolve,reject) => {
    Address.find({user: user_id},(err,addrs) => {
      if(err){
        console.log(err);
        reject();
      }
      console.log(addrs)
      resolve(addrs);
    })
  })
  promise.then(addrs => {
    ShoppingCart.findOne({userId: user_id},{products: 1},(err,prodts) => {
      let _prodts = [], _prod_msg = [];
      
      if ( Array.isArray(prod_msg._id) ){
        _prod_msg = toString(prod_msg._id);
      }
      else {
        _prod_msg.push(prod_msg._id.toString());
      }

      for(let i = 0,len = prodts.products.length;i<len;i++) {
        if( _prod_msg.indexOf(prodts.products[i].productId.toString()) > -1 ) {
          _prodts.push(prodts.products[i]);
        }
      }

      let default_addr = addrs.filter(function(addr) {
        if(addr.default){
          return addr;
        }
      });
      console.log("default_addr::",default_addr);

      res.render('mobile/order/create_order',{
        products: _prodts,
        user_id: user_id,
        // count: count,
        // sum: sum,
        addrs: addrs,
        default_addr: default_addr[0]
      });
    });
  },() => {
    res.redirect('/cart');
  })
}

export const submit_order = (req,res) => {
  let order_msg = req.body.order;
  let userId = order_msg.user_id;

  let promise = new Promise((resolve,reject) => {
    ShoppingCart.findOne({userId: userId},(err,carts) => {
      if(err){
        console.log(err);
        reject();
      }
      let prodts = carts.products;
      let _prodts = [], _prod_msg = [],rest = [];
      let count = 0, sum = 0;
      if ( Array.isArray(order_msg.productId) ){
        _prod_msg = toString(order_msg.productId);
      }
      else {
        _prod_msg.push(order_msg.productId.toString());
      }

      for(let i = 0,len = prodts.length;i<len;i++) {
        if( _prod_msg.indexOf(prodts[i].productId.toString()) > -1 ) {
          _prodts.push(prodts[i]);
          count += prodts[i].qty;
          sum += prodts[i].qty*prodts[i].price;
        }else{
          rest.push(prodts[i]);
        }
      }
      delete carts.products;
      delete order_msg.prodts;
      carts.products = rest;
      order_msg.products = _prodts;
      order_msg.status = "待付款";
      carts.save((err,result) => {
        if(err){
          console.log(err);
          return;
        }
      });
      resolve(order_msg);
    })
  });
  promise.then((order) => {
    Address.findOne({_id: order.address},{recipient: 1,tel: 1,address: 1},(err,addr) => {
      if(err){
        console.log(err);
        res.send(err);
      }
      delete order.address;
      order.address = addr;
      let _order = new Order(order);
      _order.save((err,order) => {
        if(err){
          console.log(err);
          return;
        }
        res.redirect('/order/pay?_id='+order._id);
      })
    })

  })
}

export const pay = (req,res) => {
  let orderid = req.query._id;
  Order.findOne({_id: orderid},{_id: 1,total: 1,express: 1},function(err,order) {
    res.render('mobile/order/pay',{
      order: order
    })
  })
}

export const order_list = (req,res) => {
  let user_id = req.session.user._id;
  let status = req.query.status;
  let condiction = {}
  condiction.user_id = user_id;
  if(status) {
    condiction.status = status;
  }

  Order.find(condiction,(err,orders) => {
    res.render('mobile/order/',{
      orders: orders
    })
  })
}

export const complete = (req,res) => {
  let body = req.body;
  let orderid;
  xml2jsparseString(body, {async:true}, function (error, result) {
    if(result.xml.result_code =='SUCCESS'){
      orderid = result.xml.transaction_id;
      Order.findOneAndUpdate({_id: orderid},{status: '待发货',transaction_id: req.query.transaction_id},(err) => {
        if(err){
          console.log(err);
        }
      })
    }
  });
  res.render('mobile/order/pay_complete',{
    return_code: 'SUCCESS',
    return_msg: 'OK'
  });
}

export const paid = (req,res) => {
  res.render('mobile/order/pay_complete');
}

export const getAll_paid = (req,res) => {
  // {status: '待发货'}
  Order.find({},(err,orders) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('admin/delivery/',{
      orders: orders
    });
  });
}

export const update = (req,res) => {
  let orderid = req.body.orderid;
  let express_msg = req.body.express_msg;

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    order.express_msg = express_msg;
    order.status = '待收货';
    order.save(err => {
      if(err) {
        console.log(err);
        res.json({success: false});
      }
      /* 发货通知 start */
      let data = {
        appid: config.app_id,
        openid: order.openid,
        transid : order.transaction_id,
        out_trade_no : order._id,
        deliver_timestamp : Date.now()/1000,
        deliver_status : "1",
        deliver_msg : "ok",
        sign_method : "sha1" 
      };
      let wxpay = new WechatPay();
      data.app_signature = wxpay.getSign({
        appid: config.app_id,     //公众号名称，由商户传入
        appkey: config.wxpaykey,
        openid: order.openid,
        transid : order.transaction_id,
        out_trade_no : order._id,
        deliver_timestamp: data.deliver_timestamp,         //时间戳，自1970年以来的秒数
        deliver_status : "1",
        deliver_msg : "ok",
      });
      api.deliverNotify(data,(err,result)=>{});
      /* 发货通知 end */
      res.json({success: true});
    })
  })
}

export const express_msg = (req,res) => {
  let orderid = req.query.orderid;
  let name = req.query.name;
  let number = req.query.number;


  xto.query(number,name,(err,express) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    switch(name){
      case 'ems': express.com="EMS" 
        break;
      case 'shunfeng': express.com="顺丰速运" 
        break;
      case 'shentong': express.com='申通快递' 
        break;
      case 'yunda': express.com='韵达快递' 
        break;
      case 'yuantong': express.com='圆通快递' 
        break;
      case 'zhongtong': express.com='中通快递' 
        break;
      case 'huitongkuaidi': express.com='百世快递' 
        break;
      case 'tiantian': express.com='天天快递' 
        break;
    }
    let _data = [];
    for(let i=express.data.length-1;i>=0;i--){
      _data.push(express.data[i]);
    }
    res.render('mobile/express/',{express: express,orderid: orderid});
  })
}

export const receipt = (req,res) => {
  let orderid = req.query._id;

  Order.findOneAndUpdate({_id: orderid},{status: '交易完成'},(err) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/order/receipt',{
      _id: orderid
    });
  })
}

export const cancle = (req,res) => {
  let orderid = req.query.orderid;

  Order.findOneAndUpdate({_id: orderid},{status: '交易关闭'},function(err){
    if(err){
      console.log(err);
      res.json({success: false});
    }
    res.json({success: true});
  })
}

export const getsign = (req,res) => {
  let data = req.body;
  let wxpay = new WechatPay();
  data.spbill_create_ip = req.ip;
  wxpay.getBrandWCPayParams(data,function(err,responseData){
    console.log('err::',err);
    console.log('responseData::',responseData);
    res.json(responseData);
  })
}

export const wechat = (req,res) => {
  var param = {
    debug: false,
    jsApiList: ['chooseWXPay','uploadImage','onMenuShareTimeline', 'onMenuShareAppMessage'],
    url: req.body.url
  };
  console.log('url',req.body.url);
  api.getTicket(function(err,result){
    param.ticket = result.ticket;
    api.getJsConfig(param,function(err,result){
      console.log(result);
      res.send(result);
    })
  });
}