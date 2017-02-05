import Order from '../models/order';
import { Returns } from '../models/returns';


export const goods = (req,res) => {
  let orderid = req.query.orderid;

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/returnOrder/',{
      order: order
    })
  })
}

export const reply = (req,res) => {
  let _order = req.body.order;
  let orderid = req.body.orderid;
  let file = req.files
  file = '/images/upload/'+file.filename

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    _order.status = '1';
    _order.products = order.products;
    _order.pics = file;
    console.log(_order);
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