"use server";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Profiler } from "react";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem, DropdownMenuLabel } from "~/components/ui/dropdown-menu";

export default async function Page() {

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-row items-center justify-between w-full text-black text-3xl font-[cursive] p-8 bg-[#c7e6ed]">
          Welcome Back!
      <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <button className="h-12 w-12">
          <Avatar>
            <AvatarImage src="/logo.png" alt="Logo" />
          </Avatar>
          </button>
        </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white font-sans">
        <DropdownMenuItem>
          My Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
        
        <div className="bg-[#93CAD7] h-full w-full justify-items-center pt-20 space-y-6">
          <Button className="flex justify-center w-4/5 h-80 text-2xl"> Start Lesson!
          </Button> 
          <Button className="flex justify-center w-4/5 h-40 text-2xl"> Lesson History
          </Button> 
          
        </div>
        <div className="fixed bottom-0 bg-[#84B3BE] h-1/9 w-full flex items-center justify-evenly py-3">
          <Button className="w-19 h-19 rounded-2xl bg-white text-black ">
            Tuner
          </Button>
          <Button className="w-19 h-19 rounded-2xl bg-white text-black ">
            Metranome
          </Button>
          <Button className="w-19 h-19 rounded-2xl bg-white text-black">
            Home
          </Button>

        </div>
      </div>     
    </>
  );
};
