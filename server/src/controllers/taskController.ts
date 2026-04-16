import { Request, Response } from 'express';
import Task from '../models/Task';

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find().populate('project assignee');
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByProject = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignee');
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
