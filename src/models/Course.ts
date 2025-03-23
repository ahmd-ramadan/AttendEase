import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './User';
import { ISession } from './Session';

export interface ICourse {
    _id: string;
    title: string;
    students: IUser[];
    createdAt: string,
    doctorId: IUser,
    sessions?: ISession[]
}

const courseSchema: Schema = new mongoose.Schema({
    title: {
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
            ref: "User",
            required: true
        }
    ]
}, {
    timestamps: true
})

export default mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);