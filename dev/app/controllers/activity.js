import {Activity} from '../models/activity';
import Product from '../models/product';

export const list = (req,res) => {
  Activity.find({},(err,acts) => {
    if(err) {
      res.send(err);
    }
    res.render('admin/activity/',{
      activities: acts
    });
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

export const new_act = (req,res) => {}

export const update_act = (req,res) => {}

export const delet_act = (req,res) => {}