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

      res.render('mobile/order/create_order',{
        products: _prodts,
        user_id: user_id,
        count: count,
        sum: sum,
        addrs: addrs,
        default_addr: default_addr[0]
      });
    });
  },() => {
    res.redirect('/cart');
  })
}

export const submit_order = (req,res) => {
  let order_msg = req.body.order;
  let userId = order_msg.user_id;

  let promise = new Promise((resolve,reject) => {
    ShoppingCart.findOne({userId: userId},(err,carts) => {
      if(err){
        console.log(err);
        reject();
      }
      let prodts = carts.products;
      let _prodts = [], _prod_msg = [],rest = [];
      let count = 0, sum = 0;
      if ( Array.isArray(order_msg.productId) ){
        _prod_msg = toString(order_msg.productId);
      }
      else {
        _prod_msg.push(order_msg.productId.toString());
      }

      for(let i = 0,len = prodts.length;i<len;i++) {
        if( _prod_msg.indexOf(prodts[i].productId.toString()) > -1 ) {
          _prodts.push(prodts[i]);
          count += prodts[i].qty;
          sum += prodts[i].qty*prodts[i].price;
        }else{
          rest.push(prodts[i]);
        }
      }
      delete carts.products;
      delete order_msg.prodts;
      carts.products = rest;
      order_msg.products = _prodts;
      order_msg.status = "待付款";
      carts.save((err,result) => {
        if(err){
          console.log(err);
          return;
        }
      });
      resolve(order_msg);
    })
  });
  promise.then((order) => {
    Address.findOne({_id: order.address},{recipient: 1,tel: 1,address: 1},(err,addr) => {
      if(err){
        console.log(err);
        res.send(err);
      }
      delete order.address;
      order.address = addr;
      let _order = new Order(order);
      _order.save((err) => {
        if(err){
          console.log(err);
          return;
        }
        res.redirect('/');
      })
    })

  })
}

export const order_list = (req,res) => {
  let user_id = req.session.user._id;
  let status = req.query.status;
  let condiction = {}
  condiction.user_id = user_id;
  if(status) {
    condiction.status = status;
  }

  Order.find(condiction,(err,orders) => {
    res.render('mobile/order/',{
      orders: orders
    })
  })
}

export const paying = (req,res) => {
}

export const getAll_paid = (req,res) => {
  // {status: '待发货'}
  Order.find({},(err,orders) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    res.render('admin/delivery/',{
      orders: orders
    });
  });
}

export const update = (req,res) => {
  let orderid = req.body.orderid;
  let express_msg = req.body.express_msg;

  Order.findOne({_id: orderid},(err,order) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    order.express_msg = express_msg;
    order.save(err => {
      if(err) {
        console.log(err);
        res.json({success: false});
      }
      res.json({success: true});
    })
  })
}