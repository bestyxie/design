import {esClient} from './client';

// export const bulkIndex = function(index,type,data) {
//   let bulkBody = [];
//   data.forEach(item => {
//     bulkBody.push(
//       { index: {_index: index, _type: type, _id: item._id } },
//       item
//     );

//     bulkBody.push(item);
//   });

//   esClient.bulk({
//     maxRetries: 5,
//     index: 'prod',
//     type: 'product',
//     body: bulkBody
//   },(err,res,status) => {
//     if(err){
//       console.log('err:',err);
//     }
//     else {
//       console.log('normal:',res);
//     }
//   });
// }
      
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