var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  desc: String
});

CategorySchema.statics.isUnique = function(name){
  var msg = '';
  this.find({name: name},function(err,objs){
    if(err){
      console.log(err);
      return;
    }
    msg
  })
}

module.exports = CategorySchema;