import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./src/db/index.js";

const runMigration = async () => {
  console.log("🚀 Starting Drizzle migration...");
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
  } finally {
    process.exit(0);
  }
};

runMigration();
