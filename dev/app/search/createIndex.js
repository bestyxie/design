import {esClient} from './client';

export function create(){
  esClient.indices.create({
    index: 'prod'
  },(err,res,status) => {
    if(err){
      console.log(err);
    }else {
      console.log('create',res);
    }
  });
}