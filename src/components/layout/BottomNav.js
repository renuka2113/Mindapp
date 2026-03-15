import Link from 'next/link';
import { LayoutGrid, ClipboardList, ListChecks, TrendingUp, Trophy, Bell } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Check-In', path: '/check-in', icon: ClipboardList },
    { name: 'My Plan', path: '/my-plan', icon: ListChecks },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Rewards', path: '/rewards', icon: Trophy },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-5xl mx-auto flex justify-around items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              href={item.path} 
              key={item.name}
              className="flex flex-col items-center p-3 text-slate-400 hover:text-teal-700 transition-colors group"
            >
              <Icon size={22} className="mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-xs font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}