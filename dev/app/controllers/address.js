let User = require('../models/user');

module.exports.add = (req,res) => {
  let addr = req.body.address;
  let userid = req.body.userid;

  User.findOne({_id: userid},(err,user) => {
    if(err){
      console.log(err);
      res.json({success: false});
    }
    user.address = addr;
    user.save(err => {
      if(err) {
        console.log(err);
        res.json({success: false});
      }
      res.json({success: true});
    });
  })
}