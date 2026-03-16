'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import './globals.css';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const isPublicPath = pathname === '/login';
    const isAdminPath = pathname.startsWith('/admin');

    if (!isLoggedIn && !isPublicPath) {
      router.push('/login');
      return;
    }

    // 2. If logged in but trying to access Login page
    if (isLoggedIn && isPublicPath) {
      if (userRole === 'admin') router.push('/admin/dashboard');
      else router.push('/dashboard');
      return;
    }

    // 3. ROLE PROTECTION: Prevent Students from entering Admin area
    if (isLoggedIn && isAdminPath && userRole !== 'admin') {
      router.push('/dashboard'); // Kick student back to their dashboard
    }

    // 4. ROLE PROTECTION: Prevent Admins from entering Student area
    // (Optional, if you want admins to have a completely separate experience)
    if (isLoggedIn && !isAdminPath && !isPublicPath && userRole === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [pathname, router]);
  const isHideLayout = pathname === '/login';
  const isAdminArea = pathname.startsWith('/admin');
  return (
    <html lang='en'>
      <body className='bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col'>
        {!isHideLayout && <Header />}

        <main
          className={`flex-1 w-full mx-auto ${isHideLayout ? '' : 'max-w-5xl p-4 pb-24'}`}
        >
          {children}
        </main>

        {!isHideLayout  && !isAdminArea && <BottomNav />}
      </body>
    </html>
  );
}
