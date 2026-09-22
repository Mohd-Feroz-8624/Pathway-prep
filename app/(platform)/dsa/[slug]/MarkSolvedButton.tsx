"use client";

import { useState } from "react";

type MarkSolvedButtonProps = {
  questionId: string;
  alreadySolved: boolean;
};

export default function MarkSolvedButton({
  questionId,
  alreadySolved,
}: MarkSolvedButtonProps) {
  const [solved, setSolved] = useState(alreadySolved);
  const [loading, setLoading] = useState(false);

  async function handleMarkSolved() {
    if (solved || loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/dsa/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark problem as solved");
      }

      setSolved(true);
    } catch (error) {
      console.error("Mark solved error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleMarkSolved}
      disabled={solved || loading}
      className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Saving..." : solved ? "✓ Solved" : "✓ Mark as Solved"}
    </button>
  );
}
