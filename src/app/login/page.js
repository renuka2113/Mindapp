'use client';

import React, { useState } from 'react';
import {
  Brain,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    const payload = isLogin
      ? { email, password, role: isAdminMode ? 'admin' : 'student' }
      : {
          fullName,
          email,
          password,
          collegeName,
          role: isAdminMode ? 'admin' : 'student',
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // 1. Set global logged-in state
      localStorage.setItem('isLoggedIn', 'true');
      const finalRole = data.role || role; 
      localStorage.setItem('userRole', finalRole);
      // 2. Properly store the User ID and Name based on Login vs Signup
      if (isLogin && data.user) {
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.full_name);
      } else if (!isLogin && data.userId) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', fullName);
      }

      // 3. Redirect and refresh layout
      if (data.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900'>
      <div className='w-full max-w-md'>
        
        {/* 1. Logo & Branding */}
        <div className='text-center mb-8'>
          <div className='inline-flex bg-teal-700 p-3 rounded-2xl text-white shadow-lg mb-4'>
            <Brain size={32} />
          </div>
          <h1 className='text-3xl font-black tracking-tight'>MindGuard</h1>
          <p className='text-slate-500 font-medium mt-1 text-sm'>
            Student Wellness Platform
          </p>
        </div>

        {/* 2. Admin/Student Role Toggle */}
        <div className="flex justify-center mb-6">
          <button 
            type="button"
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setError(null);
            }}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-teal-700 hover:border-teal-200 transition-all shadow-sm"
          >
            {isAdminMode ? <User size={14}/> : <ShieldCheck size={14}/>}
            Switch to {isAdminMode ? 'Student Portal' : 'College Admin Portal'}
          </button>
        </div>

        {/* 3. Main Auth Card */}
        <div className='bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden'>
          
          {/* Portal Indicator */}
          <div className="bg-slate-50/50 py-3 border-b border-slate-100">
            <h2 className="text-center text-[10px] font-bold text-teal-700 uppercase tracking-widest">
              {isAdminMode ? 'Authorized Personnel Only' : 'Student Access'}
            </h2>
          </div>

          {/* Login/Signup Tabs */}
          <div className='flex border-b border-slate-100'>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${isLogin ? 'text-teal-700 border-b-2 border-teal-700 bg-white' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLogin ? 'text-teal-700 border-b-2 border-teal-700 bg-white' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className='p-6 space-y-4'>
            
            {/* Error Message */}
            {error && (
              <div className='bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100 animate-in fade-in slide-in-from-top-1'>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Full Name (Signup Only) */}
            {!isLogin && (
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input
                  type='text'
                  placeholder='Full Name'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all'
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email (Always) */}
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input
                type='email'
                placeholder={isAdminMode ? 'Admin Email' : 'University Email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all'
                required
              />
            </div>

            {/* Password (Always) */}
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all'
                required
              />
            </div>

            {/* College Name (Signup Only) */}
            {!isLogin && (
              <div className='relative'>
                <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input
                  type='text'
                  placeholder='College / University'
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all'
                  required={!isLogin}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className={`w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all mt-2 ${
                isLoading ? 'bg-teal-600 opacity-75 cursor-not-allowed' : 'bg-teal-800 hover:bg-teal-900 shadow-md active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>

            {/* Footer Text */}
            <p className="text-center text-[10px] text-slate-400 mt-4">
              {isAdminMode 
                ? "Registering as an administrator requires institutional verification." 
                : "Students must use their official university issued email address."}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
