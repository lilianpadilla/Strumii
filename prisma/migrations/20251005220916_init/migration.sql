-- CreateTable
CREATE TABLE "public"."profile" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);
