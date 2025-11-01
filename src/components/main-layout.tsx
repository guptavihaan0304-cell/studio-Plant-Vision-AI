'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Leaf, MessageCircleQuestion, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analysis', label: 'Scan', icon: Scan },
  { href: '/dashboard', label: 'Plants', icon: Leaf },
  { href: '/assistant', label: 'Tips', icon: MessageCircleQuestion },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const showBottomNav = !pathname.startsWith('/profile');

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 pb-24">{children}</main>
      
      {showBottomNav && (
        <footer className="fixed bottom-0 left-0 right-0 z-50">
          <nav className="mx-auto mb-4 max-w-md w-[calc(100%-2rem)] glassmorphic-panel p-2 rounded-full">
            <div className="flex justify-around items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center gap-1 text-muted-foreground w-16 h-16 rounded-full transition-all ease-in-out group">
                    <div className={cn(
                      "relative flex items-center justify-center w-12 h-12 rounded-full transition-all ease-in-out",
                      isActive ? 'bg-primary/20' : 'group-hover:bg-primary/10'
                    )}>
                      <item.icon className={cn(
                        "size-6 transition-all",
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/80'
                      )} />
                       {isActive && <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10"></span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </footer>
      )}
    </div>
  );
}
