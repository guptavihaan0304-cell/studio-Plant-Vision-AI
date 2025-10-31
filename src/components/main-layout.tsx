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
import { Leaf, Bot, History, MessageSquare, Home, Cog } from 'lucide-react';
import { Header } from './header';
import { useUser } from '@/firebase';
import { useLanguage } from '@/hooks/use-language';
import { Toaster } from './ui/toaster';

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const { translations } = useLanguage();

  // Do not render sidebar-dependent layout on the login page.
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="text-primary size-8" />
              <h1 className="font-headline text-2xl font-bold text-foreground">Verdant Lens</h1>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  tooltip={{ children: "Home" }}
                >
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/analysis'}
                tooltip={{ children: translations.aiAnalysis as string }}
              >
                <Link href="/analysis">
                  <Bot />
                  <span>{translations.aiAnalysis}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/assistant'}
                tooltip={{ children: translations.aiAssistant as string }}
              >
                <Link href="/assistant">
                  <MessageSquare />
                  <span>{translations.aiAssistant}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip={{ children: translations.history as string }}
              >
                <Link href="/dashboard">
                  <History />
                  <span>{translations.history}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/how-it-works'}
                tooltip={{ children: 'How It Works' }}
              >
                <Link href="/how-it-works">
                  <Cog />
                  <span>How It Works</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col min-h-screen w-full">
        <SidebarInset>
          <Header />
          <main className="p-4 lg:p-6 flex-1">{children}</main>
        </SidebarInset>
        <footer className="p-4 text-center text-xs text-muted-foreground">
            <div className="font-headline font-semibold mb-2">Growing plants smarter with AI.</div>
            <div>All Rights Reserved &copy; 2025 NL DALMIA HIGH SCHOOL 86NG2</div>
            <div>Customer Care: +91 88500 14411</div>
        </footer>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
