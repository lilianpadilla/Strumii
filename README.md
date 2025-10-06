# NextJSAppTemplate

![Example](./docs/NextJSAppTemplate.png)

Here is an opinionated template for a NextJS application to make a web and mobile solution within a single codebase.

## Tech Stack

- [Next.js App Router](https://nextjs.org/docs): Meta framework for Client/Server
- [Prisma](https://prisma.io): Postgres ORM
- [Tailwind CSS](https://tailwindcss.com): CSS Syntax Sugar 
- [Shadcn UI](https://ui.shadcn.com/docs/cli): UI Design System
- [tRPC](https://trpc.io): Client/Server Communication Protocol
- [Supabase](https://supabase.com/docs): BaaS Service
- [Capacitor](https://capacitorjs.com/): Mobile (Android + iOS) Port System

## Dependecies

Make sure to install the following in your local computer:
* [NodeJS](https://nodejs.org/en/download)
* [Docker](https://www.docker.com/products/docker-desktop/)

## Install

First, start by installing the dependencies of the repository:

```bash
npm install
```

### Setup the Supabase Backend
Rename the Supabase backend by editing the ``supabase/config.toml`` and changing ``project_id`` from ``"Template"`` to your desired project name.

Install supabase CLI for local development in your device. This command will download and locally run the Supabase Docker container.

```bash
npx supabase start
```

After running the previous ``start`` command, the Supabase server will printout it's URL and secrets that are needed to access the database and other services. It should look like this, with different values for your own local instance.

```bash
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

If you forget to add these, you can always access these via:

```bash
npx supabase status
```

Now at the root of the Github repository, create a new ``.env`` file with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=<add the "anon key here">
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY=<add the "service_role key here">
DIRECT_URL=postgresql://postgres:postgres@localhost:54322/postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

Then replace ``NEXT_PUBLIC_SUPABASE_ANON_KEY`` and ``SUPABASE_SERVICE_KEY`` with the ``anon key`` and ``service_role key`` provided by the ``npx supabase start`` command.

Check that the Subabase Studio dashboard is accessible at [http://127.0.0.1:54323](http://127.0.0.1:54323).

#### Migrating the Database

Deploy the Prisma migrations to the Supabase database:

```bash
npx prisma migrate dev --name init # only needed for the first time initialization
npm run migrate-dev
```

Generate test data through the Prisma seed:

```bash
npm run seed
```

## Running the Development Server

Now that the database is ready and primed with the test data, you should be able to run the NextJS application with the following command

```bash
npm run dev
```

Then you should be greeted with: 

```bash
> NextJSAppTemplate@0.0.1 dev
> next dev --turbopack

   ▲ Next.js 15.5.3 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.23:3000
   - Environments: .env
   - Experiments (use with caution):
     ✓ webpackMemoryOptimizations

 ✓ Starting...
 ✓ Compiled middleware in 133ms
 ✓ Ready in 1691ms
```

Now you should be able to access the local development server at [http://localhost:3000](http://localhost:3000).

## Development

We have created dev-purpose accounts to test users. Additionally, dummy data is used to populate in the Postgres DB to help test out features faster. This dummy data is seeded into the DB in ``prisma/seed.ts`` file and the fake accounts are visible in ``supabase/seed.sql``. 

| Username          | Password      |
| --------          | --------      |
| user1@example.com | password123   |
| user2@example.com | password123   |
| user3@example.com | password123   |

# Capacitor - Mobile

For mobile deployment, we are using NextJS bundled by Capacitor. Below are the instructions to make this system work.

> [!WARNING]
> Mobile Development only works in networks that allow device-to-device communication. It's likely that school networks will restrict this type of network traffic. A way to test is by trying to access the NextJS dev server via your phone. If that works, then Capacitor will also work.

## iOS

For iOS development, you will need a computer that runs on macOS, such as a MacBook Air or Pro. Additionally, you will need to install Xcode to be able to run an iPhone emulator. [Follow the instruction found here to install Xcode](https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators).

### Dependencies

Install CocoaPods (required for the workspace/schemes)

```bash
sudo gem install cocoapods
pod setup
```

Ensure Pods generate the workspace

```bash
cd ios
pod install
cd ..
```

If pod install errors, fix Ruby/CocoaPods until it’s clean.

### Sync and Run iOS App
If you change the capacitor setup, you will need to sync Capacitor (copy assets + config) via:

```bash
export CAP_SERVER_URL="http://<YOUR-LAN-IP>:3000"   # e.g. http://192.168.1.50:3000
npx cap sync ios
```

After syncing (if needed), you can open the workspace and run the application via the following command:

```bash
npx cap open ios
```

Within the Xcode IDE, you might need to configure the following:

Make sure you opened ``ios/App/App.xcworkspace`` (not the .xcodeproj).
* Show the Project Navigator (⌘1). You should see App and Pods.
* Scheme dropdown (top left) → App. Destination → pick a simulator (iPhone 15/16 Pro).
* First time only: target App → Signing & Capabilities → choose your Apple Team.
* Run (▶ / Cmd-R).

If the scheme menu is still weird: Product → Scheme → Manage Schemes… and ensure App exists and is checked “Shared”.

After this one-time setup, you should be able to simply press the run ▶ button.

## Android

For Android, any operating system (MacOS, Linux, and Windows) that supports Android Studio should work. [Install Android Studio using the following guide](https://developer.android.com/studio?gclsrc=aw.ds&gad_source=1&gad_campaignid=21831783525&gbraid=0AAAAAC-IOZmukinfOZWCPtxydlf4EB01u&gclid=Cj0KCQjw267GBhCSARIsAOjVJ4FzyfG7UfuWL4Up_EG4wbBu1HDklr1S_YHjvkprsdJb9MiY1UF-YjIaAsxAEALw_wcB).

### Dependencies 

Make sure to install a phone emulator via the Android Studio IDE before trying to run the Capacitor app.

### Sync and Run Android App

If you change the capacitor setup, you will need to sync Capacitor (copy assets + config) via:

```bash
export CAP_SERVER_URL="http://<YOUR-LAN-IP>:3000"   # e.g. http://192.168.1.50:3000
npx cap sync android
```

After syncing (if needed), you can open the workspace and run the application via the following command:

```bash
npx cap open android
```

Within the Android Studio, you should be able to directly press a play button ▶ to start the Android app on a the phone emulator.