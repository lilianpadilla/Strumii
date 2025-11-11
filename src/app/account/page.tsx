"use client";

import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem, DropdownMenuLabel } from "~/components/ui/dropdown-menu";
import PreferencesCard from "./pref";


function getInitials(name: string | undefined) {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials.slice(0, 2);
}

export default function Page() {
  const { profile, avatar, isLoading, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 pt-24 px-6 space-y-10">
      
      {/* Account Info Card */}
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Account Information
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback>
              {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="w-full space-y-4 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">Account Name</p>
              <p className="text-lg font-semibold text-gray-800">{profile?.name || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Card */}
      <PreferencesCard />
    </div>
  );
}
