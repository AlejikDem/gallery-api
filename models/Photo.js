import shortid from 'shortid';
import mongoose, { Schema } from 'mongoose';

export const photoSchema = new Schema({
  name: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  session: { type: Schema.Types.ObjectId, ref: 'Session' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Photo', photoSchema);
