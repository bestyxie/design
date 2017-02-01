import { Address } from '../models/address';
let User = require('../models/user');

export const add = (req,res) => {
  let addr = req.body.address;
  let userid = addr.user;

  let _address = new Address(addr);
  
  if(addr.default){
    Address.findOneAndUpdate({user: userid,default: true},{default: false},(err,address) => {
      if(err){
        console.log(err);
        return;
      }
    });
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
  let userid = req.body.userid;

  let promise = new Promise((resolve,reject) => {
    if(_addr.default){
      Address.findOneAndUpdate({user: userid,default: true},{default: false},null,(err,addr) => {
        if(err){
          console.log(err);
          reject(err);
        }
        resolve();
      })
    }else{
      resolve();
    }
  })

  promise.then(() =>{
    Address.findOneAndUpdate({_id: _id},_addr,null,(err,addr) => {
      if(err){
        console.log(err);
        res.json({success: false});
        return;
      }
      res.json({success:true});
    })
  },err => {
    console.log(err);
  })
}