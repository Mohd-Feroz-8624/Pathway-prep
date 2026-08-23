import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("🌱 Starting database seed...");

  for (let number = 1; number <= 8; number++) {
    await prisma.semester.upsert({
      where: {
        number,
      },
      update: {},
      create: {
        number,
        name: `Semester ${number}`,
      },
    });
  }

  console.log("✅ Semesters 1–8 created successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
