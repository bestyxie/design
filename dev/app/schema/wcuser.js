import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const wcuserSchema = new Schema({
  openid: String,
  headimgurl: String,
  nickname: String
})