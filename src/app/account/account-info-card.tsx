"use client";

import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useAuth } from "~/providers/AuthProvider";

function getInitials(name: string | undefined) {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials.slice(0, 2);
}

export function AccountInfoCard() {
    const { profile, avatar, isLoading, user } = useAuth();

    return (
    <>
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
      </>
    )
}