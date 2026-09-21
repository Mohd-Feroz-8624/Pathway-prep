import "dotenv/config";

import { prisma } from "../lib/prisma";
import { DEFAULT_TEMPLATE_CONFIG } from "../lib/resume-template-config";
import { Prisma } from "@/app/generated/prisma/browser";

async function main() {
  const templates = await prisma.resumeTemplate.findMany({
    where: {
      designConfig: {
        equals: Prisma.DbNull,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  console.log(`Found ${templates.length} templates to migrate.`);

  for (const template of templates) {
    await prisma.resumeTemplate.update({
      where: {
        id: template.id,
      },
      data: {
        designConfig: DEFAULT_TEMPLATE_CONFIG,
      },
    });

    console.log(`Migrated: ${template.name}`);
  }

  console.log("Resume template configuration migration completed.");
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
