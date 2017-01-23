import {Activity} from '../models/activity';
import Product from '../models/product';
import {deletePic} from '../common/delete_file';

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

export const new_act = (req,res) => {
  let activity = req.body;
  let pic = '/images/upload/' + req.files[0].filename;
  activity.pic = pic;
  console.log(activity);
  let _activity = new Activity(activity);
  _activity.save(err => {
    if(err){
      res.send(err);
    }
    res.redirect('/admin/activity');
  })
}

export const update_act = (req,res) => {}

export const delet_act = (req,res) => {
  let _id = req.body._id;

  Activity.findOneAndRemove({ _id: _id },(err,act) => {
    if(err){
      res.json({ success: false });
    }
    deletePic(act.pic);
    res.json({ success: true });
  });
}