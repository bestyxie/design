import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const activitySchema = new Schema({
  discount: Number,
  pic: String,
  products: [ObjectId]
})