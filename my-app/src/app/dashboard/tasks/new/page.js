'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/task.service';
import { projectService } from '@/services/project.service';
import { userService } from '@/services/user.service';

export default function NewTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'Medium',
    project: '',
    assignee: ''
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, usersData] = await Promise.all([
          projectService.getProjects(),
          userService.getUsers()
        ]);
        setProjects(projectsData);
        setUsers(usersData);

        // Auto-select first project if available
        if (projectsData.length > 0) {
          setFormData(prev => ({ ...prev, project: projectsData[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching projects/users:', err);
        setError('Failed to load projects or users. Please try again.');
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project) {
      setError('Please select a project');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await taskService.createTask(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create task');
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-white/40 font-medium">Loading workspace data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create New Task</h1>
          <p className="text-white/40 text-sm">Fill in the details below to add a new task to your workspace.</p>
        </div>
        <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-medium animate-in shake duration-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950/50 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative Gradient Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none"></div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="title" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Task Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design System Architecture"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-lg font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all min-h-[150px] resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="status" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm font-bold"
              >
                <option value="Backlog" className="bg-zinc-900">Backlog</option>
                <option value="Ready for Dev" className="bg-zinc-900">Ready for Dev</option>
                <option value="In Progress" className="bg-zinc-900">In Progress</option>
                <option value="Pending" className="bg-zinc-900">Pending</option>
                <option value="Completed" className="bg-zinc-900">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm font-bold"
              >
                <option value="Low" className="bg-zinc-900">Low</option>
                <option value="Medium" className="bg-zinc-900">Medium</option>
                <option value="High" className="bg-zinc-900">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="project" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Project</label>
              <select
                id="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm font-bold"
              >
                <option value="" disabled className="bg-zinc-900 text-white/20">Select a project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id} className="bg-zinc-900">{p.name || p.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="assignee" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Assignee</label>
              <select
                id="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm font-bold"
              >
                <option value="" className="bg-zinc-900 text-white/20">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id} className="bg-zinc-900">{u.username}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 flex gap-4 relative z-10">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-white/5 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Task</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl border border-white/5 transition-all outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
