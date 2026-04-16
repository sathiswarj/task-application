'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TaskDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('comments');

  const task = {
    id: id,
    title: 'Finalize TaskFlow Redesign',
    description: 'We need to finish the final touches on the new dashboard and task detail pages. This includes ensuring all responsive breakpoints are handled correctly and that the animations feel fluid and premium.',
    status: 'In Progress',
    priority: 'High',
    assignee: { name: 'Steve Jobs', initial: 'S', color: 'bg-indigo-500' },
    project: 'TaskFlow App',
    dueDate: 'Apr 20, 2026',
    createdDate: 'Apr 12, 2026',
    attachments: [
      { name: 'design_spec.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'hero_demo.mp4', size: '15.8 MB', type: 'Video' }
    ],
    comments: [
      { id: 1, author: 'Elon Musk', text: 'This looks incredible so far. Make sure the hover states are subtle.', time: '2 hours ago' },
      { id: 2, author: 'Bill Gates', text: 'I added some suggestions for the padding on mobile in the shared doc.', time: '5 hours ago' }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <nav className="flex items-center gap-2 text-xs font-semibold text-white/30 uppercase tracking-widest">
        <Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
        <span>/</span>
        <Link href="/dashboard/tasks" className="hover:text-white transition-colors">Tasks</Link>
        <span>/</span>
        <span className="text-white/60">Details</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2 space-y-10">

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">{task.title}</h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-bold uppercase tracking-wider">{task.status}</span>
              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-wider">{task.priority} Priority</span>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Description</h3>
            <p className="text-white/70 leading-relaxed text-lg font-medium">{task.description}</p>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {task.attachments.map((file, i) => (
                <div key={i} className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:border-white/20 transition-all">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold">{file.size} &bull; {file.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-8 border-b border-white/5">
              {['comments', 'activity', 'checklist'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full animate-in fade-in slide-in-from-left-2"></div>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'comments' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                        {comment.author[0]}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white">{comment.author}</span>
                          <span className="text-[10px] font-bold text-white/20">{comment.time}</span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative pt-4">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 min-h-[100px] resize-none transition-all"
                  ></textarea>
                  <button className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black text-[11px] font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em]">Assignment</h4>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${task.assignee.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                  {task.assignee.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{task.assignee.name}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Lead Designer</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5"></div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em]">Due Date</h4>
                <p className="text-xs font-bold text-white/80">{task.dueDate}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em]">Project</h4>
                <p className="text-xs font-bold text-white/80">{task.project}</p>
              </div>
            </div>

            <div className="h-px bg-white/5"></div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.2em]">Subscribers</h4>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 ring-1 ring-white/5 flex items-center justify-center text-[10px] font-bold`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white/40 cursor-pointer hover:bg-white/10 transition-colors">
                  +
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
