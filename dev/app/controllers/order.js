import Order from '../models/order';
import ShoppingCart from '../models/ShoppingCart';
import { toString } from '../common/unique';
import { Address } from '../models/address';

export const create_order = (req,res) => {
  let prod_msg = req.body.products;
  let user_id = prod_msg.user_id;
  let count = 0, sum = 0;

  let promise = new Promise((resolve,reject) => {
    Address.find({user: user_id},(err,addrs) => {
      if(err){
        console.log(err);
        reject();
      }
      resolve(addrs);
    })
  })
  promise.then(addrs => {
    ShoppingCart.findOne({userId: user_id},{products: 1},(err,prodts) => {
      let _prodts = [], _prod_msg = [];
      
      if ( Array.isArray(prod_msg._id) ){
        _prod_msg = toString(prod_msg._id);
      }
      else {
        _prod_msg.push(prod_msg._id.toString());
      }

      for(let i = 0,len = prodts.products.length;i<len;i++) {
        if( _prod_msg.indexOf(prodts.products[i].productId.toString()) > -1 ) {
          _prodts.push(prodts.products[i]);
          count += prodts.products[i].qty;
          sum += prodts.products[i].qty*prodts.products[i].price;
        }
      }

      let default_addr = addrs.filter(function(addr) {
        if(addr.default){
          return addr;
        }
      });
      console.log('default_addr:::',default_addr)

      res.render('mobile/order/create_order',{
        products: _prodts,
        user_id: user_id,
        count: count,
        sum: sum,
        addrs: addrs,
        default_addr: default_addr[0]
      });
    });
  })
}

export const submit_order = (req,res) => {
  let order_msg = req.body.order;
  let userId = order_msg.user;

  let promise = new Promise((resolve,reject) => {
    ShoppingCart.findOne({userId: userId},{products: 1},(err,prodts) => {
      let _prodts = [], _prod_msg = [];
      console.log(prodts);
      
      if ( Array.isArray(order_msg._id) ){
        _prod_msg = toString(order_msg._id);
      }
      else {
        _prod_msg.push(order_msg._id.toString());
      }

      for(let i = 0,len = prodts.products.length;i<len;i++) {
        if( _prod_msg.indexOf(prodts.products[i].productId.toString()) > -1 ) {
          _prodts.push(prodts.products[i]);
          count += prodts.products[i].qty;
          sum += prodts.products[i].qty*prodts.products[i].price;
        }
      }
      delete order_msg.prodts;
      order_msg.products = _prodts;
      order_msg.status = false;
      console.log(order_msg);
      resolve(order_msg);
    })
  });
  promise.then((order) => {
    let _order = new Order(order);
    _order.save(() => {
      res.redirect('/');
    })
  })
}