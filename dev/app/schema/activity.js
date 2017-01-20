import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const activitySchema = new Schema({
  name: String,
  discount: Number,
  products: [ObjectId]
})