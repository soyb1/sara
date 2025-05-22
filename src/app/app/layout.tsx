"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { MessagesSquare, ImagePlay, PanelLeft, Bot } from 'lucide-react';
import { useAgeVerification } from '@/contexts/age-verification-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isVerified, isLoading } = useAgeVerification();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isVerified) {
      router.push('/'); // Redirect to home page if not verified, modal will show
    }
  }, [isVerified, isLoading, router]);

  if (isLoading || !isVerified) {
    // Show loading or a blank page while checking/redirecting
    // The age verification modal will handle the UI for non-verified users from RootLayout
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Bot className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center justify-between">
            <Link href="/app/chat" className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                My AI GF
              </h1>
            </Link>
          <SidebarTrigger className="md:hidden group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/app/chat" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === '/app/chat'}
                  tooltip={{ children: 'Chat', side: 'right', align: 'center' }}
                >
                  <MessagesSquare />
                  <span className="truncate">Chat</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/app/image-generator" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === '/app/image-generator'}
                  tooltip={{ children: 'Image Generator', side: 'right', align: 'center' }}
                >
                  <ImagePlay />
                  <span className="truncate">Image Generator</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center">
            <PanelLeft className="h-5 w-5 group-data-[collapsible=icon]:hidden" />
             <span className="group-data-[collapsible=icon]:hidden">Toggle Sidebar</span>
             <span className="sr-only hidden group-data-[collapsible=icon]:inline-block">Toggle Sidebar</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-2 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
