export const dynamic = "force-dynamic";

import { createClient } from '~/utils/supabase/server';
import { Profile, Role, Course } from "@prisma/client";
import { caller } from '~/server/api/server';
import { redirect } from "next/navigation";

export default async function Dashboard() {

  return (
    <div className="flex w-full justify-center items-center h-[80vh]">
      <h1>Access Page - You are logged in!</h1>
    </div>
  )

};
