"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateResumeButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setError("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
      });

      const text = await response.text();

      console.log("CREATE RESUME STATUS:", response.status);
      console.log("CREATE RESUME RESPONSE:", text);

      if (!response.ok) {
        setError(`Failed to create resume (${response.status})`);
        return;
      }

      const data = JSON.parse(text);

      router.push(`/resume/${data.data.id}`);

      
    } catch (error) {
      console.error("Create resume error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCreate}
        disabled={isCreating}
        className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreating ? "Creating..." : "+ Create Resume"}
      </button>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
