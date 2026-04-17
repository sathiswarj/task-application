'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { userService } from '@/services/user.service';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await userService.getUsers();
        setTeam(data);
      } catch (err) {
        console.error('Error fetching team:', err);
        setError('Failed to load team members. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-white/40 font-medium">Loading teammates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Team Members</h1>
          <p className="text-white/40 text-sm">Collaborate and manage everyone in your workspace.</p>
        </div>
        <Link 
          href="/dashboard/team/invite" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-indigo-500/10"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Invite Member</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {team.map((user) => (
          <div key={user._id} className="bg-zinc-950/50 border border-white/5 p-6 rounded-[2rem] hover:border-white/20 transition-all group text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full"></div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{user.username}</h3>
              <p className="text-xs text-white/30 font-medium">{user.email}</p>
            </div>

            <div className="pt-2">
              <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                user.role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/40 border border-white/5'
              }`}>
                {user.role}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
