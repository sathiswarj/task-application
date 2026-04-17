import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'Backlog' | 'In Progress' | 'Ready for Dev' | 'Completed' | 'Pending';
    priority: 'Low' | 'Medium' | 'High';
    project: mongoose.Types.ObjectId;
    assignee?: mongoose.Types.ObjectId;
    attachments: {
        name: string;
        url: string;
        fileType: string;
    }[];
}

const taskSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Backlog', 'In Progress', 'Ready for Dev', 'Completed', 'Pending'],
        default: 'Backlog'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attachments: [{
        name: String,
        url: String,
        fileType: String
    }]
}, {
    timestamps: true
});

export default mongoose.model<ITask>('Task', taskSchema);
