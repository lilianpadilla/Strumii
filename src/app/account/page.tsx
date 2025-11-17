"use server";

import PreferencesCard from "./pref";
import { AccountInfoCard } from "./account-info-card";
import { caller } from "@/server/api/server";

export default async function Page() {
  const profile = await caller.profile.getProfile();
  console.log(profile);
  const userPreferences = await caller.profile.getUserPreferences({id: profile?.userPreferencesId!});
  console.log(userPreferences);

  // const MOCK_DATA = {
  //  skill: "beginner",
  //  genreChoie: ["Rock", "Pop"],
  //  lessonLength: "2"
  // }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 pt-24 px-6 space-y-10">    
      <AccountInfoCard />
      <PreferencesCard userPreferences={userPreferences} />
    </div>
  );
}
