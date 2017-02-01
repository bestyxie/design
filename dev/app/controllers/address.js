import { Address } from '../models/address';
let User = require('../models/user');

export const add = (req,res) => {
  let addr = req.body.address;
  let userid = addr.user;

  let _address = new Address(addr);
  if(addr.default){
    Address.findOne({user: userid,default: true},(err,address) => {
      if(err){
        console.log(err);
        return;
      }
      if(address && address.length>0){
        address.default = false;
        console.log(address);
        address.update();
      }

    })
  }
  _address.save((err,address) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    res.json({success: true,addr_id: address._id});
  });
}

export const update = (req,res) => {
  let _id = req.body._id;
  let _addr = req.body._addr;
  console.log(_addr);

  Address.findOneAndUpdate({_id: _id},_addr,null,(err,addr) => {
    if(err){
      console.log(err);
      res.json({success: false});
      return;
    }
    res.json({success:true});
  })
}