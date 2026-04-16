import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'member';
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    profilePicture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
