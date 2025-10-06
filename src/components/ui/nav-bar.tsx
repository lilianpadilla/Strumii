"use client";

import { Profile } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes"
import { createClient } from "~/utils/supabase/client";

import { trpc } from "~/server/api/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Sun, Moon, User, LogOut, LogIn, PlusCircle, LayoutDashboard } from "lucide-react";

import { useAuth } from "~/providers/AuthProvider";
import { middleNavBarContext, endNavBarContext } from "~/providers/NavbarProvider";

type Breadcrum = { name: string; url: string };
type NavbarProps = { 
  breadcrumbs?: Breadcrum[] | null 
};

export default function Navbar(props: NavbarProps) {
  const { profile, avatar, isLoading } = useAuth();
  const middleNavBarContent = useContext(middleNavBarContext);
  const endNavBarContent = useContext(endNavBarContext);
  const router = useRouter();
  const supabase = createClient();
  const { setTheme } = useTheme();

  async function logOut() {
    await supabase.auth.signOut();
    fetch(`${location.origin}/api/auth/logout`, { method: "POST", headers: { "Content-Type": "application/json" } });
    router.refresh();
    router.push("/session/login");
  }
  function guardedPush(url: string) {
    router.push(url);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center gap-3 px-3">
        {/* Left: mobile menu (if logged in), logo, breadcrumbs */}
        <div className="flex min-w-0 items-center gap-2">
          { profile && (
            <SidebarTrigger />
          )}

          <Link href="/" className="shrink-0">
            <img
              loading="lazy"
              src="/logo.png"
              className="h-8 w-8"
              alt="Logo"
            />
          </Link>

          {/* Breadcrumbs */}
          <div className="hidden min-w-0 md:block">
            {props.breadcrumbs?.length ? (
              <Breadcrumb>
                <BreadcrumbList className="text-sm">
                  {props.breadcrumbs.map((b, i) => {
                    const isLast = i === props.breadcrumbs!.length - 1;
                    return (
                      <div key={i} className="inline-flex items-center">
                        <BreadcrumbItem>
                          {b.url ? (
                            <BreadcrumbLink asChild>
                              <button
                                className="truncate hover:underline"
                                onClick={() => guardedPush(b.url)}
                                title={b.name}
                              >
                                {b.name}
                              </button>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="truncate" title={b.name}>
                              {b.name}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            ) : null}
          </div>
        </div>

        {/* Middle slot (from context) */}
        <div className="mx-auto hidden md:flex">{middleNavBarContent}</div>

        {/* Right: custom end slot, theme toggle, user menu */}
        <div className="ml-auto flex items-center gap-2">
          {endNavBarContent && (
            <>
              <div className="hidden md:flex">{endNavBarContent}</div>
              <Separator orientation="vertical" className="mx-2 h-6" />
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun suppressHydrationWarning={true} className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
                <Moon suppressHydrationWarning={true} className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatar} alt="User" />
                  <AvatarFallback>
                    <User suppressHydrationWarning={true} className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {profile ? (
                <>
                  <DropdownMenuItem onClick={() => guardedPush("/access/account")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => guardedPush("/access")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => guardedPush("/session/login")}>
                    <LogIn className="mr-2 h-4 w-4" /> Log In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => guardedPush("/session/register")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Register
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Optional: desktop divider under middle content */}
      {/* <Separator /> */}
    </header>
  );
}
