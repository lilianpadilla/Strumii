// Load .env file
// import dotenv from 'dotenv'
// dotenv.config()

const fs = require('fs')
const path = require('path')

import { PrismaClient, Prisma, Profile} from '@prisma/client'

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

const getProfiles = (): Prisma.ProfileCreateInput[] => [
  { 
    id: "00000000-0000-0000-0000-000000000001", 
    name: "John Doe",
  },
  { 
    id: "00000000-0000-0000-0000-000000000002", 
    name: "Jane Doe",
  },
];

const main = async () => {

  // Login the supabase client
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "user3@example.com",
    password: "password123",
  })
  if (error) {
    console.error(error)
    return
  }

  const profiles = await Promise.all(
    getProfiles().map((profile) => client.profile.upsert(
      {
        where: { id: profile.id },
        update: { ...profile },
        create: { ...profile },
      }
    ))
  );

  console.log(profiles)
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
