import Order from '../models/order';
import ShoppingCart from '../models/ShoppingCart';
import { toString } from '../common/unique';

export const create_order = (req,res) => {
  let prod_msg = req.body.products;
  let user_id = prod_msg.user_id;
  let count = 0, sum = 0;

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
        sum += prodts.products[i].qty*prodts.products[i].qty;
      }
    }

    res.render('mobile/order/create_order',{
      products: _prodts,
      user_id: user_id,
      count: count,
      sum: sum
    });
  })
}