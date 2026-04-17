'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { taskService } from '@/services/task.service';

const STATUSES = ['Backlog', 'Ready for Dev', 'In Progress', 'Pending', 'Completed'];

const STATUS_CONFIG = {
  'Backlog': { color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-white/5' },
  'Ready for Dev': { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  'In Progress': { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  'Pending': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  'Completed': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    // Optimistic Update
    const originalTasks = [...tasks];
    setTasks(prev => prev.map(task =>
      task._id === draggableId ? { ...task, status: newStatus } : task
    ));

    try {
      await taskService.updateTaskStatus(draggableId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setTasks(originalTasks); // Revert if failed
    }
  };

  const groupedTasks = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status);
    return acc;
  }, {});

  if (loading || !isBrowser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-white/40 font-medium tracking-tight">Syncing workspace board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Project Board</h1>
          <p className="text-white/40 text-sm">Drag and drop tasks to update their status instantly.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white/40">
                U{i}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-nowrap gap-6 overflow-x-auto pb-8 -mx-8 px-8 custom-scrollbar">
          {STATUSES.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`w-[300px] flex-shrink-0 flex flex-col gap-5 p-2 rounded-[2rem] transition-colors ${snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''
                    }`}
                >
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[status].bg.replace('/10', '')} shadow-[0_0_8px_rgba(255,255,255,0.1)]`}></span>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">{status}</h3>
                      <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-md font-bold tabular-nums">{groupedTasks[status]?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {groupedTasks[status]?.length === 0 ? (
                      <div className="h-24 border border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">No activity</span>
                      </div>
                    ) : (
                      groupedTasks[status]?.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-5 bg-zinc-950/50 border border-white/5 rounded-[1.8rem] hover:border-white/20 transition-all group cursor-grab active:cursor-grabbing relative overflow-hidden ${snapshot.isDragging ? 'shadow-2xl border-white/20 scale-105 bg-zinc-900' : ''
                                }`}
                            >
                              <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl opacity-10 pointer-events-none ${STATUS_CONFIG[status].bg.replace('/10', '')}`}></div>

                              <div className="space-y-4 relative z-10">
                                <div className="flex items-start justify-between">
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-tighter ${task.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                                      task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {task.priority || 'Normal'}
                                  </span>
                                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                                    {task.assignee?.username?.charAt(0).toUpperCase() || '?'}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors leading-snug">{task.title}</h4>
                                  <p className="text-[10px] text-white/30 truncate">{task.project?.name || 'Project Name'}</p>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                                  <div className="flex items-center gap-1.5 text-white/20">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="text-[9px] font-bold">2</span>
                                  </div>
                                  <div className="text-white/20">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

