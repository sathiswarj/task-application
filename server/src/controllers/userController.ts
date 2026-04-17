import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendInviteEmail } from '../utils/email';
import { SignupSchema, LoginSchema } from '../schemas/userSchema';
import { validate } from '../utils/validator';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        const validation = validate(SignupSchema, req.body);
        if (!validation.isValid) {
            console.log('Signup validation failed:', validation.errors);
            return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email is already registered' });

        const usernameExists = await User.findOne({ username });
        if (usernameExists) return res.status(400).json({ message: 'Username is already taken' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'member'
        });

        await newUser.save();

        sendWelcomeEmail(newUser.email, newUser.username);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const validation = validate(LoginSchema, req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey_12345',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const inviteUser = async (req: Request, res: Response) => {
    try {
        const { email, role, inviterName } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Recipient email is required' });
        }

        await sendInviteEmail(email, inviterName || 'A teammate', role || 'member');

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
