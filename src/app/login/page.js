'use client';

import React, { useState } from 'react';
import { Brain, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Determine the correct API endpoint based on state
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    // Construct the payload
    const payload = isLogin 
      ? { email, password } 
      : { fullName, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server returns a 400 or 401, throw the error to be caught below
        throw new Error(data.error || 'Authentication failed');
      }

      // If successful, set local storage
      localStorage.setItem('isLoggedIn', 'true');
      
      // Optional: Store the user's name to display in the Header later
      if (data.user) {
        localStorage.setItem('userName', data.user.full_name);
      } else if (!isLogin) {
        localStorage.setItem('userName', fullName);
      }

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh(); // Force layout to update and show Nav/Header

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md">
        
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-teal-700 p-3 rounded-2xl text-white shadow-lg mb-4">
            <Brain size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">MindGuard</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">Student Wellness Platform</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => { setIsLogin(true); setError(null); }} 
              className={`flex-1 py-4 text-sm font-bold ${isLogin ? 'text-teal-700 border-b-2 border-teal-700 bg-slate-50/50' : 'text-slate-400 hover:bg-slate-50 transition-colors'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(null); }} 
              className={`flex-1 py-4 text-sm font-bold ${!isLogin ? 'text-teal-700 border-b-2 border-teal-700 bg-slate-50/50' : 'text-slate-400 hover:bg-slate-50 transition-colors'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="p-6 space-y-5">
            
            {/* Error Message Display */}
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Inputs */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" 
                  required={!isLogin}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="University Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" 
                required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" 
                required 
              />
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group transition-all ${
                isLoading ? 'bg-teal-600 opacity-75 cursor-not-allowed' : 'bg-teal-800 hover:bg-teal-900'
              }`}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}