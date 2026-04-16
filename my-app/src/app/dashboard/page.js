'use client';

import React from 'react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Tasks', value: '42', change: '+5', trend: 'up' },
    { label: 'Completed', value: '28', change: '+12%', trend: 'up' },
    { label: 'In Progress', value: '10', change: '-2', trend: 'down' },
    { label: 'Overdue', value: '4', change: '0', trend: 'neutral' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Personal Workspace</h1>
        <p className="text-white/40">Here is what is happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl hover:border-white/10 transition-colors group">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 
                stat.trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/40'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Active Projects</h2>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'TaskFlow Redesign', progress: 75, color: 'bg-indigo-500', members: 4 },
              { name: 'Mobile App API', progress: 30, color: 'bg-purple-500', members: 2 },
              { name: 'Marketing Website', progress: 95, color: 'bg-emerald-500', members: 3 },
            ].map((project, i) => (
              <div key={i} className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-zinc-900 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${project.color} shadow-[0_0_12px_rgba(0,0,0,0.5)]`}></div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{project.name}</h4>
                    <p className="text-xs text-white/30">{project.members} team members</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-32 hidden sm:block">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-white/20 uppercase">Progress</span>
                      <span className="text-[10px] font-bold text-white/40">{project.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${project.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-2">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {[
              { task: 'Update Brand Guidelines', date: 'Tomorrow', urgency: 'High' },
              { task: 'Client Presentation', date: 'Apr 18', urgency: 'Medium' },
              { task: 'Quarterly Review', date: 'Apr 22', urgency: 'Normal' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-zinc-900/30 border border-white/5 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-bold tracking-tight truncate flex-1">{item.task}</h5>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                    item.urgency === 'High' ? 'bg-red-500/10 text-red-400' :
                    item.urgency === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {item.urgency}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/30">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] font-medium">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
