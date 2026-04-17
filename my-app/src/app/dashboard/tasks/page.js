'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { taskService } from '@/services/task.service';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    setIsAdmin(user?.role === 'admin');

    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Backlog': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'Ready for Dev': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'In Progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10';
      case 'Medium': return 'text-orange-400 bg-orange-400/10';
      case 'Low': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-white/40 font-medium">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="text-white/40 text-sm">
            {isAdmin ? 'Review and manage tasks across all your projects.' : 'Track and manage your assigned responsibilities.'}
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/tasks/new"
            className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-white/5"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Task</span>
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-zinc-950/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-5 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Task Title</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Project</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Priority</th>
                <th className="px-6 py-5 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Assignee</th>
                <th className="px-8 py-5 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-white/20 text-sm">
                    {isAdmin
                      ? "No tasks found across the workspace. Create one to get started."
                      : "You don't have any tasks assigned to you right now. Take a break!"}
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold group-hover:text-indigo-400 transition-colors">{task.title}</span>
                        <span className="text-[10px] text-white/20 line-clamp-1">{task.description || 'No description'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium text-white/40">{task.project?.name || 'Unknown Project'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-widest ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority).split(' ')[0].replace('text-', 'bg-')}`}></div>
                        <span className={`text-xs font-bold ${getPriorityColor(task.priority).split(' ')[0]}`}>{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white/40">
                          {task.assignee?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-xs font-medium text-white/60">{task.assignee?.username || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
