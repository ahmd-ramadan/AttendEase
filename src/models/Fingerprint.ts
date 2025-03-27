import { IFingerprint } from '@/interfaces';
import mongoose, { Document, Schema } from 'mongoose';



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