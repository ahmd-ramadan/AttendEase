import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IFingerprint  extends Document {
    _id: string;
    visitorId: string;
    userId: IUser;
}

const fingerprintSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requred: true,
    },
    visitorId: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Fingerprint  || mongoose.model<IFingerprint>('Fingerprint', fingerprintSchema);