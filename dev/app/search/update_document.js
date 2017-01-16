import {esClient} from './client';

export const update_doc = function(product){
  esClient.update({
    index: 'prod',
    type: 'product',
    id: product._id,
    body: {
      params: {
        'name': product.name,
        'labels': product.labels.join(' '),
        'color': product.color.join(' '),
        'description': product.description
      }
    }
  })
}