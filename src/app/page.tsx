"use client";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem, DropdownMenuLabel } from "~/components/ui/dropdown-menu";

export default function Page() {
  const { profile, avatar, isLoading } = useAuth();

  return (
    <>
      <div className="flex flex-col w-full  ">
        <div className="h-full w-full justify-items-center pt-20 space-y-6">
          <Button variant="secondary" className="flex justify-center w-4/5 h-80 text-2xl bg-[#93CAD7]"> 
            <Link href="/lesson-overview">
            Start Lesson!
            </Link>
          </Button> 
          
          <Button variant="secondary" className="flex justify-center w-4/5 h-40 text-2xl bg-[#93CAD7]">
            <Link href="/lesson-history">
              Lesson History
            </Link> 

          </Button> 
        </div>
      </div>     
    </>
  );
};
