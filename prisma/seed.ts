import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type NoteSeed = {
  title: string;
  description?: string;
  fileUrl?: string;
};

type TopicSeed = {
  title: string;
  notes?: NoteSeed[];
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const semesterData: {
  number: number;
  name: string;
  subjects: {
    name: string;
    code: string;
    units: {
      number: number;
      title: string;
      topics: TopicSeed[];
    }[];
  }[];
}[] = [
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
              { title: "Introduction to Programming" },
              { title: "Algorithms and Flowcharts" },
              { title: "Variables and Data Types" },
              { title: "Operators and Expressions" },
            ],
          },
          {
            number: 2,
            title: "Control Structures",
            topics: [
              { title: "Conditional Statements" },
              { title: "Loops" },
              { title: "Nested Loops" },
              { title: "Pattern Programming" },
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
            topics: [
              { title: "Sets" },
              { title: "Relations" },
              { title: "Functions" },
              { title: "Logic" },
            ],
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
              { title: "Number Systems" },
              { title: "Boolean Algebra" },
              { title: "Logic Gates" },
              { title: "Combinational Circuits" },
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
            topics: [
              { title: "Arrays" },
              { title: "Linked Lists" },
              { title: "Stacks" },
              { title: "Queues" },
            ],
          },
          {
            number: 2,
            title: "Non-Linear Data Structures",
            topics: [
              { title: "Trees" },
              { title: "Binary Trees" },
              { title: "Binary Search Trees" },
              { title: "Graphs" },
            ],
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
              { title: "Classes and Objects" },
              { title: "Inheritance" },
              { title: "Polymorphism" },
              { title: "Encapsulation" },
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
              { title: "Introduction to DBMS" },
              { title: "ER Model" },
              { title: "Relational Model" },
              { title: "SQL" },
            ],
          },
          {
            number: 2,
            title: "Database Design",
            topics: [
              { title: "Functional Dependencies" },
              { title: "Normalization" },
              { title: "Transactions" },
              { title: "Indexing" },
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
              { title: "Introduction to Operating Systems" },
              { title: "Processes" },
              { title: "Threads" },
              { title: "CPU Scheduling" },
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
              { title: "Complexity Analysis" },
              { title: "Asymptotic Notation" },
              { title: "Divide and Conquer" },
              { title: "Greedy Algorithms" },
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
              { title: "Introduction to AI" },
              { title: "Intelligent Agents" },
              { title: "Problem Solving" },
              { title: "Search Algorithms" },
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
              { title: "Dynamic Programming" },
              { title: "Backtracking" },
              { title: "Branch and Bound" },
              { title: "Graph Algorithms" },
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
              { title: "Cloud Computing Introduction" },
              { title: "Service Models" },
              { title: "Deployment Models" },
              { title: "Virtualization" },
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
              { title: "Introduction to Software Engineering" },
              { title: "Software Process" },
              { title: "SDLC" },
              { title: "Software Development Models" },
            ],
          },
          {
            number: 2,
            title: "Requirements Engineering",
            topics: [
              { title: "Requirements Engineering" },
              { title: "Functional Requirements" },
              { title: "Non Functional Requirements" },
              { title: "Requirement Analysis" },
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
              {
                title: "Introduction to Computer Networks",
                notes: [
                  {
                    title: "Computer Networks Introduction",
                    description:
                      "Basic concepts, characteristics, applications, and components of computer networks.",
                  },
                ],
              },
              {
                title: "Network Types",
                notes: [
                  {
                    title: "Network Types Notes",
                    description:
                      "Study material covering LAN, MAN, WAN, PAN, and other network types.",
                  },
                ],
              },
              {
                title: "OSI Model",
                notes: [
                  {
                    title: "OSI Model Notes",
                    description:
                      "Detailed overview of the seven layers of the OSI reference model.",
                  },
                ],
              },
              {
                title: "TCP/IP Model",
                notes: [
                  {
                    title: "TCP/IP Model Notes",
                    description:
                      "Overview of the TCP/IP architecture, layers, and protocols.",
                  },
                ],
              },
            ],
          },
          {
            number: 2,
            title: "Network Layer",
            topics: [
              { title: "IP Addressing" },
              { title: "Subnetting" },
              { title: "Routing" },
              { title: "Network Layer" },
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
              { title: "Introduction to AI" },
              { title: "Intelligent Agents" },
              { title: "Problem Solving" },
              { title: "Search Strategies" },
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
            topics: [
              { title: "Finite Automata" },
              { title: "DFA" },
              { title: "NFA" },
              { title: "Regular Languages" },
            ],
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
              { title: "Programming Language Concepts" },
              { title: "Imperative Programming" },
              { title: "Functional Programming" },
              { title: "Object Oriented Programming" },
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
              { title: "Distributed System Concepts" },
              { title: "Communication" },
              { title: "Synchronization" },
              { title: "Distributed Algorithms" },
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
              { title: "Problem Identification" },
              { title: "System Design" },
              { title: "Implementation" },
              { title: "Testing" },
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
              { title: "Implementation" },
              { title: "Testing" },
              { title: "Documentation" },
              { title: "Project Presentation" },
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
              { title: "Resume Preparation" },
              { title: "Technical Interviews" },
              { title: "Aptitude Preparation" },
              { title: "HR Interviews" },
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

        for (const topicData of unitData.topics) {
          const topic = await prisma.topic.upsert({
            where: {
              unitId_title: {
                unitId: unit.id,
                title: topicData.title,
              },
            },
            update: {},
            create: {
              title: topicData.title,
              unitId: unit.id,
            },
          });

          if (topicData.notes) {
            for (const noteData of topicData.notes) {
              await prisma.note.upsert({
                where: {
                  id: `${topic.id}-${createSlug(noteData.title)}`,
                },
                update: {
                  title: noteData.title,
                  description: noteData.description,
                  fileUrl: noteData.fileUrl,
                },
                create: {
                  id: `${topic.id}-${createSlug(noteData.title)}`,
                  title: noteData.title,
                  description: noteData.description,
                  fileUrl: noteData.fileUrl,
                  topicId: topic.id,
                },
              });
            }
          }
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
