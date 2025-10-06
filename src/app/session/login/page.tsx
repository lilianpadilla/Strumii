"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '~/utils/supabase/client';
import { AuthCard } from '~/app/session/auth-form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

const Page = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  function validateInput() {
    if (email === '' || password === '' || password.length < 8) {
      setError("Please fill out all fields.");
      return false;
    }
    return true;
  }

  async function signInWithEmail(e: any) {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      setError(error.message);
      console.log(error.message)
    } else {
      // Redirect to dashboard
      console.log("redirecting to access")
      router.push("/access");
    }

  }

  return (
    <div>
      <AuthCard
        title="Login"
        errorMsg={error}
        onToastDismiss={(type) => {
          if (type === "error") setError("");
        }}
      >
        <form>
          <Label htmlFor="email" className="mb-2 text-sm">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />

          <Label htmlFor="password" className="mb-2 text-sm">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button
            type="button"
            className="w-full btn btn-primary"
            onClick={signInWithEmail}
          >
            Login
          </Button>
        </form>
        <div className="flex justify-between items-center mt-4">

          <Button
            variant="ghost"
            className="text-sm btn btn-ghost text-primary hover:underline"
            onClick={() => router.push("/session/register")}
          >
            Register Account
          </Button> 
          <Button
            variant="ghost"
            className="text-sm btn btn-ghost text-primary hover:underline"
            onClick={() => router.push("/session/forgot-password")}
          >
            Forgot Password?
          </Button>
        </div>
      </AuthCard>
    </div>
  );
};

export default Page;
