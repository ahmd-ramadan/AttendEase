import mongoose, { Document, Schema } from 'mongoose'

export interface ICourse {
    _id: string;
    title: string;
    students: string []
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