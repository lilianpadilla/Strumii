"use client";

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '~/utils/supabase/client';

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
import { Label } from '~/components/ui/label';
import { Input, HideShowInput } from '~/components/ui/input';
import { Checkbox } from '~/components/ui/checkbox';
import { toast } from "sonner";
import { trpc } from '~/server/api/client';

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase();
}

export default function RegisterForm() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [registered, setRegistered] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  const profileUpdate = trpc.profile.updateProfile.useMutation();

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  async function signUpWithEmail(e: any) {
    e.preventDefault()

    // Check that names, email, and password are filled out
    if (!email || !password || !name || !confirmPassword) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Then check that password and confirm match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check that password is at least 8 characters, contains at least one number, and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters long and contain at least one letter and one number.");
      return;
    }

    // Check that email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Check that terms are accepted
    if (!acceptedTerms) {
      toast.error("You must accept the Terms of Use and Privacy Policy.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`
      }
    })

    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {

      // Update the profile with first and last name
      await profileUpdate.mutateAsync({
        profileId: data.user?.id || "",
        name: name || "",
      });
      setRegistered(true);
      toast.success("Registration successful! Please check your email for further instructions.");
    }
  }

  return (
    <div>
      { registered && (
        <div className="flex justify-center items-center h-[60vh] md:h-[90vh]">
          <div className="flex flex-col items-center">
            <Check className="h-4 w-4" />
            <span>Registration successful! Please check your email for further instructions.</span>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/access")}
            >
              Go to Access Page
            </Button>
          </div>
        </div>
      )}

      { !registered && (
        <div className="flex justify-center items-center h-[60vh] md:h-[90vh]">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Create your Account</CardTitle>
              <CardDescription>
                Please fill out the form below to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                {/* Name */}
                <Label htmlFor="name" className="mb-2 text-sm">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  className="mb-4"
                />

                {/* Email */}
                <Label htmlFor="email" className="mb-2 text-sm">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4"
                />

                {/* Password */}
                <Label htmlFor="password" className="mb-2 text-sm">Password</Label>
                <HideShowInput
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4"
                />

                {/* Confirm Password */}
                <Label htmlFor="confirm-password" className="mb-2 text-sm">Confirm Password</Label>
                <HideShowInput
                  id="confirm-password"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-4"
                />

                {/* Terms of Use and Privacy Policy */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={val => setAcceptedTerms(val === true)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <Link href="/policies/terms" className="text-primary hover:underline">Terms of Use</Link> and <Link href="/policies/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full mt-4 btn btn-primary"
                onClick={signUpWithEmail}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                className="text-sm btn btn-ghost text-primary hover:underline mt-4"
                onClick={() => router.push("/session/login")}
              >
                Already have an account? Log in
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}