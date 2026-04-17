'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { projectService } from '@/services/project.service';
import { userService } from '@/services/user.service';

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    members: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userService.getUsers();
        setUsers(usersData);

        // Attempt to get current user from localStorage if exists
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setFormData(prev => ({ ...prev, owner: user.id || user._id }));
        } else if (usersData.length > 0) {
          setFormData(prev => ({ ...prev, owner: usersData[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => {
      const isMember = prev.members.includes(userId);
      if (isMember) {
        return { ...prev, members: prev.members.filter(id => id !== userId) };
      } else {
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await projectService.createProject(formData);
      router.push('/dashboard/projects');
    } catch (err) {
      setError(err.message || 'Failed to create project');
      setLoading(false);
    }
  };

  if (fetchingUsers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-white/40 font-medium">Preparing workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Create New Project</h1>
          <p className="text-white/40 text-sm">Define a new project workspace and invite your team members.</p>
        </div>
        <Link href="/dashboard/projects" className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
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
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Project Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. NextGen Platform"
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
              placeholder="What is this project about?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all min-h-[120px] resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Team Members</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.map(user => (
                <div
                  key={user._id}
                  onClick={() => handleMemberToggle(user._id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${formData.members.includes(user._id)
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${formData.members.includes(user._id) ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-white/40'
                      }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.username}</p>
                      <p className="text-[10px] opacity-50">{user.email}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${formData.members.includes(user._id)
                      ? 'bg-indigo-500 border-indigo-500 scale-100'
                      : 'border-white/10 scale-90 group-hover:scale-100'
                    }`}>
                    {formData.members.includes(user._id) && (
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
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
                <span>Create Project</span>
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
