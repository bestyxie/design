import fs from 'fs';
import path from 'path';

export const deletePic = (urls) => {
  for(let i=0,len=urls.length;i<len;i++){
    let curURL = path.join(__dirname.replace('app\\common','public'),urls[i]);
    console.log(curURL);
    fs.unlinkSync(curURL);
  }
}