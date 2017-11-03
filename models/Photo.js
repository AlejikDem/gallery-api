import mongoose, { Schema } from 'mongoose';

const photoSchema = new Schema({
  url: String,
  // category: Schema.ObjectId,
  // collection: Schema.ObjectId,
  createdAt: { type : Date, default: Date.now },
  updatedAt: { type : Date, default: Date.now }
});

export default mongoose.model('Photo', photoSchema);