import {esClient} from './client';

export function search(data,callback){
  let match = {};
  switch(data.type) {
    case 'labels':
      match.labels = data.q;
      break;
    case 'color':
      match.color = data.q;
      break;
    case 'description':
      match.description = data.q;
      break;
    default:
      match.name = data.q;
  }

  console.log(match);
  esClient.search({
    index: 'prod',
    type: 'product',
    body: {
      query: {
        match: match
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
      });
      callback(res.hits.hits);
    }
  })
}
