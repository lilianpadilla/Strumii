"use client";

import React, { useEffect } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '~/components/ui/button';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from '~/utils/supabase/client';

const UpdatePassword = () => {
  const [password, setPassword] = React.useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  /**
   * Step 2: Once the user is redirected back to your application,
   * ask the user to reset their password.
   */
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt("What would you like your new password to be?");
        const { data, error } = await supabase.auth
          .updateUser({ password: newPassword })

        if (data) alert("Password updated successfully!")
        if (error) alert("There was an error updating your password.")
      }
    })
  }, [])

  return (
    <div>
      <div className="flex justify-center items-center h-[90vh]">
        {/* <div className="p-6 max-w-sm w-full rounded-lg border border-gray-200 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Update Password</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium">New Password</label>
                <input type="password" id="password" className="border border-gray-300 text-sm rounded-lg block w-full p-2.5" required />
              </div>
              <button type="submit" className="w-full btn btn-ghost text-primary">Update Password</button>
            </form>
        </div> */}
      </div>
   </div>
  );
};

export default UpdatePassword;
