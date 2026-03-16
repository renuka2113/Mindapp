'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Flame, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // We use this to refresh the streak when navigating
  const [streak, setStreak] = useState(0);

  // Fetch the dynamic streak from the DB
  useEffect(() => {
    const fetchStreak = async () => {
      const userId = localStorage.getItem('userId') || 1;
      try {
        const res = await fetch(`/api/rewards?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setStreak(data.currentStreak || 0);
        }
      } catch (error) {
        console.error('Failed to fetch streak for header:', error);
      }
    };

    fetchStreak();
  }, [pathname]); // Re-run this check whenever the user changes pages (like after a check-in)

  const handleLogout = () => {
    // 1. Clear the local storage keys
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('latest_analysis');

    // 2. Redirect to the login page
    router.push('/login');

    // 3. Refresh the page to reset the layout state
    router.refresh();
  };
  const isAdminArea = pathname.startsWith('/admin');
  return (
    <header className='bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-slate-200 shadow-sm sticky top-0 z-50'>
      <div className='flex items-center gap-3'>
        {/* Logo */}
        <div className='bg-teal-700 p-2 rounded-xl text-white shadow-sm'>
          <Brain size={24} />
        </div>
        <div>
          <h1 className='text-lg sm:text-xl font-bold text-slate-900 leading-tight'>
            MindGuard
          </h1>
          <p className='text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide'>
            STUDENT WELLNESS
          </p>
        </div>
      </div>

      <div className='flex items-center gap-3 sm:gap-4'>
        {/* DYNAMIC STREAK BADGE */}
        {!isAdminArea && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-colors ${
              streak > 0
                ? 'bg-orange-50 text-orange-700 border-orange-100'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Flame
              size={16}
              className={
                streak > 0
                  ? 'text-orange-500 fill-orange-500'
                  : 'text-slate-400'
              }
            />
            <span>{streak}d streak</span>
          </div>
        )}

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className='flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-600 transition-colors border-l border-slate-200 pl-3 sm:pl-4 group'
        >
          <LogOut
            size={18}
            className='group-hover:-translate-x-0.5 transition-transform'
          />
          <span className='hidden sm:inline'>Log Out</span>
        </button>
      </div>
    </header>
  );
}
