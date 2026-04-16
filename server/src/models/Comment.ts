import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    task: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
}

const commentSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IComment>('Comment', commentSchema);
