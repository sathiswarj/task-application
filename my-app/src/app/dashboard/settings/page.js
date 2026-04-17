'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [user, setUser] = useState({ username: '', email: '', role: '' });
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    updates: true
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-white/40 text-sm">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Profile</h3>
          <p className="text-white/30 text-xs leading-relaxed">This information will be displayed to other team members within the workspace.</p>
        </div>
        
        <div className="md:col-span-2 space-y-8 bg-zinc-950/50 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
          
          <div className="flex items-center gap-6 pb-4 border-b border-white/5 relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-bold text-white">
              {user.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="space-y-2">
              <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all">Change Avatar</button>
              <button className="block text-white/40 hover:text-white px-4 text-[10px] font-bold uppercase tracking-widest transition-all">Remove</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Username</label>
              <input 
                type="text" 
                defaultValue={user.username} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white/40 cursor-not-allowed text-sm font-bold"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/10">Save Changes</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Notifications</h3>
          <p className="text-white/30 text-xs leading-relaxed">Configure how you want to receive alerts and workspace updates.</p>
        </div>
        
        <div className="md:col-span-2 space-y-6 bg-zinc-950/50 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
          {[
            { id: 'email', title: 'Email Notifications', desc: 'Receive important updates and task assignments directly in your inbox.', checked: notifications.email },
            { id: 'browser', title: 'Browser Push', desc: 'Get real-time alerts on your desktop even when the app is in the background.', checked: notifications.browser },
            { id: 'updates', title: 'Product Updates', desc: 'Stay informed about new features and improvements to TaskFlow.', checked: notifications.updates },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between group p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer" onClick={() => setNotifications(p => ({ ...p, [item.id]: !p[item.id] }))}>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                <p className="text-[10px] text-white/30 max-w-sm">{item.desc}</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${item.checked ? 'bg-indigo-600' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${item.checked ? 'left-7 shadow-lg shadow-indigo-500/50' : 'left-1'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-red-500 uppercase tracking-tight">Danger Zone</h3>
          <p className="text-white/30 text-xs">Irreversible actions related to your account security and data.</p>
        </div>
        <button className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-8 py-3 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest">Delete Account</button>
      </div>
    </div>
  );
}
