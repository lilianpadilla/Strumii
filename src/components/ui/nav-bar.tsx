"use client";

import { Profile } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes"
import { createClient } from "~/utils/supabase/client";
import { useIsMobile } from "~/hooks/use-mobile";
import { Music, Home, Activity, LogOut, User } from "lucide-react";

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
import { Menu, Sun, Moon, LogIn, PlusCircle, LayoutDashboard } from "lucide-react";

import { useAuth } from "~/providers/AuthProvider";
import { useNavbar } from "~/providers/NavbarProvider";

type Breadcrum = { name: string; url: string };
type NavbarProps = { 
  breadcrumbs?: Breadcrum[] | null 
};

export default function Navbar(props: NavbarProps) {
  const { profile, avatar, isLoading } = useAuth();
  const { middleNavbar, endNavbar, showNavbar } = useNavbar();
  const router = useRouter();
  const supabase = createClient();
  const { setTheme } = useTheme();
  const isMobile = useIsMobile();

  console.log("Navbar profile:", profile);

  async function logOut() {
    await supabase.auth.signOut();
    fetch(`${location.origin}/api/auth/logout`, { method: "POST", headers: { "Content-Type": "application/json" } });
    router.refresh();
    router.push("/auth/login");
  }
  function guardedPush(url: string) {
    router.push(url);
  }

  useEffect(() => {
    setTheme('light')
    console.log("light theme!")
  }, [])

  return (
    <>
    { showNavbar && (
      <>
        <header className="sticky top-0 z-50 w-full border-b border-border bg-[#93CAD7] backdrop-blur">
          {/* {!isMobile && */}
          <div className="flex h-24 w-full items-center gap-3 px-3">
            {/* Left: mobile menu (if logged in), logo, breadcrumbs */}
            <div className="flex h-full min-w-0 items-center gap-2">
            {/* <div className="flex min-w-0 items-center gap-2">
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
              </Link> */}
              <p className="font-[cursive] text-4xl">
                Welcome Back!
              </p>

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
            <div className="mx-auto flex">{middleNavbar}</div>
            {/* <div className="mx-auto flex">Hello</div> */}

            {/* Right: custom end slot, theme toggle, user menu */}
            <div className="ml-auto flex items-center gap-2">
              {endNavbar && (
                <>
                  <div className="hidden md:flex">{endNavbar}</div>
                  {/* <Separator orientation="vertical" className="mx-2 h-6" /> */}
                </>
              )}

              {/* User dropdown */}
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <button className="h-16 w-16">
                      <img src='/logo.png' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-sans">
                  <DropdownMenuItem>
                    <Link href="/account">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  {profile && (
                    <DropdownMenuItem>
                      <Link href="/auth/login">
                        Logout
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {!profile && (
                    <DropdownMenuItem>
                      <Link href="/auth/login">
                        Login
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
          {/* } */}

        </header>
        { isMobile && (
          <div className="z-100 fixed bottom-0 bg-[#93CAD7] h-20 w-full flex items-center justify-evenly py-3 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
            <Button
              onClick={() => router.push("/tuner")}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white text-black"
            >
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">Tuner</span>
            </Button>

            <Button
              onClick={() => router.push("/metronome")}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white text-black"
            >
              <Music className="h-5 w-5 mb-1" />
              <span className="text-xs">Metronome</span>
            </Button>

            <Button
              onClick={() => router.push("/")}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white text-black"
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </Button>
          </div>
        )}
      </>
    )}
    </>
  );
}
