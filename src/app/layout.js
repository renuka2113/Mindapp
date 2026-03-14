'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import './globals.css';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // If not logged in and trying to access app pages -> send to login
    if (!isLoggedIn && !isAuthPage) {
      router.push('/login');
    }
    
    // If logged in and trying to access login page -> send to dashboard
    if (isLoggedIn && isAuthPage) {
      router.push('/dashboard');
    }
  }, [pathname, router, isAuthPage]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">
        {!isAuthPage && <Header />}
        
        <main className={`flex-1 w-full mx-auto ${isAuthPage ? '' : 'max-w-5xl p-4 pb-24'}`}>
          {children}
        </main>

        {!isAuthPage && <BottomNav />}
      </body>
    </html>
  );
}