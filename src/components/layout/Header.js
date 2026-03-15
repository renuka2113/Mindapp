'use client';

import { Brain, Flame, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    
    localStorage.removeItem('isLoggedIn');

    
    router.push('/login');

    
    router.refresh();
  };

  return (
    <header className="bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="bg-teal-700 p-2 rounded-xl text-white shadow-sm">
          <Brain size={24} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">MindGuard</h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide">STUDENT WELLNESS</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 border border-slate-200">
          <Flame size={16} className="text-orange-500 fill-orange-500" />
          <span>15d streak</span>
        </div>
        
        {/* Log Out Button - Logic Added Here */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-600 transition-colors border-l border-slate-200 pl-3 sm:pl-4 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </header>
  );
}