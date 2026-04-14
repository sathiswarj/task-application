'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth.service';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    workspaceName: '',
    role: 'member'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signup(formData);
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-black text-white font-sans overflow-hidden">
      {/* Left Half: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8 my-auto">
          {/* Header Section */}
          <div className="text-left space-y-2">
            <h1 className="text-4xl font-bold tracking-tight font-heading">Set up your workspace</h1>
            <p className="text-white/50 text-base">Start building your collaborative workspace today.</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="workspaceName" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Workspace Name
              </label>
              <input
                type="text"
                id="workspaceName"
                value={formData.workspaceName}
                onChange={handleChange}
                placeholder="The Next Big Project"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Full Name
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Steve Jobs"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Work Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8+ characters"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                I am using this for
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 outline-none transition-all text-white/80"
              >
                <option value="member" className="bg-[#111]">Personal projects</option>
                <option value="admin" className="bg-[#111]">Managing a team</option>
                <option value="member" className="bg-[#111]">School/Education</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black rounded-md font-bold text-sm tracking-wide hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating workspace...' : 'Create workspace'}
            </button>
          </form>

          <div className="pt-4">
            <p className="text-sm text-white/40">
              Already using this?{' '}
              <Link href="/login" className="text-white hover:underline underline-offset-4 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Half: Image / Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-0"></div>
        <div className="relative z-10 max-w-lg text-left space-y-10">
          <div className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20"></div>)}
            </div>
            <h2 className="text-5xl font-extrabold font-heading tracking-tight">Your work. <br />All in one place.</h2>
            <p className="text-xl text-white/50 font-medium max-w-sm">From project management to team collaboration, build something great.</p>
          </div>

          <div className="space-y-6">
            {[
              { title: "Real-time updates", desc: "See changes as they happen without refreshing." },
              { title: "Custom Workflows", desc: "Build the board exactly how your team works." },
              { title: "Advanced Analytics", desc: "Track progress and identify bottlenecks immediately." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white/90">{item.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
