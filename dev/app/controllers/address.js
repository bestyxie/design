import { Address } from '../models/address';

export const add = (req,res) => {
  let addr = req.body.address;
  let userid = addr.user;
  console.log(addr);

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
  let _addr = req.body.address;
  let userid = req.body.userid;
  console.log(_addr);

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

export const getAddr = (req,res) => {
  let condiction = {};
  condiction._id = req.query._id;
  let isdefault = req.query.default;
  if(isdefault != undefined){
    condiction.default = isdefault;
  }

  Address.findOne(condiction,(err,addr) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    res.json({success: true,address: addr});
  })
}

export const remove = (req,res) =>{
  let _id = req.query._id;

  Address.findOneAndRemove({_id: _id},(err) => {
    if(err){
      console.log(err);
      res.json({success: false});
      return;
    }
    res.json({success: true});
  });
}

export const addr_list = (req,res) => {
  var userid = req.session.user._id;
  console.log(userid);

  Address.find({user: userid},(err,addrs) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('mobile/order/order_list',{
      addrs: addrs
    })
  })
}