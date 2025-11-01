'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Leaf, MessageCircleQuestion, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analysis', label: 'Scan', icon: Scan },
  { href: '/dashboard', label: 'Plants', icon: Leaf },
  { href: '/assistant', label: 'Tips', icon: MessageCircleQuestion },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const showNav = !pathname.startsWith('/login');

  return (
    <div className="flex flex-col min-h-screen w-full">
      {showNav && <Header />}
      <main className="flex-1 pb-24">{children}</main>
      
      {showNav && (
        <footer className="fixed bottom-0 left-0 right-0 z-50">
          <nav className="mx-auto mb-4 max-w-md w-[calc(100%-2rem)] bg-card/80 backdrop-blur-lg border rounded-full shadow-lg p-1">
            <div className="flex justify-around items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 text-muted-foreground w-16 h-14 rounded-full transition-colors duration-75 group" title={item.label}>
                    <div className={cn(
                      "relative flex flex-col items-center justify-center w-full h-full rounded-full transition-colors duration-75",
                      isActive ? 'bg-primary/20' : 'group-hover:bg-primary/10'
                    )}>
                      <item.icon className={cn(
                        "size-6 transition-colors duration-75",
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      )} />
                      <span className={cn("text-xs font-semibold", isActive ? 'text-primary' : 'text-muted-foreground')}>
                          {item.label}
                      </span>
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

    