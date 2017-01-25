export const unique = function(arr){
  arr.sort();
  let res = [arr[0]];
  for(let i=1,len=arr.length;i<len;i++){
    if(arr[i].toString() != res[res.length-1].toString()){
      res.push(arr[i]);
    }
  }
  return res;
}

export const remove_item = function(arr,remv){
  let res = [], save = [];
  for(let i=0,len=remv.length;i<len;i++){
    res.push(remv[i].toString());
  }
  for(let i=0,len=arr.length;i<len;i++){
    if(res.indexOf(arr[i].toString())<0){
      save.push(arr[i]);
    }
  }
  return save;
}