import { Link } from "lucide-react";

const topics = [
  {
    title: "Arrays",
    description:
      "Master traversal, searching, sorting, and common array patterns.",
    icon: "▦",
  },
  {
    title: "Strings",
    description:
      "Practice string manipulation, patterns, and frequency techniques.",
    icon: "Aa",
  },
  {
    title: "Linked List",
    description:
      "Learn traversal, insertion, deletion, and pointer techniques.",
    icon: "↔",
  },
  {
    title: "Stack",
    description: "Understand LIFO structures and common stack-based problems.",
    icon: "▤",
  },
  {
    title: "Queue",
    description:
      "Practice FIFO structures, dequeues, and queue-based problems.",
    icon: "⇥",
  },
  {
    title: "Binary Search",
    description:
      "Build strong binary search and search-space optimization skills.",
    icon: "⌕",
  },
  {
    title: "Trees",
    description: "Practice traversals, BSTs, recursion, and tree algorithms.",
    icon: "♧",
  },
  {
    title: "Graphs",
    description: "Learn BFS, DFS, shortest paths, and graph traversal.",
    icon: "◇",
  },
  {
    title: "Recursion",
    description: "Develop recursive thinking and solve recursive problems.",
    icon: "↻",
  },
  {
    title: "Backtracking",
    description:
      "Solve constraint-based problems using systematic exploration.",
    icon: "↩",
  },
  {
    title: "Dynamic Programming",
    description: "Learn state transitions, memoization, and optimization.",
    icon: "▥",
  },
  {
    title: "Greedy",
    description: "Understand greedy strategies and optimal local decisions.",
    icon: "◆",
  },
];

export default function DsaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">Problem Solving</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            DSA Practice
          </h1>

          <p className="mt-3 text-lg leading-8 text-slate-600">
            Strengthen your data structures and algorithms skills through
            structured practice and consistent problem solving.
          </p>
        </div>

        {/* Progress */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Overall DSA Progress
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-950">0%</p>

              <p className="mt-2 text-sm text-slate-500">
                Start solving problems to build your progress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:text-right">
              <div>
                <p className="text-sm text-slate-500">Solved</p>
                <p className="mt-1 text-xl font-bold text-slate-950">0</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Total Problems</p>
                <p className="mt-1 text-xl font-bold text-slate-950">0</p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-0 rounded-full bg-blue-600 transition-all" />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              🔥
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Current Streak
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">0 days</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              ✓
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Problems Solved
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
              ★
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Best Streak
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">0 days</p>
          </div>
        </section>

        {/* Topics */}
        <section>
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Learn & Practice
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              DSA Topics
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Build your problem-solving skills topic by topic.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <article
                key={topic.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl font-semibold text-blue-700">
                    {topic.icon}
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    0 solved
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {topic.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {topic.description}
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-0 rounded-full bg-blue-600" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    0% complete
                  </span>

                  <span className="text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
                    Practice →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Placement CTA */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Placement Preparation
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Ready for your next interview?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Combine DSA practice with structured roadmaps and interview
                preparation to become placement-ready.
              </p>
            </div>

            <Link
              href="/interview"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Practice Interview
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
