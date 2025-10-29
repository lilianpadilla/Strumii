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
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 pt-24 px-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Account Information
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || "/default-avatar.png"} />
          </Avatar>

          <div className="w-full space-y-4 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">Account Name</p>
              <p className="text-lg font-semibold text-gray-800">{profile?.full_name || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-800">{profile?.email || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Password</p>
              <p className="text-lg font-semibold text-gray-800">********</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
