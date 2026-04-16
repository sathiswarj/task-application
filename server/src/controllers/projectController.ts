import { Request, Response } from 'express';
import Project from '../models/Project';
import { CreateProjectSchema } from '../schemas/projectSchema';
import { validate } from '../utils/validator';

export const createProject = async (req: Request, res: Response) => {
    try {
        const validation = validate(CreateProjectSchema, req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
        }

        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().populate('owner members', 'username email');
        res.status(200).json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner members', 'username email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addMember = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        project.members.push(req.body.userId);
        await project.save();
        res.status(200).json(project);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
