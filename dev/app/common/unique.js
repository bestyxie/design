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
  let save = [];
  let _arr = toString(arr);
  let _remv = toString(remv);

  for(let i=0,len=_arr.length;i<len;i++){
    if(_remv.indexOf(_arr)<0){
      save.push(arr[i]);
    }
  }
  
  return save;
}

export const toString = function(arr) {
  let _arr = arr.map(function(item){
    return item.toString();
  });

  return _arr;
}