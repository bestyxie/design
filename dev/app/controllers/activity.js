import {Activity} from '../models/activity';

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

export const new_act = (req,res) => {}

export const update_act = (req,res) => {}

export const delet_act = (req,res) => {}