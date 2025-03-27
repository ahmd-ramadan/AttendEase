import { UserRolesEnum } from '@/enums';
import { IUser } from '@/interfaces';
import mongoose, { Document, Schema } from 'mongoose';

const userSchema: Schema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(UserRolesEnum),
      required: true
    }
  },
  {
    timestamps: true,
  });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);