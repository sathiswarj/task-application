'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { taskService } from '@/services/task.service';
import { userService } from '@/services/user.service';
import { projectService } from '@/services/project.service';

const STATUSES = ['Backlog', 'Ready for Dev', 'In Progress', 'Pending', 'Completed'];
const PRIORITIES = ['High', 'Medium', 'Normal', 'Low'];

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'Normal',
    assignee: '',
    project: ''
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, usersData, projectsData] = await Promise.all([
          taskService.getTaskById(id),
          userService.getUsers(),
          projectService.getProjects()
        ]);

        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'Backlog',
          priority: taskData.priority || 'Normal',
          assignee: taskData.assignee?._id || '',
          project: taskData.project?._id || ''
        });
        setUsers(usersData);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching edit data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await taskService.updateTask(id, formData);
      router.push(`/tasks/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update task.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Awaiting Data Sync</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white py-12 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href={`/tasks/${id}`} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Modify Task</h1>
            <p className="text-white/30 text-xs uppercase tracking-widest">Editing Metadata for #{id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Card */}
          <div className="p-8 md:p-10 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl space-y-10">
            
            {/* Title Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Objective Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                placeholder="What needs to be done?"
              />
            </div>

            {/* Config Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Workflow Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  {STATUSES.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer text-indigo-400"
                >
                  {PRIORITIES.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
                </select>
              </div>
            </div>

            {/* Assignment Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Lead Assignee</label>
                <select
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-900">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id} className="bg-zinc-900">{u.username}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Project Context</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  {projects.map(p => <option key={p._id} value={p._id} className="bg-zinc-900">{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Description Area */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Detailed Briefing</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-white/70 font-medium focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/5 leading-relaxed resize-none"
                placeholder="Describe the scope and requirements..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-6 pt-6">
            <Link href={`/tasks/${id}`} className="text-sm font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest px-4">
              Abort Changes
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Synchronizing...' : 'Commit Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
