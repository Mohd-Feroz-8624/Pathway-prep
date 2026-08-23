import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // 1. SEMESTERS
  // ============================================

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

  // ============================================
  // 2. COURSES
  // ============================================

  const courses = [
    {
      title: "Full Stack Web Development",
      slug: "full-stack-web-development",
      description:
        "Learn modern frontend and backend development and build production-ready full-stack applications.",
      category: "Development",
      level: "Intermediate",
      isPublished: true,
    },
    {
      title: "Data Structures and Algorithms",
      slug: "data-structures-and-algorithms",
      description:
        "Master DSA concepts and problem solving for technical interviews and competitive programming.",
      category: "DSA",
      level: "Intermediate",
      isPublished: true,
    },
    {
      title: "Interview Preparation",
      slug: "interview-preparation",
      description:
        "Prepare for technical interviews, HR rounds, aptitude tests, and placement assessments.",
      category: "Placement",
      level: "Beginner",
      isPublished: true,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: {
        slug: course.slug,
      },
      update: course,
      create: course,
    });
  }

  console.log("✅ Courses created successfully.");

  // ============================================
  // 3. FULL STACK ROADMAP
  // ============================================

  const fullStackRoadmap = await prisma.roadmap.upsert({
    where: {
      slug: "full-stack-developer-roadmap",
    },
    update: {
      title: "Full Stack Developer Roadmap",
      description:
        "A structured roadmap to become a job-ready full-stack developer.",
      category: "Development",
      duration: "6–9 Months",
      isPublished: true,
    },
    create: {
      title: "Full Stack Developer Roadmap",
      slug: "full-stack-developer-roadmap",
      description:
        "A structured roadmap to become a job-ready full-stack developer.",
      category: "Development",
      duration: "6–9 Months",
      isPublished: true,
    },
  });

  // ============================================
  // 4. ROADMAP STAGES
  // ============================================

  const stages = [
    {
      title: "HTML & CSS",
      description: "Build a strong foundation in web development.",
      order: 1,
      tasks: [
        "Learn HTML fundamentals",
        "Learn CSS fundamentals",
        "Learn Flexbox and Grid",
        "Build responsive web pages",
      ],
    },
    {
      title: "JavaScript",
      description: "Master modern JavaScript and browser fundamentals.",
      order: 2,
      tasks: [
        "Learn JavaScript fundamentals",
        "Learn ES6+ features",
        "Learn DOM manipulation",
        "Learn asynchronous JavaScript",
      ],
    },
    {
      title: "React",
      description: "Learn React and component-based frontend development.",
      order: 3,
      tasks: [
        "Learn React components",
        "Learn props and state",
        "Learn React hooks",
        "Build React projects",
      ],
    },
    {
      title: "Backend Development",
      description: "Build APIs and server-side applications.",
      order: 4,
      tasks: [
        "Learn Node.js",
        "Learn Express.js",
        "Build REST APIs",
        "Learn authentication and authorization",
      ],
    },
    {
      title: "Database",
      description: "Learn how to design and work with databases.",
      order: 5,
      tasks: [
        "Learn SQL fundamentals",
        "Learn PostgreSQL",
        "Learn Prisma ORM",
        "Design relational database schemas",
      ],
    },
    {
      title: "Deployment & DevOps",
      description: "Deploy and maintain production applications.",
      order: 6,
      tasks: [
        "Learn Git and GitHub",
        "Deploy applications with Vercel",
        "Configure environment variables",
        "Learn basic CI/CD concepts",
      ],
    },
  ];

  for (const stageData of stages) {
    const stage = await prisma.roadmapStage.upsert({
      where: {
        roadmapId_order: {
          roadmapId: fullStackRoadmap.id,
          order: stageData.order,
        },
      },
      update: {
        title: stageData.title,
        description: stageData.description,
      },
      create: {
        title: stageData.title,
        description: stageData.description,
        order: stageData.order,
        roadmapId: fullStackRoadmap.id,
      },
    });

    // ==========================================
    // 5. ROADMAP TASKS
    // ==========================================

    for (let index = 0; index < stageData.tasks.length; index++) {
      await prisma.roadmapTask.upsert({
        where: {
          stageId_order: {
            stageId: stage.id,
            order: index + 1,
          },
        },
        update: {
          title: stageData.tasks[index],
        },
        create: {
          title: stageData.tasks[index],
          order: index + 1,
          isRequired: true,
          stageId: stage.id,
        },
      });
    }
  }

  console.log("✅ Full Stack roadmap created successfully.");

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
