'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Bot, BookMarked } from 'lucide-react';
import { Header } from './header';
import { useUser } from '@/firebase';

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  // Do not render sidebar-dependent layout on the login page.
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Leaf className="text-primary size-8" />
            <h1 className="font-headline text-2xl font-bold text-foreground">PlantVision AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip={{ children: 'AI Analysis' }}
              >
                <Link href="/">
                  <Bot />
                  <span>AI Analysis</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/assistant'}
                tooltip={{ children: 'AI Assistant' }}
              >
                <Link href="/assistant">
                  <Bot />
                  <span>AI Assistant</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip={{ children: 'My Records' }}
              >
                <Link href="/dashboard">
                  <BookMarked />
                  <span>My Records</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6 flex-1">{children}</main>
        <footer className="p-4 text-center text-xs text-muted-foreground">
          All Rights Reserved &copy; 2025
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
