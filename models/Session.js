import mongoose, { Schema } from 'mongoose';

export const sessionSchema = new Schema({
  name: String,
  description: String,
  show: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Session', sessionSchema);
