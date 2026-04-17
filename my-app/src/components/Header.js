'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState({ username: '', role: 'member' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const isAdmin = user.role === 'admin';

  return (
    <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-white/90">Main Dashboard</h2>
        <div className="h-4 w-px bg-white/10 mx-2"></div>
        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest border ${isAdmin ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-white/40 border-white/5'
          }`}>
          {user.role}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-64 bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20 px-1.5 py-0.5 border border-white/10 rounded pointer-events-none">
            ⌘ K
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white/40 hover:text-white transition-colors relative">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black"></span>
          </button>

          {isAdmin && (
            <Link href="/dashboard/tasks/new" className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-bold">New Task</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
