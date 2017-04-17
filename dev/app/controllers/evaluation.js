import Evaluation from '../models/evaluation';
import Order from '../models/order';
import {Wcuser} from '../models/wcuser';

export const evaluate = (req,res) => {
  let orderid = req.query._id;

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
  let prodts = req.body.prod;
  let user_id = req.body.user_id;
  let orderid = req.body.order_id;
  let files = req.files;
  let comments = {};

  files = files.map(function(item){
    return '/images/upload/'+item.filename
  });

  function save_evl(prodt,index){
    let prod_id = prodt.product_id;
    let msg = req.body[prod_id];
    comments.size = prodt.size;
    comments.color = prodt.color;
    comments.product_id = prod_id;
    comments.user_id = user_id;
    comments.content = msg.content;
    comments.grade = msg.grade;
    comments.imgs = req.files[0] ? req.files[0].path : '';
    Wcuser.findOne({_id: user_id},(err,user) => {
      comments.user_headimgurl = user.headimgurl;
      comments.user_nickname = user.nickname;
      let _evaluation = new Evaluation(comments);
      _evaluation.save(err => {
        if(err){
          console.log(err);
          res.send(err);
        }
      })
    })
    
  }
  if(Array.isArray(prodts)){
    for(let i=0;i<prodts.length;i++){
      (function(prodts,index){
        save_evl(prodts,index)
      })(prodts[i],i)
    }
  }else{
    save_evl(prodts,0)
  }
  Order.findOneAndUpdate({_id: orderid},{evaluate: true,status: "交易完成"},(err) => {
    if(err){
      console.log(err);
    }
  });
  res.redirect('/order');
}

export const list = (req,res) => {
  let product_id = req.query.id;

  Evaluation.find({product_id: product_id}).sort({'meta.updateAt':-1}).exec((err,evls) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/evaluation/',{
      evls: evls
    });
  })
}