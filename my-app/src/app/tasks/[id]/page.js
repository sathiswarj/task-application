'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { taskService } from '@/services/task.service';
import { commentService } from '@/services/comment.service';

const STATUS_CONFIG = {
  'Backlog': { color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-white/5', icon: '○' },
  'Ready for Dev': { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '◔' },
  'In Progress': { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: '◑' },
  'Pending': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '⊖' },
  'Completed': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '●' }
};

const PRIORITY_CONFIG = {
  'High': { color: 'text-red-400', bg: 'bg-red-500/10', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
  'Medium': { color: 'text-orange-400', bg: 'bg-orange-500/10', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]' },
  'Low': { color: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
  'Normal': { color: 'text-zinc-400', bg: 'bg-zinc-500/10', glow: 'shadow-none' }
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByTask(id);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskService.getTaskById(id);
        setTask(data);
        fetchComments();
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Task synchronization failed. It might have been deleted or archived.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await taskService.deleteTask(id);
      router.push('/dashboard');
    } catch (err) {
      alert('Archive failed. Please check your permissions.');
    }
  };

  const handleAddComment = async (e, parentId = null) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.addComment({
        task: id,
        content: newComment,
        parentComment: parentId
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert('Failed to send comment.');
    }
  };

  if (loading) return null;

  if (error || !task) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
      <p className="text-white/40 mb-10 max-w-sm">{error}</p>
      <Link href="/dashboard" className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform">
        Return to Workspace
      </Link>
    </div>
  );

  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG['Backlog'];
  const priority = PRIORITY_CONFIG[task.priority || 'Normal'];

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <div className="container mx-auto px-4 py-8 lg:py-12 relative">

        {/* Background Ambience */}
        <div className={`fixed top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-1000 ${task.priority === 'High' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>

        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 relative z-10">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/40 group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Task Control Panel</p>
              <h2 className="text-white font-bold opacity-60">ID # {task._id.slice(-6).toUpperCase()}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <span>Share</span>
            </button>
            <button onClick={() => router.push(`/tasks/${id}/edit`)} className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
              Edit Metadata
            </button>
            <button onClick={handleDelete} className="w-12 h-12 flex items-center justify-center border border-red-500/20 bg-red-500/5 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">

          {/* Main Content Pane */}
          <div className="lg:col-span-2 space-y-12">

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.border} ${status.bg} ${status.color} flex items-center gap-2`}>
                  <span className="text-sm leading-none">{status.icon}</span>
                  {task.status}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 bg-white/5 text-white/40`}>
                  {task.project?.name || 'Main Project'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none lg:max-w-3xl">
                {task.title}
              </h1>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Description</h3>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-md">
                <p className="text-lg text-white/60 leading-relaxed font-medium">
                  {task.description || 'Provide a vision for this task. Documentation is key to execution.'}
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Project Discussion</h3>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{comments.length} Thoughts</span>
              </div>

              {/* Comment Thread */}
              <div className="space-y-10 pl-2">
                {comments.filter(c => !c.parentComment).map(comment => (
                  <div key={comment._id} className="space-y-6 group">
                    <div className="flex gap-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white/40">
                        {comment.author?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white/80">{comment.author?.username}</span>
                          <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed font-medium bg-white/[0.01] p-4 rounded-2xl border border-white/[0.02]">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-white/[0.02] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-center">
                    <span className="text-3xl opacity-20">💬</span>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">Radio Silence</p>
                      <p className="text-[9px] font-bold text-white/5 uppercase tracking-widest">Initiate communication below</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 p-2 relative">
                <div className="absolute top-[-40px] left-8 w-px h-10 bg-gradient-to-t from-white/10 to-transparent"></div>
                
                <div className="mb-4 ml-4">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Post an update</h4>
                </div>

                <form onSubmit={handleAddComment} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your message here..."
                    rows={3}
                    className="relative w-full bg-white/5 border border-white/20 rounded-[2rem] px-8 py-7 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20 leading-relaxed resize-none pr-32 backdrop-blur-3xl"
                  />
                  
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute right-6 top-6 px-7 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] disabled:opacity-20 disabled:scale-100 disabled:shadow-none"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-12 self-start">

            <div className={`p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl transition-all duration-700 ${priority.glow}`}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 text-center">Context & Meta</h3>

              <div className="space-y-10">
                {/* Priority */}
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-white/20 tracking-widest block">Priority Rating</label>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border border-white/5 ${priority.bg}`}>
                    <div className={`w-2 h-2 rounded-full ${priority.color.replace('text', 'bg')} animate-pulse`}></div>
                    <span className={`font-bold ${priority.color}`}>{task.priority || 'Normal'} Intensity</span>
                  </div>
                </div>

                {/* Assignee Card */}
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-white/20 tracking-widest block">Lead Assignee</label>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/20 rounded-xl flex items-center justify-center text-xl font-black text-indigo-400 group-hover:scale-110 transition-transform">
                      {task.assignee?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{task.assignee?.username}</p>
                      <p className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-tighter">Project Member</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <label className="text-[8px] font-black uppercase text-white/20 tracking-widest block">Created</label>
                    <p className="text-[11px] font-bold text-white/60 tracking-tight">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <label className="text-[8px] font-black uppercase text-white/20 tracking-widest block">Deadline</label>
                    <p className="text-[11px] font-bold text-indigo-400 tracking-tight">None Set</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  📎
                </div>
                <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">Attached Docs</span>
              </div>
              <span className="text-[10px] font-black text-white/20">0 FILES</span>
            </div>

          </div>
        </div>

        {/* Professional Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
            <div className="relative w-full max-w-md bg-zinc-950 border border-red-500/20 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(239,68,68,0.1)] space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-white tracking-tight">Delete Permanently?</h3>
                <p className="text-white/40 text-sm leading-relaxed px-4">
                  This action is destructive and cannot be reversed. The task metadata will be purged from the workspace.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-600 transition-all shadow-lg active:scale-95"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                >
                  Abort Action
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
