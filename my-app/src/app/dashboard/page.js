'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Advanced Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
    fetchTasks();

    // Get current user for 'My Tasks' filtering
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
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
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;

    // Optimistic Update
    const originalTasks = [...tasks];

    // 1. Get all tasks except the one being moved
    const taskToMove = tasks.find(t => t._id === draggableId);
    if (!taskToMove) return;

    const otherTasks = tasks.filter(t => t._id !== draggableId);

    // 2. Logic to place the task at the correct index within its new status group
    const tasksInTargetStatus = otherTasks.filter(t => t.status === newStatus);
    const tasksInOtherStatuses = otherTasks.filter(t => t.status !== newStatus);

    // 3. Create the updated target column list
    const updatedTargetColumn = [...tasksInTargetStatus];
    updatedTargetColumn.splice(destination.index, 0, { ...taskToMove, status: newStatus });

    // 4. Reconstruct the full task list
    const newTasksState = [...tasksInOtherStatuses, ...updatedTargetColumn];

    setTasks(newTasksState);

    try {
      await taskService.updateTaskStatus(draggableId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setTasks(originalTasks); // Revert if failed
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete._id);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Delete failed');
    }
  };

  // 1. Process Filtering Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;

    const matchesAssignment = !filterMyTasks || (currentUser && task.assignee?._id === currentUser.id);

    return matchesSearch && matchesPriority && matchesAssignment;
  });

  // 2. Group Processed Tasks
  const groupedTasks = STATUSES.reduce((acc, status) => {
    acc[status] = filteredTasks.filter(t => t.status === status);
    return acc;
  }, {});

  const getStatusColorClass = (status) => {
    return STATUS_CONFIG[status]?.bg.split('/')[0] || 'bg-zinc-500';
  };

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

      {/* Advanced Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-zinc-950/50 border border-white/5 rounded-3xl backdrop-blur-3xl relative z-30">
        <div className="relative flex-1 group w-full lg:w-auto">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="Search objectives, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1">
            {['All', 'High', 'Medium', 'Low'].map(p => (
              <button 
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterPriority === p ? 'bg-white text-black shadow-lg scale-105' : 'text-white/30 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setFilterMyTasks(!filterMyTasks)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all ${
              filterMyTasks 
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${filterMyTasks ? 'bg-indigo-400 animate-pulse' : 'bg-white/20'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">My Perspective</span>
          </button>
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
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusColorClass(status)} shadow-[0_0_8px_rgba(255,255,255,0.1)]`}></span>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">{status}</h3>
                      <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-md font-bold tabular-nums">{groupedTasks[status]?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 min-h-[450px]">
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
                              className={`p-5 bg-zinc-950 border border-white/5 rounded-[1.8rem] hover:border-white/20 group cursor-grab active:cursor-grabbing relative overflow-hidden ${snapshot.isDragging ? 'shadow-2xl border-white/40 bg-zinc-900 z-[9999]' : 'transition-all'
                                }`}
                            >
                              <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl opacity-10 pointer-events-none ${getStatusColorClass(status)}`}></div>

                              {/* Quick Actions */}
                              <div className="absolute top-4 right-4 z-20 flex gap-2">
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setTaskToDelete(task);
                                  }}
                                  className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 text-white/20 transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>

                              <Link href={`/tasks/${task._id}`} className="block space-y-4 relative z-10">
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
                              </Link>

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

      {taskToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setTaskToDelete(null)}></div>
          <div className="relative w-full max-w-sm bg-zinc-950 border border-red-500/20 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(239,68,68,0.1)] space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-red-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tight">Erase Task?</h3>
              <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-widest font-bold">
                Item: {taskToDelete.title}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-600 transition-all shadow-lg active:scale-95"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => setTaskToDelete(null)}
                className="w-full py-4 bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

