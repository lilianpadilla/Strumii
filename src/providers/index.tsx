"use client";
import { Profile } from "@prisma/client";

import { AuthProvider } from "./AuthProvider";
import { TRPCProvider } from "~/server/api/client";
import { MiddleNavBarProvider, EndNavBarProvider } from "./NavbarProvider";
import React from "react";
import { ThemeProvider } from '@/providers/theme-provider';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import NavBar from '~/components/ui/nav-bar';
import { MobileStatusBar } from "~/components/ui/mobile-status-bar";
import { Toaster } from "@/components/ui/sonner";

type ProvidersProps = {
  profile: Profile | null;
  user: any;
  children: React.ReactNode;
};

export function Providers({ profile, user, children }: ProvidersProps) {
  return (
    <>
      <TRPCProvider>
        <AuthProvider initialProfile={profile} initialUser={user}>
          <MiddleNavBarProvider>
            <EndNavBarProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster />
                <MobileStatusBar/>
                <SidebarProvider
                  defaultOpen={false}
                >
                  <div className="flex flex-col w-full">
                    <NavBar/>
                    <div className="flex">
                      <AppSidebar className="relative max-h-[calc(100dvh-64px)]"/>
                      <SidebarInset className="absolute">
                        {children}
                      </SidebarInset>
                    </div>
                  </div>
                </SidebarProvider>
              </ThemeProvider>
            </EndNavBarProvider>
          </MiddleNavBarProvider>
        </AuthProvider>
      </TRPCProvider>
    </>
  );
}
