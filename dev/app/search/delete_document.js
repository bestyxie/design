import {esClient} from './client';

export const delete_doc = function(id){
  esClient.delete({
    index: 'prod',
    type: 'product',
    id: id
  });
}