var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/images/upload');
  },
  filename: function(req,file,cb){
    var fileFormat = (file.originalname).split('.');
    cb(null,file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + '.' + fileFormat[fileFormat.length-1])
  }
});

module.exports.upload = multer({
  storage: storage
});