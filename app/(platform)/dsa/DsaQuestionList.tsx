"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DsaQuestion = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  topic: string;
};

type DsaQuestionListProps = {
  questions: DsaQuestion[];
};

export default function DsaQuestionList({ questions }: DsaQuestionListProps) {
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const topics = useMemo(
    () => ["All", ...new Set(questions.map((question) => question.topic))],
    [questions],
  );

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesTopic = topic === "All" || question.topic === topic;

      const matchesDifficulty =
        difficulty === "All" || question.difficulty === difficulty;

      return matchesTopic && matchesDifficulty;
    });
  }, [questions, topic, difficulty]);

  return (
    <section>
      <div>
        <p className="text-sm font-semibold text-blue-600">Question Bank</p>

        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          Practice Problems
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Choose a problem and start solving.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
        <div className="flex-1">
          <label
            htmlFor="topic"
            className="text-sm font-semibold text-slate-700"
          >
            Topic
          </label>

          <select
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            {topics.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Topics" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="difficulty"
            className="text-sm font-semibold text-slate-700"
          >
            Difficulty
          </label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            {difficulties.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Difficulties" : item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="mt-5 text-sm font-medium text-slate-500">
        Showing {filteredQuestions.length} of {questions.length} questions
      </p>

      {/* Questions */}
      <div className="mt-4 space-y-4">
        {filteredQuestions.map((question, index) => (
          <article
            key={question.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {question.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {question.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {question.topic}
                    </span>

                    <DifficultyBadge difficulty={question.difficulty} />
                  </div>
                </div>
              </div>

              <Link
                href={`/dsa/${question.slug}`}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Solve
                <span className="ml-2">→</span>
              </Link>
            </div>
          </article>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-950">No questions found</p>

            <p className="mt-2 text-sm text-slate-500">
              Try changing the topic or difficulty filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  if (difficulty === "Easy") {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Easy
      </span>
    );
  }

  if (difficulty === "Medium") {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Medium
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
      Hard
    </span>
  );
}
