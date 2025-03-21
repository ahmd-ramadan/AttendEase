import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  title: string;
  startAt: Date;
  endAt: Date;
  doctorId: string;
  courseId: string;
  students: string [] 
}

const sessionSchema: Schema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    },
    courseId: {
      type: String,
      required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            required: true
        }
    ]
  },
  {
    timestamps: true,
  });

export default mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);