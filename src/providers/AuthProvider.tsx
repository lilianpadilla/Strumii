// providers/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@prisma/client";
import { createClient } from "~/utils/supabase/client";
import { trpc } from "~/server/api/client";

type AuthState = {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  avatar: string | null;
  setAvatar: (a: string | null) => void;
  user: any | null;
  isLoading: boolean;
};

const AuthCtx = createContext<AuthState>({
  profile: null,
  setProfile: () => {},
  avatar: null,
  setAvatar: () => {},
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({
  children,
  initialUser,
  initialProfile,
}: {
  children: React.ReactNode;
  initialUser: any;
  initialProfile: Profile | null;
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [user, setUser] = useState<any>(initialUser);
  const [avatar, setAvatar] = useState<string | null>(null); // we'll store a blob URL
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const supabase = createClient();
  const router = useRouter();
  const utils = trpc.useUtils();

  // --- Auth change subscription (no avatar fetch here anymore) ---
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        const p = await utils.auth.getProfile.fetch().catch(() => null);
        setUser(user);
        setProfile(p);
        setIsLoading(false);
        router.refresh();
        utils.invalidate();
      }
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setUser(null);
        setAvatar(null);         // important: clear old avatar
        router.refresh();
        utils.invalidate();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, supabase, utils]);

  // --- Load avatar whenever profile path or timestamp changes ---
  const lastObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAvatar() {
      // revoke previous blob URL
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }

      if (!profile?.avatarUrl) {
        setAvatar(null);
        return;
      }

      try {
        const ts = profile.avatarUrlUpdatedAt
          ? new Date(profile.avatarUrlUpdatedAt as unknown as string).getTime()
          : 0;

        const { data, error } = await supabase.storage
          .from("users")
          .createSignedUrl(profile.avatarUrl, 60 * 60); // 1h

        if (error || !data?.signedUrl) {
          console.error("Failed to create signed URL:", error);
          if (!cancelled) setAvatar(null);
          return;
        }

        // add a version param to ensure browser treats it as a new resource
        const url = new URL(data.signedUrl);
        url.searchParams.set("v", String(ts));

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`avatar fetch failed: ${res.status}`);

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        lastObjectUrlRef.current = objectUrl;

        if (!cancelled) setAvatar(objectUrl);
      } catch (e) {
        console.error(e);
        if (!cancelled) setAvatar(null);
      }
    }

    if (profile?.avatarUrl) void loadAvatar();
    else setAvatar(null);

    return () => {
      cancelled = true;
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    };
  }, [profile?.avatarUrl, profile?.avatarUrlUpdatedAt, supabase]);

  // --- CRITICAL: include `avatar` in deps so consumers re-render ---
  const value = useMemo(
    () => ({ profile, setProfile, avatar, setAvatar, user, isLoading }),
    [profile, avatar, user, isLoading] // avatar included; setters need not be listed
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
