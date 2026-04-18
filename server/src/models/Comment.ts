import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    task: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId;
    reactions: Array<{
        emoji: string;
        users: mongoose.Types.ObjectId[];
    }>;
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
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    reactions: [
        {
            emoji: String,
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model<IComment>('Comment', commentSchema);
