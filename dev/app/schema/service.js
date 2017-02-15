let mongoose = require('mongoose');
let Schema = mongoose.Schema;

export const serviceSchema = new Schema({
  kf_account: String,
  nickname: String,
  password: String
});