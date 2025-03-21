import mongoose, { Document, Schema } from 'mongoose';

export interface IFingerprint  extends Document {
    _id: string;
    fingerprint: string;
    userId: string;
}

const fingerprintSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requred: true,
    },
    fingerprint: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Fingerprint  || mongoose.model<IFingerprint>('Fingerprint', fingerprintSchema);