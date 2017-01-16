import {esClient} from './client';

export function search(q,callback){
  console.log(q);
  esClient.search({
    index: 'prod',
    type: 'product',
    body: {
      query: {
        match: { "description": q }
      }
    }
  }, (err,res,status) => {
    if(err){
      console.log('search error: '+err);
      callback(err);
    }
    else {
      console.log("-- Response --");
      console.log(res);
      console.log("-- Hits --");
      res.hits.hits.forEach((hit) => {
        console.log(hit);
      })
      callback(res.hits.hits);
    }
  })
}
