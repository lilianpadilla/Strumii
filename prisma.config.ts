import path from "node:path";
import type { PrismaConfig } from "prisma";

// import your .env file
import "dotenv/config";

export default {
  schema: path.join("prisma", "schema"),
  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
    path: path.join("prisma", "migrations"),
  }
} satisfies PrismaConfig;