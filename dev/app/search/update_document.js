import {esClient} from './client';

export const update_doc = function(product){
  esClient.update({
    index: 'prod',
    type: 'product',
    id: product._id.toString(),
    body: {
      doc: {
        'name': product.name,
        'labels': product.labels.join(' '),
        'color': product.color.join(' '),
        'description': product.description,
        'pics': product.pics.join(' '),
        'price': product.price,
        'discount': product.discount
      }
    }
  },(err,res) => {
    if(err){
      console.log(err);
    }
  })
}