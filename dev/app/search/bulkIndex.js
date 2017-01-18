import {esClient} from './client';
      
let bulk = []
export const makebulk = (products,callback) => {
  for(let i = 0,len = products.length;i<len;i++){
    bulk.push(
      { index: {_index: 'prod', _type: 'product', _id: products[i]._id} },
      {
        'name': products[i].name,
        'labels': products[i].labels.join(" "),
        'color': products[i].color.join(" "),
        'description': products[i].description,
        'pics': products[i].pics.join(' '),
        'price': products[i].price,
        'discount': products[i].discount
      }
    );
  }
  callback(bulk);
}

export const indexall = (madebulk,callback) => {
  esClient.bulk({
    maxRetries: 5,
    index: 'prod',
    type: 'product',
    body: madebulk
  }, (err,res,status) => {
    if(err){
      console.log(err);
    }
    else{
      callback(res.items);
    }
  })
}

export const create_doc = (product,callback) => {
  console.log(product._id.toString());
  esClient.create({
    index: 'prod',
    type: 'product',
    id: product._id.toString(),
    body: {
      'name': product.name,
      'labels': product.labels.join(" "),
      'color': product.color.join(" "),
      'description': product.description,
      'pics': product.pics.join(' '),
      'price': product.price,
      'discount': product.discount
    }
  },(err,res,status) => {
    if(err){
      console.log(err);
    }
    callback(res);
  })
}