import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const semesterData = [
  {
    number: 1,
    name: "Semester 1",
    subjects: [
      {
        name: "Programming Fundamentals",
        code: "PF",
        units: [
          {
            number: 1,
            title: "Programming Basics",
            topics: [
              "Introduction to Programming",
              "Algorithms and Flowcharts",
              "Variables and Data Types",
              "Operators and Expressions",
            ],
          },
          {
            number: 2,
            title: "Control Structures",
            topics: [
              "Conditional Statements",
              "Loops",
              "Nested Loops",
              "Pattern Programming",
            ],
          },
        ],
      },
      {
        name: "Mathematics",
        code: "MATH",
        units: [
          {
            number: 1,
            title: "Foundations",
            topics: ["Sets", "Relations", "Functions", "Logic"],
          },
        ],
      },
      {
        name: "Digital Logic",
        code: "DL",
        units: [
          {
            number: 1,
            title: "Digital Fundamentals",
            topics: [
              "Number Systems",
              "Boolean Algebra",
              "Logic Gates",
              "Combinational Circuits",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 2,
    name: "Semester 2",
    subjects: [
      {
        name: "Data Structures",
        code: "DS",
        units: [
          {
            number: 1,
            title: "Linear Data Structures",
            topics: ["Arrays", "Linked Lists", "Stacks", "Queues"],
          },
          {
            number: 2,
            title: "Non-Linear Data Structures",
            topics: ["Trees", "Binary Trees", "Binary Search Trees", "Graphs"],
          },
        ],
      },
      {
        name: "Object Oriented Programming",
        code: "OOP",
        units: [
          {
            number: 1,
            title: "OOP Fundamentals",
            topics: [
              "Classes and Objects",
              "Inheritance",
              "Polymorphism",
              "Encapsulation",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 3,
    name: "Semester 3",
    subjects: [
      {
        name: "Database Management Systems",
        code: "DBMS",
        units: [
          {
            number: 1,
            title: "Database Fundamentals",
            topics: [
              "Introduction to DBMS",
              "ER Model",
              "Relational Model",
              "SQL",
            ],
          },
          {
            number: 2,
            title: "Database Design",
            topics: [
              "Functional Dependencies",
              "Normalization",
              "Transactions",
              "Indexing",
            ],
          },
        ],
      },
      {
        name: "Operating Systems",
        code: "OS",
        units: [
          {
            number: 1,
            title: "Operating System Fundamentals",
            topics: [
              "Introduction to Operating Systems",
              "Processes",
              "Threads",
              "CPU Scheduling",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 4,
    name: "Semester 4",
    subjects: [
      {
        name: "Design and Analysis of Algorithms",
        code: "DAA",
        units: [
          {
            number: 1,
            title: "Algorithm Fundamentals",
            topics: [
              "Complexity Analysis",
              "Asymptotic Notation",
              "Divide and Conquer",
              "Greedy Algorithms",
            ],
          },
        ],
      },
      {
        name: "Artificial Intelligence",
        code: "AI",
        units: [
          {
            number: 1,
            title: "AI Fundamentals",
            topics: [
              "Introduction to AI",
              "Intelligent Agents",
              "Problem Solving",
              "Search Algorithms",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 5,
    name: "Semester 5",
    subjects: [
      {
        name: "Advanced Algorithms",
        code: "AA",
        units: [
          {
            number: 1,
            title: "Advanced Algorithms",
            topics: [
              "Dynamic Programming",
              "Backtracking",
              "Branch and Bound",
              "Graph Algorithms",
            ],
          },
        ],
      },
      {
        name: "Cloud Computing",
        code: "CC",
        units: [
          {
            number: 1,
            title: "Cloud Fundamentals",
            topics: [
              "Cloud Computing Introduction",
              "Service Models",
              "Deployment Models",
              "Virtualization",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 6,
    name: "Semester 6",
    subjects: [
      {
        name: "Software Engineering",
        code: "SE",
        units: [
          {
            number: 1,
            title: "Software Engineering Fundamentals",
            topics: [
              "Introduction to Software Engineering",
              "Software Process",
              "SDLC",
              "Software Development Models",
            ],
          },
          {
            number: 2,
            title: "Requirements Engineering",
            topics: [
              "Requirements Engineering",
              "Functional Requirements",
              "Non Functional Requirements",
              "Requirement Analysis",
            ],
          },
        ],
      },
      {
        name: "Computer Networks",
        code: "CN",
        units: [
          {
            number: 1,
            title: "Network Fundamentals",
            topics: [
              "Introduction to Computer Networks",
              "Network Types",
              "OSI Model",
              "TCP/IP Model",
            ],
          },
          {
            number: 2,
            title: "Network Layer",
            topics: ["IP Addressing", "Subnetting", "Routing", "Network Layer"],
          },
        ],
      },
      {
        name: "Artificial Intelligence",
        code: "AI",
        units: [
          {
            number: 1,
            title: "AI Fundamentals",
            topics: [
              "Introduction to AI",
              "Intelligent Agents",
              "Problem Solving",
              "Search Strategies",
            ],
          },
        ],
      },
      {
        name: "Automata and Language Compilers",
        code: "ALC",
        units: [
          {
            number: 1,
            title: "Automata Theory",
            topics: ["Finite Automata", "DFA", "NFA", "Regular Languages"],
          },
        ],
      },
      {
        name: "Programming Paradigms and Languages",
        code: "PPL",
        units: [
          {
            number: 1,
            title: "Programming Paradigms",
            topics: [
              "Programming Language Concepts",
              "Imperative Programming",
              "Functional Programming",
              "Object Oriented Programming",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 7,
    name: "Semester 7",
    subjects: [
      {
        name: "Distributed Systems",
        code: "DSYS",
        units: [
          {
            number: 1,
            title: "Distributed Systems Fundamentals",
            topics: [
              "Distributed System Concepts",
              "Communication",
              "Synchronization",
              "Distributed Algorithms",
            ],
          },
        ],
      },
      {
        name: "Major Project",
        code: "PROJECT",
        units: [
          {
            number: 1,
            title: "Project Development",
            topics: [
              "Problem Identification",
              "System Design",
              "Implementation",
              "Testing",
            ],
          },
        ],
      },
    ],
  },

  {
    number: 8,
    name: "Semester 8",
    subjects: [
      {
        name: "Major Project",
        code: "PROJECT",
        units: [
          {
            number: 1,
            title: "Final Project",
            topics: [
              "Implementation",
              "Testing",
              "Documentation",
              "Project Presentation",
            ],
          },
        ],
      },
      {
        name: "Placement Preparation",
        code: "PLACEMENT",
        units: [
          {
            number: 1,
            title: "Career Preparation",
            topics: [
              "Resume Preparation",
              "Technical Interviews",
              "Aptitude Preparation",
              "HR Interviews",
            ],
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting academic database seed...");

  for (const semesterDataItem of semesterData) {
    const semester = await prisma.semester.upsert({
      where: {
        number: semesterDataItem.number,
      },
      update: {
        name: semesterDataItem.name,
      },
      create: {
        number: semesterDataItem.number,
        name: semesterDataItem.name,
      },
    });

    for (const subjectData of semesterDataItem.subjects) {
      const slug = createSlug(subjectData.name);

      const subject = await prisma.subject.upsert({
        where: {
          semesterId_slug: {
            semesterId: semester.id,
            slug,
          },
        },
        update: {
          name: subjectData.name,
          code: subjectData.code,
        },
        create: {
          name: subjectData.name,
          slug,
          code: subjectData.code,
          semesterId: semester.id,
        },
      });

      for (const unitData of subjectData.units) {
        const unit = await prisma.unit.upsert({
          where: {
            subjectId_number: {
              subjectId: subject.id,
              number: unitData.number,
            },
          },
          update: {
            title: unitData.title,
          },
          create: {
            number: unitData.number,
            title: unitData.title,
            subjectId: subject.id,
          },
        });

        for (const topicTitle of unitData.topics) {
          await prisma.topic.upsert({
            where: {
              unitId_title: {
                unitId: unit.id,
                title: topicTitle,
              },
            },
            update: {},
            create: {
              title: topicTitle,
              unitId: unit.id,
            },
          });
        }
      }
    }
  }

  console.log("✅ Academic database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
