'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectService } from '@/services/project.service';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    setIsAdmin(user?.role === 'admin');

    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-white/40 font-medium">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-white/40 text-sm">Manage and monitor all your active workspace projects.</p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/projects/new"
            className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-white/5"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project</span>
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-zinc-950/50 border border-white/5 p-20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-white/20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No projects found</h3>
            <p className="text-white/30 max-w-xs mx-auto text-sm">
              {isAdmin
                ? "You haven't created any projects yet. Start by creating your first project to organize your tasks."
                : "You aren't a member of any projects yet. Ask an administrator to add you to a project."}
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/dashboard/projects/new"
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors text-sm"
            >
              Create your first project &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-zinc-950/50 border border-white/5 p-8 rounded-[2rem] hover:border-white/20 hover:bg-zinc-900/50 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[280px]"
            >
              {/* Subtle Gradient Overlay */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-indigo-500/5 blur-[60px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500"></div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white/40">
                        {i === 2 ? `+${(project.members?.length || 0) > 2 ? project.members.length - 2 : ''}` : ''}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{project.name}</h3>
                  <p className="text-white/30 text-sm line-clamp-2 leading-relaxed">{project.description || 'No description provided for this project.'}</p>
                </div>
              </div>

              <div className="pt-6 relative z-10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em]">Owner</span>
                  <span className="text-xs font-bold text-white/60">{project.owner?.username || 'Unknown'}</span>
                </div>
                <Link
                  href={`/dashboard/projects/${project._id}`}
                  className="p-3 bg-white/5 rounded-2xl text-white/40 group-hover:bg-white group-hover:text-black transition-all active:scale-90"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
