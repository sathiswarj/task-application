"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/user.service';

export default function InviteMemberPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: "Hi there! I'd like to invite you to join our project workspace on TaskFlow."
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user details for the invitation email
      const userStr = localStorage.getItem('user');
      const inviterName = userStr ? JSON.parse(userStr).username : 'A teammate';

      await userService.inviteUser({
        ...formData,
        inviterName
      });

      setSent(true);
      setTimeout(() => {
        router.push('/dashboard/team');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send invitation. Please try again.');
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <svg width="40" height="40" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Invitation Sent!</h2>
          <p className="text-white/40 max-w-sm mx-auto">We've sent an invitation link to <strong>{formData.email}</strong>. They will be notified via email.</p>
        </div>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] animate-pulse">Redirecting to team dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Invite Team Member</h1>
          <p className="text-white/40 text-sm">Expand your workspace by inviting your colleagues to collaborate.</p>
        </div>
        <Link href="/dashboard/team" className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950/50 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="colleague@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-lg font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Assigned Role</label>
            <div className="grid grid-cols-2 gap-4">
              {['member', 'admin'].map((r) => (
                <div
                  key={r}
                  onClick={() => setFormData(p => ({ ...p, role: r }))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-center group ${formData.role === r
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                  <p className="text-sm font-bold uppercase tracking-widest">{r}</p>
                  <p className="text-[10px] opacity-40 lowercase mt-1">
                    {r === 'admin' ? 'Full workspace access' : 'Project collaboration only'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] ml-1">Personal Message (Optional)</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all min-h-[100px] resize-none leading-relaxed text-sm"
            ></textarea>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send Invitation</span>
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
