import { Schema, model } from 'mongoose';

// Required fields keep seed fixtures and API validation meaningful.
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  fitnessGoal: { type: String, required: true, trim: true },
});

export const User = model('User', userSchema);
