import mongoose, { Document, Schema } from 'mongoose';

export enum UserRolesEnum {
  student = "Student",
  doctor = "Doctor",
  admin = "Admin"
}

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRolesEnum;
}

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