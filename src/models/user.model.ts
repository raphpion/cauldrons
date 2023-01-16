import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  userId: string;
  username: string;
  email: string;
  password?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  getPersonalProfile: () => IUserPersonalProfile;
}

interface IUserPersonalProfile {
  userId: string;
  username: string;
  email: string;
}

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedBy: {
    type: String,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

userSchema.methods.getPersonalProfile = function (): IUserPersonalProfile {
  return {
    userId: this.userId,
    username: this.username,
    email: this.email,
  };
};

if (mongoose.models.User) mongoose.deleteModel('User');
export default mongoose.model<IUser>('User', userSchema);
export type { IUser, IUserPersonalProfile };
