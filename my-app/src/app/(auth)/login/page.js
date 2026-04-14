'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.token) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-black text-white font-sans overflow-hidden">

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px] space-y-8">

          <div className="text-left space-y-2">
            <h1 className="text-4xl font-bold tracking-tight font-heading">Welcome back</h1>
            <p className="text-white/50 text-base">Sign in to your workspace to continue.</p>
          </div>


          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Password
                </label>
                <Link href="/forgot-password" size="sm" className="text-[11px] text-white/40 hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black rounded-md font-bold text-sm tracking-wide hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4">
            <p className="text-sm text-white/40">
              New to the platform?{' '}
              <Link href="/signup" className="text-white hover:underline underline-offset-4 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>


      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
        <div className="relative z-10 max-w-lg text-center lg:text-left space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold font-heading leading-tight">Better tasks. <br />Faster workspace.</h2>
            <p className="text-lg text-white/60 tracking-wide">The all-in-one productivity tool for teams who want to build better products, together.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Projects", val: "12+" },
              { label: "Team Members", val: "50+" },
              { label: "Tasks Completed", val: "2.4k" },
              { label: "Efficiency", val: "94%" }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-white/40 uppercase font-semibold">{stat.label}</p>
                <p className="text-xl font-bold font-heading">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="italic text-white/40 text-sm">"This tool changed how we track progress. The minimalist UI keeps us focused on what matters."</p>
            <p className="mt-2 text-xs font-bold text-white/60">— Head of Product, TechCorp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
