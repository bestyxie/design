import Order from '../models/order';
import { Returns } from '../models/returns';
import xto from 'xto';


export const goods = (req,res) => {
  let orderid = req.query.orderid;

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    if(order.status == 3){
      xto.query(number,name,(err,express) => {
        if(err){
          console.log(err);
          res.send(err);
        }
        
      })
    }
    res.render('mobile/returnOrder/',{
      order: order
    })
  })
}

export const reply = (req,res) => {
  let _order = req.body.ret;
  let orderid = _order.orderid;
  let file = req.files[0];
  file = '/images/upload/'+file.filename

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    _order.status = '1';
    _order.products = order.products;
    _order.pics = file;

    let ret_order = new Returns(_order);
    ret_order.save((err) => {
      if(err){
        console.log(err);
        res.send(err);
      }
      res.render('mobile/returnOrder/success',{
        p: '申请成功！请耐心等待审核'
      })
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

export const get_express = (req,res) => {
  let name = req.query.name;
  let number = req.query.number;

  xto.query(number,name,(err,express) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }

    res.json(express);
  })
}