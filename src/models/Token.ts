import { IToken } from '@/interfaces';
import mongoose, { Document, Schema } from 'mongoose';

const tokenSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requred: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: Number(+(process.env.TOKEN_EXPIRES_TIME_COOKIES as string)) / 1000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Token || mongoose.model<IToken>('Token', tokenSchema);