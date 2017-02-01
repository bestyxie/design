import { Address } from '../models/address';
let User = require('../models/user');

export const add = (req,res) => {
  let addr = req.body.address;
  let userid = req.body.userid;

  let _address = new Address(addr);
  _address.save((err,address) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    res.json({success: true,addr_id: address._id});
  });
}