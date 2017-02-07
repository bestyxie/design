import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const wcuserSchema = new Schema({
  openid: String,
  headimgurl: String,
  nickname: String
})