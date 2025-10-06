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

const ForgotPassword = () => {
  const [email, setEmail] = React.useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check that email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Here you would call your API to send the reset link
    /**
     * Step 1: Send the user an email to get a password reset token.
     * This email contains a link which sends the user back to your application.
     */
    const { data, error } = await supabase.auth
      .resetPasswordForEmail(email, { redirectTo: `${location.origin}/session/reset-password` });

    if (error) {
      toast.error("Error sending reset link.");
    } else {
      toast.success("Reset link sent!");
    }
  }

  return (
    <div>
      <div className="flex justify-center items-center h-[90vh]">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Please enter your email address to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm">Email Address</label>
                <input type="email" id="email" className="border border-neutral overflow-hidden bg-base-100 text-sm rounded-2xl block w-full p-2.5" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </form>
            <Button type="submit" className="w-full btn btn-primary" onClick={handleSubmit}>
              Send Reset Link
            </Button>
          </CardContent>

          <CardFooter>
            <CardAction>
              <Button variant="ghost" className="w-full" onClick={() => router.push("/session/login")}>
                Back to Login
              </Button>
            </CardAction>
          </CardFooter>

        </Card>
      </div>
   </div>
  );
};

export default ForgotPassword;