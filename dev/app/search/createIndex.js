import {esClient} from './client';
import {makebulk, indexall} from './bulkIndex';

export function create(products){
  esClient.indices.create({
    index: 'prod'
  },(err,res,status) => {
    if(err){
      console.log(err);
    }else {
      console.log('create',res);
      makebulk(products,function(response){
        console.log("Bulk content prepared");
        indexall(response,function(response){
          console.log(response);
        })
      });
    }
  });
}