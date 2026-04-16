import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
}

const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

export default mongoose.model<IProject>('Project', projectSchema);
