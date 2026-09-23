"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  questionId: string;
  isPublished: boolean;
};

export default function PublishDSAQuestionButton({
  questionId,
  isPublished,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/dsa/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update question.");
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update question.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isPublished
          ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {loading ? "Updating..." : isPublished ? "Unpublish" : "Publish"}
    </button>
  );
}
