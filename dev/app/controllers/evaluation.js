import evaluation from '../models/evaluation';
import Order from '../models/order';

export const evaluate = (req,res) => {
  let orderid = req.query._id;

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/evaluation/evaluate',{user_id: 1,products: 1},{
      order: order
    });
  })
}

export const subimit = (req,res) => {
  console.log(req.body.order);
  res.redirect('/order');
}