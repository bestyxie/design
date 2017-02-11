import { Activity } from '../models/activity';
import Product from '../models/product';
import { deletePic } from '../common/delete_file';
import { unique,remove_item } from '../common/unique';
import { add_act,remove_act } from '../common/add_activity_product';

export const list = (req,res) => {
  let promise = new Promise((resolve,reject) => {
    Product.find({},{_id: 1,name: 1,labels: 1,pics: 1,activity: 1}).limit(20).exec((err,products)=>{
      if(err){
        console.log(err);
        reject(err);
      }
      Product.count({},(err,count) => {
        if(err){
          reject(err);
        }
        resolve({products: products,count: count});
      })
    });
  });
  promise.then((result) => {
    Activity.find({},(err,acts) => {
      // console.log(result.count);
      if(err) {
        res.send(err);
      }
      res.render('admin/activity/',{
        activities: acts,
        products: result.products,
        count: result.count
      });
    })
  },err => {
    console.log(err);
    res.send(err);
  })
}

export const new_act_page = (req,res) => {
  Product.find({},{_id:1,name: 1,pics: 1,labels: 1}).limit(10).exec((err,prods)=> {
    if(err) {
      res.send(err);
    }
    Product.count({},(err,count) => {
      res.render('admin/activity/new_activity',{
        products: prods,
        count: count
      });
    })
  })
}

export const new_act = (req,res) => {
  let activity = req.body.act;
  let pic = '/images/upload/' + req.files[0].filename;
  activity.pic = pic;
  console.log(activity);
  let _activity = new Activity(activity);
  _activity.save(err => {
    if(err){
      res.send(err);
    }
    Product.where({_id: {'$in': activity.products}}).update({discount: activity.discount})
    res.redirect('/admin/activity');
  })
}

export const update_act = (req,res) => {
  let products = req.body.vals;
  let _id = req.body._id;
  let type = req.body.type;

  Activity.findOne({_id: _id},(err,act) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    try{
    if(type == 'delete'){
      act.products = remove_item(act.products,products);
      remove_act(products);
    }else{
      act.products = unique(act.products.concat(products));
      add_act(act.products,_id);
    }
    }
    catch(err){
      console.log(err);
    }
    act.save(err => {
      if(err){
        console.log(err);
        res.json({success: false});
      }
      res.json({success: true});
    });
  })
}

export const delet_act = (req,res) => {
  let _id = req.body._id;

  Activity.findOneAndRemove({ _id: _id },(err,act) => {
    if(err){
      res.json({ success: false });
    }
    deletePic([act.pic]);
    res.json({ success: true });
  });
}

export const get_act_products = (req,res) => {
  let _id = req.query._id;

  Activity.findOne({_id: _id},{products: 1},(err,act) => {

    Product.find({_id: {'$in': act.products}},{_id: 1,name: 1,pics: 1,labels: 1},(err,prods) => {
      let data = {};
      data.prods = prods;
      data.count = prods.length;
      res.json(data);
    })
  })
}