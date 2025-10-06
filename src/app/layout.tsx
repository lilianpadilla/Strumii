import type { Metadata } from 'next'
import "~/app/globals.css";
import { cn } from "~/utils/cn";
import { Roboto } from "next/font/google";
import { createClient } from '~/utils/supabase/server';
import { caller } from '~/server/api/server';

import { Profile } from "@prisma/client";
import { Providers } from "~/providers";

export const metadata: Metadata = {
  title: 'APP HOLDER',
  description: 'DESCRIPTION HOLDER',
}

const font = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize Supabase client
  const supabase = await createClient();

  // Check if user is authenticated and if so, fetch their profile
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    profile = await caller.auth.getProfile();
  }

  return (
    <>
      <html lang="en" suppressHydrationWarning={true}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body
          className={cn(
            "bg-background font-sans antialiased",
            font.className,
          )}
        >
          <Providers profile={profile} user={user}>
            {children}
          </Providers>
        </body>
      </html>
    </>
  );
}
