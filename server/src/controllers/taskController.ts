import { Request, Response } from 'express';
import Task from '../models/Task';
import User from '../models/User';
import Project from '../models/Project';
import { sendTaskAssignmentEmail } from '../utils/email';
import { AuthRequest } from '../middleware/auth';

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = new Task(req.body);
        await task.save();
        // ... (existing email logic)

        if (task.assignee) {
            const assigneeUser = await User.findById(task.assignee);
            const project = await Project.findById(task.project);

            if (assigneeUser && project) {
                sendTaskAssignmentEmail(
                    assigneeUser.email,
                    assigneeUser.username,
                    task.title,
                    project.name
                );
            }
        }

        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        let query = {};
        
        // Members only see tasks assigned to them
        if (req.user?.role !== 'admin') {
            query = { assignee: req.user?.id };
        }

        const tasks = await Task.find(query).populate('project assignee');
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
