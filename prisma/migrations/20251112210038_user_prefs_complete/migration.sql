/*
  Warnings:

  - A unique constraint covering the columns `[userPreferencesId]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userPreferencesId` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."profile" ADD COLUMN     "userPreferencesId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" UUID NOT NULL,
    "preferredGenres" TEXT[],
    "skillLevel" TEXT NOT NULL,
    "lessonLength" INTEGER NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_userPreferencesId_key" ON "public"."profile"("userPreferencesId");

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "public"."user_preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
