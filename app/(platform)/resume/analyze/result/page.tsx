"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "lucide-react";

type AnalysisResult = {
  id: string;
  targetRole: string;
  overallScore: number;
  completenessScore: number;
  keywordScore: number;
  experienceScore: number;
  atsStructureScore: number;
  impactScore: number;
  readabilityScore: number;
  strengths: string | null;
  weaknesses: string | null;
  missingKeywords: string | null;
  recommendations: string | null;
  uploadedResume: {
    fileName: string;
    fileType: string;
  };
};

type ScoreItem = {
  label: string;
  score: number;
  icon: string;
};

export default function ResumeAnalysisResultPage() {
  const searchParams = useSearchParams();

  const analysisId = searchParams.get("analysisId");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!analysisId) {
      
      return;
    }

    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/resumes/analyze/${analysisId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load analysis.");
        }

        setResult(data.data);
      } catch (error) {
        console.error("Failed to load analysis:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load analysis.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalysis();
  }, [analysisId]);

  function getScoreLabel(score: number) {
    if (score >= 80) {
      return "Excellent";
    }

    if (score >= 65) {
      return "Strong";
    }

    if (score >= 50) {
      return "Needs Improvement";
    }

    return "Needs Attention";
  }

  function getScoreWidth(score: number) {
    return `${Math.min(Math.max(score, 0), 100)}%`;
  }

  const scoreItems: ScoreItem[] = result
    ? [
        {
          label: "Completeness",
          score: result.completenessScore,
          icon: "📋",
        },
        {
          label: "Keywords",
          score: result.keywordScore,
          icon: "🔑",
        },
        {
          label: "Experience",
          score: result.experienceScore,
          icon: "💼",
        },
        {
          label: "ATS Structure",
          score: result.atsStructureScore,
          icon: "🤖",
        },
        {
          label: "Impact",
          score: result.impactScore,
          icon: "🚀",
        },
        {
          label: "Readability",
          score: result.readabilityScore,
          icon: "📖",
        },
      ]
    : [];

  const keywords = result?.missingKeywords
    ? result.missingKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />

            <p className="mt-5 text-sm font-medium text-slate-500">
              Loading your ATS analysis...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-950">
              Unable to Load Analysis
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error || "The requested resume analysis could not be found."}
            </p>

            <Link
              href="/resume"
              className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Resume Analyzer
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-blue-600">Resume Analyzer</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            ATS Analysis Report
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {result.uploadedResume.fileName} · {result.targetRole}
          </p>
        </div>

        {/* Overall Score */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-14 border-blue-100">
                <div className="text-center">
                  <p className="text-6xl font-bold text-slate-950">
                    {result.overallScore}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    OUT OF 100
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall ATS Score
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                {getScoreLabel(result.overallScore)} ATS Profile
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Your resume was evaluated for the{" "}
                <span className="font-semibold text-slate-700">
                  {result.targetRole}
                </span>{" "}
                role using ATS structure, keyword relevance, experience, impact,
                completeness, and readability.
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  What does this mean?
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {result.overallScore >= 80
                    ? "Your resume is well optimized for ATS systems. Focus on maintaining strong keyword relevance and measurable achievements."
                    : result.overallScore >= 65
                      ? "Your resume has a solid foundation, but targeted improvements can increase its chances of passing ATS screening."
                      : result.overallScore >= 50
                        ? "Your resume needs several improvements before it is strongly optimized for ATS screening."
                        : "Your resume needs significant optimization in structure, content, and keyword relevance."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Score Breakdown */}
        <section className="mt-8">
          <p className="text-sm font-semibold text-blue-600">Performance</p>

          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Score Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See how your resume performed across different ATS criteria.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoreItems.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </p>

                      <p className="text-xs text-slate-400">
                        {getScoreLabel(item.score)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xl font-bold text-slate-950">
                    {item.score}
                  </p>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: getScoreWidth(item.score),
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>0</span>
                  <span>100</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Strengths and Weaknesses */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                💪
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  What you&apos;re doing well
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Strengths
                </h2>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600">
              {result.strengths || "No specific strengths identified."}
            </p>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                ⚠️
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Areas to improve
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Weaknesses
                </h2>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600">
              {result.weaknesses || "No major weaknesses identified."}
            </p>
          </article>
        </section>

        {/* Missing Keywords */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              🔑
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Keyword Optimization
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Missing Keywords
              </h2>
            </div>
          </div>

          {keywords.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No missing keywords were identified for this role.
            </p>
          )}
        </section>

        {/* Recommendations */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
              📈
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Action Plan
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Recommendations
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {result.recommendations || "No recommendations were generated."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
