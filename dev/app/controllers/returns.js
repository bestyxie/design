import Order from '../models/order';
import { Returns } from '../models/returns';
import xto from 'xto';
import request from 'request';
import WechatPay from './wxpay';
const API = require('wechat-api');
const config = require('../../config/default.json').wx;
const api = new API(config.app_id,config.app_secret);


export const _return = (req,res) => {
  let orderid = req.query.orderid;

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }

    res.render('mobile/returnOrder/reply',{
      order: order
    })
  })
}

export const apply = (req,res) => {
  let _order = req.body.ret;
  let orderid = _order.orderid;
  let file = req.files[0] || '';
  file = '/images/upload/'+file.filename

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    _order.status = 1;
    _order.products = order.products;
    _order.pics = file;
    _order.user_id = req.session.user._id;

    let ret_order = new Returns(_order);
    ret_order.save((err) => {
      if(err){
        console.log(err);
        res.send(err);
      }
      Order.findOneAndUpdate({_id: orderid},{status: '退款退货'},(err) => {
        if(err){
          console.log(err);
          res.send(err);
        }
        res.render('mobile/returnOrder/success',{
          p: '申请成功！请耐心等待审核'
        })
      });
      
    })
    
  })

}

export const admin_retlist = (req,res) => {

  Returns.find({},(err,orders) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('admin/returns/',{
      orders: orders
    })
  })
}

export const adopt = (req,res) => {
  let retid = req.body.returnid;
  let address = req.body.address;
  let status = req.body.status;
  let data = {
    address: address,
    status: status
  }

  Returns.findOneAndUpdate({_id: retid},data,(err) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }

    res.json({success: false});
  })
}

export const get_return = (req,res) => {
  let userid = req.session.user._id;

  Returns.find({user_id: userid,status: {'$lte': 2}},(err,returns) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/returnOrder/',{
      orders: returns
    })
  })
}

export const complete = (req,res) => {
  let _id = req.query._id;

  Returns.findOneAndUpdate({_id: _id},{status: 3},(err,ret) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }

    Order.findOneAndUpdate({_id: ret.orderid},{status: '交易关闭'},(err,order) => {
      if(err){
        console.log(err);
        return;
      }
      let pay = new WechatPay();
      let data = {
        appid: config.app_id,
        mch_id: config.partner,
        nonce_str: pay.createNonceStr,
        sign: 'xxx',
        transaction_id: order.transaction_id,
        total_fee: order.total*100,
        refund_fee: order.total*100,
        op_user_id: req.session.user._id,
        out_refund_no: ret._id
      }
      data.sign = pay.getSign({
        appid: config.app_id,
        mch_id: config.partner,
        nonce_str: pay.createNonceStr,
        timestamp: Date.now()
      });
      request.post('https://api.mch.weixin.qq.com/secapi/pay/refund',data,(err,res,body) => {
        let result = body && JSON.parse(body);
        if(result.return_code == 'SUCCESS'){
          // do something
        }
      })
      console.log(order);
    });
    res.json({success: true});
  })
}