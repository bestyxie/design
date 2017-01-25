import Product from '../models/product';

export const add_act = (ids,act_id) => {
  Product.find({_id: {'$in': ids}},(err,prods) => {
    for(let i=0,len=prods.length;i<len;i++){
      prods[i].activity = act_id;
      prods[i].save();
    }
  })
}

export const remove_act = (ids) => {
  Product.find({_id: {'$in': ids}},(err,prods) => {
    for(let i=0,len=prods.length;i<len;i++){
      prods[i].activity = '';
      prods[i].save();
    }
  })
}