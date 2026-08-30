import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

type ResourceSeed = {
  title: string;
  description?: string;
  type: "NOTE" | "PDF" | "VIDEO" | "ARTICLE" | "PRACTICE" | "EXTERNAL";
  url?: string;
};

type TopicSeed = {
  title: string;
};

type UnitSeed = {
  number: number;
  title: string;
  description?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  topics: TopicSeed[];
  resources?: ResourceSeed[];
};

type SubjectSeed = {
  name: string;
  code: string;
  units: UnitSeed[];
};

type SemesterSeed = {
  number: number;
  name: string;
  subjects: SubjectSeed[];
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
type InterviewQuestionSeed = {
  question: string;
  role: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Technical" | "Behavioral" | "Mixed";
  evaluationGuide?: string;
};

const semesterData: SemesterSeed[] = [
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
            description:
              "Learn the fundamental concepts required to understand programming and problem solving.",
            difficulty: "Beginner",
            duration: "5 hours",
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
            description:
              "Learn how conditional statements, loops, nested structures, and pattern-based programming control program execution.",
            difficulty: "Beginner",
            duration: "5 hours",
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
            description:
              "Build a foundation in sets, relations, functions, and mathematical logic used throughout computer science.",
            difficulty: "Beginner",
            duration: "6 hours",
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
            description:
              "Understand number systems, Boolean algebra, logic gates, and the fundamentals of digital circuit design.",
            difficulty: "Beginner",
            duration: "6 hours",
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
            description:
              "Learn how arrays, linked lists, stacks, and queues organize data and support efficient problem solving.",
            difficulty: "Intermediate",
            duration: "7 hours",
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
            description:
              "Understand hierarchical and network-based data structures including trees, binary search trees, and graphs.",
            difficulty: "Intermediate",
            duration: "8 hours",
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
            description:
              "Learn the core principles of object-oriented programming including classes, objects, inheritance, polymorphism, and encapsulation.",
            difficulty: "Intermediate",
            duration: "6 hours",
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
            description:
              "Learn the fundamental concepts of database management systems, data models, ER diagrams, relational databases, and SQL.",
            difficulty: "Intermediate",
            duration: "7 hours",
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
            description:
              "Learn how to design efficient databases using functional dependencies, normalization, transactions, and indexing.",
            difficulty: "Advanced",
            duration: "8 hours",
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
            description:
              "Understand operating system concepts including processes, threads, CPU scheduling, and core system responsibilities.",
            difficulty: "Intermediate",
            duration: "7 hours",
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
            description:
              "Learn algorithm analysis, asymptotic complexity, divide and conquer techniques, and greedy problem-solving strategies.",
            difficulty: "Intermediate",
            duration: "8 hours",
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
            description:
              "Explore the foundations of artificial intelligence, intelligent agents, problem solving, and search algorithms.",
            difficulty: "Intermediate",
            duration: "7 hours",
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
            description:
              "Study advanced algorithmic techniques for solving complex computational problems efficiently.",
            difficulty: "Advanced",
            duration: "8 hours",
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
            description:
              "Understand cloud computing concepts, service models, deployment models, and virtualization technologies.",
            difficulty: "Intermediate",
            duration: "6 hours",
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
            description:
              "Understand software engineering principles, software processes, SDLC, and common software development models.",
            difficulty: "Beginner",
            duration: "6 hours",
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
            description:
              "Learn how software requirements are identified, analyzed, documented, and validated throughout the development process.",
            difficulty: "Intermediate",
            duration: "6 hours",
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
            description:
              "Learn the fundamental concepts of computer networks, network types, communication models, and the OSI and TCP/IP architectures.",
            difficulty: "Beginner",
            duration: "5 hours",

            resources: [
              {
                title: "Computer Networks Complete Notes",
                description:
                  "Complete study material covering the fundamental concepts of computer networks.",
                type: "NOTE",
              },
              {
                title: "Network Fundamentals Revision",
                description:
                  "Quick revision material covering the important concepts of this unit.",
                type: "PDF",
              },
              {
                title: "Network Fundamentals Practice",
                description:
                  "Practice questions to test your understanding of the unit.",
                type: "PRACTICE",
              },
            ],

            topics: [
              { title: "Introduction to Computer Networks" },
              { title: "Network Types" },
              { title: "OSI Model" },
              { title: "TCP/IP Model" },
            ],
          },

          {
            number: 2,
            title: "Network Layer",
            description:
              "Understand IP addressing, subnetting, routing, and the fundamental responsibilities of the network layer.",
            difficulty: "Intermediate",
            duration: "6 hours",

            resources: [
              {
                title: "Network Layer Complete Notes",
                description:
                  "Study material covering IP addressing, subnetting, routing, and network-layer concepts.",
                type: "NOTE",
              },
              {
                title: "Network Layer Practice",
                description:
                  "Practice questions covering IP addressing, subnetting, and routing.",
                type: "PRACTICE",
              },
            ],

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
            description:
              "Learn the fundamental concepts of artificial intelligence, intelligent agents, problem solving, and search strategies.",
            difficulty: "Intermediate",
            duration: "7 hours",
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
            description:
              "Study finite automata, deterministic and nondeterministic machines, and the fundamentals of regular languages.",
            difficulty: "Advanced",
            duration: "7 hours",
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
            description:
              "Explore major programming paradigms and understand the concepts behind imperative, functional, and object-oriented programming.",
            difficulty: "Intermediate",
            duration: "6 hours",
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
            description:
              "Understand the fundamentals of distributed systems, communication, synchronization, and distributed algorithms.",
            difficulty: "Advanced",
            duration: "8 hours",
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
            description:
              "Learn the major stages involved in identifying, designing, implementing, and testing a software project.",
            difficulty: "Advanced",
            duration: "10 hours",
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
            description:
              "Complete the final project through implementation, testing, documentation, and final project presentation.",
            difficulty: "Advanced",
            duration: "12 hours",
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
            description:
              "Prepare for placements through resume building, technical interviews, aptitude practice, and HR interview preparation.",
            difficulty: "Intermediate",
            duration: "10 hours",
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
const interviewQuestions: InterviewQuestionSeed[] = [
  // Software Engineer
  {
    question: "What is the difference between a process and a thread?",
    role: "Software Engineer",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "Look for a clear explanation of process isolation, shared memory, resource usage, and execution context.",
  },
  {
    question: "What is the difference between a stack and a queue?",
    role: "Software Engineer",
    difficulty: "Intermediate",
    type: "Technical",
    evaluationGuide:
      "Look for understanding of LIFO and FIFO behavior and appropriate examples.",
  },
  {
    question: "What is time complexity and why is it important?",
    role: "Software Engineer",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "The candidate should explain algorithm efficiency and Big O notation with a simple example.",
  },
  {
    question: "Explain the principles of object-oriented programming.",
    role: "Software Engineer",
    difficulty: "Intermediate",
    type: "Technical",
    evaluationGuide:
      "Look for understanding of encapsulation, inheritance, polymorphism, and abstraction.",
  },
  {
    question: "What is the difference between abstraction and encapsulation?",
    role: "Software Engineer",
    difficulty: "Intermediate",
    type: "Technical",
    evaluationGuide:
      "Look for a clear distinction between hiding implementation details through abstraction and restricting access to internal state through encapsulation.",
  },

  // Frontend Developer
  {
    question: "What is the difference between state and props in React?",
    role: "Frontend Developer",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "The candidate should explain that props are passed into components while state is managed by the component or related state system.",
  },
  {
    question: "What is the Virtual DOM in React?",
    role: "Frontend Developer",
    difficulty: "Intermediate",
    type: "Technical",
    evaluationGuide:
      "Look for an explanation of React's representation of the UI and how updates are reconciled efficiently.",
  },
  {
    question: "How would you improve the performance of a React application?",
    role: "Frontend Developer",
    difficulty: "Advanced",
    type: "Technical",
    evaluationGuide:
      "Good answers may include memoization, code splitting, lazy loading, efficient rendering, caching, and avoiding unnecessary re-renders.",
  },

  // Backend Developer
  {
    question: "What is a REST API?",
    role: "Backend Developer",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "Look for understanding of resources, HTTP methods, stateless communication, and API endpoints.",
  },
  {
    question:
      "What is the difference between authentication and authorization?",
    role: "Backend Developer",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "Authentication verifies identity, while authorization determines what an authenticated user can access.",
  },
  {
    question: "How would you design a scalable backend API?",
    role: "Backend Developer",
    difficulty: "Advanced",
    type: "Technical",
    evaluationGuide:
      "Look for discussion of database design, caching, load balancing, stateless services, monitoring, rate limiting, and horizontal scaling.",
  },

  // Full Stack Developer
  {
    question:
      "Explain how a request travels from a browser to a backend server and back.",
    role: "Full Stack Developer",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "Look for understanding of browser requests, HTTP, server routing, backend processing, database interaction, and the response.",
  },
  {
    question: "How would you secure a full-stack web application?",
    role: "Full Stack Developer",
    difficulty: "Intermediate",
    type: "Technical",
    evaluationGuide:
      "Good answers may include authentication, authorization, input validation, HTTPS, secure cookies, CSRF protection, rate limiting, and secure secrets management.",
  },
  {
    question:
      "How would you design a full-stack application that needs to handle a large number of users?",
    role: "Full Stack Developer",
    difficulty: "Advanced",
    type: "Technical",
    evaluationGuide:
      "Look for scalable architecture, caching, database optimization, horizontal scaling, CDN usage, queues, monitoring, and fault tolerance.",
  },

  // SDE
  {
    question: "How would you find a duplicate element in an array?",
    role: "SDE",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "The candidate should discuss at least one valid approach and its time and space complexity.",
  },
  {
    question: "What is the difference between an array and a linked list?",
    role: "SDE",
    difficulty: "Beginner",
    type: "Technical",
    evaluationGuide:
      "Look for comparison of memory layout, random access, insertion/deletion, and complexity.",
  },
  {
    question: "Explain how you would approach solving a new DSA problem.",
    role: "SDE",
    difficulty: "Intermediate",
    type: "Technical",
    evaluationGuide:
      "Look for problem understanding, constraints, examples, brute force, optimization, complexity analysis, and testing.",
  },

  // Behavioral
  {
    question: "Tell me about yourself.",
    role: "Software Engineer",
    difficulty: "Beginner",
    type: "Behavioral",
    evaluationGuide:
      "Look for a concise professional introduction covering education, relevant skills, projects, experience, and career goals.",
  },
  {
    question:
      "Tell me about a challenging project you worked on and how you solved the problem.",
    role: "Software Engineer",
    difficulty: "Intermediate",
    type: "Behavioral",
    evaluationGuide:
      "Look for a structured explanation of the situation, challenge, actions taken, technical decisions, and outcome.",
  },
  {
    question: "Why should we hire you?",
    role: "Software Engineer",
    difficulty: "Intermediate",
    type: "Behavioral",
    evaluationGuide:
      "Look for a confident answer connecting the candidate's skills, experience, projects, and value to the role.",
  },
];
type DSAQuestionSeed = {
  title: string;
  slug: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  constraints?: string;
  examples?: string;
  solution?: string;
};
const dsaQuestions: DSAQuestionSeed[] = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description:
      "Given an array of integers and a target value, return the indices of the two numbers that add up to the target.",
    difficulty: "Easy",
    topic: "Arrays",
    constraints:
      "Each input has exactly one solution. You may not use the same element twice.",
    examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    solution:
      "Use a hash map to store previously seen values and their indices. For each number, check whether target - number already exists.",
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    description:
      "Given two strings, determine whether they are anagrams of each other.",
    difficulty: "Easy",
    topic: "Strings",
    constraints: "The strings contain lowercase English letters.",
    examples: "Input: s = 'anagram', t = 'nagaram'\nOutput: true",
    solution:
      "Count the frequency of each character in both strings and compare the frequencies.",
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    description:
      "Given an integer array, determine whether any value appears at least twice.",
    difficulty: "Easy",
    topic: "Hashing",
    constraints: "The array may contain positive, negative, and zero values.",
    examples: "Input: nums = [1,2,3,1]\nOutput: true",
    solution:
      "Use a hash set. If a number is already present in the set, a duplicate exists.",
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description:
      "Given an array where prices[i] represents the price of a stock on day i, find the maximum profit from buying and selling once.",
    difficulty: "Easy",
    topic: "Arrays",
    constraints: "You must buy before selling.",
    examples: "Input: prices = [7,1,5,3,6,4]\nOutput: 5",
    solution:
      "Track the minimum price seen so far and calculate the maximum profit at each position.",
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description:
      "Given a string containing brackets, determine whether every opening bracket has the correct closing bracket.",
    difficulty: "Easy",
    topic: "Stack",
    constraints: "The input contains only parentheses, brackets, and braces.",
    examples: "Input: s = '()[]{}'\nOutput: true",
    solution:
      "Use a stack. Push opening brackets and verify each closing bracket matches the most recent opening bracket.",
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    description:
      "Given a sorted array and a target value, return the index of the target or -1 if it does not exist.",
    difficulty: "Easy",
    topic: "Binary Search",
    constraints: "The array is sorted in ascending order.",
    examples: "Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4",
    solution:
      "Use two pointers representing the search range and repeatedly check the middle element.",
  },
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    description:
      "Given the head of a singly linked list, reverse the list and return the new head.",
    difficulty: "Medium",
    topic: "Linked List",
    constraints: "The linked list may contain zero or more nodes.",
    examples: "Input: 1 -> 2 -> 3 -> 4 -> 5\nOutput: 5 -> 4 -> 3 -> 2 -> 1",
    solution:
      "Iterate through the list while maintaining previous, current, and next pointers.",
  },
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    description: "Given the root of a binary tree, return its maximum depth.",
    difficulty: "Easy",
    topic: "Trees",
    constraints: "The number of nodes can vary from zero to many nodes.",
    examples: "Input: root = [3,9,20,null,null,15,7]\nOutput: 3",
    solution:
      "Use recursion: the depth of a node is one plus the maximum depth of its left and right subtrees.",
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description:
      "You can climb either one or two steps at a time. Calculate the number of distinct ways to reach the top of a staircase with n steps.",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    constraints: "1 <= n <= 45",
    examples: "Input: n = 3\nOutput: 3",
    solution:
      "Use dynamic programming. The number of ways to reach step n is the sum of the ways to reach n-1 and n-2.",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    description:
      "Given a string, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    topic: "Sliding Window",
    constraints: "The string may contain letters, digits, symbols, and spaces.",
    examples: "Input: s = 'abcabcbb'\nOutput: 3",
    solution:
      "Use a sliding window with a hash set or map to maintain the current substring without duplicate characters.",
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
      const subject = await prisma.subject.upsert({
        where: {
          semesterId_slug: {
            semesterId: semester.id,
            slug: createSlug(subjectData.name),
          },
        },

        update: {
          name: subjectData.name,
          code: subjectData.code,
        },

        create: {
          name: subjectData.name,
          code: subjectData.code,
          slug: createSlug(subjectData.name),
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
            description: unitData.description,
            difficulty: unitData.difficulty,
            duration: unitData.duration,
          },

          create: {
            number: unitData.number,
            title: unitData.title,
            description: unitData.description,
            difficulty: unitData.difficulty,
            duration: unitData.duration,
            subjectId: subject.id,
          },
        });

        /*
         * Keep topics in the database.
         *
         * Topics are currently an internal academic structure.
         * They are not the primary student-facing navigation.
         */
        for (const topicData of unitData.topics) {
          await prisma.topic.upsert({
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
        }

        /*
         * Seed unit-level resources.
         *
         * URLs are optional because actual resources
         * are not available yet.
         */
        if (unitData.resources) {
          for (const resourceData of unitData.resources) {
            const existingResource = await prisma.unitResource.findFirst({
              where: {
                unitId: unit.id,
                title: resourceData.title,
              },
            });

            if (existingResource) {
              await prisma.unitResource.update({
                where: {
                  id: existingResource.id,
                },

                data: {
                  title: resourceData.title,
                  description: resourceData.description,
                  type: resourceData.type,
                  url: resourceData.url,
                },
              });
            } else {
              await prisma.unitResource.create({
                data: {
                  title: resourceData.title,
                  description: resourceData.description,
                  type: resourceData.type,
                  url: resourceData.url,
                  unitId: unit.id,
                },
              });
            }
          }
        }
      }
    }
  }
  // Seed resume templates
  const resumeTemplates = [
    {
      name: "Classic",
      slug: "classic",
      description: "A clean, ATS-friendly classic resume template.",
      isPublished: true,
    },
    {
      name: "Modern",
      slug: "modern",
      description:
        "A modern professional resume template for students and graduates.",
      isPublished: true,
    },
  ];

  for (const template of resumeTemplates) {
    await prisma.resumeTemplate.upsert({
      where: {
        slug: template.slug,
      },

      update: {
        name: template.name,
        description: template.description,
        isPublished: template.isPublished,
      },

      create: {
        name: template.name,
        slug: template.slug,
        description: template.description,
        isPublished: template.isPublished,
      },
    });
  }
  // Seed interview questions
  for (const questionData of interviewQuestions) {
    const existingQuestion = await prisma.interviewQuestion.findFirst({
      where: {
        question: questionData.question,
        role: questionData.role,
      },
    });

    if (existingQuestion) {
      await prisma.interviewQuestion.update({
        where: {
          id: existingQuestion.id,
        },
        data: {
          difficulty: questionData.difficulty,
          type: questionData.type,
          evaluationGuide: questionData.evaluationGuide,
          isActive: true,
        },
      });
    } else {
      await prisma.interviewQuestion.create({
        data: {
          question: questionData.question,
          role: questionData.role,
          difficulty: questionData.difficulty,
          type: questionData.type,
          evaluationGuide: questionData.evaluationGuide,
          isActive: true,
        },
      });
    }
  }
  // Seed DSA questions
  for (const questionData of dsaQuestions) {
    await prisma.dSAQuestion.upsert({
      where: {
        slug: questionData.slug,
      },

      update: {
        title: questionData.title,
        description: questionData.description,
        difficulty: questionData.difficulty,
        topic: questionData.topic,
        constraints: questionData.constraints,
        examples: questionData.examples,
        solution: questionData.solution,
      },

      create: {
        title: questionData.title,
        slug: questionData.slug,
        description: questionData.description,
        difficulty: questionData.difficulty,
        topic: questionData.topic,
        constraints: questionData.constraints,
        examples: questionData.examples,
        solution: questionData.solution,
      },
    });
  }

  console.log("✅ DSA questions seeded successfully.");
  console.log("✅ Interview questions seeded successfully.");

  console.log("✅ Resume templates seeded successfully.");
  console.log("✅ Academic database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Academic database seed failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
