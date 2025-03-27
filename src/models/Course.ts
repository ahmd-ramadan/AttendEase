import { ICourse } from '@/interfaces';
import mongoose, { Document, Schema } from 'mongoose';

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