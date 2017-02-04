import Evaluation from '../models/evaluation';
import Order from '../models/order';

export const evaluate = (req,res) => {
  let orderid = req.query._id;
  console.log(orderid);

  Order.findOne({_id: orderid},{user_id: 1,products: 1},(err,order) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/evaluation/evaluate',{
      order: order
    });
  })
}

export const subimit = (req,res) => {
  let prod_id = req.body.prod.product_id;
  let user_id = req.body.user_id;
  let files = req.files;
  let comments = {};

  function save_evl(prod_id,index){
    console.log(index);
    let msg = req.body[prod_id];
    comments.product_id = prod_id;
    comments.user_id = user_id;
    comments.content = msg.content;
    comments.grade = msg.grade;
    comments.imgs = req.files[0].path;
    let _evaluation = new Evaluation(comments);
    _evaluation.save(err => {
      if(err){
        console.log(err);
        res.send(err);
      }
    })
    
  }
  if(Array.isArray(prod_id)){
    for(let i=0;i<prod_id.length;i++){
      (function(prod_id,index){
        save_evl(prod_id,index)
      })(prod_id[i],i)
    }
  }else{
    save_evl(prod_id,0)
  }
  res.redirect('/order');
}