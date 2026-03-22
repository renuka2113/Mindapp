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
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState(''); 
  const [year, setYear] = useState('');     

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const role = isAdminMode ? 'admin' : 'student';

    const payload = isLogin
      ? { email, password, role }
      : {
          fullName,
          email,
          password,
          collegeName,
          branch, 
          year: parseInt(year), 
          role,
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

      
      localStorage.setItem('isLoggedIn', 'true');
      const finalRole = data.role || role;
      localStorage.setItem('userRole', finalRole);

      if (isLogin && data.user) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.full_name);
      } else if (!isLogin && data.userId) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', fullName);
      }

      
      if (finalRole === 'admin') {
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
        
        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='inline-flex bg-teal-700 p-3 rounded-2xl text-white shadow-lg mb-4'>
            <Brain size={32} />
          </div>
          <h1 className='text-3xl font-black tracking-tight text-slate-900'>MindGuard</h1>
          <p className='text-slate-500 font-medium mt-1 text-sm'>Student Wellness Platform</p>
        </div>

        {/* Portal Toggle */}
        <div className="flex justify-center mb-6">
          <button 
            type="button"
            onClick={() => { setIsAdminMode(!isAdminMode); setError(null); }}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-teal-700 hover:border-teal-200 transition-all shadow-sm"
          >
            {isAdminMode ? <User size={14}/> : <ShieldCheck size={14}/>}
            Switch to {isAdminMode ? 'Student Portal' : 'College Admin Portal'}
          </button>
        </div>

        {/* Auth Card */}
        <div className='bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden'>
          
          <div className="bg-slate-50/50 py-3 border-b border-slate-100">
            <h2 className="text-center text-[10px] font-bold text-teal-700 uppercase tracking-widest">
              {isAdminMode ? 'Authorized Personnel Only' : 'Student Access'}
            </h2>
          </div>

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
            {error && (
              <div className='bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100'>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {!isLogin && (
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input
                  type='text' placeholder='Full Name' value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500'
                  required={!isLogin}
                />
              </div>
            )}

            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input
                type='email' placeholder={isAdminMode ? 'Admin Email' : 'University Email'}
                value={email} onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500'
                required
              />
            </div>

            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input
                type='password' placeholder='Password' value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500'
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className='relative'>
                  <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                  <input
                    type='text' placeholder='College / University' value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500'
                    required={!isLogin}
                  />
                </div>

                {/* ONLY SHOW BRANCH AND YEAR FOR STUDENTS IN SIGNUP */}
                {!isAdminMode && (
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='relative'>
                      <GraduationCap className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                      <input
                        type='text' placeholder='Branch (CSE)' value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500'
                        required={!isLogin && !isAdminMode}
                      />
                    </div>
                    <div className='relative'>
                      <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                      <select
                        value={year} onChange={(e) => setYear(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 appearance-none'
                        required={!isLogin && !isAdminMode}
                      >
                        <option value="" disabled>Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type='submit' disabled={isLoading}
              className={`w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all mt-2 ${
                isLoading ? 'bg-teal-600 opacity-75' : 'bg-teal-800 hover:bg-teal-900 active:scale-[0.98]'
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
          </form>
        </div>
      </div>
    </div>
  );
}