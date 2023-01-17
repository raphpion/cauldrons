import mongoose, { Schema, Document } from 'mongoose';

interface ISession extends Document {
  sessionId: string;
  userId: string;
  isPersistent: boolean;
  keyHash?: string;
  ipAddress: string;
  signedOutAt?: Date;
  isActive(): boolean;
  signOut(): void;
}

const sessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  isPersistent: {
    type: Boolean,
    required: true,
  },
  keyHash: {
    type: String,
    required: false,
  },
  ipAddress: String,
  signedOutAt: Date,
});

sessionSchema.methods.isActive = function (): boolean {
  return this.signedOutAt !== null;
};

if (mongoose.models.Session) mongoose.deleteModel('Session');
export default mongoose.model<ISession>('Session', sessionSchema);
export type { ISession };
