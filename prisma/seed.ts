// Load .env file
// import dotenv from 'dotenv'
// dotenv.config()

const fs = require('fs')
const path = require('path')

import { PrismaClient, Prisma, Profile, Lesson} from '@prisma/client'

// Create Supabase client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const client = new PrismaClient()

const today = new Date();
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1)
let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1)

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

const getUserPreferences = (): Prisma.UserPreferencesCreateInput[] => [
  {
    id: "00000000-0000-0000-0000-000000000001",
    preferredGenres: ["Rock", "Jazz"],
    skillLevel: "beginner",
    lessonLength: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    preferredGenres: ["Classical", "Pop"],
    skillLevel: "intermediate",
    lessonLength: 4,
  },
];

const getProfiles = (): Prisma.ProfileCreateInput[] => [
  { 
    id: "00000000-0000-0000-0000-000000000001", 
    name: "John Doe",
    userPreferences: { connect: {id: "00000000-0000-0000-0000-000000000001"} }
  },
  { 
    id: "00000000-0000-0000-0000-000000000002", 
    name: "Jane Doe",
    userPreferences: { connect: {id: "00000000-0000-0000-0000-000000000002"} }
  },
];

const getLessons = (): Prisma.LessonCreateInput[] => [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Lesson 1",
    description: "This is lesson 1",
    chords: [
      JSON.stringify({
        key: "A",
        suffix: "maj"
      })
    ],
    createdAt: yesterday,
    updatedAt: yesterday,
    completed: false,
    expDuration: 10,
    profile: { connect: {id: "00000000-0000-0000-0000-000000000001"} }
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Lesson example: not Completed",
    description: "This is a not-completed lesson",
    chords: [
      JSON.stringify({
        key: "A",
        suffix: "maj",
      }),
      JSON.stringify({
        key: "C",
        suffix: "min",
      }),
      JSON.stringify({
        key: "B",
        suffix: "maj",
      }),
    ],
    createdAt: yesterday,
    updatedAt: yesterday,
    completed: false,
    expDuration: 5,
    profile: { connect: {id: "00000000-0000-0000-0000-000000000001"} }
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Lesson example: Completed Lesson",
    description: "This is a completed lesson",
    chords: [
      JSON.stringify({
        key: "B",
        suffix: "maj",
      }),
    ],
    createdAt: yesterday,
    updatedAt: yesterday,
    completed: true,
    expDuration: 15,
    profile: { connect: {id: "00000000-0000-0000-0000-000000000001"} }
  },
];

const main = async () => {

  // Login the supabase client
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "user2@example.com",
    password: "password123",
  })
  if (error) {
    console.error(error)
    return
  }

  const userPreferences = await Promise.all(
    getUserPreferences().map((pref) => client.userPreferences.upsert(
      {
        where: { id: pref.id },
        update: { ...pref },
        create: { ...pref },
      }
    ))
  );

  const profiles = await Promise.all(
    getProfiles().map((profile) => client.profile.upsert(
      {
        where: { id: profile.id },
        update: { ...profile },
        create: { ...profile },
      }
    ))
  );

  const lessons = await Promise.all(
    getLessons().map((lesson) => client.lesson.upsert(
      {
        where: { id: lesson.id },
        update: { ...lesson },
        create: { ...lesson },
      }
    ))
  );

  console.log(userPreferences)
  console.log(profiles)
  console.log(lessons)
};

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
