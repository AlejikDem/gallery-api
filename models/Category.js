import mongoose, { Schema } from 'mongoose';

export const categorySchema = new Schema({
  name: String,
  description: String,
  show: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Category', categorySchema);
