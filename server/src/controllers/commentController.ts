import { Request, Response } from 'express';
import Comment from '../models/Comment';

export const addComment = async (req: Request, res: Response) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getCommentsByTask = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId }).populate('author', 'username');
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
