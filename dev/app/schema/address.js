import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const addressSchema = new Schema({
  user: ObjectId,
  recipient: String,
  tel: String,
  addr: String,
  default: Boolean
})